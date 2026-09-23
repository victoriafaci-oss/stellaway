import { SupportedLanguage } from './translations';

export interface LandingTranslations {
  nav: {
    features: string;
    certifiedSkies: string;
    eclipse: string;
    community: string;
    enter: string;
    selectLanguage: string;
    redMode: string;
    redModeActive: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    desc: string;
    ctaPrimary: string;
    ctaSecondary: string;
    countdownBadge: string;
    countdownDays: string;
    countdownHours: string;
    countdownMin: string;
    countdownSec: string;
    countdownSub: string;
    discover: string;
  };
  features: {
    tag: string;
    title1: string;
    title2: string;
    desc: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
  };
  certified: {
    tag: string;
    title1: string;
    title2: string;
    desc: string;
    tabAll: string;
    tabStarlight: string;
    tabDarkSky: string;
    tabAstrophoto: string;
    starlightTitle: string;
    starlightOrg: string;
    starlightDesc: string;
    darkskyTitle: string;
    darkskyOrg: string;
    darkskyDesc: string;
    astroturismoTitle: string;
    astroturismoOrg: string;
    astroturismoDesc: string;
    referenceEnclaves: string;
    ctaBannerTitle: string;
    ctaBannerDesc: string;
    ctaBannerBtn: string;
  };
  eclipse: {
    tag: string;
    title1: string;
    title2: string;
    desc: string;
    b1: string;
    b2: string;
    b3: string;
    b4: string;
    b5: string;
  };
  nightVision: {
    tag: string;
    title1: string;
    title2: string;
    desc: string;
    btnLabel: string;
    btnClick: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
  };
  finalCta: {
    title: string;
    desc: string;
    btn: string;
    guarantee: string;
  };
  footer: {
    subtitle: string;
    termsNotice: string;
    termsLink: string;
    privacyLink: string;
    rights: string;
  };
}

export interface PaywallTranslations {
  welcomeBanner: {
    title: string;
    subtitle: string;
    unlockBtn: string;
    enterBtn: string;
    hasAccess: string;
    lockedAccess: string;
  };
  gateways: {
    title: string;
    desc: string;
    connected: string;
  };
  plansHeader: {
    title: string;
    subtitle: string;
    langSelectTitle: string;
  };
  planFree: {
    badge: string;
    chosenBadge: string;
    title: string;
    desc: string;
    price: string;
    period: string;
    smsNote: string;
    f1: string;
    f2: string;
    f3: string;
    btnSelect: string;
    btnActive: string;
  };
  planMonthly: {
    badge: string;
    chosenBadge: string;
    title: string;
    desc: string;
    price: string;
    period: string;
    securityNote: string;
    f1: string;
    f2: string;
    f3: string;
    btnSelect: string;
  };
  planAnnual: {
    ribbon: string;
    badge: string;
    chosenBadge: string;
    title: string;
    desc: string;
    price: string;
    period: string;
    monthlyEquivalent: string;
    f1: string;
    f2: string;
    f3: string;
    btnSelect: string;
  };
  smsVerification: {
    title: string;
    desc: string;
    activeTitle: string;
    activeDesc: string;
    enterAppBtn: string;
    phoneLabel: string;
    phonePlaceholder: string;
    sendSmsBtn: string;
    sendingSmsBtn: string;
    codeSentNotice: string;
    enterCodePrompt: string;
    simulatedBanner: string;
    autoFillBtn: string;
    codeLabel: string;
    changePhoneBtn: string;
    verifyCodeBtn: string;
    verifyingBtn: string;
    stripeDirectFreeNotice: string;
    stripeDirectFreeBtn: string;
  };
  checkout: {
    tabStripe: string;
    tabPayPal: string;
    cardDetailsTitle: string;
    cardHolderLabel: string;
    cardHolderPlaceholder: string;
    cardNumberLabel: string;
    expiryLabel: string;
    cvcLabel: string;
    zipLabel: string;
    payWithStripe: string;
    processingStripe: string;
    directStripeNotice: string;
    directStripeBtn: string;
    paypalTitle: string;
    paypalDesc: string;
    payWithPayPal: string;
    connectingPayPal: string;
    successTitle: string;
    successRef: string;
    planLabel: string;
    amountLabel: string;
    statusLabel: string;
    activeStatus: string;
    enterDashboardBtn: string;
  };
}

