import { CheckOutlined, MoonOutlined } from "@ant-design/icons";
import { Segmented } from "antd";
import { THEME_OPTIONS } from "@/constants/themes";
import { useSettingsStore } from "@/store/useSettingsStore";
import styles from "./ThemePanel.module.css";

export function ThemePanel() {
  const { themeId, colorMode, setTheme, setColorMode } = useSettingsStore();

  return (
    <div className={styles.panel}>
      <p>主题色切换</p>
      <div className={styles.options}>
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.id}
            type="button"
            aria-pressed={theme.id === themeId}
            onClick={() => setTheme(theme.id)}
          >
            <span className={styles.swatches}>
              <i style={{ background: theme.primary }} />
              <i style={{ background: theme.accent }} />
            </span>
            <span>{theme.name}</span>
            {theme.id === themeId && <CheckOutlined />}
          </button>
        ))}
      </div>
      <div className={styles.darkMode}>
        <span><MoonOutlined /> 显示模式</span>
        <Segmented
          size="small"
          value={colorMode}
          options={[
            { label: "浅色", value: "light" },
            { label: "深色", value: "dark" },
            { label: "系统", value: "system" },
          ]}
          onChange={(value) => setColorMode(value as "light" | "dark" | "system")}
        />
      </div>
    </div>
  );
}
