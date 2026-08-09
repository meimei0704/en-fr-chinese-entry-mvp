package httpx

import (
	"encoding/json"
	"net/http/httptest"
	"testing"
)

func TestWriteJSON(t *testing.T) {
	rec := httptest.NewRecorder()
	if err := WriteJSON(rec, 200, map[string]int{"ok": 1}); err != nil {
		t.Fatalf("WriteJSON: %v", err)
	}
	if rec.Code != 200 {
		t.Fatalf("code = %d, want 200", rec.Code)
	}
	if got := rec.Header().Get("Content-Type"); got != "application/json" {
		t.Fatalf("content-type = %q, want application/json", got)
	}
	var body map[string]int
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatalf("unmarshal: %v", err)
	}
	if body["ok"] != 1 {
		t.Fatalf("body = %v, want ok=1", body)
	}
}

func TestWriteError(t *testing.T) {
	rec := httptest.NewRecorder()
	if err := WriteError(rec, 404, "not found"); err != nil {
		t.Fatalf("WriteError: %v", err)
	}
	if rec.Code != 404 {
		t.Fatalf("code = %d, want 404", rec.Code)
	}
	var body map[string]string
	_ = json.Unmarshal(rec.Body.Bytes(), &body)
	if body["error"] != "not found" {
		t.Fatalf("body = %v, want error=not found", body)
	}
}

func TestSetCacheControl(t *testing.T) {
	rec := httptest.NewRecorder()
	SetCacheControl(rec, "s-maxage=60, stale-while-revalidate=300")
	if got := rec.Header().Get("Cache-Control"); got != "s-maxage=60, stale-while-revalidate=300" {
		t.Fatalf("cache-control = %q", got)
	}
}
