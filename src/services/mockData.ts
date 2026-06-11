import type { DashboardData, HeatmapDay } from "@/types/domain";

const today = new Date();
const toDate = (offset: number): string => {
  const value = new Date(today);
  value.setDate(today.getDate() + offset);
  return value.toISOString().slice(0, 10);
};

const buildHeatmap = (): HeatmapDay[] =>
  Array.from({ length: 28 }, (_, index) => ({
    date: toDate(index - 27),
    minutes: [0, 35, 65, 110, 20, 0, 50, 80][index % 8],
  }));

export const initialDashboardData: DashboardData = {
  metrics: {
    weeklyProgress: 68,
    completedKeyResults: 14,
    totalKeyResults: 21,
    learningRecordCount: 36,
    weeklyRecordCount: 8,
  },
  streakDays: 12,
  generatedContentCount: 18,
  objectives: [
    {
      id: "o-1",
      title: "提升前端项目开发能力",
      progress: 70,
      keyResults: [
        { id: "kr-1", title: "完成项目的实时通信优化", status: "completed", progress: 100 },
        { id: "kr-2", title: "解决排行榜数据异常问题", status: "completed", progress: 100 },
        { id: "kr-3", title: "优化核心页面交互体验", status: "in_progress", progress: 10 },
      ],
    },
    {
      id: "o-2",
      title: "提升编程基础能力",
      progress: 50,
      keyResults: [
        { id: "kr-4", title: "学习 Python 函数和面向对象", status: "completed", progress: 100 },
        { id: "kr-5", title: "每天完成 1 道算法题", status: "in_progress", progress: 50 },
        { id: "kr-6", title: "学习 React 源码相关知识", status: "not_started", progress: 0 },
      ],
    },
    {
      id: "o-3",
      title: "提升英语能力",
      progress: 30,
      keyResults: [
        { id: "kr-7", title: "准备英语四级写作", status: "in_progress", progress: 30 },
      ],
    },
  ],
  tasks: [
    { id: "t-1", title: "学习 React useEffect 源码", date: toDate(0), time: "09:00", category: "study", completed: true },
    { id: "t-2", title: "解决房间断线重连问题", date: toDate(0), time: "11:00", category: "project", completed: true },
    { id: "t-3", title: "学习 Python 面向对象", date: toDate(0), time: "14:00", category: "study", completed: false },
    { id: "t-4", title: "刷算法题（动态规划）", date: toDate(0), time: "16:00", category: "algorithm", completed: false },
    { id: "t-5", title: "英语四级作文练习", date: toDate(0), time: "19:00", category: "english", completed: false },
  ],
  records: [
    {
      id: "r-1",
      studyDate: toDate(0),
      content: "学习了 React useEffect 的执行机制，解决了闭包问题",
      problems: "依赖数组变化时存在重复执行",
      solutions: "拆分副作用并使用回调更新状态",
      achievements: "理解了 effect 清理时机",
      nextPlan: "阅读相关源码",
      category: "study",
      tags: ["React", "源码"],
      durationMinutes: 90,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "r-2",
      studyDate: toDate(-1),
      content: "修复了排行榜在匿名用户情况下的数据重复问题",
      problems: "合并逻辑缺少稳定标识",
      solutions: "统一使用用户 ID 去重",
      achievements: "完成线上问题定位",
      nextPlan: "补充边界测试",
      category: "project",
      tags: ["项目", "问题修复"],
      durationMinutes: 70,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "r-3",
      studyDate: toDate(-2),
      content: "学习了 Python 类和对象的基本用法",
      problems: "不熟悉特殊方法",
      solutions: "编写示例并整理笔记",
      achievements: "掌握 __init__ 的基本使用",
      nextPlan: "练习继承与组合",
      category: "study",
      tags: ["Python", "面向对象"],
      durationMinutes: 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "r-4",
      studyDate: toDate(-3),
      content: "完成一道动态规划题：LeetCode 198 打家劫舍",
      problems: "状态转移方程不清晰",
      solutions: "从选择与不选择两个状态拆解",
      achievements: "独立完成空间优化",
      nextPlan: "继续练习同类题目",
      category: "algorithm",
      tags: ["LeetCode", "动态规划"],
      durationMinutes: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  heatmap: buildHeatmap(),
};
