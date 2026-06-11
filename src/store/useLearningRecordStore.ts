import { create } from "zustand";
import { learningRecordService } from "@/services/learningRecordService";
import type { LearningRecord } from "@/types/domain";

interface LearningRecordStore {
  records: LearningRecord[];
  loading: boolean;
  initialized: boolean;
  error: string | null;
  loadRecords: () => Promise<void>;
  addRecord: (record: LearningRecord) => Promise<void>;
  updateRecord: (record: LearningRecord) => Promise<void>;
  removeRecord: (recordId: string) => Promise<void>;
  replaceRecords: (records: LearningRecord[]) => void;
}

export const useLearningRecordStore = create<LearningRecordStore>((set) => ({
  records: [],
  loading: false,
  initialized: false,
  error: null,
  loadRecords: async () => {
    set({ loading: true, error: null });
    try {
      set({
        records: await learningRecordService.list(),
        loading: false,
        initialized: true,
      });
    } catch {
      set({ loading: false, initialized: true, error: "学习记录加载失败" });
    }
  },
  addRecord: async (record) => {
    const created = await learningRecordService.create(record);
    set((state) => ({
      records: [created, ...state.records].sort((a, b) =>
        b.studyDate.localeCompare(a.studyDate),
      ),
    }));
  },
  updateRecord: async (record) => {
    const updated = await learningRecordService.update(record);
    set((state) => ({
      records: state.records
        .map((item) => (item.id === updated.id ? updated : item))
        .sort((a, b) => b.studyDate.localeCompare(a.studyDate)),
    }));
  },
  removeRecord: async (recordId) => {
    await learningRecordService.remove(recordId);
    set((state) => ({ records: state.records.filter((record) => record.id !== recordId) }));
  },
  replaceRecords: (records) =>
    set({ records, loading: false, initialized: true, error: null }),
}));
