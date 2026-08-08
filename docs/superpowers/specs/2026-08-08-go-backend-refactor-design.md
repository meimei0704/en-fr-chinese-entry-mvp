# Go 后端重构设计

> 状态：待评审（Design Review）
> 日期：2026-08-08
> 关联线程：#dylan-s-test:685a9bfb

## 目标

将当前 TS 编写的 Vercel Functions 后端（content 公开读 API + content admin API）迁移为 **Go + Vercel Go Runtime**，课程内容迁入 MySQL 并通过 Go API 提供，前端学习路径由静态 import 改为走 `/api/content/*`（纯 API，方案 A）。语音克隆 provider / @vercel/blob **本期不动**。

## 已确认决策

| 决策项 | 结论 |
|--------|------|
| 部署形态 | Vercel Go Runtime（不引入独立 Go 服务） |
| 内容来源 | 课程内容迁走后端（MySQL + Go API），前端纯 API 访问（方案 A，必须联网） |
| @vercel/blob | 保留 TS 侧不动（语音模块随之保留） |
| 语音克隆 provider | 本期不动（`src/server/voice/*` + `api/admin/voice/*` 保持 TS） |
| 主课程 | 10 课 + pinyin 3 课全部 seed 入库 |
| 前端 | 9 个页面 + `src/lib/progress.ts` 从静态 import 改异步 fetch |
| 工作量 | 约 11~15 个工作日（2.5~3 周） |

## 当前基线（代码现状）

### 后端（TS Vercel Functions，本次要迁 Go）

| 端点 | 文件 | 行为 |
|------|------|------|
| `GET /api/content/course` | `api/content/course.ts` | 公开课程 JSON，`s-maxage=60, stale-while-revalidate=300` |
| `GET /api/content/lessons/:lessonId`（rewrite → `?lessonId=`） | `api/content/lessons.ts` | 单课 JSON，404 处理 |
| `GET /api/admin/content/lessons[?lessonId=]` | `api/admin/content/lessons.ts` | 课程列表 / 快照（Basic Auth） |
| `PUT /api/admin/content/draft` | `api/admin/content/draft.ts` | 保存草稿（Basic Auth） |
| `POST /api/admin/content/publish` | `api/admin/content/publish.ts` | 发布（Basic Auth） |
| `POST /api/admin/content/rollback` | `api/admin/content/rollback.ts` | 回滚（Basic Auth） |
| `POST /api/admin/voice/generate`、`GET /api/admin/voice/samples` | `api/admin/voice/*.ts` | **保留 TS** |

核心逻辑层（`src/server/content/`）：

- `http.ts`（114 行）：公开读 API 处理器 + 懒加载 DB。
- `publicContent.ts`（79 行）：`PublishedModuleRow[] → CourseContent / LessonContent` 组装。
- `repository.ts`（161 行）：MySQL 连接（`mysql2/promise` pool）、两个读查询。
- `adminHttp.ts`（356 行）：admin 4 端点处理、错误映射、Basic Auth、连接超时重试、诊断脱敏。
- `adminAuth.ts`（76 行）：Basic Auth 校验（`X-Content-Admin-Client: spa` 时免浏览器 401 challenge）。
- `adminRepository.ts`：事务编排（saveDraft/publish/rollback）。
- `adminStoreMysql.ts`（272 行）：SQL 语句与行归一化。
- `seed.ts`（164 行）：从静态 `CourseContent` 生成 `InitialContentSeed` / seed SQL。
- `mysqlRunner.ts`：迁移/seed 的 Node 应用器（仅本地运维工具，可保留 TS）。

DB：`db/migrations/0001_content_admin.sql`（`lessons`、`lesson_modules`、`module_revisions`）+ `db/seeds/0001_initial_content_admin.sql`（10 课，主课程）。

### 前端（异步化改造目标）

静态 import 位置：

- `src/lib/progress.ts` — 依赖 `course.lessons` 校验/推进。
- `src/pages/{LessonPage,PracticePage,ProgressPage,ReviewPage,HomePage}.tsx` — 主课程。
- `src/pages/{PinyinPage,PinyinPracticePage}.tsx` + `src/content/pinyin/course.ts` — pinyin 课程（pinyin 内容未入 admin，走独立 read API）。
- `src/content/journey.ts` — 由 `course` 派生 journey 节点。
- `src/components/voiceTargets`/`src/server/voice/adminHttp.ts` — 语音 manifest 依赖静态 `course`（**语音模块不动，继续 import 静态内容**，故静态 `course.ts` 需保留为 seed 源 + 语音 manifest 依赖）。

