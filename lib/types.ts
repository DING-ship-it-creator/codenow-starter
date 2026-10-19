export type WorkBrief = {
  description: string;
  currentProcess?: string;
  frequency?: string;
  people?: string;
  desiredOutcome?: string;
};

export type ClarificationTopic = "users" | "trigger" | "inputs" | "outcome" | "exceptions";
export type Clarification = { topic: ClarificationTopic; question: string; answer?: string; skipped?: boolean };
export type WorkflowDraft = {
  brief: WorkBrief | null;
  clarifications: Clarification[];
  summary: string;
  nextQuestion: string;
  nextTopic: ClarificationTopic | null;
  ready: boolean;
  markdown: string;
  confirmed: boolean;
};

export const emptyWorkflow: WorkflowDraft = {
  brief: null, clarifications: [], summary: "", nextQuestion: "", nextTopic: null, ready: false,
  markdown: "", confirmed: false,
};
