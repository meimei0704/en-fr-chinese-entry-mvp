# #t28 audit and e2e hardening notes

## npm audit root cause

Baseline `npm ci`/`npm audit` reported **3 high** vulnerabilities:

- `postcss@8.5.16` through `vite@8.1.3` (`vite` is used directly and through `@vitejs/plugin-react`/`vitest`). This is a dev/build-time dependency path, not runtime course content. The non-force `npm audit fix` moved the lockfile to `postcss@8.5.23` and `nanoid@3.3.16`, removing that finding.
- `react-router-dom@7.18.1` is a direct production dependency and pulls `react-router@7.18.1`. The reported advisory is the React Router RSC-mode CSRF bypass (`GHSA-qwww-vcr4-c8h2`) for `react-router` `7.12.0 - 8.2.0`.

The React Router item was not force-fixed. At the time of this branch, `npm view react-router-dom` reports `7.18.1` as the latest stable version. The audit-suggested force path downgrades to `react-router-dom@7.11.0`; testing that path showed it reintroduces older React Router high-severity advisory ranges instead of producing a clean audit. The app currently uses client-side `createBrowserRouter` routes with static elements and no RSC, SSR, loaders, or actions, but the vulnerable package remains in the production dependency graph.

After the safe lockfile update, the residual audit status is **2 high** vulnerabilities (`react-router` plus direct `react-router-dom` effect). Clearing those without `npm audit fix --force` is blocked on an upstream non-vulnerable React Router release or explicit approval for a larger router migration/downgrade risk.

## Playwright e2e port root cause and fix

The previous default Playwright config used `http://127.0.0.1:4173` for both `use.baseURL` and `webServer.url`, with `reuseExistingServer: true`. Because 4173 is Vite's common preview port, Playwright accepted any unrelated local service already listening there and ran tests against it instead of starting this app.

The default config now uses a dedicated `127.0.0.1:4174` dev server, passes `--strictPort`, and sets `reuseExistingServer: false`. If the dedicated port is occupied, default e2e fails fast instead of silently testing another app. A Vitest regression asserts those defaults.
