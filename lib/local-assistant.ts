import type { Clarification, ClarificationTopic, WorkBrief } from "@/lib/types";

type TopicRule = {
  id: ClarificationTopic;
  label: string;
  question: string;
  signal: RegExp;
};

// 这是透明的主题清单与关键词检查，不调用模型，也不声称理解用户材料。
export const topicRules: TopicRule[] = [
  { id: "users", label: "使用者", question: "谁会使用这个小工具？其中谁最需要看到结果？", signal: /谁来|谁会|用户|使用者|同事|团队|员工|客户|运营|设计师|负责人|面向/ },
  { id: "trigger", label: "触发时机", question: "你通常在什么时候开始这项工作？多久会遇到一次？", signal: /每天|每周|每月|每年|每\s*[一二三四五六七日天月年]|定期|遇到|收到|触发|开始时|例会前|月底|周一|工作日/ },
  { id: "inputs", label: "输入信息", question: "开始处理时，你会用到哪些信息？这些信息现在从哪里来？", signal: /表格|文件|数据|消息|订单|系统|群聊|表单|录入|复制|导入|采集|后台|邮件/ },
  { id: "outcome", label: "期望结果", question: "做完之后，你希望拿到什么结果？怎样算这件事做好了？", signal: /希望|目标|结果|减少|节省|生成|导出|提醒|看板|自动|汇总|完成后|最后得到/ },
  { id: "exceptions", label: "例外情况", question: "有没有例外、权限限制，或必须由人检查确认的情况？", signal: /例外|特殊|错误|权限|审批|人工|但是|除非|异常|退回|不允许|确认/ },
];

function isCovered(rule: TopicRule, brief: WorkBrief) {
  const explicit: Partial<Record<ClarificationTopic, string | undefined>> = {
    users: brief.people,
    trigger: brief.frequency,
    inputs: brief.currentProcess,
    outcome: brief.desiredOutcome,
  };
  return Boolean(explicit[rule.id]?.trim()) || rule.signal.test(brief.description);
}

export function getNextTopic(brief: WorkBrief, history: Clarification[]) {
  const visited = new Set(history.map((item) => item.topic));
  return topicRules.find((rule) => !visited.has(rule.id) && !isCovered(rule, brief)) ?? null;
}

export function buildLocalSummary(brief: WorkBrief, history: Clarification[]) {
  const answers = new Map(history.map((item) => [item.topic, item]));
  const values: [ClarificationTopic, string | undefined][] = [
    ["users", brief.people], ["trigger", brief.frequency], ["inputs", brief.currentProcess], ["outcome", brief.desiredOutcome],
  ];
  const details = values.map(([topic, value]) => {
    const answer = answers.get(topic);
    const rule = topicRules.find((item) => item.id === topic)!;
    const content = answer?.answer || value;
    const detected = rule.signal.test(brief.description);
    const fallback = answer?.skipped ? "暂不补充" : detected ? "描述中包含相关线索（请核对）" : "待补充";
    return `- ${rule.label}：${content?.trim() || fallback}`;
  });
  const exception = answers.get("exceptions");
  details.push(`- 例外与人工确认：${exception?.answer?.trim() || (exception?.skipped ? "暂不补充" : "待确认")}`);
  return `工作描述：\n${brief.description.trim()}\n\n已梳理的信息：\n${details.join("\n")}`;
}

const topicAnswer = (history: Clarification[], topic: ClarificationTopic) => history.find((item) => item.topic === topic)?.answer?.trim();
const provided = (value?: string, detected = false) => value?.trim() || (detected ? "描述中包含相关线索（请核对原文）" : "待补充");

export function buildLocalProposal(brief: WorkBrief, history: Clarification[], summary: string) {
  const title = brief.description.trim().replace(/[。！？.!?]+$/, "").slice(0, 42);
  const inputs = brief.currentProcess || topicAnswer(history, "inputs");
  const trigger = brief.frequency || topicAnswer(history, "trigger");
  const users = brief.people || topicAnswer(history, "users");
  const outcome = brief.desiredOutcome || topicAnswer(history, "outcome");
  const exceptions = topicAnswer(history, "exceptions");
  const unanswered = topicRules
    .filter((rule) => !history.some((item) => item.topic === rule.id && (item.answer?.trim() || item.skipped)) && !isCovered(rule, brief))
    .map((rule) => rule.label);
  const covered = (topic: ClarificationTopic) => isCovered(topicRules.find((rule) => rule.id === topic)!, brief);
  const checklist = [
    `- [ ] 记录一条工作事项：${brief.description.trim()}`,
    `- [ ] 支持补充相关输入信息：${provided(inputs)}`,
    `- [ ] 展示或导出期望结果：${provided(outcome)}`,
    `- [ ] 为例外情况提供人工检查入口：${provided(exceptions)}`,
  ];

  return `# ${title || "工作改进方案"}：MVP 讨论稿

> 本文由浏览器内的固定模板根据你填写的内容整理，不调用 AI，也不会发送到网络。清单是讨论建议，尚未由你逐项确认。

## 一句话目标

把「${brief.description.trim()}」这项工作整理成更清晰、可重复的流程。

## 用户与场景

- 使用者：${provided(users, covered("users"))}
- 触发时机：${provided(trigger, covered("trigger"))}
- 当前工作描述：${brief.description.trim()}

## 当前做法与输入

${provided(inputs, covered("inputs"))}

## 期望结果

${provided(outcome, covered("outcome"))}

## MVP 功能清单（待确认）

${checklist.join("\n")}

## 例外与限制

${provided(exceptions)}

## 主要流程（讨论草案）

1. 使用者在工作开始时录入或粘贴相关信息。
2. 工具按上面的清单整理信息，并让使用者检查结果。
3. 使用者确认后复制或导出结果；不确定的内容保留为待补充。

## 验收建议

- 使用者能说明输入信息来自哪里，并在工具中找到对应的录入位置。
- 处理后的结果包含用户明确填写的期望内容，不把待补充信息当成已确认事实。
- 遇到例外或权限限制时，流程能停下来交由人工确认。

## 待补充信息

${unanswered.length ? unanswered.map((item) => `- ${item}`).join("\n") : "- 目前已回答主题清单中的问题；请继续人工核对事实和范围。"}

## 本次需求摘要

${summary.trim() || buildLocalSummary(brief, history)}
`;
}

export function topicLabel(topic: ClarificationTopic) {
  return topicRules.find((rule) => rule.id === topic)?.label ?? topic;
}

export type { ClarificationTopic };
