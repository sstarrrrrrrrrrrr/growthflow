import { BellOutlined, DownOutlined, MenuOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Input, Popover } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/navigation/Sidebar";
import { ThemePanel } from "@/components/theme/ThemePanel";
import { useLearningRecordStore } from "@/store/useLearningRecordStore";
import { useOkrStore } from "@/store/useOkrStore";
import { useWeeklySummaryStore } from "@/store/useWeeklySummaryStore";
import styles from "./AppLayout.module.css";

dayjs.locale("zh-cn");

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dateText = dayjs().format("YYYY年M月D日 · dddd");
  const initialized = useLearningRecordStore((state) => state.initialized);
  const loadRecords = useLearningRecordStore((state) => state.loadRecords);
  const okrsInitialized = useOkrStore((state) => state.initialized);
  const loadOkrs = useOkrStore((state) => state.loadOkrs);
  const summariesInitialized = useWeeklySummaryStore((state) => state.initialized);
  const loadSummaries = useWeeklySummaryStore((state) => state.loadSummaries);

  useEffect(() => {
    if (!initialized) void loadRecords();
  }, [initialized, loadRecords]);

  useEffect(() => {
    if (!okrsInitialized) void loadOkrs();
  }, [loadOkrs, okrsInitialized]);

  useEffect(() => {
    if (!summariesInitialized) void loadSummaries();
  }, [loadSummaries, summariesInitialized]);

  return (
    <div className={styles.shell}>
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onToggle={() => setSidebarCollapsed((value) => !value)}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className={`${styles.workspace} ${sidebarCollapsed ? styles.workspaceCollapsed : ""}`}>
        <header className={styles.header}>
          <Button
            type="text"
            className={styles.mobileMenuButton}
            icon={<MenuOutlined />}
            aria-label="打开导航菜单"
            onClick={() => setMobileMenuOpen(true)}
          />
          <div className={styles.greeting}>
            <h1>你好，Alex <span aria-hidden="true">👋</span></h1>
            <p>今天是 {dateText}</p>
          </div>
          <div className={styles.headerActions}>
            <Input
              className={styles.search}
              aria-label="全局搜索"
              prefix={<SearchOutlined />}
              placeholder="搜索内容..."
              suffix={<kbd>⌘ K</kbd>}
            />
            <Popover content={<ThemePanel />} placement="bottomRight" trigger="click">
              <Button className={styles.themeButton} aria-label="切换主题">
                <span className={styles.themeDot} />
                主题
              </Button>
            </Popover>
            <Badge count={3} size="small">
              <Button
                type="text"
                className={styles.iconButton}
                icon={<BellOutlined />}
                aria-label="查看通知"
              />
            </Badge>
            <button className={styles.userButton} type="button" aria-label="打开用户菜单">
              <Avatar size={34}>A</Avatar>
              <span>Alex</span>
              <DownOutlined />
            </button>
          </div>
        </header>
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
