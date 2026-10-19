# 工作描述录入技术文档

## 代码入口

| 路径 | 作用 |
| --- | --- |
| `app/page.tsx` | 首页表单、空值校验、背景字段和路由跳转 |
| `components/workflow-provider.tsx` | 将工作流保存到当前标签页 `sessionStorage` |
| `lib/types.ts` | `WorkBrief` 与 `WorkflowDraft` 类型 |

## 数据与边界

- 描述上限 4000 字；补充项有前端提示，服务端 schema 同样限制字段长度。
- 存储键为 `xiaogongxu-workflow-v1`；清除操作删除该键。
- 存储失败会记录不含用户文本的警告，继续保留内存态。

## 测试与验收

- 稳定选择器：`pain-point-input`、`start-clarification-button`。
- 已做 HTTP 首页 200 冒烟；详细输入验收尚待浏览器走查。

## TODO 对应项

- `TODO.md` §2.1、§3、§4、§8。
