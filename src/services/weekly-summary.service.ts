import { storageService } from "@/services/storage";
import type { WeeklySummary } from "@/types/generation";
import type { WeeklySummaryRepository } from "@/types/service";

const STORAGE_KEY = "weekly-summaries";

const sortSummaries = (summaries: WeeklySummary[]): WeeklySummary[] =>
  [...summaries].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

const readSummaries = (): WeeklySummary[] =>
  sortSummaries(storageService.get<WeeklySummary[]>(STORAGE_KEY, []));

const writeSummaries = (summaries: WeeklySummary[]): void =>
  storageService.set(STORAGE_KEY, sortSummaries(summaries));

export const weeklySummaryService: WeeklySummaryRepository = {
  async list() {
    return readSummaries();
  },
  async create(summary) {
    writeSummaries([summary, ...readSummaries()]);
    return summary;
  },
  async update(summary) {
    writeSummaries(
      readSummaries().map((item) => (item.id === summary.id ? summary : item)),
    );
    return summary;
  },
  async remove(summaryId) {
    writeSummaries(readSummaries().filter((summary) => summary.id !== summaryId));
  },
};
