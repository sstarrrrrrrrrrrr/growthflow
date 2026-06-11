export type EntityId = string;
export type ISODateString = string;
export type CompletionStatus = "not_started" | "in_progress" | "completed";
export type TaskCategory = "study" | "project" | "algorithm" | "english";

export interface KeyResult {
  id: EntityId;
  title: string;
  status: CompletionStatus;
  progress: number;
}

export interface Objective {
  id: EntityId;
  title: string;
  progress: number;
  keyResults: KeyResult[];
}

export interface LearningRecord {
  id: EntityId;
  studyDate: ISODateString;
  content: string;
  problems: string;
  solutions: string;
  achievements: string;
  nextPlan: string;
  category: TaskCategory;
  tags: string[];
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyTask {
  id: EntityId;
  title: string;
  date: ISODateString;
  time: string;
  category: TaskCategory;
  completed: boolean;
}

export interface HeatmapDay {
  date: ISODateString;
  minutes: number;
}

export interface DashboardData {
  metrics: {
    weeklyProgress: number;
    completedKeyResults: number;
    totalKeyResults: number;
    learningRecordCount: number;
    weeklyRecordCount: number;
  };
  objectives: Objective[];
  tasks: DailyTask[];
  records: LearningRecord[];
  heatmap: HeatmapDay[];
  streakDays: number;
  generatedContentCount: number;
}
