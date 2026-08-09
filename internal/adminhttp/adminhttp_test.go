package adminhttp

import (
	"context"
	"errors"
	"io"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"en-fr-chinese-entry-mvp/internal/adminrepo"
	"en-fr-chinese-entry-mvp/internal/auth"
)

type fakeRepo struct {
	listLessons       func(ctx context.Context) ([]adminrepo.AdminLessonSummary, error)
	getLessonSnapshot func(ctx context.Context, lessonID string) (*adminrepo.AdminLessonSnapshot, error)
	saveDraftModule   func(ctx context.Context, input adminrepo.SaveDraftModuleInput) (*adminrepo.AdminLessonSnapshot, error)
	publishModule     func(ctx context.Context, input adminrepo.PublishModuleInput) (*adminrepo.AdminLessonSnapshot, error)
	rollbackModule    func(ctx context.Context, input adminrepo.RollbackModuleInput) (*adminrepo.AdminLessonSnapshot, error)
	listLessonsCalls  int
}

func (f *fakeRepo) ListLessons(ctx context.Context) ([]adminrepo.AdminLessonSummary, error) {
	f.listLessonsCalls++
	if f.listLessons != nil {
		return f.listLessons(ctx)
	}
	return []adminrepo.AdminLessonSummary{{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, DraftChangedModuleCount: 1}}, nil
}

func (f *fakeRepo) GetLessonSnapshot(ctx context.Context, lessonID string) (*adminrepo.AdminLessonSnapshot, error) {
	if f.getLessonSnapshot != nil {
		return f.getLessonSnapshot(ctx, lessonID)
	}
	return &adminrepo.AdminLessonSnapshot{LessonID: lessonID}, nil
}

func (f *fakeRepo) SaveDraftModule(ctx context.Context, input adminrepo.SaveDraftModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
	if f.saveDraftModule != nil {
		return f.saveDraftModule(ctx, input)
	}
	return &adminrepo.AdminLessonSnapshot{LessonID: input.LessonID}, nil
}

func (f *fakeRepo) PublishModule(ctx context.Context, input adminrepo.PublishModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
	if f.publishModule != nil {
		return f.publishModule(ctx, input)
	}
	return &adminrepo.AdminLessonSnapshot{LessonID: input.LessonID}, nil
}

func (f *fakeRepo) RollbackModule(ctx context.Context, input adminrepo.RollbackModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
	if f.rollbackModule != nil {
		return f.rollbackModule(ctx, input)
	}
	return &adminrepo.AdminLessonSnapshot{LessonID: input.LessonID}, nil
}

var adminAuthEnv = auth.Env{ContentAdminUsername: "editor", ContentAdminPassword: "secret"}

const basicAuth = "Basic ZWRpdG9yOnNlY3JldA=="

func newTestHandler(repo Repository, env auth.Env) http.Handler {
	return New(repo, env)
}

func doRequest(t *testing.T, handler http.Handler, method, path string, headers map[string]string, body string) *httptest.ResponseRecorder {
	t.Helper()
	var reader io.Reader
	if body != "" {
		reader = strings.NewReader(body)
	}
	req := httptest.NewRequest(method, path, reader)
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	return rec
}

func TestLessonsListAndDetail(t *testing.T) {
	repo := &fakeRepo{}
	handler := newTestHandler(repo, adminAuthEnv)

	list := doRequest(t, handler, http.MethodGet, "/api/admin/content/lessons", map[string]string{"Authorization": basicAuth}, "")
	if list.Code != http.StatusOK {
		t.Fatalf("list status = %d, want 200", list.Code)
	}
	if repo.listLessonsCalls != 1 {
		t.Fatalf("listLessons calls = %d, want 1", repo.listLessonsCalls)
	}

	detail := doRequest(t, handler, http.MethodGet, "/api/admin/content/lessons?lessonId=self-intro", map[string]string{"Authorization": basicAuth}, "")
	if detail.Code != http.StatusOK {
		t.Fatalf("detail status = %d, want 200", detail.Code)
	}
	if !strings.Contains(detail.Body.String(), `"lessonId":"self-intro"`) {
		t.Fatalf("detail body = %s", detail.Body.String())
	}
}

func TestLessonsRetriesTransientTimeoutOnce(t *testing.T) {
	transient := &adminConnError{message: "connect ETIMEDOUT"}
	calls := 0
	repo := &fakeRepo{
		listLessons: func(ctx context.Context) ([]adminrepo.AdminLessonSummary, error) {
			calls++
			if calls == 1 {
				return nil, transient
			}
			return []adminrepo.AdminLessonSummary{{LessonID: "self-intro"}}, nil
		},
	}
	handler := newTestHandler(repo, adminAuthEnv)

	rec := doRequest(t, handler, http.MethodGet, "/api/admin/content/lessons", map[string]string{"Authorization": basicAuth}, "")
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want 200", rec.Code)
	}
	if calls != 2 {
		t.Fatalf("listLessons calls = %d, want 2 (one retry)", calls)
	}
}

