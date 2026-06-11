import { lazy, Suspense, useEffect } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { getThemeOption } from "@/constants/themes";
import { useSettingsStore } from "@/store/useSettingsStore";

const DashboardPage = lazy(() =>
  import("@/pages/dashboard/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  })),
);
const LearningRecordsPage = lazy(() =>
  import("@/pages/records/LearningRecordsPage").then((module) => ({
    default: module.LearningRecordsPage,
  })),
);
const OkrGeneratePage = lazy(() =>
  import("@/pages/okr/OkrGeneratePage").then((module) => ({
    default: module.OkrGeneratePage,
  })),
);
const WeeklySummaryPage = lazy(() =>
  import("@/pages/weekly-summary/WeeklySummaryPage").then((module) => ({
    default: module.WeeklySummaryPage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/pages/settings/SettingsPage").then((module) => ({
    default: module.SettingsPage,
  })),
);

export function App() {
  const { themeId, resolvedColorMode, syncSystemMode } = useSettingsStore();
  const selectedTheme = getThemeOption(themeId);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => syncSystemMode(event.matches);
    syncSystemMode(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [syncSystemMode]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          resolvedColorMode === "dark"
            ? antdTheme.darkAlgorithm
            : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: selectedTheme.primary,
          colorBgBase: resolvedColorMode === "dark" ? "#0f172a" : "#ffffff",
          colorTextBase: resolvedColorMode === "dark" ? "#f8fafc" : "#0f172a",
          colorBorder: resolvedColorMode === "dark" ? "#263247" : "#e2e8f0",
          controlHeight: 40,
          borderRadius: 9,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif',
        },
      }}
    >
      <Suspense fallback={<div aria-label="页面加载中" />}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="/records" element={<LearningRecordsPage />} />
            <Route path="/okr" element={<OkrGeneratePage />} />
            <Route path="/weekly-summary" element={<WeeklySummaryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
}
