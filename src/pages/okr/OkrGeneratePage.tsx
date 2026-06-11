import { message } from "antd";
import { useEffect } from "react";
import { GenerateActionBar } from "@/components/okr/GenerateActionBar";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { OkrInputCard } from "@/components/okr/OkrInputCard";
import { OkrPreviewCard } from "@/components/okr/OkrPreviewCard";
import { SavedOkrList } from "@/components/okr/SavedOkrList";
import { useOkrStore } from "@/store/useOkrStore";
import styles from "./OkrGeneratePage.module.css";

export function OkrGeneratePage() {
  const {
    draft,
    savedOkrs,
    sourceInput,
    currentTone,
    editingId,
    generating,
    saving,
    initialized,
    error,
    setSourceInput,
    loadOkrs,
    generate,
    regenerate,
    adjustTone,
    updateDraft,
    editSaved,
    saveDraft,
    removeOkr,
  } = useOkrStore();

  useEffect(() => {
    if (!initialized) void loadOkrs();
  }, [initialized, loadOkrs]);

  const handleSave = async () => {
    await saveDraft();
    message.success(editingId ? "OKR 已更新" : "OKR 已保存");
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <span>本地规则生成</span>
        <h1>OKR 生成中心</h1>
        <p>把自然语言目标整理为清晰、可衡量、可持续跟踪的 Objective 与 Key Results。</p>
      </header>
      <ErrorBanner message={error} />

      <div className={styles.workspace}>
        <div>
          <OkrInputCard value={sourceInput} onChange={setSourceInput} />
          <GenerateActionBar
            hasDraft={Boolean(draft)}
            canGenerate={Boolean(sourceInput.trim())}
            generating={generating}
            currentTone={currentTone}
            onGenerate={() => void generate()}
            onRegenerate={() => void regenerate()}
            onToneChange={(tone) => void adjustTone(tone)}
          />
        </div>
        <OkrPreviewCard
          draft={draft}
          editing={Boolean(editingId)}
          saving={saving}
          onChange={updateDraft}
          onSave={() => void handleSave()}
        />
      </div>

      <SavedOkrList
        okrs={savedOkrs}
        onEdit={(okr) => {
          editSaved(okr);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={removeOkr}
      />
    </div>
  );
}
