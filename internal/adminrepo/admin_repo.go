package adminrepo

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"reflect"
	"sort"

	"en-fr-chinese-entry-mvp/internal/contentbuild"
	"en-fr-chinese-entry-mvp/internal/contentstore"
)

var ErrNoUnpublishedChanges = errors.New("no unpublished changes")
var ErrPublishedRevisionNotFound = errors.New("published revision not found")

type NotFoundError struct{ Message string }

func (e *NotFoundError) Error() string { return e.Message }

type ValidationError struct{ Message string }

func (e *ValidationError) Error() string { return e.Message }

var contentModuleTypes = []string{
	"lessonMeta", "dialogue", "sentencePatterns", "vocabulary", "practice", "reviewCards",
}

type SaveDraftModuleInput struct {
	LessonID   string
	ModuleType string
	Payload    json.RawMessage
	CreatedBy  string
	Note       *string
}

type PublishModuleInput struct {
	LessonID   string
	ModuleType string
	CreatedBy  string
	Note       *string
}

type RollbackModuleInput struct {
	PublishModuleInput
	PublishedRevisionID int64
}

type AdminLessonSummary struct {
	LessonID                string
	Slug                    string
	DisplayOrder            int
	Enabled                 bool
	DraftChangedModuleCount int
}

type ModuleSnapshot struct {
	ModuleType            string
	DraftRevisionID       int64
	PublishedRevisionID   int64
	HasUnpublishedChanges bool
}

type AdminLessonSnapshot struct {
	LessonID         string
	Slug             string
	DisplayOrder     int
	Enabled          bool
	DraftLesson      *contentbuild.LessonContent
	PublishedLesson  *contentbuild.LessonContent
	Modules          []ModuleSnapshot
	PublishedHistory map[string][]contentstore.PublishedModuleHistoryEntry
}

type Repository struct {
	store contentstore.AdminStore
}

func New(store contentstore.AdminStore) *Repository { return &Repository{store: store} }

func samePayload(left, right json.RawMessage) bool {
	var a, b any
	if err := json.Unmarshal(left, &a); err != nil {
		return string(left) == string(right)
	}
	if err := json.Unmarshal(right, &b); err != nil {
		return string(left) == string(right)
	}
	return reflect.DeepEqual(a, b)
}

func asPublishedModuleRow(row contentstore.CurrentModuleState, revisionKind string) contentstore.PublishedModuleRow {
	revisionID := row.PublishedRevisionID
	payload := row.PublishedPayload
	if revisionKind == contentstore.RevisionKindDraft {
		revisionID = row.DraftRevisionID
		payload = row.DraftPayload
	}
	return contentstore.PublishedModuleRow{
		LessonID:     row.LessonID,
		Slug:         row.Slug,
		DisplayOrder: row.DisplayOrder,
		Enabled:      row.Enabled,
		ModuleType:   row.ModuleType,
		RevisionID:   revisionID,
		Payload:      payload,
	}
}

func buildLesson(rows []contentstore.CurrentModuleState, revisionKind string) *contentbuild.LessonContent {
	publishedRows := make([]contentstore.PublishedModuleRow, 0, len(rows))
	for _, row := range rows {
		publishedRows = append(publishedRows, asPublishedModuleRow(row, revisionKind))
	}
	lesson, ok := contentbuild.BuildLessonFromRows(publishedRows)
	if !ok {
		return nil
	}
	return lesson
}

func isStringMap(value any) bool {
	m, ok := value.(map[string]any)
	if !ok {
		return false
	}
	_, hasEn := m["en"].(string)
	_, hasFr := m["fr"].(string)
	return hasEn && hasFr
}

func validateModulePayload(moduleType string, payload json.RawMessage) (json.RawMessage, error) {
	var value any
	if err := json.Unmarshal(payload, &value); err != nil {
		return nil, &ValidationError{Message: fmt.Sprintf("Invalid %s payload: %v", moduleType, err)}
	}

	switch moduleType {
	case "lessonMeta":
		m, ok := value.(map[string]any)
		if !ok {
			return nil, &ValidationError{Message: fmt.Sprintf("Invalid lessonMeta payload: expected object")}
		}
		if _, ok := m["id"].(string); !ok {
			return nil, &ValidationError{Message: "Invalid lessonMeta payload: id is required"}
		}
		if !isStringMap(m["title"]) {
			return nil, &ValidationError{Message: "Invalid lessonMeta payload: title is required"}
		}
		if !isStringMap(m["scenario"]) {
			return nil, &ValidationError{Message: "Invalid lessonMeta payload: scenario is required"}
		}
	case "dialogue":
		m, ok := value.(map[string]any)
		if !ok {
			return nil, &ValidationError{Message: "Invalid dialogue payload: expected object"}
		}
		if _, ok := m["title"]; !ok {
			return nil, &ValidationError{Message: "Invalid dialogue payload: title is required"}
		}
		if _, ok := m["lines"].([]any); !ok {
			return nil, &ValidationError{Message: "Invalid dialogue payload: lines is required"}
		}
	case "practice":
		m, ok := value.(map[string]any)
		if !ok {
			return nil, &ValidationError{Message: "Invalid practice payload: expected object"}
		}
		for _, key := range []string{"listening", "speaking", "reading"} {
			if _, ok := m[key].([]any); !ok {
				return nil, &ValidationError{Message: fmt.Sprintf("Invalid practice payload: %s is required", key)}
			}
		}
	case "sentencePatterns", "vocabulary", "reviewCards":
		if _, ok := value.([]any); !ok {
			return nil, &ValidationError{Message: fmt.Sprintf("Invalid %s payload: expected array", moduleType)}
		}
	default:
		return nil, &ValidationError{Message: fmt.Sprintf("Unknown module type: %s", moduleType)}
	}

	return payload, nil
}

