# Admin 课程编辑器可见模块精简设计

## 目标

让 Admin 课程编辑器与学习者课程页的三层结构保持一致：Pronunciation 与 Hanzi recognition 不再出现在 `/admin/lesson/:lessonId` 的任何编辑、状态或历史发布区域，同时保留 Short Input 编辑和全部底层旧数据能力。

本轮只改变 Admin 课程编辑 UI 的可见/可编辑模块策略，不删除内容模块，不修改服务端数据模型。

## 用户确认的方向

用户已确认方案 A，并进一步确认 Pronunciation / Hanzi recognition 在整个 Admin 课程编辑界面都不再出现：

1. 从模块目录和 Edit 入口移除。
2. 从顶部 pending 数量移除。
3. 从右侧 Module History、Publish、Rollback 控制移除。
4. Short Input 编辑继续保留。
5. Practice → short-input 流程继续保留。
6. Pronunciation / Hanzi recognition 的旧数据、revision/history、schema、seed 与 API 继续保留。
7. Admin 课程列表、Voice 管理及其他后台页面本轮不修改。

## 当前基线

设计基于 `origin/main` 的 `ce1461d`。

`src/pages/AdminLessonEditorPage.tsx` 当前：

- `moduleOrder` 包含 9 个模块：Lesson Meta、Dialogue、Sentence Patterns、Vocabulary、Pronunciation、Hanzi Recognition、Practice、Review Cards、Short Input。
- 模块目录直接遍历 `moduleOrder`。
- `pendingModuleCount` 直接统计 `snapshot.modules` 的全部 pending 状态。
- `moduleSnapshots` 从 `snapshot.modules` 的全部模块建立映射。
- `renderModuleEditor` 包含 Pronunciation 与 Hanzi recognition 的编辑器分支和字段配置。
- `ModuleHistoryList` 收到完整 snapshot，并直接遍历全部 `snapshot.modules`。

因此只从 `moduleOrder` 删除两项并不足够：顶部 pending 数量和右侧 history/publish 区仍会泄漏隐藏模块。

## 方案比较

### 方案 A：Admin UI 全面隐藏，底层保留（已选）

建立统一的 Admin lesson editor 可见模块白名单，目录、选中状态、pending 统计和历史发布区全部使用该白名单；服务端 snapshot 仍保持完整。

优点：与学习者页面一致、改动边界清楚、不会破坏旧数据或 Voice/short-input 能力。
代价：隐藏模块若已有 unpublished revision，将在本页面被有意忽略，需由后续清理任务处理。

### 方案 B：仅隐藏目录卡片

只从模块目录删除两项，pending 和历史区继续显示。

优点：改动最少。
缺点：不满足“整个 Admin 课程编辑界面都不再出现”，且页面状态会自相矛盾。

### 方案 C：全链路删除

同步删除字段、类型、schema、seed、API、revision/history 和旧数据。

优点：彻底清理冗余。
缺点：会影响现有数据、Voice 能力和发布链路，超出本轮确认范围。

## 页面范围

### 可见/可编辑模块

Admin 课程编辑器固定按以下顺序展示 7 个模块：

1. Lesson Meta
2. Dialogue
3. Sentence Patterns
4. Vocabulary
5. Practice
6. Review Cards
7. Short Input

### 整页隐藏边界

Pronunciation 与 Hanzi recognition 不得出现在：

- Lesson outline / Module directory 卡片；
- `Edit pronunciation`、`Edit hanzi recognition` 入口；
- 选中模块 badge 或 Inline editor；
- 顶部 `Draft state` pending 数量及其说明；
- 右侧 Module History 标题与 revision 列表；
- `Publish pronunciation`、`Publish hanzi recognition`；
- 对应 Rollback 控制、pending 状态或操作反馈。

加载 skeleton、空状态和错误页面不新增这两个名称。

### 明确保留

Short Input 必须继续出现在：

- 模块目录；
- Inline editor；
- pending 统计；
- Module History；
- Publish / Rollback 控制。

Lesson Meta、Dialogue、Sentence Patterns、Vocabulary、Practice、Review Cards 的既有行为不改变。

## 前端结构

### 1. 单一模块白名单

在 `src/pages/AdminLessonEditorPage.tsx` 内将现有 `moduleOrder` 收窄为页面唯一的可见模块来源，例如：

