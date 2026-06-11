import { create } from "zustand";
import type { DashboardData } from "@/types/domain";
import { initialDashboardData } from "@/services/mockData";
import { storageService } from "@/services/storage";

interface DashboardStore extends DashboardData {
  toggleTask: (taskId: string) => void;
  clearDashboard: () => void;
}

const storedData = storageService.get<DashboardData>("dashboard", initialDashboardData);
const hydratedData: DashboardData = {
  ...initialDashboardData,
  ...storedData,
  metrics: {
    ...initialDashboardData.metrics,
    ...storedData.metrics,
  },
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  ...hydratedData,
  toggleTask: (taskId) =>
    set((state) => {
      const nextData: DashboardData = {
        metrics: state.metrics,
        objectives: state.objectives,
        records: state.records,
        heatmap: state.heatmap,
        streakDays: state.streakDays,
        generatedContentCount: state.generatedContentCount,
        tasks: state.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task,
        ),
      };
      storageService.set("dashboard", nextData);
      return nextData;
    }),
  clearDashboard: () =>
    set((state) => {
      const nextData: DashboardData = {
        ...state,
        metrics: {
          ...state.metrics,
          learningRecordCount: 0,
          weeklyRecordCount: 0,
        },
        objectives: [],
        tasks: [],
        records: [],
        heatmap: [],
        streakDays: 0,
        generatedContentCount: 0,
      };
      storageService.set("dashboard", nextData);
      return nextData;
    }),
}));
