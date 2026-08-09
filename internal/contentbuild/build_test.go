package contentbuild

import (
	"encoding/json"
	"testing"

	"en-fr-chinese-entry-mvp/internal/contentstore"
)

func fixtureRows() []contentstore.PublishedModuleRow {
	payload := func(v any) json.RawMessage {
		b, _ := json.Marshal(v)
		return json.RawMessage(b)
	}
	meta := map[string]any{"id": "self-intro", "title": map[string]string{"en": "Intro", "fr": "Intro"}, "scenario": map[string]string{"en": "S", "fr": "S"}}
	return []contentstore.PublishedModuleRow{
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "lessonMeta", RevisionID: 1, Payload: payload(meta)},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "dialogue", RevisionID: 2, Payload: payload(map[string]any{"title": map[string]string{"en": "D", "fr": "D"}, "lines": []any{}})},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "sentencePatterns", RevisionID: 3, Payload: payload([]any{})},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "vocabulary", RevisionID: 4, Payload: payload([]any{})},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "practice", RevisionID: 5, Payload: payload(map[string]any{"listening": []any{}, "speaking": []any{}, "reading": []any{}})},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "reviewCards", RevisionID: 6, Payload: payload([]any{})},
		{LessonID: "disabled-lesson", Slug: "disabled", DisplayOrder: 2, Enabled: false, ModuleType: "lessonMeta", RevisionID: 7, Payload: payload(meta)},
	}
}

func TestBuildLessonComplete(t *testing.T) {
	lesson, ok := BuildLessonFromRows(fixtureRows())
	if !ok || lesson == nil {
		t.Fatal("expected complete lesson")
	}
	if lesson["id"] != "self-intro" {
		t.Fatalf("id = %v", lesson["id"])
	}
}

func TestBuildLessonMissingModule(t *testing.T) {
	rows := fixtureRows()[:5] // 缺 reviewCards
	if lesson, ok := BuildLessonFromRows(rows); ok {
		t.Fatalf("expected nil lesson, got %v", lesson)
	}
}

func TestBuildCourseSkipsDisabled(t *testing.T) {
	course, err := BuildCourseFromRows(fixtureRows())
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	lessons, _ := course["lessons"].([]any)
	if len(lessons) != 1 {
		t.Fatalf("lessons = %d, want 1 (disabled skipped)", len(lessons))
	}
}

func TestBuildCourseSortsByDisplayOrder(t *testing.T) {
	payload := func(v any) json.RawMessage {
		b, _ := json.Marshal(v)
		return json.RawMessage(b)
	}
	metaA := map[string]any{"id": "a", "title": map[string]string{"en": "A", "fr": "A"}, "scenario": map[string]string{"en": "S", "fr": "S"}}
	metaB := map[string]any{"id": "b", "title": map[string]string{"en": "B", "fr": "B"}, "scenario": map[string]string{"en": "S", "fr": "S"}}
	rows := []contentstore.PublishedModuleRow{
		{LessonID: "a", DisplayOrder: 2, Enabled: true, ModuleType: "lessonMeta", Payload: payload(metaA)},
		{LessonID: "a", DisplayOrder: 2, Enabled: true, ModuleType: "dialogue", Payload: payload(map[string]any{})},
		{LessonID: "a", DisplayOrder: 2, Enabled: true, ModuleType: "sentencePatterns", Payload: payload([]any{})},
		{LessonID: "a", DisplayOrder: 2, Enabled: true, ModuleType: "vocabulary", Payload: payload([]any{})},
		{LessonID: "a", DisplayOrder: 2, Enabled: true, ModuleType: "practice", Payload: payload(map[string]any{})},
		{LessonID: "a", DisplayOrder: 2, Enabled: true, ModuleType: "reviewCards", Payload: payload([]any{})},
		{LessonID: "b", DisplayOrder: 1, Enabled: true, ModuleType: "lessonMeta", Payload: payload(metaB)},
		{LessonID: "b", DisplayOrder: 1, Enabled: true, ModuleType: "dialogue", Payload: payload(map[string]any{})},
		{LessonID: "b", DisplayOrder: 1, Enabled: true, ModuleType: "sentencePatterns", Payload: payload([]any{})},
		{LessonID: "b", DisplayOrder: 1, Enabled: true, ModuleType: "vocabulary", Payload: payload([]any{})},
		{LessonID: "b", DisplayOrder: 1, Enabled: true, ModuleType: "practice", Payload: payload(map[string]any{})},
		{LessonID: "b", DisplayOrder: 1, Enabled: true, ModuleType: "reviewCards", Payload: payload([]any{})},
	}
	course, err := BuildCourseFromRows(rows)
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	lessons, _ := course["lessons"].([]any)
	if len(lessons) != 2 {
		t.Fatalf("lessons = %d, want 2", len(lessons))
	}
	first := lessons[0].(map[string]any)
	if first["id"] != "b" {
		t.Fatalf("first lesson id = %v, want b (displayOrder 1)", first["id"])
	}
}
