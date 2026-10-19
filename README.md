# 小工序

把重复工作讲清楚，整理成可落地的 MVP 方案。应用提供痛点录入、固定主题引导、讨论稿整理与 Markdown 编辑导出。当前版本不调用 AI，全部在浏览器本地完成，不需要 API Key。

## 运行

需要 Node.js 20.19+ 或 22.13+。当前环境为 Node.js 22.11.0，Next.js 可启动，但 ESLint 的一个传递依赖声明需要更新 Node 补丁版本。

```bash
npm install
```

然后运行：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。用户输入和草稿只在当前标签页的 `sessionStorage` 中保留。主题引导使用固定问题和简单关键词匹配，不具备 AI 的语义理解能力；讨论稿由固定模板生成，提交前请核对内容。

## 验证

- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- 尚无 `test` script。全量 UI 验收待执行。

## 主要目录

```text
app/                    Next.js 页面
components/             页面壳和标签页工作流状态
lib/types.ts            工作描述、澄清和会话结构
design-system/小工序/    视觉与交互设计系统
API文档/                 API 接入参考资料（当前版本不调用外部 API）
TODO.md                  开发进度与下一步任务
prd/                     与当前实现同步的产品/技术文档
```

## 文档

- [开发计划与未完成事项](TODO.md)
- [项目协作说明](AGENTS.md)
- [当前实现文档](prd/README.md)
- `prd.original.md` 是原始目标归档，仅供回顾。
