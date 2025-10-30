import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface EnhancedSmartCityBackgroundProps {
  mousePosition: { x: number; y: number };
  prefersReducedMotion: boolean;
}

// Helper function to convert hex color to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const EnhancedSmartCityBackground: React.FC<EnhancedSmartCityBackgroundProps> = ({
  mousePosition,
  prefersReducedMotion,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated particles and geometric lines
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

    // Smart city particles configuration
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;
    }> = [];

    // Create subtle glowing particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.2 + 0.1,
        color: i % 3 === 0 ? '#00B8D9' : i % 3 === 1 ? '#26C6DA' : '#7CD8F7',
      });
    }

    // Geometric lines
    const lines: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      opacity: number;
      speed: number;
    }> = [];

    for (let i = 0; i < 8; i++) {
      lines.push({
        x1: Math.random() * canvas.width,
        y1: Math.random() * canvas.height,
        x2: Math.random() * canvas.width,
        y2: Math.random() * canvas.height,
        opacity: Math.random() * 0.15 + 0.05,
        speed: (Math.random() - 0.5) * 0.2,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid pattern
      ctx.strokeStyle = 'rgba(0, 184, 217, 0.08)';
      ctx.lineWidth = 0.5;

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 120) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Update and draw geometric lines
      lines.forEach((line) => {
        if (!prefersReducedMotion) {
          line.y1 += line.speed;
          line.y2 += line.speed;

          if (line.y1 > canvas.height) line.y1 = 0;
          if (line.y2 > canvas.height) line.y2 = 0;
          if (line.y1 < 0) line.y1 = canvas.height;
          if (line.y2 < 0) line.y2 = canvas.height;
        }

        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = `rgba(0, 184, 217, ${line.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

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
        ctx.fillStyle = hexToRgba(particle.color, particle.opacity);
        ctx.fill();

        // Subtle glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 3
        );
        gradient.addColorStop(0, hexToRgba(particle.color, particle.opacity * 0.4));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
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
      {/* Soft gradient background - light teal → sky blue → white */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at top left, #E0F7FA 0%, transparent 60%),
            radial-gradient(ellipse at center, #B2EBF2 10%, transparent 70%),
            radial-gradient(ellipse at bottom right, #FFFFFF 20%, transparent 80%),
            linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 40%, #E3F2FD 70%, #FFFFFF 100%)
          `,
        }}
      />

      {/* Animated canvas for particles and geometric lines */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle ambient glow on left - interactive with mouse */}
      <motion.div
        style={{
          position: 'absolute',
          top: '30%',
          left: '15%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 184, 217, 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
        }}
        animate={!prefersReducedMotion ? {
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        } : {}}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Accent glow - violet tint */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '20%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(166, 131, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        animate={!prefersReducedMotion ? {
          scale: [1, 1.15, 1],
          opacity: [0.5, 0.8, 0.5],
        } : {}}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Light vignette for depth */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(224, 247, 250, 0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
