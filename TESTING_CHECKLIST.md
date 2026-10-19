# 小工序部署与手机验收

## 本地静态验证

- [x] `npm run lint`
- [ ] `npm run test` — 仓库未提供该 script。
- [x] `npm run typecheck`
- [x] `npm run build` — Next.js 16 production build 成功。

## 本地手机视口（375 × 812）

- [x] 首页可以录入描述；视口宽度 375px，页面 `scrollWidth` 为 375px。
- [x] 进入澄清页，单题补充使用者和例外；页面无横向溢出。
- [x] 进入结果页并显示可编辑 MVP 讨论稿；页面无横向溢出。
- [x] 信息保留为浏览器本地内容，不调用 AI 服务或外部 API。
- 证据：`test-results/home-375-mobile.png`、`test-results/clarify-375-mobile.png`、`test-results/result-375-mobile.png`。

## Vercel 线上验收

- [ ] Vercel 集成尚未连接；连接并授权后部署当前 GitHub 私有仓库。
- [ ] 获取 `.vercel.app` 地址后，从手机网络打开并走完首页 → 主题梳理 → 讨论稿流程。
- [ ] 如线上出现空白页或 404，检查 Vercel deployment logs / Console 后修复并重新部署。
