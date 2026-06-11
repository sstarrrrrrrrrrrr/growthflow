import { InfoCircleOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { AppCard } from "@/components/common/AppCard";
import type { HeatmapDay } from "@/types/domain";
import styles from "./LearningHeatmapCard.module.css";

interface LearningHeatmapCardProps {
  heatmap: HeatmapDay[];
}

const getLevel = (minutes: number): number => {
  if (minutes === 0) return 0;
  if (minutes < 45) return 1;
  if (minutes < 90) return 2;
  if (minutes < 120) return 3;
  return 4;
};

export function LearningHeatmapCard({ heatmap }: LearningHeatmapCardProps) {
  const totalHours = heatmap.reduce((total, day) => total + day.minutes, 0) / 60;

  return (
    <AppCard
      title="学习日历"
      action={
        <div className={styles.month}>
          {dayjs().format("YYYY年M月")}
          <button type="button" aria-label="查看上个月"><LeftOutlined /></button>
          <button type="button" aria-label="查看下个月"><RightOutlined /></button>
        </div>
      }
    >
      <div className={styles.content}>
        <div className={styles.heatmap}>
          <div className={styles.weekdays}>
            {["一", "二", "三", "四", "五", "六", "日"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className={styles.grid}>
            {heatmap.map((day) => (
              <span
                key={day.date}
                className={styles[`level${getLevel(day.minutes)}`]}
                title={`${day.date}: ${day.minutes} 分钟`}
              />
            ))}
          </div>
          <div className={styles.legend}>
            <span className={styles.level0} /> 0
            <span className={styles.level1} /> 1-2
            <span className={styles.level2} /> 3-4
            <span className={styles.level4} /> 5+
          </div>
        </div>
        <div className={styles.duration}>
          <span>本月学习时长</span>
          <strong>{totalHours.toFixed(1)}<small>小时</small></strong>
          <p>较上月 <b>↑ 32%</b></p>
        </div>
      </div>
      <InfoCircleOutlined className={styles.info} />
    </AppCard>
  );
}
