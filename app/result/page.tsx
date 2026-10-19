"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, CheckCheck, Clipboard, Download, RotateCcw } from "lucide-react";
import { Shell, StepLabel } from "@/components/shell";
import { useWorkflow } from "@/components/workflow-provider";
import { buildLocalProposal } from "@/lib/local-assistant";
import { emptyWorkflow } from "@/lib/types";

export default function ResultPage() {
  const router = useRouter();
  const { workflow, setWorkflow, hydrated } = useWorkflow();
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (!hydrated) return;
    if (!workflow.brief) { router.replace("/"); return; }
    if (!workflow.markdown) setWorkflow({ ...workflow, markdown: buildLocalProposal(workflow.brief, workflow.clarifications, workflow.summary), confirmed: false });
  // Generate once from the current session snapshot; later edits go straight into the editable draft.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, workflow.brief, workflow.markdown, router]);
  if (!hydrated || !workflow.brief) return <Shell><div className="mx-auto max-w-[760px] py-20 text-sm text-[var(--color-muted-foreground)]">正在载入方案…</div></Shell>;
  const copy = async () => {
    try { await navigator.clipboard.writeText(workflow.markdown); setFeedback("已复制到剪贴板"); }
    catch { setFeedback("复制失败：请允许剪贴板权限，或直接从编辑框中选择内容。"); }
  };
  const download = () => {
    try {
      const blob = new Blob(["\uFEFF", workflow.markdown], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
      anchor.href = url; anchor.download = "小工序-讨论稿.md"; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setFeedback("Markdown 文件已下载");
    } catch { setFeedback("下载失败，请重试或复制文档内容。"); }
  };
  const confirm = () => { setWorkflow({ ...workflow, confirmed: !workflow.confirmed }); setFeedback(workflow.confirmed ? "已恢复为草稿" : "方案已确认"); };
  const clearSession = () => {
    sessionStorage.removeItem("xiaogongxu-workflow-v1");
    setWorkflow(emptyWorkflow);
    router.push("/");
  };
  return <Shell back><section className="mx-auto max-w-[960px] pt-8">
    <StepLabel step="03" title="预览、修改并导出"/>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-medium tracking-[-.04em]">你的 MVP 讨论稿</h1><p className="mt-2 max-w-[620px] text-sm leading-6 text-[var(--color-muted-foreground)]">这是由固定模板和你填写的内容整理出的初稿，不是 AI 分析结果。未提供的信息会标记为待补充；请核对后再使用。</p></div>{workflow.markdown&&<span className={`inline-flex min-h-8 items-center gap-2 border px-3 text-xs ${workflow.confirmed?"border-[var(--color-accent-teal)]/40 bg-white":"border-[var(--color-border)] bg-[var(--color-surface)]"}`}><span className={`size-1.5 rounded-full ${workflow.confirmed?"bg-[var(--color-accent-teal)]":"bg-[var(--color-accent-amber)]"}`}/>{workflow.confirmed?"已确认":"草稿"}</span>}</div>
    {!workflow.markdown&&<div data-testid="generation-loading" role="status" className="border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-sm">正在本地整理草稿…</div>}
    {workflow.markdown&&<><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-[var(--color-muted-foreground)]">Markdown 文档 · {workflow.markdown.length.toLocaleString()} 字</span><div className="flex flex-wrap gap-2"><button onClick={confirm} className="inline-flex min-h-10 items-center gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs">{workflow.confirmed?<CheckCheck size={15}/>:<Check size={15}/>} {workflow.confirmed?"撤销确认":"确认方案"}</button><button onClick={()=>void copy()} className="inline-flex min-h-10 items-center gap-2 border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-xs"><Clipboard size={14}/>复制</button><button onClick={download} className="inline-flex min-h-10 items-center gap-2 bg-[var(--color-primary)] px-3 text-xs text-white"><Download size={14}/>下载 .md</button></div></div><article data-testid="prd-preview" className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:p-6"><label htmlFor="prd-markdown" className="mb-3 block text-xs font-semibold">编辑方案内容</label><textarea id="prd-markdown" value={workflow.markdown} onChange={e=>{setWorkflow({...workflow,markdown:e.target.value,confirmed:false});setFeedback("");}} rows={28} maxLength={30000} className="min-h-[640px] w-full resize-y border border-[var(--color-border)] bg-white p-4 font-mono text-[13px] leading-6"/><div className="mt-2 flex flex-wrap justify-between gap-2 text-[11px] text-[var(--color-muted-foreground)]"><span>修改会自动保存在当前标签页；导出内容与此处一致。</span><span>{workflow.markdown.length}/30000</span></div><details className="mt-5 border-t border-[var(--color-border)] pt-4"><summary className="cursor-pointer text-xs font-semibold">查看当前文档预览</summary><pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words border border-[var(--color-border)] bg-white p-4 font-mono text-xs leading-6">{workflow.markdown}</pre></details></article>{feedback&&<p role="status" className="mt-3 flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]"><Check size={15} className="text-[var(--color-accent-teal)]"/>{feedback}</p>}</>}
    <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><Link href="/clarify" className="inline-flex min-h-10 items-center gap-2 text-sm text-[var(--color-muted-foreground)]"><ArrowLeft size={15}/>返回需求梳理</Link><button onClick={clearSession} className="inline-flex min-h-10 items-center gap-2 text-xs text-[var(--color-muted-foreground)]"><RotateCcw size={14}/>清除本次会话</button></div>
  </section></Shell>;
}
