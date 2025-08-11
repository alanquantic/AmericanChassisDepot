import React from 'react';
import { useLanguage } from '@/lib/i18n-simple';

interface VideoSectionProps {
  videoUrl?: string;
  fallbackImageUrl?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ 
  videoUrl = "/assets/background-video.mp4", 
  fallbackImageUrl = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
}) => {
  const { t } = useLanguage();
  return (
    <section className="relative h-[80vh] overflow-hidden">
      {videoUrl ? (
        <video
          className="absolute w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoUrl} type="video/mp4" />
          <img src={fallbackImageUrl} alt="Chassis transportation" className="absolute w-full h-full object-cover" />
        </video>
      ) : (
        <img 
          src={fallbackImageUrl}
          alt="Chassis transportation"
          className="absolute w-full h-full object-cover"
        />
      )}
      
      {/* Overlay gradient for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 flex items-center justify-center">
        <div className="max-w-4xl px-6 text-center">
          <blockquote className="text-white">
            <p className="text-2xl md:text-4xl lg:text-5xl font-montserrat font-bold mb-6 leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
              "{t('videoQuote')}"
            </p>
            <cite className="block text-lg md:text-xl font-montserrat not-italic text-white/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              — {t('videoQuoteAuthor')}
            </cite>
          </blockquote>
          
          {/* Call to action button */}
          <div className="mt-10">
            <a 
              href="/contact" 
              className="bg-[#E30D16] text-white font-montserrat font-semibold px-8 py-3 rounded-md transition-all duration-300 hover:bg-[#c70b13] hover:scale-105 inline-block shadow-lg"
            >
              {t('partnerWithUs')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;