export const LANDING_TRANSLATIONS: Record<SupportedLanguage, LandingTranslations> = {
  es: {
    nav: {
      features: 'Funciones',
      certifiedSkies: 'Cielos Certificados',
      eclipse: 'Eclipse 2027',
      community: 'Comunidad',
      enter: 'Entrar',
      selectLanguage: 'Seleccionar Idioma',
      redMode: 'RED',
      redModeActive: 'Luz Roja Activa',
    },
    hero: {
      badge: '🌑 Gran Eclipse Total · 2 Agosto 2027 · España',
      title1: 'El cielo nocturno',
      title2: 'en tu bolsillo',
      desc: 'Zonas certificadas Starlight y DarkSky International, mapas Bortle, astrofotografía recomendada y el mayor evento celeste del siglo — el Eclipse Total Solar 2027 — todo en una sola app.',
      ctaPrimary: 'Lo Quiero',
      ctaSecondary: 'Ver funciones ↓',
      countdownBadge: '⏳ Cuenta regresiva al Eclipse Total',
      countdownDays: 'Días',
      countdownHours: 'Horas',
      countdownMin: 'Min',
      countdownSec: 'Seg',
      countdownSub: '2 Agosto 2027 · 10:45h (hora española) · España',
      discover: 'Descubrir',
    },
    features: {
      tag: '✦ Funciones',
      title1: 'Todo lo que necesitas',
      title2: 'para conquistar el cielo',
      desc: 'Desde mapas interactivos hasta inteligencia artificial astronómica, StellaWay es tu compañero definitivo bajo las estrellas.',
      f1Title: 'Seeing & Clima en Directo',
      f1Desc: 'Telemetría atmosférica, nubosidad, humedad, viento y transparencia con índice Bortle en tiempo real.',
      f2Title: 'Mapas de Contaminación Lumínica',
      f2Desc: 'Explora zonas oscuras Bortle 1 a 4 ideales para astrofotografía y observación de espacio profundo.',
      f3Title: 'Energía Planetaria & Efemérides',
      f3Desc: 'Calendario astronómico dinámico, tránsitos, fases lunares y lluvias de estrellas sincronizadas.',
      f4Title: 'Stella IA: Asistente Estelar',
      f4Desc: 'Inteligencia artificial especializada en astronomía, coordenadas celestes y puesta a punto de telescopios.',
    },
    certified: {
      tag: 'Estándares Internacionales de Calidad Celeste',
      title1: 'Zonas Certificadas & Cielos Oscuros',
      title2: 'Guía Oficial para la Observación Nocturna',
      desc: 'Explora enclaves avalados por auditorías científicas mundiales y seleccionados por su oscuridad estelar, transparencia atmosférica y protección medioambiental.',
      tabAll: 'Todas las Categorías',
      tabStarlight: 'Starlight',
      tabDarkSky: 'DarkSky Int.',
      tabAstrophoto: 'Astrofotografía',
      starlightTitle: 'Reservas & Destinos Starlight',
      starlightOrg: 'Fundación Starlight · Respaldado por UNESCO e IAU',
      starlightDesc: 'Certificaciones que acreditan espacios con cielos de excepcional nitidez y compromiso con la divulgación científica y el turismo sostenible.',
      darkskyTitle: 'Dark Sky Places Internacionales',
      darkskyOrg: 'DarkSky International (IDA) · Estándar Global',
      darkskyDesc: 'Espacios naturales reconocidos globalmente por la preservación estricta de la oscuridad nocturna frente a la contaminación lumínica.',
      astroturismoTitle: 'Miradores Astroturísticos & Fotografía',
      astroturismoOrg: 'Red Ibérica de Astrofotografía y Observación',
      astroturismoDesc: 'Enclaves estratégicos con acceso señalizado, horizontes despejados de 360° y condiciones óptimas para capturar la Vía Láctea.',
      referenceEnclaves: 'Enclaves de Referencia en la App:',
      ctaBannerTitle: 'Buscador y Ficha Detallada de Cada Destino',
      ctaBannerDesc: 'Filtra por certificación oficial, índice de Bortle (1 a 4), altitud, orientación estelar y recomendaciones de equipo astronómico para tus escapadas.',
      ctaBannerBtn: 'Explorar Zonas',
    },
    eclipse: {
      tag: '🌑 Evento del Siglo',
      title1: 'Gran Eclipse Total Solar',
      title2: '2 Agosto 2027',
      desc: 'El eclipse solar total más esperado del siglo será visible en España principalmente en su franja sur: Cádiz, Ceuta, Melilla, Málaga, costa de Granada y Almería (consulta tu zona en la app para más información de visibilidad). StellaWay te lleva al mejor punto de observación con rutas, clima en tiempo real y campamentos astroturísticos.',
      b1: '📍 Zona de totalidad: Cádiz, Málaga, Granada (costa), Almería (costa), Ceuta y Melilla.',
      b2: '🗺️ Consulta tu zona exacta en la app para porcentaje y horarios de visibilidad',
      b3: '⏱ Duración de totalidad: hasta 4 min 23 seg',
      b4: '🔭 Campamentos de observación exclusivos',
      b5: '📡 Alertas y telemetría en tiempo real',
    },
    nightVision: {
      tag: '🔴 Óptica Astronómica',
      title1: 'Botón de Luz Roja',
      title2: 'Adaptado a la Visión Nocturna',
      desc: 'El ojo humano tarda entre 20 y 30 minutos en sintetizar rodopsina y adaptarse por completo a la oscuridad profunda de cielos Bortle 1 a 4. Un solo destello de luz blanca destruye esa adaptación al instante.',
      btnLabel: 'Luz Roja',
      btnClick: 'Activación con 1 Clic',
      card1Title: 'Cero Deslumbramiento Retiniano',
      card1Desc: 'La longitud de onda roja (~650nm) no satura los bastones oculares, permitiendo leer mapas y efemérides sin perder la visión de objetos débiles.',
      card2Title: 'Protocolo Starlight',
      card2Desc: 'Respeta a tus compañeros de observación y fotógrafos de cielo profundo en campamentos y quedadas astronómicas.',
    },
    testimonials: {
      title: 'Lo que dicen nuestros exploradores',
      subtitle: 'Astrónomos, astrofotógrafos y guías de astroturismo',
    },
    finalCta: {
      title: 'El universo te espera',
      desc: 'Únete a la comunidad de astrónomos que ya usan StellaWay para explorar el cosmos. Comienza gratis hoy — el Gran Eclipse 2027 se acerca.',
      btn: 'Lo Quiero',
      guarantee: 'Sin tarjeta de crédito · 48h de prueba gratuita',
    },
    footer: {
      subtitle: 'Astronomía · Astroturismo · Eclipse Total 2027 · España',
      termsNotice: 'Al realizar el pago, aceptas nuestros',
      termsLink: 'Términos y Condiciones',
      privacyLink: 'Política de Privacidad',
      rights: 'Todos los derechos reservados.',
    },
  },

  en: {
    nav: {
      features: 'Features',
      certifiedSkies: 'Certified Skies',
      eclipse: 'Eclipse 2027',
      community: 'Community',
      enter: 'Enter App',
      selectLanguage: 'Select Language',
      redMode: 'RED',
      redModeActive: 'Red Light Active',
    },
    hero: {
      badge: '🌑 Great Total Eclipse · August 2, 2027 · Spain',
      title1: 'The night sky',
      title2: 'in your pocket',
      desc: 'Starlight and DarkSky International certified reserves, Bortle dark maps, astrophotography spots and the century’s biggest celestial spectacle — the 2027 Total Solar Eclipse — all in one app.',
      ctaPrimary: 'Get It Now',
      ctaSecondary: 'Explore Features ↓',
      countdownBadge: '⏳ Countdown to the Total Eclipse',
      countdownDays: 'Days',
      countdownHours: 'Hours',
      countdownMin: 'Min',
      countdownSec: 'Sec',
      countdownSub: 'August 2, 2027 · 10:45 AM (Spanish Time) · Spain',
      discover: 'Discover',
    },
    features: {
      tag: '✦ Features',
      title1: 'Everything you need',
      title2: 'to conquer the stars',
      desc: 'From interactive dark-sky charts to astronomical AI guidance, StellaWay is your ultimate stargazing companion.',
      f1Title: 'Live Seeing & Weather',
      f1Desc: 'Atmospheric telemetry, cloud cover, humidity, wind and real-time Bortle transparency.',
      f2Title: 'Light Pollution Maps',
      f2Desc: 'Locate pristine Bortle 1 to 4 dark zones perfect for deep-sky imaging and observation.',
      f3Title: 'Planetary Energy & Ephemeris',
      f3Desc: 'Dynamic celestial calendar, transits, lunar phases and synced meteor showers.',
      f4Title: 'Stella AI: Starlight Assistant',
      f4Desc: 'AI specialized in celestial coordinates, telescope collimation and eclipse route planning.',
    },
    certified: {
      tag: 'International Celestial Quality Standards',
      title1: 'Certified Reserves & Dark Skies',
      title2: 'Official Nighttime Observation Guide',
      desc: 'Explore sanctuaries validated by international scientific audits for their pristine darkness, atmospheric clarity, and environmental conservation.',
      tabAll: 'All Categories',
      tabStarlight: 'Starlight',
      tabDarkSky: 'DarkSky Int.',
      tabAstrophoto: 'Astrophotography',
      starlightTitle: 'Starlight Reserves & Destinations',
      starlightOrg: 'Starlight Foundation · Endorsed by UNESCO & IAU',
      starlightDesc: 'Accredited spots offering exceptional celestial clarity, science communication and sustainable astrotourism.',
      darkskyTitle: 'International Dark Sky Places',
      darkskyOrg: 'DarkSky International (IDA) · Global Standard',
      darkskyDesc: 'Protected natural areas celebrated worldwide for keeping skies completely shielded from light pollution.',
      astroturismoTitle: 'Astrotourism Viewpoints & Imaging',
      astroturismoOrg: 'Iberian Astrophotography & Observation Network',
      astroturismoDesc: 'Scenic vantage points featuring marked access, 360° clear horizons, and prime conditions for capturing the Milky Way.',
      referenceEnclaves: 'Featured Spots in the App:',
      ctaBannerTitle: 'Destination Search & In-Depth Spot Cards',
      ctaBannerDesc: 'Filter by official certification, Bortle index (1 to 4), elevation, celestial orientation and equipment recommendations.',
      ctaBannerBtn: 'Explore Spots',
    },
    eclipse: {
      tag: '🌑 Event of the Century',
      title1: 'Great Total Solar Eclipse',
      title2: 'August 2, 2027',
      desc: 'The most anticipated total solar eclipse of our era will grace southern Spain: Cádiz, Ceuta, Melilla, Málaga, Granada coast and Almería. StellaWay guides you to the finest viewpoints with live weather and exclusive stargazing camps.',
      b1: '📍 Totality corridor: Cádiz, Málaga, Granada coast, Almería coast, Ceuta & Melilla.',
      b2: '🗺️ Check your exact location in the app for eclipse timing and obscuration percentage',
      b3: '⏱ Totality duration: up to 4 min 23 sec',
      b4: '🔭 Exclusive expedition & observation camps',
      b5: '📡 Real-time weather alerts and telemetry',
    },
    nightVision: {
      tag: '🔴 Astronomical Optics',
      title1: 'Red Light Mode',
      title2: 'Preserving Night Vision',
      desc: 'Human eyes require 20 to 30 minutes to synthesize rhodopsin and fully adapt to Bortle 1–4 dark skies. A single flash of white light instantly destroys that adaptation.',
      btnLabel: 'Red Light',
      btnClick: '1-Click Toggle',
      card1Title: 'Zero Retinal Glare',
      card1Desc: 'Red wavelengths (~650nm) bypass retinal rod saturation, allowing you to read star charts without losing faint celestial objects.',
      card2Title: 'Starlight Field Protocol',
      card2Desc: 'Respect fellow observers and deep-sky astrophotographers at star parties and dark-sky expeditions.',
    },
    testimonials: {
      title: 'What our explorers say',
      subtitle: 'Astronomers, astrophotographers and astrotourism guides',
    },
    finalCta: {
      title: 'The cosmos is calling you',
      desc: 'Join thousands of stargazers already using StellaWay to unlock the night sky. Start your free trial today — the 2027 Eclipse is coming.',
      btn: 'Get It Now',
      guarantee: 'No credit card required · 48h free trial',
    },
    footer: {
      subtitle: 'Astronomy · Astrotourism · Total Eclipse 2027 · Spain',
      termsNotice: 'By continuing to payment, you agree to our',
      termsLink: 'Terms and Conditions',
      privacyLink: 'Privacy Policy',
      rights: 'All rights reserved.',
    },
  },

  de: {
    nav: {
      features: 'Funktionen',
      certifiedSkies: 'Zertifizierte Himmel',
      eclipse: 'Finsternis 2027',
      community: 'Community',
      enter: 'App öffnen',
      selectLanguage: 'Sprache wählen',
      redMode: 'ROT',
      redModeActive: 'Rotlicht aktiv',
    },
    hero: {
      badge: '🌑 Große Totale Sonnenfinsternis · 2. August 2027 · Spanien',
      title1: 'Der Nachthimmel',
      title2: 'in deiner Hand',
      desc: 'Starlight- und DarkSky International-zertifizierte Gebiete, Bortle-Karten, Astrofotografie-Tipps und das größte Himmelsereignis des Jahrhunderts — die totale Sonnenfinsternis 2027.',
      ctaPrimary: 'Jetzt Starten',
      ctaSecondary: 'Funktionen ansehen ↓',
      countdownBadge: '⏳ Countdown zur totalen Sonnenfinsternis',
      countdownDays: 'Tage',
      countdownHours: 'Std',
      countdownMin: 'Min',
      countdownSec: 'Sek',
      countdownSub: '2. August 2027 · 10:45 Uhr (MEZ) · Spanien',
      discover: 'Entdecken',
    },
    features: {
      tag: '✦ Funktionen',
      title1: 'Alles, was du brauchst',
      title2: 'um die Sterne zu erobern',
      desc: 'Von interaktiven Sternenkarten bis zu astronomischer KI-Beratung ist StellaWay dein ultimativer Begleiter unter dem Nachthimmel.',
      f1Title: 'Live-Seeing & Wetter',
      f1Desc: 'Atmosphärische Telemetrie, Bewölkung, Feuchtigkeit und Bortle-Transparenz in Echtzeit.',
      f2Title: 'Lichtverschmutzungskarten',
      f2Desc: 'Finde unberührte Bortle 1 bis 4 Zonen für Deep-Sky-Beobachtung und Astrofotografie.',
      f3Title: 'Planetare Energie & Ephemeriden',
      f3Desc: 'Dynamischer Himmelskalender, Planetenübergänge, Mondphasen und Meteorschauer.',
      f4Title: 'Stella KI: Sternen-Assistentin',
      f4Desc: 'Spezialisierte KI für Teleskope, Himmelskoordinaten und Finsternisrouten.',
    },
    certified: {
      tag: 'Internationale Himmelsqualitätsstandards',
      title1: 'Zertifizierte Dunkelgebiete',
      title2: 'Offizieller Guide für Nachtbeobachtungen',
      desc: 'Entdecke Orte, die durch weltweite wissenschaftliche Audits für außergewöhnliche Dunkelheit und Naturschutz ausgezeichnet wurden.',
      tabAll: 'Alle Kategorien',
      tabStarlight: 'Starlight',
      tabDarkSky: 'DarkSky Int.',
      tabAstrophoto: 'Astrofotografie',
      starlightTitle: 'Starlight-Reservate & Destinationen',
      starlightOrg: 'Starlight Foundation · Unterstützt von UNESCO & IAU',
      starlightDesc: 'Zertifizierte Gebiete mit außergewöhnlicher Himmelsklarheit und nachhaltigem Astrotourismus.',
      darkskyTitle: 'Dark Sky Places International',
      darkskyOrg: 'DarkSky International (IDA) · Weltweiter Standard',
      darkskyDesc: 'Schutzgebiete, die für die strikte Erhaltung natürlicher Dunkelheit geehrt wurden.',
      astroturismoTitle: 'Aussichtspunkte & Astrofotografie',
      astroturismoOrg: 'Iberisches Astrofotografie-Netzwerk',
      astroturismoDesc: 'Strategische Orte mit 360°-Horizont und perfekten Bedingungen für die Milchstraße.',
      referenceEnclaves: 'Referenzorte in der App:',
      ctaBannerTitle: 'Suchfunktion und Detailkarten jedes Ziels',
      ctaBannerDesc: 'Filtere nach Zertifizierung, Bortle-Skala (1–4), Höhe und Ausrüstungsempfehlungen.',
      ctaBannerBtn: 'Zonen Erkunden',
    },
    eclipse: {
      tag: '🌑 Jahrhundert-Ereignis',
      title1: 'Große Totale Sonnenfinsternis',
      title2: '2. August 2027',
      desc: 'Die am meisten erwartete totale Sonnenfinsternis des Jahrhunderts in Südspanien: Cádiz, Málaga, Granada-Küste, Almería, Ceuta und Melilla.',
      b1: '📍 Totalitätszone: Cádiz, Málaga, Granada-Küste, Almería, Ceuta & Melilla.',
      b2: '🗺️ Prüfe deinen Standort in der App für genaue Zeiten und Bedeckungsgrad',
      b3: '⏱ Dauer der Totalität: bis zu 4 Min 23 Sek',
      b4: '🔭 Exklusive Beobachtungscamps',
      b5: '📡 Echtzeit-Wetter und Telemetrie-Warnungen',
    },
    nightVision: {
      tag: '🔴 Astronomische Optik',
      title1: 'Rotlicht-Modus',
      title2: 'Nachtsicht erhalten',
      desc: 'Das menschliche Auge benötigt 20 bis 30 Minuten, um sich an die Dunkelheit anzupassen. Weißes Licht zerstört diese Dunkeladaptation sofort.',
      btnLabel: 'Rotlicht',
      btnClick: '1-Klick Aktivierung',
      card1Title: 'Keine Blendung der Netzhaut',
      card1Desc: 'Rotes Licht (~650nm) schont die Stäbchenzellen, sodass Sternkarten lesbar bleiben.',
      card2Title: 'Starlight-Protokoll',
      card2Desc: 'Rücksicht auf andere Beobachter und Astrofotografen im Beobachtungscamp.',
    },
    testimonials: {
      title: 'Was unsere Entdecker sagen',
      subtitle: 'Astronomen, Astrofotografen und Astrotourismus-Guides',
    },
    finalCta: {
      title: 'Das Universum wartet auf dich',
      desc: 'Werde Teil unserer Astronomie-Community. Starte noch heute kostenlos — das Jahrhundertereignis 2027 naht.',
      btn: 'Jetzt Starten',
      guarantee: 'Keine Kreditkarte erforderlich · 48h kostenlose Testversion',
    },
    footer: {
      subtitle: 'Astronomie · Astrotourismus · Totale Finsternis 2027 · Spanien',
      termsNotice: 'Mit der Zahlung akzeptierst du unsere',
      termsLink: 'Allgemeinen Geschäftsbedingungen',
      privacyLink: 'Datenschutzerklärung',
      rights: 'Alle Rechte vorbehalten.',
    },
  },

  fr: {
    nav: {
      features: 'Fonctionnalités',
      certifiedSkies: 'Ciels Certifiés',
      eclipse: 'Éclipse 2027',
      community: 'Communauté',
      enter: 'Accéder',
      selectLanguage: 'Choisir la langue',
      redMode: 'ROUGE',
      redModeActive: 'Lumière rouge active',
    },
    hero: {
      badge: '🌑 Grande Éclipse Totale · 2 Août 2027 · Espagne',
      title1: 'Le ciel étoilé',
      title2: 'dans votre poche',
      desc: 'Zones certifiées Starlight et DarkSky International, cartes Bortle, spots d’astrophotographie et le plus grand événement céleste du siècle — l’Éclipse Totale de 2027.',
      ctaPrimary: 'Commencer',
      ctaSecondary: 'Voir les fonctions ↓',
      countdownBadge: '⏳ Compte à rebours de l’Éclipse Totale',
      countdownDays: 'Jours',
      countdownHours: 'Heures',
      countdownMin: 'Min',
      countdownSec: 'Sec',
      countdownSub: '2 Août 2027 · 10h45 (heure espagnole) · Espagne',
      discover: 'Découvrir',
    },
    features: {
      tag: '✦ Fonctionnalités',
      title1: 'Tout ce dont vous avez besoin',
      title2: 'pour explorer le cosmos',
      desc: 'Des cartes interactives à l’intelligence artificielle astronomique, StellaWay est votre compagnon sous les étoiles.',
      f1Title: 'Seeing & Météo en Direct',
      f1Desc: 'Télémétrie atmosphérique, couverture nuageuse, humidité et transparence Bortle en temps réel.',
      f2Title: 'Cartes de Pollution Lumineuse',
      f2Desc: 'Trouvez les ciels Bortle 1 à 4 idéaux pour la photographie du ciel profond.',
      f3Title: 'Énergie Planétaire & Éphémérides',
      f3Desc: 'Calendrier astronomique dynamique, transits, phases lunaires et météores.',
      f4Title: 'Stella IA: Guide Céleste',
      f4Desc: 'Intelligence artificielle experte en télescopes, coordonnées et observation d’éclipses.',
    },
    certified: {
      tag: 'Normes Internationales de Qualité Céleste',
      title1: 'Zones Certifiées & Ciels Noirs',
      title2: 'Guide Officiel pour l’Observation Nocturne',
      desc: 'Explorez des sanctuaires protégés et audités pour leur pureté atmosphérique et leur obscurité exceptionnelle.',
      tabAll: 'Toutes les catégories',
      tabStarlight: 'Starlight',
      tabDarkSky: 'DarkSky Int.',
      tabAstrophoto: 'Astrophotographie',
      starlightTitle: 'Réserves & Destinations Starlight',
      starlightOrg: 'Fondation Starlight · Soutenu par l’UNESCO et l’IAU',
      starlightDesc: 'Lieux d’exception garantissant une pureté céleste et un astrotourisme durable.',
      darkskyTitle: 'Réserves DarkSky Internationales',
      darkskyOrg: 'DarkSky International (IDA) · Référence mondiale',
      darkskyDesc: 'Espaces naturels préservés contre la pollution lumineuse.',
      astroturismoTitle: 'Points de Vue & Astrophotographie',
      astroturismoOrg: 'Réseau Ibérique d’Astrophotographie',
      astroturismoDesc: 'Sites avec horizon dégagé à 360° pour capturer la Voie Lactée.',
      referenceEnclaves: 'Lieux phares dans l’application:',
      ctaBannerTitle: 'Moteur de Recherche & Fiches Détaillées',
      ctaBannerDesc: 'Filtrez par certification, indice Bortle (1 à 4), altitude et conseils matériel.',
      ctaBannerBtn: 'Explorer les Zones',
    },
    eclipse: {
      tag: '🌑 Événement du Siècle',
      title1: 'Grande Éclipse Totale de Soleil',
      title2: '2 Août 2027',
      desc: 'L’éclipse totale la plus spectaculaire du siècle traversera le sud de l’Espagne : Cadix, Malaga, Grenade côte, Almería, Ceuta et Melilla.',
      b1: '📍 Bande de totalité: Cadix, Malaga, Grenade (côte), Almería (côte), Ceuta et Melilla.',
      b2: '🗺️ Consultez votre position exacte dans l’app pour les heures précises',
      b3: '⏱ Durée de totalité: jusqu’à 4 min 23 sec',
      b4: '🔭 Camps d’observation et guides spécialisés',
      b5: '📡 Alertes météo et télémétrie en temps réel',
    },
    nightVision: {
      tag: '🔴 Optique Astronomique',
      title1: 'Mode Lumière Rouge',
      title2: 'Préserver la Vision Nocturne',
      desc: 'L’œil humain met entre 20 et 30 minutes pour s’adapter à l’obscurité profonde. Un seul flash blanc détruit instantanément cette adaptation.',
      btnLabel: 'Lumière Rouge',
      btnClick: 'Activation 1-Clic',
      card1Title: 'Zéro Éblouissement Rétinien',
      card1Desc: 'La longueur d’onde rouge (~650nm) n’altère pas les bâtonnets oculaires.',
      card2Title: 'Protocole Starlight',
      card2Desc: 'Respectez vos confrères astronomes et photographes lors des rassemblements nocturnes.',
    },
    testimonials: {
      title: 'Ce que disent nos explorateurs',
      subtitle: 'Astronomes, astrophotographes et guides d’astrotourisme',
    },
    finalCta: {
      title: 'L’univers vous attend',
      desc: 'Rejoignez la communauté d’observateurs qui utilisent StellaWay pour explorer le ciel. Commencez gratuitement aujourd’hui.',
      btn: 'Commencer',
      guarantee: 'Sans carte bancaire · 48h d’essai gratuit',
    },
    footer: {
      subtitle: 'Astronomie · Astrotourisme · Éclipse Totale 2027 · Espagne',
      termsNotice: 'En procédant au paiement, vous acceptez nos',
      termsLink: 'Conditions Générales',
      privacyLink: 'Politique de Confidentialité',
      rights: 'Tous droits réservés.',
    },
  },

  pt: {
    nav: {
      features: 'Recursos',
      certifiedSkies: 'Céus Certificados',
      eclipse: 'Eclipse 2027',
      community: 'Comunidade',
      enter: 'Entrar',
      selectLanguage: 'Selecionar Idioma',
      redMode: 'VERMELHO',
      redModeActive: 'Luz Vermelha Ativa',
    },
    hero: {
      badge: '🌑 Grande Eclipse Total · 2 de Agosto de 2027 · Espanha',
      title1: 'O céu estrelado',
      title2: 'no seu bolso',
      desc: 'Zonas certificadas Starlight e DarkSky International, mapas Bortle, astrofotografia e o maior evento celeste do século — o Eclipse Solar Total de 2027 — tudo num só app.',
      ctaPrimary: 'Quero Começar',
      ctaSecondary: 'Ver recursos ↓',
      countdownBadge: '⏳ Contagem regressiva para o Eclipse Total',
      countdownDays: 'Dias',
      countdownHours: 'Horas',
      countdownMin: 'Min',
      countdownSec: 'Seg',
      countdownSub: '2 de Agosto de 2027 · 10:45h (hora espanhola) · Espanha',
      discover: 'Descobrir',
    },
    features: {
      tag: '✦ Recursos',
      title1: 'Tudo o que você precisa',
      title2: 'para conquistar o céu',
      desc: 'De mapas interativos à inteligência artificial astronômica, StellaWay é o seu companheiro definitivo sob as estrelas.',
      f1Title: 'Seeing & Clima ao Vivo',
      f1Desc: 'Telemetria atmosférica, nebulosidade, umidade e transparência Bortle em tempo real.',
      f2Title: 'Mapas de Poluição Luminosa',
      f2Desc: 'Descubra céus escuros Bortle 1 a 4 ideais para fotografia do espaço profundo.',
      f3Title: 'Energia Planetária & Efemérides',
      f3Desc: 'Calendário astronômico dinâmico, trânsitos, fases lunares e chuvas de meteoros.',
      f4Title: 'Stella IA: Assistente Estelar',
      f4Desc: 'Inteligência artificial para telescópios, coordenadas celestes e rotas de observação.',
    },
    certified: {
      tag: 'Padrões Internacionais de Qualidade Celeste',
      title1: 'Zonas Certificadas & Céus Escuros',
      title2: 'Guia Oficial de Observação Noturna',
      desc: 'Explore enclaves avaliados por auditorias científicas globais pela sua escuridão e preservação ambiental.',
      tabAll: 'Todas as Categorias',
      tabStarlight: 'Starlight',
      tabDarkSky: 'DarkSky Int.',
      tabAstrophoto: 'Astrofotografia',
      starlightTitle: 'Reservas & Destinos Starlight',
      starlightOrg: 'Fundação Starlight · Apoiado pela UNESCO e IAU',
      starlightDesc: 'Espaços com céus límpidos e compromisso com o astroturismo sustentável.',
      darkskyTitle: 'Dark Sky Places Internacionais',
      darkskyOrg: 'DarkSky International (IDA) · Padrão Global',
      darkskyDesc: 'Áreas naturais protegidas contra a poluição luminosa.',
      astroturismoTitle: 'Mirantes & Astrofotografia',
      astroturismoOrg: 'Rede Ibérica de Astrofotografia',
      astroturismoDesc: 'Pontos com horizonte desimpedido de 360° para captar a Via Láctea.',
      referenceEnclaves: 'Locais de Referência no App:',
      ctaBannerTitle: 'Buscador e Ficha Detalhada de Cada Destino',
      ctaBannerDesc: 'Filtre por certificação oficial, índice Bortle (1 a 4), altitude e recomendações de equipamentos.',
      ctaBannerBtn: 'Explorar Zonas',
    },
    eclipse: {
      tag: '🌑 Evento do Século',
      title1: 'Grande Eclipse Total Solar',
      title2: '2 de Agosto de 2027',
      desc: 'O eclipse solar total mais aguardado do século no sul da Espanha: Cádis, Málaga, costa de Granada, Almería, Ceuta e Melilha.',
      b1: '📍 Faixa de totalidade: Cádis, Málaga, Granada (costa), Almería (costa), Ceuta e Melilha.',
      b2: '🗺️ Consulte sua localização no app para horários exatos e porcentagem de cobertura',
      b3: '⏱ Duração da totalidade: até 4 min 23 seg',
      b4: '🔭 Acampamentos de observação exclusivos',
      b5: '📡 Alertas meteorológicos e telemetria em tempo real',
    },
    nightVision: {
      tag: '🔴 Óptica Astronômica',
      title1: 'Modo Luz Vermelha',
      title2: 'Preservando a Visão Noturna',
      desc: 'O olho humano leva de 20 a 30 minutos para se adaptar à escuridão profunda. A luz branca destrói essa adaptação instantaneamente.',
      btnLabel: 'Luz Vermelha',
      btnClick: 'Ativação em 1 Clique',
      card1Title: 'Zero Ofuscamento Retiniano',
      card1Desc: 'O comprimento de onda vermelho (~650nm) não satura as células bastonetes da retina.',
      card2Title: 'Protocolo Starlight',
      card2Desc: 'Respeite outros observadores e fotógrafos de céu profundo nas reuniões astronômicas.',
    },
    testimonials: {
      title: 'O que dizem nossos exploradores',
      subtitle: 'Astrônomos, astrofotógrafos e guias de astroturismo',
    },
    finalCta: {
      title: 'O universo espera por você',
      desc: 'Junte-se à comunidade de observadores que já usam o StellaWay. Comece seu teste gratuito hoje.',
      btn: 'Quero Começar',
      guarantee: 'Sem cartão de crédito · 48h de teste grátis',
    },
    footer: {
      subtitle: 'Astronomia · Astroturismo · Eclipse Total 2027 · Espanha',
      termsNotice: 'Ao efetuar o pagamento, você concorda com nossos',
      termsLink: 'Termos e Condições',
      privacyLink: 'Política de Privacidade',
      rights: 'Todos os direitos reservados.',
    },
  },

  it: {
    nav: {
      features: 'Funzionalità',
      certifiedSkies: 'Cieli Certificati',
      eclipse: 'Eclissi 2027',
      community: 'Community',
      enter: 'Entra nell’App',
      selectLanguage: 'Seleziona Lingua',
      redMode: 'ROSSO',
      redModeActive: 'Luce Rossa Attiva',
    },
    hero: {
      badge: '🌑 Grande Eclissi Totale · 2 Agosto 2027 · Spagna',
      title1: 'Il cielo notturno',
      title2: 'nella tua tasca',
      desc: 'Aree certificate Starlight e DarkSky International, mappe Bortle, astrofotografia e il più grande evento celeste del secolo — l’Eclissi Solare Totale del 2027.',
      ctaPrimary: 'Voglio Iniziare',
      ctaSecondary: 'Scopri le funzioni ↓',
      countdownBadge: '⏳ Conto alla rovescia per l’Eclissi Totale',
      countdownDays: 'Giorni',
      countdownHours: 'Ore',
      countdownMin: 'Min',
      countdownSec: 'Sec',
      countdownSub: '2 Agosto 2027 · 10:45 (ora spagnola) · Spagna',
      discover: 'Scopri',
    },
    features: {
      tag: '✦ Funzionalità',
      title1: 'Tutto ciò di cui hai bisogno',
      title2: 'per conquistare il cielo',
      desc: 'Dalle mappe interattive all’intelligenza artificiale astronomica, StellaWay è la tua guida perfetta sotto le stelle.',
      f1Title: 'Seeing & Meteo in Tempo Reale',
      f1Desc: 'Telemetria atmosferica, copertura nuvolosa, umidità e trasparenza Bortle.',
      f2Title: 'Mappe dell’Inquinamento Luminoso',
      f2Desc: 'Trova cieli bui Bortle 1 a 4 perfetti per l’astrofotografia del cielo profondo.',
      f3Title: 'Energia Planetaria ed Effemeridi',
      f3Desc: 'Calendario astronomico dinamico, transiti, fasi lunari e sciami meteorici sincronizzati.',
      f4Title: 'Stella IA: Assistente Stellare',
      f4Desc: 'Intelligenza artificiale per telescopi, coordinate celesti e pianificazione eclissi.',
    },
    certified: {
      tag: 'Standard Internazionali di Qualità Celeste',
      title1: 'Aree Certificate & Cieli Bui',
      title2: 'Guida Ufficiale per l’Osservazione Notturna',
      desc: 'Esplora luoghi riconosciuti a livello mondiale per la loro purezza atmosferica e l’oscurità naturale.',
      tabAll: 'Tutte le Categorie',
      tabStarlight: 'Starlight',
      tabDarkSky: 'DarkSky Int.',
      tabAstrophoto: 'Astrofotografia',
      starlightTitle: 'Riserve & Destinazioni Starlight',
      starlightOrg: 'Fondazione Starlight · Con il supporto di UNESCO e IAU',
      starlightDesc: 'Spazi accreditati con eccezionale limpidezza celeste e astroturismo sostenibile.',
      darkskyTitle: 'Dark Sky Places Internazionali',
      darkskyOrg: 'DarkSky International (IDA) · Standard Globale',
      darkskyDesc: 'Aree naturali protette dall’inquinamento luminoso.',
      astroturismoTitle: 'Punti Panoramici & Astrofotografia',
      astroturismoOrg: 'Rete Iberica di Astrofotografia',
      astroturismoDesc: 'Siti con orizzonti aperti a 360° per catturare la Via Lattea.',
      referenceEnclaves: 'Luoghi di Riferimento nell’App:',
      ctaBannerTitle: 'Cerca e Scopri ogni Destinazione',
      ctaBannerDesc: 'Filtra per certificazione, scala Bortle (1-4), quota e consigli sugli strumenti.',
      ctaBannerBtn: 'Esplora Aree',
    },
    eclipse: {
      tag: '🌑 Evento del Secolo',
      title1: 'Grande Eclissi Solare Totale',
      title2: '2 Agosto 2027',
      desc: 'La più spettacolare eclissi solare del secolo sarà visibile nel sud della Spagna: Cadice, Malaga, costa di Granada, Almería, Ceuta e Melilla.',
      b1: '📍 Fascia di totalità: Cadice, Malaga, Granada (costa), Almería (costa), Ceuta e Melilla.',
      b2: '🗺️ Controlla la tua posizione nell’app per orari e percentuali di copertura esatti',
      b3: '⏱ Durata della totalità: fino a 4 min 23 sec',
      b4: '🔭 Campi di osservazione esclusivi',
      b5: '📡 Allerte meteo e telemetria in tempo reale',
    },
    nightVision: {
      tag: '🔴 Ottica Astronomica',
      title1: 'Modalità Luce Rossa',
      title2: 'Preservare la Visione Notturna',
      desc: 'L’occhio umano impiega da 20 a 30 minuti per adattarsi al buio profondo. Un solo raggio di luce bianca distrugge istantaneamente questo adattamento.',
      btnLabel: 'Luce Rossa',
      btnClick: 'Attivazione in 1 Clic',
      card1Title: 'Zero Abbagliamento Retinico',
      card1Desc: 'La luce rossa (~650nm) non satura i bastoncelli retinici dell’occhio.',
      card2Title: 'Protocollo Starlight',
      card2Desc: 'Rispetta gli altri osservatori e astrofotografi durante le nottate osservative.',
    },
    testimonials: {
      title: 'Cosa dicono i nostri esploratori',
      subtitle: 'Astronomi, astrofotografi e guide di astroturismo',
    },
    finalCta: {
      title: 'L’universo ti aspetta',
      desc: 'Unisciti alla community di appassionati che usano StellaWay per esplorare il cosmo. Inizia gratis oggi.',
      btn: 'Voglio Iniziare',
      guarantee: 'Nessuna carta di credito richiesta · 48h di prova gratuita',
    },
    footer: {
      subtitle: 'Astronomia · Astroturismo · Eclissi Totale 2027 · Spagna',
      termsNotice: 'Effettuando il pagamento, accetti i nostri',
      termsLink: 'Termini e Condizioni',
      privacyLink: 'Informativa sulla Privacy',
      rights: 'Tutti i diritti riservati.',
    },
  },
};

