'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '@/types/index';
import { authApi, setToken } from '@/lib/api';

// Sync token to cookie so SSR can read it
function setAuthCookie(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
  } else {
    document.cookie = 'authToken=; path=/; max-age=0';
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initialize: async () => {
        try {
          const token =
            typeof window !== 'undefined'
              ? localStorage.getItem('authToken')
              : null;
          if (token) {
            set({ token });
            const user = await authApi.getCurrentUser();
            set({ user, isAuthenticated: true, token });
            setToken(token);
            setAuthCookie(token);
          }
        } catch (error) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('auth-storage');
            document.cookie = 'authToken=; path=/; max-age=0';
          }
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.login(email, password);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          setAuthCookie(token);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Login failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await authApi.register(name, email, password);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          setAuthCookie(token);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Registration failed';
          set({ isLoading: false, error: message });
          throw error;
        }
      },

      logout: () => {
        authApi.logout();
        setAuthCookie(null);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.token) {
            setToken(state.token);
            setAuthCookie(state.token);
          }
        };
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
