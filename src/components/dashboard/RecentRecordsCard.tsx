import dayjs from "dayjs";
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { AppCard } from "@/components/common/AppCard";
import type { LearningRecord, TaskCategory } from "@/types/domain";
import styles from "./RecentRecordsCard.module.css";

interface RecentRecordsCardProps {
  records: LearningRecord[];
}

const categoryLabels: Record<TaskCategory, string> = {
  study: "学习",
  project: "项目",
  algorithm: "算法",
  english: "英语",
};

export function RecentRecordsCard({ records }: RecentRecordsCardProps) {
  const navigate = useNavigate();
  return (
    <AppCard
      title="最近学习记录"
      action={<button className={styles.viewAll} type="button">查看全部 ›</button>}
    >
      <div className={styles.records}>
        {records.length ? records.slice(0, 5).map((record) => (
          <div className={styles.record} key={record.id}>
            <span className={`${styles.dot} ${styles[record.category]}`} />
            <time>{dayjs(record.studyDate).format("YYYY-MM-DD")}</time>
            <p>{record.content}</p>
            <span className={`${styles.category} ${styles[record.category]}`}>
              {categoryLabels[record.category]}
            </span>
          </div>
        )) : (
          <div className={styles.empty}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有学习记录">
              <button type="button" onClick={() => navigate("/records")}>去新增学习记录</button>
            </Empty>
          </div>
        )}
      </div>
    </AppCard>
  );
}
