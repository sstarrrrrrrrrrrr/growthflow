import {
  AlignLeftOutlined,
  FileTextOutlined,
  MessageOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import type { WeeklySummaryTone } from "@/types/generation";
import styles from "./SummaryActionBar.module.css";

interface SummaryActionBarProps {
  hasDraft: boolean;
  generating: boolean;
  tone: WeeklySummaryTone;
  canGenerate: boolean;
  onGenerate: () => void;
  onRegenerate: () => void;
  onToneChange: (tone: WeeklySummaryTone) => void;
}

const toneActions = [
  { value: "formal", label: "更正式", icon: <FileTextOutlined /> },
  { value: "concise", label: "更简洁", icon: <AlignLeftOutlined /> },
  { value: "detailed", label: "更详细", icon: <UnorderedListOutlined /> },
  { value: "casual", label: "更口语化", icon: <MessageOutlined /> },
] satisfies Array<{ value: WeeklySummaryTone; label: string; icon: React.ReactNode }>;

export function SummaryActionBar({
  hasDraft,
  generating,
  tone,
  canGenerate,
  onGenerate,
  onRegenerate,
  onToneChange,
}: SummaryActionBarProps) {
  return (
    <section className={styles.bar}>
      {hasDraft && (
        <div>
          <Button icon={<ReloadOutlined />} onClick={onRegenerate} loading={generating}>
            重新生成
          </Button>
          {toneActions.map((action) => (
            <Button
              key={action.value}
              icon={action.icon}
              type={tone === action.value ? "primary" : "default"}
              ghost={tone === action.value}
              onClick={() => onToneChange(action.value)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
      <Button
        type="primary"
        size="large"
        disabled={!canGenerate}
        loading={generating}
        onClick={onGenerate}
      >
        生成周总结
      </Button>
    </section>
  );
}
