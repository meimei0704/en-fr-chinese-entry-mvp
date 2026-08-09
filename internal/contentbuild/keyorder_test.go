package contentbuild

import (
	"encoding/json"
	"testing"

	"en-fr-chinese-entry-mvp/internal/contentstore"
)

// TestLessonKeyOrder asserts the assembled lesson marshals with the same key
// order TS produces (id, title, scenario, dialogue, sentencePatterns,
// vocabulary, practice, reviewCards), so the Go output matches the TS contract
// byte-for-byte rather than Go's alphabetical map ordering.
func TestLessonKeyOrder(t *testing.T) {
	payload := func(v any) json.RawMessage {
		b, _ := json.Marshal(v)
		return json.RawMessage(b)
	}
	meta := map[string]any{"id": "self-intro", "title": map[string]string{"en": "Intro", "fr": "Intro"}, "scenario": map[string]string{"en": "S", "fr": "S"}}
	rows := []contentstore.PublishedModuleRow{
		{LessonID: "self-intro", Enabled: true, ModuleType: "lessonMeta", Payload: payload(meta)},
		{LessonID: "self-intro", Enabled: true, ModuleType: "dialogue", Payload: payload(map[string]any{"title": map[string]string{"en": "D", "fr": "D"}, "lines": []any{}})},
		{LessonID: "self-intro", Enabled: true, ModuleType: "sentencePatterns", Payload: payload([]any{})},
		{LessonID: "self-intro", Enabled: true, ModuleType: "vocabulary", Payload: payload([]any{})},
		{LessonID: "self-intro", Enabled: true, ModuleType: "practice", Payload: payload(map[string]any{})},
		{LessonID: "self-intro", Enabled: true, ModuleType: "reviewCards", Payload: payload([]any{})},
	}

	lesson, ok := BuildLessonFromRows(rows)
	if !ok {
		t.Fatal("expected complete lesson")
	}
	out, err := json.Marshal(lesson)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}

	want := `{"id":"self-intro","title":{"en":"Intro","fr":"Intro"},"scenario":{"en":"S","fr":"S"},`
	if !startsWith(string(out), want) {
		t.Fatalf("lesson JSON key order mismatch:\ngot  %s\nwant prefix %s", out, want)
	}
}

// TestCourseKeyOrder asserts the assembled course marshals with the same
// top-level key order TS produces (supportedExplanationLanguages,
// estimatedDailyMinutes, lessons), so the Go output matches the TS contract
// byte-for-byte rather than Go's alphabetical map ordering.
func TestCourseKeyOrder(t *testing.T) {
	course, err := BuildCourseFromRows(fixtureRowsForKeyorder())
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	out, err := json.Marshal(course)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}

	want := `{"supportedExplanationLanguages":["en","fr"],"estimatedDailyMinutes":10,"lessons":[`
	if !startsWith(string(out), want) {
		t.Fatalf("course JSON key order mismatch:\ngot  %s\nwant prefix %s", out, want)
	}
}

func fixtureRowsForKeyorder() []contentstore.PublishedModuleRow {
	payload := func(v any) json.RawMessage {
		b, _ := json.Marshal(v)
		return json.RawMessage(b)
	}
	meta := map[string]any{"id": "self-intro", "title": map[string]string{"en": "Intro", "fr": "Intro"}, "scenario": map[string]string{"en": "S", "fr": "S"}}
	return []contentstore.PublishedModuleRow{
		{LessonID: "self-intro", Enabled: true, ModuleType: "lessonMeta", Payload: payload(meta)},
		{LessonID: "self-intro", Enabled: true, ModuleType: "dialogue", Payload: payload(map[string]any{"title": map[string]string{"en": "D", "fr": "D"}, "lines": []any{}})},
		{LessonID: "self-intro", Enabled: true, ModuleType: "sentencePatterns", Payload: payload([]any{})},
		{LessonID: "self-intro", Enabled: true, ModuleType: "vocabulary", Payload: payload([]any{})},
		{LessonID: "self-intro", Enabled: true, ModuleType: "practice", Payload: payload(map[string]any{})},
		{LessonID: "self-intro", Enabled: true, ModuleType: "reviewCards", Payload: payload([]any{})},
	}
}

func startsWith(s, prefix string) bool {
	return len(s) >= len(prefix) && s[:len(prefix)] == prefix
}
