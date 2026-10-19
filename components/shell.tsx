import Link from "next/link";
import { ArrowLeft, MoveUpRight, Workflow } from "lucide-react";

export function Shell({ children, back }: { children: React.ReactNode; back?: boolean }) {
  return <div className="min-h-screen px-5 pb-16 md:px-10">
    <header className="mx-auto flex h-[76px] max-w-[1120px] items-center justify-between border-b border-[var(--color-border)]">
      <Link href="/" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight" aria-label="小工序首页">
        <span className="grid size-8 place-items-center border border-[var(--color-border)] bg-[var(--color-surface)]"><Workflow size={17} strokeWidth={1.7}/></span>小工序
      </Link>
      <div className="flex items-center gap-3 text-xs text-[var(--color-muted-foreground)]"><span className="hidden sm:inline">把工作讲清楚，方案就有了</span><span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-teal)]"/>工作区</div>
    </header>
    {back && <div className="mx-auto max-w-[960px] pt-6"><Link href="/" className="inline-flex min-h-10 items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"><ArrowLeft size={16}/>返回首页</Link></div>}
    <main>{children}</main>
    <footer className="mx-auto mt-20 flex max-w-[1120px] items-center justify-between border-t border-[var(--color-border)] py-5 text-xs text-[var(--color-muted-foreground)]"><span>小工序 · 让重复工作变得清楚</span><span className="inline-flex items-center gap-1">一次一件事 <MoveUpRight size={13}/></span></footer>
  </div>;
}

export function StepLabel({ step, title }: { step: string; title: string }) {
  return <div className="mb-5 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[.12em] text-[var(--color-muted-foreground)]"><span className="grid size-6 place-items-center border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)]">{step}</span>{title}</div>;
}
