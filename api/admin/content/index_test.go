package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHandlerReturns503WithoutDatabase(t *testing.T) {
	t.Setenv("MYSQL_DATABASE_URL", "")
	t.Setenv("MYSQL_URL", "")
	t.Setenv("DATABASE_URL", "")

	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/admin/content/lessons", nil)
	Handler(rec, req)

	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want 503", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), "Content admin database is not configured") {
		t.Fatalf("body = %s", rec.Body.String())
	}
}
