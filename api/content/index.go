package handler

import (
	"net/http"
	"strings"

	"en-fr-chinese-entry-mvp/internal/contentbuild"
	"en-fr-chinese-entry-mvp/internal/contentenv"
	"en-fr-chinese-entry-mvp/internal/contentstore"
	"en-fr-chinese-entry-mvp/internal/httpx"
	"en-fr-chinese-entry-mvp/internal/pinyincontent"
)

const publicCacheControl = "s-maxage=60, stale-while-revalidate=300"

// PublishedStore is the subset of contentstore.Store needed by the public
// read handlers, enabling injection of a fake store in tests.
type PublishedStore interface {
	ListPublishedCourseModules() ([]contentstore.PublishedModuleRow, error)
	ListPublishedLessonModules(lessonID string) ([]contentstore.PublishedModuleRow, error)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	switch strings.TrimSuffix(r.URL.Path, "/") {
	case "/api/content/course":
		NewCourseHandler(contentenv.Store()).ServeHTTP(w, r)
	case "/api/content/lessons":
		NewLessonHandler(contentenv.Store()).ServeHTTP(w, r)
	case "/api/content/pinyin/course":
		NewPinyinCourseHandler().ServeHTTP(w, r)
	default:
		_ = httpx.WriteError(w, http.StatusNotFound, "Not found")
	}
}

func requireGet(w http.ResponseWriter, r *http.Request) bool {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", "GET")
		_ = httpx.WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return false
	}
	return true
}

func NewCourseHandler(store PublishedStore) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !requireGet(w, r) {
			return
		}
		if store == nil {
			_ = httpx.WriteError(w, http.StatusServiceUnavailable, "Published content database is not configured")
			return
		}
		rows, err := store.ListPublishedCourseModules()
		if err != nil {
			_ = httpx.WriteError(w, http.StatusInternalServerError, "Unable to read published content")
			return
		}
		course, err := contentbuild.BuildCourseFromRows(rows)
		if err != nil {
			_ = httpx.WriteError(w, http.StatusInternalServerError, "Unable to read published content")
			return
		}
		httpx.SetCacheControl(w, publicCacheControl)
		_ = httpx.WriteJSON(w, http.StatusOK, course)
	})
}

func NewLessonHandler(store PublishedStore) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !requireGet(w, r) {
			return
		}
		lessonID := r.URL.Query().Get("lessonId")
		if lessonID == "" {
			_ = httpx.WriteError(w, http.StatusBadRequest, "Missing lessonId")
			return
		}
		if store == nil {
			_ = httpx.WriteError(w, http.StatusServiceUnavailable, "Published content database is not configured")
			return
		}
		rows, err := store.ListPublishedLessonModules(lessonID)
		if err != nil {
			_ = httpx.WriteError(w, http.StatusInternalServerError, "Unable to read published content")
			return
		}
		lesson, ok := contentbuild.BuildLessonFromRows(rows)
		if !ok {
			_ = httpx.WriteError(w, http.StatusNotFound, "Published lesson not found")
			return
		}
		httpx.SetCacheControl(w, publicCacheControl)
		_ = httpx.WriteJSON(w, http.StatusOK, lesson)
	})
}

// NewPinyinCourseHandler serves the pinyin course from the embedded static
// JSON (no DB dependency).
func NewPinyinCourseHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !requireGet(w, r) {
			return
		}
		raw, err := pinyincontent.PinyinCourseJSON()
		if err != nil {
			_ = httpx.WriteError(w, http.StatusInternalServerError, "Unable to read pinyin course")
			return
		}
		httpx.SetCacheControl(w, publicCacheControl)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write(raw)
	})
}
