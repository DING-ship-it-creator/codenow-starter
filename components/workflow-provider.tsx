"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { emptyWorkflow, type WorkflowDraft } from "@/lib/types";

const WorkflowContext = createContext<{
  workflow: WorkflowDraft;
  setWorkflow: (value: WorkflowDraft | ((current: WorkflowDraft) => WorkflowDraft)) => void;
  hydrated: boolean;
}>({ workflow: emptyWorkflow, setWorkflow: () => undefined, hydrated: false });

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflow, setWorkflow] = useState(emptyWorkflow);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("xiaogongxu-workflow-v1");
      // Restore only after mount to keep the server-rendered HTML identical to the first client render.
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WorkflowDraft>;
        const validTopics = new Set(["users", "trigger", "inputs", "outcome", "exceptions"]);
        const clarifications = Array.isArray(parsed.clarifications)
          ? parsed.clarifications.filter((item) => item && validTopics.has(item.topic))
          : [];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWorkflow({ ...emptyWorkflow, ...parsed, clarifications });
      }
    } catch (error) {
      console.warn("[workflow/storage] restore failed", { reason: error instanceof Error ? error.message : "unknown" });
    } finally { setHydrated(true); }
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { sessionStorage.setItem("xiaogongxu-workflow-v1", JSON.stringify(workflow)); }
    catch (error) { console.warn("[workflow/storage] save failed", { reason: error instanceof Error ? error.message : "unknown" }); }
  }, [workflow, hydrated]);
  return <WorkflowContext.Provider value={{ workflow, setWorkflow, hydrated }}>{children}</WorkflowContext.Provider>;
}

export const useWorkflow = () => useContext(WorkflowContext);
