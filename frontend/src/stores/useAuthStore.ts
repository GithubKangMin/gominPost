import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    email: string | null;
    nickname: string | null;
    role: string | null;
    setAuth: (auth: { accessToken: string; refreshToken: string; email: string; nickname: string; role: string }) => void;
    clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            email: null,
            nickname: null,
            role: null,
            setAuth: (auth) => set(auth),
            clearAuth: () => set({
                accessToken: null,
                refreshToken: null,
                email: null,
                nickname: null,
                role: null
            })
        }),
        {
            name: 'auth-storage'
        }
    )
);

export default useAuthStore; 