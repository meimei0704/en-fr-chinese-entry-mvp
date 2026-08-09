package adminrepo

import (
	"context"
	"errors"
	"fmt"
	"testing"

	"en-fr-chinese-entry-mvp/pkg/contentstore"
)

var lessonMetaPayload = []byte(`{"id":"self-intro","title":{"en":"Intro","fr":"Intro"},"scenario":{"en":"Scenario","fr":"Scénario"}}`)
var dialoguePayload = []byte(`{"title":{"en":"Dialogue","fr":"Dialogue"},"lines":[]}`)
var sentencePatternsPayload = []byte(`[]`)
var vocabularyPayload = []byte(`[]`)
var practicePayload = []byte(`{"listening":[],"speaking":[],"reading":[]}`)
var reviewCardsPayload = []byte(`[]`)

func initialCurrentStates() []contentstore.CurrentModuleState {
	rows := []contentstore.CurrentModuleState{}
	next := int64(100)
	for _, mt := range contentModuleTypes {
		publishedID := next
		next++
		draftID := next
		next++
		var payload []byte
		switch mt {
		case "lessonMeta":
			payload = lessonMetaPayload
		case "dialogue":
			payload = dialoguePayload
		case "sentencePatterns":
			payload = sentencePatternsPayload
		case "vocabulary":
			payload = vocabularyPayload
		case "practice":
			payload = practicePayload
		case "reviewCards":
			payload = reviewCardsPayload
		}
		rows = append(rows, contentstore.CurrentModuleState{
			LessonID:              "self-intro",
			Slug:                  "self-intro",
			DisplayOrder:          1,
			Enabled:               true,
			ModuleType:            mt,
			DraftRevisionID:       draftID,
			DraftPayload:          payload,
			DraftCreatedAt:        "2026-07-28T00:00:00.000Z",
			DraftCreatedBy:        "seed:static-content",
			DraftNote:             strPtr("Initial draft baseline"),
			DraftSourceRevisionID: &publishedID,
			PublishedRevisionID:   publishedID,
			PublishedPayload:      payload,
			PublishedCreatedAt:    "2026-07-28T00:00:00.000Z",
			PublishedCreatedBy:    "seed:static-content",
			PublishedNote:         strPtr("Initial published baseline"),
		})
	}
	return rows
}

func strPtr(s string) *string { return &s }

func intPtr(v int64) *int64 { return &v }

type inMemoryAdminStore struct {
	statesByModule map[string]*contentstore.CurrentModuleState
	history        map[string][]contentstore.PublishedModuleHistoryEntry
	nextRevision   int64
}

func historyKey(lessonID, moduleType string) string { return lessonID + ":" + moduleType }

func newInMemoryAdminStore() *inMemoryAdminStore {
	s := &inMemoryAdminStore{
		statesByModule: map[string]*contentstore.CurrentModuleState{},
		history:        map[string][]contentstore.PublishedModuleHistoryEntry{},
		nextRevision:   500,
	}
	for _, row := range initialCurrentStates() {
		clone := row
		s.statesByModule[historyKey(row.LessonID, row.ModuleType)] = &clone
		s.history[historyKey(row.LessonID, row.ModuleType)] = []contentstore.PublishedModuleHistoryEntry{
			{
				LessonID:         row.LessonID,
				ModuleType:       row.ModuleType,
				RevisionID:       row.PublishedRevisionID,
				Payload:          row.PublishedPayload,
				CreatedAt:        row.PublishedCreatedAt,
				CreatedBy:        row.PublishedCreatedBy,
				Note:             row.PublishedNote,
				SourceRevisionID: nil,
			},
		}
	}
	return s
}

func (s *inMemoryAdminStore) currentStates() []contentstore.CurrentModuleState {
	out := make([]contentstore.CurrentModuleState, 0, len(s.statesByModule))
	for _, state := range s.statesByModule {
		out = append(out, *state)
	}
	return out
}

func (s *inMemoryAdminStore) ListCurrentModuleStates(ctx context.Context) ([]contentstore.CurrentModuleState, error) {
	return s.currentStates(), nil
}

