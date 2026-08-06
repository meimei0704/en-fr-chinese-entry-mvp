# 课程页三层学习结构精简设计

## 目标

在不改变课程数据与核心学习流程的前提下，降低学习者课程页顶部和正文的信息冗余，让首屏更快进入有效学习内容。

本轮将所有学习者课程页从 5 个学习层精简为 3 个：

1. Dialogue
2. Sentence patterns
3. Vocabulary

课程页不再展示 Pronunciation、Hanzi recognition，也不再提供 `Finish with short input` 入口。底层内容、类型、后台编辑能力和既有路由仍保留，后续另开清理任务处理冗余数据。

## 用户确认的方向

线程中已确认以下决策：

1. 采用 visual companion 中的**方案 1：紧凑纵向布局**。
2. 删除课程页中与首页重复的 dialogue 说明文案，例如 `Ask for help from baggage claim to the taxi pickup`。
3. 将 `5 study layers` 改为 `3 study layers`。
4. 课程页只展示 Dialogue、Sentence patterns、Vocabulary。
5. Pronunciation 与 Hanzi recognition 不再作为第 4、5 层展示。
6. `Finish with short input` 不再出现在课程页操作区。
7. 本轮只改变学习者课程页的展示与入口；底层 Pronunciation、Hanzi recognition、short-input 数据和能力后续再清理。

## 当前基线

设计分支已刷新到 `origin/main` 的 `c7a87c6`；实现者开始编码前仍需再次获取并确认最新 `origin/main`，再从该基线建立隔离 worktree。

`src/pages/LessonPage.tsx` 当前包含：

- 课程 eyebrow、课程主题标题和 dialogue 标题；
- 由 5 个 copy key 组成的 `studyLayers`；
- 5 个正文区块：Dialogue、Sentence patterns、Vocabulary、Pronunciation、Hanzi recognition；
- 3 个底部操作：Go to practice、Finish with short input、Back to home。

页面结构清晰，但 dialogue 标题与首页/课程主题重复，5 层轨道和后两个学习区块增加了页面长度，`Finish with short input` 也不是本轮期望保留的主要入口。

## 页面结构

### 1. 紧凑页头

页头继续保留：

- lesson eyebrow；
- `LessonTopicTitle` 渲染的中文主标题与英语/法语副标题。

删除 `lesson.dialogue.title` 对应的 `.lede`。该文本仍保留在课程数据中，只是不在学习者课程页渲染。

通过学习者页专属选择器收紧 `.lesson-page .lesson-header-card`、`.lesson-page .lesson-header-card__title`、进度摘要及相邻区块之间的垂直间距，使课程标题、三层进度和场景简介更靠近页面顶部。不得通过负 margin、固定高度或裁切内容实现压缩。

### 2. 三层进度预览

`studyLayers` 只包含：

- `copy.lessonPage.dialogue`
- `copy.lessonPage.sentencePatterns`
- `copy.lessonPage.vocabulary`

计数继续由 `studyLayers.length` 生成，因此英语页面显示 `3 study layers`，法语页面使用现有本地化计数文案。

步骤轨道继续使用既有有序列表和当前层样式，不新增 sticky、横向滚动或新的交互状态。桌面端轨道明确改为 `repeat(3, minmax(0, 1fr))`，让三个步骤等宽占满可用空间，不保留原五列布局造成的 40% 空白；`760px` 及以下明确切换为单列，且在 320px 宽度下不得横向溢出。

### 3. 三个正文区块

课程页正文只渲染：

1. Dialogue
2. Sentence patterns
3. Vocabulary

删除 LessonPage 中 Pronunciation 与 Hanzi recognition 的两个渲染区块。对应课程数据、audio、类型、后台编辑配置和数据库 seed 不修改；`pronunciation`、`hanziRecognition` 等未展示标签 key 也保留，供后台和后续清理任务使用。

