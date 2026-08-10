package adminrepo

import (
	"context"
	"encoding/json"
	"strings"
	"testing"
)

// contractFixturePayloads builds a lesson with one realistic non-empty module
// (dialogue) so the assembled draft/published lesson JSON is meaningful.
func contractFixturePayloads() map[string]json.RawMessage {
	return map[string]json.RawMessage{
		"lessonMeta":       json.RawMessage(`{"id":"self-intro","title":{"en":"Intro","fr":"Intro"},"scenario":{"en":"Scenario","fr":"Scénario"}}`),
		"dialogue":         json.RawMessage(`{"title":{"en":"First dialogue","fr":"Premier dialogue"},"lines":[{"id":"l1","speaker":{"en":"A","fr":"A"},"hanzi":"你好","pinyin":"nǐ hǎo","translation":{"en":"Hello","fr":"Bonjour"},"explanation":{"en":"Greeting","fr":"Salutation"},"audio":"/audio/hello.mp3"}]}`),
		"sentencePatterns": json.RawMessage(`[{"id":"sp1","pattern":"你好。","meaning":{"en":"Hello.","fr":"Bonjour."},"example":"你好，世界。","audio":"/audio/sp1.mp3","explanation":{"en":"Pattern","fr":"Motif"}}]`),
		"vocabulary":       json.RawMessage(`[{"id":"v1","hanzi":"你好","pinyin":"nǐ hǎo","audio":"/audio/v1.mp3","meaning":{"en":"Hello","fr":"Bonjour"},"explanation":{"en":"Word","fr":"Mot"}}]`),
		"practice":         json.RawMessage(`{"listening":[{"id":"p1","prompt":{"en":"Listen","fr":"Écoute"},"target":"你好","audio":"/audio/p1.mp3","explanation":{"en":"Practice","fr":"Pratique"}}],"speaking":[],"reading":[]}`),
		"reviewCards":      json.RawMessage(`[{"id":"c1","front":"你好","back":{"en":"Hello","fr":"Bonjour"},"explanation":{"en":"Card","fr":"Carte"}}]`),
	}
}

func contractStore() *inMemoryAdminStore {
	s := newInMemoryAdminStore()
	payloads := contractFixturePayloads()
	for key, state := range s.statesByModule {
		payload := payloads[state.ModuleType]
		state.DraftPayload = payload
		state.PublishedPayload = payload
		s.statesByModule[key] = state
		for i := range s.history[key] {
			s.history[key][i].Payload = payload
		}
	}
	return s
}

func marshalJSON(t *testing.T, value any) string {
	t.Helper()
	raw, err := json.Marshal(value)
	if err != nil {
		t.Fatalf("json.Marshal: %v", err)
	}
	return string(raw)
}

func TestAdminSnapshotContractKeys(t *testing.T) {
	repo := New(contractStore())

	summaries, err := repo.ListLessons(context.Background())
	if err != nil {
		t.Fatalf("ListLessons: %v", err)
	}
	summaryJSON := marshalJSON(t, summaries)
	for _, key := range []string{`"lessonId"`, `"slug"`, `"displayOrder"`, `"enabled"`, `"draftChangedModuleCount"`} {
		if !strings.Contains(summaryJSON, key) {
			t.Fatalf("summary JSON missing %s: %s", key, summaryJSON)
		}
	}

	snapshot, err := repo.GetLessonSnapshot(context.Background(), "self-intro")
	if err != nil {
		t.Fatalf("GetLessonSnapshot: %v", err)
	}
	snapshotJSON := marshalJSON(t, snapshot)
	for _, key := range []string{`"lessonId"`, `"slug"`, `"displayOrder"`, `"enabled"`, `"draftLesson"`, `"publishedLesson"`, `"modules"`, `"publishedHistory"`} {
		if !strings.Contains(snapshotJSON, key) {
			t.Fatalf("snapshot JSON missing %s: %s", key, snapshotJSON)
		}
	}
	for _, key := range []string{`"moduleType"`, `"draftRevisionId"`, `"publishedRevisionId"`, `"hasUnpublishedChanges"`} {
		if !strings.Contains(snapshotJSON, key) {
			t.Fatalf("snapshot JSON missing module key %s: %s", key, snapshotJSON)
		}
	}
	// The published history must be keyed by module type (6 keys), matching
	// the TS ModuleHistoryMap contract.
	for _, moduleType := range contentModuleTypes {
		if !strings.Contains(snapshotJSON, `"`+moduleType+`"`) {
			t.Fatalf("publishedHistory missing module key %q: %s", moduleType, snapshotJSON)
		}
	}
}

