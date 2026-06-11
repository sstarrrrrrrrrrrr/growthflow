import type {
  EntityId,
  ISODateString,
  LearningRecord,
  Objective,
  TaskCategory,
} from "./domain";

export type OkrTone = "standard" | "formal" | "concise" | "detailed" | "casual";

export interface GenerateOkrInput {
  text: string;
  tone: OkrTone;
}

export interface GeneratedOkr extends Objective {
  sourceInput: string;
  tone: OkrTone;
  generatedAt: string;
}

export interface SavedOkr extends GeneratedOkr {
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySummarySection {
  id: EntityId;
  title: string;
  content: string;
}

export type WeeklySummaryTemplate = "standard" | "okr_review" | "learning";
export type WeeklySummaryTone = "standard" | "formal" | "concise" | "detailed" | "casual";

export interface WeeklySummaryAggregate {
  recordCount: number;
  totalMinutes: number;
  categoryDistribution: Partial<Record<TaskCategory, number>>;
  completedContents: string[];
  problems: string[];
  solutions: string[];
  achievements: string[];
  nextPlans: string[];
  objectiveCount: number;
  completedKeyResults: number;
  incompleteKeyResults: number;
  objectiveProgress: Array<{
    title: string;
    progress: number;
    completedKeyResults: number;
    totalKeyResults: number;
  }>;
}

export interface WeeklySummary {
  id: EntityId;
  weekStart: ISODateString;
  weekEnd: ISODateString;
  title: string;
  template: WeeklySummaryTemplate;
  tone: WeeklySummaryTone;
  aggregate: WeeklySummaryAggregate;
  sections: WeeklySummarySection[];
  markdown: string;
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateWeeklySummaryInput {
  weekStart: ISODateString;
  weekEnd: ISODateString;
  template: WeeklySummaryTemplate;
  tone: WeeklySummaryTone;
  records: LearningRecord[];
  okrs: SavedOkr[];
}
