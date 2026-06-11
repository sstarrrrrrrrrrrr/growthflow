import { BulbOutlined } from "@ant-design/icons";
import { Input } from "antd";
import styles from "./OkrInputCard.module.css";

interface OkrInputCardProps {
  value: string;
  onChange: (value: string) => void;
}

export function OkrInputCard({ value, onChange }: OkrInputCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.heading}>
        <span><BulbOutlined /></span>
        <div>
          <h2>描述你想完成的目标</h2>
          <p>不需要掌握 OKR 写法，使用自然语言描述即可。</p>
        </div>
      </div>
      <Input.TextArea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoSize={{ minRows: 6, maxRows: 12 }}
        maxLength={1000}
        showCount
        placeholder={"例如：\n下周学习 Python 面向对象\n每天完成一个小练习"}
      />
      <div className={styles.tips}>
        <span>可以输入一行目标</span>
        <span>也可以分行补充具体任务</span>
        <span>系统会自动识别领域与频率</span>
      </div>
    </section>
  );
}