## 目标架构

```
Vercel Project
├── SPA（React 19，静态，vercel.json 保持 catch-all rewrite）
├── /api/content/*.go        ← Go Function：course / lessons（读）
├── /api/admin/content/*.go  ← Go Function：lessons / draft / publish / rollback（admin，Basic Auth）
├── /api/admin/voice/*.ts    ← 保留 TS Function：generate / samples（本期不动）
└── MySQL（Vercel 托管）
```

要点：

1. **Vercel Go Functions 模式**：`/api/**/*.go`，每个文件 `package handler` + `func Handler(w, r)`。项目根放 `go.mod` / `go.sum`，Vercel 自动识别 Go runtime 并编译。现有 `vercel.json` 的 `/api/content/lessons/:lessonId` rewrite 与 SPA catch-all **保持不变**。
2. **TS / Go 共存**：Vercel Functions 按文件扩展名识别 runtime，`.go` 与 `.ts` 可同项目共存；voice 端点留在 `api/admin/voice/*.ts`。
3. **共享代码放 module 内包**：Go Functions 依赖根 `go.mod` 模块，公共逻辑（DB pool、SQL、组装、错误映射、auth）放入 `internal/` 包，各 handler 引用。
4. **JSON 保真**：`module_revisions.payload` 以 `json.RawMessage` 扫描，组装课程时不重新序列化/解析，保证与 TS 输出字节级兼容。
5. **环境变量名不变**：`MYSQL_DATABASE_URL` / `MYSQL_URL` / `DATABASE_URL`、`MYSQL_SSL`、`CONTENT_ADMIN_USERNAME` / `CONTENT_ADMIN_PASSWORD` 继续使用，Vercel 无需改环境变量。

## Go 项目结构（目标）

```
go.mod
go.sum
internal/
  httpx/            # JSON 写/读、状态码与错误响应、Cache-Control
  auth/             # Basic Auth 校验（含 spa marker、401 challenge）
  contentstore/     # MySQL pool（database/sql + go-sql-driver/mysql）、
                    #   公开读查询 + admin 读写查询（事务）
  contentbuild/     # PublishedModuleRow[] → CourseContent / LessonContent（移植 publicContent.ts）
  pinyincontent/    # pinyin 课程只读数据（seed 生成源 / 静态嵌入）
api/
  content/course.go
  content/lessons.go
  admin/content/lessons.go
  admin/content/draft.go
  admin/content/publish.go
  admin/content/rollback.go
cmd/
  contentseed/      # `go run` 生成 db/seeds/0001_initial_content_admin.sql（从静态 TS JSON 快照）
tools/
  contentadmin/     # 【可选】MySQL 迁移应用器 Go 版（或保留 runMysqlContentAdmin.ts）
```

`api/admin/voice/*.ts` 与 `src/server/voice/*`、`src/server/content/*`（admin 编排/seed/mysqlRunner 如需保留）、`db/*`、`src/content/*`（静态内容 + 类型，作为 seed 源与语音 manifest 依赖）维持现状。

## API 契约（与现状逐字段一致）

> 迁移目标：**HTTP 状态码、响应 JSON 结构、错误体 `{ error: string }`、鉴权头语义 完全不变**，前端 `src/admin/api.ts` 与新增读 API 客户端可零改动接入。验收以现有 TS 行为为准。

### 公开读

| 端点 | 方法 | 成功 | 错误 |
|------|------|------|------|
| `/api/content/course` | GET | 200 `CourseContent`（含 `supportedExplanationLanguages`、`estimatedDailyMinutes`、`lessons`） | 405 / 500 / 503 |
| `/api/content/lessons` (`?lessonId=` 经 rewrite) | GET | 200 `LessonContent` | 400（缺 lessonId）/ 404 / 405 / 500 / 503 |

响应头：`Cache-Control: s-maxage=60, stale-while-revalidate=300`（仅成功响应）。

### admin content（Basic Auth）

| 端点 | 方法 | 成功 | 错误 |
|------|------|------|------|
| `/api/admin/content/lessons` | GET | 200 `AdminLessonSummary[]`；带 `?lessonId=` → 200 `AdminLessonSnapshot` | 401 / 503 / 500 |
| `/api/admin/content/draft` | PUT | 200 `AdminLessonSnapshot` | 400 / 401 / 404 / 409 / 503 / 500 |
| `/api/admin/content/publish` | POST | 200 `AdminLessonSnapshot` | 400 / 401 / 404 / 409 / 503 / 500 |
| `/api/admin/content/rollback` | POST | 200 `AdminLessonSnapshot` | 400 / 401 / 404 / 409 / 503 / 500 |

