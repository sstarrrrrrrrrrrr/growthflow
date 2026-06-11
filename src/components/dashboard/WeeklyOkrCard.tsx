import { CheckCircleFilled, EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { Empty } from "antd";
import { useNavigate } from "react-router-dom";
import type { Objective } from "@/types/domain";
import { AppCard } from "@/components/common/AppCard";
import styles from "./WeeklyOkrCard.module.css";

interface WeeklyOkrCardProps {
  objectives: Objective[];
}

const statusLabel = {
  completed: "已完成",
  in_progress: "进行中",
  not_started: "未开始",
};

export function WeeklyOkrCard({ objectives }: WeeklyOkrCardProps) {
  const navigate = useNavigate();
  return (
    <AppCard
      title="本周 OKR"
      action={
        <button className={styles.viewAll} type="button" onClick={() => navigate("/okr")}>
          查看全部 ›
        </button>
      }
    >
      {objectives.length ? (
        <div className={styles.objectives}>
        {objectives.slice(0, 3).map((objective, index) => (
          <article className={styles.objective} key={objective.id}>
            <div className={styles.objectiveHeader}>
              <span className={styles.ring} />
              <b>O{index + 1}</b>
              <strong>{objective.title}</strong>
              <span className={styles.progress}>{objective.progress}%</span>
              <button type="button" aria-label="更多操作"><EllipsisOutlined /></button>
            </div>
            <div className={styles.keyResults}>
              {objective.keyResults.map((keyResult, krIndex) => (
                <div className={styles.keyResult} key={keyResult.id}>
                  {keyResult.status === "completed" ? (
                    <CheckCircleFilled className={styles.completedIcon} />
                  ) : (
                    <span className={`${styles.krRing} ${styles[keyResult.status]}`} />
                  )}
                  <span className={styles.krCode}>KR{krIndex + 1}</span>
                  <span className={styles.krTitle}>{keyResult.title}</span>
                  <span className={`${styles.status} ${styles[keyResult.status]}`}>
                    {statusLabel[keyResult.status]}
                  </span>
                </div>
              ))}
              <button className={styles.addKr} type="button">
                <PlusOutlined /> 添加关键结果
              </button>
            </div>
          </article>
        ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有保存的 OKR">
            <button type="button" onClick={() => navigate("/okr")}>去生成第一个 OKR</button>
          </Empty>
        </div>
      )}
    </AppCard>
  );
}
