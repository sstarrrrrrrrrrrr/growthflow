import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  MoonOutlined,
  SkinOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Segmented } from "antd";
import { useRef, useState } from "react";
import { THEME_OPTIONS } from "@/constants/themes";
import { backupService } from "@/services/backup.service";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useLearningRecordStore } from "@/store/useLearningRecordStore";
import { useOkrStore } from "@/store/useOkrStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useWeeklySummaryStore } from "@/store/useWeeklySummaryStore";
import type { GrowthFlowBackup } from "@/types/backup";
import type { ColorMode } from "@/types/settings";
import styles from "./SettingsPage.module.css";

export function SettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [keepSettings, setKeepSettings] = useState(true);
  const records = useLearningRecordStore((state) => state.records);
  const replaceRecords = useLearningRecordStore((state) => state.replaceRecords);
  const okrs = useOkrStore((state) => state.savedOkrs);
  const replaceOkrs = useOkrStore((state) => state.replaceOkrs);
  const summaries = useWeeklySummaryStore((state) => state.summaries);
  const replaceSummaries = useWeeklySummaryStore((state) => state.replaceSummaries);
  const clearDashboard = useDashboardStore((state) => state.clearDashboard);
  const {
    themeId,
    colorMode,
    resolvedColorMode,
    setTheme,
    setColorMode,
    replaceSettings,
  } = useSettingsStore();

  const applyBackup = (backup: GrowthFlowBackup) => {
    backupService.persistImport(backup);
    replaceRecords(backup.data.learningRecords);
    replaceOkrs(backup.data.okrs);
    replaceSummaries(backup.data.weeklySummaries);
    replaceSettings(backup.data.settings);
  };

  const handleExport = () => {
    backupService.exportData({
      learningRecords: records,
      okrs,
      weeklySummaries: summaries,
      settings: { themeId, colorMode },
    });
    message.success("备份文件已导出");
  };

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;
    try {
      const backup = await backupService.parseFile(file);
      Modal.confirm({
        title: "导入这份 GrowthFlow 备份？",
        content: `备份包含 ${backup.data.learningRecords.length} 条学习记录、${backup.data.okrs.length} 个 OKR 和 ${backup.data.weeklySummaries.length} 份周总结。导入后将覆盖当前数据。`,
        okText: "确认导入",
        cancelText: "取消",
        onOk: () => {
          applyBackup(backup);
          message.success("数据导入成功");
        },
      });
    } catch (error) {
      message.error(error instanceof Error ? error.message : "数据导入失败");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    Modal.confirm({
      title: "清空本地业务数据？",
      content: keepSettings
        ? "学习记录、OKR、周总结和今日计划将被清空，主题设置会保留。"
        : "所有业务数据和主题设置都将恢复默认状态。",
      okText: "确认清空",
      okButtonProps: { danger: true },
      cancelText: "取消",
      onOk: () => {
        backupService.clearBusinessData();
        replaceRecords([]);
        replaceOkrs([]);
        replaceSummaries([]);
        clearDashboard();
        if (!keepSettings) {
          replaceSettings({ themeId: "purple-yellow", colorMode: "system" });
        }
        message.success("本地数据已清空");
      },
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <span>应用偏好与数据管理</span>
        <h1>设置中心</h1>
        <p>管理 GrowthFlow 的外观、备份和本地数据。</p>
      </header>

      <div className={styles.grid}>
        <section className={styles.card}>
          <header><SkinOutlined /><div><h2>主题颜色</h2><p>主题会同步应用到全部页面。</p></div></header>
          <div className={styles.themes}>
            {THEME_OPTIONS.map((theme) => (
              <button
                key={theme.id}
                type="button"
                aria-pressed={theme.id === themeId}
                className={theme.id === themeId ? styles.selectedTheme : ""}
                onClick={() => setTheme(theme.id)}
              >
                <span>
                  <i style={{ background: theme.primary }} />
                  <i style={{ background: theme.accent }} />
                </span>
                <strong>{theme.name}</strong>
                <small>{theme.primary}</small>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <header><MoonOutlined /><div><h2>显示模式</h2><p>支持固定模式或跟随系统。</p></div></header>
          <Segmented
            block
            value={colorMode}
            options={[
              { label: "浅色", value: "light" },
              { label: "深色", value: "dark" },
              { label: "跟随系统", value: "system" },
            ]}
            onChange={(value) => setColorMode(value as ColorMode)}
          />
          <div className={styles.modeStatus}>
            当前实际显示：<strong>{resolvedColorMode === "dark" ? "深色" : "浅色"}</strong>
          </div>
        </section>

        <section className={`${styles.card} ${styles.dataCard}`}>
          <header><CloudDownloadOutlined /><div><h2>数据备份</h2><p>完整导出或恢复本地应用数据。</p></div></header>
          <div className={styles.dataStats}>
            <div><strong>{records.length}</strong><span>学习记录</span></div>
            <div><strong>{okrs.length}</strong><span>OKR</span></div>
            <div><strong>{summaries.length}</strong><span>周总结</span></div>
          </div>
          <div className={styles.dataActions}>
            <Button type="primary" icon={<CloudDownloadOutlined />} onClick={handleExport}>
              导出 JSON 备份
            </Button>
            <Button icon={<CloudUploadOutlined />} onClick={() => fileInputRef.current?.click()}>
              导入备份
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              aria-label="选择 GrowthFlow JSON 备份文件"
              hidden
              onChange={(event) => void handleFileChange(event.target.files?.[0])}
            />
          </div>
        </section>

        <section className={`${styles.card} ${styles.dangerCard}`}>
          <header><DeleteOutlined /><div><h2>清空本地数据</h2><p>此操作不可撤销，请先导出备份。</p></div></header>
          <label className={styles.keepSetting}>
            <input
              type="checkbox"
              checked={keepSettings}
              onChange={(event) => setKeepSettings(event.target.checked)}
            />
            清空时保留主题和显示模式
          </label>
          <Button danger icon={<DeleteOutlined />} onClick={handleClear}>
            清空本地数据
          </Button>
        </section>

        <section className={`${styles.card} ${styles.infoCard}`}>
          <header><InfoCircleOutlined /><div><h2>应用信息</h2><p>GrowthFlow 当前运行信息。</p></div></header>
          <dl>
            <div><dt>应用版本</dt><dd>0.1.0 MVP</dd></div>
            <div><dt>数据版本</dt><dd>1</dd></div>
            <div><dt>存储方式</dt><dd>浏览器 LocalStorage</dd></div>
            <div><dt>生成方式</dt><dd>本地规则引擎</dd></div>
          </dl>
        </section>
      </div>
    </div>
  );
}
