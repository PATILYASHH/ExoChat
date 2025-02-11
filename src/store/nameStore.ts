import { create } from 'zustand';

interface NameState {
  name: string | null;
  setName: (name: string) => void;
}

export const useNameStore = create<NameState>((set) => ({
  name: null,
  setName: (name) => set({ name }),
}));