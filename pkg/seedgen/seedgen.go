// Package seedgen regenerates the initial content seed SQL from a JSON
// snapshot of the static main course, mirroring src/server/content/seed.ts.
//
// Byte fidelity matters: the generated SQL must match the committed
// db/seeds/0001_initial_content_admin.sql (modulo timestamps). Module payloads
// are therefore carried as json.RawMessage and emitted verbatim, and the
// lessonMeta payload is rebuilt as {"id":...,"title":...,"scenario":...} from
// raw field bytes to match the TS insertion order.
package seedgen

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"
)

var contentModuleTypes = []string{
	"lessonMeta", "dialogue", "sentencePatterns", "vocabulary", "practice", "reviewCards",
}

// CourseSnapshot is the JSON shape produced by scripts/export-course-json.mjs.
type CourseSnapshot struct {
	SupportedExplanationLanguages []string         `json:"supportedExplanationLanguages"`
	EstimatedDailyMinutes         int              `json:"estimatedDailyMinutes"`
	Lessons                       []LessonSnapshot `json:"lessons"`
}

// LessonSnapshot mirrors a lesson with payloads kept as raw JSON bytes.
type LessonSnapshot struct {
	ID               string          `json:"id"`
	Title            json.RawMessage `json:"title"`
	Scenario         json.RawMessage `json:"scenario"`
	Dialogue         json.RawMessage `json:"dialogue"`
	SentencePatterns json.RawMessage `json:"sentencePatterns"`
	Vocabulary       json.RawMessage `json:"vocabulary"`
	Practice         json.RawMessage `json:"practice"`
	ReviewCards      json.RawMessage `json:"reviewCards"`
}

// lessonMetaPayload rebuilds the lessonMeta payload in the exact field order
// produced by lessonToModulePayloads in seed.ts.
func lessonMetaPayload(lesson LessonSnapshot) []byte {
	id, _ := json.Marshal(lesson.ID)
	var buf bytes.Buffer
	buf.WriteString(`{"id":`)
	buf.Write(id)
	buf.WriteString(`,"title":`)
	buf.Write(lesson.Title)
	buf.WriteString(`,"scenario":`)
	buf.Write(lesson.Scenario)
	buf.WriteString(`}`)
	return buf.Bytes()
}

func modulePayloads(lesson LessonSnapshot) [][]byte {
	return [][]byte{
		lessonMetaPayload(lesson),
		lesson.Dialogue,
		lesson.SentencePatterns,
		lesson.Vocabulary,
		lesson.Practice,
		lesson.ReviewCards,
	}
}

func sqlString(value string) string {
	return "'" + strings.ReplaceAll(value, "'", "''") + "'"
}

// CreateInitialContentSeed mirrors seed.ts createInitialContentSeed with a
// fixed default timestamp so regeneration is deterministic.
func CreateInitialContentSeed(snapshot *CourseSnapshot) Seed {
	now := "2026-07-26T00:00:00.000Z"
	nextRevisionID := int64(1)
	var lessons []LessonSeedRow
	var lessonModules []LessonModuleSeedRow
	var revisions []ModuleRevisionSeedRow

	for index, lesson := range snapshot.Lessons {
		lessons = append(lessons, LessonSeedRow{
			LessonID:     lesson.ID,
			Slug:         lesson.ID,
			DisplayOrder: index + 1,
			Enabled:      true,
		})
		for i, moduleType := range contentModuleTypes {
			publishedRevisionID := nextRevisionID
			draftRevisionID := nextRevisionID + 1
			nextRevisionID += 2

			revisions = append(revisions,
				ModuleRevisionSeedRow{
					RevisionID:       publishedRevisionID,
					LessonID:         lesson.ID,
					ModuleType:       moduleType,
					Payload:          modulePayloads(lesson)[i],
					RevisionKind:     "published",
					SourceRevisionID: nil,
					CreatedBy:        "seed:static-content",
					CreatedAt:        now,
					Note:             "Initial published content imported from static lesson source.",
				},
				ModuleRevisionSeedRow{
					RevisionID:       draftRevisionID,
					LessonID:         lesson.ID,
					ModuleType:       moduleType,
					Payload:          modulePayloads(lesson)[i],
					RevisionKind:     "draft",
					SourceRevisionID: int64Ptr(publishedRevisionID),
					CreatedBy:        "seed:static-content",
					CreatedAt:        now,
					Note:             "Initial editable draft copied from the published baseline.",
				},
			)
			lessonModules = append(lessonModules, LessonModuleSeedRow{
				LessonID:                   lesson.ID,
				ModuleType:                 moduleType,
				CurrentDraftRevisionID:     draftRevisionID,
				CurrentPublishedRevisionID: publishedRevisionID,
			})
		}
	}

	return Seed{Lessons: lessons, LessonModules: lessonModules, Revisions: revisions}
}

