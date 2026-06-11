import type { LearningRecord } from "./domain";
import type { SavedOkr, WeeklySummary } from "./generation";
import type { AppearanceSettings } from "./settings";

export const BACKUP_VERSION = 1;

export interface GrowthFlowBackup {
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  data: {
    learningRecords: LearningRecord[];
    okrs: SavedOkr[];
    weeklySummaries: WeeklySummary[];
    settings: AppearanceSettings;
  };
}
