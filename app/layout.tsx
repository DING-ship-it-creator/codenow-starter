import type { Metadata } from "next";
import { WorkflowProvider } from "@/components/workflow-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "小工序 — 把重复工作讲清楚",
  description: "把日常工作整理成清晰、可落地的 MVP 方案。",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><WorkflowProvider>{children}</WorkflowProvider></body></html>;
}
