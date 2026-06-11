import styles from "./PlaceholderPage.module.css";

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className={styles.page}>
      <h1>{title}</h1>
      <p>该模块将在对应开发阶段接入完整业务逻辑。</p>
    </section>
  );
}
