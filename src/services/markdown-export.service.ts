import type { WeeklySummary } from "@/types/generation";
import { buildSummaryMarkdown } from "@/utils/weeklySummary";

export const markdownExportService = {
  exportWeeklySummary(summary: WeeklySummary): void {
    const content = buildSummaryMarkdown(summary);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `GrowthFlow-周总结-${summary.weekEnd}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