func TestDraftPublishRollback(t *testing.T) {
	var saved *adminrepo.SaveDraftModuleInput
	var published *adminrepo.PublishModuleInput
	var rolledBack *adminrepo.RollbackModuleInput
	repo := &fakeRepo{
		saveDraftModule: func(ctx context.Context, input adminrepo.SaveDraftModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
			saved = &input
			return &adminrepo.AdminLessonSnapshot{LessonID: input.LessonID}, nil
		},
		publishModule: func(ctx context.Context, input adminrepo.PublishModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
			published = &input
			return &adminrepo.AdminLessonSnapshot{LessonID: input.LessonID}, nil
		},
		rollbackModule: func(ctx context.Context, input adminrepo.RollbackModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
			rolledBack = &input
			return &adminrepo.AdminLessonSnapshot{LessonID: input.LessonID}, nil
		},
	}
	handler := newTestHandler(repo, adminAuthEnv)

	draftBody := `{"lessonId":"self-intro","moduleType":"lessonMeta","payload":{"id":"self-intro"},"note":"Save title draft"}`
	draft := doRequest(t, handler, http.MethodPut, "/api/admin/content/draft", map[string]string{"Authorization": basicAuth}, draftBody)
	if draft.Code != http.StatusOK {
		t.Fatalf("draft status = %d, want 200", draft.Code)
	}
	if saved == nil || saved.LessonID != "self-intro" || saved.ModuleType != "lessonMeta" || saved.Note == nil || *saved.Note != "Save title draft" {
		t.Fatalf("saved = %+v", saved)
	}
	if saved.CreatedBy != "admin-ui" {
		t.Fatalf("createdBy = %q, want admin-ui", saved.CreatedBy)
	}

	publishBody := `{"lessonId":"self-intro","moduleType":"lessonMeta","note":"Publish title draft"}`
	pub := doRequest(t, handler, http.MethodPost, "/api/admin/content/publish", map[string]string{"Authorization": basicAuth}, publishBody)
	if pub.Code != http.StatusOK {
		t.Fatalf("publish status = %d, want 200", pub.Code)
	}
	if published == nil || published.LessonID != "self-intro" || published.Note == nil || *published.Note != "Publish title draft" {
		t.Fatalf("published = %+v", published)
	}

	rollbackBody := `{"lessonId":"self-intro","moduleType":"lessonMeta","publishedRevisionId":901,"note":"Rollback title draft"}`
	rb := doRequest(t, handler, http.MethodPost, "/api/admin/content/rollback", map[string]string{"Authorization": basicAuth}, rollbackBody)
	if rb.Code != http.StatusOK {
		t.Fatalf("rollback status = %d, want 200", rb.Code)
	}
	if rolledBack == nil || rolledBack.PublishedRevisionID != 901 {
		t.Fatalf("rolledBack = %+v", rolledBack)
	}
}

func TestErrorMappingAndMethodGuards(t *testing.T) {
	repo := &fakeRepo{
		getLessonSnapshot: func(ctx context.Context, lessonID string) (*adminrepo.AdminLessonSnapshot, error) {
			return nil, &adminrepo.NotFoundError{Message: "Editable lesson not found: " + lessonID}
		},
		saveDraftModule: func(ctx context.Context, input adminrepo.SaveDraftModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
			return nil, &adminrepo.ValidationError{Message: "Invalid lessonMeta payload"}
		},
		publishModule: func(ctx context.Context, input adminrepo.PublishModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
			return nil, adminrepo.ErrNoUnpublishedChanges
		},
		rollbackModule: func(ctx context.Context, input adminrepo.RollbackModuleInput) (*adminrepo.AdminLessonSnapshot, error) {
			return nil, adminrepo.ErrPublishedRevisionNotFound
		},
	}
	handler := newTestHandler(repo, adminAuthEnv)

	methodNotAllowed := doRequest(t, handler, http.MethodPost, "/api/admin/content/lessons", map[string]string{"Authorization": basicAuth}, "")
	if methodNotAllowed.Code != http.StatusMethodNotAllowed {
		t.Fatalf("method not allowed = %d, want 405", methodNotAllowed.Code)
	}
	if allow := methodNotAllowed.Header().Get("Allow"); allow != "GET" {
		t.Fatalf("Allow = %q, want GET", allow)
	}

	badDraft := doRequest(t, handler, http.MethodPut, "/api/admin/content/draft", map[string]string{"Authorization": basicAuth}, `{}`)
	if badDraft.Code != http.StatusBadRequest {
		t.Fatalf("badDraft = %d, want 400", badDraft.Code)
	}

	missingLesson := doRequest(t, handler, http.MethodGet, "/api/admin/content/lessons?lessonId=missing", map[string]string{"Authorization": basicAuth}, "")
	if missingLesson.Code != http.StatusNotFound {
		t.Fatalf("missingLesson = %d, want 404", missingLesson.Code)
	}

	invalidDraft := doRequest(t, handler, http.MethodPut, "/api/admin/content/draft", map[string]string{"Authorization": basicAuth}, `{"lessonId":"self-intro","moduleType":"lessonMeta","payload":{"id":"self-intro"}}`)
	if invalidDraft.Code != http.StatusBadRequest {
		t.Fatalf("invalidDraft = %d, want 400", invalidDraft.Code)
	}

	noChanges := doRequest(t, handler, http.MethodPost, "/api/admin/content/publish", map[string]string{"Authorization": basicAuth}, `{"lessonId":"self-intro","moduleType":"lessonMeta"}`)
	if noChanges.Code != http.StatusConflict {
		t.Fatalf("noChanges = %d, want 409", noChanges.Code)
	}

	missingRevision := doRequest(t, handler, http.MethodPost, "/api/admin/content/rollback", map[string]string{"Authorization": basicAuth}, `{"lessonId":"self-intro","moduleType":"lessonMeta","publishedRevisionId":404}`)
	if missingRevision.Code != http.StatusNotFound {
		t.Fatalf("missingRevision = %d, want 404", missingRevision.Code)
	}
}

