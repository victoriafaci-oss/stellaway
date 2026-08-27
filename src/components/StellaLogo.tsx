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
  subtitleText = 'Astroturismo',
  onClick,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const textSizes = {
    sm: 'text-lg sm:text-xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-3xl sm:text-4xl',
    xl: 'text-4xl sm:text-6xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      id="stellaway-brand-logo"
    >
      {/* SVG Icon exactly replicating stella02.PNG: Luminous 5-Point Gold Star + Open Orbital Swoosh + 4-Point Sparkle */}
      <div className={`relative shrink-0 ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible drop-shadow-[0_0_14px_rgba(238,198,90,0.65)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Radiant Champagne & True Gold Metallic Gradient (Bright, luminous, no dirty brown/yellow) */}
            <linearGradient id="stellaGoldGrad" x1="15%" y1="0%" x2="85%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF2" />
              <stop offset="20%" stopColor="#FFF3B0" />
              <stop offset="55%" stopColor="#EBC35B" />
              <stop offset="85%" stopColor="#D4A028" />
              <stop offset="100%" stopColor="#B88218" />
            </linearGradient>

            {/* Glowing Orbit Arc Gradient */}
            <linearGradient id="stellaOrbitArc" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C99420" stopOpacity="0.3" />
              <stop offset="35%" stopColor="#EBC35B" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#FFF4BC" stopOpacity="1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            {/* Soft Ambient Core Halo */}
            <radialGradient id="stellaBackGlow" cx="46%" cy="46%" r="50%">
              <stop offset="0%" stopColor="#FFECA0" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#E8BE50" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D4A028" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 0. Ambient Warm Halo Behind Star */}
          <circle cx="45" cy="48" r="32" fill="url(#stellaBackGlow)" />

          {/* 1. Main 5-Point Star Body (Solid, luminous gold) */}
          <path
            d="M 44 14
               L 52.8 33.5
               L 74.2 35.2
               L 57.8 49.3
               L 62.8 70.4
               L 44 58.6
               L 25.2 70.4
               L 30.2 49.3
               L 13.8 35.2
               L 35.2 33.5 Z"
            fill="url(#stellaGoldGrad)"
            stroke="#FFFCE6"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />

          {/* 2. Open Orbital Swoosh Arc (Replicating the sweeping ring in stella02.PNG) */}
          {/* Back segment of the swoosh */}
          <path
            d="M 12 70 
               C 10 58, 22 40, 44 32
               C 62 25, 78 30, 83 40
               C 87 50, 78 68, 54 75
               C 34 81, 16 78, 12 70"
            stroke="url(#stellaOrbitArc)"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* 3. Four-point diamond sparkle at the top-right apex of the swoosh */}
          <path
            d="M 72 17
               Q 72 23.5 78 23.5
               Q 72 23.5 72 30
               Q 72 23.5 66 23.5
               Q 72 23.5 72 17 Z"
            fill="#FFFFFF"
            filter="drop-shadow(0 0 4px #FFF3B0)"
          />
          <circle cx="72" cy="23.5" r="1.3" fill="#FFFCE6" />
        </svg>
      </div>

      {/* Typography: "StellaWay" in High-End Luxury Serif typography matching image */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-['Playfair_Display','Cinzel',serif] ${textSizes[size]} font-bold tracking-tight leading-none`}
          style={{
            background: 'linear-gradient(135deg, #FFFDF5 0%, #FFF3B0 25%, #EBC35B 65%, #CCA028 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 8px rgba(235, 195, 91, 0.4))',
            letterSpacing: '-0.015em',
          }}
        >
          StellaWay
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#FFF3B0]/90 tracking-wider uppercase mt-1">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
