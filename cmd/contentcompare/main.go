// Command contentcompare is a local-only dev server used by
// scripts/compare-content-api.mjs to exercise the Go content/admin HTTP
// handlers over the committed static seed (no MySQL required). It serves the
// same routes as api/content/index.go and api/admin/content/index.go using the
// real handlers, with in-memory stores built from the same course snapshot that
// seeds the database, so TS and Go responses can be diffed side by side.
package main

import (
	"context"
	"encoding/json"
	"errors"
	"flag"
	"log"
	"net/http"
	"os"
	"strings"

	contentapi "en-fr-chinese-entry-mvp/api/content"
	"en-fr-chinese-entry-mvp/pkg/adminhttp"
	"en-fr-chinese-entry-mvp/pkg/adminrepo"
	"en-fr-chinese-entry-mvp/pkg/auth"
	"en-fr-chinese-entry-mvp/pkg/contentstore"
	"en-fr-chinese-entry-mvp/pkg/httpx"
	"en-fr-chinese-entry-mvp/pkg/seedgen"
)

// inMemoryStore implements the public content store from the committed seed
// snapshot, mirroring what ListPublishedCourseModules would return from MySQL.
type inMemoryStore struct {
	rows []contentstore.PublishedModuleRow
}

func (s *inMemoryStore) ListPublishedCourseModules() ([]contentstore.PublishedModuleRow, error) {
	return s.rows, nil
}

func (s *inMemoryStore) ListPublishedLessonModules(lessonID string) ([]contentstore.PublishedModuleRow, error) {
	var filtered []contentstore.PublishedModuleRow
	for _, row := range s.rows {
		if row.LessonID == lessonID {
			filtered = append(filtered, row)
		}
	}
	return filtered, nil
}

// inMemoryAdminStore implements contentstore.AdminStore from the same seed
// snapshot. Read paths power the admin GET endpoints; write paths are rejected
// because this is a read-only comparison server.
type inMemoryAdminStore struct {
	rows    []contentstore.CurrentModuleState
	history map[string][]contentstore.PublishedModuleHistoryEntry
}

func (s *inMemoryAdminStore) ListCurrentModuleStates(context.Context) ([]contentstore.CurrentModuleState, error) {
	return s.rows, nil
}

func (s *inMemoryAdminStore) ListCurrentLessonModuleStates(_ context.Context, lessonID string) ([]contentstore.CurrentModuleState, error) {
	var filtered []contentstore.CurrentModuleState
	for _, row := range s.rows {
		if row.LessonID == lessonID {
			filtered = append(filtered, row)
		}
	}
	return filtered, nil
}

func (s *inMemoryAdminStore) GetCurrentModuleState(_ context.Context, lessonID, moduleType string) (*contentstore.CurrentModuleState, error) {
	for i := range s.rows {
		if s.rows[i].LessonID == lessonID && s.rows[i].ModuleType == moduleType {
			row := s.rows[i]
			return &row, nil
		}
	}
	return nil, nil
}

func (s *inMemoryAdminStore) ListPublishedModuleHistory(_ context.Context, lessonID, moduleType string) ([]contentstore.PublishedModuleHistoryEntry, error) {
	return s.history[historyKey(lessonID, moduleType)], nil
}

func (s *inMemoryAdminStore) InsertModuleRevision(context.Context, contentstore.InsertModuleRevisionInput) (contentstore.InsertedModuleRevision, error) {
	return contentstore.InsertedModuleRevision{}, errors.New("contentcompare: read-only server")
}

func (s *inMemoryAdminStore) UpdateCurrentModuleState(context.Context, contentstore.ContentModuleRevisionRow) error {
	return errors.New("contentcompare: read-only server")
}

func (s *inMemoryAdminStore) RunInTransaction(context.Context, func(contentstore.AdminStore) error) error {
	return errors.New("contentcompare: read-only server")
}

func historyKey(lessonID, moduleType string) string {
	return lessonID + "|" + moduleType
}

// buildPublicRows converts the seed snapshot into published module rows.
func buildPublicRows(snap *seedgen.CourseSnapshot) []contentstore.PublishedModuleRow {
	seed := seedgen.CreateInitialContentSeed(snap)
	var rows []contentstore.PublishedModuleRow
	for _, lm := range seed.LessonModules {
		published := revisionByID(seed, lm.LessonID, lm.ModuleType, lm.CurrentPublishedRevisionID)
		rows = append(rows, contentstore.PublishedModuleRow{
			LessonID:     lm.LessonID,
			Slug:         lessonByID(seed, lm.LessonID).Slug,
			DisplayOrder: lessonByID(seed, lm.LessonID).DisplayOrder,
			Enabled:      lessonByID(seed, lm.LessonID).Enabled,
			ModuleType:   lm.ModuleType,
			RevisionID:   lm.CurrentPublishedRevisionID,
			Payload:      json.RawMessage(published.Payload),
		})
	}
	return rows
}

