# Go 后端重构实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 TS Vercel Functions 后端迁移为 Go（Vercel Go Runtime），课程内容（主课程 10 课）走 MySQL + Go API，pinyin 3 课嵌入 Go 二进制；前端 7 页 + `progress.ts`/`journey.ts` 由静态 import 改异步 fetch；语音模块（`src/server/voice/*` + `api/admin/voice/*`）保持 TS 不动。

**Architecture:** Go `internal/` 包（`httpx`、`auth`、`contentstore`、`contentbuild`、`pinyincontent`）+ `api/*.go` Vercel Functions；根 `go.mod` 供 Vercel 识别；`vercel.json` 不变（TS/Go 共存）。API 契约与现状逐字段一致（状态码/JSON/鉴权头），前端 `src/admin/api.ts` 零改动。静态 `course.ts` 保留（seed 源 + 语音 manifest 依赖）。

**Tech Stack:** Go 1.26+、`database/sql` + `go-sqlmock`、`github.com/go-sql-driver/mysql`、Vercel Go Runtime、React 19 + Vite、Vitest 4 + Playwright。

**设计文档:** `docs/superpowers/specs/2026-08-08-go-backend-refactor-design.md`（已评审通过，PR #33）。

---

## 约定

- **契约基准**：TS 现状即真理。Go 行为以 `src/server/content/http.ts`、`adminHttp.ts`、`adminRepository.ts`、`adminStoreMysql.ts`、`repository.ts`、`publicContent.ts` 为蓝本，逐行移植。
- **错误体统一**：`{ "error": "<message>" }`；状态码对照表见各任务。
- **JSON 保真**：`payload` 列以 `[]byte`/`json.RawMessage` 存取，组装课程时原样输出，避免字段顺序/格式漂移。
- **环境变量**：`MYSQL_DATABASE_URL` / `MYSQL_URL` / `DATABASE_URL`、`MYSQL_SSL=required`、`MYSQL_CONNECT_TIMEOUT_MS`、`CONTENT_ADMIN_USERNAME` / `CONTENT_ADMIN_PASSWORD`。
- **测试命令**：`go test ./...`、`go vet ./...`；前端 `npm run test -- --run`、`npx playwright test`、`npm run lint`、`npm run build`。
- **提交粒度**：每任务一 commit，message 前缀 `feat(go):` / `test(go):` / `refactor(frontend):` 等。
- **Go module**：`module github.com/meimei0704/en-fr-chinese-entry-mvp/backend`，或 `module en-fr-chinese-entry-mvp`。采用后者（简短、Vercel 无需网络）。

---

## M1：Go 骨架与基础包

**Files:**
- Create: `go.mod`
- Create: `internal/httpx/httpx.go` + `internal/httpx/httpx_test.go`
- Create: `internal/auth/auth.go` + `internal/auth/auth_test.go`

### Task 1.1: go.mod + Go 目录骨架

- [ ] **Step 1: 创建 go.mod**

```bash
go mod init en-fr-chinese-entry-mvp
go get github.com/go-sql-driver/mysql@latest
go get github.com/DATA-DOG/go-sqlmock@latest
```

- [ ] **Step 2: 验证**

Run: `go build ./...`
Expected: 无输出（无包时 OK）。

- [ ] **Step 3: Commit**

```bash
git add go.mod go.sum
git commit -m "feat(go): init go module for backend refactor"
```

### Task 1.2: internal/httpx — JSON 响应封装

**Files:**
- Create: `internal/httpx/httpx.go`
- Create: `internal/httpx/httpx_test.go`

对应 TS：`src/server/content/http.ts` 的 `ContentApiResponse` 语义 + `adminHttp.ts` 的错误体。

- [ ] **Step 1: 写失败测试**

`internal/httpx/httpx_test.go`:

```go
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
```

- [ ] **Step 2: 运行确认失败**

Run: `go test ./internal/httpx/`
Expected: FAIL（`undefined: WriteJSON`）。

- [ ] **Step 3: 最小实现**

`internal/httpx/httpx.go`:

```go
package httpx

import (
	"encoding/json"
	"net/http"
)

func WriteJSON(w http.ResponseWriter, status int, value any) error {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(value)
}

func WriteError(w http.ResponseWriter, status int, message string) error {
	return WriteJSON(w, status, map[string]string{"error": message})
}

func SetCacheControl(w http.ResponseWriter, value string) {
	w.Header().Set("Cache-Control", value)
}
```

- [ ] **Step 4: 运行确认通过**

Run: `go test ./internal/httpx/`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add internal/httpx/
git commit -m "feat(go): add httpx JSON response helpers"
```

### Task 1.3: internal/auth — Basic Auth（对齐 adminAuth.ts）

**Files:**
- Create: `internal/auth/auth.go`
- Create: `internal/auth/auth_test.go`

对应 TS：`src/server/content/adminAuth.ts`（76 行）。语义：缺 env → 配置缺失；Basic 解码失败/凭据不符 → 未授权；`X-Content-Admin-Client: spa` 时 401 不挑战，否则发 `WWW-Authenticate: Basic realm="Content Admin"`。

- [ ] **Step 1: 写失败测试**

`internal/auth/auth_test.go`:

```go
package auth

import (
	"encoding/base64"
	"net/http"
	"net/http/httptest"
	"testing"
)

func testEnv(username, password string) Env {
	return Env{ContentAdminUsername: username, ContentAdminPassword: password}
}

func basicAuth(user, pass string) string {
	return "Basic " + base64.StdEncoding.EncodeToString([]byte(user+":"+pass))
}

func TestRequireAdminAuthorizationOK(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Authorization", basicAuth("admin", "secret"))
	if err := RequireAdminAuthorization(req, testEnv("admin", "secret")); err != nil {
		t.Fatalf("unexpected err: %v", err)
	}
}

func TestRequireAdminAuthorizationMissingConfig(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	err := RequireAdminAuthorization(req, testEnv("", ""))
	if err == nil || err != ErrAuthNotConfigured {
		t.Fatalf("err = %v, want ErrAuthNotConfigured", err)
	}
}

func TestRequireAdminAuthorizationBadCredentials(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.Header.Set("Authorization", basicAuth("admin", "wrong"))
	err := RequireAdminAuthorization(req, testEnv("admin", "secret"))
	if err == nil || err != ErrUnauthorized {
		t.Fatalf("err = %v, want ErrUnauthorized", err)
	}
}

func TestRequireAdminAuthorizationMissingHeader(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	err := RequireAdminAuthorization(req, testEnv("admin", "secret"))
	if err == nil || err != ErrUnauthorized {
		t.Fatalf("err = %v, want ErrUnauthorized", err)
	}
}

