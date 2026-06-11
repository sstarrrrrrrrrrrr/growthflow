import {
  AimOutlined,
  CalendarOutlined,
  FileTextOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { LearningHeatmapCard } from "@/components/dashboard/LearningHeatmapCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecentRecordsCard } from "@/components/dashboard/RecentRecordsCard";
import { TodayPlanCard } from "@/components/dashboard/TodayPlanCard";
import { WeeklyOkrCard } from "@/components/dashboard/WeeklyOkrCard";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useLearningRecordStore } from "@/store/useLearningRecordStore";
import { useOkrStore } from "@/store/useOkrStore";
import { useWeeklySummaryStore } from "@/store/useWeeklySummaryStore";
import {
  buildLearningHeatmap,
  getLearningStreak,
  getWeeklyRecordCount,
} from "@/utils/learningRecords";
import styles from "./DashboardPage.module.css";

export function DashboardPage() {
  const {
    tasks,
    toggleTask,
  } = useDashboardStore();
  const records = useLearningRecordStore((state) => state.records);
  const objectives = useOkrStore((state) => state.savedOkrs);
  const weeklySummaries = useWeeklySummaryStore((state) => state.summaries);
  const streakDays = getLearningStreak(records);
  const heatmap = buildLearningHeatmap(records);
  const weeklyRecordCount = getWeeklyRecordCount(records);
  const keyResults = objectives.flatMap((objective) => objective.keyResults);
  const completedKeyResults = keyResults.filter(
    (keyResult) => keyResult.status === "completed",
  ).length;
  const objectiveProgress = objectives.length
    ? Math.round(
        objectives.reduce((total, objective) => total + objective.progress, 0) /
          objectives.length,
      )
    : 0;
  return (
    <div className={styles.page}>
      <section className={styles.metrics}>
        <MetricCard
          icon={<AimOutlined />}
          tone="primary"
          label="本周目标进度"
          value={objectiveProgress}
          unit="%"
          description={`${completedKeyResults} / ${keyResults.length} KR 已完成`}
          progress={objectiveProgress}
        />
        <MetricCard
          icon={<CalendarOutlined />}
          tone="green"
          label="连续学习天数"
          value={streakDays}
          unit="天"
          description={<>🔥 超越了 92% 的用户</>}
        />
        <MetricCard
          icon={<FileTextOutlined />}
          tone="blue"
          label="学习记录"
          value={records.length}
          unit="条"
          description={`本周新增 ${weeklyRecordCount} 条`}
        />
        <MetricCard
          icon={<GiftOutlined />}
          tone="yellow"
          label="完成内容"
          value={objectives.length + weeklySummaries.length}
          unit="篇"
          description="OKR / 周总结"
        />
      </section>

      <section className={styles.dashboardGrid}>
        <div className={styles.primaryColumn}>
          <WeeklyOkrCard objectives={objectives} />
          <LearningHeatmapCard heatmap={heatmap} />
        </div>
        <div className={styles.secondaryColumn}>
          <TodayPlanCard tasks={tasks} onToggle={toggleTask} />
          <RecentRecordsCard records={records} />
        </div>
      </section>
    </div>
  );
}
