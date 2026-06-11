import { ClockCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Drawer, Tag } from "antd";
import dayjs from "dayjs";
import { getLearningCategory } from "@/constants/learningRecords";
import type { LearningRecord } from "@/types/domain";
import styles from "./LearningRecordDetailDrawer.module.css";

interface LearningRecordDetailDrawerProps {
  record: LearningRecord | null;
  open: boolean;
  onClose: () => void;
  onEdit: (record: LearningRecord) => void;
}

const sections: Array<{ key: keyof LearningRecord; label: string }> = [
  { key: "content", label: "学习内容" },
  { key: "problems", label: "遇到的问题" },
  { key: "solutions", label: "解决方案" },
  { key: "achievements", label: "今日收获" },
  { key: "nextPlan", label: "明日计划" },
];

export function LearningRecordDetailDrawer({
  record,
  open,
  onClose,
  onEdit,
}: LearningRecordDetailDrawerProps) {
  if (!record) return null;
  const category = getLearningCategory(record.category);

  return (
    <Drawer
      title="学习记录详情"
      width={520}
      open={open}
      onClose={onClose}
      className={styles.drawer}
      extra={
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(record)}>
          编辑
        </Button>
      }
    >
      <div className={styles.summary}>
        <span className={`${styles.category} ${styles[record.category]}`}>
          {category.label}
        </span>
        <strong>{dayjs(record.studyDate).format("YYYY年M月D日")}</strong>
        <span><ClockCircleOutlined /> {record.durationMinutes} 分钟</span>
      </div>
      <div className={styles.tags}>
        {record.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </div>
      <div className={styles.sections}>
        {sections.map((section) => (
          <section key={section.key}>
            <h3>{section.label}</h3>
            <p>{String(record[section.key] || "暂无记录")}</p>
          </section>
        ))}
      </div>
      <footer className={styles.footer}>
        最后更新于 {dayjs(record.updatedAt).format("YYYY-MM-DD HH:mm")}
      </footer>
    </Drawer>
  );
}