func TestShouldSendBrowserAuthChallenge(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	if !ShouldSendBrowserAuthChallenge(req) {
		t.Fatal("no spa header => want challenge")
	}
	req.Header.Set("X-Content-Admin-Client", "spa")
	if ShouldSendBrowserAuthChallenge(req) {
		t.Fatal("spa header => want no challenge")
	}
}
```

- [ ] **Step 2: 运行确认失败**

Run: `go test ./internal/auth/`
Expected: FAIL（`undefined: Env`）。

- [ ] **Step 3: 最小实现**

`internal/auth/auth.go`:

```go
package auth

import (
	"crypto/subtle"
	"encoding/base64"
	"errors"
	"net/http"
	"strings"
)

var (
	ErrAuthNotConfigured = errors.New("content admin authentication is not configured")
	ErrUnauthorized      = errors.New("admin authentication required")
)

const SpaClientHeader = "X-Content-Admin-Client"

type Env struct {
	ContentAdminUsername string
	ContentAdminPassword string
}

func ShouldSendBrowserAuthChallenge(r *http.Request) bool {
	return r.Header.Get(SpaClientHeader) != "spa"
}

func RequireAdminAuthorization(r *http.Request, env Env) error {
	if env.ContentAdminUsername == "" || env.ContentAdminPassword == "" {
		return ErrAuthNotConfigured
	}
	username, password, ok := decodeBasic(r.Header.Get("Authorization"))
	if !ok || subtle.ConstantTimeCompare([]byte(username), []byte(env.ContentAdminUsername)) != 1 ||
		subtle.ConstantTimeCompare([]byte(password), []byte(env.ContentAdminPassword)) != 1 {
		return ErrUnauthorized
	}
	return nil
}

func decodeBasic(authorization string) (username, password string, ok bool) {
	parts := strings.SplitN(authorization, " ", 2)
	if len(parts) != 2 || parts[0] != "Basic" {
		return "", "", false
	}
	decoded, err := base64.StdEncoding.DecodeString(parts[1])
	if err != nil {
		return "", "", false
	}
	raw := string(decoded)
	idx := strings.IndexByte(raw, ':')
	if idx < 0 {
		return "", "", false
	}
	return raw[:idx], raw[idx+1:], true
}
```

- [ ] **Step 4: 运行确认通过**

Run: `go test ./internal/auth/`
Expected: PASS。

- [ ] **Step 5: 静态检查**

Run: `go vet ./...`
Expected: 无输出。

- [ ] **Step 6: Commit**

```bash
git add internal/auth/
git commit -m "feat(go): add basic auth matching adminAuth.ts semantics"
```

---

## M2：公开读 API（course / lessons）

**Files:**
- Create: `internal/contentstore/store.go`（连接 + 2 读查询）
- Create: `internal/contentstore/store_test.go`（go-sqlmock）
- Create: `internal/contentbuild/build.go` + `internal/contentbuild/build_test.go`
- Create: `api/content/course.go`
- Create: `api/content/lessons.go`

### Task 2.1: contentstore — MySQL 连接 + 公开读查询

**Files:**
- Create: `internal/contentstore/store.go`
- Create: `internal/contentstore/store_test.go`

对应 TS：`src/server/content/repository.ts`（`createMysqlPoolOptions`、`resolveDatabaseUrl`、`ContentMysqlRepository.listPublishedCourseModules` / `listPublishedLessonModules`）。

- [ ] **Step 1: 写失败测试（用 go-sqlmock）**

`internal/contentstore/store_test.go`:

```go
package contentstore

import (
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
	if result[0].Payload == nil || len(result[0].Payload) == 0 {
		t.Fatal("payload should be raw bytes")
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
	}
	for _, c := range cases {
		if got := ResolveDatabaseURL(c.env); got != c.want {
			t.Fatalf("ResolveDatabaseURL(%+v) = %q, want %q", c.env, got, c.want)
		}
	}
}
```

- [ ] **Step 2: 运行确认失败**

Run: `go test ./internal/contentstore/`
Expected: FAIL（`undefined: Env`）。

- [ ] **Step 3: 最小实现**

`internal/contentstore/store.go`:

```go
package contentstore

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var ErrMissingDatabaseURL = errors.New("missing MySQL connection env. Expected MYSQL_DATABASE_URL, MYSQL_URL, or DATABASE_URL")

type Env struct {
	MYSQLDatabaseURL string
	MYSQLURL         string
	DatabaseURL      string
	MYSQLSSL         string
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
		MYSQLDatabaseURL: v["MYSQL_DATABASE_URL"],
		MYSQLURL:         v["MYSQL_URL"],
		DatabaseURL:      v["DATABASE_URL"],
		MYSQLSSL:         v["MYSQL_SSL"],
		MYSQLConnectTimeoutMS: v["MYSQL_CONNECT_TIMEOUT_MS"],
	}
}

func Open(env Env) (*sql.DB, error) {
	dsn := ResolveDatabaseURL(env)
	if dsn == "" {
		return nil, ErrMissingDatabaseURL
	}
	timeout := 20000
	if v := env.MYSQLConnectTimeoutMS; v != "" {
		if n, err := fmt.Sscanf(v, "%d", &timeout); err != nil || n != 1 {
			timeout = 20000
		}
	}
	cfg := dsn
	if env.MYSQLSSL == "required" {
		cfg = cfg + "&tls=true"
	}
	db, err := sql.Open("mysql", cfg)
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
	LessonID    string
	Slug        string
	DisplayOrder int
	Enabled     bool
	ModuleType  string
	RevisionID  int64
	Payload     []byte
}

const publishedModuleQuery = `
select
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
  and mr.module_type = lm.module_type
where l.enabled = true`

func scanPublishedModuleRow(rows *sql.Rows) (PublishedModuleRow, error) {
	var row PublishedModuleRow
	if err := rows.Scan(&row.LessonID, &row.Slug, &row.DisplayOrder, &row.Enabled, &row.ModuleType, &row.RevisionID, &row.Payload); err != nil {
		return row, err
	}
	return row, nil
}

