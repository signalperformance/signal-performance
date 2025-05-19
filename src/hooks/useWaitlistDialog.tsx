
import { create } from 'zustand';

type WaitlistDialogStore = {
  isOpen: boolean;
  openWaitlist: () => void;
  closeWaitlist: () => void;
  toggleWaitlist: () => void;
};

export const useWaitlistDialog = create<WaitlistDialogStore>((set) => ({
  isOpen: false,
  openWaitlist: () => set({ isOpen: true }),
  closeWaitlist: () => set({ isOpen: false }),
  toggleWaitlist: () => set((state) => ({ isOpen: !state.isOpen })),
}));
