package seedgen

import (
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"
)

// normalizeTimestamps collapses 2026-*Z literals so the committed seed (which
// uses a fixed timestamp) and regenerated SQL compare modulo timestamps.
var timestampPattern = regexp.MustCompile(`'2026-[0-9T:.]+Z'`)

func loadSnapshot(t *testing.T) *CourseSnapshot {
	t.Helper()
	path := filepath.Join("data", "course.json")
	raw, err := os.ReadFile(path)
	if err != nil {
		t.Fatalf("read course.json: %v", err)
	}
	var snapshot CourseSnapshot
	if err := jsonUnmarshal(raw, &snapshot); err != nil {
		t.Fatalf("parse course.json: %v", err)
	}
	return &snapshot
}

func TestRenderMatchesCommittedSeed(t *testing.T) {
	snapshot := loadSnapshot(t)
	if len(snapshot.Lessons) != 10 {
		t.Fatalf("lessons = %d, want 10", len(snapshot.Lessons))
	}

	got, err := RenderInitialContentSeedSql(snapshot)
	if err != nil {
		t.Fatalf("render: %v", err)
	}

	committed, err := os.ReadFile(filepath.Join("..", "..", "db", "seeds", "0001_initial_content_admin.sql"))
	if err != nil {
		t.Fatalf("read committed seed: %v", err)
	}

	if normalized(got) != normalized(string(committed)) {
		t.Fatal("regenerated seed SQL differs from committed db/seeds/0001_initial_content_admin.sql")
	}
}

func TestSeedStructure(t *testing.T) {
	snapshot := loadSnapshot(t)
	seed := CreateInitialContentSeed(snapshot)

	if len(seed.Lessons) != 10 {
		t.Fatalf("lessons = %d, want 10", len(seed.Lessons))
	}
	if len(seed.LessonModules) != 10*6 {
		t.Fatalf("lessonModules = %d, want 60", len(seed.LessonModules))
	}
	if len(seed.Revisions) != 10*6*2 {
		t.Fatalf("revisions = %d, want 120", len(seed.Revisions))
	}

	// revision pointer self-consistency
	for _, module := range seed.LessonModules {
		if module.CurrentDraftRevisionID != module.CurrentPublishedRevisionID+1 {
			t.Fatalf("draft %d should follow published %d", module.CurrentDraftRevisionID, module.CurrentPublishedRevisionID)
		}
	}

	// lessonMeta payload is rebuilt with exact key order
	meta := modulePayloads(snapshot.Lessons[0])[0]
	wantPrefix := `{"id":"` + snapshot.Lessons[0].ID + `","title":`
	if !strings.HasPrefix(string(meta), wantPrefix) {
		t.Fatalf("lessonMeta payload = %s, want prefix %s", meta, wantPrefix)
	}
}

func normalized(s string) string {
	s = timestampPattern.ReplaceAllString(s, "'TIMESTAMP'")
	return strings.TrimSpace(s)
}
