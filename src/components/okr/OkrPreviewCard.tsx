import { SaveOutlined } from "@ant-design/icons";
import { Button, Empty } from "antd";
import { OkrEditor } from "./OkrEditor";
import type { GeneratedOkr } from "@/types/generation";
import styles from "./OkrPreviewCard.module.css";

interface OkrPreviewCardProps {
  draft: GeneratedOkr | null;
  editing: boolean;
  saving: boolean;
  onChange: (draft: GeneratedOkr) => void;
  onSave: () => void;
}

export function OkrPreviewCard({
  draft,
  editing,
  saving,
  onChange,
  onSave,
}: OkrPreviewCardProps) {
  return (
    <section className={styles.card}>
      <header>
        <div>
          <span>生成结果</span>
          <h2>{editing ? "编辑已保存 OKR" : "OKR 预览"}</h2>
        </div>
        {draft && (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={saving}
            disabled={!draft.title.trim() || !draft.keyResults.length}
            onClick={onSave}
          >
            {editing ? "保存修改" : "保存 OKR"}
          </Button>
        )}
      </header>
      <div className={styles.body}>
        {draft ? (
          <>
            <p className={styles.source}>根据输入：{draft.sourceInput.replace(/\n/g, " / ")}</p>
            <OkrEditor value={draft} onChange={onChange} />
          </>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="输入目标并点击生成，这里会出现可编辑的 OKR"
          />
        )}
      </div>
    </section>
  );
}
