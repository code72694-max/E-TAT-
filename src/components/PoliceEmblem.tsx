import React from 'react';

interface PoliceEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'full-color' | 'mono-gold';
}

export const PoliceEmblem: React.FC<PoliceEmblemProps> = ({
  className = '',
  size = 'md',
  variant = 'gold'
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none ${sizeClasses[size]} ${className}`}
      aria-label="Lambang Resmi e-TAT Kepolisian RI"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
      >
        <defs>
          {/* Gold Gradient */}
          <linearGradient id="policeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="30%" stopColor="#D4AF37" />
            <stop offset="70%" stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#E5C158" />
          </linearGradient>

          {/* Deep Navy Gradient */}
          <linearGradient id="policeNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="50%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#080D1A" />
          </linearGradient>

          {/* Inner Crimson Accent */}
          <linearGradient id="policeCrimsonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>
        </defs>

        {/* Outer Laurel Wreath / Ring of Honor */}
        <circle
          cx="50"
          cy="50"
          r="47"
          stroke="url(#policeGoldGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 1.5"
          opacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke="url(#policeGoldGrad)"
          strokeWidth="0.75"
          opacity="0.4"
        />

        {/* Main Police Shield Contour */}
        <path
          d="M 50 8 
             C 72 8, 86 16, 86 36 
             C 86 64, 68 84, 50 94 
             C 32 84, 14 64, 14 36 
             C 14 16, 28 8, 50 8 Z"
          fill="url(#policeNavyGrad)"
          stroke="url(#policeGoldGrad)"
          strokeWidth="2.5"
        />

        {/* Inner Shield Bezel */}
        <path
          d="M 50 13 
             C 68 13, 80 20, 80 37 
             C 80 61, 64 78, 50 88 
             C 36 78, 20 61, 20 37 
             C 20 20, 32 13, 50 13 Z"
          fill="none"
          stroke="url(#policeGoldGrad)"
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* 3 Golden Stars (Tri Brata - Polri) */}
        {/* Center Top Star */}
        <path
          d="M 50 18 L 52 23 L 57 23 L 53 26 L 54.5 31 L 50 28 L 45.5 31 L 47 26 L 43 23 L 48 23 Z"
          fill="url(#policeGoldGrad)"
        />
        {/* Left Star */}
        <path
          d="M 37 22 L 38.5 25.5 L 42 25.5 L 39 27.5 L 40 31 L 37 29 L 34 31 L 35 27.5 L 32 25.5 L 35.5 25.5 Z"
          fill="url(#policeGoldGrad)"
        />
        {/* Right Star */}
        <path
          d="M 63 22 L 64.5 25.5 L 68 25.5 L 65 27.5 L 66 31 L 63 29 L 60 31 L 61 27.5 L 58 25.5 L 61.5 25.5 Z"
          fill="url(#policeGoldGrad)"
        />

        {/* Scales of Justice (Timbangan Hukum & Medis TAT) */}
        {/* Center Vertical Pillar */}
        <line x1="50" y1="34" x2="50" y2="67" stroke="url(#policeGoldGrad)" strokeWidth="2.2" strokeLinecap="round" />
        {/* Base Pillar */}
        <path d="M 43 67 L 57 67 L 59 70 L 41 70 Z" fill="url(#policeGoldGrad)" />
        {/* Horizontal Beam */}
        <line x1="30" y1="42" x2="70" y2="42" stroke="url(#policeGoldGrad)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="42" r="3" fill="url(#policeGoldGrad)" />

        {/* Left Scale Pan */}
        <line x1="33" y1="42" x2="28" y2="52" stroke="url(#policeGoldGrad)" strokeWidth="0.9" />
        <line x1="33" y1="42" x2="38" y2="52" stroke="url(#policeGoldGrad)" strokeWidth="0.9" />
        <path d="M 26 52 Q 33 58 40 52 Z" fill="url(#policeGoldGrad)" />

        {/* Right Scale Pan */}
        <line x1="67" y1="42" x2="62" y2="52" stroke="url(#policeGoldGrad)" strokeWidth="0.9" />
        <line x1="67" y1="42" x2="72" y2="52" stroke="url(#policeGoldGrad)" strokeWidth="0.9" />
        <path d="M 60 52 Q 67 58 74 52 Z" fill="url(#policeGoldGrad)" />

        {/* Lower Banner Ribbon with Inscription */}
        <path
          d="M 24 75 L 76 75 L 71 83 L 50 86 L 29 83 Z"
          fill="url(#policeCrimsonGrad)"
          stroke="url(#policeGoldGrad)"
          strokeWidth="1.2"
        />
        <text
          x="50"
          y="81.5"
          textAnchor="middle"
          fontSize="5.2"
          fontWeight="900"
          fontFamily="sans-serif"
          letterSpacing="0.08em"
          fill="#FFF2B2"
        >
          PRESISI · E-TAT
        </text>
      </svg>
    </div>
  );
};