func (s *Store) ListPublishedCourseModules() ([]PublishedModuleRow, error) {
	query := publishedModuleQuery + " order by l.display_order asc, l.lesson_id asc, lm.module_type asc"
	rows, err := s.db.QueryContext(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return collectRows(rows)
}

func (s *Store) ListPublishedLessonModules(lessonID string) ([]PublishedModuleRow, error) {
	query := publishedModuleQuery + " and l.lesson_id = ? order by l.display_order asc, l.lesson_id asc, lm.module_type asc"
	rows, err := s.db.QueryContext(context.Background(), query, lessonID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return collectRows(rows)
}

func collectRows(rows *sql.Rows) ([]PublishedModuleRow, error) {
	var out []PublishedModuleRow
	for rows.Next() {
		row, err := scanPublishedModuleRow(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, row)
	}
	return out, rows.Err()
}

var _ = os.Getenv
```

- [ ] **Step 4: 运行确认通过**

Run: `go test ./internal/contentstore/`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add internal/contentstore/
git commit -m "feat(go): add mysql store with public read queries"
```

> 注：`Open` 的 DSN 拼接需在生产核对（mysql2 URI vs Go DSN）。若 `MYSQL_DATABASE_URL` 是标准 URI 格式（`mysql://user:pass@host:port/db`），go-sql-driver 不直接支持 URI scheme，需在 M2 实施时用 `config.ParseDSN` 转换或要求 Vercel 提供非 URI DSN。**此为实施期需 reviewer 关注的契约点**，见 M2 末"风险"。

### Task 2.2: contentbuild — 行组装（移植 publicContent.ts）

**Files:**
- Create: `internal/contentbuild/build.go`
- Create: `internal/contentbuild/build_test.go`

对应 TS：`src/server/content/publicContent.ts`（79 行）：`buildLessonFromPublishedModuleRows`（六模块齐全否则 null）、`buildCourseFromPublishedModuleRows`（禁用过滤、按 displayOrder 排序、嵌套组装）。

- [ ] **Step 1: 写失败测试**

`internal/contentbuild/build_test.go`:

```go
package contentbuild

import (
	"encoding/json"
	"testing"

	"en-fr-chinese-entry-mvp/internal/contentstore"
)

func fixtureRows() []contentstore.PublishedModuleRow {
	payload := func(v any) []byte {
		b, _ := json.Marshal(v)
		return b
	}
	meta := map[string]any{"id": "self-intro", "title": map[string]string{"en": "Intro", "fr": "Intro"}, "scenario": map[string]string{"en": "S", "fr": "S"}}
	return []contentstore.PublishedModuleRow{
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "lessonMeta", RevisionID: 1, Payload: payload(meta)},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "dialogue", RevisionID: 2, Payload: payload(map[string]any{"title": map[string]string{"en": "D", "fr": "D"}, "lines": []any{}})},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "sentencePatterns", RevisionID: 3, Payload: payload([]any{})},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "vocabulary", RevisionID: 4, Payload: payload([]any{})},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "practice", RevisionID: 5, Payload: payload(map[string]any{"listening": []any{}, "speaking": []any{}, "reading": []any{}})},
		{LessonID: "self-intro", Slug: "self-intro", DisplayOrder: 1, Enabled: true, ModuleType: "reviewCards", RevisionID: 6, Payload: payload([]any{})},
		{LessonID: "disabled-lesson", Slug: "disabled", DisplayOrder: 2, Enabled: false, ModuleType: "lessonMeta", RevisionID: 7, Payload: payload(meta)},
	}
}

func TestBuildLessonComplete(t *testing.T) {
	lesson, ok := BuildLessonFromRows(fixtureRows())
	if !ok || lesson == nil {
		t.Fatal("expected complete lesson")
	}
	if lesson["id"] != "self-intro" {
		t.Fatalf("id = %v", lesson["id"])
	}
}

func TestBuildLessonMissingModule(t *testing.T) {
	rows := fixtureRows()[:5] // 缺 reviewCards
	if lesson, ok := BuildLessonFromRows(rows); ok {
		t.Fatalf("expected nil lesson, got %v", lesson)
	}
}

func TestBuildCourseSkipsDisabled(t *testing.T) {
	course, err := BuildCourseFromRows(fixtureRows())
	if err != nil {
		t.Fatalf("err: %v", err)
	}
	lessons, _ := course["lessons"].([]any)
	if len(lessons) != 1 {
		t.Fatalf("lessons = %d, want 1 (disabled skipped)", len(lessons))
	}
}
```

- [ ] **Step 2: 运行确认失败**

Run: `go test ./internal/contentbuild/`
Expected: FAIL（`undefined: BuildLessonFromRows`）。

- [ ] **Step 3: 最小实现**

`internal/contentbuild/build.go`:

```go
package contentbuild

import (
	"bytes"
	"encoding/json"

	"en-fr-chinese-entry-mvp/internal/contentstore"
)

const estimatedDailyMinutes = 10

var contentModuleTypes = []string{
	"lessonMeta", "dialogue", "sentencePatterns", "vocabulary", "practice", "reviewCards",
}

var supportedExplanationLanguages = []string{"en", "fr"}

// BuildLessonFromRows assembles a LessonContent-like map. It returns nil when
// any of the six modules is missing (mirrors publicContent.ts).
func BuildLessonFromRows(rows []contentstore.PublishedModuleRow) (map[string]any, bool) {
	byModule := make(map[string]contentstore.PublishedModuleRow)
	for _, row := range rows {
		byModule[row.ModuleType] = row
	}
	for _, m := range contentModuleTypes {
		if _, ok := byModule[m]; !ok {
			return nil, false
		}
	}
	meta := byModule["lessonMeta"].Payload
	var metaObj map[string]any
	if err := json.Unmarshal(meta, &metaObj); err != nil {
		return nil, false
	}
	id, idOK := metaObj["id"].(string)
	title, titleOK := metaObj["title"].(map[string]any)
	scenario, scenarioOK := metaObj["scenario"].(map[string]any)
	if !idOK || !titleOK || !scenarioOK {
		return nil, false
	}
	lesson := map[string]any{
		"id":              id,
		"title":           title,
		"scenario":        scenario,
		"dialogue":        rawJSON(byModule["dialogue"].Payload),
		"sentencePatterns": rawJSON(byModule["sentencePatterns"].Payload),
		"vocabulary":      rawJSON(byModule["vocabulary"].Payload),
		"practice":        rawJSON(byModule["practice"].Payload),
		"reviewCards":     rawJSON(byModule["reviewCards"].Payload),
	}
	return lesson, true
}

// rawJSON returns the parsed JSON value preserving the original encoding.
func rawJSON(b []byte) any {
	var v any
	if err := json.Unmarshal(b, &v); err != nil {
		return nil
	}
	return v
}

func groupByLesson(rows []contentstore.PublishedModuleRow) [][]contentstore.PublishedModuleRow {
	groups := map[string][]contentstore.PublishedModuleRow{}
	var order []string
	for _, row := range rows {
		if !row.Enabled {
			continue
		}
		if _, ok := groups[row.LessonID]; !ok {
			order = append(order, row.LessonID)
		}
		groups[row.LessonID] = append(groups[row.LessonID], row)
	}
	out := make([][]contentstore.PublishedModuleRow, 0, len(order))
	for _, id := range order {
		out = append(out, groups[id])
	}
	return out
}

func BuildCourseFromRows(rows []contentstore.PublishedModuleRow) (map[string]any, error) {
	var lessons []any
	for _, group := range groupByLesson(rows) {
		if lesson, ok := BuildLessonFromRows(group); ok {
			lessons = append(lessons, lesson)
		}
	}
	course := map[string]any{
		"supportedExplanationLanguages": supportedExplanationLanguages,
		"estimatedDailyMinutes":         estimatedDailyMinutes,
		"lessons":                       lessons,
	}
	return course, nil
}

var _ = bytes.Equal
```

- [ ] **Step 4: 运行确认通过**

Run: `go test ./internal/contentbuild/`
Expected: PASS。

- [ ] **Step 5: 契约对比（临时脚本）**

在 M2 末统一做 TS↔Go 字节对比，此处仅保证单测通过。

- [ ] **Step 6: Commit**

```bash
git add internal/contentbuild/
git commit -m "feat(go): add published content assembler ported from publicContent.ts"
```

### Task 2.3: api/content/course.go + lessons.go

**Files:**
- Create: `api/content/course.go`
- Create: `api/content/lessons.go`

对应 TS：`api/content/course.ts` / `api/content/lessons.ts` + `src/server/content/http.ts` 的 course/lesson handler。

- [ ] **Step 1: 写 handler（含错误映射）**

`api/content/course.go`:

```go
package handler

import (
	"errors"
	"net/http"

	"en-fr-chinese-entry-mvp/internal/contentbuild"
	"en-fr-chinese-entry-mvp/internal/contentstore"
	"en-fr-chinese-entry-mvp/internal/httpx"
)

var store = openStore()

func openStore() *contentstore.Store {
	env := contentstore.EnvFromMap(envMap())
	db, err := contentstore.Open(env)
	if err != nil {
		return nil
	}
	return contentstore.New(db)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", "GET")
		_ = httpx.WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
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
	httpx.SetCacheControl(w, "s-maxage=60, stale-while-revalidate=300")
	_ = httpx.WriteJSON(w, http.StatusOK, course)
}

func envMap() map[string]string {
	m := map[string]string{}
	for _, k := range []string{"MYSQL_DATABASE_URL", "MYSQL_URL", "DATABASE_URL", "MYSQL_SSL", "MYSQL_CONNECT_TIMEOUT_MS"} {
		if v := os.Getenv(k); v != "" {
			m[k] = v
		}
	}
	return m
}
```

> 需要 `import "os"`。`envMap` 在两个 handler 间复用 → 抽到 `internal/contentstore/env.go`。

`internal/contentstore/env.go`（新增）：

```go
package contentstore

import "os"

func EnvMap() map[string]string {
	m := map[string]string{}
	for _, k := range []string{"MYSQL_DATABASE_URL", "MYSQL_URL", "DATABASE_URL", "MYSQL_SSL", "MYSQL_CONNECT_TIMEOUT_MS"} {
		if v := os.Getenv(k); v != "" {
			m[k] = v
		}
	}
	return m
}
```

`api/content/lessons.go`:

```go
package handler

import (
	"net/http"

	"en-fr-chinese-entry-mvp/internal/contentbuild"
	"en-fr-chinese-entry-mvp/internal/httpx"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", "GET")
		_ = httpx.WriteError(w, http.StatusMethodNotAllowed, "Method not allowed")
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
	httpx.SetCacheControl(w, "s-maxage=60, stale-while-revalidate=300")
	_ = httpx.WriteJSON(w, http.StatusOK, lesson)
}
```

> ⚠️ Vercel Go Functions 以文件为单位编译；两个 `api/content/*.go` 各有 `package handler` 且各导出一个 `Handler` 是允许的（Vercel 将每个文件作为独立函数）。但若 Go 编译器把同目录两文件当同一 package 处理 `Handler` 重定义，则需改用**单一入口**方案：`api/content.go` 内根据 `r.URL.Path` 路由 `/api/content/course` 与 `/api/content/lessons`。**实施时以 `go build` 实际结果为准**；如冲突，采用单入口 mux 方案（下方 Step 4 备选）。

- [ ] **Step 2: 本地编译验证**

Run: `go build ./... && go vet ./...`
Expected: 通过（若遇 `Handler` 重定义，改单入口方案）。

- [ ] **Step 3: 契约单测（handler 注入假 store）**

为可测性，handler 应接受注入的 `store`。将 `course.go`/`lessons.go` 改为 `api/content/handlers.go` 导出 `NewCourseHandler(s *contentstore.Store)`、`NewLessonHandler(s *contentstore.Store)`，两个入口文件调用。写 `internal/httpx` + 假 store 的 table-driven 测试（M2 末尾随契约对比一起）。

- [ ] **Step 4: 双实现契约对比**

临时脚本：本地起 TS（`npm run dev`）与 Go（`go run` 本地模拟 handler 或 `vercel dev`），对比 `/api/content/course` 与 `/api/content/lessons/self-intro` 响应字节。提交为 `scripts/compare-content-api.mjs`（见 M6）。

Expected: 字节一致（除 `estimatedDailyMinutes` 等常量外）。

- [ ] **Step 5: Commit**

```bash
git add api/content/ internal/contentbuild/
git commit -m "feat(go): add public content read functions matching TS contract"
```

### Task 2.4: M2 风险与文档更新

- [ ] **Step 1: 记录 DSN 兼容性结论**

在实施时确认 `MYSQL_DATABASE_URL` 实际格式；若为 URI scheme，go-sql-driver 需 `mysql.Config` 解析或改 DSN。结论写入设计文档"风险"节并在 PR 说明。

- [ ] **Step 2: 更新设计文档**（如契约有任何偏差）

### Task 2.5: cmd/contentseed — seed SQL 再生工具

**Files:**
- Create: `cmd/contentseed/main.go`
- Create: `cmd/contentseed/main_test.go`
- Create: `internal/seedgen/seedgen.go` + `internal/seedgen/seedgen_test.go`

对应 TS：`src/server/content/seed.ts`（164 行）`createInitialContentSeed` / `renderInitialContentSeedSql`。职责：从静态主课程 JSON 快照生成 `db/seeds/0001_initial_content_admin.sql`（幂等，`on duplicate key update`），仅在课程内容变更时手动运行。

- [ ] **Step 1: 生成主课程 JSON 快照**

用 Node 脚本从 `src/content/course.ts` 导出 JSON（`scripts/export-course-json.mjs`，与 M3 pinyin 导出共用模式）。

- [ ] **Step 2: seedgen 实现（移植 seed.ts 逻辑）**

`internal/seedgen/seedgen.go`：`CreateInitialContentSeed(course map[string]any)` 产出 lessons/lessonModules/revisions，`RenderSeedSQL(seed)` 输出与现有 seed 文件同构的 SQL（含 `begin;`/`commit;`、`on duplicate key update`、指针更新）。六模块 `revisionId` 分配逻辑与 TS 完全一致（published 偶、draft 奇，自增）。

- [ ] **Step 3: 测试**

`internal/seedgen/seedgen_test.go`：给定 fixture course，断言生成的 SQL 含 10 课、每课 6 模块、revision 指针自洽；与现有 `db/seeds/0001_initial_content_admin.sql` 的 lessons 插入段一致（golden diff）。

- [ ] **Step 4: 验证再生成**

Run: `go run ./cmd/contentseed > /tmp/seed.sql && diff <(sed 's/'"'"'2026-[0-9T:.]*Z'"'"'/TIMESTAMP/g' db/seeds/0001_initial_content_admin.sql) <(sed 's/'"'"'2026-[0-9T:.]*Z'"'"'/TIMESTAMP/g' /tmp/seed.sql)`
Expected: 无差异（或仅时间戳白名单差异）。

- [ ] **Step 5: Commit**

```bash
git add cmd/contentseed/ internal/seedgen/ scripts/export-course-json.mjs
git commit -m "feat(go): add seed SQL regeneration tool ported from seed.ts"
```

---

## M3：pinyin 读 API（嵌入 Go 二进制）

**Files:**
- Create: `internal/pinyincontent/pinyin.go`（嵌入数据 + 暴露 course）
- Create: `internal/pinyincontent/pinyin_test.go`
- Create: `api/content/pinyin/course.go`（若沿用 /api/content/pinyin/course 路径）

### Task 3.1: pinyin 静态数据嵌入

**Files:**
- Create: `internal/pinyincontent/data/pinyin_course.json`（由 `src/content/pinyin/*.ts` 序列化产出）
- Create: `internal/pinyincontent/pinyin.go`
- Create: `internal/pinyincontent/pinyin_test.go`

- [ ] **Step 1: 生成 pinyin 课程 JSON**

用 Node 脚本从 `src/content/pinyin/course.ts` 导出 JSON（`scripts/export-pinyin-json.mjs`，临时工具，可入 `scripts/`）。

- [ ] **Step 2: 用 go:embed 嵌入**

`internal/pinyincontent/pinyin.go`:

```go
package pinyincontent

import (
	_ "embed"
	"encoding/json"
)

//go:embed data/pinyin_course.json
var pinyinCourseJSON []byte

func PinyinCourse() (map[string]any, error) {
	var v map[string]any
	if err := json.Unmarshal(pinyinCourseJSON, &v); err != nil {
		return nil, err
	}
	return v, nil
}
```

- [ ] **Step 3: 测试**

`internal/pinyincontent/pinyin_test.go`：断言 `PinyinCourse()` 返回非空、`lessons` 数组长度 3、每课含 `reference`/`toneGame`。

- [ ] **Step 4: Commit**

```bash
git add internal/pinyincontent/ scripts/export-pinyin-json.mjs
git commit -m "feat(go): embed pinyin course as static JSON (plan A)"
```

### Task 3.2: api/content/pinyin/course.go

**Files:**
- Create: `api/content/pinyin/course.go`

- [ ] **Step 1: handler**

GET → 200 pinyin course，`Cache-Control: s-maxage=60, stale-while-revalidate=300`；非 GET → 405。无 DB 依赖，`store` 为空也正常返回。

- [ ] **Step 2: 编译 + 测试**

Run: `go build ./... && go test ./internal/pinyincontent/`
Expected: 通过。

- [ ] **Step 3: Commit**

```bash
git add api/content/pinyin/course.go
git commit -m "feat(go): add pinyin course read function"
```

---

## M4：admin content API（Go）

**Files:**
- Create: `internal/contentstore/admin_store.go` + `internal/contentstore/admin_store_test.go`
- Create: `internal/contentstore/admin_repo.go` + `internal/contentstore/admin_repo_test.go`
- Create: `api/admin/content/lessons.go`
- Create: `api/admin/content/draft.go`
- Create: `api/admin/content/publish.go`
- Create: `api/admin/content/rollback.go`
- Create: `internal/adminhttp/adminhttp.go` + `internal/adminhttp/adminhttp_test.go`

### Task 4.1: admin store（SQL 层）

**Files:**
- Create: `internal/contentstore/admin_store.go`
- Create: `internal/contentstore/admin_store_test.go`

对应 TS：`src/server/content/adminStoreMysql.ts`（272 行）：`currentModuleStatesQuery`、`listCurrentModuleStates`、`listCurrentLessonModuleStates`、`getCurrentModuleState`、`listPublishedModuleHistory`、`insertModuleRevision`、`updateCurrentModuleState`、`runInTransaction`。

- [ ] **Step 1: 写失败测试（go-sqlmock）**

覆盖 `currentModuleStatesQuery` 返回行归一化、`insertModuleRevision` 取 `insertId`、`updateCurrentModuleState`（draft/published 分支）。

- [ ] **Step 2: 运行确认失败**

Run: `go test ./internal/contentstore/`
Expected: FAIL（`undefined`）。

- [ ] **Step 3: 最小实现**

用 `database/sql`，行归一化与 TS `normalizeCurrentState` 一致（`Boolean(enabled)`、payload JSON 解析、null 处理）。事务用 `db.BeginTx`，`runInTransaction` 接收 `func(txStore *AdminStore) error`。

- [ ] **Step 4: 运行确认通过**

Run: `go test ./internal/contentstore/`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add internal/contentstore/admin_store.go internal/contentstore/admin_store_test.go
git commit -m "feat(go): add admin mysql store ported from adminStoreMysql.ts"
```

### Task 4.2: admin repo（业务编排）

**Files:**
- Create: `internal/contentstore/admin_repo.go`
- Create: `internal/contentstore/admin_repo_test.go`

对应 TS：`src/server/content/adminRepository.ts`（257 行）：`listLessons`、`getLessonSnapshot`、`saveDraftModule`、`publishModule`、`rollbackModule` + 错误类型。

- [ ] **Step 1: 定义错误类型与接口**

```go
var ErrNoUnpublishedChanges = errors.New("no unpublished changes")
var ErrPublishedRevisionNotFound = errors.New("published revision not found")

type NotFoundError struct{ Message string }
func (e *NotFoundError) Error() string { return e.Message }

type ValidationError struct{ Message string }
func (e *ValidationError) Error() string { return e.Message }
```

- [ ] **Step 2: 写失败测试**

用假 store（内存实现 `AdminStore` 接口）验证：listLessons 的 `draftChangedModuleCount`（payload 不一致计数）、getLessonSnapshot 的 `hasUnpublishedChanges`、publish 无变化时 `ErrNoUnpublishedChanges`、rollback 找不到目标时 `ErrPublishedRevisionNotFound`、payload 校验失败 `ValidationError`。

- [ ] **Step 3: 运行确认失败**

Run: `go test ./internal/contentstore/`
Expected: FAIL。

- [ ] **Step 4: 最小实现**

- 事务编排：saveDraft = insert draft revision + update pointer；publish = insert published + update + insert fresh draft + update；rollback = 从历史找目标 + insert published + fresh draft。
- `buildLesson`（draft/published）复用 `contentbuild.BuildLessonFromRows`，把 `CurrentModuleState` 转 `PublishedModuleRow`。
- `hasUnpublishedChanges` 用 `json.Marshal` 后字节相等（对齐 TS `stableJson`）。

- [ ] **Step 5: 运行确认通过**

Run: `go test ./internal/contentstore/`
Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add internal/contentstore/admin_repo.go internal/contentstore/admin_repo_test.go
git commit -m "feat(go): add admin repository orchestration ported from adminRepository.ts"
```

### Task 4.3: admin HTTP handlers + 4 个 Vercel 入口

**Files:**
- Create: `internal/adminhttp/adminhttp.go`
- Create: `internal/adminhttp/adminhttp_test.go`
- Create: `api/admin/content/lessons.go`
- Create: `api/admin/content/draft.go`
- Create: `api/admin/content/publish.go`
- Create: `api/admin/content/rollback.go`

对应 TS：`src/server/content/adminHttp.ts`（356 行）+ 4 个 `api/admin/content/*.ts`。

- [ ] **Step 1: 写 handler（含错误映射、鉴权、重试、脱敏）**

映射关系（对齐 `mapAdminError`）：

| TS 异常 | HTTP |
|---------|------|
| `MissingDatabaseUrlError` | 503 "Content admin database is not configured" |
| `MissingAdminAuthConfigurationError` | 503 "Content admin authentication is not configured" |
| `UnauthorizedAdminAccessError` | 401 + 条件 `WWW-Authenticate` |
| `ContentAdminValidationError` | 400 `{error: msg}` |
| `ContentAdminNotFoundError` | 404 `{error: msg}` |
| `PublishedRevisionNotFoundError` | 404 `{error: msg}` |
| `NoUnpublishedChangesError` | 409 `{error: msg}` |
| 其他 | 500 "Unable to process content admin request" + 脱敏日志 |

鉴权：`auth.RequireAdminAuthorization(r, env)`；401 时 `auth.ShouldSendBrowserAuthChallenge(r)` 决定是否发 `WWW-Authenticate: Basic realm="Content Admin"`。

请求体解析：`PUT /draft`、`POST /publish`、`POST /rollback` 解析 JSON body，字段校验对齐 `requireString`/`requireNumber`（缺 → 400）。

超时重试：`ETIMEDOUT` connect 时重试一次（对齐 `retryTransientAdminConnectTimeout`，120ms 间隔）。

- [ ] **Step 2: 写失败测试**

`internal/adminhttp/adminhttp_test.go`：假 repo 注入，逐端点断言方法/状态码/错误体/Allow 头/鉴权行为。对标 TS `adminHttp.test.ts`（352 行）用例。

- [ ] **Step 3: 运行确认通过**

Run: `go test ./internal/adminhttp/`
Expected: PASS。

- [ ] **Step 4: 创建 4 个 Vercel 入口**

每个入口文件复用 `contentstore.EnvFromMap` + `auth.Env`（从 `CONTENT_ADMIN_USERNAME/PASSWORD`），懒初始化共享 repo。

- [ ] **Step 5: 编译验证**

Run: `go build ./... && go vet ./...`
Expected: 通过（若 `Handler` 跨文件重定义冲突，同 M2 用单入口 mux 方案）。

- [ ] **Step 6: Commit**

```bash
git add internal/adminhttp/ api/admin/content/
git commit -m "feat(go): add admin content functions matching TS contract"
```

### Task 4.4: admin 契约对比

- [ ] **Step 1: 双实现对比**

用假 DB 或用 `vercel dev` 对 admin 端点做行为对比；重点是 draft→publish→rollback 往返后的快照结构一致性。

- [ ] **Step 2: Commit**

```bash
git commit -am "test(go): record admin contract comparison"
```

---

## M5：前端异步化改造

**Files:**
- Create: `src/lib/contentApi.ts`
- Create: `src/lib/contentApi.test.ts`
- Create: `src/lib/contentProvider.tsx`
- Create: `src/lib/pinyinContentProvider.tsx`
- Create: `src/test/mockContentProvider.tsx`
- Modify: `src/lib/progress.ts`（签名接收 `course`）
- Modify: `src/lib/progress.test.ts`
- Modify: `src/content/journey.ts`（`buildJourney(course)`）
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/LessonPage.tsx`
- Modify: `src/pages/PracticePage.tsx`
- Modify: `src/pages/ProgressPage.tsx`
- Modify: `src/pages/ReviewPage.tsx`
- Modify: `src/pages/PinyinPage.tsx`
- Modify: `src/pages/PinyinPracticePage.tsx`
- Modify: 相关页面/组件测试

### Task 5.1: contentApi + 测试

**Files:**
- Create: `src/lib/contentApi.ts`
- Create: `src/lib/contentApi.test.ts`

- [ ] **Step 1: 写失败测试**

`contentApi.test.ts`：mock `fetch`（vi.stubGlobal）断言成功解析、404/500 → `ContentApiError(status, message)`、网络错误抛错。

- [ ] **Step 2: 运行确认失败**

Run: `npx vitest run src/lib/contentApi.test.ts`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 最小实现**

```ts
// src/lib/contentApi.ts
import type { CourseContent, LessonContent, PinyinCourseContent } from '../content/types'

export class ContentApiError extends Error {
  readonly status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ContentApiError'
    this.status = status
  }
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: 'same-origin' })
  const body = (await response.json()) as T | { error?: string }
  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'error' in body && typeof (body as { error?: unknown }).error === 'string'
      ? (body as { error: string }).error
      : `Content request failed (${response.status})`
    throw new ContentApiError(message, response.status)
  }
  return body as T
}

