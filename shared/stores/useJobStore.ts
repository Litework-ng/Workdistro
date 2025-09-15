// shared/stores/useJobStore.ts
import { create } from "zustand";
import type { Job, WorkerBid } from "@/shared/types/job";
import type { User } from "@/shared/types/user";

interface JobStoreState {
  job: Job | null;
  worker: User | null;
  bid: WorkerBid | null;
  setJobContext: (job: Job, worker?: User, bid?: WorkerBid) => void;
  resetJobContext: () => void;
}

export const useJobStore = create<JobStoreState>((set) => ({
  job: null,
  worker: null,
  bid: null,
  setJobContext: (job, worker = undefined, bid = undefined) => set({ job, worker, bid }),
  resetJobContext: () => set({ job: null, worker: null, bid: null }),
}));