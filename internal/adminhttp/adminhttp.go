package adminhttp

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"en-fr-chinese-entry-mvp/internal/adminrepo"
	"en-fr-chinese-entry-mvp/internal/auth"
	"en-fr-chinese-entry-mvp/internal/contentstore"
	"en-fr-chinese-entry-mvp/internal/httpx"
)

// Repository is the subset of adminrepo.Repository needed by the admin HTTP
// handlers, enabling injection of a fake repository in tests.
type Repository interface {
	ListLessons(ctx context.Context) ([]adminrepo.AdminLessonSummary, error)
	GetLessonSnapshot(ctx context.Context, lessonID string) (*adminrepo.AdminLessonSnapshot, error)
	SaveDraftModule(ctx context.Context, input adminrepo.SaveDraftModuleInput) (*adminrepo.AdminLessonSnapshot, error)
	PublishModule(ctx context.Context, input adminrepo.PublishModuleInput) (*adminrepo.AdminLessonSnapshot, error)
	RollbackModule(ctx context.Context, input adminrepo.RollbackModuleInput) (*adminrepo.AdminLessonSnapshot, error)
}

const transientAdminConnectRetryDelay = 120 * time.Millisecond

// New builds the single admin content HTTP handler that dispatches the four
// admin endpoints by URL path.
func New(repo Repository, env auth.Env) http.Handler {
	return &handler{repo: repo, authEnv: env}
}

type handler struct {
	repo    Repository
	authEnv auth.Env
}

func (h *handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	switch strings.TrimSuffix(r.URL.Path, "/") {
	case "/api/admin/content/lessons":
		h.lessons(w, r)
	case "/api/admin/content/draft":
		h.draft(w, r)
	case "/api/admin/content/publish":
		h.publish(w, r)
	case "/api/admin/content/rollback":
		h.rollback(w, r)
	default:
		_ = httpx.WriteError(w, http.StatusNotFound, "Not found")
	}
}

func (h *handler) requireMethod(w http.ResponseWriter, r *http.Request, method string) bool {
	if r.Method != method {
		w.Header().Set("Allow", method)
		_ = httpx.WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return false
	}
	return true
}

func (h *handler) requireAuth(w http.ResponseWriter, r *http.Request) bool {
	if err := auth.RequireAdminAuthorization(r, h.authEnv); err != nil {
		h.mapError(w, r, err)
		return false
	}
	return true
}

func (h *handler) lessons(w http.ResponseWriter, r *http.Request) {
	if !h.requireMethod(w, r, http.MethodGet) {
		return
	}
	if !h.requireAuth(w, r) {
		return
	}

	var body any
	var err error
	if lessonID := r.URL.Query().Get("lessonId"); lessonID != "" {
		body, err = h.retryTransient(func() (any, error) {
			return h.repo.GetLessonSnapshot(r.Context(), lessonID)
		})
	} else {
		body, err = h.retryTransient(func() (any, error) {
			return h.repo.ListLessons(r.Context())
		})
	}
	if err != nil {
		h.mapError(w, r, err)
		return
	}
	_ = httpx.WriteJSON(w, http.StatusOK, body)
}

func (h *handler) draft(w http.ResponseWriter, r *http.Request) {
	if !h.requireMethod(w, r, http.MethodPut) {
		return
	}
	if !h.requireAuth(w, r) {
		return
	}
	body, ok := parseBody(w, r)
	if !ok {
		return
	}
	lessonID, ok := requireString(w, body, "lessonId")
	if !ok {
		return
	}
	moduleType, ok := requireString(w, body, "moduleType")
	if !ok {
		return
	}
	result, err := h.repo.SaveDraftModule(r.Context(), adminrepo.SaveDraftModuleInput{
		LessonID:   lessonID,
		ModuleType: moduleType,
		Payload:    body["payload"],
		CreatedBy:  "admin-ui",
		Note:       optionalString(body["note"]),
	})
	if err != nil {
		h.mapError(w, r, err)
		return
	}
	_ = httpx.WriteJSON(w, http.StatusOK, result)
}

