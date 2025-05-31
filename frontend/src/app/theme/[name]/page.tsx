import { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import PostCard from '@/components/common/PostCard';
import AdBanner from '@/components/common/AdBanner';
import { Post, SiteConfig } from '@/types';

async function getPosts(host: string, theme: string): Promise<Post[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?theme=${encodeURIComponent(theme)}`,
        {
            headers: { 'Host': host },
            next: { revalidate: 3600 }, // 1시간마다 재검증
        }
    );
    
    if (!res.ok) {
        if (res.status === 404) notFound();
        throw new Error('Failed to fetch posts');
    }
    
    const data = await res.json();
    return data.content;
}

async function getSiteConfig(host: string): Promise<SiteConfig> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/site-config`,
        {
            headers: { 'Host': host },
            next: { revalidate: 3600 },
        }
    );
    
    if (!res.ok) throw new Error('Failed to fetch site config');
    return res.json();
}

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
    const headersList = headers();
    const host = headersList.get('host') || '';
    const siteConfig = await getSiteConfig(host);
    const decodedTheme = decodeURIComponent(params.name);
    
    return {
        title: `${decodedTheme} 호텔 가이드 - ${siteConfig.city} 특집`,
        description: `${siteConfig.city}의 ${decodedTheme} 호텔을 소개합니다. 최고의 숙박 시설과 특별한 경험을 제공하는 호텔들을 만나보세요.`,
        openGraph: {
            title: `${decodedTheme} 호텔 가이드`,
            description: `${siteConfig.city}의 ${decodedTheme} 호텔을 소개합니다.`,
            type: 'website',
        },
    };
}

export default async function ThemePage({ params }: { params: { name: string } }) {
    const headersList = headers();
    const host = headersList.get('host') || '';
    const decodedTheme = decodeURIComponent(params.name);
    
    const [posts, siteConfig] = await Promise.all([
        getPosts(host, decodedTheme),
        getSiteConfig(host),
    ]);

    return (
        <main className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 헤더 섹션 */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {decodedTheme} 호텔 가이드
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {siteConfig.city}의 {decodedTheme} 호텔들을 소개합니다.
                        최고의 숙박 시설과 특별한 경험을 제공하는 호텔들을 만나보세요.
                    </p>
                </div>

                {/* 광고 배너 */}
                <div className="mb-12">
                    <AdBanner slot="header" className="max-w-4xl mx-auto" />
                </div>

                {/* 포스트 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, index) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            priority={index < 3}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
} 