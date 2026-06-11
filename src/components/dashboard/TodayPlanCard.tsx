import { MoreOutlined } from "@ant-design/icons";
import { Checkbox, Empty } from "antd";
import { AppCard } from "@/components/common/AppCard";
import type { DailyTask, TaskCategory } from "@/types/domain";
import styles from "./TodayPlanCard.module.css";

interface TodayPlanCardProps {
  tasks: DailyTask[];
  onToggle: (taskId: string) => void;
}

const categoryLabels: Record<TaskCategory, string> = {
  study: "学习",
  project: "项目",
  algorithm: "算法",
  english: "英语",
};

export function TodayPlanCard({ tasks, onToggle }: TodayPlanCardProps) {
  return (
    <AppCard title="今日计划">
      <div className={styles.tasks}>
        {tasks.length ? tasks.map((task) => (
          <div className={styles.task} key={task.id}>
            <Checkbox checked={task.completed} onChange={() => onToggle(task.id)} />
            <time>{task.time}</time>
            <span className={styles.timelineDot} />
            <span className={`${styles.title} ${task.completed ? styles.done : ""}`}>{task.title}</span>
            <span className={`${styles.category} ${styles[task.category]}`}>
              {categoryLabels[task.category]}
            </span>
            <button type="button" aria-label="更多操作"><MoreOutlined /></button>
          </div>
        )) : (
          <div className={styles.empty}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无今日计划" />
          </div>
        )}
      </div>
    </AppCard>
  );
}
