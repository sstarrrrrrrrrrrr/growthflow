import { initialDashboardData } from "./mockData";
import { storageService } from "./storage";
import type { LearningRecord } from "@/types/domain";
import type { LearningRecordRepository } from "@/types/service";

const STORAGE_KEY = "learning-records";

const normalizeRecord = (record: LearningRecord): LearningRecord => ({
  ...record,
  tags: Array.isArray(record.tags) ? record.tags : [],
});

const sortRecords = (records: LearningRecord[]): LearningRecord[] =>
  [...records].sort((a, b) => {
    const dateCompare = b.studyDate.localeCompare(a.studyDate);
    return dateCompare || b.updatedAt.localeCompare(a.updatedAt);
  });

const readRecords = (): LearningRecord[] =>
  sortRecords(
    storageService
      .get<LearningRecord[]>(STORAGE_KEY, initialDashboardData.records)
      .map(normalizeRecord),
  );

const writeRecords = (records: LearningRecord[]): void =>
  storageService.set(STORAGE_KEY, sortRecords(records));

export const learningRecordService: LearningRecordRepository = {
  async list() {
    return readRecords();
  },
  async create(record) {
    const normalized = normalizeRecord(record);
    writeRecords([normalized, ...readRecords()]);
    return normalized;
  },
  async update(record) {
    const normalized = normalizeRecord(record);
    writeRecords(readRecords().map((item) => (item.id === record.id ? normalized : item)));
    return normalized;
  },
  async remove(recordId) {
    writeRecords(readRecords().filter((record) => record.id !== recordId));
  },
};
