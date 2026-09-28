import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  role: 'STUDENT' | 'TPO';
  university: { id: number; name: string };
}

interface AuthState {
  user: User | null;
  isAuthChecked: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  setAuthChecked: (isAuthChecked: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthChecked: false,
      setUser: (user) => set({ user }, false, 'auth/setUser'),
      clearUser: () => set({ user: null }, false, 'auth/clearUser'),
      setAuthChecked: (isAuthChecked) => set({ isAuthChecked }, false, 'auth/setAuthChecked'),
    }),
    { name: 'AuthStore' }
  )
);