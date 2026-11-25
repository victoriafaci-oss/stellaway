import React, { useState, useEffect, useRef } from 'react';
import { StellaLogo } from './StellaLogo';
import { useLanguage } from '../context/LanguageContext';
import { withStripeLocale } from '../lib/i18nHelpers';

import heroNebulaImg from '../assets/images/v2_hero_nebula_sky_1795505139848.jpg';
import zoneStarlightImg from '../assets/images/v2_zone_starlight_1795505141315.jpg';
import zoneDarkskyImg from '../assets/images/v2_zone_darksky_1795505141309.jpg';
import zoneAurorasImg from '../assets/images/v2_zone_auroras_1795505141823.jpg';
import daytimeTravelImg from '../assets/images/v2_daytime_travel_nature_1795505142329.jpg';
import eclipseTotalImg from '../assets/images/eclipse_total_2026_1787656886887.jpg';

interface LandingPageV2Props {
  onEnterApp: () => void;
  nightVision?: boolean;
  setNightVision?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ECLIPSE_DATE = new Date('2027-08-02T10:10:00Z');

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

/**
 * Scroll-coupled parallax sky & twinkling stars canvas.
 * Stars drift gently and shift vertically across three depth layers as the user scrolls.
 */
function ScrollParallaxStarfield({ isNightVision }: { isNightVision: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaLayerRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let ticking = false;
    const handleScroll = () => {
      scrollYRef.current = window.scrollY || 0;
      if (!ticking && !prefersReducedMotion) {
        ticking = true;
        requestAnimationFrame(() => {
          if (nebulaLayerRef.current) {
            const offset = Math.min(scrollYRef.current * 0.14, 420);
            nebulaLayerRef.current.style.transform = `translate3d(0, ${-offset}px, 0)`;
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    type ParallaxStar = {
      x: number;
      baseY: number;
      r: number;
      alpha: number;
      delta: number;
      depth: number; // 0.08 to 0.45 parallax multiplier
      tint: 'white' | 'gold' | 'cyan' | 'emerald';
    };

    const stars: ParallaxStar[] = Array.from({ length: 190 }, (_, i) => ({
      x: Math.random() * width,
      baseY: Math.random() * height * 1.4,
      r: Math.random() * 1.55 + 0.35,
      alpha: Math.random() * 0.75 + 0.2,
      delta: (Math.random() * 0.007 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      depth: 0.06 + (i % 5) * 0.08,
      tint: i % 11 === 0 ? 'gold' : i % 13 === 0 ? 'cyan' : i % 19 === 0 ? 'emerald' : 'white',
    }));

    type ShootingStar = {
      x: number;
      y: number;
      len: number;
      speed: number;
      angle: number;
      opacity: number;
      maxOpacity: number;
      active: boolean;
      delay: number;
    };

    const makeMeteor = (delay = 0): ShootingStar => ({
      x: width * (0.35 + Math.random() * 0.65),
      y: Math.random() * height * 0.45,
      len: 110 + Math.random() * 140,
      speed: 10 + Math.random() * 7,
      angle: (32 + Math.random() * 14) * (Math.PI / 180),
      opacity: 0,
      maxOpacity: 0.55 + Math.random() * 0.35,
      active: delay === 0,
      delay,
    });

    const meteors: ShootingStar[] = [makeMeteor(40), makeMeteor(190), makeMeteor(340)];

    let animId = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const scrollY = prefersReducedMotion ? 0 : scrollYRef.current;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        if (!prefersReducedMotion) {
          s.alpha += s.delta;
          if (s.alpha <= 0.15 || s.alpha >= 0.95) s.delta *= -1;
        }

        // Wrap vertically with parallax displacement
        const span = height + 160;
        const y = (((s.baseY - scrollY * s.depth) % span) + span) % span - 80;

        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);

        if (isNightVision) {
          ctx.fillStyle = `rgba(255, 110, 110, ${s.alpha})`;
        } else if (s.tint === 'gold') {
          ctx.fillStyle = `rgba(253, 224, 130, ${s.alpha})`;
        } else if (s.tint === 'cyan') {
          ctx.fillStyle = `rgba(125, 211, 252, ${s.alpha})`;
        } else if (s.tint === 'emerald') {
          ctx.fillStyle = `rgba(110, 231, 183, ${s.alpha})`;
        } else {
          ctx.fillStyle = `rgba(248, 250, 252, ${s.alpha})`;
        }
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        for (let i = 0; i < meteors.length; i++) {
          const m = meteors[i];
          if (!m.active) {
            m.delay -= 1;
            if (m.delay <= 0) m.active = true;
            continue;
          }

          m.x -= Math.cos(m.angle) * m.speed;
          m.y += Math.sin(m.angle) * m.speed;

          if (m.opacity < m.maxOpacity) {
            m.opacity = Math.min(m.maxOpacity, m.opacity + 0.07);
          } else {
            m.maxOpacity -= 0.012;
            m.opacity = Math.max(0, m.maxOpacity);
          }

          const tailX = m.x + Math.cos(m.angle) * m.len;
          const tailY = m.y - Math.sin(m.angle) * m.len;
          const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
          grad.addColorStop(0, 'rgba(255,255,255,0)');
          grad.addColorStop(
            1,
            isNightVision
              ? `rgba(255,120,120,${m.opacity})`
              : `rgba(254,230,133,${m.opacity})`
          );

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(m.x, m.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.stroke();

          if (m.opacity <= 0 || m.x < -120 || m.y > height + 120) {
            Object.assign(m, makeMeteor(90 + Math.floor(Math.random() * 180)));
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isNightVision]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <div
        ref={nebulaLayerRef}
        className="absolute -inset-x-0 -top-24 h-[140vh] will-change-transform transition-opacity duration-500"
        style={{
          background: isNightVision
            ? 'radial-gradient(ellipse 65% 45% at 18% 20%, rgba(220, 38, 38, 0.22), transparent 70%), radial-gradient(ellipse 55% 45% at 85% 65%, rgba(153, 27, 27, 0.18), transparent 70%)'
            : 'radial-gradient(ellipse 65% 45% at 18% 18%, rgba(56, 189, 248, 0.12), transparent 70%), radial-gradient(ellipse 55% 45% at 85% 52%, rgba(245, 158, 11, 0.10), transparent 70%), radial-gradient(ellipse 60% 45% at 45% 88%, rgba(16, 185, 129, 0.10), transparent 70%)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

interface MediaFrameProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  accentClass: string;
  className?: string;
}

function MediaFrame({ src, alt, fallbackTitle, accentClass, className = '' }: MediaFrameProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#0C101C] text-slate-300 p-6 text-center ${className}`}
      >
        <span className={`material-symbols-outlined text-4xl mb-2 ${accentClass}`}>nights_stay</span>
        <span className="text-sm font-semibold">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}

type ZoneFilter = 'all' | 'starlight' | 'darksky' | 'auroras';

export const LandingPageV2: React.FC<LandingPageV2Props> = ({
  onEnterApp,
  nightVision: propNightVision,
  setNightVision: propSetNightVision,
}) => {
  const countdown = useCountdown();
  const { language, setLanguage, languageOptions, t } = useLanguage();
  const [internalNightVision, setInternalNightVision] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [activeZoneFilter, setActiveZoneFilter] = useState<ZoneFilter>('all');
  const [legalModal, setLegalModal] = useState<'terminos' | 'privacidad' | null>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const isNightVision = propNightVision !== undefined ? propNightVision : internalNightVision;
  const toggleNightVision = () => {
    if (propSetNightVision) {
      propSetNightVision((prev) => !prev);
    } else {
      setInternalNightVision((prev) => !prev);
    }
  };

  const currentLang = languageOptions.find((l) => l.code === language) || languageOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    if (langDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [langDropdownOpen]);

  const zones = [
    {
      id: 'starlight' as const,
      index: '01',
      network: t('landingZoneStarlightNetwork', 'Fundación Starlight · UNESCO'),
      title: t('landingCatStarlightTitle', 'Zonas Starlight'),
      tagline: t('landingZoneStarlightTagline', 'Reservas, destinos turísticos y pueblos certificados'),
      metric: t('landingZoneStarlightMetric', 'Bortle 1–3 · SQM 21.6+'),
      image: zoneStarlightImg,
      imageAlt: t('landingZoneStarlightAlt', 'Reserva Starlight bajo el arco de la Vía Láctea en montaña'),
      accentText: 'text-amber-300',
      accentBg: 'bg-amber-400',
      accentBorder: 'border-amber-400/35 hover:border-amber-300/70',
      accentGlow: 'hover:shadow-[0_24px_50px_-18px_rgba(245,158,11,0.28)]',
      description: t(
        'landingCatStarlightDesc',
        'Enclaves auditados científicamente por su baja contaminación lumínica y preparados para combinar rutas de montaña de día con observación estelar de noche.'
      ),
      highlights: [
        t('landingCatStarlightH1', 'Reservas Starlight de máxima pureza celeste'),
        t('landingCatStarlightH2', 'Pueblos, alojamientos y senderos astronómicos'),
        t('landingCatStarlightH4', 'Auditorías continuas de calidad del cielo y seeing'),
      ],
      spotsPrefix: t('landingStarlightTerritoriesPrefix', 'Países:'),
      spots: t(
        'landingZoneStarlightSpots',
        'España · Portugal · Andorra · Chile · Argentina · EE.UU.'
      ),
    },
    {
      id: 'darksky' as const,
      index: '02',
      network: t('landingZoneDarkskyNetwork', 'DarkSky International · IDA'),
      title: t('landingCatDarkskyTitle', 'Parques DarkSky'),
      tagline: t('landingZoneDarkskyTagline', 'Santuarios y reservas protegidas de cielo oscuro'),
      metric: t('landingZoneDarkskyMetric', 'Red Global · 200+ Parques'),
      image: zoneDarkskyImg,
      imageAlt: t('landingZoneDarkskyAlt', 'Parque DarkSky con lago alpino reflejando un cielo estrellado sin contaminación lumínica'),
      accentText: 'text-sky-300',
      accentBg: 'bg-sky-400',
      accentBorder: 'border-sky-400/35 hover:border-sky-300/70',
      accentGlow: 'hover:shadow-[0_24px_50px_-18px_rgba(56,189,248,0.28)]',
      description: t(
        'landingCatDarkskyDesc',
        'Parques nacionales y santuarios sometidos a los estándares internacionales más estrictos contra la polución lumínica y la protección de la biodiversidad nocturna.'
      ),
      highlights: [
        t('landingCatDarkskyH1', 'Parques Internacionales de Cielo Oscuro (IDA)'),
        t('landingCatDarkskyH2', 'Reservas transfronterizas y santuarios protegidos'),
        t('landingCatDarkskyH4', 'Entornos naturales preservados de día y de noche'),
      ],
      spotsPrefix: t('landingStarlightTerritoriesPrefix', 'Países:'),
      spots: t(
        'landingZoneDarkskySpots',
        'EE.UU. · Canadá · Reino Unido · España · Francia · Alemania · Chile · Australia · Nueva Zelanda · Namibia · Japón y +20 países'
      ),
    },
    {
      id: 'auroras' as const,
      index: '03',
      network: t('landingZoneAurorasNetwork', 'Atlas Mundial Polar · Hemisferio N & S'),
      title: t('landingCatAurorasTitle', 'Auroras Boreales & Australes'),
      tagline: t('landingZoneAurorasTagline', '75 enclaves polares e índice Kp NOAA en vivo'),
      metric: t('landingZoneAurorasMetric', '75 Enclaves · Kp en vivo'),
      image: zoneAurorasImg,
      imageAlt: t('landingZoneAurorasAlt', 'Auroras boreales esmeralda sobre fiordos nevados en Noruega'),
      accentText: 'text-emerald-300',
      accentBg: 'bg-emerald-400',
      accentBorder: 'border-emerald-400/35 hover:border-emerald-300/70',
      accentGlow: 'hover:shadow-[0_24px_50px_-18px_rgba(16,185,129,0.28)]',
      description: t(
        'landingCatAurorasDesc',
        'Buscador especializado en expediciones polares por ambos hemisferios, con frecuencia auroral, orientación magnética y ventanas de oscuridad estacional.'
      ),
      highlights: [
        t('landingCatAurorasH1', 'Boreal: Noruega, Islandia, Laponia, Canadá y Alaska'),
        t('landingCatAurorasH2', 'Austral: Patagonia, Tasmania, Nueva Zelanda y Antártida'),
      ],
      spotsPrefix: t('landingEnclavesPrefix', 'Enclaves:'),
      spots: t(
        'landingZoneAurorasSpots',
        'Tromsø · Abisko · Reykjanes · Rovaniemi · Tierra del Fuego'
      ),
    },
  ];

  const visibleZones =
    activeZoneFilter === 'all' ? zones : zones.filter((z) => z.id === activeZoneFilter);

  return (
    <div
      className={`relative min-h-screen overflow-x-hidden antialiased selection:bg-amber-300 selection:text-slate-950 ${
        isNightVision ? 'night-vision-mode bg-[#0b0202] text-[#FFA3A3]' : 'bg-[#06080F] text-slate-100'
      }`}
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Astronomical Red Light Layer when toggled */}
      {isNightVision && (
        <>
          <div id="landing-v2-night-vision-color" className="astronomical-red-overlay-color" />
          <div id="landing-v2-night-vision-dark" className="astronomical-red-overlay-dark" />
        </>
      )}

      {/* Scroll-coupled parallax sky & stars */}
      <ScrollParallaxStarfield isNightVision={isNightVision} />

      {/* ═══════════════════ TOP BAR (Strict 3-Zone Contract) ═══════════════════ */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#06080F]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <a href="#top" className="shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-lg">
            <StellaLogo size="sm" />
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a
              href="#destinos"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
            >
              {t('landingNavDestinos', 'Destinos')}
            </a>
            <a
              href="#dia-y-noche"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
            >
              {t('landingNavDiaNoche', 'Día y Noche')}
            </a>
            <a
              href="#eclipse-2027"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
            >
              {t('landingNavEclipse', 'Eclipse 2027')}
            </a>
            <a
              href="#acceso"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
            >
              {t('landingNavPlanes', 'Planes')}
            </a>
          </nav>

          {/* Zone 3: Red sun night-vision toggle + Language selector + Primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={toggleNightVision}
              id="v2-night-vision-btn"
              aria-label={isNightVision ? t('landingNvAriaOn', 'Desactivar Modo Visión Nocturna') : t('landingNvAriaOff', 'Activar Modo Luz Roja')}
              title={isNightVision ? t('landingNvAriaOn', 'Desactivar Modo Visión Nocturna') : t('landingNvAriaOff', 'Activar Modo Luz Roja')}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                isNightVision
                  ? 'bg-[#FF3B30]/25 ring-1 ring-[#FF3B30] shadow-[0_0_14px_rgba(255,59,48,0.65)]'
                  : 'hover:bg-red-500/15'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px] text-[#FF3B30]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                clear_day
              </span>
            </button>

            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen((prev) => !prev)}
                aria-label={t('landingSelectLang', 'Seleccionar Idioma')}
                className="h-9 px-2.5 sm:px-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-slate-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              >
                <span>{currentLang.flag}</span>
                <span className="uppercase">{currentLang.code}</span>
                <span className="material-symbols-outlined text-sm text-slate-300">
                  expand_more
                </span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-[#0D111C] border border-white/15 p-1.5 shadow-2xl z-50">
                  {languageOptions.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setLanguage(opt.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left flex items-center justify-between text-xs font-medium transition-colors cursor-pointer ${
                        language === opt.code
                          ? 'bg-amber-300/15 text-amber-200'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{opt.flag}</span>
                        <span>{opt.name}</span>
                      </span>
                      {language === opt.code && (
                        <span className="material-symbols-outlined text-sm text-amber-300">
                          check
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onEnterApp}
              className="px-3.5 sm:px-4 py-2 rounded-lg bg-amber-300 hover:bg-amber-200 text-slate-950 text-xs sm:text-sm font-bold tracking-tight transition-colors duration-150 cursor-pointer whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              {t('landingNavEnter', 'Entrar a la App')}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════ BLOCK 1: HERO & LIVE ECLIPSE STRIP ═══════════════════ */}
      <section id="top" className="relative z-10 overflow-hidden border-b border-white/10">
        {/* High-contrast Milky Way / Nebula Hero Photograph */}
        <div className="absolute inset-0 pointer-events-none">
          <MediaFrame
            src={heroNebulaImg}
            alt={t('landingHeroImgAlt', 'Cielo nocturno de alta resolución con la Vía Láctea y nebulosas sobre cordillera oscura')}
            fallbackTitle="StellaWay Deep Sky"
            accentClass="text-amber-300"
            className="w-full h-full object-cover object-center opacity-75"
          />
          {/* Measured scrim for crisp WCAG AA contrast */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,8,15,0.72) 0%, rgba(6,8,15,0.45) 45%, rgba(6,8,15,0.92) 88%, #06080F 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 pb-12 lg:pt-18 lg:pb-16">
          <p className="mb-5">
            <span className="block text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
              {t('landingV2KickerTop', 'Viajes de naturaleza y cielo oscuro')}
            </span>
            <span className="block mt-1.5 text-base sm:text-xl md:text-2xl font-extrabold tracking-[0.14em] leading-snug text-[#FFD700] drop-shadow-[0_0_14px_rgba(255,215,0,0.45)]">
              Starlight <span className="mx-1.5" aria-hidden="true">·</span> DarkSky <span className="mx-1.5" aria-hidden="true">·</span> Auroras
            </span>
          </p>

          <div className="max-w-3xl">
            <h1
              className="font-bold text-white tracking-tight leading-[1.06] mb-6 [text-wrap:balance]"
              style={{ fontSize: 'clamp(2.35rem, 4.8vw, 4.15rem)' }}
            >
              {t('landingV2HeroTitle', 'Explora paisajes de día y')}{' '}
              <span
                className="italic font-semibold text-amber-200"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('landingV2HeroAccent', 'los cielos más puros')}
              </span>{' '}
              {t('landingV2HeroEnd', 'al caer la noche.')}
            </h1>

            <p className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl mb-8">
              {t(
                'landingV2HeroDesc',
                'Planifica escapadas completas en reservas Starlight, parques DarkSky International y enclaves de Auroras boreales y australes. Astroturismo, Astrofotografía, previsión astronómica y seguimiento del Gran Eclipse Total 2027 en una sola guía.'
              )}
            </p>
          </div>

          {/* Centered Large Primary CTA */}
          <div className="w-full flex justify-center mt-2 mb-10">
            <button
              type="button"
              onClick={onEnterApp}
              id="v2-hero-cta-primary"
              className="group v2-cta-btn relative overflow-hidden px-10 py-4 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 text-base sm:text-lg font-extrabold tracking-tight transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-3 shadow-[0_0_32px_rgba(252,211,77,0.35)] hover:shadow-[0_10px_40px_rgba(255,215,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              <span
                aria-hidden="true"
                className="v2-cta-sheen pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent"
              />
              <span className="relative z-10">{t('landingV2HeroBtnPrimary', 'Quiero la App')}</span>
              <span
                aria-hidden="true"
                className="relative z-10 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>

          {/* 3 Separate Cards: Eclipse 2027 (with Solar Eclipse Image & Real Countdown), Integrated Searchers, Night Vision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2 lg:col-span-2 rounded-xl border border-amber-400/35 bg-[#0B0E17]/85 backdrop-blur-xl overflow-hidden flex flex-col sm:flex-row items-stretch">
              <div className="relative w-full h-40 sm:h-auto sm:w-44 md:w-48 shrink-0 bg-black overflow-hidden">
                <MediaFrame
                  src={eclipseTotalImg}
                  alt={t('landingHeroEclipseImgAlt', 'Eclipse solar total con la Luna cubriendo el Sol y la corona visible')}
                  fallbackTitle="Eclipse 2027"
                  accentClass="text-amber-300"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-transparent via-transparent to-[#0B0E17]/85 pointer-events-none" />
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-amber-300 tracking-wide">
                    {t('landingHeroEclipseBadge', 'Gran Eclipse Solar Total · 2 Agosto 2027')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {t('landingHeroTimeUtc', '10:10 UTC · España')}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3 pt-1">
                  {[
                    { val: countdown.days, label: t('landingCountdownDays', 'Días') },
                    { val: countdown.hours, label: t('landingCountdownHours', 'Horas') },
                    { val: countdown.minutes, label: t('landingCountdownMin', 'Min') },
                    { val: countdown.seconds, label: t('landingCountdownSec', 'Seg') },
                  ].map((unit) => (
                    <div key={unit.label} className="flex flex-col">
                      <span className="font-mono tabular-nums text-2xl sm:text-3xl font-bold text-white tracking-tight">
                        {String(unit.val).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5">{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-white/15 bg-[#0B0E17]/85 backdrop-blur-xl flex flex-col justify-between">
              <span className="text-xs text-slate-400">{t('landingBuiltInSearchers', 'Buscadores integrados')}</span>
              <div className="mt-2">
                <div className="font-mono tabular-nums text-base sm:text-lg font-bold text-white leading-snug">
                  {t('landingSearchersSummary', '3 Zonas Certificadas · Bortle 1-9')}
                </div>
                <div
                  className="text-sm sm:text-[15px] font-bold text-[#FFD700] mt-2 tracking-wide leading-snug"
                  title={t('landingSearchersList', 'Starlight · DarkSky · Auroras Boreales y Australes')}
                >
                  Starlight · DarkSky · Auroras
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-red-500/30 bg-[#0B0E17]/85 backdrop-blur-xl flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-red-400">
                  {t('landingRedModeSpec', 'Modo Luz Roja · ~650 nm')}
                </span>
                <button
                  type="button"
                  onClick={toggleNightVision}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isNightVision
                      ? 'bg-red-600 border-red-300 text-white'
                      : 'bg-red-500/15 hover:bg-red-500/25 border-red-400/40 text-red-200'
                  }`}
                >
                  {isNightVision ? t('landingRedModeOn', 'Activa') : t('landingRedModeTry', 'Probar')}
                </button>
              </div>
              <div className="mt-2">
                <div className="text-base font-bold text-white">{t('landingRedModeTitle', 'Visión Nocturna')}</div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {t(
                    'landingRedModeDesc',
                    'Preserva la adaptación ocular a la oscuridad sin deslumbramientos al consultar mapas de noche.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom AI Assistant Strip inside Hero Block */}
          <div className="mt-4 px-5 py-4 rounded-xl border border-white/15 bg-[#0B0E17]/85 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-400/15 border border-emerald-400/35 text-emerald-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">smart_toy</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                  <span>{t('landingAiStripTitle', 'Asistente IA para localizaciones')}</span>
                  <span className="text-xs font-semibold text-emerald-300">· {t('landingAiStripBadge', 'Incluido en la App')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  {t(
                    'landingAiStripDesc',
                    'Pregunta al asistente inteligente de StellaWay para localizar al instante las zonas certificadas de la app (Starlight, DarkSky y enclaves de auroras) y las poblaciones cercanas.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Stellar Events Strip inside Hero Block */}
          <div className="mt-4 px-5 py-4 rounded-xl border border-white/15 bg-[#0B0E17]/85 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-400/15 border border-amber-400/35 text-amber-300 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                  <span>{t('landingEventsStripTitle', 'Eventos Estelares Mensuales')}</span>
                  <span className="text-xs font-semibold text-amber-300">· {t('landingEventsStripBadge', 'Actualizado cada mes')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                  {t(
                    'landingEventsStripDesc',
                    'Agenda astronómica curada mes a mes dentro de la app: lluvias de Perseidas, paso de meteoritos y cometas, eclipses, posiciones planetarias puntuales y efemérides clave.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BLOCK 2: THE 3 CORE SKY ZONES (E-COMMERCE SHOWCASE) ═══════════════════ */}
      <section id="destinos" className="relative z-10 py-20 lg:py-28 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header + Interactive Zone Segmented Control */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs sm:text-sm font-semibold text-sky-300 mb-2">
                {t('landingCatBadge', 'Catálogo principal de destinos')}
              </p>
              <h2
                className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight [text-wrap:balance]"
              >
                {t('landingCatHeadline', 'Tres universos de cielo oscuro, claramente diferenciados')}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
                {t(
                  'landingCatSubhead',
                  'Cada buscador de StellaWay responde a una certificación y experiencia geográfica distinta: desde reservas mediterráneas hasta fiordos árticos, con toda América incluida.'
                )}
              </p>
            </div>

            {/* 3 Separate Light-Glass Zone Filter Buttons */}
            <div
              role="group"
              aria-label={t('landingCatFilterAria', 'Filtrar tipos de zona')}
              className="flex flex-wrap items-center gap-3 self-start lg:self-auto"
            >
              {(
                [
                  {
                    id: 'starlight',
                    label: 'Starlight',
                    activeStyle:
                      'bg-amber-300/30 border-amber-200/80 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.28)]',
                  },
                  {
                    id: 'darksky',
                    label: 'DarkSky',
                    activeStyle:
                      'bg-sky-300/30 border-sky-200/80 text-sky-100 shadow-[0_0_24px_rgba(56,189,248,0.28)]',
                  },
                  {
                    id: 'auroras',
                    label: 'Auroras',
                    activeStyle:
                      'bg-emerald-300/30 border-emerald-200/80 text-emerald-100 shadow-[0_0_24px_rgba(16,185,129,0.28)]',
                  },
                ] as const
              ).map((tab) => {
                const isActive = activeZoneFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() =>
                      setActiveZoneFilter((prev) => (prev === tab.id ? 'all' : tab.id))
                    }
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold backdrop-blur-xl border transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? tab.activeStyle
                        : 'bg-white/15 hover:bg-white/25 border-white/30 hover:border-white/50 text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3 Differentiated Zone Showcase Cards (Compact) */}
          <div
            className={`grid gap-4 lg:gap-5 items-start ${
              visibleZones.length === 1
                ? 'grid-cols-1 max-w-md'
                : 'grid-cols-1 md:grid-cols-3'
            }`}
          >
            {visibleZones.map((zone) => (
              <article
                key={zone.id}
                className={`group rounded-xl bg-[#0B0F1A] border ${zone.accentBorder} ${zone.accentGlow} overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5`}
              >
                <div>
                  {/* Compact Photography */}
                  <div className="relative h-28 sm:h-32 md:h-36 w-full overflow-hidden bg-[#070A12]">
                    <MediaFrame
                      src={zone.image}
                      alt={zone.imageAlt}
                      fallbackTitle={zone.title}
                      accentClass={zone.accentText}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-[#0B0F1A]/20 to-transparent" />
                  </div>

                  {/* Card Body */}
                  <div className="px-3.5 pt-3.5 pb-2 sm:px-4 sm:pt-4 sm:pb-2.5">
                    <div className="flex items-center justify-between gap-2 text-[11px] mb-1">
                      <span className={`font-semibold ${zone.accentText}`}>
                        {zone.index}. {zone.network}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-0.5">
                      {zone.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 mb-2">{zone.tagline}</p>

                    <p className="text-[11px] sm:text-xs text-slate-300 leading-snug mb-2.5">
                      {zone.description}
                    </p>

                    <ul className="space-y-1 border-t border-white/10 pt-2 text-[11px] sm:text-xs text-slate-200">
                      {zone.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-1.5">
                          <span className={`${zone.accentText} font-bold shrink-0`} aria-hidden="true">
                            ·
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Footer: Metric + Action */}
                <div className="px-3.5 sm:px-4 py-2.5 border-t border-white/10 bg-black/25 flex flex-col gap-1.5">
                  <div className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                    <span className="text-slate-500">{zone.spotsPrefix} </span>
                    <span className="text-slate-200">{zone.spots}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <span className="font-mono tabular-nums text-[11px] font-semibold text-slate-300">
                      {zone.metric}
                    </span>
                    <button
                      type="button"
                      onClick={onEnterApp}
                      className={`px-3 py-1.5 rounded-lg ${zone.accentBg} text-slate-950 text-[11px] font-bold hover:brightness-110 transition-all cursor-pointer whitespace-nowrap shrink-0`}
                    >
                      {t('landingExploreZoneCta', 'Explorar zona →')}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Compact Red Light Explanation Block right below the Zone Cards */}
          <div className="mt-6 rounded-xl border border-red-500/30 bg-[#11080B]/85 backdrop-blur-xl px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="w-9 h-9 rounded-lg bg-[#FF3B30]/15 border border-[#FF3B30]/40 flex items-center justify-center shrink-0 mt-0.5">
                <span
                  className="material-symbols-outlined text-lg text-[#FF3B30]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  clear_day
                </span>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-red-400 mb-0.5">
                  {t('landingRedExplKicker', 'Luz Roja')}
                </p>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-0.5">
                  {t('landingRedExplTitle', 'Preserva tu visión nocturna sin perder la adaptación a la oscuridad')}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
                  {t(
                    'landingRedExplDesc',
                    'La luz roja (~650 nm) permite consultar mapas, previsiones y notas de noche sin contraer tus pupilas ni deslumbrar a otros observadores, manteniendo intacta la adaptación ocular a la oscuridad para ver estrellas tenues y nebulosas.'
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleNightVision}
              className={`px-3.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start md:self-center ${
                isNightVision
                  ? 'bg-[#FF3B30] border-red-300 text-white'
                  : 'bg-[#FF3B30]/15 hover:bg-[#FF3B30]/25 border-[#FF3B30]/45 text-red-200'
              }`}
            >
              {isNightVision ? t('landingRedExplOn', 'Desactivar Luz Roja') : t('landingRedExplOff', 'Activar Luz Roja')}
            </button>
          </div>

          {/* Compact Real-Time Astronomical Weather Forecast Block right below Red Light */}
          <div className="mt-3.5 rounded-xl border border-sky-400/30 bg-[#08101C]/85 backdrop-blur-xl px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            <div className="flex items-start gap-3 max-w-3xl">
              <div className="w-9 h-9 rounded-lg bg-sky-400/15 border border-sky-400/40 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-lg text-sky-300">
                  cloud_sync
                </span>
              </div>
              <div>
                <p className="text-[11px] font-semibold text-sky-300 mb-0.5">
                  {t('landingWeatherShowcaseKicker', 'Meteorología Astronómica · Tiempo Real y 7 Días')}
                </p>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight mb-0.5">
                  {t('landingWeatherShowcaseTitle', 'Previsión real por capas atmosféricas a 7 días vista')}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
                  {t(
                    'landingWeatherShowcaseDesc',
                    'Consulta en tiempo real y a 7 días vista la nubosidad por capas (bajas, medias y altas) vía Open-Meteo, seeing y transparencia vía 7Timer! Astro, viento, humedad y fase lunar real, más acceso directo a Clear Outside y Windy.'
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onEnterApp}
              className="px-3.5 py-2 rounded-lg border bg-sky-400/15 hover:bg-sky-400/25 border-sky-400/45 text-sky-200 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start md:self-center"
            >
              {t('landingWeatherShowcaseBtn', 'Ver clima en la App →')}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BLOCK 3: DAYTIME DIVERSITY & NIGHTTIME SKY ═══════════════════ */}
      <section
        id="dia-y-noche"
        className="relative z-10 py-10 lg:py-14 px-4 sm:px-8 border-y border-white/10 bg-[#0A0E19]/80 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Left: Compact Daytime Nature Travel Image + Direct Local SOS Assistance */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 h-40 sm:h-44 lg:h-48">
              <MediaFrame
                src={daytimeTravelImg}
                alt={t('landingDayImgAlt', 'Ruta diurna de senderismo entre montañas mediterráneas, costa y pueblos blancos')}
                fallbackTitle={t('landingDayImgKicker', 'Turismo de día y cielo de noche')}
                accentClass="text-amber-300"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06080F]/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-amber-300">
                    {t('landingDayImgKicker', 'Turismo de día y cielo de noche')}
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {t('landingDayImgTitle', 'Rutas de montaña, naturaleza y cielos oscuros')}
                  </p>
                </div>
                <span className="font-mono tabular-nums text-[11px] text-slate-200 bg-black/60 px-2.5 py-1 rounded-lg border border-white/15">
                  {t('landingDayImgPill', 'GPS + Google Maps')}
                </span>
              </div>
            </div>

            <div className="flex-1 rounded-2xl border border-rose-500/35 bg-[#12080C]/90 p-4 sm:p-5 flex flex-col justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-lg">emergency</span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-rose-400">
                    {t('landingDaySosKicker', 'Seguridad Nocturna SOS')}
                  </p>
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    {t('landingDaySosTitle', 'Acceso directo al 112 / 062 y tu ubicación GPS exacta')}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t(
                      'landingDaySosDesc',
                      'La app incluye acceso directo de llamada al 112 y 062 junto con tus coordenadas GPS reales en tiempo real (previo permiso de ubicación), listas para copiar o abrir en tu Google Maps.'
                    )}
                  </p>
                </div>
              </div>

              <div className="pt-2.5 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-sm text-rose-400">phone_in_talk</span>
                  <span>{t('landingDaySosHighlight1', 'Llamada directa al 112 y 062')}</span>
                </span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="material-symbols-outlined text-sm text-rose-400">my_location</span>
                  <span>{t('landingDaySosHighlight2', 'Coordenadas GPS exactas en vivo')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Compact Real 24h Travel & Observation Flow */}
          <div className="lg:col-span-6 flex flex-col justify-between py-1">
            <div>
              <p className="text-xs font-semibold text-amber-300 mb-1.5">
                {t('landingDayKicker', 'Planificación 24 Horas')}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight mb-2.5 [text-wrap:balance]">
                {t('landingDayTitle', 'Organiza tu ruta de día y la observación de noche')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                {t(
                  'landingDayDesc',
                  'Guarda fichas de miradores y eventos en tu dispositivo para consultarlos offline y abre su ubicación exacta en Google Maps cuando tengas cobertura.'
                )}
              </p>

              <div className="divide-y divide-white/10 border-y border-white/10">
                <div className="py-3 flex gap-3">
                  <span className="font-mono tabular-nums text-xs font-bold text-amber-300 shrink-0 pt-0.5">
                    01.
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">
                      {t('landingDayStep1Title', 'Elige enclave, altitud y clase Bortle')}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t(
                        'landingDayStep1Desc',
                        'Consulta altitud, SQM, coordenadas y poblaciones cercanas del catálogo Starlight y DarkSky.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="py-3 flex gap-3">
                  <span className="font-mono tabular-nums text-xs font-bold text-sky-300 shrink-0 pt-0.5">
                    02.
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">
                      {t('landingDayStep2Title', 'Revisa nubes por capas, viento y Seeing')}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t(
                        'landingDayStep2Desc',
                        'Comprueba el tiempo en vivo y a 7 días vía Open-Meteo, 7Timer! Astro, Clear Outside y Windy.'
                      )}
                    </p>
                  </div>
                </div>

                <div className="py-3 flex gap-3">
                  <span className="font-mono tabular-nums text-xs font-bold text-emerald-300 shrink-0 pt-0.5">
                    03.
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-0.5">
                      {t('landingDayStep3Title', 'Activa Luz Roja y fichas guardadas')}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {t(
                        'landingDayStep3Desc',
                        'Usa visión nocturna (~650 nm), tus coordenadas GPS reales y los miradores guardados localmente.'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onEnterApp}
                className="px-4 py-2 rounded-lg border border-white/25 hover:border-amber-300 text-white hover:text-amber-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('landingDayCta', 'Buscar Miradores →')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ BLOCK 4: ECLIPSE 2027 & ACCESS PASSES ═══════════════════ */}
      <section id="eclipse-2027" className="relative z-10 py-20 lg:py-28 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Target Audience Block ("Esta app es para ti si...") */}
            <div className="lg:col-span-7 rounded-2xl border border-amber-400/30 bg-[#0B0F1A] p-7 sm:p-10 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-300 mb-2">
                  {t('landingAudienceKicker', '¿Para quién es StellaWay?')}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2.5 [text-wrap:balance]">
                  {t('landingAudienceTitle', 'Esta app es para ti si…')}
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {t(
                    'landingAudienceSub',
                    'Tanto si sales con telescopio profesional como si buscas una noche mágica bajo las estrellas.'
                  )}
                </p>

                <ul className="space-y-3.5 mb-6">
                  {[
                    {
                      icon: 'photo_camera',
                      color: 'text-amber-300 bg-amber-400/15 border-amber-400/30',
                      title: t('landingAudienceItem1Title', 'Eres profesional o aficionado de la astrofotografía'),
                      desc: t(
                        'landingAudienceItem1Desc',
                        'y necesitas cielos Bortle 1–3, nubes por capas, seeing y transparencia antes de cargar el equipo.'
                      ),
                    },
                    {
                      icon: 'nights_stay',
                      color: 'text-sky-300 bg-sky-400/15 border-sky-400/30',
                      title: t('landingAudienceItem2Title', 'Eres amante del cielo nocturno y la astronomía'),
                      desc: t(
                        'landingAudienceItem2Desc',
                        'y quieres localizar miradores oscuros, consultar el cielo con Luz Roja (~650 nm) y preguntar a Stella IA.'
                      ),
                    },
                    {
                      icon: 'favorite',
                      color: 'text-rose-300 bg-rose-400/15 border-rose-400/30',
                      title: t('landingAudienceItem3Title', 'Buscas escapadas románticas o planes diferentes'),
                      desc: t(
                        'landingAudienceItem3Desc',
                        'combinando rutas de naturaleza de día con noches inolvidables contemplando la Vía Láctea.'
                      ),
                    },
                    {
                      icon: 'auto_awesome',
                      color: 'text-emerald-300 bg-emerald-400/15 border-emerald-400/30',
                      title: t('landingAudienceItem4Title', 'No quieres perderte ningún evento estelar'),
                      desc: t(
                        'landingAudienceItem4Desc',
                        'como lluvias de Perseidas, paso de meteoritos y cometas, eclipses, auroras o posiciones planetarias.'
                      ),
                    },
                    {
                      icon: 'verified',
                      color: 'text-amber-200 bg-amber-300/15 border-amber-300/30',
                      title: t('landingAudienceItem5Title', 'Prefieres ir sobre seguro a zonas certificadas'),
                      desc: t(
                        'landingAudienceItem5Desc',
                        'explorando reservas Starlight, santuarios DarkSky® International y enclaves polares reales con GPS.'
                      ),
                    },
                  ].map((item) => (
                    <li key={item.icon} className="flex items-start gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${item.color}`}
                      >
                        <span className="material-symbols-outlined text-base">{item.icon}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-snug">
                        <span className="font-semibold text-white">{item.title}</span>{' '}
                        {item.desc}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 mt-2 border-t border-amber-400/25">
                <p className="text-lg sm:text-xl leading-snug">
                  <span
                    className="italic font-semibold text-slate-100"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {t(
                      'landingAudienceFooterLead',
                      'Si alguna vez has mirado arriba deseando saber qué estás viendo y dónde verlo mejor,'
                    )}
                  </span>{' '}
                  <span
                    className="block mt-1.5 text-xl sm:text-2xl font-extrabold tracking-tight text-[#FFD700] drop-shadow-[0_0_14px_rgba(255,215,0,0.4)]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t('landingAudienceFooterBrand', 'StellaWay es tu app.')}
                  </span>
                </p>
              </div>
            </div>

            {/* E-Commerce Style Access & Plans Card */}
            <div
              id="acceso"
              className="lg:col-span-5 rounded-2xl border border-white/15 bg-[#0D111C] p-7 sm:p-10 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-sky-300 mb-2">
                  {t('landingAccessKicker', 'Acceso completo a StellaWay')}
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                  {t('landingAccessTitle', 'Elige tu pase de exploración')}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {t(
                    'landingAccessDesc',
                    'Desbloquea los 3 buscadores mundiales (Starlight, DarkSky y Auroras), el clima astronómico, el asistente Stella y la guía del Eclipse 2027.'
                  )}
                </p>

                <div className="space-y-3 mb-7">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/30">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {t('landingPlanFreeTitle', 'Prueba 48 horas')}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t('landingPlanFreeSubtitle', 'Acceso completo sin tarjeta')}
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-base font-bold text-emerald-300">
                      0,00 €
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/30">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {t('landingPlanMonthlyTitle', 'Pase Mensual Pro')}
                      </div>
                      <div className="text-xs text-slate-400">
                        {t('landingPlanMonthlySubtitle', 'Cancela cuando quieras')}
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-base font-bold text-white">
                      {t('landingPlanMonthlyPrice', '3,99 € / mes')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-amber-400/45 bg-amber-400/10">
                    <div>
                      <div className="text-sm font-semibold text-amber-200">
                        {t('landingPlanAnnualTitle', 'Pase Anual Pass')}
                      </div>
                      <div className="text-xs text-amber-200/75">
                        {t('landingPlanAnnualSubtitle', 'Ahorro superior al 58% todo el año')}
                      </div>
                    </div>
                    <span className="font-mono tabular-nums text-base font-bold text-amber-300">
                      {t('landingPlanAnnualPrice', '19,99 € / año')}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onEnterApp}
                id="v2-final-cta-btn"
                className="w-full py-3.5 px-6 rounded-xl bg-amber-300 hover:bg-amber-200 text-slate-950 text-sm sm:text-base font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t('landingCtaBtn', 'Comenzar Ahora')}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ QUIET FOOTER ═══════════════════ */}
      <footer className="relative z-10 border-t border-white/10 bg-[#05070D] py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <StellaLogo size="sm" />
            <span className="hidden sm:inline text-slate-600">·</span>
            <span>{t('landingFooterTagline', 'Astronomía · Astroturismo · Eclipse Total 2027')}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <a
              href="/terminos.html"
              onClick={(e) => {
                e.preventDefault();
                setLegalModal('terminos');
              }}
              className="hover:text-amber-300 transition-colors underline underline-offset-4 cursor-pointer"
            >
              {t('termsAndConditions', 'Términos y Condiciones')}
            </a>
            <a
              href="/privacidad.html"
              onClick={(e) => {
                e.preventDefault();
                setLegalModal('privacidad');
              }}
              className="hover:text-amber-300 transition-colors underline underline-offset-4 cursor-pointer"
            >
              {t('privacyPolicy', 'Política de Privacidad')}
            </a>
            <a
              href={withStripeLocale('https://buy.stripe.com/aFadRb3Flfzt9J91Kh1ZS07', language)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              {t('promoLink', 'promoción')}
            </a>
            <span>© {new Date().getFullYear()} StellaWay</span>
          </div>
        </div>
      </footer>

      {/* Legal Modal */}
      {legalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setLegalModal(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-white/15 bg-[#0B0F1A] p-6 sm:p-8 text-left shadow-2xl text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-bold text-amber-300">
                {legalModal === 'terminos'
                  ? t('termsAndConditions', 'Términos y Condiciones')
                  : t('privacyPolicy', 'Política de Privacidad')}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label={t('landingLegalCloseBtn', 'Cerrar')}
              >
                ✕
              </button>
            </div>

            {legalModal === 'terminos' ? (
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p className="text-xs text-slate-400">
                  {t('landingLegalTermsUpdated', 'Última actualización: Enero 2026 · Legislación aplicable: España y UE')}
                </p>
                <div>
                  <h4 className="font-semibold text-white mb-1">{t('landingLegalTerms1Title', '1. Objeto del Servicio')}</h4>
                  <p>{t('landingLegalTerms1Body', 'StellaWay proporciona herramientas de astroturismo, astronomía observacional, predicción meteorológica nocturna y cálculo de visibilidad del Eclipse Solar Total de 2027.')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{t('landingLegalTerms2Title', '2. Suscripciones y Pagos')}</h4>
                  <p>{t('landingLegalTerms2Body', 'El acceso a las funciones Pro se gestiona a través de la pasarela segura Stripe Payments. La prueba de 48h finaliza automáticamente al término de dicho plazo.')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{t('landingLegalTerms3Title', '3. Uso responsable en campo')}</h4>
                  <p>{t('landingLegalTerms3Body', 'La observación del Sol sin filtros homologados ISO 12312-2 provoca daños oculares irreversibles. Verifica las condiciones del terreno antes de desplazarte de noche.')}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p className="text-xs text-slate-400">
                  {t('landingLegalPrivSubtitle', 'Conforme al RGPD (Reglamento UE 2016/679)')}
                </p>
                <div>
                  <h4 className="font-semibold text-white mb-1">{t('landingLegalPriv1Title', '1. Datos tratados')}</h4>
                  <p>{t('landingLegalPriv1Body', 'Solo procesamos los datos necesarios para tu sesión, verificación SMS antifraude de 48h, favoritos offline y pasarela de pago Stripe/PayPal.')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{t('landingLegalPriv2Title', '2. Ubicación GPS y almacenamiento local')}</h4>
                  <p>{t('landingLegalPriv2Body', 'Las coordenadas GPS solicitadas para calcular distancias o clima se usan únicamente en tiempo real en tu sesión y no se venden a terceros.')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">{t('landingLegalPriv3Title', '3. Derechos del usuario')}</h4>
                  <p>{t('landingLegalPriv3Body', 'Puedes borrar datos locales offline, revocar permisos o tramitar la baja definitiva desde Ajustes o el Portal de Clientes Stripe.')}</p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-5 py-2 rounded-lg text-sm font-semibold bg-amber-300 text-slate-950 hover:bg-amber-200 transition-colors cursor-pointer"
              >
                {t('landingLegalCloseBtn', 'Cerrar')}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes v2CtaEntrance {
          0% {
            opacity: 0;
            transform: perspective(600px) translate3d(0, 14px, 0) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: perspective(600px) translate3d(0, 0, 0) scale(1);
          }
        }
        @keyframes v2CtaCornerTilt {
          0%, 100% {
            transform: perspective(600px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) translate3d(0, 0, 0);
          }
          25% {
            transform: perspective(600px) rotateX(6deg) rotateY(-5deg) rotateZ(-1.8deg) translate3d(0, -2px, 0);
          }
          50% {
            transform: perspective(600px) rotateX(-3deg) rotateY(0deg) rotateZ(0deg) translate3d(0, 1px, 0);
          }
          75% {
            transform: perspective(600px) rotateX(-6deg) rotateY(5deg) rotateZ(1.8deg) translate3d(0, -2px, 0);
          }
        }
        @keyframes v2CtaSheen {
          0%, 55% {
            transform: translate3d(-160%, 0, 0) skewX(-18deg);
            opacity: 0;
          }
          65% {
            opacity: 0.9;
          }
          85%, 100% {
            transform: translate3d(280%, 0, 0) skewX(-18deg);
            opacity: 0;
          }
        }
        .v2-cta-btn {
          will-change: transform;
          animation:
            v2CtaEntrance 500ms cubic-bezier(0.16, 1, 0.3, 1) both,
            v2CtaCornerTilt 3.4s ease-in-out 520ms infinite;
        }
        .v2-cta-btn:active {
          animation-play-state: paused;
          transform: scale(0.97);
        }
        .v2-cta-sheen {
          animation: v2CtaSheen 4.2s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .v2-cta-btn,
          .v2-cta-sheen {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};
