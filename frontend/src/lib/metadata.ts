import { Metadata } from 'next';
import { MetaData, Post, SiteConfig } from '@/types';

export function generatePostMetadata(
    post: Post,
    siteConfig: SiteConfig
): Metadata {
    const meta: MetaData = JSON.parse(post.metaJson);

    return {
        title: meta.title,
        description: meta.description,
        openGraph: {
            title: meta.title,
            description: meta.description,
            images: [meta.ogImage],
            type: 'article',
            siteName: `${siteConfig.city} 호텔 가이드`,
        },
        twitter: {
            card: 'summary_large_image',
            title: meta.title,
            description: meta.description,
            images: [meta.ogImage],
        },
        keywords: meta.keywords.join(', '),
    };
}

export function generateBlogPostSchema(
    post: Post,
    siteConfig: SiteConfig,
    url: string
) {
    const meta: MetaData = JSON.parse(post.metaJson);

    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: meta.title,
        description: meta.description,
        image: meta.images,
        datePublished: post.createdAt,
        dateModified: post.createdAt,
        author: {
            '@type': 'Organization',
            name: `${siteConfig.city} 호텔 가이드`,
            url: `https://${siteConfig.domain}`,
        },
        publisher: {
            '@type': 'Organization',
            name: `${siteConfig.city} 호텔 가이드`,
            url: `https://${siteConfig.domain}`,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
        },
    };
}

export function generateBreadcrumbSchema(
    items: Array<{ name: string; url: string }>,
    siteConfig: SiteConfig
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `https://${siteConfig.domain}${item.url}`,
        })),
    };
} 