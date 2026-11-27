import React, { useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SupportedLanguage } from '../lib/i18nHelpers';
import { SHOP_PRODUCTS, ShopCategory, ShopLevel, ShopProduct } from '../data/shopData';

const COPY: Record<
  SupportedLanguage,
  {
    kicker: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    allLevels: string;
    levels: Record<ShopLevel, string>;
    allCategories: string;
    categories: Record<ShopCategory, string>;
    recommendedPrefix: string;
    buyAffiliate: string;
    searchAmazon: string;
    countLabel: string;
    emptyTitle: string;
    emptyDesc: string;
    resetFilters: string;
    disclosure: string;
    curatedNote: string;
  }
> = {
  es: {
    kicker: 'Equipamiento recomendado',
    title: 'Tienda Astronómica',
    subtitle:
      'Selección práctica para observación a simple vista, aficionado y astrofotografía profesional en cielos oscuros, eclipses y auroras.',
    searchPlaceholder: 'Buscar telescopios, prismáticos, gafas solares, trípodes...',
    allLevels: 'Todos los niveles',
    levels: {
      iniciacion: 'Iniciación',
      aficionado: 'Aficionado',
      profesional: 'Profesional',
    },
    allCategories: 'Todo el equipo',
    categories: {
      telescopios: 'Telescopios',
      prismaticos: 'Prismáticos',
      astrofotografia: 'Astrofotografía',
      eclipses_auroras: 'Eclipses y Auroras',
      accesorios: 'Accesorios',
    },
    recommendedPrefix: 'Ideal para:',
    buyAffiliate: 'Ver en Amazon',
    searchAmazon: 'Ver en Amazon',
    countLabel: 'equipos seleccionados',
    emptyTitle: 'Sin resultados para este filtro',
    emptyDesc: 'Prueba con otro nivel de experiencia o limpia el texto de búsqueda.',
    resetFilters: 'Mostrar todo el catálogo',
    disclosure:
      'En calidad de Afiliado de Amazon, StellaWay obtiene ingresos por las compras adscritas que cumplen los requisitos aplicables.',
    curatedNote:
      'Los precios y disponibilidad finales se consultan directamente en Amazon al abrir cada ficha.',
  },
  en: {
    kicker: 'Recommended gear',
    title: 'Astronomy Shop',
    subtitle:
      'Curated selection for naked-eye stargazing, amateur observers, and advanced astrophotography under dark skies, eclipses, and auroras.',
    searchPlaceholder: 'Search telescopes, binoculars, solar glasses, trackers...',
    allLevels: 'All levels',
    levels: {
      iniciacion: 'Beginner',
      aficionado: 'Amateur',
      profesional: 'Pro',
    },
    allCategories: 'All gear',
    categories: {
      telescopios: 'Telescopes',
      prismaticos: 'Binoculars',
      astrofotografia: 'Astrophotography',
      eclipses_auroras: 'Eclipses & Auroras',
      accesorios: 'Accessories',
    },
    recommendedPrefix: 'Best for:',
    buyAffiliate: 'View on Amazon',
    searchAmazon: 'View on Amazon',
    countLabel: 'selected items',
    emptyTitle: 'No matching equipment found',
    emptyDesc: 'Try switching the experience level or clearing your search query.',
    resetFilters: 'Show all gear',
    disclosure:
      'As an Amazon Associate, StellaWay earns from qualifying purchases.',
    curatedNote:
      'Final pricing and stock availability are checked directly on Amazon.',
  },
  fr: {
    kicker: 'Équipement recommandé',
    title: 'Boutique Astronomique',
    subtitle:
      'Sélection pratique pour l’observation débutante, amateur et l’astrophotographie avancée sous ciel noir, éclipses et aurores.',
    searchPlaceholder: 'Rechercher télescopes, jumelles, lunettes solaires...',
    allLevels: 'Tous niveaux',
    levels: {
      iniciacion: 'Débutant',
      aficionado: 'Amateur',
      profesional: 'Pro',
    },
    allCategories: 'Tout l’équipement',
    categories: {
      telescopios: 'Télescopes',
      prismaticos: 'Jumelles',
      astrofotografia: 'Astrophotographie',
      eclipses_auroras: 'Éclipses & Aurores',
      accesorios: 'Accessoires',
    },
    recommendedPrefix: 'Idéal pour :',
    buyAffiliate: 'Voir sur Amazon',
    searchAmazon: 'Voir sur Amazon',
    countLabel: 'équipements sélectionnés',
    emptyTitle: 'Aucun résultat pour ce filtre',
    emptyDesc: 'Essayez un autre niveau ou réinitialisez la recherche.',
    resetFilters: 'Afficher tout le catalogue',
    disclosure:
      'En tant que Partenaire Amazon, StellaWay réalise un bénéfice sur les achats remplissant les conditions requises.',
    curatedNote:
      'Les prix et la disponibilité sont consultés directement sur Amazon.',
  },
  pt: {
    kicker: 'Equipamento recomendado',
    title: 'Loja Astronómica',
    subtitle:
      'Seleção prática para observação inicial, amadora e astrofotografia profissional sob céus escuros, eclipses e auroras.',
    searchPlaceholder: 'Procurar telescópios, binóculos, óculos solares...',
    allLevels: 'Todos os níveis',
    levels: {
      iniciacion: 'Iniciação',
      aficionado: 'Amador',
      profesional: 'Profissional',
    },
    allCategories: 'Todo o equipamento',
    categories: {
      telescopios: 'Telescópios',
      prismaticos: 'Binóculos',
      astrofotografia: 'Astrofotografia',
      eclipses_auroras: 'Eclipses e Auroras',
      accesorios: 'Acessórios',
    },
    recommendedPrefix: 'Ideal para:',
    buyAffiliate: 'Ver na Amazon',
    searchAmazon: 'Ver na Amazon',
    countLabel: 'equipamentos selecionados',
    emptyTitle: 'Sem resultados para este filtro',
    emptyDesc: 'Experimente outro nível ou limpe a pesquisa.',
    resetFilters: 'Mostrar todo o catálogo',
    disclosure:
      'Como Associado da Amazon, a StellaWay ganha com compras qualificadas.',
    curatedNote:
      'Os preços e a disponibilidade são verificados diretamente na Amazon.',
  },
  it: {
    kicker: 'Attrezzatura consigliata',
    title: 'Negozio Astronomico',
    subtitle:
      'Selezione pratica per osservazione base, amatoriale e astrofotografia avanzata sotto cieli bui, eclissi e aurore.',
    searchPlaceholder: 'Cerca telescopi, binocoli, occhiali solari...',
    allLevels: 'Tutti i livelli',
    levels: {
      iniciacion: 'Principiante',
      aficionado: 'Amatoriale',
      profesional: 'Professionale',
    },
    allCategories: 'Tutta l’attrezzatura',
    categories: {
      telescopios: 'Telescopi',
      prismaticos: 'Binocoli',
      astrofotografia: 'Astrofotografia',
      eclipses_auroras: 'Eclissi e Aurore',
      accesorios: 'Accessori',
    },
    recommendedPrefix: 'Ideale per:',
    buyAffiliate: 'Vedi su Amazon',
    searchAmazon: 'Vedi su Amazon',
    countLabel: 'articoli selezionati',
    emptyTitle: 'Nessun risultato per questo filtro',
    emptyDesc: 'Prova un altro livello o azzera la ricerca.',
    resetFilters: 'Mostra tutto il catalogo',
    disclosure:
      'In qualità di Affiliato Amazon, StellaWay riceve un guadagno dagli acquisti idonei.',
    curatedNote:
      'Prezzi e disponibilità finali sono verificati direttamente su Amazon.',
  },
  de: {
    kicker: 'Empfohlene Ausrüstung',
    title: 'Astronomie-Shop',
    subtitle:
      'Ausgewählte Ausrüstung für Einsteiger, Hobby-Astronomen und professionelle Astrofotografie bei dunklem Himmel, Finsternissen und Polarlichtern.',
    searchPlaceholder: 'Teleskope, Ferngläser, Sonnenfinsternisbrillen suchen...',
    allLevels: 'Alle Stufen',
    levels: {
      iniciacion: 'Einsteiger',
      aficionado: 'Fortgeschritten',
      profesional: 'Profi',
    },
    allCategories: 'Alle Kategorien',
    categories: {
      telescopios: 'Teleskope',
      prismaticos: 'Ferngläser',
      astrofotografia: 'Astrofotografie',
      eclipses_auroras: 'Finsternisse & Polarlicht',
      accesorios: 'Zubehör',
    },
    recommendedPrefix: 'Ideal für:',
    buyAffiliate: 'Auf Amazon ansehen',
    searchAmazon: 'Auf Amazon ansehen',
    countLabel: 'ausgewählte Artikel',
    emptyTitle: 'Keine passenden Artikel gefunden',
    emptyDesc: 'Wähle eine andere Erfahrungsstufe oder leere die Suche.',
    resetFilters: 'Gesamten Katalog zeigen',
    disclosure:
      'Als Amazon-Partner verdient StellaWay an qualifizierten Verkäufen.',
    curatedNote:
      'Endgültige Preise und Verfügbarkeit werden direkt bei Amazon geprüft.',
  },
};

