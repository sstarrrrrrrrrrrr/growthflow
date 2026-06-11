import dayjs from "dayjs";
import type { HeatmapDay, LearningRecord } from "@/types/domain";

export const sortLearningRecords = (
  records: LearningRecord[],
  direction: "desc" | "asc" = "desc",
): LearningRecord[] =>
  [...records].sort((a, b) =>
    direction === "desc"
      ? b.studyDate.localeCompare(a.studyDate)
      : a.studyDate.localeCompare(b.studyDate),
  );

export const getWeeklyRecordCount = (
  records: LearningRecord[],
  referenceDate = dayjs(),
): number => {
  const weekday = referenceDate.day();
  const weekStart = referenceDate
    .startOf("day")
    .subtract(weekday === 0 ? 6 : weekday - 1, "day");
  const weekEnd = weekStart.add(6, "day");
  return records.filter((record) => {
    const date = dayjs(record.studyDate);
    return !date.isBefore(weekStart, "day") && !date.isAfter(weekEnd, "day");
  }).length;
};

export const getLearningStreak = (
  records: LearningRecord[],
  referenceDate = dayjs(),
): number => {
  const dates = new Set(records.map((record) => record.studyDate));
  let cursor = referenceDate.startOf("day");

  if (!dates.has(cursor.format("YYYY-MM-DD"))) {
    cursor = cursor.subtract(1, "day");
  }

  let streak = 0;
  while (dates.has(cursor.format("YYYY-MM-DD"))) {
    streak += 1;
    cursor = cursor.subtract(1, "day");
  }
  return streak;
};

export const buildLearningHeatmap = (
  records: LearningRecord[],
  days = 28,
  referenceDate = dayjs(),
): HeatmapDay[] => {
  const totals = records.reduce<Record<string, number>>((result, record) => {
    result[record.studyDate] = (result[record.studyDate] ?? 0) + record.durationMinutes;
    return result;
  }, {});

  return Array.from({ length: days }, (_, index) => {
    const date = referenceDate.subtract(days - index - 1, "day").format("YYYY-MM-DD");
    return { date, minutes: totals[date] ?? 0 };
  });
};
