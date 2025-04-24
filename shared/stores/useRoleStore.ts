import { create } from 'zustand';

type Role = 'client' | 'worker' | null;

interface RoleState {
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  selectedRole: null,
  setSelectedRole: (role) => set({ selectedRole: role }),
}));
