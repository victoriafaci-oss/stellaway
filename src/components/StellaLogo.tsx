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
    md: 'w-8 h-8 sm:w-9 sm:h-9',
    lg: 'w-11 h-11 sm:w-13 sm:h-13',
    xl: 'w-14 h-14 sm:w-18 sm:h-18',
  };

  const textSizes = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-5xl',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      id="stellaway-brand-logo"
    >
      {/* SVG Icon exactly replicating stella02.PNG: Luminous Solid Metallic Gold Star + Open Orbital Ring + 4-Point Sparkle */}
      <div className={`relative shrink-0 ${iconSizes[size]} transition-transform duration-300 group-hover:scale-105`}>
        <svg
          viewBox="0 0 100 90"
          className="w-full h-full overflow-visible drop-shadow-[0_0_12px_rgba(240,222,170,0.55)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ambient Warm Golden Core Halo */}
          <circle cx="44" cy="46" r="26" fill="#F0DEAA" fillOpacity="0.25" />

          {/* 1. Main 5-Point Star Body (Solid uniform champagne metallic gold) */}
          <path
            d="M 44 16
               L 52 34
               L 72 35
               L 56.5 48
               L 62 69
               L 44 57.5
               L 26 69
               L 31.5 48
               L 16 35
               L 36 34 Z"
            fill="#F0DEAA"
            stroke="#FFFDF2"
            strokeWidth="0.75"
            strokeLinejoin="round"
          />

          {/* 2. Sweeping Orbital Ring / Swoosh (Wraps from lower-left to top-right) */}
          <path
            d="M 12 66 
               C 9 53, 21 35, 45 28
               C 64 22, 80 27, 84 38
               C 88 49, 79 66, 55 73
               C 34 79, 16 75, 12 66"
            stroke="#F0DEAA"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* 3. Four-Point Diamond Sparkle Star at Top-Right of the Orbit Ring */}
          <path
            d="M 73 9
               Q 73 15.5 78 15.5
               Q 73 15.5 73 22
               Q 73 15.5 68 15.5
               Q 73 15.5 73 9 Z"
            fill="#FFFDF2"
          />
          <circle cx="73" cy="15.5" r="1.2" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography: "StellaWay" in High-End Luxury Serif typography with Uniform Metallic Gold Color */}
      <div className="flex flex-col justify-center">
        <span
          className={`font-['Playfair_Display','Cinzel',serif] ${textSizes[size]} font-bold tracking-tight leading-none text-[#F0DEAA]`}
          style={{
            color: '#F0DEAA',
            textShadow: '0 0 14px rgba(240, 222, 170, 0.45), 0 1px 2px rgba(0, 0, 0, 0.6)',
            letterSpacing: '-0.015em',
          }}
        >
          StellaWay
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-[11px] font-['Plus_Jakarta_Sans'] font-semibold text-[#F0DEAA]/85 tracking-wider uppercase mt-1">
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};

