import { BACKUP_VERSION, type GrowthFlowBackup } from "@/types/backup";
import type { LearningRecord, TaskCategory } from "@/types/domain";
import type { SavedOkr, WeeklySummary } from "@/types/generation";
import type { AppearanceSettings, ColorMode, ThemeId } from "@/types/settings";
import { storageService } from "./storage";

const themeIds: ThemeId[] = [
  "purple-yellow",
  "blue-lime",
  "pink-green",
  "violet-cyan",
  "coral-cyan",
  "red-green",
];
const colorModes: ColorMode[] = ["light", "dark", "system"];
const categories: TaskCategory[] = ["study", "project", "algorithm", "english"];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isString = (value: unknown): value is string => typeof value === "string";
const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);
const hasStrings = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every(isString);

const isLearningRecord = (value: unknown): value is LearningRecord => {
  if (!isObject(value)) return false;
  return (
    isString(value.id) &&
    isString(value.studyDate) &&
    isString(value.content) &&
    isString(value.problems) &&
    isString(value.solutions) &&
    isString(value.achievements) &&
    isString(value.nextPlan) &&
    categories.includes(value.category as TaskCategory) &&
    hasStrings(value.tags) &&
    isNumber(value.durationMinutes) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
};

const isKeyResult = (value: unknown): boolean => {
  if (!isObject(value)) return false;
  return (
    isString(value.id) &&
    isString(value.title) &&
    ["not_started", "in_progress", "completed"].includes(String(value.status)) &&
    isNumber(value.progress)
  );
};

const isSavedOkr = (value: unknown): value is SavedOkr => {
  if (!isObject(value)) return false;
  return (
    isString(value.id) &&
    isString(value.title) &&
    isNumber(value.progress) &&
    Array.isArray(value.keyResults) &&
    value.keyResults.every(isKeyResult) &&
    isString(value.sourceInput) &&
    ["standard", "formal", "concise", "detailed", "casual"].includes(String(value.tone)) &&
    isString(value.generatedAt) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
};

const isWeeklySummary = (value: unknown): value is WeeklySummary => {
  if (!isObject(value)) return false;
  const aggregate = value.aggregate;
  return (
    isString(value.id) &&
    isString(value.weekStart) &&
    isString(value.weekEnd) &&
    isString(value.title) &&
    ["standard", "okr_review", "learning"].includes(String(value.template)) &&
    ["standard", "formal", "concise", "detailed", "casual"].includes(String(value.tone)) &&
    isObject(aggregate) &&
    isNumber(aggregate.recordCount) &&
    isNumber(aggregate.totalMinutes) &&
    isObject(aggregate.categoryDistribution) &&
    hasStrings(aggregate.completedContents) &&
    hasStrings(aggregate.problems) &&
    hasStrings(aggregate.solutions) &&
    hasStrings(aggregate.achievements) &&
    hasStrings(aggregate.nextPlans) &&
    isNumber(aggregate.objectiveCount) &&
    isNumber(aggregate.completedKeyResults) &&
    isNumber(aggregate.incompleteKeyResults) &&
    Array.isArray(aggregate.objectiveProgress) &&
    aggregate.objectiveProgress.every(
      (item) =>
        isObject(item) &&
        isString(item.title) &&
        isNumber(item.progress) &&
        isNumber(item.completedKeyResults) &&
        isNumber(item.totalKeyResults),
    ) &&
    Array.isArray(value.sections) &&
    value.sections.every(
      (section) =>
        isObject(section) &&
        isString(section.id) &&
        isString(section.title) &&
        isString(section.content),
    ) &&
    isString(value.markdown) &&
    isString(value.generatedAt) &&
    isString(value.createdAt) &&
    isString(value.updatedAt)
  );
};

const isAppearanceSettings = (value: unknown): value is AppearanceSettings => {
  if (!isObject(value)) return false;
  return (
    themeIds.includes(value.themeId as ThemeId) &&
    colorModes.includes(value.colorMode as ColorMode)
  );
};

const validateBackup = (value: unknown): GrowthFlowBackup => {
  if (!isObject(value)) throw new Error("备份文件不是有效的 JSON 对象");
  if (value.version !== BACKUP_VERSION) {
    throw new Error(`不支持的备份版本，当前仅支持 version ${BACKUP_VERSION}`);
  }
  if (!isString(value.exportedAt) || !isObject(value.data)) {
    throw new Error("备份文件缺少导出时间或数据主体");
  }
  const { data } = value;
  if (!Array.isArray(data.learningRecords) || !data.learningRecords.every(isLearningRecord)) {
    throw new Error("学习记录数据格式不正确");
  }
  if (!Array.isArray(data.okrs) || !data.okrs.every(isSavedOkr)) {
    throw new Error("OKR 数据格式不正确");
  }
  if (
    !Array.isArray(data.weeklySummaries) ||
    !data.weeklySummaries.every(isWeeklySummary)
  ) {
    throw new Error("周总结数据格式不正确");
  }
  if (!isAppearanceSettings(data.settings)) {
    throw new Error("主题设置格式不正确");
  }
  return value as unknown as GrowthFlowBackup;
};

const downloadJson = (backup: GrowthFlowBackup): void => {
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `GrowthFlow-backup-${backup.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const backupService = {
  exportData(data: GrowthFlowBackup["data"]): GrowthFlowBackup {
    const backup: GrowthFlowBackup = {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data,
    };
    downloadJson(backup);
    return backup;
  },

  async parseFile(file: File): Promise<GrowthFlowBackup> {
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text()) as unknown;
    } catch {
      throw new Error("文件不是有效的 JSON");
    }
    return validateBackup(parsed);
  },

  persistImport(backup: GrowthFlowBackup): void {
    storageService.set("learning-records", backup.data.learningRecords);
    storageService.set("saved-okrs", backup.data.okrs);
    storageService.set("weekly-summaries", backup.data.weeklySummaries);
    storageService.set("settings", backup.data.settings);
  },

  clearBusinessData(): void {
    storageService.set("learning-records", []);
    storageService.set("saved-okrs", []);
    storageService.set("weekly-summaries", []);
    storageService.remove("dashboard");
  },
};