func TestAuthRequired(t *testing.T) {
	repo := &fakeRepo{}
	handler := newTestHandler(repo, adminAuthEnv)

	noAuth := doRequest(t, handler, http.MethodGet, "/api/admin/content/lessons", map[string]string{}, "")
	if noAuth.Code != http.StatusUnauthorized {
		t.Fatalf("noAuth = %d, want 401", noAuth.Code)
	}
	if !strings.Contains(noAuth.Header().Get("WWW-Authenticate"), "Basic") {
		t.Fatalf("WWW-Authenticate = %q, want Basic challenge", noAuth.Header().Get("WWW-Authenticate"))
	}
	if repo.listLessonsCalls != 0 {
		t.Fatal("repository should not be reached without auth")
	}

	spa := doRequest(t, handler, http.MethodGet, "/api/admin/content/lessons", map[string]string{"X-Content-Admin-Client": "spa"}, "")
	if spa.Code != http.StatusUnauthorized {
		t.Fatalf("spa = %d, want 401", spa.Code)
	}
	if spa.Header().Get("WWW-Authenticate") != "" {
		t.Fatalf("spa WWW-Authenticate = %q, want empty", spa.Header().Get("WWW-Authenticate"))
	}
}

func TestAuthNotConfiguredReturns503(t *testing.T) {
	repo := &fakeRepo{}
	handler := newTestHandler(repo, auth.Env{})

	rec := doRequest(t, handler, http.MethodGet, "/api/admin/content/lessons", map[string]string{"Authorization": basicAuth}, "")
	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, want 503", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), "authentication is not configured") {
		t.Fatalf("body = %s", rec.Body.String())
	}
}

func TestMalformedJSONReturns400(t *testing.T) {
	repo := &fakeRepo{}
	handler := newTestHandler(repo, adminAuthEnv)

	rec := doRequest(t, handler, http.MethodPut, "/api/admin/content/draft", map[string]string{"Authorization": basicAuth}, `{"lessonId":"self-intro"`)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want 400", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), "Invalid JSON request body") {
		t.Fatalf("body = %s", rec.Body.String())
	}
}

func TestUnexpectedErrorReturns500(t *testing.T) {
	repo := &fakeRepo{
		listLessons: func(ctx context.Context) ([]adminrepo.AdminLessonSummary, error) {
			return nil, errors.New("unexpected boom")
		},
	}
	handler := newTestHandler(repo, adminAuthEnv)

	rec := doRequest(t, handler, http.MethodGet, "/api/admin/content/lessons", map[string]string{"Authorization": basicAuth}, "")
	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want 500", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), "Unable to process content admin request") {
		t.Fatalf("body = %s", rec.Body.String())
	}
}

func TestUnknownPathReturns404(t *testing.T) {
	handler := newTestHandler(&fakeRepo{}, adminAuthEnv)
	rec := doRequest(t, handler, http.MethodGet, "/api/admin/content/nope", map[string]string{"Authorization": basicAuth}, "")
	if rec.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want 404", rec.Code)
	}
}

func TestSanitizeDiagnosticText(t *testing.T) {
	input := "connect ETIMEDOUT mysql://admin:super-secret@db.example/content_admin?token=abc123 Authorization: Bearer xyz.abc-123"
	sanitized := sanitizeDiagnosticText(input)
	if strings.Contains(sanitized, "super-secret") || strings.Contains(sanitized, "abc123") || strings.Contains(sanitized, "xyz.abc-123") {
		t.Fatalf("sanitized leaked secret: %s", sanitized)
	}
	if !strings.Contains(sanitized, "[redacted]") {
		t.Fatalf("sanitized = %s, want [redacted]", sanitized)
	}
}
