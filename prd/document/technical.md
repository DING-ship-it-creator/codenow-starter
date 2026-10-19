# 讨论稿生成与导出技术文档

## 代码入口

| 路径 | 作用 |
| --- | --- |
| `app/result/page.tsx` | 本地生成 Markdown、编辑、确认、复制和下载 |
| `lib/local-assistant.ts` | 固定模板序列化工作描述和澄清信息 |
| `lib/types.ts` | 会话工作流与 Markdown 字段 |

## 调用链路

```text
/result -> 浏览器本地模板 -> Markdown 编辑器 -> Clipboard API 或 Blob 下载
```

## 边界

- 文档内容来自用户输入和固定模板，不调用模型或外部 API。
- 未提供的信息保留为“待补充”；页面明确提示这是待核对的讨论稿。
- 编辑变更会撤销“已确认”状态；复制/下载读取当前编辑文本。
- 文件名为 `小工序-讨论稿.md`。

## 交互检查点

- 稳定选择器：`generation-loading`、`prd-preview`。
- 剪贴板权限和下载失败提示仍需浏览器验收。

## TODO 对应项

- `TODO.md` §2.3、§2.4、§7、§8、§10。
