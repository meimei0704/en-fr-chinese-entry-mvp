package contentbuild

import (
	"encoding/json"
	"strings"
	"testing"

	"en-fr-chinese-entry-mvp/pkg/contentstore"
)

// TestPayloadByteFidelity asserts that module payloads pass through untouched:
// JSON field ORDER and non-ASCII bytes are preserved (no map re-encoding).
func TestPayloadByteFidelity(t *testing.T) {
	dialogueJSON := `{"title":{"en":"Dialogue","fr":"Dialogue"},"lines":[{"speaker":"zh","text":"你好，世界","order":1},{"speaker":"en","text":"Hello","order":2}]}`
	metaJSON := `{"scenario":{"fr":"Scénario","en":"Scenario"},"id":"self-intro","title":{"fr":"Titre","en":"Title"}}`

	rows := []contentstore.PublishedModuleRow{
		{LessonID: "self-intro", Enabled: true, ModuleType: "lessonMeta", Payload: json.RawMessage(metaJSON)},
		{LessonID: "self-intro", Enabled: true, ModuleType: "dialogue", Payload: json.RawMessage(dialogueJSON)},
		{LessonID: "self-intro", Enabled: true, ModuleType: "sentencePatterns", Payload: json.RawMessage(`[]`)},
		{LessonID: "self-intro", Enabled: true, ModuleType: "vocabulary", Payload: json.RawMessage(`[]`)},
		{LessonID: "self-intro", Enabled: true, ModuleType: "practice", Payload: json.RawMessage(`{"listening":[],"speaking":[],"reading":[]}`)},
		{LessonID: "self-intro", Enabled: true, ModuleType: "reviewCards", Payload: json.RawMessage(`[]`)},
	}

	lesson, ok := BuildLessonFromRows(rows)
	if !ok {
		t.Fatal("expected complete lesson")
	}

	out, err := json.Marshal(lesson)
	if err != nil {
		t.Fatalf("marshal: %v", err)
	}
	s := string(out)

	// Dialogue payload must appear verbatim (field order preserved, Chinese intact).
	if !strings.Contains(s, `"title":{"en":"Dialogue","fr":"Dialogue"}`) {
		t.Fatalf("dialogue bytes not preserved verbatim: %s", s)
	}
	if !strings.Contains(s, `你好，世界`) {
		t.Fatalf("non-ASCII bytes not preserved: %s", s)
	}

	// lessonMeta is re-assembled (id/title/scenario extracted), but title/scenario
	// must be emitted as objects with all fields intact.
	if !strings.Contains(s, `"id":"self-intro"`) {
		t.Fatalf("id missing: %s", s)
	}
	if !strings.Contains(s, `"Scénario"`) {
		t.Fatalf("scenario bytes lost: %s", s)
	}
}
