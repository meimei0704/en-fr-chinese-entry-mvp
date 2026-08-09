package contentenv

import (
	"os"
	"sync"

	"en-fr-chinese-entry-mvp/pkg/auth"
	"en-fr-chinese-entry-mvp/pkg/contentstore"
)

var (
	adminOnce     sync.Once
	adminStore    contentstore.AdminStore
	adminStoreErr error
)

// AdminStore lazily initializes the shared admin content store from env,
// mirroring createContentAdminMysqlStoreFromEnv. When the database URL is
// missing, store is nil and the underlying ErrMissingDatabaseURL is returned.
func AdminStore() (contentstore.AdminStore, error) {
	adminOnce.Do(func() {
		env := contentstore.EnvFromMap(EnvMap())
		db, err := contentstore.Open(env)
		if err != nil {
			adminStoreErr = err
			return
		}
		adminStore = contentstore.NewAdminStore(db)
	})
	return adminStore, adminStoreErr
}

// AdminAuthEnv builds auth.Env from the process environment.
func AdminAuthEnv() auth.Env {
	return auth.Env{
		ContentAdminUsername: os.Getenv("CONTENT_ADMIN_USERNAME"),
		ContentAdminPassword: os.Getenv("CONTENT_ADMIN_PASSWORD"),
	}
}