func (h *handler) publish(w http.ResponseWriter, r *http.Request) {
	if !h.requireMethod(w, r, http.MethodPost) {
		return
	}
	if !h.requireAuth(w, r) {
		return
	}
	body, ok := parseBody(w, r)
	if !ok {
		return
	}
	lessonID, ok := requireString(w, body, "lessonId")
	if !ok {
		return
	}
	moduleType, ok := requireString(w, body, "moduleType")
	if !ok {
		return
	}
	result, err := h.repo.PublishModule(r.Context(), adminrepo.PublishModuleInput{
		LessonID:   lessonID,
		ModuleType: moduleType,
		CreatedBy:  "admin-ui",
		Note:       optionalString(body["note"]),
	})
	if err != nil {
		h.mapError(w, r, err)
		return
	}
	_ = httpx.WriteJSON(w, http.StatusOK, result)
}

func (h *handler) rollback(w http.ResponseWriter, r *http.Request) {
	if !h.requireMethod(w, r, http.MethodPost) {
		return
	}
	if !h.requireAuth(w, r) {
		return
	}
	body, ok := parseBody(w, r)
	if !ok {
		return
	}
	lessonID, ok := requireString(w, body, "lessonId")
	if !ok {
		return
	}
	moduleType, ok := requireString(w, body, "moduleType")
	if !ok {
		return
	}
	publishedRevisionID, ok := requireNumber(w, body, "publishedRevisionId")
	if !ok {
		return
	}
	result, err := h.repo.RollbackModule(r.Context(), adminrepo.RollbackModuleInput{
		PublishModuleInput: adminrepo.PublishModuleInput{
			LessonID:   lessonID,
			ModuleType: moduleType,
			CreatedBy:  "admin-ui",
			Note:       optionalString(body["note"]),
		},
		PublishedRevisionID: publishedRevisionID,
	})
	if err != nil {
		h.mapError(w, r, err)
		return
	}
	_ = httpx.WriteJSON(w, http.StatusOK, result)
}

// retryTransient runs fn, retrying once when it fails with a transient MySQL
// connect timeout (mirrors retryTransientAdminConnectTimeout).
func (h *handler) retryTransient(fn func() (any, error)) (any, error) {
	value, err := fn()
	if err == nil || !isTransientMysqlConnectTimeout(err) {
		return value, err
	}
	time.Sleep(transientAdminConnectRetryDelay)
	return fn()
}

func parseBody(w http.ResponseWriter, r *http.Request) (map[string]json.RawMessage, bool) {
	data, err := io.ReadAll(r.Body)
	if err != nil {
		_ = httpx.WriteError(w, http.StatusBadRequest, "Invalid JSON request body")
		return nil, false
	}
	body := map[string]json.RawMessage{}
	if len(data) > 0 {
		if err := json.Unmarshal(data, &body); err != nil {
			_ = httpx.WriteError(w, http.StatusBadRequest, "Invalid JSON request body")
			return nil, false
		}
	}
	return body, true
}

func requireString(w http.ResponseWriter, body map[string]json.RawMessage, field string) (string, bool) {
	raw, ok := body[field]
	if !ok {
		_ = httpx.WriteError(w, http.StatusBadRequest, "Missing "+field)
		return "", false
	}
	var value string
	if err := json.Unmarshal(raw, &value); err != nil || strings.TrimSpace(value) == "" {
		_ = httpx.WriteError(w, http.StatusBadRequest, "Missing "+field)
		return "", false
	}
	return value, true
}

func requireNumber(w http.ResponseWriter, body map[string]json.RawMessage, field string) (int64, bool) {
	raw, ok := body[field]
	if !ok {
		_ = httpx.WriteError(w, http.StatusBadRequest, "Missing "+field)
		return 0, false
	}
	var value json.Number
	if err := json.Unmarshal(raw, &value); err != nil {
		_ = httpx.WriteError(w, http.StatusBadRequest, "Missing "+field)
		return 0, false
	}
	parsed, err := strconv.ParseInt(string(value), 10, 64)
	if err != nil {
		_ = httpx.WriteError(w, http.StatusBadRequest, "Missing "+field)
		return 0, false
	}
	return parsed, true
}