func (s *inMemoryAdminStore) ListCurrentLessonModuleStates(ctx context.Context, lessonID string) ([]contentstore.CurrentModuleState, error) {
	var out []contentstore.CurrentModuleState
	for _, state := range s.currentStates() {
		if state.LessonID == lessonID {
			out = append(out, state)
		}
	}
	return out, nil
}

func (s *inMemoryAdminStore) GetCurrentModuleState(ctx context.Context, lessonID, moduleType string) (*contentstore.CurrentModuleState, error) {
	state, ok := s.statesByModule[historyKey(lessonID, moduleType)]
	if !ok {
		return nil, nil
	}
	clone := *state
	return &clone, nil
}

func (s *inMemoryAdminStore) ListPublishedModuleHistory(ctx context.Context, lessonID, moduleType string) ([]contentstore.PublishedModuleHistoryEntry, error) {
	return s.history[historyKey(lessonID, moduleType)], nil
}

func (s *inMemoryAdminStore) InsertModuleRevision(ctx context.Context, input contentstore.InsertModuleRevisionInput) (contentstore.InsertedModuleRevision, error) {
	revisionID := s.nextRevision
	s.nextRevision++
	createdAt := fmt.Sprintf("2026-07-28T01:00:%02dZ", revisionID)

	if input.RevisionKind == contentstore.RevisionKindPublished {
		key := historyKey(input.LessonID, input.ModuleType)
		entry := contentstore.PublishedModuleHistoryEntry{
			LessonID:         input.LessonID,
			ModuleType:       input.ModuleType,
			RevisionID:       revisionID,
			Payload:          input.Payload,
			CreatedAt:        createdAt,
			CreatedBy:        input.CreatedBy,
			Note:             input.Note,
			SourceRevisionID: input.SourceRevisionID,
		}
		s.history[key] = append([]contentstore.PublishedModuleHistoryEntry{entry}, s.history[key]...)
	}

	return contentstore.InsertedModuleRevision{
		InsertModuleRevisionInput: input,
		RevisionID:                revisionID,
		CreatedAt:                 createdAt,
	}, nil
}

func (s *inMemoryAdminStore) UpdateCurrentModuleState(ctx context.Context, row contentstore.ContentModuleRevisionRow) error {
	state, ok := s.statesByModule[historyKey(row.LessonID, row.ModuleType)]
	if !ok {
		return fmt.Errorf("missing module %s:%s", row.LessonID, row.ModuleType)
	}
	if row.RevisionKind == contentstore.RevisionKindDraft {
		state.DraftRevisionID = row.RevisionID
		state.DraftPayload = row.Payload
		state.DraftCreatedAt = row.CreatedAt
		state.DraftCreatedBy = row.CreatedBy
		state.DraftNote = row.Note
		state.DraftSourceRevisionID = row.SourceRevisionID
	} else {
		state.PublishedRevisionID = row.RevisionID
		state.PublishedPayload = row.Payload
		state.PublishedCreatedAt = row.CreatedAt
		state.PublishedCreatedBy = row.CreatedBy
		state.PublishedNote = row.Note
		state.PublishedSourceRevisionID = row.SourceRevisionID
	}
	return nil
}

func (s *inMemoryAdminStore) RunInTransaction(ctx context.Context, work func(store contentstore.AdminStore) error) error {
	return work(s)
}

func TestListLessonsAndSnapshot(t *testing.T) {
	repo := New(newInMemoryAdminStore())

	summaries, err := repo.ListLessons(context.Background())
	if err != nil {
		t.Fatalf("ListLessons: %v", err)
	}
	if len(summaries) != 1 || summaries[0].LessonID != "self-intro" {
		t.Fatalf("summaries = %+v", summaries)
	}
	if summaries[0].DraftChangedModuleCount != 0 {
		t.Fatalf("draftChangedModuleCount = %d, want 0", summaries[0].DraftChangedModuleCount)
	}

	snapshot, err := repo.GetLessonSnapshot(context.Background(), "self-intro")
	if err != nil {
		t.Fatalf("GetLessonSnapshot: %v", err)
	}
	if snapshot.PublishedLesson == nil || snapshot.PublishedLesson.ID != "self-intro" {
		t.Fatalf("publishedLesson = %+v", snapshot.PublishedLesson)
	}
	if snapshot.DraftLesson == nil {
		t.Fatal("draftLesson should be non-nil")
	}
	for _, module := range snapshot.Modules {
		if module.HasUnpublishedChanges {
			t.Fatalf("module %s should have no unpublished changes", module.ModuleType)
		}
	}
}

