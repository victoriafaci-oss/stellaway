import React, { useState, useEffect, useRef } from 'react';
import { StellaLogo } from './StellaLogo';

interface LandingPageProps {
  onEnterApp: () => void;
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

// ---- Twinkling Stars canvas ----
function StarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Star = { x: number; y: number; r: number; alpha: number; delta: number; speed: number };
    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      delta: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
      speed: Math.random() * 0.3 + 0.05,
    }));

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.alpha += s.delta;
        if (s.alpha <= 0.05 || s.alpha >= 1) s.delta *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
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
      style={{ zIndex: 0 }}
    />
  );
}

// ---- Features data ----
const features = [
  {
    icon: '🔴',
    title: 'Modo Luz Roja (Visión Nocturna)',
    desc: 'Preserva la adaptación retiniana a la oscuridad absoluta bajo cielos Bortle 1-4. Consulta mapas estelares y telescopios sin cegarte ni deslumbrar a otros observadores.',
    color: 'from-rose-500/20 to-red-600/20',
    border: 'border-rose-400/30',
    glow: 'shadow-rose-500/20',
  },
  {
    icon: '🌑',
    title: 'Mapas Bortle Interactivos',
    desc: 'Descubre los mejores lugares de cielo oscuro en el Arco Mediterráneo con mapas de contaminación lumínica en tiempo real.',
    color: 'from-indigo-500/20 to-purple-600/20',
    border: 'border-indigo-400/30',
    glow: 'shadow-indigo-500/20',
  },
  {
    icon: '🔭',
    title: 'Eclipse Solar 2027',
    desc: 'Seguimiento en tiempo real del Gran Eclipse Total del 2 de agosto de 2027 en España. Rutas, campamentos y alertas.',
    color: 'from-amber-500/20 to-orange-600/20',
    border: 'border-amber-400/30',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: '✨',
    title: 'Asistente IA Stella',
    desc: 'Tu guía de astronomía personal con inteligencia artificial. Preguntas sobre telescopios, astrofotografía y efemérides.',
    color: 'from-cyan-500/20 to-sky-600/20',
    border: 'border-cyan-400/30',
    glow: 'shadow-cyan-500/20',
  },
  {
    icon: '🌤️',
    title: 'Clima Astronómico',
    desc: 'Condiciones de seeing, transparencia, índice de Bortle local y fases lunares integradas para planificar tus sesiones.',
    color: 'from-emerald-500/20 to-teal-600/20',
    border: 'border-emerald-400/30',
    glow: 'shadow-emerald-500/20',
  },
];

