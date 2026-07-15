import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useToastStore } from './toast';

const MAX_COMPARE = 4;

type CompareState = {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
};

/** Comparison tray — holds up to 4 products (per spec), persisted across navigation. */
export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const { ids } = get();
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) });
          return;
        }
        if (ids.length >= MAX_COMPARE) {
          useToastStore.getState().push('المقارنة تتّسع لأربعة. أزل واحدًا أولًا.');
          return;
        }
        set({ ids: [...ids, id] });
      },
      clear: () => set({ ids: [] }),
    }),
    {
      name: 'as3ar_compare',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : (undefined as unknown as Storage))),
      skipHydration: true,
    }
  )
);
