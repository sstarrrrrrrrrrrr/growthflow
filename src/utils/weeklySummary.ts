import type { LearningRecord, TaskCategory } from "@/types/domain";
import type {
  SavedOkr,
  WeeklySummary,
  WeeklySummaryAggregate,
} from "@/types/generation";

export const filterRecordsByPeriod = (
  records: LearningRecord[],
  start: string,
  end: string,
): LearningRecord[] =>
  records.filter((record) => record.studyDate >= start && record.studyDate <= end);

export const buildWeeklySummaryAggregate = (
  records: LearningRecord[],
  okrs: SavedOkr[],
): WeeklySummaryAggregate => {
  const categoryDistribution = records.reduce<Partial<Record<TaskCategory, number>>>(
    (result, record) => {
      result[record.category] = (result[record.category] ?? 0) + 1;
      return result;
    },
    {},
  );
  const keyResults = okrs.flatMap((okr) => okr.keyResults);

  return {
    recordCount: records.length,
    totalMinutes: records.reduce((total, record) => total + record.durationMinutes, 0),
    categoryDistribution,
    completedContents: records.map((record) => record.content).filter(Boolean),
    problems: records.map((record) => record.problems).filter(Boolean),
    solutions: records.map((record) => record.solutions).filter(Boolean),
    achievements: records.map((record) => record.achievements).filter(Boolean),
    nextPlans: records.map((record) => record.nextPlan).filter(Boolean),
    objectiveCount: okrs.length,
    completedKeyResults: keyResults.filter((keyResult) => keyResult.status === "completed").length,
    incompleteKeyResults: keyResults.filter((keyResult) => keyResult.status !== "completed").length,
    objectiveProgress: okrs.map((okr) => ({
      title: okr.title,
      progress: okr.progress,
      completedKeyResults: okr.keyResults.filter(
        (keyResult) => keyResult.status === "completed",
      ).length,
      totalKeyResults: okr.keyResults.length,
    })),
  };
};

export const buildSummaryMarkdown = (summary: WeeklySummary): string =>
  [
    `# ${summary.title}`,
    "",
    `> 周期：${summary.weekStart} 至 ${summary.weekEnd}`,
    "",
    ...summary.sections.flatMap((section) => [
      `## ${section.title}`,
      "",
      section.content,
      "",
    ]),
  ].join("\n").trim();
