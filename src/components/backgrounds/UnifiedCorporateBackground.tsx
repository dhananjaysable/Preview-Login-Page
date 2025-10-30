import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface UnifiedCorporateBackgroundProps {
  mousePosition: { x: number; y: number };
  prefersReducedMotion: boolean;
}

export const UnifiedCorporateBackground: React.FC<UnifiedCorporateBackgroundProps> = ({
  mousePosition,
  prefersReducedMotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated particles and grid for subtle depth
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

    // Minimal particles configuration
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }> = [];

    // Create minimal glowing particles
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.2 + 0.3,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.15 + 0.05, // Very subtle
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid lines (15% opacity, color #7CD8F7)
      ctx.strokeStyle = 'rgba(124, 216, 247, 0.15)';
      ctx.lineWidth = 0.5;

      // Vertical lines
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

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 216, 247, ${particle.opacity})`;
        ctx.fill();

        // Subtle glow effect
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2.5
        );
        gradient.addColorStop(0, `rgba(124, 216, 247, ${particle.opacity * 0.3})`);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2);
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
  }, [prefersReducedMotion]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      {/* Unified gradient background - smooth flow from dark to light */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at top left, #132B3E 0%, transparent 50%),
            radial-gradient(ellipse at center, #DDE9F0 20%, transparent 70%),
            radial-gradient(ellipse at bottom right, #F7FAFC 30%, transparent 80%),
            linear-gradient(135deg, #132B3E 0%, #DDE9F0 50%, #F7FAFC 100%)
          `,
        }}
      />

      {/* Animated canvas for grid and particles */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Ambient cyan glow on left - very subtle */}
      <motion.div
        style={{
          position: 'absolute',
          top: '25%',
          left: '15%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(124, 216, 247, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
        }}
        animate={!prefersReducedMotion ? {
          x: [0, 20, 0],
          y: [0, -15, 0],
          scale: [1, 1.15, 1],
        } : {}}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Very subtle accent glow near center */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 184, 217, 0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
          transform: 'translate(-50%, -50%)',
        }}
        animate={!prefersReducedMotion ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle vignette overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(19, 43, 62, 0.12) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
