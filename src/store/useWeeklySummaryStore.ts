import { create } from "zustand";
import { weeklySummaryGenerationService } from "@/services/weekly-summary-generation.service";
import { weeklySummaryService } from "@/services/weekly-summary.service";
import type {
  GenerateWeeklySummaryInput,
  WeeklySummary,
  WeeklySummaryTemplate,
  WeeklySummaryTone,
} from "@/types/generation";
import { buildSummaryMarkdown } from "@/utils/weeklySummary";

interface WeeklySummaryStore {
  draft: WeeklySummary | null;
  summaries: WeeklySummary[];
  template: WeeklySummaryTemplate;
  tone: WeeklySummaryTone;
  editingId: string | null;
  generating: boolean;
  saving: boolean;
  initialized: boolean;
  error: string | null;
  lastInput: GenerateWeeklySummaryInput | null;
  loadSummaries: () => Promise<void>;
  setTemplate: (template: WeeklySummaryTemplate) => void;
  generate: (input: GenerateWeeklySummaryInput) => Promise<void>;
  regenerate: () => Promise<void>;
  adjustTone: (tone: WeeklySummaryTone) => Promise<void>;
  updateTitle: (title: string) => void;
  updateContent: (sectionId: string, content: string) => void;
  editSaved: (summary: WeeklySummary) => void;
  saveDraft: () => Promise<void>;
  removeSummary: (summaryId: string) => Promise<void>;
  clearDraft: () => void;
  replaceSummaries: (summaries: WeeklySummary[]) => void;
}

const updateMarkdown = (summary: WeeklySummary): WeeklySummary => {
  const updated = { ...summary, updatedAt: new Date().toISOString() };
  return { ...updated, markdown: buildSummaryMarkdown(updated) };
};

export const useWeeklySummaryStore = create<WeeklySummaryStore>((set, get) => ({
  draft: null,
  summaries: [],
  template: "standard",
  tone: "standard",
  editingId: null,
  generating: false,
  saving: false,
  initialized: false,
  error: null,
  lastInput: null,

  loadSummaries: async () => {
    set({ error: null });
    try {
      set({
        summaries: await weeklySummaryService.list(),
        initialized: true,
      });
    } catch {
      set({ error: "历史周总结加载失败", initialized: true });
    }
  },

  setTemplate: (template) => set({ template }),

  generate: async (input) => {
    set({
      generating: true,
      error: null,
      template: input.template,
      tone: input.tone,
      editingId: null,
      lastInput: input,
    });
    try {
      set({
        draft: await weeklySummaryGenerationService.generate(input),
        generating: false,
      });
    } catch {
      set({ error: "周总结生成失败", generating: false });
    }
  },

  regenerate: async () => {
    const input = get().lastInput;
    if (input) await get().generate({ ...input, template: get().template, tone: get().tone });
  },

  adjustTone: async (tone) => {
    const input = get().lastInput;
    set({ tone });
    if (input) await get().generate({ ...input, template: get().template, tone });
  },

  updateTitle: (title) =>
    set((state) => ({
      draft: state.draft ? updateMarkdown({ ...state.draft, title }) : null,
    })),

  updateContent: (sectionId, content) =>
    set((state) => {
      if (!state.draft) return state;
      return {
        draft: updateMarkdown({
          ...state.draft,
          sections: state.draft.sections.map((section) =>
            section.id === sectionId ? { ...section, content } : section,
          ),
        }),
      };
    }),

  editSaved: (summary) =>
    set({
      draft: summary,
      template: summary.template,
      tone: summary.tone,
      editingId: summary.id,
      lastInput: null,
    }),

  saveDraft: async () => {
    const { draft, editingId, summaries } = get();
    if (!draft) return;
    set({ saving: true, error: null });
    try {
      if (editingId) {
        const existing = summaries.find((summary) => summary.id === editingId);
        if (!existing) {
          set({ saving: false, error: "未找到需要编辑的历史总结" });
          return;
        }
        const updated = updateMarkdown({
          ...draft,
          id: editingId,
          createdAt: existing.createdAt,
        });
        await weeklySummaryService.update(updated);
        set({
          summaries: summaries.map((summary) =>
            summary.id === editingId ? updated : summary,
          ),
          draft: null,
          editingId: null,
          saving: false,
        });
        return;
      }
      const saved = updateMarkdown(draft);
      await weeklySummaryService.create(saved);
      set({
        summaries: [saved, ...summaries],
        draft: null,
        saving: false,
      });
    } catch {
      set({ saving: false, error: "周总结保存失败" });
    }
  },

  removeSummary: async (summaryId) => {
    await weeklySummaryService.remove(summaryId);
    set((state) => ({
      summaries: state.summaries.filter((summary) => summary.id !== summaryId),
      draft: state.editingId === summaryId ? null : state.draft,
      editingId: state.editingId === summaryId ? null : state.editingId,
    }));
  },

  clearDraft: () => set({ draft: null, editingId: null, lastInput: null }),
  replaceSummaries: (summaries) =>
    set({
      summaries,
      draft: null,
      editingId: null,
      initialized: true,
      error: null,
      lastInput: null,
    }),
}));