func TestSaveDraftModule(t *testing.T) {
	repo := New(newInMemoryAdminStore())

	updatedMeta := []byte(`{"id":"self-intro","title":{"en":"Updated draft title","fr":"Titre brouillon mis à jour"},"scenario":{"en":"Scenario","fr":"Scénario"}}`)
	_, err := repo.SaveDraftModule(context.Background(), SaveDraftModuleInput{
		LessonID:   "self-intro",
		ModuleType: "lessonMeta",
		Payload:    updatedMeta,
		CreatedBy:  "admin-ui",
		Note:       strPtr("Adjust lesson title before publish"),
	})
	if err != nil {
		t.Fatalf("SaveDraftModule: %v", err)
	}

	snapshot, err := repo.GetLessonSnapshot(context.Background(), "self-intro")
	if err != nil {
		t.Fatalf("GetLessonSnapshot: %v", err)
	}
	if snapshot.DraftLesson == nil || string(snapshot.DraftLesson.Title) != `{"en":"Updated draft title","fr":"Titre brouillon mis à jour"}` {
		t.Fatalf("draftLesson title = %s", snapshot.DraftLesson.Title)
	}
	if snapshot.PublishedLesson == nil || string(snapshot.PublishedLesson.Title) != `{"en":"Intro","fr":"Intro"}` {
		t.Fatalf("publishedLesson title = %s", snapshot.PublishedLesson.Title)
	}
	found := false
	for _, module := range snapshot.Modules {
		if module.ModuleType == "lessonMeta" {
			found = true
			if !module.HasUnpublishedChanges {
				t.Fatal("lessonMeta should have unpublished changes")
			}
		}
	}
	if !found {
		t.Fatal("lessonMeta module not found")
	}

	summaries, err := repo.ListLessons(context.Background())
	if err != nil {
		t.Fatalf("ListLessons: %v", err)
	}
	if summaries[0].DraftChangedModuleCount != 1 {
		t.Fatalf("draftChangedModuleCount = %d, want 1", summaries[0].DraftChangedModuleCount)
	}
}

func TestPublishModule(t *testing.T) {
	repo := New(newInMemoryAdminStore())

	updatedMeta := []byte(`{"id":"self-intro","title":{"en":"Ready to publish","fr":"Prêt à publier"},"scenario":{"en":"Scenario","fr":"Scénario"}}`)
	if _, err := repo.SaveDraftModule(context.Background(), SaveDraftModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", Payload: updatedMeta,
		CreatedBy: "admin-ui", Note: strPtr("Prepare title publish"),
	}); err != nil {
		t.Fatalf("SaveDraftModule: %v", err)
	}

	if _, err := repo.PublishModule(context.Background(), PublishModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta",
		CreatedBy: "admin-ui", Note: strPtr("Publish title change"),
	}); err != nil {
		t.Fatalf("PublishModule: %v", err)
	}

	snapshot, err := repo.GetLessonSnapshot(context.Background(), "self-intro")
	if err != nil {
		t.Fatalf("GetLessonSnapshot: %v", err)
	}
	if snapshot.PublishedLesson == nil || string(snapshot.PublishedLesson.Title) != `{"en":"Ready to publish","fr":"Prêt à publier"}` {
		t.Fatalf("publishedLesson title = %s", snapshot.PublishedLesson.Title)
	}
	if snapshot.DraftLesson == nil || string(snapshot.DraftLesson.Title) != `{"en":"Ready to publish","fr":"Prêt à publier"}` {
		t.Fatalf("draftLesson title = %s", snapshot.DraftLesson.Title)
	}
	for _, module := range snapshot.Modules {
		if module.ModuleType == "lessonMeta" && module.HasUnpublishedChanges {
			t.Fatal("lessonMeta should have no unpublished changes after publish")
		}
	}
	history := snapshot.PublishedHistory["lessonMeta"]
	if len(history) != 2 {
		t.Fatalf("history len = %d, want 2", len(history))
	}
	if history[0].Note == nil || *history[0].Note != "Publish title change" {
		t.Fatalf("history[0].note = %v", history[0].Note)
	}
}

