import {
  BulbOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  HomeFilled,
  MenuFoldOutlined,
  SettingOutlined,
  ThunderboltFilled,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useLearningRecordStore } from "@/store/useLearningRecordStore";
import { getLearningStreak } from "@/utils/learningRecords";
import styles from "./Sidebar.module.css";

const navigation = [
  { to: "/", label: "首页", icon: <HomeFilled />, end: true },
  { to: "/records", label: "学习记录", icon: <FileTextOutlined /> },
  { to: "/okr", label: "OKR 生成", icon: <BulbOutlined /> },
  { to: "/weekly-summary", label: "周总结生成", icon: <FileDoneOutlined /> },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onToggle, onClose }: SidebarProps) {
  const records = useLearningRecordStore((state) => state.records);
  const streakDays = getLearningStreak(records);

  return (
    <>
    <button
      type="button"
      className={`${styles.backdrop} ${mobileOpen ? styles.backdropVisible : ""}`}
      aria-label="关闭导航菜单"
      onClick={onClose}
    />
    <aside
      className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${
        mobileOpen ? styles.mobileOpen : ""
      }`}
    >
      <div className={styles.brand}>
        <span className={styles.logo}><ThunderboltFilled /></span>
        <strong>GrowthFlow</strong>
        <button type="button" aria-label={collapsed ? "展开侧栏" : "收起侧栏"} onClick={onToggle}>
          <MenuFoldOutlined />
        </button>
      </div>
      <nav className={styles.navigation}>
        <p>成长工作台</p>
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
        <p className={styles.settingsLabel}>设置</p>
        <NavLink
          to="/settings"
          className={({ isActive }) => (isActive ? styles.active : undefined)}
          onClick={onClose}
        >
          <SettingOutlined />
          <span>设置中心</span>
        </NavLink>
      </nav>
      <div className={styles.streakCard}>
        <div><span>✦</span> 连续学习</div>
        <strong>{streakDays}<small>天</small></strong>
        <p>继续加油，保持节奏</p>
      </div>
    </aside>
    </>
  );
}
