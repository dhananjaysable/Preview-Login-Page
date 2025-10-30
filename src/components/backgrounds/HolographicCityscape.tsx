import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface HolographicCityscapeProps {
  mousePosition: { x: number; y: number };
  prefersReducedMotion: boolean;
  isDarkMode: boolean;
}

export const HolographicCityscape: React.FC<HolographicCityscapeProps> = ({
  mousePosition,
  prefersReducedMotion,
  isDarkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle system for animated background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Update position
        if (!prefersReducedMotion) {
          particle.y -= particle.speedY;
          if (particle.y < 0) {
            particle.y = canvas.height;
            particle.x = Math.random() * canvas.width;
          }
        }
      });

      // Draw grid lines
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      {/* Base gradient background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #0D1117 0%, #1B2735 100%)',
          zIndex: 0,
        }}
      />

      {/* Animated canvas for particles and grid */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Flowing light streaks */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 20}%`,
              top: '-10%',
              width: '2px',
              height: '200px',
              background: 'linear-gradient(to bottom, transparent, #00FFFF, transparent)',
              opacity: 0.4,
            }}
            animate={!prefersReducedMotion ? {
              y: ['0vh', '110vh'],
              opacity: [0, 0.6, 0],
            } : {}}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Neon polygons with depth layers */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Large polygon 1 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(155, 93, 229, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          }}
          animate={!prefersReducedMotion ? {
            x: [0, 30, 0],
            y: [0, -20, 0],
          } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Large polygon 2 */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.12) 0%, transparent 70%)',
            filter: 'blur(50px)',
            transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px)`,
          }}
          animate={!prefersReducedMotion ? {
            x: [0, -40, 0],
            y: [0, 30, 0],
          } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Medium polygon 3 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '60%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(108, 99, 255, 0.1) 0%, transparent 70%)',
            filter: 'blur(35px)',
            transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 12}px)`,
          }}
          animate={!prefersReducedMotion ? {
            x: [0, 25, 0],
            y: [0, -30, 0],
          } : {}}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Radial gradient overlay for depth */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(13, 17, 23, 0.4) 100%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};
