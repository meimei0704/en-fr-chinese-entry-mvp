package contentstore

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/go-sql-driver/mysql"
)

var ErrMissingDatabaseURL = errors.New("missing MySQL connection env. Expected MYSQL_DATABASE_URL, MYSQL_URL, or DATABASE_URL")

const defaultMysqlConnectTimeoutMS = 20_000

type Env struct {
	MYSQLDatabaseURL      string
	MYSQLURL              string
	DatabaseURL           string
	MYSQLSSL              string
	MYSQLConnectTimeoutMS string
}

func ResolveDatabaseURL(env Env) string {
	if env.MYSQLDatabaseURL != "" {
		return env.MYSQLDatabaseURL
	}
	if env.MYSQLURL != "" {
		return env.MYSQLURL
	}
	return env.DatabaseURL
}

func EnvFromMap(v map[string]string) Env {
	return Env{
		MYSQLDatabaseURL:      v["MYSQL_DATABASE_URL"],
		MYSQLURL:              v["MYSQL_URL"],
		DatabaseURL:           v["DATABASE_URL"],
		MYSQLSSL:              v["MYSQL_SSL"],
		MYSQLConnectTimeoutMS: v["MYSQL_CONNECT_TIMEOUT_MS"],
	}
}

func resolveConnectTimeoutMS(env Env) int {
	configured, err := strconv.Atoi(env.MYSQLConnectTimeoutMS)
	if err != nil || configured <= 0 {
		return defaultMysqlConnectTimeoutMS
	}
	return configured
}

// normalizeDSN converts the configured connection string into a
// go-sql-driver/mysql DSN. The Vercel/PlanetScale-style connection strings use
// the mysql://user:pass@host:port/db URI scheme, which sql.Open("mysql", ...)
// does not accept, so a URI is parsed and rebuilt as user:pass@tcp(host:port)/db.
// MYSQL_SSL=required is mapped to tls=true (matching mysql2 ssl rejectUnauthorized).
func normalizeDSN(raw string, env Env) (string, error) {
	if raw == "" {
		return "", ErrMissingDatabaseURL
	}

	var cfg *mysql.Config
	if strings.HasPrefix(raw, "mysql://") {
		u, err := url.Parse(raw)
		if err != nil {
			return "", fmt.Errorf("parse database url: %w", err)
		}
		host := u.Host
		if !strings.Contains(host, ":") {
			host += ":3306"
		}
		password := ""
		if u.User != nil {
			password, _ = u.User.Password()
		}
		cfg = mysql.NewConfig()
		cfg.Params = make(map[string]string)
		cfg.User = u.User.Username()
		cfg.Passwd = password
		cfg.Net = "tcp"
		cfg.Addr = host
		cfg.DBName = strings.TrimPrefix(u.Path, "/")
		for key, values := range u.Query() {
			cfg.Params[key] = values[len(values)-1]
		}
	} else {
		parsed, err := mysql.ParseDSN(raw)
		if err != nil {
			return "", fmt.Errorf("parse dsn: %w", err)
		}
		cfg = parsed
	}

	if env.MYSQLSSL == "required" {
		cfg.TLSConfig = "true"
	}
	cfg.Timeout = time.Duration(resolveConnectTimeoutMS(env)) * time.Millisecond

	return cfg.FormatDSN(), nil
}

// Open builds a go-sql-driver DSN from env and returns a pooled *sql.DB.
func Open(env Env) (*sql.DB, error) {
	raw := ResolveDatabaseURL(env)
	if raw == "" {
		return nil, ErrMissingDatabaseURL
	}
	dsn, err := normalizeDSN(raw, env)
	if err != nil {
		return nil, err
	}
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(4)
	db.SetConnMaxLifetime(5 * time.Minute)
	return db, nil
}

type Store struct {
	db *sql.DB
}

func New(db *sql.DB) *Store { return &Store{db: db} }

type PublishedModuleRow struct {
	LessonID     string
	Slug         string
	DisplayOrder int
	Enabled      bool
	ModuleType   string
	RevisionID   int64
	Payload      json.RawMessage
}

const publishedModuleColumns = `select
  l.lesson_id as lessonId,
  l.slug as slug,
  l.display_order as displayOrder,
  l.enabled as enabled,
  lm.module_type as moduleType,
  mr.revision_id as revisionId,
  mr.payload as payload
from lessons l
join lesson_modules lm on lm.lesson_id = l.lesson_id
join module_revisions mr
  on mr.revision_id = lm.current_published_revision_id
  and mr.revision_kind = 'published'
  and mr.lesson_id = lm.lesson_id
  and mr.module_type = lm.module_type`

func (s *Store) ListPublishedCourseModules() ([]PublishedModuleRow, error) {
	query := publishedModuleColumns + `
where l.enabled = true
order by l.display_order asc, l.lesson_id asc, lm.module_type asc`
	return collectRows(context.Background(), s.db, query)
}

func (s *Store) ListPublishedLessonModules(lessonID string) ([]PublishedModuleRow, error) {
	query := publishedModuleColumns + `
where l.enabled = true and l.lesson_id = ?
order by l.display_order asc, l.lesson_id asc, lm.module_type asc`
	return collectRows(context.Background(), s.db, query, lessonID)
}

func collectRows(ctx context.Context, db *sql.DB, query string, args ...any) ([]PublishedModuleRow, error) {
	rows, err := db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []PublishedModuleRow
	for rows.Next() {
		var row PublishedModuleRow
		var payload sql.RawBytes
		if err := rows.Scan(
			&row.LessonID,
			&row.Slug,
			&row.DisplayOrder,
			&row.Enabled,
			&row.ModuleType,
			&row.RevisionID,
			&payload,
		); err != nil {
			return nil, err
		}
		if payload != nil {
			row.Payload = make(json.RawMessage, len(payload))
			copy(row.Payload, payload)
		}
		result = append(result, row)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}
