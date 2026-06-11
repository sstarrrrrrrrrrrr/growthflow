import { create } from "zustand";
import { okrGenerationService } from "@/services/okr-generation.service";
import { okrService } from "@/services/okr.service";
import type { GeneratedOkr, GenerateOkrInput, OkrTone, SavedOkr } from "@/types/generation";

interface OkrStore {
  draft: GeneratedOkr | null;
  savedOkrs: SavedOkr[];
  sourceInput: string;
  currentTone: OkrTone;
  editingId: string | null;
  generating: boolean;
  saving: boolean;
  initialized: boolean;
  error: string | null;
  loadOkrs: () => Promise<void>;
  setSourceInput: (sourceInput: string) => void;
  generate: (input?: GenerateOkrInput) => Promise<void>;
  regenerate: () => Promise<void>;
  adjustTone: (tone: OkrTone) => Promise<void>;
  updateDraft: (draft: GeneratedOkr) => void;
  editSaved: (okr: SavedOkr) => void;
  saveDraft: () => Promise<void>;
  removeOkr: (okrId: string) => Promise<void>;
  clearDraft: () => void;
  replaceOkrs: (okrs: SavedOkr[]) => void;
}

export const useOkrStore = create<OkrStore>((set, get) => ({
  draft: null,
  savedOkrs: [],
  sourceInput: "",
  currentTone: "standard",
  editingId: null,
  generating: false,
  saving: false,
  initialized: false,
  error: null,

  loadOkrs: async () => {
    set({ error: null });
    try {
      set({ savedOkrs: await okrService.list(), initialized: true });
    } catch {
      set({ error: "OKR 加载失败", initialized: true });
    }
  },

  setSourceInput: (sourceInput) => set({ sourceInput }),

  generate: async (input) => {
    const request = input ?? {
      text: get().sourceInput,
      tone: get().currentTone,
    };
    if (!request.text.trim()) return;
    set({
      generating: true,
      error: null,
      sourceInput: request.text,
      currentTone: request.tone,
      editingId: null,
    });
    try {
      set({
        draft: await okrGenerationService.generate(request),
        generating: false,
      });
    } catch {
      set({ error: "OKR 生成失败", generating: false });
    }
  },

  regenerate: async () => {
    await get().generate({
      text: get().sourceInput,
      tone: get().currentTone,
    });
  },

  adjustTone: async (tone) => {
    set({ currentTone: tone });
    await get().generate({ text: get().sourceInput, tone });
  },

  updateDraft: (draft) => set({ draft }),

  editSaved: (okr) =>
    set({
      draft: {
        id: okr.id,
        title: okr.title,
        progress: okr.progress,
        keyResults: okr.keyResults,
        sourceInput: okr.sourceInput,
        tone: okr.tone,
        generatedAt: okr.generatedAt,
      },
      sourceInput: okr.sourceInput,
      currentTone: okr.tone,
      editingId: okr.id,
    }),

  saveDraft: async () => {
    const { draft, editingId, savedOkrs } = get();
    if (!draft) return;
    set({ saving: true, error: null });
    const now = new Date().toISOString();
    try {
      if (editingId) {
        const existing = savedOkrs.find((okr) => okr.id === editingId);
        if (!existing) {
          set({ error: "未找到需要编辑的 OKR", saving: false });
          return;
        }
        const updated: SavedOkr = {
          ...draft,
          id: editingId,
          createdAt: existing.createdAt,
          updatedAt: now,
        };
        await okrService.update(updated);
        set({
          savedOkrs: savedOkrs.map((okr) => (okr.id === editingId ? updated : okr)),
          editingId: null,
          draft: null,
          saving: false,
        });
        return;
      }
      const saved: SavedOkr = {
        ...draft,
        createdAt: now,
        updatedAt: now,
      };
      await okrService.create(saved);
      set({
        savedOkrs: [saved, ...savedOkrs],
        draft: null,
        saving: false,
      });
    } catch {
      set({ error: "OKR 保存失败", saving: false });
    }
  },

  removeOkr: async (okrId) => {
    await okrService.remove(okrId);
    set((state) => ({
      savedOkrs: state.savedOkrs.filter((okr) => okr.id !== okrId),
      draft: state.editingId === okrId ? null : state.draft,
      editingId: state.editingId === okrId ? null : state.editingId,
    }));
  },

  clearDraft: () => set({ draft: null, editingId: null }),
  replaceOkrs: (savedOkrs) =>
    set({
      savedOkrs,
      draft: null,
      editingId: null,
      initialized: true,
      error: null,
    }),
}));
