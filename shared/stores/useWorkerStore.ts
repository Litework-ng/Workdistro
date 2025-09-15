import { create } from "zustand";
import {User} from "@/shared/types/user"

interface WorkerState {
  selectedWorker: User | null;
  setWorker: (worker: User) => void;
}
export const useWorkerStore = create<WorkerState>((set) => ({
  selectedWorker: null,
  setWorker: (worker: User) => set({ selectedWorker: worker }),
}));
