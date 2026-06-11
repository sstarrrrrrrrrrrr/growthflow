import type { ReactNode } from "react";
import { Progress } from "antd";
import styles from "./MetricCard.module.css";

interface MetricCardProps {
  icon: ReactNode;
  tone: "primary" | "green" | "blue" | "yellow";
  label: string;
  value: number;
  unit: string;
  description: ReactNode;
  progress?: number;
}

export function MetricCard({
  icon,
  tone,
  label,
  value,
  unit,
  description,
  progress,
}: MetricCardProps) {
  return (
    <article className={styles.card}>
      <div className={`${styles.icon} ${styles[tone]}`}>{icon}</div>
      <div className={styles.body}>
        <p>{label}</p>
        <div className={styles.value}>{value}<span>{unit}</span></div>
        <small>{description}</small>
        {typeof progress === "number" && (
          <Progress
            percent={progress}
            showInfo={false}
            size="small"
            strokeColor="var(--color-primary)"
            trailColor="var(--color-border)"
          />
        )}
      </div>
    </article>
  );
}
