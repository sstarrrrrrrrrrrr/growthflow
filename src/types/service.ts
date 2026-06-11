import type { LearningRecord } from "./domain";
import type {
  GeneratedOkr,
  GenerateOkrInput,
  GenerateWeeklySummaryInput,
  SavedOkr,
  WeeklySummary,
} from "./generation";

export interface LearningRecordRepository {
  list(): Promise<LearningRecord[]>;
  create(record: LearningRecord): Promise<LearningRecord>;
  update(record: LearningRecord): Promise<LearningRecord>;
  remove(recordId: string): Promise<void>;
}

export interface GenerationService {
  generateOkr(input: GenerateOkrInput): Promise<GeneratedOkr>;
  generateWeeklySummary(input: GenerateWeeklySummaryInput): Promise<WeeklySummary>;
}

export interface WeeklySummaryGenerationService {
  generate(input: GenerateWeeklySummaryInput): Promise<WeeklySummary>;
}

export interface WeeklySummaryRepository {
  list(): Promise<WeeklySummary[]>;
  create(summary: WeeklySummary): Promise<WeeklySummary>;
  update(summary: WeeklySummary): Promise<WeeklySummary>;
  remove(summaryId: string): Promise<void>;
}

export interface OkrGenerationService {
  generate(input: GenerateOkrInput): Promise<GeneratedOkr>;
}

export interface OkrRepository {
  list(): Promise<SavedOkr[]>;
  create(okr: SavedOkr): Promise<SavedOkr>;
  update(okr: SavedOkr): Promise<SavedOkr>;
  remove(okrId: string): Promise<void>;
}
