import React from 'react';
import { motion } from 'motion/react';

interface HolographicCityProps {
  mousePosition: { x: number; y: number };
  prefersReducedMotion: boolean;
}

export const HolographicCity: React.FC<HolographicCityProps> = ({
  mousePosition,
  prefersReducedMotion,
}) => {
  // Generate building shapes for minimal city icon
  const buildings = [
    { x: 15, y: 65, width: 18, height: 35, delay: 0 },
    { x: 38, y: 55, width: 22, height: 45, delay: 0.15 },
    { x: 65, y: 60, width: 20, height: 40, delay: 0.3 },
    { x: 90, y: 50, width: 24, height: 50, delay: 0.45 },
    { x: 119, y: 58, width: 19, height: 42, delay: 0.6 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
        transition: 'transform 0.3s ease-out',
      }}
    >
      {/* Title with gentle glow animation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          marginBottom: '50px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Gentle glow background animation */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120%',
            height: '120%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(ellipse, rgba(0, 224, 255, 0.2) 0%, rgba(166, 131, 255, 0.15) 50%, transparent 70%)',
            filter: 'blur(30px)',
            zIndex: -1,
          }}
          animate={!prefersReducedMotion ? {
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        <h2
          style={{
            fontSize: '48px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #00E0FF 0%, #A683FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '16px',
            fontFamily: "'Poppins', 'Inter', sans-serif",
            letterSpacing: '1px',
            lineHeight: '1.2',
            position: 'relative',
            zIndex: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.45), 0 0 2px rgba(0,0,0,0.6)',
          }}
        >
          THANE CITY
        </h2>
        <p
          style={{
            fontSize: '16px',
            color: '#25323B',
            fontFamily: "'Poppins', 'Inter', sans-serif",
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontWeight: '500',
            lineHeight: '1.6',
            textShadow: '0 1px 2px rgba(0,0,0,0.35)',
          }}
        >
          Smart Municipal Portal
        </p>
        <p
          style={{
            fontSize: '14px',
            color: '#25323B',
            fontFamily: "'Poppins', 'Inter', sans-serif",
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginTop: '8px',
            fontWeight: '400',
            lineHeight: '1.6',
            textShadow: '0 1px 2px rgba(0,0,0,0.35)',
          }}
        >
          Seamless Digital Governance
        </p>
      </motion.div>

      {/* Minimal city icon - thinner, less neon */}
      <svg
        width="180"
        height="120"
        viewBox="0 0 180 120"
        style={{
          filter: 'drop-shadow(0 2px 8px rgba(0, 184, 217, 0.15))',
        }}
      >
        {/* Buildings - thinner stroke, color #00B8D9 at 70% opacity */}
        {buildings.map((building, index) => (
          <motion.g
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: building.delay }}
          >
            {/* Building outline - thinner, less neon */}
            <motion.rect
              x={building.x}
              y={building.y}
              width={building.width}
              height={building.height}
              fill="none"
              stroke="#00B8D9"
              strokeWidth="1"
              opacity="0.7"
              animate={!prefersReducedMotion ? {
                opacity: [0.6, 0.7, 0.6],
              } : {}}
              transition={{
                duration: 3 + index * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Minimal building windows */}
            {[...Array(2)].map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {[...Array(Math.floor(building.width / 7))].map((_, colIndex) => (
                  <rect
                    key={`${rowIndex}-${colIndex}`}
                    x={building.x + 4 + colIndex * 7}
                    y={building.y + 8 + rowIndex * 12}
                    width="2"
                    height="4"
                    fill="#00B8D9"
                    opacity="0.5"
                  />
                ))}
              </React.Fragment>
            ))}
          </motion.g>
        ))}

        {/* Base ground line */}
        <line
          x1="0"
          y1="100"
          x2="180"
          y2="100"
          stroke="#00B8D9"
          strokeWidth="0.8"
          opacity="0.4"
        />
      </svg>

      {/* Just 1-2 subtle ambient cyan dots for emphasis */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        <motion.div
          style={{
            position: 'absolute',
            left: '25%',
            top: '30%',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#7CD8F7',
            boxShadow: '0 0 12px rgba(124, 216, 247, 0.5)',
          }}
          animate={!prefersReducedMotion ? {
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          style={{
            position: 'absolute',
            right: '30%',
            bottom: '35%',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00B8D9',
            boxShadow: '0 0 10px rgba(0, 184, 217, 0.4)',
          }}
          animate={!prefersReducedMotion ? {
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          } : {}}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>
    </div>
  );
};