export function fetchCourse(): Promise<CourseContent> {
  return getJson<CourseContent>('/api/content/course')
}

export function fetchLesson(lessonId: string): Promise<LessonContent> {
  return getJson<LessonContent>(`/api/content/lessons?lessonId=${encodeURIComponent(lessonId)}`)
}

export function fetchPinyinCourse(): Promise<PinyinCourseContent> {
  return getJson<PinyinCourseContent>('/api/content/pinyin/course')
}
```

- [ ] **Step 4: 运行确认通过**

Run: `npx vitest run src/lib/contentApi.test.ts`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/lib/contentApi.ts src/lib/contentApi.test.ts
git commit -m "feat(frontend): add content API client"
```

### Task 5.2: CourseProvider + pinyinProvider + mock 工具

**Files:**
- Create: `src/lib/contentProvider.tsx`
- Create: `src/lib/pinyinContentProvider.tsx`
- Create: `src/test/mockContentProvider.tsx`

- [ ] **Step 1: 实现 Provider**

```tsx
// src/lib/contentProvider.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { CourseContent } from '../content/types'
import { fetchCourse } from './contentApi'

interface CourseContextValue {
  course: CourseContent | null
  error: Error | null
  reload: () => void
}

const CourseContext = createContext<CourseContextValue>({ course: null, error: null, reload: () => {} })

export function CourseProvider({ children }: { children: ReactNode }) {
  const [course, setCourse] = useState<CourseContent | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true
    setError(null)
    fetchCourse()
      .then((c) => { if (active) setCourse(c) })
      .catch((e) => { if (active) setError(e as Error) })
    return () => { active = false }
  }, [tick])

  return (
    <CourseContext.Provider value={{ course, error, reload: () => setTick((t) => t + 1) }}>
      {children}
    </CourseContext.Provider>
  )
}

export function useCourse() {
  return useContext(CourseContext)
}
```

