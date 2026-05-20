import { create } from 'zustand';

export type Space = 'universe' | 'dashboard' | 'payment' | 'education' | 'creator' | 'music' | 'profile' | 'analytics' | 'discover' | 'entertainment' | 'productivity';

interface UIState {
  activeSpace: Space;
  setActiveSpace: (space: Space) => void;
  isBundiOpen: boolean;
  toggleBundi: () => void;
  isPaymentOpen: boolean;
  setPaymentOpen: (open: boolean) => void;
  selectedBundle: any | null;
  setSelectedBundle: (bundle: any | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSpace: 'discover',
  setActiveSpace: (space) => set({ activeSpace: space }),
  isBundiOpen: false,
  toggleBundi: () => set((state) => ({ isBundiOpen: !state.isBundiOpen })),
  isPaymentOpen: false,
  setPaymentOpen: (open) => set({ isPaymentOpen: open }),
  selectedBundle: null,
  setSelectedBundle: (bundle) => set({ selectedBundle: bundle }),
}));
