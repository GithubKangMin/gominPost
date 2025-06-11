export interface AuthRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
    nickname: string;
    role: string;
}

export interface AuthError {
    message: string;
    field?: string;
} 