```ts
const editableModuleOrder = [
  'lessonMeta',
  'dialogue',
  'sentencePatterns',
  'vocabulary',
  'practice',
  'reviewCards',
  'shortInput',
] as const satisfies readonly ContentModuleType[]

type EditableModuleType = (typeof editableModuleOrder)[number]
```

该策略只属于 Admin lesson editor，本轮不新建全局内容模块概念，也不改变 `ContentModuleType`。

### 2. 页面状态与编辑器收窄

以下页面结构使用 `EditableModuleType`：

- `moduleConfig`；
- `structuredModuleCopy` 中本页面仍可达的配置；
- `selectedModuleType`；
- `handleSelectModule`；
- `getModuleSummary`；
- `renderModuleEditor`。

从 `AdminLessonEditorPage.tsx` 删除：

- Pronunciation / Hanzi recognition 的 `moduleConfig` 与 structured copy；
- 两个 `renderModuleEditor` case；
- `pronunciationFields`、`hanziRecognitionFields` import。

字段定义文件本身不删除，底层类型和旧数据仍可由其他能力读取。

### 3. 统一派生可见 snapshot 模块

页面先从完整 `snapshot.modules` 建立按 module type 查询的 map，再严格按 `editableModuleOrder` 逐项读取并派生 `editableModuleSnapshots`。不得直接对服务端数组做 `filter` 后沿用其顺序，因为生产 MySQL snapshot 当前按 `lm.module_type asc` 返回，不等于页面确认顺序。

派生结果用于：

- `pendingModuleCount` 只统计 `editableModuleSnapshots`；
- `moduleSnapshots` 只由 `editableModuleSnapshots` 建立；
- Module directory 和 Module History 都保持 `editableModuleOrder` 顺序；
- `ModuleHistoryList` 接收同一个 `editableModuleSnapshots`。

不得修改 `snapshot` 本身，也不得在 API 响应层删除隐藏模块。

### 4. Module History 输入收窄

`src/components/admin/ModuleHistoryList.tsx` 增加显式 `modules` 属性，类型使用 `AdminLessonSnapshot['modules']`。组件：

- 遍历传入的 `modules`，不再直接遍历 `snapshot.modules`；
- 仍从完整 `snapshot.publishedHistory[module.moduleType]` 读取传入模块的历史；
- 保留现有 publish、rollback、pending action 行为；
- 删除仅服务于隐藏模块的 UI label 分支。

这样 history 组件不自行维护第二份白名单，也不会改变底层 snapshot。

## 数据流与兼容性

### 页面加载

1. Admin API 仍返回完整 9 模块 snapshot。
2. 页面保留完整 `snapshot` 供 Preview 和底层历史读取。
3. 页面只派生 7 个 `editableModuleSnapshots` 用于编辑器状态和模块历史。
4. 不新增网络请求、迁移或异步状态。

### 草稿、发布与回滚

- 7 个可见模块继续使用现有保存、发布和回滚 API。
- 隐藏模块没有 UI 入口，因此不会从本页面发起保存、发布或回滚。
- 如果隐藏模块已有 unpublished changes，本页面 pending 数量有意忽略它们。
- 服务端接口仍接受 Pronunciation / Hanzi recognition module type；旧 revision/history 不删除。

### 其他能力

以下保持不变：

- `ContentModuleType` 和 `LessonContent`；
- content provider、schema、seed、MySQL store/repository、Admin API；
- Pronunciation / Hanzi recognition 旧内容及 revision/history；
- Voice 页面、voice target 收集与替换；
- Admin 课程列表；
- 学习者 Lesson、Practice、Short Input、Review、Progress；
- Short Input Admin 编辑能力。

## 错误处理

- Admin 认证失败、snapshot 加载失败和不存在 lesson 的兜底保持现状。
- 某个可见模块若未出现在 `snapshot.modules`，目录继续按现有行为显示 `—` revision；history 仅渲染实际收到的可见模块记录。
- 隐藏模块的服务端错误不会从本页面触发，因为没有可达操作入口。
- 未保存离开提醒只跟踪当前可见 Inline editor，行为不变。

## 测试设计

实现时先更新/新增失败测试，再修改页面。

### AdminLessonEditorPage 聚焦测试

在 `src/pages/AdminLessonEditorPage.test.tsx`：

