import type { GenerationService } from "@/types/service";
import { okrGenerationService } from "../okr-generation.service";
import { weeklySummaryGenerationService } from "../weekly-summary-generation.service";

export const ruleGenerationService: GenerationService = {
  async generateOkr(input) {
    return okrGenerationService.generate(input);
  },

  async generateWeeklySummary(input) {
    return weeklySummaryGenerationService.generate(input);
  },
};