func (r *Repository) ListLessons(ctx context.Context) ([]AdminLessonSummary, error) {
	rows, err := r.store.ListCurrentModuleStates(ctx)
	if err != nil {
		return nil, err
	}

	grouped := map[string][]contentstore.CurrentModuleState{}
	for _, row := range rows {
		grouped[row.LessonID] = append(grouped[row.LessonID], row)
	}

	summaries := make([]AdminLessonSummary, 0, len(grouped))
	for _, lessonRows := range grouped {
		changed := 0
		for _, row := range lessonRows {
			if !samePayload(row.DraftPayload, row.PublishedPayload) {
				changed++
			}
		}
		summaries = append(summaries, AdminLessonSummary{
			LessonID:                lessonRows[0].LessonID,
			Slug:                    lessonRows[0].Slug,
			DisplayOrder:            lessonRows[0].DisplayOrder,
			Enabled:                 lessonRows[0].Enabled,
			DraftChangedModuleCount: changed,
		})
	}
	sort.Slice(summaries, func(i, j int) bool { return summaries[i].DisplayOrder < summaries[j].DisplayOrder })
	return summaries, nil
}

func (r *Repository) GetLessonSnapshot(ctx context.Context, lessonID string) (*AdminLessonSnapshot, error) {
	rows, err := r.store.ListCurrentLessonModuleStates(ctx, lessonID)
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, &NotFoundError{Message: fmt.Sprintf("Editable lesson not found: %s", lessonID)}
	}

	history := make(map[string][]contentstore.PublishedModuleHistoryEntry, len(contentModuleTypes))
	for _, moduleType := range contentModuleTypes {
		entries, err := r.store.ListPublishedModuleHistory(ctx, lessonID, moduleType)
		if err != nil {
			return nil, err
		}
		history[moduleType] = entries
	}

	modules := make([]ModuleSnapshot, 0, len(rows))
	for _, row := range rows {
		modules = append(modules, ModuleSnapshot{
			ModuleType:            row.ModuleType,
			DraftRevisionID:       row.DraftRevisionID,
			PublishedRevisionID:   row.PublishedRevisionID,
			HasUnpublishedChanges: !samePayload(row.DraftPayload, row.PublishedPayload),
		})
	}

	return &AdminLessonSnapshot{
		LessonID:         rows[0].LessonID,
		Slug:             rows[0].Slug,
		DisplayOrder:     rows[0].DisplayOrder,
		Enabled:          rows[0].Enabled,
		DraftLesson:      buildLesson(rows, contentstore.RevisionKindDraft),
		PublishedLesson:  buildLesson(rows, contentstore.RevisionKindPublished),
		Modules:          modules,
		PublishedHistory: history,
	}, nil
}

func (r *Repository) SaveDraftModule(ctx context.Context, input SaveDraftModuleInput) (*AdminLessonSnapshot, error) {
	payload, err := validateModulePayload(input.ModuleType, input.Payload)
	if err != nil {
		return nil, err
	}
	current, err := r.requireCurrentModuleState(ctx, input.LessonID, input.ModuleType)
	if err != nil {
		return nil, err
	}

	err = r.store.RunInTransaction(ctx, func(tx contentstore.AdminStore) error {
		revision, err := tx.InsertModuleRevision(ctx, contentstore.InsertModuleRevisionInput{
			LessonID:         input.LessonID,
			ModuleType:       input.ModuleType,
			Payload:          payload,
			RevisionKind:     contentstore.RevisionKindDraft,
			SourceRevisionID: &current.DraftRevisionID,
			CreatedBy:        input.CreatedBy,
			Note:             input.Note,
		})
		if err != nil {
			return err
		}
		return tx.UpdateCurrentModuleState(ctx, revision)
	})
	if err != nil {
		return nil, err
	}
	return r.GetLessonSnapshot(ctx, input.LessonID)
}

