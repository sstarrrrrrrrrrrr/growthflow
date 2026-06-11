import { CalendarOutlined, ClockCircleOutlined, FileTextOutlined } from "@ant-design/icons";
import { DatePicker, Segmented } from "antd";
import type { Dayjs } from "dayjs";
import { LEARNING_CATEGORY_OPTIONS } from "@/constants/learningRecords";
import type {
  WeeklySummaryAggregate,
  WeeklySummaryTemplate,
} from "@/types/generation";
import styles from "./SummarySourcePanel.module.css";

export type PeriodPreset = "current" | "previous" | "custom";

interface SummarySourcePanelProps {
  preset: PeriodPreset;
  range: [Dayjs, Dayjs];
  template: WeeklySummaryTemplate;
  aggregate: WeeklySummaryAggregate;
  onPresetChange: (preset: PeriodPreset) => void;
  onRangeChange: (range: [Dayjs, Dayjs]) => void;
  onTemplateChange: (template: WeeklySummaryTemplate) => void;
}

const templateOptions = [
  { label: "标准周报", value: "standard" },
  { label: "OKR 复盘", value: "okr_review" },
  { label: "学习总结", value: "learning" },
];

export function SummarySourcePanel({
  preset,
  range,
  template,
  aggregate,
  onPresetChange,
  onRangeChange,
  onTemplateChange,
}: SummarySourcePanelProps) {
  return (
    <div className={styles.stack}>
      <section className={styles.card}>
        <header>
          <CalendarOutlined />
          <div>
            <h2>总结周期</h2>
            <p>选择需要聚合学习记录的日期范围。</p>
          </div>
        </header>
        <Segmented
          block
          value={preset}
          options={[
            { label: "本周", value: "current" },
            { label: "上周", value: "previous" },
            { label: "自定义", value: "custom" },
          ]}
          onChange={(value) => onPresetChange(value as PeriodPreset)}
        />
        <DatePicker.RangePicker
          className={styles.range}
          value={range}
          allowClear={false}
          onChange={(dates) => {
            if (dates?.[0] && dates[1]) onRangeChange([dates[0], dates[1]]);
          }}
        />
      </section>

      <section className={styles.card}>
        <header>
          <FileTextOutlined />
          <div>
            <h2>总结格式</h2>
            <p>不同模板会使用不同的内容组织方式。</p>
          </div>
        </header>
        <Segmented
          vertical
          block
          value={template}
          options={templateOptions}
          onChange={(value) => onTemplateChange(value as WeeklySummaryTemplate)}
        />
      </section>

      <section className={styles.card}>
        <header>
          <ClockCircleOutlined />
          <div>
            <h2>数据来源</h2>
            <p>以下统计由真实学习记录和 OKR 自动聚合。</p>
          </div>
        </header>
        <div className={styles.metrics}>
          <div><strong>{aggregate.recordCount}</strong><span>学习记录</span></div>
          <div><strong>{Math.round(aggregate.totalMinutes / 6) / 10}</strong><span>学习小时</span></div>
          <div><strong>{aggregate.objectiveCount}</strong><span>关联目标</span></div>
          <div><strong>{aggregate.completedKeyResults}</strong><span>完成 KR</span></div>
        </div>
        <div className={styles.categories}>
          {LEARNING_CATEGORY_OPTIONS.map((option) => {
            const count = aggregate.categoryDistribution[option.value] ?? 0;
            return (
              <div key={option.value}>
                <span><i style={{ background: option.color }} />{option.label}</span>
                <b>{count}</b>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
