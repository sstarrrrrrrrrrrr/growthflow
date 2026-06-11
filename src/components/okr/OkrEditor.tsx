import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, InputNumber, Select } from "antd";
import type { CompletionStatus } from "@/types/domain";
import type { GeneratedOkr } from "@/types/generation";
import styles from "./OkrEditor.module.css";

interface OkrEditorProps {
  value: GeneratedOkr;
  onChange: (value: GeneratedOkr) => void;
}

const statusOptions: Array<{ value: CompletionStatus; label: string }> = [
  { value: "not_started", label: "未开始" },
  { value: "in_progress", label: "进行中" },
  { value: "completed", label: "已完成" },
];

export function OkrEditor({ value, onChange }: OkrEditorProps) {
  const updateProgress = (progress: number) =>
    onChange({ ...value, progress: Math.min(100, Math.max(0, progress)) });

  return (
    <div className={styles.editor}>
      <div className={styles.objective}>
        <span>O</span>
        <Input
          value={value.title}
          maxLength={120}
          onChange={(event) => onChange({ ...value, title: event.target.value })}
        />
        <InputNumber
          min={0}
          max={100}
          value={value.progress}
          formatter={(number) => `${number ?? 0}%`}
          parser={(text) => Number(text?.replace("%", "") ?? 0)}
          onChange={(number) => updateProgress(number ?? 0)}
        />
      </div>

      <div className={styles.keyResults}>
        {value.keyResults.map((keyResult, index) => (
          <div className={styles.keyResult} key={keyResult.id}>
            <span className={styles.krCode}>KR{index + 1}</span>
            <Input
              value={keyResult.title}
              maxLength={160}
              onChange={(event) =>
                onChange({
                  ...value,
                  keyResults: value.keyResults.map((item) =>
                    item.id === keyResult.id ? { ...item, title: event.target.value } : item,
                  ),
                })
              }
            />
            <Select
              value={keyResult.status}
              options={statusOptions}
              onChange={(status: CompletionStatus) =>
                onChange({
                  ...value,
                  keyResults: value.keyResults.map((item) =>
                    item.id === keyResult.id
                      ? {
                          ...item,
                          status,
                          progress: status === "completed" ? 100 : item.progress,
                        }
                      : item,
                  ),
                })
              }
            />
            <InputNumber
              min={0}
              max={100}
              value={keyResult.progress}
              formatter={(number) => `${number ?? 0}%`}
              parser={(text) => Number(text?.replace("%", "") ?? 0)}
              onChange={(progress) =>
                onChange({
                  ...value,
                  keyResults: value.keyResults.map((item) =>
                    item.id === keyResult.id
                      ? { ...item, progress: progress ?? 0 }
                      : item,
                  ),
                })
              }
            />
            <button
              type="button"
              aria-label={`删除 KR${index + 1}`}
              onClick={() =>
                onChange({
                  ...value,
                  keyResults: value.keyResults.filter((item) => item.id !== keyResult.id),
                })
              }
            >
              <DeleteOutlined />
            </button>
          </div>
        ))}
      </div>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={() =>
          onChange({
            ...value,
            keyResults: [
              ...value.keyResults,
              {
                id: crypto.randomUUID(),
                title: "填写可衡量的关键结果",
                status: "not_started",
                progress: 0,
              },
            ],
          })
        }
      >
        添加关键结果
      </Button>
    </div>
  );
}