func (r *Repository) PublishModule(ctx context.Context, input PublishModuleInput) (*AdminLessonSnapshot, error) {
	current, err := r.requireCurrentModuleState(ctx, input.LessonID, input.ModuleType)
	if err != nil {
		return nil, err
	}
	payload, err := validateModulePayload(input.ModuleType, current.DraftPayload)
	if err != nil {
		return nil, err
	}
	if samePayload(current.DraftPayload, current.PublishedPayload) {
		return nil, ErrNoUnpublishedChanges
	}

	err = r.store.RunInTransaction(ctx, func(tx contentstore.AdminStore) error {
		published, err := tx.InsertModuleRevision(ctx, contentstore.InsertModuleRevisionInput{
			LessonID:         input.LessonID,
			ModuleType:       input.ModuleType,
			Payload:          payload,
			RevisionKind:     contentstore.RevisionKindPublished,
			SourceRevisionID: &current.DraftRevisionID,
			CreatedBy:        input.CreatedBy,
			Note:             input.Note,
		})
		if err != nil {
			return err
		}
		if err := tx.UpdateCurrentModuleState(ctx, published); err != nil {
			return err
		}

		freshDraft, err := tx.InsertModuleRevision(ctx, contentstore.InsertModuleRevisionInput{
			LessonID:         input.LessonID,
			ModuleType:       input.ModuleType,
			Payload:          payload,
			RevisionKind:     contentstore.RevisionKindDraft,
			SourceRevisionID: &published.RevisionID,
			CreatedBy:        input.CreatedBy,
			Note:             draftBaselineNote("publish", input.Note),
		})
		if err != nil {
			return err
		}
		return tx.UpdateCurrentModuleState(ctx, freshDraft)
	})
	if err != nil {
		return nil, err
	}
	return r.GetLessonSnapshot(ctx, input.LessonID)
}

func (r *Repository) RollbackModule(ctx context.Context, input RollbackModuleInput) (*AdminLessonSnapshot, error) {
	if _, err := r.requireCurrentModuleState(ctx, input.LessonID, input.ModuleType); err != nil {
		return nil, err
	}

	history, err := r.store.ListPublishedModuleHistory(ctx, input.LessonID, input.ModuleType)
	if err != nil {
		return nil, err
	}
	var target *contentstore.PublishedModuleHistoryEntry
	for i := range history {
		if history[i].RevisionID == input.PublishedRevisionID {
			target = &history[i]
			break
		}
	}
	if target == nil {
		return nil, ErrPublishedRevisionNotFound
	}

	payload, err := validateModulePayload(input.ModuleType, target.Payload)
	if err != nil {
		return nil, err
	}

	err = r.store.RunInTransaction(ctx, func(tx contentstore.AdminStore) error {
		published, err := tx.InsertModuleRevision(ctx, contentstore.InsertModuleRevisionInput{
			LessonID:         input.LessonID,
			ModuleType:       input.ModuleType,
			Payload:          payload,
			RevisionKind:     contentstore.RevisionKindPublished,
			SourceRevisionID: &target.RevisionID,
			CreatedBy:        input.CreatedBy,
			Note:             input.Note,
		})
		if err != nil {
			return err
		}
		if err := tx.UpdateCurrentModuleState(ctx, published); err != nil {
			return err
		}

		freshDraft, err := tx.InsertModuleRevision(ctx, contentstore.InsertModuleRevisionInput{
			LessonID:         input.LessonID,
			ModuleType:       input.ModuleType,
			Payload:          payload,
			RevisionKind:     contentstore.RevisionKindDraft,
			SourceRevisionID: &published.RevisionID,
			CreatedBy:        input.CreatedBy,
			Note:             draftBaselineNote("rollback", input.Note),
		})
		if err != nil {
			return err
		}
		return tx.UpdateCurrentModuleState(ctx, freshDraft)
	})
	if err != nil {
		return nil, err
	}
	return r.GetLessonSnapshot(ctx, input.LessonID)
}

func draftBaselineNote(action string, note *string) *string {
	base := "Draft baseline after " + action
	if note != nil && *note != "" {
		base += ": " + *note
	}
	return &base
}

func (r *Repository) requireCurrentModuleState(ctx context.Context, lessonID, moduleType string) (*contentstore.CurrentModuleState, error) {
	current, err := r.store.GetCurrentModuleState(ctx, lessonID, moduleType)
	if err != nil {
		return nil, err
	}
	if current == nil {
		return nil, &NotFoundError{Message: fmt.Sprintf("Editable module not found: %s:%s", lessonID, moduleType)}
	}
	return current, nil
}
