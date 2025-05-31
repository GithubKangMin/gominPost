import axios from 'axios';
import { getAccessToken, refreshAccessToken } from '@/lib/auth';
import { Post, SiteConfig } from '@/types';
import { AuthRequest, AuthResponse } from '@/types/auth';
import { Profile, ProfileUpdateRequest } from '@/types/profile';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터
api.interceptors.request.use(
    async (config) => {
        const token = await getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 토큰 만료로 인한 401 에러 && 재시도하지 않은 요청
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // 토큰 갱신 시도
                const newToken = await refreshAccessToken();
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;

export async function searchPosts(query: string, page = 0, size = 12): Promise<{ content: Post[] }> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
        { next: { revalidate: 0 } }
    );
    
    if (!res.ok) {
        throw new Error('검색 중 오류가 발생했습니다');
    }
    
    return res.json();
}

export async function getSiteConfig(): Promise<SiteConfig> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site-config`, {
        next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
        throw new Error('사이트 설정을 불러오는 중 오류가 발생했습니다');
    }
    
    return res.json();
}

export async function register(data: AuthRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
}

export async function login(data: AuthRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
}

export async function refreshToken(token: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', token);
    return response.data;
}

export async function getProfile(): Promise<Profile> {
    const response = await api.get<Profile>('/auth/profile');
    return response.data;
}

export async function updateProfile(data: ProfileUpdateRequest): Promise<Profile> {
    if (data.imageFile) {
        const formData = new FormData();
        formData.append('imageFile', data.imageFile);
        formData.append('nickname', data.nickname);
        if (data.currentPassword) formData.append('currentPassword', data.currentPassword);
        if (data.newPassword) formData.append('newPassword', data.newPassword);

        const response = await api.put<Profile>('/auth/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }

    const response = await api.put<Profile>('/auth/profile', data);
    return response.data;
}

export async function getUserPosts(page = 0, size = 12): Promise<{ content: Post[], totalPages: number }> {
    const response = await api.get<{ content: Post[], totalPages: number }>(`/api/users/posts?page=${page}&size=${size}`);
    return response.data;
} 