1. fixture 继续包含完整 9 个 module snapshot 和 Pronunciation / Hanzi recognition 数据/history。
2. 使用刻意打乱/按字母排序的 9 模块 response，Module directory 仍只有 7 个模块和 7 个 Edit 入口，Module directory 与 Module History 都严格按确认的 7 模块顺序显示。
3. 页面范围内不存在 Pronunciation / Hanzi recognition 卡片、按钮、history heading、publish 或 rollback 控制。
4. Short Input 卡片、Edit 入口和 Inline editor 仍可用；编辑 `Prompt (en)` 并保存，断言 draft 请求的 `moduleType` 为 `shortInput` 且 payload 保持完整结构。
5. 构造 Short Input、Pronunciation、Hanzi recognition 都 pending 的 snapshot，顶部只显示 `1 module pending publish`，并只出现 `Publish short input`；点击后断言 publish 请求使用 `moduleType: shortInput`。
6. 为 Short Input、Pronunciation、Hanzi recognition 都提供 published history；确认隐藏模块 history 不渲染，Short Input history 可见；点击旧 Short Input revision 的 rollback，断言 rollback 请求包含 `moduleType: shortInput` 与目标 revision。
7. 保留 Lesson Meta 等既有认证、保存、预览刷新、未保存离开提醒、发布失败和 rollback 测试。

### ModuleHistoryList 契约

通过页面测试锁定：

- 组件只遍历显式、已按白名单排序的 `modules` 输入；
- 完整 snapshot 可包含更多模块而不泄漏；
- Short Input 的 pending、history、publish 与 rollback 控制仍在 history 区工作。

本轮不为简单 prop 过滤单独新建测试文件。

### 浏览器回归

更新 `tests/e2e/admin-smoke.spec.ts`：

- mocked API snapshot 仍包含完整 9 模块；
- 进入 `/admin/lesson/self-intro` 后目录只有 7 个 Edit 入口；
- Pronunciation / Hanzi recognition 在课程编辑页不可见；
- Short Input 可见；
- 既有 Lesson Meta 保存、返回列表和 Voice 页面流程继续通过；
- Voice 页面仍可出现其既有 pronunciation 语音文案和目标，证明本轮未扩大到 Voice 管理。

### 验证命令

- `npm run test -- --run src/pages/AdminLessonEditorPage.test.tsx`
- `npm run test:e2e -- tests/e2e/admin-smoke.spec.ts`
- `npm run test -- --run`
- `npm run lint`
- `npm run build`
- `npm run test:e2e`

生产 smoke 使用已部署前端，并通过浏览器 route mock 提供完整 Admin snapshot，验证课程编辑器只显示 7 个模块、隐藏两项、Short Input 可见；同时核验部署状态与固定生产 URL。

## 明确边界

### 本轮范围内

- `/admin/lesson/:lessonId` 的可见模块白名单；
- 模块目录、选中状态、pending 数量和 Module History 同步过滤；
- 删除两个隐藏模块的页面配置、字段 import 与不可达编辑器分支；
- 保留并回归 Short Input；
- 对应 unit、E2E、review、部署和生产 smoke。

### 本轮范围外

- 删除 Pronunciation / Hanzi recognition 数据、字段定义、类型、schema、seed、API 或 revision/history；
- 修改 Voice 页面或 voice target；
- 修改 Admin 课程列表；
- 修改学习者页面和学习流程；
- 新增权限模型、迁移、恢复入口或隐藏模块清理工具；
- 重新设计 Admin 视觉样式、布局或文案系统。

## 交付与验收

- 规划与最终集成 owner：`dylan-t2-planner`
- 编码 owner：`dylan-t2-codex`
- 代码 review owner：`dylan-t2-reviewer`

实现者需提供 branch/commit、RED→GREEN、聚焦与完整 unit、lint、build、完整 E2E 和 scope diff。Reviewer 需明确给出 `pass` 或 `fix required`。Review 通过后由 owner 合并到最新 main，重跑 merged-head 验证，确认部署并完成生产 smoke。

验收成功标准：

1. Admin lesson editor 的所有区域都不显示 Pronunciation / Hanzi recognition。
2. 页面只展示并统计 7 个确认模块。
3. Short Input 编辑、历史与发布能力保持。
4. 完整 API snapshot 和底层旧数据能力不变。
5. Voice、Admin 列表及学习者流程不回归。
6. 自动化验证、review、部署与生产 smoke 均有可见证据。