`src/lib/pinyinContentProvider.tsx` 同理（`fetchPinyinCourse`）。

`src/test/mockContentProvider.tsx`：导出 `<MockCourseProvider course={...}>`、`useMockCourseContext` 等测试注入工具。

- [ ] **Step 2: 挂载 Provider**

Modify: `src/main.tsx` — 用 `<CourseProvider><PinyinContentProvider>` 包裹 `<App/>`。

- [ ] **Step 3: 运行现有测试确保不破坏**

Run: `npx vitest run`
Expected: 现有用例仍通过（Provider 默认 null 时页面需兼容，见后续任务）。

- [ ] **Step 4: Commit**

```bash
git add src/lib/contentProvider.tsx src/lib/pinyinContentProvider.tsx src/test/mockContentProvider.tsx src/main.tsx
git commit -m "feat(frontend): add course providers and test mock"
```

### Task 5.3: progress.ts / journey.ts 改为接收 course

**Files:**
- Modify: `src/lib/progress.ts`
- Modify: `src/lib/progress.test.ts`
- Modify: `src/content/journey.ts`
- Modify: `src/content/journey.test.ts`

- [ ] **Step 1: progress.ts 签名化**

把顶层 `import { course }` 移除；`isValidLessonId` / `getFirstLessonId` / `getNextLessonId` 等接收 `course: CourseContent` 参数。调用方（页面）改传 context 值。`loadProgress`/`saveProgress`/`markLessonVisited` 等无 course 依赖的函数不变。

