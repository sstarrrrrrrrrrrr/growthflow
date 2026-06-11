import { storageService } from "@/services/storage";
import type { SavedOkr } from "@/types/generation";
import type { OkrRepository } from "@/types/service";

const STORAGE_KEY = "saved-okrs";

const sortOkrs = (okrs: SavedOkr[]): SavedOkr[] =>
  [...okrs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

const readOkrs = (): SavedOkr[] =>
  sortOkrs(storageService.get<SavedOkr[]>(STORAGE_KEY, []));

const writeOkrs = (okrs: SavedOkr[]): void =>
  storageService.set(STORAGE_KEY, sortOkrs(okrs));

export const okrService: OkrRepository = {
  async list() {
    return readOkrs();
  },
  async create(okr) {
    writeOkrs([okr, ...readOkrs()]);
    return okr;
  },
  async update(okr) {
    writeOkrs(readOkrs().map((item) => (item.id === okr.id ? okr : item)));
    return okr;
  },
  async remove(okrId) {
    writeOkrs(readOkrs().filter((okr) => okr.id !== okrId));
  },
};
