import React from 'react';

interface StellaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  subtitleText?: string;
  onClick?: () => void;
  className?: string;
}

export const StellaLogo: React.FC<StellaLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  subtitleText = 'Astronomía & Starlight',
  onClick,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-11 h-11 sm:w-12 sm:h-12',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-5xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      id="stellaway-brand-logo"
    >
      {/* SVG Icon matching exactly stella02.PNG: 5-Point Gold Star + Orbital Ring + 4-Point Sparkle */}
      <div className={`relative shrink-0 ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-[0_2px_10px_rgba(255,215,0,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Rich Champagne Gold Metallic Gradient */}
            <linearGradient id="stellaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="35%" stopColor="#FEE685" />
              <stop offset="70%" stopColor="#E5B842" />
              <stop offset="100%" stopColor="#B38018" />
            </linearGradient>

            {/* Orbit Glow Gradient */}
            <linearGradient id="orbitGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#B38018" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#FEE685" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#FFF8D6" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
            </linearGradient>

            {/* Radial Inner Star Glow */}
            <radialGradient id="starInnerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#FEE685" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#E5B842" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Orbital Ring / Swoosh swooping from bottom-left through star to top-right */}
          <path
            d="M 16 82 C 12 66, 26 42, 60 30 C 88 20, 102 36, 104 46 C 106 56, 92 78, 64 88 C 42 96, 22 92, 16 82"
            stroke="url(#orbitGlowGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            className="opacity-95"
          />

          {/* 2. Main 5-Pointed Star (Rotated slightly with golden luxury bevel) */}
          <path
            d="M 54 18 
               L 63 42 
               L 89 44 
               L 69 60 
               L 75 86 
               L 53 71 
               L 31 86 
               L 37 60 
               L 18 44 
               L 44 42 Z"
            fill="url(#stellaGoldGrad)"
            stroke="#FFF4C2"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />

          {/* Inner Light Core on Star */}
          <circle cx="53" cy="52" r="16" fill="url(#starInnerGlow)" />

          {/* 3. Orbit Upper Crest Sparkle (4-point star at top right of the orbit swoosh) */}
          <path
            d="M 88 16 
               Q 88 23 94 23 
               Q 88 23 88 30 
               Q 88 23 82 23 
               Q 88 23 88 16 Z"
            fill="#FFFFFF"
            filter="drop-shadow(0 0 4px #FFF2B2)"
          />
          <circle cx="88" cy="23" r="1.5" fill="#FFEAA5" />
        </svg>
      </div>

      {/* Typography: "StellaWay" in High-End Luxury Serif typography matching image */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-['Cinzel','Playfair_Display',serif] ${textSizes[size]} font-bold tracking-tight bg-gradient-to-r from-[#FFF4C2] via-[#FEE685] to-[#E5B842] bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(255,215,0,0.35)] leading-none`}
        >
          StellaWay
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-['Plus_Jakarta_Sans'] font-medium text-[#FEE685]/80 tracking-wider uppercase mt-1">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
