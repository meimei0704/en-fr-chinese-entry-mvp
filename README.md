# EN/FR Chinese Entry MVP

一个面向 **英语 / 法语母语者** 的零基础汉语入门 Web MVP。当前版本覆盖：

- 解释语言选择：English / Français
- 12 个场景课：daily-greetings / self-intro / ask-directions / order-food / phone-and-payment / restaurant-order / train-station-ticket / metro-ticket / convenience-store-run / ask-for-help-problem / pharmacy-help / small-talk
- 主学习路径：lesson → practice → short input
- review 队列与 progress 进度页
- 本地静态数据与浏览器 localStorage 学习进度

## Tech Stack

- Vite
- React 19
- TypeScript
- React Router
- Vitest
- Playwright
- Go 1.24（`net/http`）— 内容与内容管理 API 的 Vercel Functions 后端

## API 后端

公开内容读取与内容管理端点由 **Go Vercel Functions** 提供（`api/content/index.go`、`api/admin/content/index.go`），读取 MySQL 中已发布的课程内容并组装 JSON；TS 仅保留语音相关 Functions（`api/admin/voice/*.ts`）。TS↔Go 契约对比脚本：

```bash
node scripts/compare-content-api.mjs --admin
```

## Local Development

### Install

```bash
npm install
```

### Start dev server

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

### Run tests

```bash
npm run test -- --run
npx playwright test
```

### Build production assets

```bash
npm run build
```

### Preview production build locally

```bash
npm run preview -- --host 0.0.0.0 --port 4173
```

## Stable Deployment: Vercel

仓库里已配置 `vercel.json`，用于保证 React Router 的前端路由（如 `/home`、`/review`、`/lesson/self-intro`）在静态部署后仍可直接访问，并将 `/api/content/lessons/:lessonId` 重写到 Go 端点的查询参数形式。内容/内容管理 API 由仓库内的 Go Functions 构建（Vercel 会自动识别 `api/**/index.go`）。

- **当前固定生产地址**：`https://en-fr-chinese-entry-mvp.vercel.app`
- **当前 Vercel 项目**：`mei930/en-fr-chinese-entry-mvp`

### One-time setup

首次在一台新机器上部署时，在项目目录执行：

```bash
npx vercel login cuiqiu.bupt@gmail.com
npx vercel link --yes --scope mei930 --project en-fr-chinese-entry-mvp
```

首次部署时按提示完成：

1. 登录 Vercel
2. 链接到 `mei930/en-fr-chinese-entry-mvp`
3. 确认当前目录作为部署源

### Deploy production

```bash
npm run build
npx vercel deploy --prod --yes
```

部署完成后会得到一个固定的生产地址，后续可以反复作为验证入口使用。

### Update an existing deployment

代码更新后，重新执行：

```bash
npm run test -- --run
npx playwright test
npm run build
npx vercel deploy --prod --yes
```

### Optional: inspect current Vercel login/project state

```bash
npx vercel whoami
npx vercel project list
```

## Verification Path

无论本地还是线上，建议按下面路径验收：

1. 打开首页并选择 **English** 或 **Français**
2. 确认首页可见 3 个场景课
3. 进入 `self-intro`
4. 走完 **lesson → practice → short input → review → progress**
5. 重点检查：
   - EN / FR 解释内容会切换
   - review 页不是占位空页
   - progress 页会反映完成状态

## Fallback: Temporary external sharing

如果只需要临时外网演示，可在本地 preview 运行时配合 tunnel 使用，例如：

```bash
npm run preview -- --host 0.0.0.0 --port 4173
npx localtunnel --port 4173
```

但这不是长期交付方式；长期验证入口应优先使用 Vercel 固定 HTTPS 地址。
