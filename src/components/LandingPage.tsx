import React, { useState, useEffect, useRef } from 'react';
import { StellaLogo } from './StellaLogo';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../data/translations';

interface LandingPageProps {
  onEnterApp: () => void;
  nightVision?: boolean;
  setNightVision?: React.Dispatch<React.SetStateAction<boolean>>;
}

// ---- Countdown to Eclipse Aug 2, 2027 ----
const ECLIPSE_DATE = new Date('2027-08-02T10:45:00Z');

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = ECLIPSE_DATE.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ---- Twinkling Stars & Shooting Stars (Meteors) canvas ----
function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    type Star = { x: number; y: number; r: number; alpha: number; delta: number; speed: number; isGold: boolean; isCyan: boolean };
    const stars: Star[] = Array.from({ length: 220 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.8 + 0.2,
      delta: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      speed: Math.random() * 0.3 + 0.05,
      isGold: i % 5 === 0,
      isCyan: i % 7 === 0,
    }));

    // Dynamic shooting stars (meteors) with trail, glow & realistic physics
    type ShootingStar = {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number; // radians
      opacity: number;
      maxOpacity: number;
      fadeRate: number;
      color: string;
      trailWidth: number;
      active: boolean;
      delay: number;
    };

    const createShootingStar = (initialDelay = 0): ShootingStar => {
      // Spawn mostly from top-right and upper half
      const angle = (Math.random() * 15 + 30) * (Math.PI / 180); // 30° to 45° angle downwards to the left
      const colors = [
        'rgba(255, 255, 255, ',
        'rgba(254, 230, 133, ', // Starlight Gold
        'rgba(125, 211, 252, ', // Starlight Cyan
        'rgba(255, 215, 0, ',   // Pure Gold
      ];
      return {
        x: Math.random() * (width * 0.9) + width * 0.2,
        y: Math.random() * (height * 0.6) - 50,
        length: Math.random() * 160 + 120, // 120px to 280px trail
        speed: Math.random() * 10 + 12,    // Fast and dynamic
        angle,
        opacity: 0,
        maxOpacity: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
        fadeRate: Math.random() * 0.012 + 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
        trailWidth: Math.random() * 1.5 + 1.8,
        active: initialDelay === 0,
        delay: initialDelay,
      };
    };

    // Keep 3 to 4 active or cycling shooting stars
    const shootingStars: ShootingStar[] = [
      createShootingStar(20),
      createShootingStar(120),
      createShootingStar(240),
      createShootingStar(360),
    ];

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw twinkling background stars
      stars.forEach((s) => {
        s.alpha += s.delta;
        if (s.alpha <= 0.1 || s.alpha >= 1) s.delta *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

        if (s.isGold) {
          ctx.fillStyle = `rgba(254, 230, 133, ${s.alpha})`;
          if (s.r > 1.4) {
            ctx.shadowColor = 'rgba(254, 230, 133, 0.7)';
            ctx.shadowBlur = 4;
          }
        } else if (s.isCyan) {
          ctx.fillStyle = `rgba(125, 211, 252, ${s.alpha})`;
          if (s.r > 1.4) {
            ctx.shadowColor = 'rgba(125, 211, 252, 0.7)';
            ctx.shadowBlur = 4;
          }
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
      });

      // Reset shadow blur before drawing meteors
      ctx.shadowBlur = 0;

      // 2. Draw shooting stars with brilliant luminous trails & heads
      shootingStars.forEach((star) => {
        if (!star.active) {
          star.delay -= 1;
          if (star.delay <= 0) {
            star.active = true;
          }
          return;
        }

        // Advance position
        const dx = Math.cos(star.angle) * star.speed;
        const dy = Math.sin(star.angle) * star.speed;
        star.x -= dx; // move leftwards
        star.y += dy; // move downwards

        // Fade in then fade out
        if (star.opacity < star.maxOpacity) {
          star.opacity = Math.min(star.maxOpacity, star.opacity + 0.08);
        } else {
          star.maxOpacity -= star.fadeRate;
          star.opacity = Math.max(0, star.maxOpacity);
        }

        // Draw meteor trail
        const tailX = star.x + Math.cos(star.angle) * star.length;
        const tailY = star.y - Math.sin(star.angle) * star.length;

        const grad = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
        grad.addColorStop(0, `${star.color}0)`);
        grad.addColorStop(0.6, `${star.color}${star.opacity * 0.3})`);
        grad.addColorStop(0.9, `${star.color}${star.opacity * 0.85})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${star.opacity})`);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(star.x, star.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = star.trailWidth;
        ctx.lineCap = 'round';
        ctx.shadowColor = star.color === 'rgba(254, 230, 133, ' ? '#FEE685' : '#7DD3FC';
        ctx.shadowBlur = 8;
        ctx.stroke();

        // Meteor Head (spark/glow)
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.trailWidth * 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        // Respawn when off screen or fully faded
        if (star.opacity <= 0 || star.x < -100 || star.y > height + 100) {
          const nextDelay = Math.floor(Math.random() * 140) + 40; // 0.6s to 3s gap
          Object.assign(star, createShootingStar(nextDelay));
        }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// Static arrays have been moved inside LandingPage component to support full reactive multi-language i18n translations.

// ---- Countdown Cell component ----
function CountCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="relative flex items-center justify-center rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255,215,0,0.18) 0%, rgba(255,165,0,0.1) 100%)',
          border: '1.5px solid rgba(255,215,0,0.35)',
          boxShadow: '0 0 20px rgba(255,215,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          width: 72,
          height: 72,
        }}
      >
        <span
          className="font-luxury text-3xl font-bold tabular-nums"
          style={{ color: '#FFD700', textShadow: '0 0 15px rgba(255,215,0,0.7)' }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="mt-2 text-xs uppercase tracking-widest text-white/50">{label}</span>
    </div>
  );
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  nightVision: propNightVision,
  setNightVision: propSetNightVision,
}) => {
  const countdown = useCountdown();
  const { language, setLanguage, languageOptions, t } = useLanguage();
  const [internalNightVision, setInternalNightVision] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Use props if provided, otherwise fallback to local state
  const isNightVision = propNightVision !== undefined ? propNightVision : internalNightVision;
  const toggleNightVision = () => {
    if (propSetNightVision) {
      propSetNightVision((prev) => !prev);
    } else {
      setInternalNightVision((prev) => !prev);
    }
  };

  const currentLang = languageOptions.find((l) => l.code === language) || languageOptions[0];

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langDropdownOpen]);

  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [selectedCertifiedCat, setSelectedCertifiedCat] = useState<string>('all');
  const [legalModal, setLegalModal] = useState<'terminos' | 'privacidad' | null>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-observe]');
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  // Dynamic translated features
  const features = [
    {
      icon: '🔴',
      title: t('landingFeature1Title', 'Modo Luz Roja (Visión Nocturna)'),
      desc: t('landingFeature1Desc', 'Preserva la adaptación retiniana a la oscuridad absoluta bajo cielos Bortle 1-4. Consulta mapas estelares y telescopios sin cegarte ni deslumbrar a otros observadores.'),
      color: 'from-rose-500/20 to-red-600/20',
      border: 'border-rose-400/30',
      glow: 'shadow-rose-500/20',
    },
    {
      icon: '🌑',
      title: t('landingFeature2Title', 'Mapas Bortle Interactivos'),
      desc: t('landingFeature2Desc', 'Descubre los mejores lugares de cielo oscuro en el Arco Mediterráneo con mapas de contaminación lumínica en tiempo real.'),
      color: 'from-indigo-500/20 to-purple-600/20',
      border: 'border-indigo-400/30',
      glow: 'shadow-indigo-500/20',
    },
    {
      icon: '🔭',
      title: t('landingFeature3Title', 'Eclipse Solar 2027'),
      desc: t('landingFeature3Desc', 'Seguimiento en tiempo real del Gran Eclipse Total del 2 de agosto de 2027 en España. Rutas, campamentos y alertas.'),
      color: 'from-amber-500/20 to-orange-600/20',
      border: 'border-amber-400/30',
      glow: 'shadow-amber-500/20',
    },
    {
      icon: '✨',
      title: t('landingFeature4Title', 'Asistente IA Stella'),
      desc: t('landingFeature4Desc', 'Tu guía de astronomía personal con inteligencia artificial. Preguntas sobre telescopios, astrofotografía y efemérides.'),
      color: 'from-cyan-500/20 to-sky-600/20',
      border: 'border-cyan-400/30',
      glow: 'shadow-cyan-500/20',
    },
    {
      icon: '🌤️',
      title: t('landingFeature5Title', 'Clima Astronómico'),
      desc: t('landingFeature5Desc', 'Condiciones de seeing, transparencia, índice de Bortle local y fases lunares integradas para planificar tus sesiones.'),
      color: 'from-emerald-500/20 to-teal-600/20',
      border: 'border-emerald-400/30',
      glow: 'shadow-emerald-500/20',
    },
  ];

  // Dynamic translated certified sky categories
  const certifiedSkyCategories = [
    {
      id: 'starlight',
      badge: t('landingCatStarlightBadge', 'Fundación Starlight'),
      title: t('landingCatStarlightTitle', 'Certificaciones Starlight'),
      org: t('landingCatStarlightOrg', 'Avalado por la Fundación Starlight / UNESCO'),
      icon: '✨',
      color: 'from-amber-500/20 via-yellow-500/15 to-orange-500/20',
      border: 'border-amber-400/40',
      glow: 'rgba(245, 158, 11, 0.25)',
      tagColor: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
      desc: t('landingCatStarlightDesc', 'Espacios reconocidos internacionalmente por su compromiso inquebrantable con la preservación del cielo oscuro y el desarrollo del astroturismo sostenible.'),
      highlights: [
        t('landingCatStarlightH1', 'Reservas Starlight (máxima pureza y nula contaminación lumínica)'),
        t('landingCatStarlightH2', 'Destinos Turísticos Starlight (infraestructura para la divulgación)'),
        t('landingCatStarlightH3', 'Pueblos Starlight, Alojamientos y Senderos Celestiales catalogados'),
        t('landingCatStarlightH4', 'Auditorías científicas continuas de calidad del cielo y seeing'),
      ],
      spotsLabel: t('landingCatStarlightSpotsLabel', 'Lugares emblemáticos:'),
      sampleSpots: 'Gúdar-Javalambre, Culla, Aras de los Olmos, Serranía de Cuenca, Sierra Morena, La Palma',
    },
    {
      id: 'darksky',
      badge: t('landingCatDarkskyBadge', 'DarkSky International'),
      title: t('landingCatDarkskyTitle', 'DarkSky International (IDA)'),
      org: t('landingCatDarkskyOrg', 'Oficialmente reconocidos por DarkSky International'),
      icon: '🌌',
      color: 'from-cyan-500/20 via-sky-500/15 to-blue-600/20',
      border: 'border-cyan-400/40',
      glow: 'rgba(56, 189, 248, 0.25)',
      tagColor: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30',
      desc: t('landingCatDarkskyDesc', 'Lugares protegidos bajo los rigurosos estándares globales de DarkSky International (anteriormente IDA), líderes mundiales en la lucha contra la contaminación lumínica.'),
      highlights: [
        t('landingCatDarkskyH1', 'Parques Internacionales de Cielo Oscuro (Dark Sky Parks)'),
        t('landingCatDarkskyH2', 'Reservas y Santuarios de Cielo Oscuro de valor excepcional'),
        t('landingCatDarkskyH3', 'Comunidades Dark Sky ejemplares en ordenanzas de iluminación'),
        t('landingCatDarkskyH4', 'Protección de la biodiversidad nocturna y observación astronómica'),
      ],
      spotsLabel: t('landingCatDarkskySpotsLabel', 'Red de protección:'),
      sampleSpots: 'Aiguamolls, Parques Nacionales protegidos, Reservas transfronterizas y Red Dark Sky global',
    },
    {
      id: 'astroturismo',
      badge: t('landingCatAstroBadge', 'Recomendado / Observatorios'),
      title: t('landingCatAstroTitle', 'Astrofotografía & Astroturismo'),
      org: t('landingCatAstroOrg', 'Seleccionados por Observatorios & Organismos Turísticos'),
      icon: '📸',
      color: 'from-purple-500/20 via-violet-500/15 to-pink-500/20',
      border: 'border-purple-400/40',
      glow: 'rgba(168, 85, 247, 0.25)',
      tagColor: 'bg-purple-400/15 text-purple-300 border-purple-400/30',
      desc: t('landingCatAstroDesc', 'Miradores astronómicos, enclaves emblemáticos y puntos clave seleccionados por sus excepcionales condiciones atmosféricas y valor paisajístico nocturno.'),
      highlights: [
        t('landingCatAstroH1', 'Horizontes despejados óptimos para encuadres de la Vía Láctea'),
        t('landingCatAstroH2', 'Acceso vial seguro para transporte de telescopios y monturas'),
        t('landingCatAstroH3', 'Cielos Bortle 1 a 3 validados por la comunidad astrofotográfica'),
        t('landingCatAstroH4', 'Puntos estratégicos para el seguimiento del Eclipse 2026 / 2027'),
      ],
      spotsLabel: t('landingCatAstroSpotsLabel', 'Miradores clave:'),
      sampleSpots: 'Penyagolosa, Ares del Maestrat, Calar Alto, Roque de los Muchachos, Miradores del Teide',
    },
  ];

  // Dynamic translated testimonials
  const testimonials = [
    {
      name: 'Carmen R.',
      role: t('landingTestimonial1Role', 'Astrofotógrafa · Castellón'),
      text: t('landingTestimonial1Text', 'StellaWay me ayudó a encontrar el lugar perfecto para fotografiar la Vía Láctea. Los mapas Bortle son increíblemente precisos.'),
      avatar: '🌟',
    },
    {
      name: 'Miguel T.',
      role: t('landingTestimonial2Role', 'Aficionado · Valencia'),
      text: t('landingTestimonial2Text', 'Llevo años buscando una app que uniera clima, mapas y el Eclipse 2027. ¡Por fin existe! Stella IA me resolvió todas mis dudas.'),
      avatar: '🔭',
    },
    {
      name: 'Laura M.',
      role: t('landingTestimonial3Role', 'Guía Astroturismo · Teruel'),
      text: t('landingTestimonial3Text', 'Imprescindible para organizar mis salidas. Ahora puedo elegir el mejor sitio para ver el eclipse de 2027 con la previsión del tiempo.'),
      avatar: '🌙',
    },
  ];

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-500 ${
        isNightVision ? 'night-vision-mode bg-[#0b0202] text-[#FFA3A3]' : 'text-white'
      }`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* 🔴 True Astronomical Red Light Layer: transforms entire Landing page to monochromatic red */}
      {isNightVision && (
        <>
          <div
            id="landing-night-vision-color-overlay"
            className="astronomical-red-overlay-color"
          />
          <div
            id="landing-night-vision-dark-overlay"
            className="astronomical-red-overlay-dark"
          />
        </>
      )}

      {/* Dynamic star & meteor background */}
      <StarsCanvas />

      {/* CSS Shooting Star Streaks for enhanced depth & glowing motion */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden select-none" style={{ zIndex: 2 }}>
        <div className="shooting-star shooting-star-1" />
        <div className="shooting-star shooting-star-2" />
        <div className="shooting-star shooting-star-3" />
        <div className="shooting-star shooting-star-4" />
      </div>

      {/* Nebula gradient overlays */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-500"
        style={{
          background: isNightVision
            ? 'radial-gradient(ellipse at 20% 10%, rgba(255,40,40,0.3) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(180,10,10,0.25) 0%, transparent 55%)'
            : 'radial-gradient(ellipse at 20% 10%, rgba(124,77,255,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(255,140,0,0.12) 0%, transparent 55%)',
          zIndex: 0,
        }}
      />

      {/* ═══════════════════ NAV ═══════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 sm:px-6 py-3 sm:py-3.5 transition-colors duration-300"
        style={{
          background: isNightVision ? 'rgba(28, 4, 4, 0.95)' : 'rgba(14, 8, 30, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: isNightVision ? '1px solid rgba(255,59,48,0.4)' : '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <StellaLogo size="sm" />
        </div>

        {/* Center: Nav anchor links (hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex items-center gap-7 text-xs sm:text-sm text-white/70">
          <a href="#features" className="hover:text-amber-300 transition-colors font-medium">{t('landingNavFeatures', 'Funciones')}</a>
          <a href="#cielos-certificados" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            {t('landingNavCertified', 'Cielos Certificados')}
          </a>
          <a href="#eclipse" className="hover:text-amber-300 transition-colors font-medium">{t('landingNavEclipse', 'Eclipse 2027')}</a>
          <a href="#testimonios" className="hover:text-amber-300 transition-colors font-medium">{t('landingNavCommunity', 'Comunidad')}</a>
        </div>

        {/* Right: Functional controls - Night Vision Button + Language Selector + App CTA */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Botón Luz Roja (Night Vision) - Con forma e icono de sol (clear_day) como en TopBar */}
          <button
            type="button"
            onClick={toggleNightVision}
            id="landing-night-vision-btn"
            title={isNightVision ? t('landingNightVisionOff', 'Desactivar Modo Visión Nocturna') : t('landingNightVisionOn', 'Activar Modo Luz Roja')}
            className={`w-7 sm:w-8 h-7 sm:h-8 rounded-lg border transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm shrink-0 ${
              isNightVision
                ? 'bg-[#FF3B30] border-white text-white shadow-[0_0_14px_rgba(255,59,48,0.9)] animate-pulse'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white/90 hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-sm sm:text-base ${isNightVision ? 'text-white' : 'text-amber-300'}`}>
              clear_day
            </span>
          </button>

          {/* Acceso a Idiomas (Selector desplegable con banderas) */}
          <div className="relative shrink-0" ref={langDropdownRef}>
            <button
              type="button"
              id="landing-language-selector-btn"
              onClick={() => setLangDropdownOpen((prev) => !prev)}
              title={t('landingSelectLang', 'Seleccionar Idioma')}
              className="h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 hover:border-amber-400/50 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95 shrink-0"
            >
              <span className="text-sm leading-none">{currentLang.flag}</span>
              <span className="font-extrabold uppercase tracking-wider text-[10px] text-amber-200">
                {currentLang.code}
              </span>
              <span className="material-symbols-outlined text-[11px] text-white/60 transition-transform duration-200" style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'none' }}>
                expand_more
              </span>
            </button>

            {/* Menu Dropdown de Idiomas */}
            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-2xl p-2 z-[100] shadow-2xl border border-white/20 animate-fadeIn"
                style={{
                  background: 'rgba(19, 11, 34, 0.98)',
                  backdropFilter: 'blur(25px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(254,230,133,0.2)',
                }}
              >
                <div className="px-3 py-1.5 mb-1 border-b border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 font-['JetBrains_Mono']">
                    {t('landingSelectLang', 'Seleccionar Idioma')}
                  </span>
                </div>
                <div className="space-y-1">
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setLanguage(opt.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl text-left flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
                        language === opt.code
                          ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40 font-bold'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{opt.flag}</span>
                        <div>
                          <span className="block leading-tight">{opt.name}</span>
                          <span className="text-[10px] text-white/45 font-normal">{opt.code.toUpperCase()}</span>
                        </div>
                      </div>
                      {language === opt.code && (
                        <span className="material-symbols-outlined text-amber-300 text-sm font-bold">check</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick CTA to Enter App */}
          <button
            type="button"
            onClick={onEnterApp}
            className="h-9 px-3 sm:px-4 rounded-xl text-xs font-extrabold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center gap-1.5 shadow-md shrink-0"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#1a0a00',
              boxShadow: '0 0 15px rgba(255,215,0,0.3)',
            }}
          >
            <span>{t('landingNavEnter', 'Entrar')}</span>
            <span className="text-sm font-bold">→</span>
          </button>
        </div>
      </nav>

      {/* ═══════════════════ HERO (CTA BUTTON #1) ═══════════════════ */}
      <section
        className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4 pt-20 pb-16"
        style={{ paddingTop: '100px' }}
      >
        {/* Eclipse visual */}
        <div className="relative mb-10" style={{ width: 200, height: 200 }}>
          {/* Outer corona ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(rgba(255,215,0,0.6) 0%, rgba(255,165,0,0.4) 30%, rgba(255,215,0,0.2) 60%, rgba(255,215,0,0.6) 100%)',
              filter: 'blur(12px)',
              animation: 'spin 12s linear infinite',
            }}
          />
          {/* Inner corona */}
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'conic-gradient(rgba(255,215,0,0.9) 0%, rgba(255,200,0,0.7) 50%, rgba(255,215,0,0.9) 100%)',
              filter: 'blur(6px)',
              animation: 'spin 8s linear infinite reverse',
            }}
          />
          {/* Moon disk */}
          <div
            className="absolute inset-6 rounded-full"
            style={{
              background: 'radial-gradient(circle at 40% 40%, #1e1233, #0d0820)',
              boxShadow: '0 0 30px rgba(255,215,0,0.5)',
              zIndex: 2,
            }}
          />
          {/* Stars peeping around */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                top: `${20 + Math.sin((i * Math.PI) / 3) * 45}%`,
                left: `${20 + Math.cos((i * Math.PI) / 3) * 45}%`,
                opacity: 0.7,
                animation: `twinkle ${2 + i * 0.4}s infinite ease-in-out`,
              }}
            />
          ))}
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 uppercase tracking-widest"
          style={{
            background: 'rgba(255,215,0,0.12)',
            border: '1px solid rgba(255,215,0,0.35)',
            color: '#FFD700',
          }}
        >
          {t('landingHeroEclipseBadge', '🌑 Gran Eclipse Total · 2 Agosto 2027 · España')}
        </div>

        <h1
          className="font-luxury text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{
            color: '#ffffff',
            textShadow: '0 0 40px rgba(255,215,0,0.3)',
            maxWidth: 800,
          }}
        >
          {t('landingHeroTitle1', 'El cielo nocturno')}
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFE55C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t('landingHeroTitle2', 'en tu bolsillo')}
          </span>
        </h1>

        <p
          className="text-lg md:text-xl mb-10 max-w-2xl leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          {t('landingHeroDesc', 'Zonas certificadas Starlight y DarkSky International, mapas Bortle, astrofotografía recomendada y el mayor evento celeste del siglo — el Eclipse Total Solar 2027 — todo en una sola app.')}
        </p>

        {/* CTA 1: Primary Hero Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={onEnterApp}
            id="hero-cta-primary"
            className="px-10 py-4 rounded-2xl text-lg font-black transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider flex items-center justify-center gap-3 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#1a0a00',
              boxShadow: '0 0 35px rgba(255,215,0,0.5), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <span>{t('landingHeroBtnPrimary', 'Lo Quiero')}</span>
            <span className="text-xl">→</span>
          </button>
          <a
            href="#features"
            id="hero-cta-secondary"
            className="px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(255,255,255,0.18)',
              color: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {t('landingHeroBtnSecondary', 'Ver funciones ↓')}
          </a>
        </div>

        {/* Eclipse countdown */}
        <div
          id="eclipse"
          className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl"
          style={{
            background: 'rgba(255,215,0,0.05)',
            border: '1.5px solid rgba(255,215,0,0.2)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <p className="text-sm uppercase tracking-widest text-amber-300/70 font-semibold">
            {t('landingCountdownTitle', '⏳ Cuenta regresiva al Eclipse Total')}
          </p>
          <div className="flex flex-wrap justify-center items-start gap-2 sm:gap-4 md:gap-6">
            <CountCell value={countdown.days} label={t('landingCountdownDays', 'Días')} />
            <span className="text-amber-400/60 text-3xl font-thin mt-3">:</span>
            <CountCell value={countdown.hours} label={t('landingCountdownHours', 'Horas')} />
            <span className="text-amber-400/60 text-3xl font-thin mt-3">:</span>
            <CountCell value={countdown.minutes} label={t('landingCountdownMin', 'Min')} />
            <span className="text-amber-400/60 text-3xl font-thin mt-3">:</span>
            <CountCell value={countdown.seconds} label={t('landingCountdownSec', 'Seg')} />
          </div>
          <p className="text-xs text-white/35">{t('landingCountdownDate', '2 Agosto 2027 · 10:45h (hora española) · España')}</p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
          style={{ animation: 'bounce 2s infinite' }}
        >
          <span className="text-xs text-white/60 uppercase tracking-widest">{t('landingDiscover', 'Descubrir')}</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div
            id="features-heading"
            data-observe
            className="text-center mb-16 transition-all duration-700"
            style={{
              opacity: isVisible('features-heading') ? 1 : 0,
              transform: isVisible('features-heading') ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
              style={{
                background: 'rgba(125,77,255,0.15)',
                border: '1px solid rgba(125,77,255,0.35)',
                color: '#a78bfa',
              }}
            >
              {t('landingFeaturesBadge', '✦ Funciones')}
            </span>
            <h2
              className="font-luxury text-4xl md:text-5xl font-bold mb-4"
              style={{ color: '#fff' }}
            >
              {t('landingFeaturesTitle', 'Todo lo que necesitas')}
              <span className="block text-violet-300/80">{t('landingFeaturesTitleSub', 'para conquistar el cielo')}</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              {t('landingFeaturesDesc', 'Desde mapas interactivos hasta inteligencia artificial astronómica, StellaWay es tu compañero definitivo bajo las estrellas.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                id={`feature-${i}`}
                data-observe
                className={`rounded-2xl p-6 flex flex-col gap-4 transition-all duration-700`}
                style={{
                  background: `linear-gradient(145deg, ${f.color.replace('from-', '').replace('/20', '').split(' to-')[0]}33 0%, ${f.color.replace('from-', '').replace('/20', '').split(' to-')[1]}22 100%)`,
                  backdropFilter: 'blur(16px)',
                  border: `1.5px solid ${f.border.replace('border-', '').replace('/30', '')}4D`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${f.glow.replace('shadow-', '').replace('/20', '')}33`,
                  opacity: isVisible(`feature-${i}`) ? 1 : 0,
                  transform: isVisible(`feature-${i}`) ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg text-white leading-tight">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ZONAS CERTIFICADAS Y CIELOS OSCUROS ═══════════════════ */}
      <section id="cielos-certificados" className="relative z-10 py-24 px-4 overflow-hidden">
        {/* Subtle cosmic background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(56, 189, 248, 0.08) 0%, rgba(124, 77, 255, 0.05) 50%, transparent 80%)',
          }}
        />

        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div
            id="certified-heading"
            data-observe
            className="text-center mb-14 transition-all duration-700"
            style={{
              opacity: isVisible('certified-heading') ? 1 : 0,
              transform: isVisible('certified-heading') ? 'translateY(0)' : 'translateY(30px)',
            }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4 bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              {t('landingCertifiedBadge', 'Estándares Internacionales de Calidad Celeste')}
            </div>
            <h2 className="font-luxury text-4xl md:text-5xl font-bold mb-4 text-white">
              {t('landingCertifiedTitle', 'Zonas Certificadas & Cielos Oscuros')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-cyan-300 to-purple-300">
                {t('landingCertifiedSubtitle', 'Guía Oficial para la Observación Nocturna')}
              </span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              {t('landingCertifiedDesc', 'Explora enclaves avalados por auditorías científicas mundiales y seleccionados por su oscuridad estelar, transparencia atmosférica y protección medioambiental.')}
            </p>

            {/* Filter Category Tabs (Modern Pill Switcher) */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8 p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => setSelectedCertifiedCat('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  selectedCertifiedCat === 'all'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {t('landingFilterAll', 'Todos los Enclaves')}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCertifiedCat('starlight')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  selectedCertifiedCat === 'starlight'
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25'
                    : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-400/10'
                }`}
              >
                <span>✨</span> {t('landingFilterStarlight', 'Fundación Starlight')}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCertifiedCat('darksky')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  selectedCertifiedCat === 'darksky'
                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25'
                    : 'text-cyan-300/80 hover:text-cyan-200 hover:bg-cyan-400/10'
                }`}
              >
                <span>🌌</span> {t('landingFilterDarkSky', 'DarkSky International')}
              </button>
              <button
                type="button"
                onClick={() => setSelectedCertifiedCat('astroturismo')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  selectedCertifiedCat === 'astroturismo'
                    ? 'bg-purple-400 text-slate-950 shadow-lg shadow-purple-500/25'
                    : 'text-purple-300/80 hover:text-purple-200 hover:bg-purple-400/10'
                }`}
              >
                <span>📸</span> {t('landingFilterRecom', 'Astrofotografía & Miradores')}
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {certifiedSkyCategories
              .filter((c) => selectedCertifiedCat === 'all' || selectedCertifiedCat === c.id)
              .map((c, i) => (
                <div
                  key={c.id}
                  id={`certified-card-${c.id}`}
                  data-observe
                  className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-700 relative overflow-hidden group hover:translate-y-[-4px]`}
                  style={{
                    background: 'linear-gradient(155deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: `1.5px solid ${c.id === 'starlight' ? 'rgba(251,191,36,0.35)' : c.id === 'darksky' ? 'rgba(56,189,248,0.35)' : 'rgba(192,132,252,0.35)'}`,
                    boxShadow: `0 20px 40px -15px rgba(0,0,0,0.5), 0 0 30px ${c.glow}`,
                    opacity: isVisible(`certified-card-${c.id}`) ? 1 : 0,
                    transform: isVisible(`certified-card-${c.id}`) ? 'translateY(0) scale(1)' : 'translateY(35px) scale(0.98)',
                    transitionDelay: `${i * 120}ms`,
                  }}
                >
                  {/* Subtle corner aura */}
                  <div
                    className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-40 transition-opacity duration-300 group-hover:opacity-75"
                    style={{ background: c.id === 'starlight' ? '#F59E0B' : c.id === 'darksky' ? '#38BDF8' : '#C084FC' }}
                  />

                  <div>
                    {/* Header: Icon & Certification Badge */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
                        style={{
                          background: c.id === 'starlight' ? 'rgba(245,158,11,0.15)' : c.id === 'darksky' ? 'rgba(56,189,248,0.15)' : 'rgba(168,85,247,0.15)',
                          border: `1px solid ${c.id === 'starlight' ? 'rgba(245,158,11,0.3)' : c.id === 'darksky' ? 'rgba(56,189,248,0.3)' : 'rgba(168,85,247,0.3)'}`,
                        }}
                      >
                        {c.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border ${c.tagColor}`}>
                        {c.badge}
                      </span>
                    </div>

                    {/* Title & Organization Subtitle */}
                    <h3 className="font-luxury text-2xl font-bold text-white mb-1.5 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs font-medium text-white/50 mb-4 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-amber-400" />
                      {c.org}
                    </p>

                    {/* Description */}
                    <p className="text-sm leading-relaxed text-white/70 mb-6">
                      {c.desc}
                    </p>

                    {/* Highlights bullet checklist */}
                    <div className="space-y-2.5 mb-6 pt-4 border-t border-white/10">
                      {c.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-white/80">
                          <span className={`text-sm shrink-0 leading-none ${c.id === 'starlight' ? 'text-amber-400' : c.id === 'darksky' ? 'text-cyan-400' : 'text-purple-400'}`}>
                            ✦
                          </span>
                          <span className="leading-tight">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footnote: Sample regions in StellaWay database */}
                  <div className="mt-4 pt-3.5 border-t border-white/10 bg-black/25 -mx-7 -mb-7 p-5 rounded-b-3xl">
                    <div className="text-[11px] uppercase tracking-wider text-white/40 font-semibold mb-1 flex items-center gap-1">
                      <span>📍</span> {c.spotsLabel || t('landingCatStarlightSpotsLabel', 'Lugares emblemáticos:')}
                    </div>
                    <div className="text-xs text-white/85 font-medium leading-relaxed">
                      {c.sampleSpots}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Bottom Interactive Feature Bar: Roadmap to Full Database Integration */}
          <div
            id="certified-cta-banner"
            data-observe
            className="mt-12 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700"
            style={{
              background: 'linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(124,77,255,0.12) 50%, rgba(245,158,11,0.08) 100%)',
              border: '1.5px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              opacity: isVisible('certified-cta-banner') ? 1 : 0,
              transform: isVisible('certified-cta-banner') ? 'translateY(0)' : 'translateY(25px)',
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-2xl shrink-0">
                🗺️
              </div>
              <div>
                <h4 className="font-luxury text-lg sm:text-xl font-bold text-white mb-1">
                  {t('landingDestSearchTitle', 'Buscador y Ficha Detallada de Cada Destino')}
                </h4>
                <p className="text-xs sm:text-sm text-white/65 max-w-2xl leading-relaxed">
                  {t('landingDestSearchDesc', 'Filtra por certificación oficial, índice de Bortle (1 a 4), altitud, orientación estelar y recomendaciones de equipo astronómico para tus escapadas.')}
                </p>
              </div>
            </div>

            <button
              onClick={onEnterApp}
              className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-cyan-500/20 shrink-0 cursor-pointer flex items-center gap-2"
            >
              <span>{t('landingDestSearchBtn', 'Explorar Zonas')}</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ECLIPSE SPOTLIGHT (NO BUTTON) ═══════════════════ */}
      <section className="relative z-10 py-24 px-4 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,140,0,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          id="eclipse-spotlight"
          data-observe
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden transition-all duration-1000"
          style={{
            background: 'linear-gradient(135deg, rgba(255,140,0,0.12) 0%, rgba(255,215,0,0.08) 50%, rgba(180,80,0,0.12) 100%)',
            border: '1.5px solid rgba(255,215,0,0.25)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 60px rgba(255,140,0,0.2)',
            opacity: isVisible('eclipse-spotlight') ? 1 : 0,
            transform: isVisible('eclipse-spotlight') ? 'scale(1)' : 'scale(0.96)',
          }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-0">
            {/* Left: visual */}
            <div className="lg:w-2/5 flex items-center justify-center p-12">
              <div className="relative" style={{ width: 180, height: 180 }}>
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,215,0,0.6) 0%, rgba(255,140,0,0.3) 40%, transparent 70%)',
                    filter: 'blur(20px)',
                    animation: 'pulse-glow-gold 3s infinite alternate',
                  }}
                />
                <div
                  className="absolute inset-4 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                    opacity: 0.9,
                  }}
                />
                <div
                  className="absolute inset-10 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #1e1233, #0a0515)',
                    boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                  }}
                />
                <div
                  className="absolute -inset-4 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255,215,0,0) 0%, rgba(255,215,0,0.6) 25%, rgba(255,200,100,0.8) 50%, rgba(255,215,0,0.6) 75%, rgba(255,215,0,0) 100%)',
                    filter: 'blur(8px)',
                    animation: 'spin 10s linear infinite',
                    opacity: 0.7,
                  }}
                />
                <div
                  className="absolute font-luxury font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(255,215,0,0.9)', fontSize: 11, letterSpacing: '0.1em', zIndex: 10, whiteSpace: 'nowrap' }}
                >
                  2027
                </div>
              </div>
            </div>
            {/* Right: content */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
                style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }}
              >
                {t('landingEclipseBadge', '🌑 Evento del Siglo')}
              </span>
              <h2
                className="font-luxury text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ lineHeight: 1.25 }}
              >
                {t('landingEclipseTitle', 'Gran Eclipse Total Solar')}
                <span className="block text-amber-300">{t('landingEclipseDate', '2 Agosto 2027')}</span>
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                {t('landingEclipseDesc', 'El eclipse solar total más esperado del siglo será visible en España principalmente en su franja sur: Cádiz, Ceuta, Melilla, Málaga, costa de Granada y Almería (consulta tu zona en la app para más información de visibilidad). StellaWay te lleva al mejor punto de observación con rutas, clima en tiempo real y campamentos astroturísticos.')}
              </p>
              <ul className="space-y-2">
                {[
                  t('landingEclipseB1', '📍 Zona de totalidad: Cádiz, Málaga, Granada (costa), Almería (costa), Ceuta y Melilla.'),
                  t('landingEclipseB2', '🗺️ Consulta tu zona exacta en la app para porcentaje y horarios de visibilidad'),
                  t('landingEclipseB3', '⏱ Duración de totalidad: hasta 4 min 23 seg'),
                  t('landingEclipseB4', '🔭 Campamentos de observación exclusivos'),
                  t('landingEclipseB5', '📡 Alertas y telemetría en tiempo real'),
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-white/70">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ RED LIGHT NIGHT VISION SPOTLIGHT ═══════════════════ */}
      <section id="vision-nocturna" className="relative z-10 py-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)',
          }}
        />
        <div
          id="night-vision-spotlight"
          data-observe
          className="max-w-5xl mx-auto rounded-3xl overflow-hidden transition-all duration-1000 p-8 sm:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(153,27,27,0.18) 50%, rgba(15,7,24,0.9) 100%)',
            border: '1.5px solid rgba(239,68,68,0.35)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 0 50px rgba(239,68,68,0.2)',
            opacity: isVisible('night-vision-spotlight') ? 1 : 0,
            transform: isVisible('night-vision-spotlight') ? 'scale(1)' : 'scale(0.96)',
          }}
        >
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Visual: Simulated Night Vision Button & Glow */}
            <div className="lg:w-2/5 flex flex-col items-center justify-center text-center">
              <div className="relative mb-4">
                {/* Red halo glow */}
                <div
                  className="absolute inset-0 rounded-2xl bg-red-600/40 blur-xl animate-pulse"
                  style={{ transform: 'scale(1.2)' }}
                />
                {/* Simulated button */}
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-b from-[#EF4444] to-[#991B1B] border-2 border-red-300 flex flex-col items-center justify-center text-white shadow-[0_0_30px_rgba(239,68,68,0.7)]">
                  <span className="material-symbols-outlined text-3xl">clear_day</span>
                  <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
                    {t('landingNightVisionBtnLabel', 'Luz Roja')}
                  </span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                {t('landingNightVision1Click', 'Activación con 1 Clic')}
              </span>
            </div>

            {/* Explanation Content */}
            <div className="lg:w-3/5">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                style={{ background: 'rgba(239,68,68,0.18)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.4)' }}
              >
                {t('landingNightVisionBadge', '🔴 Óptica Astronómica')}
              </span>
              <h2 className="font-luxury text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {t('landingNightVisionTitle', 'Botón de Luz Roja')}
                <span className="block text-red-400">
                  {t('landingNightVisionSubtitle', 'Adaptado a la Visión Nocturna')}
                </span>
              </h2>
              <p className="text-white/70 mb-5 leading-relaxed text-sm sm:text-base">
                {t('landingNightVisionDesc', 'El ojo humano tarda entre 20 y 30 minutos en sintetizar rodopsina y adaptarse por completo a la oscuridad profunda de cielos Bortle 1 a 4. Un solo destello de luz blanca destruye esa adaptación al instante.')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-black/40 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-xs sm:text-sm mb-1">
                    <span>👁️</span> {t('landingNightVisionCard1Title', 'Cero Deslumbramiento Retiniano')}
                  </div>
                  <p className="text-white/55 text-xs">
                    {t('landingNightVisionCard1Desc', 'La longitud de onda roja (~650nm) no satura los bastones oculares, permitiendo leer mapas y efemérides sin perder la visión de objetos débiles.')}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-xs sm:text-sm mb-1">
                    <span>🔭</span> {t('landingNightVisionCard2Title', 'Protocolo Starlight')}
                  </div>
                  <p className="text-white/55 text-xs">
                    {t('landingNightVisionCard2Desc', 'Respeta a tus compañeros de observación y fotógrafos de cielo profundo en campamentos y quedadas astronómicas.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section id="testimonios" className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-luxury text-3xl md:text-4xl font-bold text-white mb-2">
              {t('landingTestimonialsTitle', 'Lo que dicen nuestros exploradores')}
            </h2>
            <p className="text-white/40 text-sm">{t('landingTestimonialsSubtitle', 'Astrónomos, astrofotógrafos y guías de astroturismo')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((tItem, i) => (
              <div
                key={tItem.name}
                id={`testimonial-${i}`}
                data-observe
                className="rounded-2xl p-6 transition-all duration-700"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(12px)',
                  opacity: isVisible(`testimonial-${i}`) ? 1 : 0,
                  transform: isVisible(`testimonial-${i}`) ? 'translateY(0)' : 'translateY(30px)',
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <p className="text-white/65 text-sm leading-relaxed mb-5 italic">"{tItem.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}
                  >
                    {tItem.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{tItem.name}</div>
                    <div className="text-white/40 text-xs">{tItem.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ FINAL CTA (CTA BUTTON #2 - THE LAST ONE) ═══════════════════ */}
      <section className="relative z-10 py-20 px-4">
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl p-10 sm:p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(124,77,255,0.15) 0%, rgba(255,140,0,0.1) 50%, rgba(56,189,248,0.12) 100%)',
            border: '1.5px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 0 60px rgba(124,77,255,0.15)',
          }}
        >
          <div className="text-5xl mb-6">🌌</div>
          <h2 className="font-luxury text-4xl md:text-5xl font-bold text-white mb-4">
            {t('landingCtaTitle', 'El universo te espera')}
          </h2>
          <p className="text-white/55 mb-8 text-lg max-w-xl mx-auto leading-relaxed">
            {t('landingCtaDesc', 'Únete a la comunidad de astrónomos que ya usan StellaWay para explorar el cosmos. Comienza gratis hoy — el Gran Eclipse 2027 se acerca.')}
          </p>
          {/* CTA 2: Final CTA Button */}
          <button
            onClick={onEnterApp}
            id="final-cta-btn"
            className="px-12 py-4 rounded-2xl text-lg font-black transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider inline-flex items-center gap-3 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: '#1a0a00',
              boxShadow: '0 0 40px rgba(255,215,0,0.45), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <span>{t('landingCtaBtn', 'Lo Quiero')}</span>
            <span className="text-xl">→</span>
          </button>
          <p className="mt-4 text-white/30 text-xs">{t('landingCtaNote', 'Sin tarjeta de crédito · 48h de prueba gratuita')}</p>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer
        id="landing-footer"
        className="relative z-10 py-10 px-4 text-center"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">🌑</span>
          <span className="font-luxury font-bold text-lg" style={{ color: '#FFD700' }}>
            StellaWay
          </span>
        </div>
        <p className="text-white/30 text-sm mb-2">
          {t('landingFooterTagline', 'Astronomía · Astroturismo · Eclipse Total 2027 · España')}
        </p>

        {/* Texto legal solicitado */}
        <p className="text-white/50 text-xs my-4 max-w-xl mx-auto leading-relaxed">
          {t('landingLegalPrefix', 'Al realizar el pago, aceptas nuestros')}{' '}
          <a
            id="link-terminos-condiciones"
            href="/terminos.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              setLegalModal('terminos');
            }}
            className="text-amber-400/90 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {t('termsAndConditions', 'Términos y Condiciones')}
          </a>{' '}
          {t('andThe', 'y la')}{' '}
          <a
            id="link-politica-privacidad"
            href="/privacidad.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              setLegalModal('privacidad');
            }}
            className="text-amber-400/90 hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            {t('privacyPolicy', 'Política de Privacidad')}
          </a>
          .
        </p>

        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} StellaWay · {t('landingFooterRights', 'Todos los derechos reservados.')}
        </p>

        {/* Acceso discreto a promoción */}
        <div className="mt-6 flex justify-center">
          <a
            id="landing-promo-link"
            href="https://buy.stripe.com/aFadRb3Flfzt9J91Kh1ZS07"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-white/15 hover:text-white/40 transition-colors tracking-widest lowercase font-medium select-none underline-offset-4 hover:underline"
            style={{ letterSpacing: '0.12em' }}
          >
            {t('promoLink', 'promoción')}
          </a>
        </div>
      </footer>

      {/* Modal interactivo de textos legales para visualización inmediata */}
      {legalModal && (
        <div
          id="landing-legal-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border p-6 sm:p-8 text-left shadow-2xl"
            style={{
              background: '#0e081e',
              borderColor: 'rgba(255,255,255,0.12)',
              color: '#e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-xl font-bold font-luxury" style={{ color: '#FFD700' }}>
                {legalModal === 'terminos' ? 'Términos y Condiciones' : 'Política de Privacidad'}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={legalModal === 'terminos' ? '/terminos.html' : '/privacidad.html'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/50 hover:text-amber-400 transition-colors flex items-center gap-1 border border-white/15 rounded-lg px-2.5 py-1"
                >
                  Abrir en pestaña nueva ↗
                </a>
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-lg"
                  aria-label="Cerrar"
                >
                  ✕
                </button>
              </div>
            </div>

            {legalModal === 'terminos' ? (
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p className="text-xs text-white/40">Última actualización: Enero 2026 · Legislación aplicable: España y UE</p>
                <div>
                  <h4 className="font-semibold text-white mb-1">1. Objeto del Servicio</h4>
                  <p>StellaWay proporciona herramientas de astroturismo, astronomía observacional, predicción meteorológica nocturna y cálculo de visibilidad del Eclipse Solar Total de 2027 en territorio español.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">2. Suscripciones y Pagos</h4>
                  <p>El acceso a las funciones Pro se gestiona a través de la pasarela segura Stripe Payments. La prueba de 48h finaliza automáticamente al término de dicho plazo. Las suscripciones periódicas pueden cancelarse en cualquier momento antes de su renovación sin penalización.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">3. Desistimiento y Contenido Digital</h4>
                  <p>Conforme a la Ley General para la Defensa de los Consumidores y Usuarios (RDL 1/2007 de España) y la Directiva UE 2011/83, al tratarse de contenido digital de acceso inmediato sin soporte material, el usuario consiente el inicio inmediato de la ejecución del servicio.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">4. Previsiones Meteorológicas</h4>
                  <p>Las previsiones astronómicas y de cobertura de nubes son estimaciones basadas en modelos meteorológicos y datos de satélite, no garantizando de forma absoluta condiciones de cielo despejado.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p className="text-xs text-white/40">Conforme al RGPD (Reglamento UE 2016/679) y LOPDGDD (Ley Orgánica 3/2018 de España)</p>
                <div>
                  <h4 className="font-semibold text-white mb-1">1. Responsable del Tratamiento</h4>
                  <p>El titular de StellaWay es el responsable del tratamiento de los datos aportados por los usuarios para la prestación del servicio.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">2. Finalidad y Datos Tratados</h4>
                  <p>Los datos de suscripción se procesan exclusivamente para habilitar las funciones Pro. Los datos de geolocalización, si el usuario los autoriza, se procesan únicamente en el cliente (navegador) para calcular la visibilidad local de astros y eclipses.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">3. Seguridad en Pagos</h4>
                  <p>Las operaciones de pago se realizan de forma externa y cifrada mediante Stripe Payments (PCI-DSS Nivel 1). StellaWay no almacena en ningún caso los números completos de tarjeta.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">4. Derechos del Usuario</h4>
                  <p>Puede ejercitar sus derechos de acceso, rectificación, supresión y limitación dirigiéndose al soporte de StellaWay o presentando reclamación ante la Agencia Española de Protección de Datos (AEPD).</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Keyframes via style tag */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes pulse-glow-gold {
          0% { box-shadow: 0 0 20px rgba(255,215,0,0.2); }
          100% { box-shadow: 0 0 50px rgba(255,215,0,0.5); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
};
