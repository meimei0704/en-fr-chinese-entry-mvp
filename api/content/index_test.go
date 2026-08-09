package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"en-fr-chinese-entry-mvp/internal/contentstore"
)

type fakeStore struct {
	courseRows []contentstore.PublishedModuleRow
	lessonRows []contentstore.PublishedModuleRow
	courseErr  error
	lessonErr  error
	lastLesson string
}

func (f *fakeStore) ListPublishedCourseModules() ([]contentstore.PublishedModuleRow, error) {
	return f.courseRows, f.courseErr
}

func (f *fakeStore) ListPublishedLessonModules(lessonID string) ([]contentstore.PublishedModuleRow, error) {
	f.lastLesson = lessonID
	return f.lessonRows, f.lessonErr
}

func lessonFixtureRows(lessonID string) []contentstore.PublishedModuleRow {
	payload := func(v any) json.RawMessage {
		b, _ := json.Marshal(v)
		return json.RawMessage(b)
	}
	meta := map[string]any{"id": lessonID, "title": map[string]string{"en": "Intro", "fr": "Intro"}, "scenario": map[string]string{"en": "S", "fr": "S"}}
	return []contentstore.PublishedModuleRow{
		{LessonID: lessonID, Slug: lessonID, DisplayOrder: 1, Enabled: true, ModuleType: "lessonMeta", RevisionID: 1, Payload: payload(meta)},
		{LessonID: lessonID, Slug: lessonID, DisplayOrder: 1, Enabled: true, ModuleType: "dialogue", RevisionID: 2, Payload: payload(map[string]any{"title": map[string]string{"en": "D", "fr": "D"}, "lines": []any{}})},
		{LessonID: lessonID, Slug: lessonID, DisplayOrder: 1, Enabled: true, ModuleType: "sentencePatterns", RevisionID: 3, Payload: payload([]any{})},
		{LessonID: lessonID, Slug: lessonID, DisplayOrder: 1, Enabled: true, ModuleType: "vocabulary", RevisionID: 4, Payload: payload([]any{})},
		{LessonID: lessonID, Slug: lessonID, DisplayOrder: 1, Enabled: true, ModuleType: "practice", RevisionID: 5, Payload: payload(map[string]any{"listening": []any{}, "speaking": []any{}, "reading": []any{}})},
		{LessonID: lessonID, Slug: lessonID, DisplayOrder: 1, Enabled: true, ModuleType: "reviewCards", RevisionID: 6, Payload: payload([]any{})},
	}
}

func doRequest(handler http.Handler, method, path string) *httptest.ResponseRecorder {
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(method, path, nil)
	handler.ServeHTTP(rec, req)
	return rec
}

func TestCourseHandlerOK(t *testing.T) {
	store := &fakeStore{courseRows: lessonFixtureRows("self-intro")}
	rec := doRequest(NewCourseHandler(store), http.MethodGet, "/api/content/course")
	if rec.Code != http.StatusOK {
		t.Fatalf("code = %d, want 200", rec.Code)
	}
	if got := rec.Header().Get("Cache-Control"); got != publicCacheControl {
		t.Fatalf("cache-control = %q, want %q", got, publicCacheControl)
	}
	var body map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	lessons, _ := body["lessons"].([]any)
	if len(lessons) != 1 {
		t.Fatalf("lessons = %d, want 1", len(lessons))
	}
}

func TestCourseHandlerMethodNotAllowed(t *testing.T) {
	store := &fakeStore{courseRows: lessonFixtureRows("self-intro")}
	rec := doRequest(NewCourseHandler(store), http.MethodPost, "/api/content/course")
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("code = %d, want 405", rec.Code)
	}
	if got := rec.Header().Get("Allow"); got != "GET" {
		t.Fatalf("allow = %q, want GET", got)
	}
	var body map[string]string
	_ = json.Unmarshal(rec.Body.Bytes(), &body)
	if body["error"] != "Method not allowed" {
		t.Fatalf("body = %v", body)
	}
}

func TestCourseHandlerStoreNotConfigured(t *testing.T) {
	rec := doRequest(NewCourseHandler(nil), http.MethodGet, "/api/content/course")
	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("code = %d, want 503", rec.Code)
	}
	var body map[string]string
	_ = json.Unmarshal(rec.Body.Bytes(), &body)
	if body["error"] != "Published content database is not configured" {
		t.Fatalf("body = %v", body)
	}
}

func TestCourseHandlerStoreError(t *testing.T) {
	store := &fakeStore{courseErr: errors.New("boom")}
	rec := doRequest(NewCourseHandler(store), http.MethodGet, "/api/content/course")
	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("code = %d, want 500", rec.Code)
	}
	var body map[string]string
	_ = json.Unmarshal(rec.Body.Bytes(), &body)
	if body["error"] != "Unable to read published content" {
		t.Fatalf("body = %v", body)
	}
}

func TestLessonHandlerOK(t *testing.T) {
	store := &fakeStore{lessonRows: lessonFixtureRows("self-intro")}
	rec := doRequest(NewLessonHandler(store), http.MethodGet, "/api/content/lessons?lessonId=self-intro")
	if rec.Code != http.StatusOK {
		t.Fatalf("code = %d, want 200", rec.Code)
	}
	if store.lastLesson != "self-intro" {
		t.Fatalf("lastLesson = %q, want self-intro", store.lastLesson)
	}
	if got := rec.Header().Get("Cache-Control"); got != publicCacheControl {
		t.Fatalf("cache-control = %q", got)
	}
	var body map[string]any
	_ = json.Unmarshal(rec.Body.Bytes(), &body)
	if body["id"] != "self-intro" {
		t.Fatalf("id = %v", body["id"])
	}
}

func TestLessonHandlerMissingLessonID(t *testing.T) {
	store := &fakeStore{}
	rec := doRequest(NewLessonHandler(store), http.MethodGet, "/api/content/lessons")
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("code = %d, want 400", rec.Code)
	}
	var body map[string]string
	_ = json.Unmarshal(rec.Body.Bytes(), &body)
	if body["error"] != "Missing lessonId" {
		t.Fatalf("body = %v", body)
	}
}

func TestLessonHandlerNotFound(t *testing.T) {
	store := &fakeStore{lessonRows: nil}
	rec := doRequest(NewLessonHandler(store), http.MethodGet, "/api/content/lessons?lessonId=missing")
	if rec.Code != http.StatusNotFound {
		t.Fatalf("code = %d, want 404", rec.Code)
	}
	var body map[string]string
	_ = json.Unmarshal(rec.Body.Bytes(), &body)
	if body["error"] != "Published lesson not found" {
		t.Fatalf("body = %v", body)
	}
}

func TestLessonHandlerMethodNotAllowed(t *testing.T) {
	store := &fakeStore{}
	rec := doRequest(NewLessonHandler(store), http.MethodPut, "/api/content/lessons?lessonId=self-intro")
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("code = %d, want 405", rec.Code)
	}
}

func TestMuxRoutes(t *testing.T) {
	mux := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		Handler(w, r)
	})

	rec := doRequest(mux, http.MethodGet, "/api/content/course/")
	if rec.Code == http.StatusNotFound {
		// Route through to course handler; store nil => 503 not 404, proving route matched.
	}
	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("mux course with trailing slash code = %d, want 503 (route matched)", rec.Code)
	}

	rec = doRequest(mux, http.MethodGet, "/api/content/nope")
	if rec.Code != http.StatusNotFound {
		t.Fatalf("mux unknown path code = %d, want 404", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), "Not found") {
		t.Fatalf("body = %q, want Not found", rec.Body.String())
	}
}
