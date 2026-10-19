# 本地主题引导技术文档

## 代码入口

| 路径 | 作用 |
| --- | --- |
| `app/clarify/page.tsx` | 逐题问答、摘要编辑和会话清除 |
| `lib/local-assistant.ts` | 固定主题问题、关键词检查和本地摘要 |
| `components/workflow-provider.tsx` | 当前标签页会话恢复和旧状态过滤 |

## 调用链路

```text
/clarify -> 本地关键词主题检查 -> 用户补充/跳过 -> 本地摘要 -> sessionStorage
```

## 数据与边界

- 五个固定主题：使用者、触发时机、输入信息、期望结果、例外情况。
- 规则根据描述或显式补充字段进行简单关键词检查；不是语义分析，结果需用户核对。
- 不调用模型、Route Handler 或外部 API，不需要 API Key；输入仅保存在当前标签页会话。

## 交互检查点

- 稳定选择器：`clarification-question`、`clarification-answer-input`、`conversation-history`、`generate-prd-button`。
- 用户可以回答或跳过每个未覆盖主题，且可以编辑整理后的摘要。

## TODO 对应项

- `TODO.md` §2.2、§8、§10。