鉴权语义保留：`X-Content-Admin-Client: spa` 时 401 不发送 `WWW-Authenticate: Basic` challenge；否则发送 `WWW-Authenticate: Basic realm="Content Admin"`。

### 新增 pinyin 读 API（已确认：方案 A，嵌入 Go 二进制）

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/content/pinyin/course` | GET | 200 `PinyinCourseContent`（来自 `internal/pinyincontent` 嵌入静态 JSON，不走 DB） |

## 内容数据模型与迁移路径

### 主课程（10 课）— 沿用现有模型

- 现状 `db/seeds/0001_initial_content_admin.sql` 已含 10 课六类模块 seed，`module_type` 枚举：`lessonMeta | dialogue | sentencePatterns | vocabulary | practice | reviewCards`。
- **seed 再生**：`cmd/contentseed` 读取静态内容 JSON 快照（由现有 `src/content/lessons/*.ts` 序列化产出），复用 `seed.ts` 的生成逻辑产出相同 SQL；内容有更新时重新生成 seed 并入库。

### pinyin 课程（3 课）— 已确认：方案 A

pinyin 内容结构与主课程不同（`reference` / `toneGame` 模块，无 dialogue/vocabulary/practice/reviewCards），且不在 admin 编辑范围。**崔秋 已确认采用方案 A**：pinyin 内容编译进 Go 二进制（`internal/pinyincontent` 嵌入静态 JSON），走 `/api/content/pinyin/course`。不动 `module_revisions` 表结构、不加 admin 支持。

### 迁移步骤（上线）

1. 新增 Go 读 API，与现有 TS API 并行部署（`/api/content/*.go` 与暂存 TS 端点并存验证）。
2. 前端切到 `/api/content/*`（含 pinyin），保留静态内容文件作为 seed 源 + 语音 manifest 依赖。
3. 全量验证通过后，删除 `api/content/*.ts`、`api/admin/content/*.ts`（Go 接管）；`api/admin/voice/*.ts` 保留。
4. 存量 DB 数据不动；seed 幂等（`on duplicate key update`）。

## 前端异步化改造

### 数据获取层（新增）

- `src/lib/contentApi.ts`：`fetchCourse()` / `fetchLesson(lessonId)` / `fetchPinyinCourse()`，返回与 `src/content/types.ts` 完全一致的类型；错误抛 `ContentApiError(status, message)`。
- `src/lib/contentProvider.tsx`：`CourseProvider`（React Context），启动时 `fetchCourse()` 一次，提供 `{ course, error, reload }`；页面消费 context 取代静态 import。失败态展示重试（方案 A 无离线回退）。
- `src/lib/pinyinContentProvider.tsx`：同理提供 pinyin 课程。

### 改造清单

| 文件 | 现状 | 改造 |
|------|------|------|
| `src/lib/progress.ts` | 顶层 `import { course }` | 函数签名接收 `course: CourseContent` 参数（`isValidLessonId`/`getNextLessonId` 等），调用方传 context 值；`loadProgress` 等不变 |
| `src/pages/HomePage.tsx` | 静态 import + journey | 用 context 课程派生 journey（`journey.ts` 改为接收 course 参数或提供 `buildJourney(course)`） |
| `src/pages/LessonPage.tsx` | 静态 import | context + `fetchLesson(lessonId)`（route 参数） |
| `src/pages/PracticePage.tsx` | 静态 import | context 课程 |
| `src/pages/ProgressPage.tsx` | 静态 import | context 课程 |
| `src/pages/ReviewPage.tsx` | 静态 import | context 课程 |
| `src/pages/PinyinPage.tsx` / `PinyinPracticePage.tsx` | 静态 pinyin import | pinyin context |
| `src/content/journey.ts` | 顶层派生 | 改 `buildJourney(course)` |
| `src/components/*` 中读取静态内容的组件 | — | 随调用方迁到 context 取值 |

> 语音相关（`voiceTargets.ts`、`src/server/voice/adminHttp.ts`）保持静态 import，不动。

### 加载/错误态约定

- 页面加载中：沿用现有骨架/占位（实现时给出统一 `<ContentLoading/>` 与 `<ContentError onRetry/>`）。
- 测试：提供 `mockContentProvider` 测试工具，避免大量 UI 测试改造为 async 时序敏感。

## 测试策略

### Go 侧（新）

| 层 | 测试 | 说明 |
|----|------|------|
| `httpx` | 响应封装/错误体/头 | table-driven |
| `auth` | Basic Auth 校验、spa marker、challenge 头、缺配置 | table-driven |
| `contentbuild` | 行 → 课程/单课组装，模块缺失→null、禁用过滤、排序 | 用固定 fixture 与 TS 基线 JSON 比对 |
| `contentstore` | 用真实 MySQL（测试库）或 `go-sqlmock` 验证 SQL 与行归一化 | 优先 `go-sqlmock`（CI 无 DB） |
| `api` handler | 路由/方法/状态码/错误映射（handler 注入假 store） | 对标现有 `adminHttp.test.ts`/`http.test.ts` 用例 |
| `cmd/contentseed` | 输出 SQL 与现有 seed 文件 diff（幂等、可重复） | golden file |

**验收基线**：现有 TS 测试用例（`src/server/content/*.test.ts`，2,417 行）的行为断言逐步迁移到 Go 测试，保证契约一致。

### 前端（改造）

- 现有 41 个单测文件 / 271 个用例：`progress`、`journey`、页面测试改为注入 mock 内容；`LessonPage`、`PracticePage`、`HomePage` 等用 `mockContentProvider`。
- Playwright e2e（`tests/e2e/*.spec.ts`）：API 层用真实部署/本地 mock 均可；重点回归 course/lesson 渲染、practice、pinyin、admin smoke。

### 验证命令

- Go：`go test ./...`（本地）+ `go vet ./...`。
- TS：`npm run test -- --run`、`npx playwright test`、`npm run lint`、`npm run build`。
- 契约：双实现并存期用脚本对比 `/api/content/course` TS vs Go 响应字节一致。

## 部署与回滚

- **部署**：Vercel 自动识别根 `go.mod` 编译 Functions；`api/admin/voice/*.ts` 继续由 Node runtime 处理。现有 `vercel.json` 不变。
- **回滚**：任一函数可独立回滚到旧 TS 版本；前端保持在静态 import + API 双实现并存期可快速回切（前端回滚先于后端删 TS）。
- **验证（验收人必须执行）**：
  1. `GET https://en-fr-chinese-entry-mvp.vercel.app/api/content/course` 返回 10 课（用稳定项目 URL，勿用 deployment-specific URL）。
  2. `GET .../api/content/lessons/self-intro` 返回 200 且结构与前端类型一致。
  3. admin draft→publish→rollback 往返在 admin UI 可用。
  4. Playwright 全绿。

## 工作量与里程碑

| 里程碑 | 内容 | 估时 |
|--------|------|------|
| M1 Go 骨架 | go.mod、`internal/httpx`、`internal/auth`、`internal/contentstore` 连接 | 0.5 天 |
| M2 公开读 API | contentbuild + course/lessons handler + Go 测试 + TS 契约对比 | 2~3 天 |
| M3 pinyin 读 API | internal/pinyincontent + 端点 + 测试 | 0.5 天 |
| M4 admin API | admin store 移植 + 事务 + 4 端点 + auth + 错误映射 + 测试 | 3~4 天 |
| M5 前端异步化 | contentApi + Provider + 9 文件改造 + 单测 | 2~3 天 |
| M6 测试与回归 | e2e 改造 + 全量验证 + 双实现对比 | 2 天 |
| M7 清理与部署 | 删 TS 读/admin 端点、部署验证、回滚预案 | 1 天 |

**合计：约 11~15 个工作日（2.5~3 周）**，含评审往返与部署观察。

## 风险与开放项

1. ~~pinyin 数据源（方案 A/B）~~ **已确认：方案 A**（嵌入 Go 二进制，不动 DB 表结构）。
2. **Go-sqlmock vs 真实 MySQL**：CI 无 DB，store 层用 `go-sqlmock`；若 Vercel 提供测试库则用真实库更稳。
3. **Vercel Go Functions 冷启动**：读 API 需维护 DB pool，Go 冷启动快于 Node；连接超时重试逻辑移植自 `adminHttp.ts`。
4. **静态 `course.ts` 去留**：语音 manifest 依赖它，故保留；后续若语音下线可再评估删除。
5. **`vercel.json` 新增 `/api/content/pinyin/course` rewrite**：无 path 参数则不需要；若走 `/api/content/pinyin/:courseId` 才需加 rewrite。
6. **node 运维工具**（`runMysqlContentAdmin.ts`）：seed 应用继续用 Node 脚本还是迁 Go，不影响生产；保留现状减少风险。
