import { create } from 'zustand';
import { SiteConfig } from '@/types';
import api from '@/lib/api';

interface SiteStore {
    config: SiteConfig | null;
    isLoading: boolean;
    error: string | null;
    fetchConfig: () => Promise<void>;
}

const useSiteStore = create<SiteStore>((set) => ({
    config: null,
    isLoading: false,
    error: null,
    fetchConfig: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.get<SiteConfig>('/site-config');
            set({ config: response.data, isLoading: false });
        } catch (error) {
            set({ 
                error: '사이트 설정을 불러오는데 실패했습니다.', 
                isLoading: false 
            });
        }
    },
}));

export default useSiteStore; 