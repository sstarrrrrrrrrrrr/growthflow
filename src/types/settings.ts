export type ThemeId =
  | "purple-yellow"
  | "blue-lime"
  | "pink-green"
  | "violet-cyan"
  | "coral-cyan"
  | "red-green";

export type ColorMode = "light" | "dark" | "system";
export type ResolvedColorMode = "light" | "dark";

export interface AppearanceSettings {
  themeId: ThemeId;
  colorMode: ColorMode;
}