func optionalString(raw json.RawMessage) *string {
	if len(raw) == 0 {
		return nil
	}
	var value string
	if err := json.Unmarshal(raw, &value); err != nil {
		return nil
	}
	return &value
}

func (h *handler) mapError(w http.ResponseWriter, r *http.Request, err error) {
	var validationErr *adminrepo.ValidationError
	var notFoundErr *adminrepo.NotFoundError

	switch {
	case errors.Is(err, contentstore.ErrMissingDatabaseURL):
		_ = httpx.WriteError(w, http.StatusServiceUnavailable, "Content admin database is not configured")
	case errors.Is(err, auth.ErrAuthNotConfigured):
		_ = httpx.WriteError(w, http.StatusServiceUnavailable, "Content admin authentication is not configured")
	case errors.Is(err, auth.ErrUnauthorized):
		if auth.ShouldSendBrowserAuthChallenge(r) {
			w.Header().Set("WWW-Authenticate", `Basic realm="Content Admin"`)
		}
		_ = httpx.WriteError(w, http.StatusUnauthorized, "Admin authentication required")
	case errors.As(err, &validationErr):
		_ = httpx.WriteError(w, http.StatusBadRequest, validationErr.Message)
	case errors.As(err, &notFoundErr):
		_ = httpx.WriteError(w, http.StatusNotFound, notFoundErr.Message)
	case errors.Is(err, adminrepo.ErrPublishedRevisionNotFound):
		_ = httpx.WriteError(w, http.StatusNotFound, err.Error())
	case errors.Is(err, adminrepo.ErrNoUnpublishedChanges):
		_ = httpx.WriteError(w, http.StatusConflict, err.Error())
	default:
		logUnexpectedAdminError(err)
		_ = httpx.WriteError(w, http.StatusInternalServerError, "Unable to process content admin request")
	}
}

// adminConnError is a testable stand-in for a mysql connect timeout carrying
// the ETIMEDOUT/code semantics checked by isTransientMysqlConnectTimeout.
type adminConnError struct {
	message string
	code    string
	syscall string
}

func (e *adminConnError) Error() string { return e.message }

func isTransientMysqlConnectTimeout(err error) bool {
	var connErr *adminConnError
	if errors.As(err, &connErr) {
		if connErr.code == "ETIMEDOUT" && connErr.syscall == "connect" {
			return true
		}
		return strings.Contains(connErr.message, "connect ETIMEDOUT")
	}
	var netErr *net.OpError
	if errors.As(err, &netErr) && strings.Contains(netErr.Error(), "ETIMEDOUT") {
		return true
	}
	return strings.Contains(err.Error(), "connect ETIMEDOUT")
}

var (
	schemeCredentialRe = regexp.MustCompile(`(?i)\b(mysql|mariadb|postgres(?:ql)?):\/\/[^@\s]+@`)
	bearerRe           = regexp.MustCompile(`(?i)\b(Basic|Bearer)\s+[A-Za-z0-9._~+/=-]+`)
	querySecretRe      = regexp.MustCompile(`(?i)([?&](?:access[_-]?token|api[_-]?key|auth|password|secret|token)=)[^&\s)]+`)
	colonSecretRe      = regexp.MustCompile(`(?i)\b(authorization|password|passwd|pwd|secret|token|api[_-]?key)(\s*[:=]\s*['"]?)[^'",\s)]+`)
)

func sanitizeDiagnosticText(value string) string {
	value = schemeCredentialRe.ReplaceAllString(value, "$1://[redacted]@")
	value = bearerRe.ReplaceAllString(value, "$1 [redacted]")
	value = querySecretRe.ReplaceAllString(value, "$1[redacted]")
	value = colonSecretRe.ReplaceAllString(value, "$1$2[redacted]")
	return value
}

func logUnexpectedAdminError(err error) {
	message := err.Error()
	if sanitized := sanitizeDiagnosticText(message); sanitized != "" {
		message = sanitized
	}
	log.Printf("[content-admin] unexpected error %s", fmt.Sprintf("message=%q", message))
}
