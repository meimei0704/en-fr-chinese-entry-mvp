package contentenv

import (
	"os"
	"sync"

	"en-fr-chinese-entry-mvp/internal/contentstore"
)

// Store is the subset of contentstore.Store needed by content API handlers,
// returned as an interface so an unconfigured store is a plain nil interface
// (avoiding the typed-nil-pointer-in-interface gotcha).
type ContentStore interface {
	ListPublishedCourseModules() ([]contentstore.PublishedModuleRow, error)
	ListPublishedLessonModules(lessonID string) ([]contentstore.PublishedModuleRow, error)
}

var (
	storeOnce sync.Once
	storeVal  ContentStore
)

// Store lazily initializes the shared content store from env.
func Store() ContentStore {
	storeOnce.Do(func() {
		env := contentstore.EnvFromMap(EnvMap())
		db, err := contentstore.Open(env)
		if err != nil {
			return
		}
		storeVal = contentstore.New(db)
	})
	return storeVal
}

func EnvMap() map[string]string {
	m := map[string]string{}
	for _, k := range []string{"MYSQL_DATABASE_URL", "MYSQL_URL", "DATABASE_URL", "MYSQL_SSL", "MYSQL_CONNECT_TIMEOUT_MS"} {
		if v := os.Getenv(k); v != "" {
			m[k] = v
		}
	}
	return m
}
