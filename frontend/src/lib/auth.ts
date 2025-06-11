import { jwtDecode } from 'jwt-decode';
import api from './api';
import { AuthResponse, User } from '@/types';

const TOKEN_KEY = 'rt';

export const setTokens = (accessToken: string, refreshToken: string) => {
    // access_token은 http-only 쿠키로 저장 (서버에서 설정)
    localStorage.setItem(TOKEN_KEY, refreshToken);
};

export const getAccessToken = async (): Promise<string | null> => {
    // access_token은 http-only 쿠키에서 자동으로 전송됨
    return null;
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    // access_token 쿠키는 서버에서 제거
};

export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return null;

        const response = await api.post<AuthResponse>('/auth/refresh', {
            refreshToken
        });

        setTokens(response.data.accessToken, response.data.refreshToken);
        return response.data.accessToken;
    } catch (error) {
        clearTokens();
        return null;
    }
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) return true;
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const response = await api.get<User>('/auth/profile');
        return response.data;
    } catch {
        return null;
    }
}; 