import React from 'react';

interface VideoSectionProps {
  videoUrl?: string;
  fallbackImageUrl?: string;
  quote?: string;
  quoteAuthor?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ 
  videoUrl = "", 
  fallbackImageUrl = "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
  quote = "Trusted transportation solutions that drive success for businesses across America.",
  quoteAuthor = "American Chassis Depot"
}) => {
  return (
    <section className="relative h-[70vh] overflow-hidden">
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
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
        <div className="max-w-4xl px-6 text-center">
          <blockquote className="text-white">
            <p className="text-2xl md:text-4xl font-montserrat font-bold mb-6 leading-tight">
              "{quote}"
            </p>
            {quoteAuthor && (
              <cite className="block text-lg md:text-xl font-montserrat not-italic text-white/90">
                — {quoteAuthor}
              </cite>
            )}
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;