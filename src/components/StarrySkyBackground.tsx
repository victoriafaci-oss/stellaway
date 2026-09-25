import React, { useMemo } from 'react';

interface StarrySkyBackgroundProps {
  nightVision?: boolean;
}

export const StarrySkyBackground: React.FC<StarrySkyBackgroundProps> = ({ nightVision }) => {
  // Generate random static twinkling stars once
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${(i * 1.67 + (i % 7) * 4.3) % 100}%`,
      top: `${(i * 2.3 + (i % 9) * 3.7) % 100}%`,
      size: (i % 3 === 0 ? 2.5 : i % 2 === 0 ? 1.8 : 1.2),
      opacity: 0.3 + (i % 5) * 0.14,
      delay: `${(i % 6) * 0.8}s`,
      duration: `${2.5 + (i % 4) * 1.2}s`,
      isGolden: i % 4 === 0,
      isCyan: i % 5 === 0,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none transition-colors duration-500">
      {/* Deep Space Radial Gradient Layers */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${nightVision ? 'bg-[#0B0202]' : 'bg-[#160D27]'}`}
        style={{
          backgroundImage: nightVision
            ? `
              radial-gradient(ellipse 80% 50% at 50% -15%, rgba(255, 30, 30, 0.32) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 85% 20%, rgba(200, 20, 20, 0.22) 0%, transparent 60%),
              radial-gradient(ellipse 70% 60% at 15% 75%, rgba(180, 15, 15, 0.18) 0%, transparent 70%),
              radial-gradient(circle at 50% 100%, #080101 0%, #0E0202 100%)
            `
            : `
              radial-gradient(ellipse 80% 50% at 50% -15%, rgba(124, 77, 255, 0.28) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 85% 20%, rgba(56, 189, 248, 0.15) 0%, transparent 60%),
              radial-gradient(ellipse 70% 60% at 15% 75%, rgba(246, 211, 101, 0.12) 0%, transparent 70%),
              radial-gradient(circle at 50% 100%, #0D071B 0%, #160D27 100%)
            `,
        }}
      />

      {/* Subtle Milky Way Cosmic Dust Overlay */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-screen bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: nightVision
            ? 'radial-gradient(ellipse 90% 45% at 50% 30%, rgba(255, 120, 120, 0.2) 0%, transparent 65%)'
            : 'radial-gradient(ellipse 90% 45% at 50% 30%, rgba(186, 230, 253, 0.25) 0%, transparent 65%)',
        }}
      />

      {/* Twinkling Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full pointer-events-none animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: nightVision
                ? '#FF6B6B'
                : star.isGolden
                ? '#FEE685'
                : star.isCyan
                ? '#7DD3FC'
                : '#FFFFFF',
              boxShadow: star.size > 2 
                ? nightVision
                  ? '0 0 6px rgba(255, 59, 48, 0.95)'
                  : star.isGolden 
                  ? '0 0 6px rgba(254, 230, 133, 0.9)'
                  : '0 0 6px rgba(125, 211, 252, 0.9)'
                : 'none',
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* Lluvia de Estrellas Fugaces / Shooting Stars */}
      <div className="shooting-star shooting-star-1" />
      <div className="shooting-star shooting-star-2" />
      <div className="shooting-star shooting-star-3" />
      <div className="shooting-star shooting-star-4" />
    </div>
  );
};
