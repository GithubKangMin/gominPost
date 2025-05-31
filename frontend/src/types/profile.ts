export interface Profile {
    id: number;
    email: string;
    nickname: string;
    role: string;
    createdAt: string;
    imageUrl?: string;
}

export interface ProfileUpdateRequest {
    nickname: string;
    currentPassword?: string;
    newPassword?: string;
    imageFile?: File;
}

export interface ProfileError {
    message: string;
    field?: string;
} 