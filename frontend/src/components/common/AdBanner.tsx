import React from 'react';
import Script from 'next/script';

interface AdBannerProps {
    slot: 'header' | 'inArticle' | 'search-top';
    className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ slot, className = '' }) => {
    return (
        <div className={`ad-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}
                data-ad-slot={slot}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
            <Script id={`ad-${slot}`}>
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
            </Script>
        </div>
    );
};

export default AdBanner; 