function getProductDestinationUrl(product: ShopProduct): string {
  if (product.amazonUrl && product.amazonUrl.trim()) {
    return product.amazonUrl.trim();
  }
  return `https://www.amazon.es/s?k=${encodeURIComponent(product.searchQuery)}`;
}

const LEVEL_ORDER: ShopLevel[] = ['iniciacion', 'aficionado', 'profesional'];
const CATEGORY_ORDER: ShopCategory[] = [
  'telescopios',
  'prismaticos',
  'astrofotografia',
  'eclipses_auroras',
  'accesorios',
];

export const ShopView: React.FC = () => {
  const { language } = useLanguage();
  const copy = COPY[language] || COPY.es;

  const [selectedLevel, setSelectedLevel] = useState<'all' | ShopLevel>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | ShopCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return SHOP_PRODUCTS.filter((item) => {
      if (selectedLevel !== 'all' && item.level !== selectedLevel) return false;
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.specs.toLowerCase().includes(q) ||
        item.recommendedFor.toLowerCase().includes(q)
      );
    });
  }, [selectedLevel, selectedCategory, searchTerm]);

  const handleReset = () => {
    setSelectedLevel('all');
    setSelectedCategory('all');
    setSearchTerm('');
  };

  return (
    <div className="flex-grow pt-5 md:pt-8 px-4 sm:px-6 lg:px-10 max-w-6xl mx-auto w-full flex flex-col gap-6 pb-20">
      {/* Header / Editorial Store Intro */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-white/10">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold text-amber-300 tracking-wide">
            {copy.kicker}
          </p>
          <h1 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            {copy.title}
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        <div className="text-xs text-slate-400 font-mono tabular-nums shrink-0">
          {filteredProducts.length} {copy.countLabel}
        </div>
      </header>

      {/* Filters & Search Toolbar */}
      <section className="flex flex-col gap-4 bg-[#0D111C]/90 border border-white/10 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Level Segmented Control */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setSelectedLevel('all')}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedLevel === 'all'
                  ? 'bg-[#FEE685] text-[#120D1C]'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {copy.allLevels}
            </button>
            {LEVEL_ORDER.map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-[#FEE685] text-[#120D1C]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {copy.levels[lvl]}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <span className="material-symbols-outlined text-base text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={copy.searchPlaceholder}
              className="w-full h-10 pl-9 pr-9 rounded-xl bg-white/5 border border-white/15 focus:border-[#FEE685]/70 focus:outline-none text-xs sm:text-sm text-white placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-sky-400/20 text-sky-200 border border-sky-400/50'
                : 'bg-transparent text-slate-400 hover:text-white border border-transparent hover:border-white/15'
            }`}
          >
            {copy.allCategories}
          </button>
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-400/20 text-sky-200 border border-sky-400/50'
                  : 'bg-transparent text-slate-400 hover:text-white border border-transparent hover:border-white/15'
              }`}
            >
              {copy.categories[cat]}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#0D111C]/90 border border-white/10 rounded-2xl p-10 text-center flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-slate-400">inventory_2</span>
          <h2 className="text-base font-bold text-white">{copy.emptyTitle}</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md">{copy.emptyDesc}</p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-2 px-4 py-2 rounded-xl bg-[#FEE685] hover:bg-white text-[#120D1C] text-xs font-bold transition-colors cursor-pointer"
          >
            {copy.resetFilters}
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const href = getProductDestinationUrl(product);
            const hasError = Boolean(brokenImages[product.id]);

            return (
              <article
                key={product.id}
                className="group bg-[#0D111C]/95 border border-white/12 hover:border-[#FEE685]/60 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
              >
                {/* 4:3 Product Image Container */}
                <div className="relative aspect-[4/3] w-full bg-[#151A28] overflow-hidden border-b border-white/10">
                  {!hasError ? (
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [product.id]: true }))
                      }
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1B1430] to-[#0D111C]">
                      <span className="material-symbols-outlined text-3xl text-amber-300 mb-2">
                        telescope
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {product.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  {/* Unboxed Metadata Line (Zero-Pill Rule) */}
                  <div className="flex items-center gap-2 text-xs text-amber-300/90 font-semibold">
                    <span>{copy.levels[product.level]}</span>
                    <span aria-hidden="true" className="text-slate-500">·</span>
                    <span className="text-slate-300">{copy.categories[product.category]}</span>
                  </div>

                  <h2 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-white leading-snug">
                    {product.title}
                  </h2>

                  <p className="text-xs font-mono tabular-nums text-sky-300/90">
                    {product.specs}
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-3 border-t border-white/10 flex flex-col gap-3">
                    <p className="text-xs text-slate-400">
                      <span className="text-slate-300 font-semibold">
                        {copy.recommendedPrefix}
                      </span>{' '}
                      {product.recommendedFor}
                    </p>

                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FEE685] to-[#E5B54F] hover:from-white hover:to-[#FEE685] text-[#120D1C] font-bold text-xs flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
                    >
                      <span>{product.amazonUrl ? copy.buyAffiliate : copy.searchAmazon}</span>
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Discreet Amazon Affiliate Disclosure */}
      <footer className="pt-2 border-t border-white/5 text-[11px] leading-snug text-slate-500 text-center">
        <p>{copy.disclosure}</p>
      </footer>
    </div>
  );
};