`LessonPage` 的场景摘要始终渲染 `copy.lessonPage.sectionSummary`，因此本轮必须同步更新 `src/content/copy.ts` 中英语和法语的 `sectionSummary`，只描述 Dialogue、Sentence patterns、Vocabulary 三层，不得继续出现 pronunciation 或 hanzi recognition。该两条学习者页面摘要文案是本轮唯一需要修改的现有 copy 内容。

### 4. 底部操作

课程页底部只保留：

- `Go to practice`
- `Back to home`

删除 `Finish with short input` 链接。既有 `/lesson/:lessonId/short-input` 路由、Practice 到 short input 的后续流程、进度写入与底层 short-input 内容不修改。

## 行为与数据流

- 课程加载、找不到课程时的兜底页面保持不变。
- 首次访问课程时写入 `lastVisitedLesson` 的行为保持不变。
- 语言切换仍更新并持久化 `selectedExplanationLanguage`。
- 场景简介、Dialogue、Sentence patterns、Vocabulary 继续按所选语言显示解释。
- Practice 流程、short-input 直接路由与后续跳转保持不变。
- 本轮不删除或迁移任何课程数据，不修改 schema、数据库 seed、后台编辑接口或内容 provider。

## 样式与响应式约束

为学习者课程页的 `<main>` 新增专属 hook，例如 `.lesson-page`。样式修改集中于 `src/styles/global.css`，所有新增的紧凑间距和三列轨道覆盖均必须以该 hook 为祖先，例如：

- `.lesson-page .lesson-header-card`
- `.lesson-page .lesson-header-card__title`
- `.lesson-page .lesson-progress-preview`
- `.lesson-page .lesson-progress-preview__summary`
- `.lesson-page .lesson-progress-preview__rail`
- `.lesson-page .lesson-overview-card`

约束：

- 不直接收紧共享的 `.lesson-header-card, .review-card` 基线规则，也不对裸 `.lesson-header-card` 添加新的紧凑声明；该 class 同时被后台编辑页复用。
- Admin 编辑页继续使用现有 `.lesson-header-card`，但不带 `.lesson-page` 祖先；Review 页和其他非课程页也不得命中本轮新增覆盖。
- 不修改共享 spacing token，避免影响首页、Progress、Review 或后台页面。
- 不使用固定 viewport 高度来追求“首屏放下更多内容”。
- 320px 宽度下不得出现横向溢出。
- `.lesson-page .lesson-progress-preview__rail` 在桌面端为 3 等列，并在 `760px` 及以下由同等或更高特异性的课程页专属媒体规则变为单列，避免桌面专属选择器覆盖现有移动端规则。
- 三步轨道保持语义化 `<ol>` / `<li>`，当前步骤提示仍可辨认。
- 键盘焦点、文本对比度与操作按钮可访问名称不得回归。

## 错误处理与兼容性

本轮不新增请求、异步状态或错误分支。兼容策略是“停止展示但保留底层能力”：

- 旧进度数据无需迁移。
- 旧 short-input 深链继续可访问。
- Pronunciation 与 Hanzi recognition 数据继续可由后台编辑和后续清理任务读取。
- 页面不依赖第 4/5 层的 DOM 或数量来保存课程进度。

## 测试设计

实现时先更新/新增失败测试，再修改页面与样式。

### LessonPage 聚焦测试

在 `src/pages/LessonPage.test.tsx` 锁定：

1. 进度预览显示 3 层，并包含 Dialogue、Sentence patterns、Vocabulary。
2. 进度预览和正文均不出现 Pronunciation、Hanzi recognition。
3. 英语与法语的 `sectionSummary` 分别正向包含三层含义，并负向断言不包含 pronunciation / prononciation、hanzi recognition / reconnaissance des hanzi。
4. 不再渲染 `lesson.dialogue.title`，包含英语与法语样例。
5. 不再出现 `Finish with short input` 链接。
6. `Go to practice`、`Back to home` 与语言切换仍可用。
7. 音频播放数量与断言只覆盖仍展示的 Dialogue、Sentence patterns、Vocabulary。
8. 访问不存在的 `/lesson/:lessonId` 显示本地化兜底内容与 `Back to home`，且不写入课程访问进度。
9. 访问有效课程只把 `lastVisitedLesson` 更新为当前 lesson；`completedLessons`、`reviewQueue`、`lessonStepProgress` 及 `selectedExplanationLanguage` 等其他既有进度字段保持原值。