- [ ] **Step 2: 更新 progress.test.ts**

各用例传入 fixture course（复用 `src/content/course.test.ts` 的 fixture 模式）。

- [ ] **Step 3: journey.ts 改 buildJourney(course)**

`export function buildJourney(course: CourseContent): { stages: JourneyStage[]; nodes: JourneyNode[] }`；`journeyNodeIcons` 常量保留导出（图标无 course 依赖）。

- [ ] **Step 4: 更新 journey.test.ts**

改为调用 `buildJourney(fixtureCourse)`。

- [ ] **Step 5: 运行全部单测**

Run: `npx vitest run`
Expected: PASS（页面调用点需同步改，见 Task 5.4~5.6）。

- [ ] **Step 6: Commit**

```bash
git add src/lib/progress.ts src/lib/progress.test.ts src/content/journey.ts src/content/journey.test.ts
git commit -m "refactor(frontend): make progress and journey take course as parameter"
```

### Task 5.4: 主课程页面迁移（HomePage / LessonPage / PracticePage / ProgressPage / ReviewPage）

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/LessonPage.tsx`
- Modify: `src/pages/PracticePage.tsx`
- Modify: `src/pages/ProgressPage.tsx`
- Modify: `src/pages/ReviewPage.tsx`
- Modify: 各对应 `.test.tsx`

- [ ] **Step 1: 各页接入 useCourse**

- 课程为 null → 渲染 `<ContentLoading/>`（新增共享组件）；error → `<ContentError onRetry={reload}/>`。
- `LessonPage`：`const { lessonId } = useParams()`；从 context 课程取 lesson；若 context 课程未含目标 lesson，用 `fetchLesson(lessonId)` 兜底（保持现有 404/未找到行为）。
- 移除页面内 `import { course }`，改 `const { course } = useCourse()`。

- [ ] **Step 2: 新增共享状态组件**

Create: `src/components/ContentState.tsx`（`ContentLoading`、`ContentError`）+ 测试。

- [ ] **Step 3: 更新页面测试**

各 `.test.tsx` 用 `<MockCourseProvider>` 注入 fixture 课程（静态 fixture 从 `src/content/course.ts` 复用或抽取 `src/test/fixtures/course.ts`）。异步用例用 `await screen.findBy...` 处理首次渲染。

- [ ] **Step 4: 运行全部单测**

Run: `npx vitest run`
Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/pages/ src/components/ContentState.tsx src/test/fixtures/
git commit -m "refactor(frontend): consume course from provider in main course pages"
```