func TestRollbackModule(t *testing.T) {
	repo := New(newInMemoryAdminStore())

	v2 := []byte(`{"id":"self-intro","title":{"en":"Version two","fr":"Version deux"},"scenario":{"en":"Scenario","fr":"Scénario"}}`)
	if _, err := repo.SaveDraftModule(context.Background(), SaveDraftModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", Payload: v2,
		CreatedBy: "admin-ui", Note: strPtr("Prepare V2"),
	}); err != nil {
		t.Fatalf("SaveDraftModule V2: %v", err)
	}
	if _, err := repo.PublishModule(context.Background(), PublishModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", CreatedBy: "admin-ui", Note: strPtr("Publish V2"),
	}); err != nil {
		t.Fatalf("PublishModule V2: %v", err)
	}

	v3 := []byte(`{"id":"self-intro","title":{"en":"Version three","fr":"Version trois"},"scenario":{"en":"Scenario","fr":"Scénario"}}`)
	if _, err := repo.SaveDraftModule(context.Background(), SaveDraftModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", Payload: v3,
		CreatedBy: "admin-ui", Note: strPtr("Prepare V3"),
	}); err != nil {
		t.Fatalf("SaveDraftModule V3: %v", err)
	}
	if _, err := repo.PublishModule(context.Background(), PublishModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", CreatedBy: "admin-ui", Note: strPtr("Publish V3"),
	}); err != nil {
		t.Fatalf("PublishModule V3: %v", err)
	}

	before, err := repo.GetLessonSnapshot(context.Background(), "self-intro")
	if err != nil {
		t.Fatalf("GetLessonSnapshot: %v", err)
	}
	var v2RevisionID int64
	for _, entry := range before.PublishedHistory["lessonMeta"] {
		if entry.Note != nil && *entry.Note == "Publish V2" {
			v2RevisionID = entry.RevisionID
		}
	}
	if v2RevisionID == 0 {
		t.Fatal("could not find V2 revision")
	}

	if _, err := repo.RollbackModule(context.Background(), RollbackModuleInput{
		PublishModuleInput:  PublishModuleInput{LessonID: "self-intro", ModuleType: "lessonMeta", CreatedBy: "admin-ui", Note: strPtr("Rollback to V2")},
		PublishedRevisionID: v2RevisionID,
	}); err != nil {
		t.Fatalf("RollbackModule: %v", err)
	}

	snapshot, err := repo.GetLessonSnapshot(context.Background(), "self-intro")
	if err != nil {
		t.Fatalf("GetLessonSnapshot: %v", err)
	}
	if snapshot.PublishedLesson == nil || string(snapshot.PublishedLesson.Title) != `{"en":"Version two","fr":"Version deux"}` {
		t.Fatalf("publishedLesson title = %s", snapshot.PublishedLesson.Title)
	}
	if snapshot.DraftLesson == nil || string(snapshot.DraftLesson.Title) != `{"en":"Version two","fr":"Version deux"}` {
		t.Fatalf("draftLesson title = %s", snapshot.DraftLesson.Title)
	}
	top := snapshot.PublishedHistory["lessonMeta"][0]
	if top.Note == nil || *top.Note != "Rollback to V2" {
		t.Fatalf("top note = %v", top.Note)
	}
	if top.SourceRevisionID == nil || *top.SourceRevisionID != v2RevisionID {
		t.Fatalf("top sourceRevisionID = %v, want %d", top.SourceRevisionID, v2RevisionID)
	}
}

func TestRejectInvalidPayloadAndPublishWithoutChanges(t *testing.T) {
	repo := New(newInMemoryAdminStore())

	_, err := repo.SaveDraftModule(context.Background(), SaveDraftModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta",
		Payload:   []byte(`{"id":"self-intro"}`),
		CreatedBy: "admin-ui", Note: strPtr("Invalid payload"),
	})
	if err == nil {
		t.Fatal("want ValidationError for invalid payload")
	}
	var validationErr *ValidationError
	if !errors.As(err, &validationErr) {
		t.Fatalf("err = %v, want *ValidationError", err)
	}

	_, err = repo.PublishModule(context.Background(), PublishModuleInput{
		LessonID: "self-intro", ModuleType: "dialogue", CreatedBy: "admin-ui", Note: strPtr("Should not publish unchanged"),
	})
	if err == nil {
		t.Fatal("want ErrNoUnpublishedChanges")
	}
	if !errors.Is(err, ErrNoUnpublishedChanges) {
		t.Fatalf("err = %v, want ErrNoUnpublishedChanges", err)
	}
}

