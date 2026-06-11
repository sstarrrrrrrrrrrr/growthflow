import { message } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
  type PeriodPreset,
  SummarySourcePanel,
} from "@/components/weekly-summary/SummarySourcePanel";
import { ErrorBanner } from "@/components/common/ErrorBanner";
import { SummaryActionBar } from "@/components/weekly-summary/SummaryActionBar";
import { SummaryEditorCard } from "@/components/weekly-summary/SummaryEditorCard";
import { SummaryHistoryList } from "@/components/weekly-summary/SummaryHistoryList";
import { markdownExportService } from "@/services/markdown-export.service";
import { useLearningRecordStore } from "@/store/useLearningRecordStore";
import { useOkrStore } from "@/store/useOkrStore";
import { useWeeklySummaryStore } from "@/store/useWeeklySummaryStore";
import { buildWeeklySummaryAggregate, filterRecordsByPeriod } from "@/utils/weeklySummary";
import styles from "./WeeklySummaryPage.module.css";

const getMonday = (date: Dayjs): Dayjs => {
  const weekday = date.day();
  return date.startOf("day").subtract(weekday === 0 ? 6 : weekday - 1, "day");
};

const getPresetRange = (preset: Exclude<PeriodPreset, "custom">): [Dayjs, Dayjs] => {
  const currentMonday = getMonday(dayjs());
  const start = preset === "previous" ? currentMonday.subtract(7, "day") : currentMonday;
  return [start, start.add(6, "day")];
};

export function WeeklySummaryPage() {
  const records = useLearningRecordStore((state) => state.records);
  const okrs = useOkrStore((state) => state.savedOkrs);
  const {
    draft,
    summaries,
    template,
    tone,
    editingId,
    generating,
    saving,
    initialized,
    error,
    loadSummaries,
    setTemplate,
    generate,
    regenerate,
    adjustTone,
    updateTitle,
    updateContent,
    editSaved,
    saveDraft,
    removeSummary,
  } = useWeeklySummaryStore();
  const [preset, setPreset] = useState<PeriodPreset>("current");
  const [range, setRange] = useState<[Dayjs, Dayjs]>(() => getPresetRange("current"));

  useEffect(() => {
    if (!initialized) void loadSummaries();
  }, [initialized, loadSummaries]);

  const periodRecords = useMemo(
    () =>
      filterRecordsByPeriod(
        records,
        range[0].format("YYYY-MM-DD"),
        range[1].format("YYYY-MM-DD"),
      ),
    [range, records],
  );
  const aggregate = useMemo(
    () => buildWeeklySummaryAggregate(periodRecords, okrs),
    [okrs, periodRecords],
  );

  const handlePresetChange = (value: PeriodPreset) => {
    setPreset(value);
    if (value !== "custom") setRange(getPresetRange(value));
  };

  const handleGenerate = () =>
    generate({
      weekStart: range[0].format("YYYY-MM-DD"),
      weekEnd: range[1].format("YYYY-MM-DD"),
      template,
      tone,
      records,
      okrs,
    });

  const handleSave = async () => {
    const wasEditing = Boolean(editingId);
    await saveDraft();
    message.success(wasEditing ? "历史总结已更新" : "周总结已保存");
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <span>真实数据聚合</span>
        <h1>周总结生成</h1>
        <p>根据学习记录与 OKR 进展，生成可编辑、可持续沉淀的规范周总结。</p>
      </header>
      <ErrorBanner message={error} />

      <div className={styles.workspace}>
        <SummarySourcePanel
          preset={preset}
          range={range}
          template={template}
          aggregate={aggregate}
          onPresetChange={handlePresetChange}
          onRangeChange={(nextRange) => {
            setPreset("custom");
            setRange(nextRange);
          }}
          onTemplateChange={setTemplate}
        />
        <div>
          <SummaryActionBar
            hasDraft={Boolean(draft && !editingId)}
            generating={generating}
            tone={tone}
            canGenerate={Boolean(periodRecords.length || okrs.length)}
            onGenerate={() => void handleGenerate()}
            onRegenerate={() => void regenerate()}
            onToneChange={(nextTone) => void adjustTone(nextTone)}
          />
          <SummaryEditorCard
            summary={draft}
            editing={Boolean(editingId)}
            saving={saving}
            onTitleChange={updateTitle}
            onContentChange={updateContent}
            onSave={() => void handleSave()}
            onExport={markdownExportService.exportWeeklySummary}
          />
        </div>
      </div>

      <SummaryHistoryList
        summaries={summaries}
        onEdit={(summary) => {
          editSaved(summary);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={removeSummary}
        onExport={markdownExportService.exportWeeklySummary}
      />
    </div>
  );
}
