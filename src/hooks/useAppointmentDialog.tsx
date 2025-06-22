
import { create } from 'zustand';

type AppointmentDialogStore = {
  isOpen: boolean;
  openAppointment: () => void;
  closeAppointment: () => void;
  toggleAppointment: () => void;
};

export const useAppointmentDialog = create<AppointmentDialogStore>((set) => ({
  isOpen: false,
  openAppointment: () => set({ isOpen: true }),
  closeAppointment: () => set({ isOpen: false }),
  toggleAppointment: () => set((state) => ({ isOpen: !state.isOpen })),
}));
