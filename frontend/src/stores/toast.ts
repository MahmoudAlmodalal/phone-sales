import { create } from 'zustand';

/**
 * Minimal global toast queue. Per the brief, toasts are neutral grey by
 * default; `variant: 'destructive'` is the only sanctioned red use here.
 */
type Toast = {
  id: number;
  message: string;
  variant: 'neutral' | 'destructive';
};

type ToastState = {
  toasts: Toast[];
  push: (message: string, variant?: Toast['variant']) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, variant = 'neutral') => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
