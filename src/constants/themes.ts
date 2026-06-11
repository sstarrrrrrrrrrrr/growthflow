import type { ThemeId } from "@/types/settings";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  primary: string;
  accent: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: "purple-yellow", name: "紫金主题", primary: "#7b2cbf", accent: "#fff000" },
  { id: "blue-lime", name: "蓝绿主题", primary: "#0036ff", accent: "#b5f800" },
  { id: "pink-green", name: "粉绿主题", primary: "#ff449e", accent: "#acfe6c" },
  { id: "violet-cyan", name: "赛博主题", primary: "#9d00ff", accent: "#00f0ff" },
  { id: "coral-cyan", name: "青红主题", primary: "#ff527c", accent: "#00ffff" },
  { id: "red-green", name: "绿红主题", primary: "#db0530", accent: "#8aff8a" },
];

export const getThemeOption = (themeId: ThemeId): ThemeOption =>
  THEME_OPTIONS.find((theme) => theme.id === themeId) ?? THEME_OPTIONS[0];