func TestRollbackPublishedRevisionNotFound(t *testing.T) {
	repo := New(newInMemoryAdminStore())

	_, err := repo.RollbackModule(context.Background(), RollbackModuleInput{
		PublishModuleInput:  PublishModuleInput{LessonID: "self-intro", ModuleType: "dialogue", CreatedBy: "admin-ui", Note: strPtr("rollback")},
		PublishedRevisionID: 999999,
	})
	if err == nil {
		t.Fatal("want ErrPublishedRevisionNotFound")
	}
	if !errors.Is(err, ErrPublishedRevisionNotFound) {
		t.Fatalf("err = %v, want ErrPublishedRevisionNotFound", err)
	}
}

func TestGetLessonSnapshotNotFound(t *testing.T) {
	repo := New(newInMemoryAdminStore())

	_, err := repo.GetLessonSnapshot(context.Background(), "does-not-exist")
	if err == nil {
		t.Fatal("want NotFoundError")
	}
	var notFoundErr *NotFoundError
	if !errors.As(err, &notFoundErr) {
		t.Fatalf("err = %v, want *NotFoundError", err)
	}
}

func TestValidateModulePayload(t *testing.T) {
	cases := []struct {
		name       string
		moduleType string
		payload    string
	}{
		{"invalid json", "lessonMeta", `{`},
		{"lessonMeta not object", "lessonMeta", `[]`},
		{"lessonMeta id missing", "lessonMeta", `{"title":{"en":"T","fr":"T"},"scenario":{"en":"S","fr":"S"}}`},
		{"lessonMeta id not string", "lessonMeta", `{"id":42,"title":{"en":"T","fr":"T"},"scenario":{"en":"S","fr":"S"}}`},
		{"lessonMeta title not string map", "lessonMeta", `{"id":"l","title":"T","scenario":{"en":"S","fr":"S"}}`},
		{"lessonMeta scenario not string map", "lessonMeta", `{"id":"l","title":{"en":"T","fr":"T"},"scenario":"S"}`},
		{"dialogue not object", "dialogue", `[]`},
		{"dialogue title missing", "dialogue", `{"lines":[]}`},
		{"dialogue lines not array", "dialogue", `{"title":{"en":"T","fr":"T"},"lines":"x"}`},
		{"practice not object", "practice", `[]`},
		{"practice missing listening", "practice", `{"speaking":[],"reading":[]}`},
		{"practice speaking not array", "practice", `{"listening":[],"speaking":"x","reading":[]}`},
		{"sentencePatterns not array", "sentencePatterns", `{}`},
		{"vocabulary not array", "vocabulary", `{}`},
		{"reviewCards not array", "reviewCards", `{}`},
		{"unknown module type", "wat", `{}`},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			_, err := validateModulePayload(c.moduleType, []byte(c.payload))
			if err == nil {
				t.Fatalf("expected ValidationError for %s", c.payload)
			}
			var validationErr *ValidationError
			if !errors.As(err, &validationErr) {
				t.Fatalf("err = %v, want *ValidationError", err)
			}
		})
	}

	if _, err := validateModulePayload("lessonMeta", lessonMetaPayload); err != nil {
		t.Fatalf("valid lessonMeta rejected: %v", err)
	}
	if _, err := validateModulePayload("dialogue", dialoguePayload); err != nil {
		t.Fatalf("valid dialogue rejected: %v", err)
	}
	if _, err := validateModulePayload("practice", practicePayload); err != nil {
		t.Fatalf("valid practice rejected: %v", err)
	}
	if _, err := validateModulePayload("sentencePatterns", sentencePatternsPayload); err != nil {
		t.Fatalf("valid sentencePatterns rejected: %v", err)
	}
}
