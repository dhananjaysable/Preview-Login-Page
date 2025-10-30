import React, { useRef, useEffect, useState } from 'react';

interface VideoOverlayProps {
  videoSrc: string;
  opacity?: number;
  blur?: number;
  overlayColor?: string; // dark scrim over video for contrast
}

export const VideoOverlay: React.FC<VideoOverlayProps> = ({ 
  videoSrc, 
  opacity = 0.35,
  blur = 3,
  overlayColor = 'rgba(0, 0, 0, 0.35)'
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Ensure video plays on mount
      video.play().catch(err => {
        console.log('Video autoplay prevented or file not found:', err);
        setVideoError(true);
      });
    }
  }, []);

  // Handle video load error
  const handleVideoError = () => {
    console.log('Video file not found. Using fallback gradient background.');
    setVideoError(true);
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Video element - only render if no error */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onError={handleVideoError}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            opacity: opacity,
            filter: `blur(${blur}px)`,
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Fallback gradient when video missing */}
      {videoError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, rgba(224, 247, 250, 0.8) 0%, rgba(178, 235, 242, 0.6) 50%, rgba(227, 242, 253, 0.4) 100%)',
          }}
        />
      )}

      {/* Dark scrim overlay for contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: overlayColor,
        }}
      />
    </div>
  );
};
