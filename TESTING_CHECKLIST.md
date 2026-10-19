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

## GitHub Pages 线上验收（2026-10-19）

地址：https://ding-ship-it-creator.github.io/codenow-starter/

- [x] 公开仓库并启用 GitHub Actions 发布来源，Pages 构建与发布成功。
- [x] 375×812 浏览器视口走通首页 → 本地主题梳理 → MVP 讨论稿。
- [x] 三个页面均无横向溢出，澄清和结果页 `scrollWidth` 均为 375px。
- [x] 直接刷新 `/codenow-starter/result/` 返回正常页面，草稿从当前会话恢复。
- [x] 下载 Markdown 成功；清除测试会话后回到首页。
- [x] 本地静态导出、lint 和 typecheck 通过；没有 test script。
- [ ] 真实手机硬件、蜂窝网络和微信内置浏览器需由用户实际打开链接确认。
- 首次发布证据：[GitHub Actions 成功记录](https://github.com/DING-ship-it-creator/codenow-starter/actions/runs/39220747512)。手机视口截图保存在本次 Codex 部署任务的输出中。
- 部署改用 GitHub Pages，原 Vercel 待办由本次发布替代。
