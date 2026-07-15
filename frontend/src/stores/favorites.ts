import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type FavoritesState = {
  ids: string[];
  isFav: (id: string) => boolean;
  toggle: (id: string) => void;
};

/**
 * Favorites — optimistic local toggle. In this frontend-only phase there is no
 * backend to sync against, so guest and authed behavior are the same
 * (localStorage). Phase 04/05 will add the authed API call + merge-on-login.
 */
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      isFav: (id) => get().ids.includes(id),
      toggle: (id) => {
        const { ids } = get();
        set({ ids: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
      },
    }),
    {
      name: 'as3ar_favorites',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as unknown as Storage))),
      skipHydration: true,
    }
  )
);
