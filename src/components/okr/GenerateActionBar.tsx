import {
  AlignLeftOutlined,
  FileTextOutlined,
  MessageOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import type { OkrTone } from "@/types/generation";
import styles from "./GenerateActionBar.module.css";

interface GenerateActionBarProps {
  hasDraft: boolean;
  canGenerate: boolean;
  generating: boolean;
  currentTone: OkrTone;
  onGenerate: () => void;
  onRegenerate: () => void;
  onToneChange: (tone: OkrTone) => void;
}

const toneActions: Array<{ tone: OkrTone; label: string; icon: React.ReactNode }> = [
  { tone: "formal", label: "更正式", icon: <FileTextOutlined /> },
  { tone: "concise", label: "更简洁", icon: <AlignLeftOutlined /> },
  { tone: "detailed", label: "更细化", icon: <UnorderedListOutlined /> },
  { tone: "casual", label: "更口语化", icon: <MessageOutlined /> },
];

export function GenerateActionBar({
  hasDraft,
  canGenerate,
  generating,
  currentTone,
  onGenerate,
  onRegenerate,
  onToneChange,
}: GenerateActionBarProps) {
  return (
    <section className={styles.bar}>
      <div className={styles.adjustments}>
        {hasDraft && (
          <>
            <Button icon={<ReloadOutlined />} onClick={onRegenerate} loading={generating}>
              重新生成
            </Button>
            {toneActions.map((action) => (
              <Button
                key={action.tone}
                icon={action.icon}
                type={currentTone === action.tone ? "primary" : "default"}
                ghost={currentTone === action.tone}
                onClick={() => onToneChange(action.tone)}
                disabled={generating}
              >
                {action.label}
              </Button>
            ))}
          </>
        )}
      </div>
      <Button
        type="primary"
        size="large"
        disabled={!canGenerate}
        loading={generating}
        onClick={onGenerate}
      >
        {hasDraft ? "按当前输入生成" : "一键生成 OKR"}
      </Button>
    </section>
  );
}
