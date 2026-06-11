import type { TaskCategory } from "@/types/domain";

export interface LearningCategoryOption {
  value: TaskCategory;
  label: string;
  color: string;
}

export const LEARNING_CATEGORY_OPTIONS: LearningCategoryOption[] = [
  { value: "study", label: "学习", color: "var(--color-primary)" },
  { value: "project", label: "项目", color: "#1677ff" },
  { value: "algorithm", label: "算法", color: "#d99400" },
  { value: "english", label: "英语", color: "#ef3f83" },
];

export const getLearningCategory = (category: TaskCategory): LearningCategoryOption =>
  LEARNING_CATEGORY_OPTIONS.find((option) => option.value === category) ??
  LEARNING_CATEGORY_OPTIONS[0];
