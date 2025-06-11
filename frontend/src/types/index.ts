export interface Post {
    id: number;
    title: string;
    slug: string;
    html: string;
    metaJson: string;
    createdAt: string;
}

export interface SiteConfig {
    id: number;
    domain: string;
    city: string;
    theme: string;
    adsenseId?: string;
    affiliateId?: string;
}

export interface User {
    id: number;
    email: string;
    nickname: string;
    role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface MetaData {
    title: string;
    description: string;
    ogImage: string;
    images: string[];
    keywords: string[];
} 