func buildAdminStore(snap *seedgen.CourseSnapshot) *inMemoryAdminStore {
	seed := seedgen.CreateInitialContentSeed(snap)
	var rows []contentstore.CurrentModuleState
	history := map[string][]contentstore.PublishedModuleHistoryEntry{}

	for _, lm := range seed.LessonModules {
		lesson := lessonByID(seed, lm.LessonID)
		published := revisionByID(seed, lm.LessonID, lm.ModuleType, lm.CurrentPublishedRevisionID)
		draft := revisionByID(seed, lm.LessonID, lm.ModuleType, lm.CurrentDraftRevisionID)

		draftSource := published.RevisionID
		note := published.Note
		rows = append(rows, contentstore.CurrentModuleState{
			LessonID:                  lm.LessonID,
			Slug:                      lesson.Slug,
			DisplayOrder:              lesson.DisplayOrder,
			Enabled:                   lesson.Enabled,
			ModuleType:                lm.ModuleType,
			DraftRevisionID:           lm.CurrentDraftRevisionID,
			DraftPayload:              json.RawMessage(draft.Payload),
			DraftCreatedAt:            draft.CreatedAt,
			DraftCreatedBy:            draft.CreatedBy,
			DraftNote:                 &note,
			DraftSourceRevisionID:     &draftSource,
			PublishedRevisionID:       lm.CurrentPublishedRevisionID,
			PublishedPayload:          json.RawMessage(published.Payload),
			PublishedCreatedAt:        published.CreatedAt,
			PublishedCreatedBy:        published.CreatedBy,
			PublishedNote:             &note,
			PublishedSourceRevisionID: nil,
		})
		history[historyKey(lm.LessonID, lm.ModuleType)] = []contentstore.PublishedModuleHistoryEntry{{
			LessonID:         lm.LessonID,
			ModuleType:       lm.ModuleType,
			RevisionID:       published.RevisionID,
			Payload:          json.RawMessage(published.Payload),
			CreatedAt:        published.CreatedAt,
			CreatedBy:        published.CreatedBy,
			Note:             &note,
			SourceRevisionID: nil,
		}}
	}
	return &inMemoryAdminStore{rows: rows, history: history}
}

func revisionByID(seed seedgen.Seed, lessonID, moduleType string, revisionID int64) seedgen.ModuleRevisionSeedRow {
	for _, rev := range seed.Revisions {
		if rev.RevisionID == revisionID && rev.LessonID == lessonID && rev.ModuleType == moduleType {
			return rev
		}
	}
	return seedgen.ModuleRevisionSeedRow{}
}

func lessonByID(seed seedgen.Seed, lessonID string) seedgen.LessonSeedRow {
	for _, lesson := range seed.Lessons {
		if lesson.LessonID == lessonID {
			return lesson
		}
	}
	return seedgen.LessonSeedRow{}
}

func loadSnapshot(path string) (*seedgen.CourseSnapshot, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	var snap seedgen.CourseSnapshot
	if err := json.Unmarshal(raw, &snap); err != nil {
		return nil, err
	}
	return &snap, nil
}

func main() {
	port := flag.String("port", "8790", "listen port")
	courseJSON := flag.String("course-json", "pkg/seedgen/data/course.json", "path to course snapshot JSON")
	adminUser := flag.String("admin-user", "admin", "admin basic auth username")
	adminPass := flag.String("admin-pass", "secret", "admin basic auth password")
	flag.Parse()

	snap, err := loadSnapshot(*courseJSON)
	if err != nil {
		log.Fatalf("load course snapshot: %v", err)
	}

	publicStore := &inMemoryStore{rows: buildPublicRows(snap)}
	adminHTTP := adminhttp.New(adminrepo.New(buildAdminStore(snap)), auth.Env{
		ContentAdminUsername: *adminUser,
		ContentAdminPassword: *adminPass,
	})

	root := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch strings.TrimSuffix(r.URL.Path, "/") {
		case "/api/content/course":
			contentapi.NewCourseHandler(publicStore).ServeHTTP(w, r)
		case "/api/content/lessons":
			contentapi.NewLessonHandler(publicStore).ServeHTTP(w, r)
		case "/api/content/pinyin/course":
			contentapi.NewPinyinCourseHandler().ServeHTTP(w, r)
		default:
			if strings.HasPrefix(strings.TrimSuffix(r.URL.Path, "/"), "/api/admin/content") {
				adminHTTP.ServeHTTP(w, r)
				return
			}
			_ = httpx.WriteError(w, http.StatusNotFound, "Not found")
		}
	})

	log.Printf("contentcompare listening on :%s (course json %s)", *port, *courseJSON)
	if err := http.ListenAndServe("127.0.0.1:"+*port, root); err != nil {
		log.Fatal(err)
	}
}
