"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Lightbulb, Sparkles } from "lucide-react";
import { Shell, StepLabel } from "@/components/shell";
import { useWorkflow } from "@/components/workflow-provider";
import type { WorkBrief } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const { workflow, setWorkflow } = useWorkflow();
  const [description, setDescription] = useState(workflow.brief?.description ?? "");
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [extra, setExtra] = useState({ currentProcess: "", frequency: "", people: "", desiredOutcome: "" });
  const examples = ["每周要从几份表格里手动汇总活动数据", "总要在多个群聊里追问素材审批进度", "重复整理客户反馈，再同步给产品团队"];
  const submit = () => {
    if (!description.trim()) { setError("先写一件让你觉得重复或耗时的工作。"); return; }
    if (busy) return;
    setBusy(true); setError("");
    const brief: WorkBrief = { description: description.trim(), ...Object.fromEntries(Object.entries(extra).map(([key, value]) => [key, value.trim() || undefined])) };
    setWorkflow({ ...workflow, brief, clarifications: [], summary: "", nextQuestion: "", nextTopic: null, ready: false, markdown: "", confirmed: false });
    router.push("/clarify");
  };
  return <Shell><section className="mx-auto max-w-[960px] pt-14 md:pt-20">
    <StepLabel step="01" title="说说你的工作"/>
    <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
      <div><div className="mb-8 inline-flex items-center gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs"><Sparkles size={14} className="text-[var(--color-accent-teal)]"/>从日常语言开始，不需要懂产品或技术</div>
        <h1 className="max-w-[650px] text-[clamp(36px,6vw,58px)] font-medium leading-[1.13] tracking-[-.055em]">把重复工作讲清楚，<br/><span className="text-[var(--color-muted-foreground)]">整理成可落地的方案。</span></h1>
        <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[var(--color-muted-foreground)]">描述一件耗时或重复的事。小工序会按固定主题提示你补齐信息，再整理成可编辑的 MVP 讨论稿。</p>
        <div className="mt-9 border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-5">
          <label htmlFor="pain-point" className="mb-3 block text-sm font-medium">最近哪件工作最想省点时间？</label>
          <textarea id="pain-point" data-testid="pain-point-input" value={description} onChange={e => { setDescription(e.target.value); setError(""); }} maxLength={4000} rows={6} placeholder="比如：每周一，我要把三份表格里的活动数据复制到一起，再手动算出各渠道的报名数……" className="w-full resize-y border border-[var(--color-border)] bg-white px-4 py-3 text-sm leading-6 placeholder:text-[#9a9891]"/>
          <div className="mt-2 flex justify-between text-xs text-[var(--color-muted-foreground)]"><span>可以写写现在怎么做、多久一次、希望得到什么结果</span><span>{description.length}/4000</span></div>
          <button type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)} className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-medium"><ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`}/>补充一点背景 <span className="font-normal text-[var(--color-muted-foreground)]">（可选）</span></button>
          {expanded && <div className="mt-3 grid gap-3 sm:grid-cols-2">{([["currentProcess","目前是怎么做的？"],["frequency","多久做一次？"],["people","会涉及哪些人？"],["desiredOutcome","理想结果是什么？"]] as const).map(([key,label])=><label key={key} className="text-xs font-medium">{label}<input value={extra[key]} onChange={e=>setExtra({...extra,[key]:e.target.value})} className="mt-2 min-h-11 w-full border border-[var(--color-border)] bg-white px-3 text-sm font-normal"/></label>)}</div>}
          {error && <p role="alert" className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>}
          <div className="mt-5 flex flex-col gap-3 border-t border-[var(--color-border)] pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-[var(--color-muted-foreground)]">内容仅保存在当前标签页；梳理和草稿生成都在本地完成，无需 AI 服务或 API Key。</p><button data-testid="start-clarification-button" onClick={submit} disabled={busy} className="inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--color-primary)] px-5 text-sm font-medium text-white hover:bg-[#373733] disabled:opacity-60">{busy ? "正在整理你的描述…" : "开始需求梳理"}<ArrowRight size={16}/></button></div>
        </div>
      </div>
      <aside className="pt-2 lg:pt-28"><div className="mb-3 flex items-center gap-2 text-xs font-medium"><Lightbulb size={15} className="text-[var(--color-accent-amber)]"/>不知道怎么写？试试这个</div><div className="space-y-2">{examples.map((example,i)=><button key={example} onClick={()=>{setDescription(example);setError("");}} className="block w-full border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-left text-[13px] leading-5 hover:border-[var(--color-accent-teal)]"><span className={`mr-2 inline-block size-1.5 rounded-full align-middle ${i===0?"bg-[var(--color-accent-teal)]":i===1?"bg-[var(--color-accent-blue)]":"bg-[var(--color-accent-pink)]"}`}/>{example}</button>)}</div><div className="mt-7 border-l-2 border-[var(--color-accent-teal)] pl-4 text-xs leading-5 text-[var(--color-muted-foreground)]">接下来会按固定主题逐题梳理。关键词规则只提供提醒，不会假装理解业务；你可以补充、修改或跳过。</div></aside>
    </div>
  </section></Shell>;
}
