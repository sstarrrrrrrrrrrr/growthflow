import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Dropdown, Tag } from "antd";
import type { MenuProps } from "antd";
import { getLearningCategory } from "@/constants/learningRecords";
import type { LearningRecord } from "@/types/domain";
import styles from "./LearningRecordCard.module.css";

interface LearningRecordCardProps {
  record: LearningRecord;
  onView: (record: LearningRecord) => void;
  onEdit: (record: LearningRecord) => void;
  onDelete: (record: LearningRecord) => void;
}

export function LearningRecordCard({
  record,
  onView,
  onEdit,
  onDelete,
}: LearningRecordCardProps) {
  const category = getLearningCategory(record.category);
  const menuItems: MenuProps["items"] = [
    { key: "view", label: "查看详情", icon: <EyeOutlined /> },
    { key: "edit", label: "编辑记录", icon: <EditOutlined /> },
    { type: "divider" },
    { key: "delete", label: "删除记录", icon: <DeleteOutlined />, danger: true },
  ];

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "view") onView(record);
    if (key === "edit") onEdit(record);
    if (key === "delete") onDelete(record);
  };

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <span className={`${styles.category} ${styles[record.category]}`}>
            {category.label}
          </span>
          <span><ClockCircleOutlined /> {record.durationMinutes} 分钟</span>
        </div>
        <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={["click"]}>
          <button className={styles.more} type="button" aria-label="记录操作">
            <MoreOutlined />
          </button>
        </Dropdown>
      </div>
      <button className={styles.contentButton} type="button" onClick={() => onView(record)}>
        <h3>{record.content}</h3>
        <p>{record.achievements || "暂未填写今日收获"}</p>
      </button>
      <div className={styles.footer}>
        <div className={styles.tags}>
          {record.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
        <button type="button" onClick={() => onView(record)}>查看详情</button>
      </div>
    </article>
  );
}
