import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface ProfessionalGovBackgroundProps {
  mousePosition: { x: number; y: number };
  prefersReducedMotion: boolean;
  isDarkMode: boolean;
}

export const ProfessionalGovBackground: React.FC<ProfessionalGovBackgroundProps> = ({
  mousePosition,
  prefersReducedMotion,
  isDarkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Toned-down particle and grid system for professional appearance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    // Particles configuration - fewer and subtler
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
    }> = [];

    // Create subtle floating particles (fewer than before)
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.25 + 0.15, // Much more subtle
        hue: Math.random() > 0.5 ? 184 : 45, // Cyan or amber
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid lines
      ctx.strokeStyle = isDarkMode ? 'rgba(0, 184, 217, 0.05)' : 'rgba(30, 136, 229, 0.06)';
      ctx.lineWidth = 0.5;

      // Vertical lines - wider spacing for cleaner look
      for (let x = 0; x < canvas.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw particles
      particles.forEach((particle) => {
        if (!prefersReducedMotion) {
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
        }

        // Draw particle - very subtle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.hue === 184
          ? `rgba(0, 184, 217, ${particle.opacity})`
          : `rgba(255, 209, 102, ${particle.opacity})`;
        ctx.fill();

        // Minimal glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2
        );
        gradient.addColorStop(0, particle.hue === 184
          ? `rgba(0, 184, 217, ${particle.opacity * 0.3})`
          : `rgba(255, 209, 102, ${particle.opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [prefersReducedMotion, isDarkMode]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      {/* Base professional gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isDarkMode
            ? 'linear-gradient(135deg, #0C1C2B 0%, #152A3D 50%, #0C1C2B 100%)'
            : 'linear-gradient(135deg, #E8F4F8 0%, #D4E6F1 50%, #E8F4F8 100%)',
        }}
      />

      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle geometric accents - toned down */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {/* Geometric accent 1 */}
        <motion.div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '250px',
            height: '250px',
            transform: `translate(${mousePosition.x * 8}px, ${mousePosition.y * 8}px)`,
          }}
          animate={!prefersReducedMotion ? {
            rotate: [0, 360],
          } : {}}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', opacity: 0.06 }}>
            <polygon
              points="50,5 85,25 85,75 50,95 15,75 15,25"
              fill="none"
              stroke={isDarkMode ? '#00B8D9' : '#1E88E5'}
              strokeWidth="0.3"
            />
          </svg>
        </motion.div>

        {/* Geometric accent 2 */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '300px',
            height: '300px',
            transform: `translate(${mousePosition.x * -6}px, ${mousePosition.y * -6}px)`,
          }}
          animate={!prefersReducedMotion ? {
            rotate: [360, 0],
          } : {}}
          transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', opacity: 0.05 }}>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isDarkMode ? '#FFD166' : '#00B8D9'}
              strokeWidth="0.3"
            />
          </svg>
        </motion.div>
      </div>

      {/* Subtle glowing orbs - very toned down for professional feel */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <motion.div
          style={{
            position: 'absolute',
            top: '25%',
            left: '15%',
            width: '300px',
            height: '300px',
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(0, 184, 217, 0.08) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(30, 136, 229, 0.08) 0%, transparent 65%)',
            filter: 'blur(50px)',
            transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 12}px)`,
          }}
          animate={!prefersReducedMotion ? {
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.15, 1],
          } : {}}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '20%',
            width: '350px',
            height: '350px',
            background: isDarkMode
              ? 'radial-gradient(circle, rgba(255, 209, 102, 0.06) 0%, transparent 65%)'
              : 'radial-gradient(circle, rgba(0, 184, 217, 0.06) 0%, transparent 65%)',
            filter: 'blur(55px)',
            transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
          }}
          animate={!prefersReducedMotion ? {
            x: [0, -25, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Subtle vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
