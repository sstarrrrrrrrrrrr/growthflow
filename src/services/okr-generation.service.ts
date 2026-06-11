import type { KeyResult } from "@/types/domain";
import type { GeneratedOkr, OkrTone } from "@/types/generation";
import type { OkrGenerationService } from "@/types/service";

type OkrDomain = "programming" | "project" | "algorithm" | "english" | "general";

interface ParsedIntent {
  domain: OkrDomain;
  subject: string;
  focus: string;
  frequency: number | null;
  lines: string[];
}

const domainKeywords: Record<OkrDomain, string[]> = {
  programming: [
    "python", "javascript", "typescript", "java", "react", "vue", "编程",
    "前端", "后端", "面向对象", "数据库",
  ],
  project: ["项目", "产品", "功能", "开发", "优化", "重构", "上线", "迭代"],
  algorithm: ["算法", "leetcode", "刷题", "数据结构", "动态规划"],
  english: ["英语", "四级", "六级", "单词", "口语", "听力", "阅读", "写作"],
  general: [],
};

const programmingSubjects = [
  "Python", "JavaScript", "TypeScript", "Java", "React", "Vue", "数据库",
];

const normalizeInput = (text: string): string =>
  text
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");

const splitLines = (text: string): string[] =>
  text
    .split(/\n|[。；;]/)
    .map((line) => line.trim())
    .filter(Boolean);

const inferDomain = (text: string): OkrDomain => {
  const normalized = text.toLowerCase();
  const entries = Object.entries(domainKeywords) as Array<[OkrDomain, string[]]>;
  const matched = entries
    .filter(([domain]) => domain !== "general")
    .map(([domain, keywords]) => ({
      domain,
      score: keywords.filter((keyword) => normalized.includes(keyword.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score)[0];
  return matched?.score ? matched.domain : "general";
};

const inferSubject = (text: string, domain: OkrDomain): string => {
  const matchedProgrammingSubject = programmingSubjects.find((subject) =>
    text.toLowerCase().includes(subject.toLowerCase()),
  );
  if (matchedProgrammingSubject) return matchedProgrammingSubject;

  if (domain === "project") {
    const namedProject = text.match(/(?:优化|开发|推进|完善|重构)?\s*([A-Za-z][\w-]*)\s*项目/i);
    return namedProject?.[1] ? `${namedProject[1]}项目` : "当前项目";
  }
  if (domain === "algorithm") return "算法";
  if (domain === "english") {
    if (text.includes("四级")) return "英语四级";
    if (text.includes("六级")) return "英语六级";
    return "英语";
  }
  return "目标能力";
};

const inferFocus = (text: string, subject: string): string => {
  const stripped = text
    .replace(new RegExp(subject.replace("项目", ""), "gi"), "")
    .replace(/下周|本周|这周|继续|每天|每日|学习|完成|推进|准备|项目|一道|一篇/g, "")
    .replace(/[，,。；;：:]/g, " ")
    .trim();
  return stripped || subject;
};

const inferFrequency = (text: string): number | null => {
  if (/每天|每日/.test(text)) return 5;
  const weeklyCount = text.match(/(?:每周|一周).{0,4}?(\d+|[一二三四五六七八九十]+)[次道篇]/);
  if (!weeklyCount) return null;
  const numeric = Number(weeklyCount[1]);
  return Number.isFinite(numeric) ? numeric : 3;
};

const parseIntent = (text: string): ParsedIntent => {
  const lines = splitLines(text);
  const domain = inferDomain(text);
  const subject = inferSubject(text, domain);
  return {
    domain,
    subject,
    focus: inferFocus(lines[0] ?? text, subject),
    frequency: inferFrequency(text),
    lines,
  };
};

const applyTone = (title: string, tone: OkrTone): string => {
  if (tone === "formal") {
    if (title.startsWith("提升")) {
      return `${title.replace(/^提升/, "系统提升")}并形成可验证成果`;
    }
    if (title.startsWith("推进")) {
      return `${title.replace(/^推进/, "系统推进")}并形成可验证成果`;
    }
    return `系统推进${title}并形成可验证成果`;
  }
  if (tone === "concise") return title.replace(/系统|持续|综合/g, "");
  if (tone === "casual") return `把${title.replace(/^提升|^推进/, "")}真正做好`;
  return title;
};

const buildObjective = (intent: ParsedIntent, tone: OkrTone): string => {
  const titles: Record<OkrDomain, string> = {
    programming: `提升${intent.subject}开发能力`,
    project: `推进${intent.subject}开发`,
    algorithm: "提升算法问题解决能力",
    english: `提升${intent.subject}应用能力`,
    general: `完成${intent.focus}并形成可验证成果`,
  };
  return applyTone(titles[intent.domain], tone);
};

const detailSuffix = (tone: OkrTone): string =>
  tone === "detailed" ? "，并输出过程记录与复盘结论" : "";

const buildKeyResultTitles = (intent: ParsedIntent, tone: OkrTone): string[] => {
  const frequency = intent.frequency ?? 3;
  const templates: Record<OkrDomain, string[]> = {
    programming: [
      `学习${intent.focus}基础并整理核心概念`,
      `完成至少 ${frequency} 次${intent.subject}相关练习`,
      `独立实现一个可运行的${intent.focus}示例`,
    ],
    project: [
      `完成${intent.subject}核心功能开发`,
      "优化关键流程的用户体验",
      "完成一次功能验证并记录改进项",
    ],
    algorithm: [
      `每周完成至少 ${frequency} 道算法题`,
      "整理题目思路、复杂度与易错点",
      "完成一次同类题目的集中复盘",
    ],
    english: [
      `完成至少 ${frequency} 次${intent.focus}专项练习`,
      "整理高频表达与典型错误",
      "完成一次限时练习并复盘改进",
    ],
    general: [
      `完成至少 ${frequency} 次围绕${intent.focus}的有效行动`,
      `输出一份${intent.focus}成果记录`,
      "完成复盘并明确下一步改进计划",
    ],
  };

  const lineResults = intent.lines.slice(1).map((line) => `完成：${line}`);
  let results = [...lineResults, ...templates[intent.domain]];
  if (tone === "concise") results = results.slice(0, 2);
  if (tone === "detailed") {
    results = results.map((result) => `${result}${detailSuffix(tone)}`);
    results.push("在周末根据完成情况更新进度并形成总结");
  }
  if (tone === "formal") {
    results = results.map((result) => `${result}，并保留可验证的成果证据`);
  }
  if (tone === "casual") {
    results = results.map((result) => result.replace("完成至少", "踏实完成"));
  }
  return Array.from(new Set(results)).slice(0, 5);
};

const toKeyResult = (title: string): KeyResult => ({
  id: crypto.randomUUID(),
  title,
  status: "not_started",
  progress: 0,
});

export const okrGenerationService: OkrGenerationService = {
  async generate(input) {
    const sourceInput = normalizeInput(input.text);
    const intent = parseIntent(sourceInput);
    const result: GeneratedOkr = {
      id: crypto.randomUUID(),
      title: buildObjective(intent, input.tone),
      progress: 0,
      sourceInput,
      tone: input.tone,
      generatedAt: new Date().toISOString(),
      keyResults: buildKeyResultTitles(intent, input.tone).map(toKeyResult),
    };
    return result;
  },
};
