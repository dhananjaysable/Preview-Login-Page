import React from 'react';
import { motion } from 'motion/react';

interface BackgroundProps {
  mousePosition: { x: number; y: number };
  prefersReducedMotion: boolean;
}

export const DarkerCivicNight = React.memo(({ mousePosition, prefersReducedMotion }: BackgroundProps) => {
  return (
    <>
      {/* Base Frame - Darker Civic Night Gradient */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #8fa1ea 0%, #a9aec4 100%)',
          willChange: 'auto',
        }}
      />
      
      {/* Vignette overlay for deeper edge darkness */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, transparent 0%, transparent 40%, rgba(10, 22, 52, 0.22) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Optional noise layer to avoid banding */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          pointerEvents: 'none',
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Spotlight behind card area - enhanced for readability */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 850px 650px at 50% 45%, rgba(230, 235, 255, 0.26) 0%, transparent 65%)',
          pointerEvents: 'none',
          filter: 'blur(110px)',
          mixBlendMode: 'soft-light',
          opacity: 0.9,
          willChange: 'auto',
        }}
      />

      {/* Glows - Cool Navy/Blue with enhanced intensity */}
      <div
        className="fixed inset-0"
        style={{ 
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        {/* Left Blue Glow */}
        <motion.div
          style={{
            position: 'absolute',
            top: '28%',
            left: '18%',
            width: '620px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74, 98, 224, 0.22) 0%, rgba(74, 98, 224, 0) 70%)',
            filter: 'blur(80px)',
            mixBlendMode: 'soft-light',
            opacity: 0.85,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '20px', '0px'],
            y: ['0px', '14px', '0px'],
            scale: [1, 1.02, 1]
          } : {}}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Right Navy Glow */}
        <motion.div
          style={{
            position: 'absolute',
            top: '22%',
            right: '18%',
            width: '520px',
            height: '320px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(10, 22, 52, 0.18) 0%, rgba(10, 22, 52, 0) 70%)',
            filter: 'blur(90px)',
            mixBlendMode: 'soft-light',
            opacity: 0.8,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '-20px', '0px'],
            y: ['0px', '-14px', '0px'],
            scale: [1, 1.02, 1]
          } : {}}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />

        {/* Additional Blue accent glow - subtle */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '25%',
            width: '450px',
            height: '280px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74, 98, 224, 0.15) 0%, rgba(74, 98, 224, 0) 70%)',
            filter: 'blur(75px)',
            mixBlendMode: 'soft-light',
            opacity: 0.7,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '15px', '0px'],
            y: ['0px', '-10px', '0px'],
            scale: [1, 1.015, 1]
          } : {}}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        {/* Gold hint glow - very subtle */}
        <motion.div
          style={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '130px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(241, 180, 52, 0.05) 0%, rgba(241, 180, 52, 0) 60%)',
            filter: 'blur(60px)',
            mixBlendMode: 'soft-light',
            willChange: prefersReducedMotion ? 'auto' : 'transform, opacity',
          }}
          animate={!prefersReducedMotion ? {
            scale: [1, 1.02, 1],
            opacity: [0.6, 0.8, 0.6]
          } : { opacity: 0.7 }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Frosted Tiles - More subtle glass effect */}
      <motion.div 
        className="fixed inset-0"
        style={{
          x: prefersReducedMotion ? 0 : mousePosition.x * 2,
          y: prefersReducedMotion ? 0 : mousePosition.y * 2,
          pointerEvents: 'none',
          zIndex: 2,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {/* Tile 1 - Top Left */}
        <motion.div
          style={{
            position: 'absolute',
            top: '8%',
            left: '8%',
            width: '120px',
            height: '120px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.10)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            mixBlendMode: 'overlay',
            opacity: 0.42,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '10px', '0px'],
            y: ['0px', '8px', '0px'],
          } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tile 2 - Top Right */}
        <motion.div
          style={{
            position: 'absolute',
            top: '18%',
            right: '12%',
            width: '160px',
            height: '160px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            mixBlendMode: 'overlay',
            opacity: 0.40,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '-10px', '0px'],
            y: ['0px', '8px', '0px'],
          } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tile 3 - Bottom Left */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '200px',
            height: '200px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.11)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            mixBlendMode: 'overlay',
            opacity: 0.43,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '10px', '0px'],
            y: ['0px', '-8px', '0px'],
          } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tile 4 - Bottom Right */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '8%',
            width: '140px',
            height: '140px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.10)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            mixBlendMode: 'overlay',
            opacity: 0.45,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '-10px', '0px'],
            y: ['0px', '-8px', '0px'],
          } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tile 5 - Middle Right */}
        <motion.div
          style={{
            position: 'absolute',
            top: '45%',
            right: '3%',
            width: '100px',
            height: '100px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            mixBlendMode: 'overlay',
            opacity: 0.44,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '-10px', '0px'],
            y: ['0px', '8px', '0px'],
          } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tile 6 - Middle Left */}
        <motion.div
          style={{
            position: 'absolute',
            top: '35%',
            left: '6%',
            width: '130px',
            height: '130px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.11)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            mixBlendMode: 'overlay',
            opacity: 0.41,
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            x: ['0px', '10px', '0px'],
            y: ['0px', '8px', '0px'],
          } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.div>

      {/* Subtle Dot Grid behind tiles */}
      <div
        className="fixed inset-0"
        style={{
          pointerEvents: 'none',
          zIndex: 1,
          backgroundImage: 'radial-gradient(circle, rgba(10, 22, 52, 0.10) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.35,
          maskImage: 'radial-gradient(ellipse at 50% 50%, transparent 25%, black 65%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, transparent 25%, black 65%)',
        }}
      />

      {/* Diagonal Paper Band - Darker tone */}
      <motion.div 
        className="fixed"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1800px',
          height: '340px',
          transform: 'translate(-50%, -50%) rotate(-8deg)',
          background: 'linear-gradient(90deg, rgba(230, 235, 255, 0.50) 0%, rgba(200, 207, 246, 0.50) 100%)',
          borderRadius: '24px',
          pointerEvents: 'none',
          zIndex: 3,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          willChange: prefersReducedMotion ? 'auto' : 'opacity',
        }}
        animate={!prefersReducedMotion ? {
          opacity: [0.48, 0.52, 0.48],
        } : { opacity: 0.5 }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo - only re-render if these change significantly
  if (prevProps.prefersReducedMotion !== nextProps.prefersReducedMotion) return false;
  // Only re-render if mouse position changes by more than 5 pixels
  const mouseDiff = Math.abs(prevProps.mousePosition.x - nextProps.mousePosition.x) + 
                    Math.abs(prevProps.mousePosition.y - nextProps.mousePosition.y);
  return mouseDiff < 5;
});

DarkerCivicNight.displayName = 'DarkerCivicNight';