### Task 5.5: pinyin 页面迁移（PinyinPage / PinyinPracticePage）

**Files:**
- Modify: `src/pages/PinyinPage.tsx`
- Modify: `src/pages/PinyinPracticePage.tsx`
- Modify: 对应 `.test.tsx`

- [ ] **Step 1: 接入 pinyinProvider**

移除 `import { pinyinCourse }`；`const { course } = usePinyinCourse()`；null → loading、error → retry。

- [ ] **Step 2: 更新测试**

用 mock pinyin course fixture。

- [ ] **Step 3: 运行单测**

Run: `npx vitest run`
Expected: PASS。

- [ ] **Step 4: Commit**

```bash
git add src/pages/PinyinPage.tsx src/pages/PinyinPracticePage.tsx
git commit -m "refactor(frontend): consume pinyin course from provider"
```

### Task 5.6: 全量前端验证

- [ ] **Step 1: 全量单测 + 类型 + lint**

Run: `npm run test -- --run && npm run build && npm run lint`
Expected: 全绿。

- [ ] **Step 2: e2e 适配**

`tests/e2e/*.spec.ts` 若依赖静态内容渲染，调整为 API 可用环境（本地 `vercel dev` 或 mock）。重点 `course-series.spec.ts`、`lesson-page-anchors.spec.ts`、`pinyin-zone.spec.ts`。

