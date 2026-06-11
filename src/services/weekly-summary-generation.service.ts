import { buildWeeklySummaryAggregate, buildSummaryMarkdown } from "@/utils/weeklySummary";
import type {
  WeeklySummary,
  WeeklySummaryAggregate,
  WeeklySummarySection,
  WeeklySummaryTemplate,
  WeeklySummaryTone,
} from "@/types/generation";
import type { WeeklySummaryGenerationService } from "@/types/service";

const unique = (values: string[]): string[] => Array.from(new Set(values));

const formatList = (values: string[], emptyText: string, limit = 5): string => {
  const items = unique(values).slice(0, limit);
  return items.length ? items.map((item) => `- ${item}`).join("\n") : emptyText;
};

const durationText = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} 分钟`;
  return rest ? `${hours} 小时 ${rest} 分钟` : `${hours} 小时`;
};

const buildOkrOverview = (aggregate: WeeklySummaryAggregate): string => {
  if (!aggregate.objectiveProgress.length) return "本周期暂无已保存的 OKR。";
  return aggregate.objectiveProgress
    .map(
      (objective) =>
        `- ${objective.title}：进度 ${objective.progress}%，完成 ${objective.completedKeyResults}/${objective.totalKeyResults} 个 KR`,
    )
    .join("\n");
};

const formalize = (content: string): string =>
  content
    .replace(/本周/g, "本周期")
    .replace(/完成了/g, "已完成")
    .replace(/下周/g, "下一周期");

const casualize = (content: string): string =>
  content
    .replace(/本周期/g, "这段时间")
    .replace(/下一周期/g, "接下来")
    .replace(/暂无/g, "还没有");

const applyTone = (content: string, tone: WeeklySummaryTone): string => {
  if (tone === "formal") return formalize(content);
  if (tone === "casual") return casualize(content);
  if (tone === "concise") {
    return content
      .split("\n")
      .filter(Boolean)
      .slice(0, 4)
      .join("\n");
  }
  if (tone === "detailed") {
    return `${content}\n\n建议：持续保留过程记录，并在下一周期对完成情况进行量化复盘。`;
  }
  return content;
};

const section = (
  title: string,
  content: string,
  tone: WeeklySummaryTone,
): WeeklySummarySection => ({
  id: crypto.randomUUID(),
  title,
  content: applyTone(content, tone),
});

const standardSections = (
  aggregate: WeeklySummaryAggregate,
  tone: WeeklySummaryTone,
): WeeklySummarySection[] => [
  section(
    "本周完成情况",
    `本周共完成 ${aggregate.recordCount} 次学习记录，累计投入 ${durationText(aggregate.totalMinutes)}。主要完成内容如下：\n${formatList(aggregate.completedContents, "本周暂无学习记录。")}\n\nOKR 方面共跟踪 ${aggregate.objectiveCount} 个目标，已完成 ${aggregate.completedKeyResults} 个 KR，另有 ${aggregate.incompleteKeyResults} 个 KR 仍需继续推进。`,
    tone,
  ),
  section(
    "项目进展",
    `${buildOkrOverview(aggregate)}\n\n已采用的解决方式：\n${formatList(aggregate.solutions, "本周暂无明确的解决方案记录。", 4)}`,
    tone,
  ),
  section(
    "学习成果",
    `本周形成的主要收获包括：\n${formatList(aggregate.achievements, "本周暂无成果记录。")}`,
    tone,
  ),
  section(
    "问题与不足",
    `当前需要继续处理的问题包括：\n${formatList(aggregate.problems, "本周未记录明显问题。")}`,
    tone,
  ),
  section(
    "下周计划",
    `下一阶段优先推进：\n${formatList(aggregate.nextPlans, "继续保持稳定学习节奏，并补充可量化的行动计划。")}`,
    tone,
  ),
];

const okrSections = (
  aggregate: WeeklySummaryAggregate,
  tone: WeeklySummaryTone,
): WeeklySummarySection[] => [
  section("目标完成情况", buildOkrOverview(aggregate), tone),
  section(
    "关键结果进展",
    `本周期已完成 ${aggregate.completedKeyResults} 个 KR，未完成 ${aggregate.incompleteKeyResults} 个 KR。\n\n支撑目标的主要行动：\n${formatList(aggregate.completedContents, "暂无与目标相关的学习记录。")}`,
    tone,
  ),
  section(
    "偏差原因",
    `结合学习记录，当前偏差主要来自以下问题：\n${formatList(aggregate.problems, "暂未记录明确偏差原因。")}\n\n已尝试的解决方案：\n${formatList(aggregate.solutions, "暂无解决方案记录。")}`,
    tone,
  ),
  section(
    "下周调整",
    `下一周期建议优先处理未完成 KR，并落实以下行动：\n${formatList(aggregate.nextPlans, "围绕未完成 KR 制定更具体的行动计划。")}`,
    tone,
  ),
];

const learningSections = (
  aggregate: WeeklySummaryAggregate,
  tone: WeeklySummaryTone,
): WeeklySummarySection[] => [
  section(
    "本周学习内容",
    `本周共记录 ${aggregate.recordCount} 次学习，累计学习 ${durationText(aggregate.totalMinutes)}。\n${formatList(aggregate.completedContents, "本周暂无学习内容。")}`,
    tone,
  ),
  section(
    "掌握的知识",
    formatList(aggregate.achievements, "本周暂无明确的知识收获记录。"),
    tone,
  ),
  section(
    "遇到的问题",
    `${formatList(aggregate.problems, "本周未记录明显问题。")}\n\n对应解决方案：\n${formatList(aggregate.solutions, "暂无解决方案记录。")}`,
    tone,
  ),
  section(
    "改进计划",
    formatList(aggregate.nextPlans, "继续保持学习节奏，并补充每日复盘。"),
    tone,
  ),
];

const buildSections = (
  template: WeeklySummaryTemplate,
  aggregate: WeeklySummaryAggregate,
  tone: WeeklySummaryTone,
): WeeklySummarySection[] => {
  if (template === "okr_review") return okrSections(aggregate, tone);
  if (template === "learning") return learningSections(aggregate, tone);
  return standardSections(aggregate, tone);
};

export const weeklySummaryGenerationService: WeeklySummaryGenerationService = {
  async generate(input) {
    const periodRecords = input.records.filter(
      (record) => record.studyDate >= input.weekStart && record.studyDate <= input.weekEnd,
    );
    const aggregate = buildWeeklySummaryAggregate(periodRecords, input.okrs);
    const now = new Date().toISOString();
    const summary: WeeklySummary = {
      id: crypto.randomUUID(),
      weekStart: input.weekStart,
      weekEnd: input.weekEnd,
      title: `GrowthFlow 周总结（${input.weekStart} 至 ${input.weekEnd}）`,
      template: input.template,
      tone: input.tone,
      aggregate,
      sections: buildSections(input.template, aggregate, input.tone),
      markdown: "",
      generatedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    return { ...summary, markdown: buildSummaryMarkdown(summary) };
  },
};
