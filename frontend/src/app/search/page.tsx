'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PostCard from '@/components/common/PostCard';
import AdBanner from '@/components/common/AdBanner';
import { Post } from '@/types';
import useDebounce from '@/hooks/useDebounce';
import { searchPosts } from '@/lib/api';

export default function SearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const debouncedSearch = useDebounce(async (query: string) => {
        if (!query.trim()) {
            setPosts([]);
            setError(null);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            const data = await searchPosts(query);
            setPosts(data.content);
        } catch (error) {
            console.error('검색 오류:', error);
            setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    }, 300);
    
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        router.push(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
        debouncedSearch(query);
    };
    
    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        호텔 검색
                    </h1>
                    <div className="max-w-xl mx-auto">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="호텔 이름, 지역, 특징으로 검색하세요"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="mb-8">
                    <AdBanner slot="search-top" className="max-w-4xl mx-auto" />
                </div>

                {error && (
                    <div className="text-center py-4 text-red-600">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {!isLoading && !error && searchQuery && posts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        검색 결과가 없습니다
                    </div>
                )}
            </div>
        </main>
    );
} 