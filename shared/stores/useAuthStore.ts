import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/shared/types/user'; // Adjust the import path as necessary



interface AuthState {
  token: string | null;
  user: User | null;
   setUser: (user: User) => void;
   is_verified: boolean;
   userType: string | null;
  setIsVerified: (is_verified: boolean) => void;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      is_verified: false,
      setAuth: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      userType: null,
      setUser: (user) => set({ user }),
      setIsVerified: (is_verified) =>
      set((state) => ({
      user: state.user ? { ...state.user, is_verified } : state.user,
    })),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
 )
);