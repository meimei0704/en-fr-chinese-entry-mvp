package contentstore

import (
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestListPublishedCourseModules(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"lessonId", "slug", "displayOrder", "enabled", "moduleType", "revisionId", "payload"}).
		AddRow("self-intro", "self-intro", 1, true, "lessonMeta", 1, `{"id":"self-intro","title":{"en":"Intro","fr":"Intro"},"scenario":{"en":"S","fr":"S"}}`)
	mock.ExpectQuery("select l\\.lesson_id as lessonId").WillReturnRows(rows)

	store := New(db)
	result, err := store.ListPublishedCourseModules()
	if err != nil {
		t.Fatalf("ListPublishedCourseModules: %v", err)
	}
	if len(result) != 1 || result[0].LessonID != "self-intro" || result[0].Enabled != true {
		t.Fatalf("result = %+v", result)
	}
	if result[0].Payload == nil {
		t.Fatal("payload should be json.RawMessage")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestListPublishedLessonModules(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows([]string{"lessonId", "slug", "displayOrder", "enabled", "moduleType", "revisionId", "payload"}).
		AddRow("self-intro", "self-intro", 1, true, "lessonMeta", 1, `{"id":"self-intro"}`)
	mock.ExpectQuery("select l\\.lesson_id as lessonId").WithArgs("self-intro").WillReturnRows(rows)

	store := New(db)
	result, err := store.ListPublishedLessonModules("self-intro")
	if err != nil {
		t.Fatalf("ListPublishedLessonModules: %v", err)
	}
	if len(result) != 1 || result[0].LessonID != "self-intro" {
		t.Fatalf("result = %+v", result)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestResolveDatabaseURL(t *testing.T) {
	cases := []struct {
		env  Env
		want string
	}{
		{Env{MYSQLDatabaseURL: "a", MYSQLURL: "b", DatabaseURL: "c"}, "a"},
		{Env{MYSQLURL: "b"}, "b"},
		{Env{DatabaseURL: "c"}, "c"},
		{Env{}, ""},
	}
	for _, c := range cases {
		if got := ResolveDatabaseURL(c.env); got != c.want {
			t.Fatalf("ResolveDatabaseURL(%+v) = %q, want %q", c.env, got, c.want)
		}
	}
}

func TestNormalizeDSN(t *testing.T) {
	cases := []struct {
		name    string
		raw     string
		env     Env
		want    string
		wantErr bool
	}{
		{
			name: "uri scheme to dsn",
			raw:  "mysql://user:pass@db.example.com:4000/content_admin",
			env:  Env{},
			want: "user:pass@tcp(db.example.com:4000)/content_admin?timeout=20s",
		},
		{
			name: "uri default port",
			raw:  "mysql://user:pass@db.example.com/content_admin",
			env:  Env{},
			want: "user:pass@tcp(db.example.com:3306)/content_admin?timeout=20s",
		},
		{
			name: "uri with ssl required appends tls",
			raw:  "mysql://user:pass@db.example.com:4000/content_admin",
			env:  Env{MYSQLSSL: "required"},
			want: "user:pass@tcp(db.example.com:4000)/content_admin?timeout=20s&tls=true",
		},
		{
			name: "uri password with special chars",
			raw:  "mysql://user:p%40ss@db.example.com:4000/content_admin",
			env:  Env{},
			want: "user:p@ss@tcp(db.example.com:4000)/content_admin?timeout=20s",
		},
		{
			name: "plain dsn passes through",
			raw:  "user:pass@tcp(db.example.com:4000)/content_admin",
			env:  Env{},
			want: "user:pass@tcp(db.example.com:4000)/content_admin?timeout=20s",
		},
		{
			name: "plain dsn with ssl required appends tls",
			raw:  "user:pass@tcp(db.example.com:4000)/content_admin",
			env:  Env{MYSQLSSL: "required"},
			want: "user:pass@tcp(db.example.com:4000)/content_admin?timeout=20s&tls=true",
		},
		{
			name: "uri with query param preserved",
			raw:  "mysql://user:pass@db.example.com:4000/content_admin?charset=utf8mb4",
			env:  Env{},
			want: "user:pass@tcp(db.example.com:4000)/content_admin?timeout=20s&charset=utf8mb4",
		},
		{
			name:    "empty raw",
			raw:     "",
			env:     Env{},
			wantErr: true,
		},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			got, err := normalizeDSN(c.raw, c.env)
			if c.wantErr {
				if err == nil {
					t.Fatalf("normalizeDSN(%q) = %q, want err", c.raw, got)
				}
				return
			}
			if err != nil {
				t.Fatalf("normalizeDSN(%q): %v", c.raw, err)
			}
			if got != c.want {
				t.Fatalf("normalizeDSN(%q) = %q, want %q", c.raw, got, c.want)
			}
		})
	}
}

func TestNormalizeDSNAppliesConnectTimeout(t *testing.T) {
	got, err := normalizeDSN("mysql://user:pass@db.example.com:4000/content_admin", Env{MYSQLConnectTimeoutMS: "5000"})
	if err != nil {
		t.Fatalf("normalizeDSN: %v", err)
	}
	if !strings.Contains(got, "timeout=5s") {
		t.Fatalf("dsn = %q, want timeout=5s", got)
	}
}

func TestEnvFromMap(t *testing.T) {
	env := EnvFromMap(map[string]string{
		"MYSQL_DATABASE_URL":       "mysql://a/content",
		"MYSQL_URL":                "mysql://b/content",
		"DATABASE_URL":             "mysql://c/content",
		"MYSQL_SSL":                "required",
		"MYSQL_CONNECT_TIMEOUT_MS": "3000",
	})
	if env.MYSQLDatabaseURL != "mysql://a/content" || env.MYSQLURL != "mysql://b/content" || env.DatabaseURL != "mysql://c/content" {
		t.Fatalf("EnvFromMap url fields = %+v", env)
	}
	if env.MYSQLSSL != "required" || env.MYSQLConnectTimeoutMS != "3000" {
		t.Fatalf("EnvFromMap ssl/timeout = %+v", env)
	}
}

func TestOpenMissingDatabaseURL(t *testing.T) {
	if _, err := Open(Env{}); err != ErrMissingDatabaseURL {
		t.Fatalf("Open(empty) err = %v, want ErrMissingDatabaseURL", err)
	}
}

func TestOpenInvalidURI(t *testing.T) {
	if _, err := Open(Env{MYSQLDatabaseURL: "://bad%url"}); err == nil {
		t.Fatal("Open(invalid uri) should error")
	}
}

func TestOpenInvalidPlainDSN(t *testing.T) {
	if _, err := Open(Env{MYSQLDatabaseURL: "no-dsn-here"}); err == nil {
		t.Fatal("Open(invalid dsn) should error")
	}
}

func TestOpenValidDSN(t *testing.T) {
	db, err := Open(Env{MYSQLDatabaseURL: "mysql://user:pass@db.example.com:4000/content_admin"})
	if err != nil {
		t.Fatalf("Open(valid) err = %v", err)
	}
	defer db.Close()
}
