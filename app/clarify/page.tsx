"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, MessageCircle, RotateCcw, SkipForward } from "lucide-react";
import { Shell, StepLabel } from "@/components/shell";
import { useWorkflow } from "@/components/workflow-provider";
import { buildLocalSummary, getNextTopic, topicLabel } from "@/lib/local-assistant";
import { emptyWorkflow } from "@/lib/types";

export default function ClarifyPage() {
  const router = useRouter();
  const { workflow, setWorkflow, hydrated } = useWorkflow();
  const [answer, setAnswer] = useState("");
  useEffect(() => { if (hydrated && !workflow.brief) router.replace("/"); }, [hydrated, workflow.brief, router]);

  const begin = () => {
    if (!workflow.brief) return;
    const next = getNextTopic(workflow.brief, workflow.clarifications);
    setWorkflow({ ...workflow, summary: buildLocalSummary(workflow.brief, workflow.clarifications), nextQuestion: next?.question ?? "", nextTopic: next?.id ?? null, ready: !next });
  };
  const record = (skipped = false) => {
    if (!workflow.brief || !workflow.nextTopic) return;
    const history = [...workflow.clarifications, { topic: workflow.nextTopic, question: workflow.nextQuestion, answer: skipped ? undefined : answer.trim(), skipped }];
    const next = getNextTopic(workflow.brief, history);
    setWorkflow({ ...workflow, clarifications: history, summary: buildLocalSummary(workflow.brief, history), nextQuestion: next?.question ?? "", nextTopic: next?.id ?? null, ready: !next, markdown: "", confirmed: false });
    setAnswer("");
  };
  const clearSession = () => {
    sessionStorage.removeItem("xiaogongxu-workflow-v1");
    setWorkflow(emptyWorkflow);
    router.push("/");
  };
  if (!hydrated || !workflow.brief) return <Shell><div className="mx-auto max-w-[760px] py-20 text-sm text-[var(--color-muted-foreground)]">正在载入本次需求…</div></Shell>;
  const first = !workflow.summary && workflow.clarifications.length === 0 && !workflow.nextQuestion;
  return <Shell back><section className="mx-auto max-w-[960px] pt-8">
    <StepLabel step="02" title="一起把需求理清楚"/>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-3xl font-medium tracking-[-.04em]">先把关键信息补齐。</h1><p className="mt-2 text-sm text-[var(--color-muted-foreground)]">按使用者、触发时机、输入、结果和例外情况逐项梳理。每次只问一件事。</p></div><button onClick={clearSession} className="inline-flex min-h-10 items-center gap-2 text-xs text-[var(--color-muted-foreground)]"><RotateCcw size={14}/>清除本次会话</button></div>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-4">
        <article className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5"><div className="mb-3 text-[11px] font-semibold uppercase tracking-[.12em] text-[var(--color-muted-foreground)]">你描述的工作</div><p className="whitespace-pre-wrap text-sm leading-6">{workflow.brief.description}</p>{Object.entries(workflow.brief).filter(([k,v])=>k!=="description"&&v).map(([k,v])=><p key={k} className="mt-2 text-xs leading-5 text-[var(--color-muted-foreground)]">{({currentProcess:"目前做法",frequency:"频率",people:"涉及人员",desiredOutcome:"期望结果"} as Record<string,string>)[k]}：{v}</p>)}</article>
        <article data-testid="conversation-history" className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5"><div className="mb-3 flex items-center gap-2 text-xs font-semibold"><MessageCircle size={15} className="text-[var(--color-accent-teal)]"/>需求梳理</div>
          {workflow.nextQuestion ? <><div data-testid="clarification-question" className="border-l-2 border-[var(--color-accent-teal)] pl-4"><span className="text-xs text-[var(--color-muted-foreground)]">{workflow.nextTopic ? topicLabel(workflow.nextTopic) : "需求"} · 固定主题提示</span><p className="mt-1 text-[17px] leading-7">{workflow.nextQuestion}</p></div><label className="sr-only" htmlFor="answer">回答这个问题</label><textarea id="answer" data-testid="clarification-answer-input" rows={3} maxLength={1200} value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="写下你的想法，也可以补充或纠正已有描述…" className="mt-5 w-full border border-[var(--color-border)] bg-white p-3 text-sm leading-6"/><div className="mt-3 flex flex-wrap justify-between gap-3"><button onClick={()=>record(true)} className="inline-flex min-h-10 items-center gap-2 text-sm text-[var(--color-muted-foreground)]"><SkipForward size={15}/>跳过这个问题</button><button disabled={!answer.trim()} onClick={()=>record()} className="inline-flex min-h-11 items-center gap-2 bg-[var(--color-primary)] px-4 text-sm text-white disabled:opacity-50">记录回答<ArrowRight size={15}/></button></div></> : workflow.ready ? <div className="border border-[var(--color-accent-teal)]/40 bg-white p-4"><div className="flex items-center gap-2 text-sm font-medium"><Check size={16} className="text-[var(--color-accent-teal)]"/>主题清单已走完</div><p className="mt-2 text-xs leading-5 text-[var(--color-muted-foreground)]">规则只做关键词提醒；下方草稿根据你提供的内容整理，请在使用前核对。</p><button data-testid="generate-prd-button" onClick={()=>router.push("/result")} className="mt-4 inline-flex min-h-11 items-center gap-2 bg-[var(--color-primary)] px-4 text-sm text-white">整理讨论稿与 MVP 清单<ArrowRight size={15}/></button></div> : <div className="border border-[var(--color-border)] bg-white p-4"><p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{first?"开始后会按固定主题检查已填写的信息，并逐项提示可能需要补充的内容。":"可以继续梳理，也可以生成带待补充标记的讨论稿。"}</p><button onClick={begin} className="mt-4 inline-flex min-h-11 items-center gap-2 bg-[var(--color-primary)] px-4 text-sm text-white">{first?"开始本地梳理":"继续梳理"}<ArrowRight size={15}/></button></div>}
          {workflow.clarifications.length>0&&<ul className="mt-5 space-y-2 border-t border-[var(--color-border)] pt-4">{workflow.clarifications.map((item,index)=><li key={`${item.topic}-${index}`} className="text-xs leading-5"><span className="font-medium">{topicLabel(item.topic)}：</span>{item.skipped?<span className="text-[var(--color-muted-foreground)]">已跳过</span>:item.answer}</li>)}</ul>}
        </article>
        {workflow.summary && <article className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5"><label htmlFor="summary" className="mb-2 block text-xs font-semibold">当前需求摘要 <span className="font-normal text-[var(--color-muted-foreground)]">（可直接修改，生成时会采用修改后的内容）</span></label><textarea id="summary" value={workflow.summary} onChange={e=>setWorkflow({...workflow,summary:e.target.value})} rows={5} maxLength={4000} className="w-full border border-[var(--color-border)] bg-white p-3 text-sm leading-6"/></article>}
      </div>
      <aside className="h-fit border border-[var(--color-border)] bg-[var(--color-surface)] p-5"><h2 className="text-sm font-semibold">本地梳理说明</h2><p className="mt-3 text-xs leading-5 text-[var(--color-muted-foreground)]">不需要 API Key。主题检查和讨论稿模板都在当前浏览器中运行，输入不会发送到 AI 服务。系统使用固定问题和简单关键词规则，不具备 AI 的语义理解能力；请按实际情况修改摘要和最终草稿。</p><Link href="/" className="mt-5 inline-flex min-h-10 items-center gap-2 text-xs text-[var(--color-muted-foreground)]"><ArrowLeft size={14}/>返回修改描述</Link></aside>
    </div>
  </section></Shell>;
}