Run: `npx playwright test`
Expected: 全绿。

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/
git commit -m "test(e2e): adapt e2e for API-backed content"
```

---

## M6：测试与契约对比收尾

**Files:**
- Create: `scripts/compare-content-api.mjs`
- Modify: Go 测试补齐

### Task 6.1: TS↔Go 契约对比脚本

- [ ] **Step 1: 写脚本**

`scripts/compare-content-api.mjs`：对 course/lessons/（admin snapshot）请求 TS 与 Go 两个 URL，规范化后 deep-compare JSON（忽略 `estimatedDailyMinutes` 等白名单字段，若有）。

- [ ] **Step 2: 运行对比**

Run: `node scripts/compare-content-api.mjs --ts <ts-url> --go <go-url>`
Expected: 一致（差异需修复到一致）。

- [ ] **Step 3: Commit**

```bash
git add scripts/compare-content-api.mjs
git commit -m "test: add TS vs Go content API comparison script"
```

### Task 6.2: Go 测试补全

- [ ] **Step 1: 覆盖率目标**

`go test ./... -cover`，重点 `internal/adminhttp`、`internal/contentstore`（admin 分支）、`internal/contentbuild` 错误路径。对标 TS `adminHttp.test.ts` / `publicContent.test.ts` 用例。

- [ ] **Step 2: Commit**

```bash
git commit -am "test(go): close coverage gaps against TS test baselines"
```

---

## M7：清理与部署

**Files:**
- Delete: `api/content/course.ts`、`api/content/lessons.ts`
- Delete: `api/admin/content/lessons.ts`、`draft.ts`、`publish.ts`、`rollback.ts`
- Keep: `api/admin/voice/*.ts`、`src/server/voice/*`、`src/server/content/*`（若还需 admin 编排以外的工具）、`db/*`、`src/content/*`（seed 源 + 语音依赖）

### Task 7.1: 双实现并存验证

- [ ] **Step 1: 部署 Go Functions 到 Vercel 预览**

Run: `git push` 触发部署；确认 `/api/content/course`、`/api/content/lessons/self-intro`、`/api/content/pinyin/course`、admin 4 端点返回正确。

- [ ] **Step 2: 验收（按设计文档"部署与回滚"）**

用稳定 URL `https://en-fr-chinese-entry-mvp.vercel.app` 核对（勿用 deployment-specific URL）。

### Task 7.2: 删除 TS 读/admin 端点

- [ ] **Step 1: 删除文件**

```bash
git rm api/content/course.ts api/content/lessons.ts \
       api/admin/content/lessons.ts api/admin/content/draft.ts \
       api/admin/content/publish.ts api/admin/content/rollback.ts
```

**不删**：`api/admin/voice/*.ts`、`src/server/voice/*`（voice 依赖静态 course，保留链完整）。

- [ ] **Step 2: 验证**

Run: `npm run build && npm run test -- --run && npx playwright test`
Expected: 全绿（`api/*.ts` 删除不涉及前端；`src/server/content/*` 保留则 `apiEntrypoints.test.ts` 若引用已删端点需同步删除）。

> ⚠️ `src/server/content/apiEntrypoints.test.ts` 测试的是 8 个 TS 入口存在性，删除 6 个后该测试需改为仅断言 voice 2 个入口 + 记录 Go 接管。

- [ ] **Step 3: 部署 + 生产验证**

Push main，用稳定 URL 验证 course/lessons/pinyin/admin。

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove TS content endpoints after Go takeover"
```

### Task 7.3: 收尾文档

- [ ] **Step 1: 更新 README / 设计文档状态**

标记设计文档为"已实施"，README 更新 Tech Stack（加入 Go）。

- [ ] **Step 2: Commit**

```bash
git commit -am "docs: mark go backend refactor complete and update README"
```

---

## 验证清单（每个里程碑必须满足）

| 里程碑 | 验证 |
|--------|------|
| M1 | `go build ./... && go vet ./...`、`go test ./internal/httpx/ ./internal/auth/` |
| M2 | `go test ./...`；TS↔Go 字节对比一致（course/lessons）；`cmd/contentseed` 再生成 seed 与现文件一致 |
| M3 | `go test ./internal/pinyincontent/`；`/api/content/pinyin/course` 返回 3 课 |
| M4 | `go test ./...`；admin 往返（draft→publish→rollback）契约一致 |
| M5 | `npm run test -- --run`、`npm run build`、`npm run lint`、`npx playwright test` |
| M6 | `go test ./... -cover`；`node scripts/compare-content-api.mjs` 一致 |
| M7 | 稳定 URL 生产验证 course/lessons/pinyin/admin |

## 风险与实施注意

1. **Vercel Go Functions 同目录 `Handler` 冲突**：`api/content/course.go` + `lessons.go` 若被当作同 package 编译会重定义。实施先试；冲突则改单入口 mux（`api/content/index.go` 按 path 路由）。
2. **DSN 兼容**：确认 `MYSQL_DATABASE_URL` 格式；URI scheme 需转换为 go-sql-driver DSN。
3. **`apiEntrypoints.test.ts`**：M7 删 TS 端点时同步更新该测试。
4. **前端时序**：页面测试由同步改异步，用 `findBy*`；避免时序敏感断言。
5. **字节保真**：`payload` 保持 `[]byte` 直通，禁止 map 重建后重新序列化（会导致键序变化）。
6. **语音依赖**：`src/server/voice/adminHttp.ts` 顶层 import 静态 course，删除静态内容前必须确认 voice 已下线或改数据源。
