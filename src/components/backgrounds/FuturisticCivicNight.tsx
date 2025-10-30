import React from 'react';
import { motion } from 'motion/react';

interface BackgroundProps {
  mousePosition: { x: number; y: number };
  prefersReducedMotion: boolean;
  isDarkMode: boolean;
}

export const FuturisticCivicNight = React.memo(({ mousePosition, prefersReducedMotion, isDarkMode }: BackgroundProps) => {
  const bgGradient = isDarkMode 
    ? 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)'
    : 'linear-gradient(135deg, #1a2332 0%, #2d4557 50%, #3f5e78 100%)';
    
  const neonCyan = 'rgba(0, 255, 255, 0.15)';
  const neonPurple = 'rgba(108, 99, 255, 0.15)';
  const neonMagenta = 'rgba(255, 0, 255, 0.12)';

  return (
    <>
      {/* Base Gradient - Deep Teal Tones */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: bgGradient,
          willChange: 'auto',
        }}
      />
      
      {/* Animated Flowing Gradient Overlay */}
      {!prefersReducedMotion && (
        <motion.div 
          className="fixed inset-0 z-0"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(0, 255, 255, 0.05) 50%, transparent 100%)',
            willChange: 'background-position',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}

      {/* Grid Pattern - Geometric */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.4,
          maskImage: 'radial-gradient(ellipse at 50% 50%, transparent 20%, black 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, transparent 20%, black 70%)',
        }}
      />

      {/* Neon Glows - Cyan */}
      <motion.div
        className="fixed"
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${neonCyan} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          mixBlendMode: 'screen',
          opacity: 0.6,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
          zIndex: 1,
        }}
        animate={!prefersReducedMotion ? {
          x: ['0px', '40px', '0px'],
          y: ['0px', '30px', '0px'],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Neon Glows - Purple */}
      <motion.div
        className="fixed"
        style={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${neonPurple} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          mixBlendMode: 'screen',
          opacity: 0.6,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
          zIndex: 1,
        }}
        animate={!prefersReducedMotion ? {
          x: ['0px', '-40px', '0px'],
          y: ['0px', '30px', '0px'],
          scale: [1, 1.1, 1]
        } : {}}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      {/* Neon Glows - Magenta */}
      <motion.div
        className="fixed"
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${neonMagenta} 0%, transparent 70%)`,
          filter: 'blur(100px)',
          mixBlendMode: 'screen',
          opacity: 0.5,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
          zIndex: 1,
        }}
        animate={!prefersReducedMotion ? {
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.7, 0.5]
        } : {}}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Floating Geometric Shapes with Mouse Parallax */}
      <motion.div 
        className="fixed inset-0"
        style={{
          x: prefersReducedMotion ? 0 : mousePosition.x * 3,
          y: prefersReducedMotion ? 0 : mousePosition.y * 3,
          pointerEvents: 'none',
          zIndex: 2,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20 }}
      >
        {/* Hexagon 1 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '12%',
            left: '10%',
            width: '120px',
            height: '120px',
            background: 'rgba(0, 255, 255, 0.08)',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            rotate: [0, 360],
            y: ['0px', '20px', '0px'],
          } : {}}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Triangle 1 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '25%',
            right: '12%',
            width: '100px',
            height: '100px',
            background: 'rgba(108, 99, 255, 0.08)',
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            border: '1px solid rgba(108, 99, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            rotate: [0, -360],
            x: ['0px', '-15px', '0px'],
          } : {}}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            x: { duration: 10, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Circle 1 */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '18%',
            left: '8%',
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            background: 'rgba(255, 0, 255, 0.06)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            scale: [1, 1.1, 1],
            y: ['0px', '-20px', '0px'],
          } : {}}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Diamond 1 */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '10%',
            width: '90px',
            height: '90px',
            background: 'rgba(0, 255, 255, 0.08)',
            transform: 'rotate(45deg)',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            rotate: [45, 405],
            scale: [1, 1.05, 1],
          } : { rotate: 45 }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Pentagon */}
        <motion.div
          style={{
            position: 'absolute',
            top: '55%',
            left: '5%',
            width: '110px',
            height: '110px',
            background: 'rgba(108, 99, 255, 0.07)',
            clipPath: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
            border: '1px solid rgba(108, 99, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            rotate: [0, 360],
            x: ['0px', '15px', '0px'],
          } : {}}
          transition={{
            rotate: { duration: 28, repeat: Infinity, ease: "linear" },
            x: { duration: 9, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Small Hexagon 2 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '40%',
            right: '5%',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 0, 255, 0.08)',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
            border: '1px solid rgba(255, 0, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            willChange: prefersReducedMotion ? 'auto' : 'transform',
          }}
          animate={!prefersReducedMotion ? {
            rotate: [0, -360],
            y: ['0px', '15px', '0px'],
          } : {}}
          transition={{
            rotate: { duration: 22, repeat: Infinity, ease: "linear" },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </motion.div>

      {/* Scanline Effect - Subtle */}
      {!prefersReducedMotion && (
        <motion.div
          className="fixed inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 255, 0.02) 2px, rgba(0, 255, 255, 0.02) 4px)',
            pointerEvents: 'none',
            zIndex: 3,
            opacity: 0.3,
          }}
          animate={{
            y: ['0%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      )}

      {/* Vignette - Edge Darkening */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />
    </>
  );
}, (prevProps, nextProps) => {
  if (prevProps.prefersReducedMotion !== nextProps.prefersReducedMotion) return false;
  if (prevProps.isDarkMode !== nextProps.isDarkMode) return false;
  const mouseDiff = Math.abs(prevProps.mousePosition.x - nextProps.mousePosition.x) + 
                    Math.abs(prevProps.mousePosition.y - nextProps.mousePosition.y);
  return mouseDiff < 5;
});

FuturisticCivicNight.displayName = 'FuturisticCivicNight';
