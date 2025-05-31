import React from 'react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import useSiteStore from '@/stores/useSiteStore';

interface AffiliateButtonProps {
    href: string;
    className?: string;
}

const AffiliateButton: React.FC<AffiliateButtonProps> = ({ href, className }) => {
    const { config } = useSiteStore();

    if (!config?.affiliateId) return null;

    const affiliateUrl = new URL(href);
    affiliateUrl.searchParams.append('aid', config.affiliateId);

    return (
        <a
            href={affiliateUrl.toString()}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                inline-flex items-center justify-center px-6 py-3
                text-base font-medium text-white
                bg-blue-600 hover:bg-blue-700
                rounded-lg shadow-sm
                transition duration-150 ease-in-out
                ${className || ''}
            `}
        >
            지금 예약하기
            <ArrowTopRightOnSquareIcon className="w-5 h-5 ml-2" />
        </a>
    );
};

export default AffiliateButton; 