import type { PropsWithChildren, ReactNode } from "react";
import styles from "./AppCard.module.css";

interface AppCardProps extends PropsWithChildren {
  title?: string;
  action?: ReactNode;
  className?: string;
}

export function AppCard({ title, action, className = "", children }: AppCardProps) {
  return (
    <section className={`${styles.card} ${className}`}>
      {title && (
        <header className={styles.header}>
          <h2>{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