func int64Ptr(v int64) *int64 { return &v }

type LessonSeedRow struct {
	LessonID     string
	Slug         string
	DisplayOrder int
	Enabled      bool
}

type LessonModuleSeedRow struct {
	LessonID                   string
	ModuleType                 string
	CurrentDraftRevisionID     int64
	CurrentPublishedRevisionID int64
}

type ModuleRevisionSeedRow struct {
	RevisionID       int64
	LessonID         string
	ModuleType       string
	Payload          []byte
	RevisionKind     string
	SourceRevisionID *int64
	CreatedBy        string
	CreatedAt        string
	Note             string
}

type Seed struct {
	Lessons       []LessonSeedRow
	LessonModules []LessonModuleSeedRow
	Revisions     []ModuleRevisionSeedRow
}

// RenderInitialContentSeedSql mirrors seed.ts renderInitialContentSeedSql.
func RenderInitialContentSeedSql(snapshot *CourseSnapshot) (string, error) {
	seed := CreateInitialContentSeed(snapshot)

	var lessonValues []string
	for _, lesson := range seed.Lessons {
		lessonValues = append(lessonValues,
			fmt.Sprintf("(%s, %s, %d, %t)", sqlString(lesson.LessonID), sqlString(lesson.Slug), lesson.DisplayOrder, lesson.Enabled))
	}

	var moduleValues []string
	for _, module := range seed.LessonModules {
		moduleValues = append(moduleValues,
			fmt.Sprintf("(%s, %s)", sqlString(module.LessonID), sqlString(module.ModuleType)))
	}

	var revisionValues []string
	for _, revision := range seed.Revisions {
		source := "null"
		if revision.SourceRevisionID != nil {
			source = fmt.Sprintf("%d", *revision.SourceRevisionID)
		}
		revisionValues = append(revisionValues,
			fmt.Sprintf("(%d, %s, %s, %s, %s, %s, %s, %s, %s)",
				revision.RevisionID,
				sqlString(revision.LessonID),
				sqlString(revision.ModuleType),
				sqlString(string(revision.Payload)),
				sqlString(revision.RevisionKind),
				source,
				sqlString(revision.CreatedBy),
				sqlString(revision.CreatedAt),
				sqlString(revision.Note),
			))
	}

	var pointerUpdates []string
	for _, module := range seed.LessonModules {
		pointerUpdates = append(pointerUpdates,
			fmt.Sprintf("update lesson_modules\nset current_published_revision_id = %d,\n    current_draft_revision_id = %d\nwhere lesson_id = %s\n  and module_type = %s\n  and current_published_revision_id is null\n  and current_draft_revision_id is null;",
				module.CurrentPublishedRevisionID,
				module.CurrentDraftRevisionID,
				sqlString(module.LessonID),
				sqlString(module.ModuleType),
			))
	}

	var buf bytes.Buffer
	buf.WriteString("begin;\n\n")
	buf.WriteString("insert into lessons (lesson_id, slug, display_order, enabled)\nvalues\n")
	buf.WriteString(strings.Join(lessonValues, ",\n"))
	buf.WriteString("\non duplicate key update\n  lesson_id = lesson_id;\n\n")
	buf.WriteString("insert into lesson_modules (lesson_id, module_type)\nvalues\n")
	buf.WriteString(strings.Join(moduleValues, ",\n"))
	buf.WriteString("\non duplicate key update\n  lesson_id = values(lesson_id);\n\n")
	buf.WriteString("insert into module_revisions (\n  revision_id,\n  lesson_id,\n  module_type,\n  payload,\n  revision_kind,\n  source_revision_id,\n  created_by,\n  created_at,\n  note\n)\nvalues\n")
	buf.WriteString(strings.Join(revisionValues, ",\n"))
	buf.WriteString("\non duplicate key update\n  revision_id = revision_id;\n\n")
	buf.WriteString(strings.Join(pointerUpdates, "\n"))
	buf.WriteString("\n\ncommit;\n")
	return buf.String(), nil
}
