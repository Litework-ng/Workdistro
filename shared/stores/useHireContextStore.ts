import { create } from "zustand";

interface Worker {
    // Define properties of Worker as needed, e.g.:
    // id: string;
    // name: string;
    [key: string]: any;
}

interface Bid {
    // Define properties of Bid as needed
    [key: string]: any;
}

interface Task {
    // Define properties of Task as needed
    [key: string]: any;
}

interface HireContextState {
    worker: Worker | null;
    bid: Bid | null;
    task: Task | null;
    setHireContext: (worker: Worker | null, bid: Bid | null, task: Task | null) => void;
    resetHireContext: () => void;
}

export const useHireContextStore = create<HireContextState>((set) => ({
    worker: null,
    bid: null,
    task: null,
    setHireContext: (worker, bid, task) => set({ worker, bid, task }),
    resetHireContext: () => set({ worker: null, bid: null, task: null }),
}));