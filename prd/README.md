# 产品文档

## 项目概览

小工序帮助运营、设计等不熟悉产品拆解的用户，把重复工作整理成可以讨论和交给 Codex 的 MVP 方案。当前版本使用浏览器内的固定主题问题和 Markdown 模板，不调用 AI 或外部 API，也不需要 API Key。

## 模块索引

| 模块 | 状态 | 产品文档 | 技术文档 |
| --- | --- | --- | --- |
| 工作描述录入 | 部分实现 | `intake/README.md` | `intake/technical.md` |
| 本地主题引导 | 已实现 | `clarification/README.md` | `clarification/technical.md` |
| 方案生成与导出 | 部分实现 | `document/README.md` | `document/technical.md` |

## 用户流程

```text
描述工作 -> 本地主题引导 -> 生成 Markdown 讨论稿 -> 编辑、确认、复制或下载
```

## 当前重点

- 继续任务以根目录 `TODO.md` 为准。
- 逐条完成全量 UI 验收；评估是否需要将可选 AI 服务作为后续独立能力。

## 文档规则

- `prd/<module>/README.md` 描述用户能力和状态。
- `prd/<module>/technical.md` 描述代码入口、数据、调用、日志和验收。
- `TODO.md` 是未完成任务和阻塞项的唯一入口。
- `prd.original.md` 是原始目标归档，不作为开发依据。
