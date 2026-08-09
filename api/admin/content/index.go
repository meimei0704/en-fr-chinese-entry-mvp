package handler

import (
	"net/http"

	"en-fr-chinese-entry-mvp/pkg/adminhttp"
	"en-fr-chinese-entry-mvp/pkg/adminrepo"
	"en-fr-chinese-entry-mvp/pkg/contentenv"
	"en-fr-chinese-entry-mvp/pkg/httpx"
)

// Handler is the single-entry Vercel Function for the admin content API. It
// lazily resolves the shared MySQL admin store and dispatches the four admin
// endpoints (lessons/draft/publish/rollback) via adminhttp.New.
func Handler(w http.ResponseWriter, r *http.Request) {
	store, err := contentenv.AdminStore()
	if err != nil {
		_ = httpx.WriteError(w, http.StatusServiceUnavailable, "Content admin database is not configured")
		return
	}
	adminhttp.New(adminrepo.New(store), contentenv.AdminAuthEnv()).ServeHTTP(w, r)
}