export const PAYWALL_TRANSLATIONS: Record<SupportedLanguage, PaywallTranslations> = {
  es: {
    welcomeBanner: {
      title: '¡Bienvenido a StellaWay Astroturismo!',
      subtitle: 'Tu portal astronómico para el Gran Eclipse Solar Total 2027 y observación de cielo profundo.',
      unlockBtn: 'Desbloquear Acceso Completo',
      enterBtn: 'Acceder a la Aplicación',
      hasAccess: '✓ Acceso Activo Desbloqueado',
      lockedAccess: '🔒 Requiere activar 48h Gratis o Suscripción',
    },
    gateways: {
      title: 'Pasarelas de Pago Oficiales Conectadas',
      desc: 'Transacciones seguras con encriptación SSL de 256 bits y protección contra fraude.',
      connected: 'CONECTADO',
    },
    plansHeader: {
      title: 'Elige tu Plan de Acceso StellaWay',
      subtitle: 'Selecciona la opción que prefieras: activa tu prueba de 48 horas gratis mediante verificación telefónica o suscríbete a los planes Pro mediante Stripe o PayPal.',
      langSelectTitle: 'Idioma:',
    },
    planFree: {
      badge: 'Prueba Gratuita',
      chosenBadge: '✓ Elegido',
      title: '48 Horas Gratis',
      desc: 'Acceso total e ilimitado a todas las herramientas de la app durante 2 días completos.',
      price: '0 €',
      period: '/ 48 horas',
      smsNote: '📱 Requiere verificación por SMS (1 uso por móvil).',
      f1: 'Telemetría y seeing en directo',
      f2: 'Mapas satelitales Bortle 1 a 9',
      f3: 'Asistente IA astronómico Starlight',
      btnSelect: 'Seleccionar 48h Gratis',
      btnActive: '✓ Prueba Ya Activa',
    },
    planMonthly: {
      badge: 'Plan Mensual',
      chosenBadge: '✓ Elegido',
      title: 'Starlight Pro',
      desc: 'Suscripción mensual flexible. Sin compromiso de permanencia, cancelable en 1 clic.',
      price: '3,99 €',
      period: '/ mes',
      securityNote: '💳 Pago seguro con Tarjeta, Stripe o PayPal.',
      f1: 'Acceso continuo sin límites',
      f2: 'Alertas meteorológicas y auroras',
      f3: 'Exportación de diarios de campo',
      btnSelect: 'Seleccionar Plan Mensual (3,99 €)',
    },
    planAnnual: {
      ribbon: '⭐ Ahorra un 58%',
      badge: 'Pase Anual Completo',
      chosenBadge: '✓ Elegido',
      title: 'Starlight Pass Anual',
      desc: '12 meses de cobertura total. Especial para disfrutar del Gran Eclipse Total Solar 2027 y lluvias estelares.',
      price: '19,99 €',
      period: '/ año',
      monthlyEquivalent: 'Equivale a solo 1,66 € / mes.',
      f1: 'Pase VIP Gran Eclipse Total Solar 2027',
      f2: 'Sincronización ilimitada con Google Calendar',
      f3: 'Soporte prioritario y acceso a novedades',
      btnSelect: 'Seleccionar Plan Anual (19,99 €)',
    },
    smsVerification: {
      title: 'Verificación Telefónica para 48 Horas Gratis',
      desc: 'Introduce tu número móvil para recibir un SMS gratuito con tu código de activación. Se permite 1 prueba gratuita por número y dispositivo.',
      activeTitle: '¡Prueba Gratuita de 48 Horas Activa!',
      activeDesc: 'Número verificado: {phone}. Tienes acceso completo e ilimitado a todas las funciones de StellaWay.',
      enterAppBtn: 'Entrar al Dashboard de Astroturismo',
      phoneLabel: 'Número de Teléfono Móvil',
      phonePlaceholder: '612 345 678',
      sendSmsBtn: 'Enviar Código SMS de Activación',
      sendingSmsBtn: 'Enviando código SMS...',
      codeSentNotice: '✓ Código SMS enviado al',
      enterCodePrompt: 'Introduce el código recibido por SMS para activar tus 48 horas:',
      simulatedBanner: 'SMS recibido: Código',
      autoFillBtn: 'Auto-rellenar',
      codeLabel: 'Código SMS (Ej: {code})',
      changePhoneBtn: 'Cambiar Número',
      verifyCodeBtn: 'Activar 48 Horas Gratis',
      verifyingBtn: 'Verificando...',
      stripeDirectFreeNotice: '¿Prefieres activar las 48h directamente a través de Stripe (0,00 €)?',
      stripeDirectFreeBtn: 'Activar 48h Gratis en Stripe (0,00 €)',
    },
    checkout: {
      tabStripe: 'Stripe / Tarjeta',
      tabPayPal: 'PayPal',
      cardDetailsTitle: 'Detalles de la Tarjeta (Stripe Checkout)',
      cardHolderLabel: 'Nombre del Titular',
      cardHolderPlaceholder: 'Nombre y Apellidos',
      cardNumberLabel: 'Número de Tarjeta',
      expiryLabel: 'MM / AA',
      cvcLabel: 'CVC',
      zipLabel: 'Código Postal',
      payWithStripe: 'Pagar {amount} con Stripe',
      processingStripe: 'Procesando pago con Stripe...',
      directStripeNotice: '¿Prefieres la pasarela oficial de Stripe en pestaña nueva?',
      directStripeBtn: 'Abrir Enlace Oficial de Stripe ({amount})',
      paypalTitle: 'Pagar de forma rápida y segura con PayPal',
      paypalDesc: 'Inicia sesión con tu cuenta de PayPal para autorizar el pago de {amount} con protección completa al comprador.',
      payWithPayPal: 'Pagar con PayPal Express',
      connectingPayPal: 'Conectando con PayPal...',
      successTitle: '¡Suscripción Activada con Éxito!',
      successRef: 'Procesado por {provider} • Ref: {ref}',
      planLabel: 'Plan:',
      amountLabel: 'Importe:',
      statusLabel: 'Estado:',
      activeStatus: 'Activo • Acceso Total',
      enterDashboardBtn: 'Entrar a StellaWay Astroturismo',
    },
  },

  en: {
    welcomeBanner: {
      title: 'Welcome to StellaWay Astrotourism!',
      subtitle: 'Your stargazing gateway for the 2027 Great Total Solar Eclipse and deep-sky observation.',
      unlockBtn: 'Unlock Full Access',
      enterBtn: 'Access the Application',
      hasAccess: '✓ Active Access Unlocked',
      lockedAccess: '🔒 Requires activating 48h Free Trial or Subscription',
    },
    gateways: {
      title: 'Official Payment Gateways Connected',
      desc: 'Secure transactions with 256-bit SSL encryption and fraud protection.',
      connected: 'CONNECTED',
    },
    plansHeader: {
      title: 'Choose your StellaWay Access Plan',
      subtitle: 'Pick your preferred option: activate your 48-hour free trial via SMS verification or subscribe to Pro plans via Stripe or PayPal.',
      langSelectTitle: 'Language:',
    },
    planFree: {
      badge: 'Free Trial',
      chosenBadge: '✓ Selected',
      title: '48 Hours Free',
      desc: 'Complete and unlimited access to all app tools for 2 full days.',
      price: '€0',
      period: '/ 48 hours',
      smsNote: '📱 Requires SMS verification (1 use per phone number).',
      f1: 'Live seeing & atmospheric telemetry',
      f2: 'Satellite light pollution maps (Bortle 1-9)',
      f3: 'Starlight AI astronomical assistant',
      btnSelect: 'Select 48h Free Trial',
      btnActive: '✓ Trial Already Active',
    },
    planMonthly: {
      badge: 'Monthly Plan',
      chosenBadge: '✓ Selected',
      title: 'Starlight Pro',
      desc: 'Flexible monthly subscription. No lock-in, cancel in 1 click.',
      price: '€3.99',
      period: '/ month',
      securityNote: '💳 Secure checkout via Card, Stripe or PayPal.',
      f1: 'Unlimited continuous access',
      f2: 'Weather & aurora alerts',
      f3: 'Field observation log export',
      btnSelect: 'Select Monthly Plan (€3.99)',
    },
    planAnnual: {
      ribbon: '⭐ Save 58%',
      badge: 'Complete Annual Pass',
      chosenBadge: '✓ Selected',
      title: 'Starlight Annual Pass',
      desc: '12 months of complete coverage. Specially crafted for the Great 2027 Total Solar Eclipse and meteor showers.',
      price: '€19.99',
      period: '/ year',
      monthlyEquivalent: 'Equivalent to just €1.66 / month.',
      f1: 'VIP Pass: Great Total Solar Eclipse 2027',
      f2: 'Unlimited Google Calendar sync',
      f3: 'Priority support & early feature access',
      btnSelect: 'Select Annual Pass (€19.99)',
    },
    smsVerification: {
      title: 'Phone Verification for 48 Hours Free',
      desc: 'Enter your mobile number to receive a free activation code via SMS. 1 free trial allowed per phone and device.',
      activeTitle: '48-Hour Free Trial Active!',
      activeDesc: 'Verified number: {phone}. You have full unlimited access to all StellaWay tools.',
      enterAppBtn: 'Enter Astrotourism Dashboard',
      phoneLabel: 'Mobile Phone Number',
      phonePlaceholder: '612 345 678',
      sendSmsBtn: 'Send Activation SMS Code',
      sendingSmsBtn: 'Sending SMS code...',
      codeSentNotice: '✓ SMS code sent to',
      enterCodePrompt: 'Enter the SMS code received to activate your 48 hours:',
      simulatedBanner: 'SMS received: Code',
      autoFillBtn: 'Auto-fill',
      codeLabel: 'SMS Code (Ex: {code})',
      changePhoneBtn: 'Change Number',
      verifyCodeBtn: 'Activate 48 Hours Free',
      verifyingBtn: 'Verifying...',
      stripeDirectFreeNotice: 'Prefer to activate the 48h trial directly via Stripe (€0.00)?',
      stripeDirectFreeBtn: 'Activate 48h Free on Stripe (€0.00)',
    },
    checkout: {
      tabStripe: 'Stripe / Credit Card',
      tabPayPal: 'PayPal',
      cardDetailsTitle: 'Credit Card Details (Stripe Checkout)',
      cardHolderLabel: 'Cardholder Name',
      cardHolderPlaceholder: 'Full Name',
      cardNumberLabel: 'Card Number',
      expiryLabel: 'MM / YY',
      cvcLabel: 'CVC',
      zipLabel: 'Postal / Zip Code',
      payWithStripe: 'Pay {amount} with Stripe',
      processingStripe: 'Processing payment with Stripe...',
      directStripeNotice: 'Prefer the official Stripe checkout in a new tab?',
      directStripeBtn: 'Open Official Stripe Link ({amount})',
      paypalTitle: 'Fast and secure payment with PayPal',
      paypalDesc: 'Log in with your PayPal account to authorize {amount} with full buyer protection.',
      payWithPayPal: 'Pay with PayPal Express',
      connectingPayPal: 'Connecting to PayPal...',
      successTitle: 'Subscription Successfully Activated!',
      successRef: 'Processed by {provider} • Ref: {ref}',
      planLabel: 'Plan:',
      amountLabel: 'Amount:',
      statusLabel: 'Status:',
      activeStatus: 'Active • Full Access',
      enterDashboardBtn: 'Enter StellaWay Astrotourism',
    },
  },

  de: {
    welcomeBanner: {
      title: 'Willkommen bei StellaWay Astrotourismus!',
      subtitle: 'Dein astronomisches Portal für die Große Totale Sonnenfinsternis 2027 und Deep-Sky-Beobachtungen.',
      unlockBtn: 'Vollzugriff Freischalten',
      enterBtn: 'App Betreten',
      hasAccess: '✓ Aktiver Zugriff freigeschaltet',
      lockedAccess: '🔒 Erfordert Aktivierung der 48h-Testversion oder ein Abonnement',
    },
    gateways: {
      title: 'Offizielle Zahlungsgateways Verbunden',
      desc: 'Sichere Transaktionen mit 256-Bit SSL-Verschlüsselung und Betrugsschutz.',
      connected: 'VERBUNDEN',
    },
    plansHeader: {
      title: 'Wähle deinen StellaWay-Zugangstarif',
      subtitle: 'Wähle deine bevorzugte Option: Aktiviere deine 48-Stunden-Testversion per SMS oder abonniere Pro-Tarife über Stripe oder PayPal.',
      langSelectTitle: 'Sprache:',
    },
    planFree: {
      badge: 'Kostenlose Testversion',
      chosenBadge: '✓ Gewählt',
      title: '48 Stunden Gratis',
      desc: 'Vollständiger und unbegrenzter Zugang zu allen Tools für 2 ganze Tage.',
      price: '0 €',
      period: '/ 48 Stunden',
      smsNote: '📱 Erfordert SMS-Verifizierung (1x pro Mobiltelefonnummer).',
      f1: 'Live-Seeing & Telemetrie',
      f2: 'Satelliten-Lichtverschmutzungskarten (Bortle 1–9)',
      f3: 'Astronomische Stella KI-Assistentin',
      btnSelect: '48h Gratis Wählen',
      btnActive: '✓ Test bereits aktiv',
    },
    planMonthly: {
      badge: 'Monatstarif',
      chosenBadge: '✓ Gewählt',
      title: 'Starlight Pro',
      desc: 'Flexibles Monatsabo. Keine Mindestlaufzeit, mit 1 Klick kündbar.',
      price: '3,99 €',
      period: '/ Monat',
      securityNote: '💳 Sichere Zahlung mit Karte, Stripe oder PayPal.',
      f1: 'Unbegrenzter kontinuierlicher Zugriff',
      f2: 'Wetter- und Polarlichtwarnungen',
      f3: 'Export von Beobachtungsbüchern',
      btnSelect: 'Monatsplan wählen (3,99 €)',
    },
    planAnnual: {
      ribbon: '⭐ 58% Sparen',
      badge: 'Kompletter Jahrespass',
      chosenBadge: '✓ Gewählt',
      title: 'Starlight Jahrespass',
      desc: '12 Monate Vollabdeckung. Speziell für die Totale Sonnenfinsternis 2027 und Meteorschauer.',
      price: '19,99 €',
      period: '/ Jahr',
      monthlyEquivalent: 'Entspricht nur 1,66 € / Monat.',
      f1: 'VIP-Pass Totale Sonnenfinsternis 2027',
      f2: 'Unbegrenzte Google Kalender-Synchronisation',
      f3: 'Prioritäts-Support & neue Funktionen',
      btnSelect: 'Jahresplan wählen (19,99 €)',
    },
    smsVerification: {
      title: 'Telefon-Verifizierung für 48 Stunden Gratis',
      desc: 'Gib deine Handynummer ein, um einen kostenlosen SMS-Aktivierungscode zu erhalten. 1 Testversion pro Gerät/Nummer.',
      activeTitle: '48-Stunden-Gratistest aktiv!',
      activeDesc: 'Bestätigte Nummer: {phone}. Du hast uneingeschränkten Vollzugriff.',
      enterAppBtn: 'Zum Astrotourismus-Dashboard',
      phoneLabel: 'Mobiltelefonnummer',
      phonePlaceholder: '612 345 678',
      sendSmsBtn: 'SMS-Aktivierungscode Senden',
      sendingSmsBtn: 'Sende SMS-Code...',
      codeSentNotice: '✓ SMS-Code gesendet an',
      enterCodePrompt: 'Gib den empfangenen SMS-Code ein:',
      simulatedBanner: 'SMS erhalten: Code',
      autoFillBtn: 'Autofill',
      codeLabel: 'SMS-Code (z.B. {code})',
      changePhoneBtn: 'Nummer ändern',
      verifyCodeBtn: '48h Gratis Aktivieren',
      verifyingBtn: 'Prüfe...',
      stripeDirectFreeNotice: 'Möchtest du die 48h direkt über Stripe aktivieren (0,00 €)?',
      stripeDirectFreeBtn: '48h Gratis auf Stripe aktivieren (0,00 €)',
    },
    checkout: {
      tabStripe: 'Stripe / Kreditkarte',
      tabPayPal: 'PayPal',
      cardDetailsTitle: 'Kartendetails (Stripe Checkout)',
      cardHolderLabel: 'Name des Karteninhabers',
      cardHolderPlaceholder: 'Vor- und Nachname',
      cardNumberLabel: 'Kartennummer',
      expiryLabel: 'MM / JJ',
      cvcLabel: 'CVC',
      zipLabel: 'Postleitzahl',
      payWithStripe: '{amount} mit Stripe bezahlen',
      processingStripe: 'Zahlung wird verarbeitet...',
      directStripeNotice: 'Bevorzugst du den offiziellen Stripe-Checkout?',
      directStripeBtn: 'Offiziellen Stripe-Link öffnen ({amount})',
      paypalTitle: 'Schnell und sicher mit PayPal bezahlen',
      paypalDesc: 'Melde dich mit deinem PayPal-Konto an, um {amount} autorisiert mit Käuferschutz zu zahlen.',
      payWithPayPal: 'Mit PayPal Express bezahlen',
      connectingPayPal: 'Verbindung zu PayPal wird hergestellt...',
      successTitle: 'Abonnement erfolgreich aktiviert!',
      successRef: 'Verarbeitet durch {provider} • Ref: {ref}',
      planLabel: 'Tarif:',
      amountLabel: 'Betrag:',
      statusLabel: 'Status:',
      activeStatus: 'Aktiv • Vollzugriff',
      enterDashboardBtn: 'Zu StellaWay Astrotourismus',
    },
  },

  fr: {
    welcomeBanner: {
      title: 'Bienvenue sur StellaWay Astrotourisme !',
      subtitle: 'Votre portail astronomique pour la Grande Éclipse Totale de 2027 et l’observation céleste.',
      unlockBtn: 'Débloquer l’Accès Complet',
      enterBtn: 'Accéder à l’Application',
      hasAccess: '✓ Accès Actif Débloqué',
      lockedAccess: '🔒 Nécessite l’activation des 48h gratuites ou un abonnement',
    },
    gateways: {
      title: 'Passerelles de Paiement Officielles Connectées',
      desc: 'Transactions sécurisées avec cryptage SSL 256 bits et protection contre la fraude.',
      connected: 'CONNECTÉ',
    },
    plansHeader: {
      title: 'Choisissez votre Formule StellaWay',
      subtitle: 'Sélectionnez votre option : activez votre essai gratuit de 48 heures par SMS ou abonnez-vous aux formules Pro via Stripe ou PayPal.',
      langSelectTitle: 'Langue :',
    },
    planFree: {
      badge: 'Essai Gratuit',
      chosenBadge: '✓ Sélectionné',
      title: '48 Heures Gratuites',
      desc: 'Accès total et illimité à tous les outils pendant 2 jours complets.',
      price: '0 €',
      period: '/ 48 heures',
      smsNote: '📱 Requiert une vérification SMS (1 essai par numéro).',
      f1: 'Seeing et télémétrie en direct',
      f2: 'Cartes satellites Bortle 1 à 9',
      f3: 'Assistante astronomique Stella IA',
      btnSelect: 'Sélectionner 48h Gratuites',
      btnActive: '✓ Essai Déjà Actif',
    },
    planMonthly: {
      badge: 'Formule Mensuelle',
      chosenBadge: '✓ Sélectionné',
      title: 'Starlight Pro',
      desc: 'Abonnement mensuel flexible. Sans engagement, résiliable en 1 clic.',
      price: '3,99 €',
      period: '/ mois',
      securityNote: '💳 Paiement sécurisé par Carte, Stripe ou PayPal.',
      f1: 'Accès continu sans limites',
      f2: 'Alertes météo et aurores boréales',
      f3: 'Exportation de journaux d’observation',
      btnSelect: 'Sélectionner la Formule Mensuelle (3,99 €)',
    },
    planAnnual: {
      ribbon: '⭐ Économisez 58%',
      badge: 'Passe Annuel Complet',
      chosenBadge: '✓ Sélectionné',
      title: 'Pass Starlight Annuel',
      desc: '12 mois de couverture complète. Idéal pour la Grande Éclipse Totale de 2027 et les pluies d’étoiles filantes.',
      price: '19,99 €',
      period: '/ an',
      monthlyEquivalent: 'Équivaut à seulement 1,66 € / mois.',
      f1: 'Passe VIP Grande Éclipse Totale 2027',
      f2: 'Synchronisation illimitée avec Google Calendar',
      f3: 'Support prioritaire et nouveautés en avant-première',
      btnSelect: 'Sélectionner le Pass Annuel (19,99 €)',
    },
    smsVerification: {
      title: 'Vérification Téléphonique pour 48h Gratuites',
      desc: 'Entrez votre numéro pour recevoir un code d’activation par SMS gratuit. 1 essai gratuit par appareil.',
      activeTitle: 'Essai Gratuit de 48 Heures Actif !',
      activeDesc: 'Numéro vérifié : {phone}. Vous disposez d’un accès complet et illimité.',
      enterAppBtn: 'Accéder au Tableau de Bord',
      phoneLabel: 'Numéro de Téléphone Portable',
      phonePlaceholder: '612 345 678',
      sendSmsBtn: 'Envoyer le Code SMS d’Activation',
      sendingSmsBtn: 'Envoi du code en cours...',
      codeSentNotice: '✓ Code SMS envoyé au',
      enterCodePrompt: 'Entrez le code reçu pour activer vos 48h :',
      simulatedBanner: 'SMS reçu : Code',
      autoFillBtn: 'Remplir auto',
      codeLabel: 'Code SMS (Ex : {code})',
      changePhoneBtn: 'Changer de Numéro',
      verifyCodeBtn: 'Activer 48h Gratuites',
      verifyingBtn: 'Vérification...',
      stripeDirectFreeNotice: 'Vous préférez activer l’essai directement via Stripe (0,00 €) ?',
      stripeDirectFreeBtn: 'Activer 48h Gratuites sur Stripe (0,00 €)',
    },
    checkout: {
      tabStripe: 'Stripe / Carte Bancaire',
      tabPayPal: 'PayPal',
      cardDetailsTitle: 'Coordonnées de la Carte (Stripe Checkout)',
      cardHolderLabel: 'Nom du Titulaire',
      cardHolderPlaceholder: 'Prénom et Nom',
      cardNumberLabel: 'Numéro de Carte',
      expiryLabel: 'MM / AA',
      cvcLabel: 'CVC',
      zipLabel: 'Code Postal',
      payWithStripe: 'Payer {amount} avec Stripe',
      processingStripe: 'Paiement Stripe en cours...',
      directStripeNotice: 'Vous préférez la page officielle Stripe dans un nouvel onglet ?',
      directStripeBtn: 'Ouvrir le Lien Officiel Stripe ({amount})',
      paypalTitle: 'Paiement rapide et sécurisé avec PayPal',
      paypalDesc: 'Connectez-vous à votre compte PayPal pour régler {amount} avec protection des achats.',
      payWithPayPal: 'Payer avec PayPal Express',
      connectingPayPal: 'Connexion à PayPal...',
      successTitle: 'Abonnement Activé avec Succès !',
      successRef: 'Traité par {provider} • Réf : {ref}',
      planLabel: 'Formule :',
      amountLabel: 'Montant :',
      statusLabel: 'Statut :',
      activeStatus: 'Actif • Accès Total',
      enterDashboardBtn: 'Entrer sur StellaWay Astrotourisme',
    },
  },

  pt: {
    welcomeBanner: {
      title: 'Bem-vindo ao StellaWay Astroturismo!',
      subtitle: 'O seu portal astronômico para o Grande Eclipse Solar Total de 2027 e observação do céu profundo.',
      unlockBtn: 'Desbloquear Acesso Completo',
      enterBtn: 'Aceder à Aplicação',
      hasAccess: '✓ Acesso Ativo Desbloqueado',
      lockedAccess: '🔒 Requer ativação do teste de 48h grátis ou assinatura',
    },
    gateways: {
      title: 'Portais de Pagamento Oficiais Conectados',
      desc: 'Transações seguras com criptografia SSL de 256 bits e proteção antifraude.',
      connected: 'CONECTADO',
    },
    plansHeader: {
      title: 'Escolha o seu Plano de Acesso StellaWay',
      subtitle: 'Selecione a sua opção favorita: ative o teste gratuito de 48 horas via SMS ou assine os planos Pro via Stripe ou PayPal.',
      langSelectTitle: 'Idioma:',
    },
    planFree: {
      badge: 'Teste Gratuito',
      chosenBadge: '✓ Escolhido',
      title: '48 Horas Grátis',
      desc: 'Acesso total e ilimitado a todas as ferramentas por 2 dias completos.',
      price: '0 €',
      period: '/ 48 horas',
      smsNote: '📱 Requer verificação por SMS (1 uso por número).',
      f1: 'Seeing e telemetria atmosférica ao vivo',
      f2: 'Mapas de satélite Bortle 1 a 9',
      f3: 'Assistente astronômica Stella IA',
      btnSelect: 'Selecionar 48h Grátis',
      btnActive: '✓ Teste Já Ativo',
    },
    planMonthly: {
      badge: 'Plano Mensal',
      chosenBadge: '✓ Escolhido',
      title: 'Starlight Pro',
      desc: 'Assinatura mensal flexível. Sem fidelidade, cancelável em 1 clique.',
      price: '3,99 €',
      period: '/ mês',
      securityNote: '💳 Pagamento seguro com Cartão, Stripe ou PayPal.',
      f1: 'Acesso contínuo sem limites',
      f2: 'Alertas meteorológicos e auroras',
      f3: 'Exportação de diários de observação',
      btnSelect: 'Selecionar Plano Mensal (3,99 €)',
    },
    planAnnual: {
      ribbon: '⭐ Economize 58%',
      badge: 'Passe Anual Completo',
      chosenBadge: '✓ Escolhido',
      title: 'Passe Starlight Anual',
      desc: '12 meses de cobertura total. Especial para desfrutar do Grande Eclipse Total de 2027 e chuvas de estrelas.',
      price: '19,99 €',
      period: '/ ano',
      monthlyEquivalent: 'Equivale a apenas 1,66 € / mês.',
      f1: 'Passe VIP Grande Eclipse Total Solar 2027',
      f2: 'Sincronização ilimitada com Google Calendar',
      f3: 'Suporte prioritário e novidades antecipadas',
      btnSelect: 'Selecionar Plano Anual (19,99 €)',
    },
    smsVerification: {
      title: 'Verificação Telefônica para 48 Horas Grátis',
      desc: 'Insira o seu número móvel para receber o código SMS gratuito. 1 teste permitido por número e dispositivo.',
      activeTitle: 'Teste Gratuito de 48 Horas Ativo!',
      activeDesc: 'Número verificado: {phone}. Você tem acesso ilimitado a todas as funções.',
      enterAppBtn: 'Entrar no Dashboard de Astroturismo',
      phoneLabel: 'Número de Telefone Móvel',
      phonePlaceholder: '612 345 678',
      sendSmsBtn: 'Enviar Código SMS de Ativação',
      sendingSmsBtn: 'Enviando código SMS...',
      codeSentNotice: '✓ Código SMS enviado para',
      enterCodePrompt: 'Digite o código recebido por SMS para ativar as 48 horas:',
      simulatedBanner: 'SMS recebido: Código',
      autoFillBtn: 'Preencher auto',
      codeLabel: 'Código SMS (Ex: {code})',
      changePhoneBtn: 'Mudar Número',
      verifyCodeBtn: 'Ativar 48 Horas Grátis',
      verifyingBtn: 'Verificando...',
      stripeDirectFreeNotice: 'Prefere ativar o teste diretamente pelo Stripe (0,00 €)?',
      stripeDirectFreeBtn: 'Ativar 48h Grátis no Stripe (0,00 €)',
    },
    checkout: {
      tabStripe: 'Stripe / Cartão',
      tabPayPal: 'PayPal',
      cardDetailsTitle: 'Detalhes do Cartão (Stripe Checkout)',
      cardHolderLabel: 'Nome do Titular',
      cardHolderPlaceholder: 'Nome e Sobrenome',
      cardNumberLabel: 'Número do Cartão',
      expiryLabel: 'MM / AA',
      cvcLabel: 'CVC',
      zipLabel: 'Código Postal',
      payWithStripe: 'Pagar {amount} com Stripe',
      processingStripe: 'Processando pagamento com Stripe...',
      directStripeNotice: 'Prefere a página oficial do Stripe em nova aba?',
      directStripeBtn: 'Abrir Link Oficial do Stripe ({amount})',
      paypalTitle: 'Pague com rapidez e segurança com PayPal',
      paypalDesc: 'Inicie sessão com sua conta PayPal para autorizar {amount} com proteção ao comprador.',
      payWithPayPal: 'Pagar com PayPal Express',
      connectingPayPal: 'Conectando ao PayPal...',
      successTitle: 'Assinatura Ativada com Sucesso!',
      successRef: 'Processado por {provider} • Ref: {ref}',
      planLabel: 'Plano:',
      amountLabel: 'Valor:',
      statusLabel: 'Status:',
      activeStatus: 'Ativo • Acesso Total',
      enterDashboardBtn: 'Entrar no StellaWay Astroturismo',
    },
  },

  it: {
    welcomeBanner: {
      title: 'Benvenuto su StellaWay Astroturismo!',
      subtitle: 'Il tuo portale astronomico per la Grande Eclissi Solare Totale del 2027 e l’osservazione del cielo profondo.',
      unlockBtn: 'Sblocca Accesso Completo',
      enterBtn: 'Accedi all’Applicazione',
      hasAccess: '✓ Accesso Attivo Sbloccato',
      lockedAccess: '🔒 Richiede l’attivazione di 48h Gratis o un Abbonamento',
    },
    gateways: {
      title: 'Gateway di Pagamento Ufficiali Connessi',
      desc: 'Transazioni sicure con crittografia SSL a 256 bit e protezione antifrode.',
      connected: 'CONNESSO',
    },
    plansHeader: {
      title: 'Scegli il tuo Piano di Accesso StellaWay',
      subtitle: 'Seleziona l’opzione che preferisci: attiva la tua prova gratuita di 48 ore via SMS o abbonati ai piani Pro tramite Stripe o PayPal.',
      langSelectTitle: 'Lingua:',
    },
    planFree: {
      badge: 'Prova Gratuita',
      chosenBadge: '✓ Scelto',
      title: '48 Ore Gratis',
      desc: 'Accesso totale e illimitato a tutti gli strumenti dell’app per 2 giorni completi.',
      price: '0 €',
      period: '/ 48 ore',
      smsNote: '📱 Richiede verifica via SMS (1 sola prova per numero).',
      f1: 'Seeing e telemetria atmosferica in diretta',
      f2: 'Mappe satellitari Bortle da 1 a 9',
      f3: 'Assistente astronomica Stella IA',
      btnSelect: 'Seleziona 48h Gratis',
      btnActive: '✓ Prova Già Attiva',
    },
    planMonthly: {
      badge: 'Piano Mensile',
      chosenBadge: '✓ Scelto',
      title: 'Starlight Pro',
      desc: 'Abbonamento mensile flessibile. Nessun vincolo, disdici con 1 clic.',
      price: '3,99 €',
      period: '/ mese',
      securityNote: '💳 Pagamento sicuro con Carta, Stripe o PayPal.',
      f1: 'Accesso continuo senza limiti',
      f2: 'Allerte meteo e aurore boreali',
      f3: 'Esportazione del diario osservativo',
      btnSelect: 'Seleziona Piano Mensile (3,99 €)',
    },
    planAnnual: {
      ribbon: '⭐ Risparmia il 58%',
      badge: 'Pass Annuale Completo',
      chosenBadge: '✓ Scelto',
      title: 'Starlight Pass Annuale',
      desc: '12 mesi di copertura completa. Speciale per l’Eclissi Solare Totale del 2027 e gli sciami meteorici.',
      price: '19,99 €',
      period: '/ anno',
      monthlyEquivalent: 'Equivale a soli 1,66 € / mese.',
      f1: 'Pass VIP Grande Eclissi Totale 2027',
      f2: 'Sincronizzazione illimitata con Google Calendar',
      f3: 'Supporto prioritario e novità in anteprima',
      btnSelect: 'Seleziona Piano Annuale (19,99 €)',
    },
    smsVerification: {
      title: 'Verifica Telefonica per 48 Ore Gratis',
      desc: 'Inserisci il tuo cellulare per ricevere un SMS gratuito col codice di attivazione. 1 prova per numero.',
      activeTitle: 'Prova Gratuita di 48 Ore Attiva!',
      activeDesc: 'Numero verificato: {phone}. Hai accesso completo e illimitato a tutte le funzioni.',
      enterAppBtn: 'Entra nel Dashboard Astroturismo',
      phoneLabel: 'Numero di Cellulare',
      phonePlaceholder: '612 345 678',
      sendSmsBtn: 'Invia Codice SMS di Attivazione',
      sendingSmsBtn: 'Invio codice in corso...',
      codeSentNotice: '✓ Codice SMS inviato a',
      enterCodePrompt: 'Inserisci il codice ricevuto per attivare le tue 48 ore:',
      simulatedBanner: 'SMS ricevuto: Codice',
      autoFillBtn: 'Compila auto',
      codeLabel: 'Codice SMS (Es: {code})',
      changePhoneBtn: 'Cambia Numero',
      verifyCodeBtn: 'Attiva 48 Ore Gratis',
      verifyingBtn: 'Verifica in corso...',
      stripeDirectFreeNotice: 'Preferisci attivare la prova direttamente tramite Stripe (0,00 €)?',
      stripeDirectFreeBtn: 'Attiva 48h Gratis su Stripe (0,00 €)',
    },
    checkout: {
      tabStripe: 'Stripe / Carta di Credito',
      tabPayPal: 'PayPal',
      cardDetailsTitle: 'Dettagli della Carta (Stripe Checkout)',
      cardHolderLabel: 'Nome del Titolare',
      cardHolderPlaceholder: 'Nome e Cognome',
      cardNumberLabel: 'Numero della Carta',
      expiryLabel: 'MM / AA',
      cvcLabel: 'CVC',
      zipLabel: 'Codice Postale',
      payWithStripe: 'Paga {amount} con Stripe',
      processingStripe: 'Elaborazione pagamento con Stripe...',
      directStripeNotice: 'Preferisci il checkout ufficiale Stripe in una nuova scheda?',
      directStripeBtn: 'Apri Link Ufficiale Stripe ({amount})',
      paypalTitle: 'Paga in modo rapido e sicuro con PayPal',
      paypalDesc: 'Accedi al tuo account PayPal per autorizzare {amount} con protezione acquisti.',
      payWithPayPal: 'Paga con PayPal Express',
      connectingPayPal: 'Connessione a PayPal in corso...',
      successTitle: 'Abbonamento Attivato con Successo!',
      successRef: 'Elaborato da {provider} • Rif: {ref}',
      planLabel: 'Piano:',
      amountLabel: 'Importo:',
      statusLabel: 'Stato:',
      activeStatus: 'Attivo • Accesso Completo',
      enterDashboardBtn: 'Entra su StellaWay Astroturismo',
    },
  },
};
