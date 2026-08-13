package pinyincontent

import (
	"bytes"
	"encoding/json"
	"testing"
)

func TestPinyinCourseJSONValid(t *testing.T) {
	raw, err := PinyinCourseJSON()
	if err != nil {
		t.Fatalf("PinyinCourseJSON: %v", err)
	}
	if len(raw) == 0 {
		t.Fatal("expected non-empty payload")
	}
	if !json.Valid(raw) {
		t.Fatal("payload is not valid JSON")
	}
}

func TestPinyinCourseJSONBytesPreserved(t *testing.T) {
	a, _ := PinyinCourseJSON()
	b, _ := PinyinCourseJSON()
	if !bytes.Equal(a, b) {
		t.Fatal("payload bytes not stable across calls")
	}
}

func TestModuleIDs(t *testing.T) {
	ids := ModuleIDs()
	want := []string{"initials", "finals", "tones", "whole-syllables"}
	if len(ids) != len(want) {
		t.Fatalf("modules = %d, want %d", len(ids), len(want))
	}
	for i := range want {
		if ids[i] != want[i] {
			t.Fatalf("module[%d] = %q, want %q", i, ids[i], want[i])
		}
	}
}

func TestModuleShape(t *testing.T) {
	raw, err := PinyinCourseJSON()
	if err != nil {
		t.Fatalf("PinyinCourseJSON: %v", err)
	}
	var course struct {
		Modules []struct {
			ID             string          `json:"id"`
			Title          json.RawMessage `json:"title"`
			Summary        json.RawMessage `json:"summary"`
			Reference      json.RawMessage `json:"reference"`
			WholeSyllables json.RawMessage `json:"wholeSyllables,omitempty"`
		} `json:"modules"`
	}
	if err := json.Unmarshal(raw, &course); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	for _, m := range course.Modules {
		if m.ID == "" {
			t.Fatal("module with empty id")
		}
		if len(m.Title) == 0 || len(m.Summary) == 0 {
			t.Fatalf("module %q missing title/summary", m.ID)
		}
		switch m.ID {
		case "whole-syllables":
			if len(m.WholeSyllables) == 0 {
				t.Fatalf("module %q missing wholeSyllables", m.ID)
			}
		default:
			if len(m.Reference) == 0 {
				t.Fatalf("module %q missing reference", m.ID)
			}
		}
	}
}