func TestDraftPublishRollbackContractRoundTrip(t *testing.T) {
	repo := New(contractStore())

	ctx := context.Background()
	v2 := json.RawMessage(`{"id":"self-intro","title":{"en":"Version two","fr":"Version deux"},"scenario":{"en":"Scenario","fr":"Scénario"}}`)
	v3 := json.RawMessage(`{"id":"self-intro","title":{"en":"Version three","fr":"Version trois"},"scenario":{"en":"Scenario","fr":"Scénario"}}`)

	if _, err := repo.SaveDraftModule(ctx, SaveDraftModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", Payload: v2, CreatedBy: "admin-ui", Note: strPtr("Prepare V2"),
	}); err != nil {
		t.Fatalf("save V2: %v", err)
	}
	if _, err := repo.PublishModule(ctx, PublishModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", CreatedBy: "admin-ui", Note: strPtr("Publish V2"),
	}); err != nil {
		t.Fatalf("publish V2: %v", err)
	}
	if _, err := repo.SaveDraftModule(ctx, SaveDraftModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", Payload: v3, CreatedBy: "admin-ui", Note: strPtr("Prepare V3"),
	}); err != nil {
		t.Fatalf("save V3: %v", err)
	}
	if _, err := repo.PublishModule(ctx, PublishModuleInput{
		LessonID: "self-intro", ModuleType: "lessonMeta", CreatedBy: "admin-ui", Note: strPtr("Publish V3"),
	}); err != nil {
		t.Fatalf("publish V3: %v", err)
	}

	before, err := repo.GetLessonSnapshot(ctx, "self-intro")
	if err != nil {
		t.Fatalf("snapshot before rollback: %v", err)
	}
	var v2RevisionID int64
	for _, entry := range before.PublishedHistory["lessonMeta"] {
		if entry.Note != nil && *entry.Note == "Publish V2" {
			v2RevisionID = entry.RevisionID
		}
	}
	if v2RevisionID == 0 {
		t.Fatal("V2 revision not found in history")
	}

	if _, err := repo.RollbackModule(ctx, RollbackModuleInput{
		PublishModuleInput:  PublishModuleInput{LessonID: "self-intro", ModuleType: "lessonMeta", CreatedBy: "admin-ui", Note: strPtr("Rollback to V2")},
		PublishedRevisionID: v2RevisionID,
	}); err != nil {
		t.Fatalf("rollback: %v", err)
	}

	snapshot, err := repo.GetLessonSnapshot(ctx, "self-intro")
	if err != nil {
		t.Fatalf("snapshot after rollback: %v", err)
	}

	// Round trip contract: published and draft both reflect the V2 title,
	// no unpublished changes remain, and the newest history entry records the
	// rollback with the target revision as its source.
	publishedJSON := marshalJSON(t, snapshot.PublishedLesson)
	if !strings.Contains(publishedJSON, `"en":"Version two"`) {
		t.Fatalf("published after rollback = %s", publishedJSON)
	}
	draftJSON := marshalJSON(t, snapshot.DraftLesson)
	if !strings.Contains(draftJSON, `"en":"Version two"`) {
		t.Fatalf("draft after rollback = %s", draftJSON)
	}
	for _, module := range snapshot.Modules {
		if module.ModuleType == "lessonMeta" && module.HasUnpublishedChanges {
			t.Fatal("lessonMeta should have no unpublished changes after rollback")
		}
	}
	top := snapshot.PublishedHistory["lessonMeta"][0]
	if top.Note == nil || *top.Note != "Rollback to V2" {
		t.Fatalf("top note = %v", top.Note)
	}
	if top.SourceRevisionID == nil || *top.SourceRevisionID != v2RevisionID {
		t.Fatalf("top sourceRevisionID = %v, want %d", top.SourceRevisionID, v2RevisionID)
	}

	// The assembled lesson must retain original byte payloads (no key
	// reordering) inside the snapshot JSON.
	snapshotJSON := marshalJSON(t, snapshot)
	if !strings.Contains(snapshotJSON, `{"id":"self-intro","title":{"en":"Version two","fr":"Version deux"},"scenario":{"en":"Scenario","fr":"Scénario"}}`) {
		t.Fatalf("snapshot JSON lost byte fidelity: %s", snapshotJSON)
	}
}