### 路由与流程回归

- 保留 `src/pages/LessonRoutes.test.tsx` 对 Practice → short input 流程的既有断言。
- 保留 `tests/e2e/mvp-flow.spec.ts` 对 short-input 后续流程的覆盖。
- 更新 `tests/e2e/lesson-action-dock.spec.ts`，断言课程页操作区只有保留的入口且布局正常。
- 无效 lesson 路由兜底和 `lastVisitedLesson` 持久化边界由上述 `LessonPage` 聚焦测试直接覆盖，不只依赖人工 smoke。

### 样式与可访问性

- 在 `src/styles/global.test.ts` 中断言新增紧凑声明只存在于 `.lesson-page ...` 选择器下，桌面轨道为 3 等列、移动端课程页专属规则为单列；同时负向断言未向裸 `.lesson-header-card`、`.review-card` 或后台选择器泄漏本轮声明，避免依赖脆弱的像素快照。
- 在 `src/pages/AdminLessonEditorPage.test.tsx` 增加/保留回归断言：后台 hero 可继续使用 `.lesson-header-card`，但其祖先不含 `.lesson-page`，从结构上不会命中学习者页紧凑覆盖。
- 桌面和移动端进行人工/浏览器 smoke，检查顶部压缩、三步骤布局、按钮布局、可见焦点和无横向溢出；至少验证一个大于 760px 的桌面宽度为 3 等列，以及 320px 宽度为单列且 `document.documentElement.scrollWidth <= clientWidth`。

### 验证命令

- `npm run test -- --run src/pages/LessonPage.test.tsx src/pages/LessonRoutes.test.tsx src/pages/AdminLessonEditorPage.test.tsx src/styles/global.test.ts`
- `npm run test -- --run`
- `npm run lint`
- `npm run build`
- 可用时运行课程页相关 Playwright 测试与生产 smoke。

## 明确边界

### 本轮范围内

- 所有学习者课程页的页头与间距精简；
- 删除重复 dialogue 标题展示；
- 5 层精简为 3 层；
- 停止渲染 Pronunciation、Hanzi recognition；
- 将英语、法语课程页 `sectionSummary` 更新为只描述三层；
- 删除课程页 `Finish with short input` 入口；
- 以学习者页专属 hook 收紧间距、设置桌面三等列/移动端单列，并完成对应测试和响应式回归。

### 本轮范围外

- 删除 Pronunciation、Hanzi recognition、short-input 的课程数据；
- 修改类型、schema、数据库 seed、后台编辑页面或 API；
- 删除 short-input 路由或 Practice 后续流程；
- 修改首页、Progress、Review、课程顺序或持久化模型；
- 引入新的学习步骤交互、sticky 导航或横向滚动。

## 交付与验收

- 规划与最终集成 owner：`dylan-t2-planner`
- 编码 owner：`dylan-t2-codex`
- 代码 review owner：`dylan-t2-reviewer`

实现者需提供 branch/commit、聚焦测试、完整测试、lint、build 结果及遗留风险。Reviewer 需给出明确的 `pass` 或 `fix required` 结论。Review 通过后由 owner 完成合并、合并头验证、部署与生产课程页 smoke。

验收成功标准：

1. 课程页首屏比当前更紧凑，且信息层级仍清楚。
2. 页面只展示 3 个学习层及 3 个对应正文区块。
3. 重复 dialogue 标题和 `Finish with short input` 不再出现。
4. 未获批准的课程数据、路由、进度、复习与后台能力不变。
5. 桌面、移动端、英语、法语模式均无明显回归。
6. 自动化验证、review、部署与生产 smoke 均有可见证据。
