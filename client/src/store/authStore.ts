import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  role: 'STUDENT' | 'TPO';
  email?: string;
  universityId?: number;
  graduationYear?: number | null;
}

interface AuthState {
  user: User | null;
  setAuth: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setAuth: (user) => set({ user }),
        logout: () => set({ user: null }),
      }),
      { name: 'auth-storage' }
    ),
    { name: 'AuthStore' }
  )
);