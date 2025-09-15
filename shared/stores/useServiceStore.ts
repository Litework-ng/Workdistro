import { create } from 'zustand';

interface Service {
  id: number;
  name: string;
  // add other fields if needed
}

interface ServiceStore {
  services: Service[];
  setServices: (services: Service[]) => void;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  setServices: (services) => set({ services }),
}));
