import { create } from "zustand";
import { storageService } from "@/services/storage";
import type {
  AppearanceSettings,
  ColorMode,
  ResolvedColorMode,
  ThemeId,
} from "@/types/settings";

interface SettingsStore extends AppearanceSettings {
  resolvedColorMode: ResolvedColorMode;
  setTheme: (themeId: ThemeId) => void;
  setColorMode: (colorMode: ColorMode) => void;
  replaceSettings: (settings: AppearanceSettings) => void;
  syncSystemMode: (prefersDark: boolean) => void;
}

const defaultSettings: AppearanceSettings = {
  themeId: "purple-yellow",
  colorMode: "system",
};

const storedSettings = storageService.get<AppearanceSettings>("settings", defaultSettings);
const getSystemMode = (): ResolvedColorMode =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const resolveColorMode = (
  colorMode: ColorMode,
  systemMode = getSystemMode(),
): ResolvedColorMode => (colorMode === "system" ? systemMode : colorMode);

const applyAppearance = (
  settings: AppearanceSettings,
  resolvedColorMode: ResolvedColorMode,
): void => {
  document.documentElement.dataset.theme = settings.themeId;
  document.documentElement.dataset.colorMode = resolvedColorMode;
  document.documentElement.style.colorScheme = resolvedColorMode;
};

const persist = (
  settings: AppearanceSettings,
  resolvedColorMode: ResolvedColorMode,
): void => {
  storageService.set("settings", settings);
  applyAppearance(settings, resolvedColorMode);
};

const initialResolvedMode = resolveColorMode(storedSettings.colorMode);

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...storedSettings,
  resolvedColorMode: initialResolvedMode,

  setTheme: (themeId) =>
    set((state) => {
      const settings = { themeId, colorMode: state.colorMode };
      persist(settings, state.resolvedColorMode);
      return settings;
    }),

  setColorMode: (colorMode) =>
    set((state) => {
      const resolvedColorMode = resolveColorMode(colorMode);
      const settings = { themeId: state.themeId, colorMode };
      persist(settings, resolvedColorMode);
      return { ...settings, resolvedColorMode };
    }),

  replaceSettings: (settings) =>
    set(() => {
      const resolvedColorMode = resolveColorMode(settings.colorMode);
      persist(settings, resolvedColorMode);
      return { ...settings, resolvedColorMode };
    }),

  syncSystemMode: (prefersDark) =>
    set((state) => {
      if (state.colorMode !== "system") return state;
      const resolvedColorMode: ResolvedColorMode = prefersDark ? "dark" : "light";
      applyAppearance(state, resolvedColorMode);
      return { resolvedColorMode };
    }),
}));

applyAppearance(storedSettings, initialResolvedMode);
