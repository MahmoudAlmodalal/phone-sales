import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Mock session store standing in for real auth (Phase 04 will replace this
 * with an httpOnly-cookie session + `/api/session`). Kept in one file, with
 * one shape (`role`), so swapping in real `useSession()` later doesn't touch
 * any page code — pages only ever read `role` / `isAuthed` / `isVendor` / `isAdmin`.
 */
export type Role = 'guest' | 'user' | 'vendor' | 'admin';

export const ROLE_LABELS: Record<Role, string> = {
  guest: 'زائر',
  user: 'مستخدم',
  vendor: 'بائع',
  admin: 'مدير النظام',
};

type SessionState = {
  role: Role;
  hydrated: boolean;
  login: (role?: Role) => void;
  logout: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      role: 'guest',
      hydrated: false,
      login: (role = 'user') => set({ role }),
      logout: () => set({ role: 'guest' }),
    }),
    {
      name: 'as3ar_role',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as unknown as Storage))),
      skipHydration: true,
      partialize: (s) => ({ role: s.role }),
      onRehydrateStorage: () => () => {
        useSessionStore.setState({ hydrated: true });
      },
    }
  )
);

export function useSession() {
  const role = useSessionStore((s) => s.role);
  return {
    role,
    roleLabel: ROLE_LABELS[role],
    isAuthed: role !== 'guest',
    isVendor: role === 'vendor' || role === 'admin',
    isAdmin: role === 'admin',
  };
}
