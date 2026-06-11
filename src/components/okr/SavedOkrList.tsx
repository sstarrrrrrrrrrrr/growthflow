import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Empty, Modal, Progress } from "antd";
import type { SavedOkr } from "@/types/generation";
import styles from "./SavedOkrList.module.css";

interface SavedOkrListProps {
  okrs: SavedOkr[];
  onEdit: (okr: SavedOkr) => void;
  onDelete: (okrId: string) => Promise<void>;
}

export function SavedOkrList({ okrs, onEdit, onDelete }: SavedOkrListProps) {
  const confirmDelete = (okr: SavedOkr) => {
    Modal.confirm({
      title: "删除这个 OKR？",
      content: "删除后 Dashboard 将同步移除该目标。",
      okText: "删除",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => onDelete(okr.id),
    });
  };

  return (
    <section className={styles.section}>
      <header>
        <div>
          <h2>已保存 OKR</h2>
          <p>保存后的目标会同步显示在 Dashboard。</p>
        </div>
        <span>{okrs.length} 个目标</span>
      </header>
      {okrs.length ? (
        <div className={styles.list}>
          {okrs.map((okr, index) => (
            <article className={styles.item} key={okr.id}>
              <div className={styles.objective}>
                <span>O{index + 1}</span>
                <div>
                  <h3>{okr.title}</h3>
                  <p>{okr.keyResults.length} 个关键结果</p>
                </div>
                <strong>{okr.progress}%</strong>
              </div>
              <Progress
                percent={okr.progress}
                showInfo={false}
                strokeColor="var(--color-primary)"
                trailColor="var(--color-border-subtle)"
              />
              <div className={styles.krList}>
                {okr.keyResults.map((keyResult, krIndex) => (
                  <div key={keyResult.id}>
                    <span>KR{krIndex + 1}</span>
                    <p>{keyResult.title}</p>
                    <b>{keyResult.progress}%</b>
                  </div>
                ))}
              </div>
              <footer>
                <Button icon={<EditOutlined />} onClick={() => onEdit(okr)}>编辑</Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => confirmDelete(okr)}>
                  删除
                </Button>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="还没有保存的 OKR" />
        </div>
      )}
    </section>
  );
}
