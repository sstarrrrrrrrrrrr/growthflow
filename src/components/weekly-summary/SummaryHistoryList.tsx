import { DeleteOutlined, DownloadOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Empty, Modal } from "antd";
import type { WeeklySummary } from "@/types/generation";
import styles from "./SummaryHistoryList.module.css";

interface SummaryHistoryListProps {
  summaries: WeeklySummary[];
  onEdit: (summary: WeeklySummary) => void;
  onDelete: (summaryId: string) => Promise<void>;
  onExport: (summary: WeeklySummary) => void;
}

const templateLabels = {
  standard: "标准周报",
  okr_review: "OKR 复盘",
  learning: "学习总结",
};

export function SummaryHistoryList({
  summaries,
  onEdit,
  onDelete,
  onExport,
}: SummaryHistoryListProps) {
  const viewSummary = (summary: WeeklySummary) => {
    Modal.info({
      title: summary.title,
      width: 720,
      okText: "关闭",
      content: (
        <div className={styles.modalContent}>
          <p>{summary.weekStart} 至 {summary.weekEnd}</p>
          {summary.sections.map((section) => (
            <section key={section.id}>
              <h4>{section.title}</h4>
              <div>{section.content}</div>
            </section>
          ))}
        </div>
      ),
    });
  };

  const confirmDelete = (summary: WeeklySummary) => {
    Modal.confirm({
      title: "删除这份周总结？",
      content: "删除后无法恢复，Dashboard 的生成内容数会同步更新。",
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => onDelete(summary.id),
    });
  };

  return (
    <section className={styles.section}>
      <header>
        <div>
          <h2>历史总结</h2>
          <p>查看、继续编辑或导出已经保存的周总结。</p>
        </div>
        <span>{summaries.length} 份总结</span>
      </header>
      {summaries.length ? (
        <div className={styles.list}>
          {summaries.map((summary) => (
            <article key={summary.id}>
              <div className={styles.meta}>
                <span>{templateLabels[summary.template]}</span>
                <time>{summary.weekStart} 至 {summary.weekEnd}</time>
              </div>
              <h3>{summary.title}</h3>
              <p>
                {summary.aggregate.recordCount} 条学习记录 ·
                {" "}{summary.aggregate.completedKeyResults} 个已完成 KR
              </p>
              <footer>
                <Button icon={<EyeOutlined />} onClick={() => viewSummary(summary)}>查看</Button>
                <Button icon={<EditOutlined />} onClick={() => onEdit(summary)}>编辑</Button>
                <Button icon={<DownloadOutlined />} onClick={() => onExport(summary)}>导出</Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(summary)}>
                  删除
                </Button>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有保存的周总结" />
        </div>
      )}
    </section>
  );
}