// ---- Testimonials ----
const testimonials = [
  {
    name: 'Carmen R.',
    role: 'Astrofotógrafa · Castellón',
    text: 'StellaWay me ayudó a encontrar el lugar perfecto para fotografiar la Vía Láctea. Los mapas Bortle son increíblemente precisos.',
    avatar: '🌟',
  },
  {
    name: 'Miguel T.',
    role: 'Aficionado · Valencia',
    text: 'Llevo años buscando una app que uniera clima, mapas y el Eclipse 2027. ¡Por fin existe! Stella IA me resolvió todas mis dudas.',
    avatar: '🔭',
  },
  {
    name: 'Laura M.',
    role: 'Guía Astroturismo · Teruel',
    text: 'Imprescindible para organizar mis salidas. Ahora puedo elegir el mejor sitio para ver el eclipse de 2027 con la previsión del tiempo.',
    avatar: '🌙',
  },
];

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

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const countdown = useCountdown();
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

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

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Dynamic star background */}
      <StarsCanvas />

      {/* Nebula gradient overlays */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 20% 10%, rgba(124,77,255,0.18) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(255,140,0,0.12) 0%, transparent 55%)',
          zIndex: 1,
        }}
      />

      {/* ═══════════════════ NAV ═══════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{
          background: 'rgba(14, 8, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="flex items-center gap-3">
          <StellaLogo size="sm" />
        </div>
        <div className="flex items-center gap-8 text-sm text-white/70">
          <a href="#features" className="hover:text-amber-300 transition-colors">Funciones</a>
          <a href="#eclipse" className="hover:text-amber-300 transition-colors">Eclipse 2027</a>
          <a href="#testimonios" className="hover:text-amber-300 transition-colors hidden sm:inline">Comunidad</a>
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
          <span>🌑</span> Gran Eclipse Total · 2 Agosto 2027 · España
        </div>

        <h1
          className="font-luxury text-5xl md:text-7xl font-bold mb-6 leading-tight"
          style={{
            color: '#ffffff',
            textShadow: '0 0 40px rgba(255,215,0,0.3)',
            maxWidth: 800,
          }}
        >
          El cielo nocturno
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #FFD700, #FFA500, #FFE55C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            en tu bolsillo
          </span>
        </h1>

        <p
          className="text-lg md:text-xl mb-10 max-w-2xl leading-relaxed"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          Mapas Bortle, asistente IA, clima astronómico y el mayor evento celeste del siglo —
          el <strong className="text-white">Eclipse Total Solar 2027</strong> — todo en una sola app.
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
            <span>Lo Quiero</span>
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
            Ver funciones ↓
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
            ⏳ Cuenta regresiva al Eclipse Total
          </p>
          <div className="flex flex-wrap justify-center items-start gap-2 sm:gap-4 md:gap-6">
            <CountCell value={countdown.days} label="Días" />
            <span className="text-amber-400/60 text-3xl font-thin mt-3">:</span>
            <CountCell value={countdown.hours} label="Horas" />
            <span className="text-amber-400/60 text-3xl font-thin mt-3">:</span>
            <CountCell value={countdown.minutes} label="Min" />
            <span className="text-amber-400/60 text-3xl font-thin mt-3">:</span>
            <CountCell value={countdown.seconds} label="Seg" />
          </div>
          <p className="text-xs text-white/35">2 Agosto 2027 · 10:45h (hora española) · España</p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40"
          style={{ animation: 'bounce 2s infinite' }}
        >
          <span className="text-xs text-white/60 uppercase tracking-widest">Descubrir</span>
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
              ✦ Funciones
            </span>
            <h2
              className="font-luxury text-4xl md:text-5xl font-bold mb-4"
              style={{ color: '#fff' }}
            >
              Todo lo que necesitas
              <span className="block text-violet-300/80">para conquistar el cielo</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Desde mapas interactivos hasta inteligencia artificial astronómica, StellaWay es tu compañero definitivo bajo las estrellas.
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
                🌑 Evento del Siglo
              </span>
              <h2
                className="font-luxury text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ lineHeight: 1.25 }}
              >
                Gran Eclipse Total Solar
                <span className="block text-amber-300">2 Agosto 2027</span>
              </h2>
              <p className="text-white/60 mb-6 leading-relaxed">
                El eclipse solar total más esperado del siglo será visible principalmente en la franja sur: Cádiz, Ceuta, Melilla, Málaga, costa de Granada y Almería. StellaWay te lleva al mejor punto de observación con rutas, clima en tiempo real y campamentos astroturísticos.
              </p>
              <ul className="space-y-2">
                {[
                  '📍 Zona de totalidad: Cádiz, Málaga, Granada (costa), Almería (costa), Ceuta y Melilla.',
                  '⏱ Duración de totalidad: hasta 4 min 23 seg',
                  '🔭 Campamentos de observación exclusivos',
                  '📡 Alertas y telemetría en tiempo real',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-white/70">
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
                  <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Luz Roja</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                Activación con 1 Clic
              </span>
            </div>

            {/* Explanation Content */}
            <div className="lg:w-3/5">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
                style={{ background: 'rgba(239,68,68,0.18)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.4)' }}
              >
                🔴 Óptica Astronómica
              </span>
              <h2 className="font-luxury text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                Botón de Luz Roja
                <span className="block text-red-400">Adaptado a la Visión Nocturna</span>
              </h2>
              <p className="text-white/70 mb-5 leading-relaxed text-sm sm:text-base">
                El ojo humano tarda entre <strong>20 y 30 minutos</strong> en sintetizar <em>rodopsina</em> y adaptarse por completo a la oscuridad profunda de cielos Bortle 1 a 4. Un solo destello de luz blanca destruye esa adaptación al instante.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-black/40 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-xs sm:text-sm mb-1">
                    <span>👁️</span> Cero Deslumbramiento Retiniano
                  </div>
                  <p className="text-white/55 text-xs">
                    La longitud de onda roja (~650nm) no satura los bastones oculares, permitiendo leer mapas y efemérides sin perder la visión de objetos débiles.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-300 font-bold text-xs sm:text-sm mb-1">
                    <span>🔭</span> Protocolo Starlight
                  </div>
                  <p className="text-white/55 text-xs">
                    Respeta a tus compañeros de observación y fotógrafos de cielo profundo en campamentos y quedadas astronómicas.
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
              Lo que dicen nuestros exploradores
            </h2>
            <p className="text-white/40 text-sm">Astrónomos, astrofotógrafos y guías de astroturismo</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
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
                <p className="text-white/65 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
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
            El universo te espera
          </h2>
          <p className="text-white/55 mb-8 text-lg max-w-xl mx-auto leading-relaxed">
            Únete a la comunidad de astrónomos que ya usan StellaWay para explorar el cosmos. Comienza gratis hoy — el Gran Eclipse 2027 se acerca.
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
            <span>Lo Quiero</span>
            <span className="text-xl">→</span>
          </button>
          <p className="mt-4 text-white/30 text-xs">Sin tarjeta de crédito · 48h de prueba gratuita</p>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer
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
          Astronomía · Astroturismo · Eclipse Total 2027 · España
        </p>
        <p className="text-white/20 text-xs">
          © {new Date().getFullYear()} StellaWay · Reserva Natural Starlight · Hecho con ♥ bajo el cielo nocturno
        </p>
      </footer>

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
