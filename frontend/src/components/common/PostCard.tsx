import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/types';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostCardProps {
    post: Post;
    priority?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, priority = false }) => {
    const meta = JSON.parse(post.metaJson);
    
    return (
        <Link 
            href={`/posts/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
            <div className="relative w-full aspect-[1200/630]">
                <Image
                    src={meta.images[0]}
                    alt={meta.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={priority}
                />
            </div>
            
            <div className="flex-1 bg-white p-6">
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                        {meta.title}
                    </h2>
                    <p className="mt-3 text-base text-gray-500 line-clamp-3">
                        {meta.description}
                    </p>
                </div>
                
                <div className="mt-6 flex items-center">
                    <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={post.createdAt}>
                            {format(new Date(post.createdAt), 'PPP', { locale: ko })}
                        </time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{meta.keywords.slice(0, 3).join(', ')}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default PostCard; 