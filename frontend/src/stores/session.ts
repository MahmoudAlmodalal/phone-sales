import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Session store for auth and profile state.
 * Default state is strictly 'guest' with no user profile.
 * Logging in authenticates as a user with persistent profile data.
 */
export type Role = 'guest' | 'user' | 'vendor' | 'admin';

export const ROLE_LABELS: Record<Role, string> = {
  guest: 'زائر',
  user: 'مستخدم',
  vendor: 'بائع',
  admin: 'مدير النظام',
};

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  avatarUrl: string;
  joinedDate: string;
  isVerified: boolean;
}

export const DEFAULT_USER: UserProfile = {
  name: 'عبدالله الشمري',
  email: 'a.alshammari@example.com',
  phone: '+966 55 123 4567',
  city: 'الرياض',
  avatarUrl: '/avatars/avatar-1.svg',
  joinedDate: 'يوليو 2026',
  isVerified: true,
};

export const DEMO_AVATARS = [
  { id: 'avatar-1', url: '/avatars/avatar-1.svg', label: 'كلاسيكي أخضر' },
  { id: 'avatar-2', url: '/avatars/avatar-2.svg', label: 'عصري أزرق' },
  { id: 'avatar-3', url: '/avatars/avatar-3.svg', label: 'نظارات نيلي' },
  { id: 'avatar-4', url: '/avatars/avatar-4.svg', label: 'أنيق عنبري' },
  { id: 'avatar-5', url: '/avatars/avatar-5.svg', label: 'سماعات بنفسجي' },
  { id: 'avatar-6', url: '/avatars/avatar-6.svg', label: 'رسمي كحلي' },
];

type SessionState = {
  role: Role;
  user: UserProfile | null;
  hydrated: boolean;
  login: (profileOrRole?: Partial<UserProfile> | Role) => void;
  logout: () => void;
  setAvatar: (avatarUrl: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      role: 'guest',
      user: null,
      hydrated: false,
      login: (input) => {
        if (typeof input === 'string') {
          const role = input as Role;
          set({
            role,
            user: role === 'guest' ? null : { ...DEFAULT_USER },
          });
        } else {
          set({
            role: 'user',
            user: {
              ...DEFAULT_USER,
              ...(input || {}),
            },
          });
        }
      },
      logout: () => set({ role: 'guest', user: null }),
      setAvatar: (avatarUrl) =>
        set((s) => ({
          user: s.user ? { ...s.user, avatarUrl } : null,
        })),
      updateProfile: (profile) =>
        set((s) => ({
          user: s.user ? { ...s.user, ...profile } : null,
        })),
    }),
    {
      name: 'as3ar_role',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as unknown as Storage))),
      skipHydration: true,
      partialize: (s) => ({ role: s.role, user: s.user }),
      onRehydrateStorage: () => () => {
        useSessionStore.setState({ hydrated: true });
      },
    }
  )
);

export function useSession() {
  const role = useSessionStore((s) => s.role);
  const user = useSessionStore((s) => s.user);
  return {
    role,
    user,
    roleLabel: ROLE_LABELS[role],
    isAuthed: role !== 'guest',
    isVendor: role === 'vendor',
    isAdmin: role === 'admin',
  };
}
