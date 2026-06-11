import { DownloadOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Empty, Input } from "antd";
import type { WeeklySummary } from "@/types/generation";
import styles from "./SummaryEditorCard.module.css";

interface SummaryEditorCardProps {
  summary: WeeklySummary | null;
  editing: boolean;
  saving: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (sectionId: string, content: string) => void;
  onSave: () => void;
  onExport: (summary: WeeklySummary) => void;
}

export function SummaryEditorCard({
  summary,
  editing,
  saving,
  onTitleChange,
  onContentChange,
  onSave,
  onExport,
}: SummaryEditorCardProps) {
  return (
    <section className={styles.card}>
      <header>
        <div>
          <span>可编辑预览</span>
          <h2>{editing ? "编辑历史总结" : "周总结预览"}</h2>
        </div>
        {summary && (
          <div className={styles.actions}>
            <Button icon={<DownloadOutlined />} onClick={() => onExport(summary)}>
              导出 Markdown
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              disabled={!summary.title.trim()}
              onClick={onSave}
            >
              {editing ? "保存修改" : "保存总结"}
            </Button>
          </div>
        )}
      </header>
      <div className={styles.body}>
        {summary ? (
          <>
            <Input
              className={styles.title}
              value={summary.title}
              maxLength={120}
              onChange={(event) => onTitleChange(event.target.value)}
            />
            <p className={styles.period}>
              周期：{summary.weekStart} 至 {summary.weekEnd}
            </p>
            <div className={styles.sections}>
              {summary.sections.map((section) => (
                <section key={section.id}>
                  <h3>{section.title}</h3>
                  <Input.TextArea
                    value={section.content}
                    autoSize={{ minRows: 4, maxRows: 14 }}
                    onChange={(event) => onContentChange(section.id, event.target.value)}
                  />
                </section>
              ))}
            </div>
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="选择周期和模板后生成周总结"
          />
        )}
      </div>
    </section>
  );
}
