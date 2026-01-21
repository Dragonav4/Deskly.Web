import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { getApiAuthMe } from '../../../shared/api/generated'

export type User = { id: string; email: string; name?: string; picture?: string | null; role?: string }

type AuthStore = {
    user: User | null
    setUser: (user: User | null) => void
    setPicture: (picture: string | null) => void
    signIn: (user: User) => void
    signOut: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,

            setUser: (user) => set({ user }),

            setPicture: (url) => set((state) => ({
                user: state.user ? { ...state.user, picture: url } : null
            })),
            signIn: (user) => set({ user }),
            signOut: () => set({ user: null }),
        }),
        {
            name: 'auth_state_v1',
            storage: createJSONStorage(() => localStorage),
            partialize: (s) => ({ user: s.user }),
            version: 1,
        },
    ),
)

export const auth = {
    getUser: () => useAuthStore.getState().user,
    isAuthenticated: () => Boolean(useAuthStore.getState().user),

    signIn: (user: User) => useAuthStore.getState().signIn(user),
    signOut: () => useAuthStore.getState().signOut(),

    fetchCurrentUser: async () => {
        try {
            const response = await getApiAuthMe();
            const userData = response.data as User;

            auth.signIn(userData);
            return userData;
        } catch (error) {
            auth.signOut();
            return null;
        }
    }
}
