import { SupportedLanguage, normalizeLanguage } from './i18nHelpers';

function pick(lang: SupportedLanguage, texts: Record<SupportedLanguage, string>): string {
  return texts[lang] || texts.es;
}

/**
 * StellaWay - Motor Experto Multilingüe de Conocimiento Astronómico
 * Proporciona respuestas astronómicas rigurosas en los 6 idiomas de StellaWay
 * y sirve de fallback inteligente cuando Gemini no está disponible.
 */
export function generateAstronomicalAnswer(message: string, language: string = 'es'): string {
  const l = normalizeLanguage(language);
  const q = (message || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // 1. ZARAGOZA & ARAGÓN
  if (
    q.includes('zaragoza') ||
    q.includes('saragos') ||
    q.includes('vicort') ||
    q.includes('aranda') ||
    q.includes('ariza') ||
    q.includes('moncayo') ||
    q.includes('daroca') ||
    q.includes('gallocanta')
  ) {
    return pick(l, {
      es: `🏛️ **Zonas Certificadas Starlight en Zaragoza (Aragón, España)** ⭐

1. **Comarca del Aranda (Destino Starlight desde 2022):** 11 miradores estelares en Illueca, Purujosa, Calcena, Jarque de Moncayo, Tierga y Pomer.
2. **Sierra de Vicort (Destino Starlight desde julio 2025):** Sediles, El Frasno, Mara, Miedes y el **Mirador del Pico del Rayo (1.427 m)** con Bortle 2.
3. **Ariza (Municipio Starlight 2026):** Mirador astronómico del Castillo y valle del Jalón.

*Extras de alta montaña:* Parque Natural del Moncayo (Lituénigo) y Laguna de Gallocanta / Daroca.`,
      en: `🏛️ **Certified Starlight Zones in Zaragoza (Aragon, Spain)** ⭐

1. **Comarca del Aranda (Starlight Destination since 2022):** Network of 11 dark-sky viewpoints across Illueca, Purujosa, Calcena, Jarque, Tierga and Pomer.
2. **Sierra de Vicort (Starlight Destination since 2025):** Features the **Pico del Rayo Viewpoint (1,427 m)** under Bortle 2 skies.
3. **Ariza (Starlight Municipality 2026):** Castle hill viewpoint overlooking the Jalón valley.

*High-altitude extras:* Moncayo Natural Park Observatory (Lituénigo) and Gallocanta Lagoon.`,
      fr: `🏛️ **Zones Certifiées Starlight à Saragosse (Aragon, Espagne)** ⭐

1. **Comarca del Aranda (Destination Starlight depuis 2022) :** Réseau de 11 belvédères stellaires (Illueca, Purujosa, Calcena, Jarque, Tierga).
2. **Sierra de Vicort (Destination Starlight 2025) :** Sommets à plus de 1 400 m dont le **Pico del Rayo (1 427 m)** en classe Bortle 2.
3. **Ariza (Commune Starlight 2026) :** Belvédère du château et vallée du Jalón.

*Compléments :* Parc Naturel du Moncayo (Lituénigo) et Lagune de Gallocanta.`,
      pt: `🏛️ **Zonas Certificadas Starlight em Saragoça (Aragão, Espanha)** ⭐

1. **Comarca del Aranda (Destino Starlight desde 2022):** Rede com 11 miradouros estelares (Illueca, Purujosa, Calcena, Jarque, Tierga).
2. **Sierra de Vicort (Destino Starlight 2025):** Cumes acima de 1.400 m incluindo o **Pico del Rayo (1.427 m)** em Bortle 2.
3. **Ariza (Município Starlight 2026):** Miradouro do Castelo e vale do Jalón.

*Extras:* Parque Natural do Moncayo e Lagoa de Gallocanta.`,
      it: `🏛️ **Zone Certificate Starlight a Saragozza (Aragona, Spagna)** ⭐

1. **Comarca del Aranda (Destinazione Starlight dal 2022):** Rete di 11 punti panoramici (Illueca, Purujosa, Calcena, Jarque, Tierga).
2. **Sierra de Vicort (Destinazione Starlight 2025):** Vette oltre 1.400 m con il **Pico del Rayo (1.427 m)** sotto cieli Bortle 2.
3. **Ariza (Comune Starlight 2026):** Belvedere del Castello sulla valle del Jalón.

*Extra:* Parco Naturale del Moncayo e Laguna di Gallocanta.`,
      de: `🏛️ **Zertifizierte Starlight-Zonen in Saragossa (Aragonien, Spanien)** ⭐

1. **Comarca del Aranda (Starlight-Reiseziel seit 2022):** 11 Sternbeobachtungspunkte in Illueca, Purujosa, Calcena, Jarque und Tierga.
2. **Sierra de Vicort (Starlight-Reiseziel seit 2025):** Aussichtspunkt *Pico del Rayo (1.427 m)* mit Bortle-2-Himmel.
3. **Ariza (Starlight-Gemeinde 2026):** Burg-Aussichtspunkt im Jalón-Tal.

*Zusätzlich:* Naturpark Moncayo (Lituénigo) und Lagune von Gallocanta.`,
    });
  }

  // 2. GALICIA
  if (
    q.includes('galicia') ||
    q.includes('galice') ||
    q.includes('galiza') ||
    q.includes('trevinca') ||
    q.includes('cies') ||
    q.includes('muras') ||
    q.includes('finisterre') ||
    q.includes('fisterra') ||
    q.includes('costa da morte') ||
    q.includes('ancares')
  ) {
    return pick(l, {
      es: `🌊 **7 Zonas Certificadas Starlight en Galicia (España)** ⭐

1. **Pena Trevinca - A Veiga (Ourense, 2015):** Cumbre a 2.127 m con Centro Astronómico y planetario.
2. **Islas Atlánticas (Cíes & Ons):** Oscuridad oceánica pura frente al Atlántico.
3. **Muras - Serra do Xistral (Lugo):** Cielos limpios sin contaminación lumínica.
4. **Costa da Morte (Fisterra, Muxía, Carnota):** Horizonte oeste oceánico infinito.
5. **Mariñas Coruñesas · 6. Lalín (O. do Castro) · 7. Ancares Lucenses (Bortle 1).**`,
      en: `🌊 **7 Certified Starlight Spaces in Galicia (Spain)** ⭐

1. **Pena Trevinca - A Veiga (2,127m):** Galicia's highest peak with observatory & planetarium.
2. **Atlantic Islands National Park (Cíes & Ons):** Pure oceanic darkness under the Milky Way.
3. **Muras - Serra do Xistral (Lugo):** Mountain peat bogs with pristine dark skies.
4. **Costa da Morte (Finisterre, Muxía):** Unobstructed Atlantic western horizon.
5. **Mariñas Coruñesas · 6. Lalín Observatory · 7. Ancares Lucenses (Bortle 1).**`,
      fr: `🌊 **7 Territoires Certifiés Starlight en Galice (Espagne)** ⭐

1. **Pena Trevinca - A Veiga (2 127 m) :** Plus haut sommet de Galice avec observatoire et planétarium.
2. **Îles Atlantiques (Cíes & Ons) :** Obscurité océanique pure face à l'Atlantique.
3. **Muras - Serra do Xistral (Lugo) :** Hautes landes sans pollution lumineuse.
4. **Costa da Morte (Finisterre, Muxía) :** Horizon ouest dégagé sur l'océan.
5. **Mariñas Coruñesas · 6. Lalín · 7. Ancares Lucenses (Bortle 1).**`,
      pt: `🌊 **7 Destinos Certificados Starlight na Galiza (Espanha)** ⭐

1. **Pena Trevinca - A Veiga (2.127 m):** Pico mais alto com centro astronómico e planetário.
2. **Parque Nacional das Ilhas Atlânticas (Cíes e Ons):** Escuridão oceânica pura.
3. **Muras - Serra do Xistral (Lugo):** Céus límpidos livres de poluição luminosa.
4. **Costa da Morte (Fisterra, Muxía):** Horizonte oeste aberto sobre o Atlântico.
5. **Mariñas Coruñesas · 6. Lalín · 7. Ancares Lucenses (Bortle 1).**`,
      it: `🌊 **7 Spazi Certificati Starlight in Galizia (Spagna)** ⭐

1. **Pena Trevinca - A Veiga (2.127 m):** Vetta più alta con osservatorio e planetario.
2. **Isole Atlantiche (Cíes e Ons):** Oscurità oceanica pura sull'Atlantico.
3. **Muras - Serra do Xistral (Lugo):** Altopiani privi di inquinamento luminoso.
4. **Costa da Morte (Finisterre, Muxía):** Orizzonte ovest infinito sul mare.
5. **Mariñas Coruñesas · 6. Lalín · 7. Ancares Lucenses (Bortle 1).**`,
      de: `🌊 **7 Zertifizierte Starlight-Zonen in Galicien (Spanien)** ⭐

1. **Pena Trevinca - A Veiga (2.127 m):** Höchster Gipfel Galiciens mit Observatorium & Planetarium.
2. **Atlantische Inseln (Cíes & Ons):** Ozeanische Dunkelheit unter der Milchstraße.
3. **Muras - Serra do Xistral (Lugo):** Klarer Hochlandhimmel ohne Lichtsmog.
4. **Costa da Morte (Finisterre, Muxía):** Freier Westhorizont am Atlantik.
5. **Mariñas Coruñesas · 6. Lalín · 7. Ancares Lucenses (Bortle 1).**`,
    });
  }

  // 3. ECLIPSES (2026 / 2027)
  if (
    q.includes('eclipse') ||
    q.includes('ecliss') ||
    q.includes('finsternis') ||
    q.includes('2026') ||
    q.includes('2027') ||
    q.includes('solar') ||
    q.includes('soleil') ||
    q.includes('solare') ||
    q.includes('sonne')
  ) {
    return pick(l, {
      es: `✨ **Guía de los Grandes Eclipses Solares Totales en España** 🌑

1. **12 de Agosto de 2026:** Cruza Galicia, Aragón (Zaragoza/Teruel), Castellón y Baleares al atardecer (~19:30–20:30 CEST, 10°–12° sobre el oeste).
2. **2 de Agosto de 2027 (Eclipse del Siglo):** Sur de Andalucía (**Tarifa, Cádiz, Málaga, Gibraltar, Ceuta**) con hasta **4m 30s – 6m 23s** de totalidad al mediodía.
- **Seguridad obligatoria:** Usa gafas homologadas **ISO 12312-2** durante todas las fases parciales.`,
      en: `✨ **Guide to the Great Total Solar Eclipses in Spain** 🌑

1. **August 12, 2026:** Path across Galicia, Aragon (Zaragoza/Teruel), Castellón and Balearics near sunset (~19:30–20:30 CEST, 10°–12° West).
2. **August 2, 2027 (Eclipse of the Century):** Southern Andalusia (**Tarifa, Cadiz, Malaga, Gibraltar, Ceuta**) offering **4.5 to 6+ minutes** of midday totality!
- **Mandatory Eye Safety:** Always wear **ISO 12312-2** certified solar glasses during every partial phase.`,
      fr: `✨ **Guide des Grandes Éclipses Solaires Totales en Espagne** 🌑

1. **12 Août 2026 :** Traverse la Galice, l'Aragon (Saragosse/Teruel), Castellón et les Baléares au coucher du soleil (~19h30–20h30 CEST).
2. **2 Août 2027 (Éclipse du Siècle) :** Sud de l'Andalousie (**Tarifa, Cadix, Málaga, Gibraltar, Ceuta**) avec plus de **4m 30s** de totalité en plein midi !
- **Sécurité :** Portez impérativement des lunettes certifiées **ISO 12312-2** pendant toutes les phases partielles.`,
      pt: `✨ **Guia dos Grandes Eclipses Solares Totais em Espanha** 🌑

1. **12 de Agosto de 2026:** Atravessa Galiza, Aragão (Saragoça/Teruel), Castellón e Baleares ao entardecer (~19h30–20h30 CEST).
2. **2 de Agosto de 2027 (Eclipse do Século):** Sul da Andaluzia (**Tarifa, Cádis, Málaga, Gibraltar, Ceuta**) com mais de **4m 30s** de totalidade ao meio-dia!
- **Segurança Obrigatória:** Use sempre óculos homologados **ISO 12312-2** em todas as fases parciais.`,
      it: `✨ **Guida alle Grandi Eclissi Solari Totali in Spagna** 🌑

1. **12 Agosto 2026:** Attraversa Galizia, Aragona (Saragozza/Teruel), Castellón e Baleari al tramonto (~19:30–20:30 CEST).
2. **2 Agosto 2027 (Eclissi del Secolo):** Andalusia meridionale (**Tarifa, Cadice, Malaga, Gibilterra, Ceuta**) con oltre **4m 30s** di totalità a mezzogiorno!
- **Sicurezza:** Indossa sempre occhiali certificati **ISO 12312-2** durante le fasi parziali.`,
      de: `✨ **Leitfaden zu den Totalen Sonnenfinsternissen 2026 & 2027** 🌑

1. **12. August 2026:** Totalität über Galicien, Aragonien (Saragossa/Teruel), Castellón und Balearen am späten Nachmittag (~19:30–20:30 MESZ).
2. **2. August 2027 (Jahrhundert-Finsternis):** Südspanien / Andalusien (**Tarifa, Cádiz, Málaga, Gibraltar, Ceuta**) mit über **4 Min. 30 Sek.** Totalität am Mittag!
- **Augenschutz:** Während aller partiellen Phasen zwingend **ISO 12312-2** zertifizierte Brillen tragen.`,
    });
  }

  const mentionsAurora =
    q.includes('aurora') ||
    q.includes('aurore') ||
    q.includes('boreal') ||
    q.includes('austral') ||
    q.includes('northern lights') ||
    q.includes('southern lights') ||
    q.includes('polarlicht') ||
    q.includes('tromso') ||
    q.includes('abisko') ||
    q.includes('rakiura') ||
    q.includes('fairbanks') ||
    q.includes('ushuaia') ||
    q.includes('kp') ||
    q.includes('geomagnet');

  const mentionsOpticsOrSimpleEye =
    q.includes('telescop') ||
    q.includes('prismatic') ||
    q.includes('binocular') ||
    q.includes('jumell') ||
    q.includes('fernglas') ||
    q.includes('simple vista') ||
    q.includes('ojo desnudo') ||
    q.includes('naked eye') ||
    q.includes('oeil nu') ||
    q.includes('olho nu') ||
    q.includes('occhio nudo') ||
    q.includes('blossem auge') ||
    q.includes('hace falta') ||
    q.includes('necesit') ||
    q.includes('need') ||
    q.includes('equip');

  // 3b. AURORAS: ¿SE NECESITA TELESCOPIO? (OBSERVACIÓN A SIMPLE VISTA)
  if (mentionsAurora && mentionsOpticsOrSimpleEye) {
    return pick(l, {
      es: `🌌 **No, para ver auroras boreales o australes NO hace falta telescopio (de hecho, es contraproducente).**

Las auroras ocupan grandes arcos o todo el cielo, y un telescopio tiene un campo de visión muy reducido:
- 👀 **Cómo se ven:** **A simple vista**. Solo necesitas que sea de noche cerrada, cielo despejado (sin nubes), poca contaminación lumínica y mirar hacia el horizonte Norte (boreal) o Sur (austral).
- 🔭 **¿Y prismáticos?** No son necesarios, aunque unos gran angular (7x35 o 8x42) pueden ayudar si la aurora es muy tenue en el horizonte.
- 📱 **Cámara/Móvil:** El sensor capta colores más intensos que el ojo humano; usa trípode, gran angular f/1.4–f/2.8, **1–5 s** e **ISO 1600–6400**.`,
      en: `🌌 **No — you do NOT need a telescope to see Northern or Southern Lights (a telescope actually restricts your view).**

Auroras stretch across wide arcs or the entire sky, while telescopes zoom into a tiny patch:
- 👀 **Best way to see them:** **With the naked eye.** You only need full night darkness, clear cloudless skies, low light pollution, a clear polar horizon (North or South), and geomagnetic activity.
- 🔭 **Binoculars?** Not required, though wide-field 7x35 or 8x42 binoculars can reveal faint horizon glow.
- 📱 **Camera/Phone:** Sensors pick up vivid colors better than human night vision — use a tripod, wide lens f/1.4–f/2.8, **1–5s** shutter, **ISO 1600–6400**.`,
      fr: `🌌 **Non, il ne faut PAS de télescope pour voir les aurores boréales ou australes.**

Les aurores s'étendent sur de larges pans du ciel, alors qu'un télescope a un champ trop étroit :
- 👀 **Observation idéale :** **À l'œil nu.** Il suffit qu'il fasse nuit noire, que le ciel soit dégagé, avec peu de pollution lumineuse et une activité géomagnétique suffisante.
- 📱 **Photo :** Trépied, grand angle f/1.4–f/2.8, **1 à 5 s**, **ISO 1600–6400**.`,
      pt: `🌌 **Não, NÃO precisa de telescópio para ver auroras boreais ou austrais.**

As auroras cobrem grande parte do céu e o telescópio fecha demasiado o campo de visão:
- 👀 **Como observar:** **A olho nu.** Só precisa de noite escura, céu limpo sem nuvens, pouca poluição luminosa e horizonte polar desimpedido.
- 📱 **Fotografia:** Tripé, grande angular f/1.4–f/2.8, **1–5 s**, **ISO 1600–6400**.`,
      it: `🌌 **No, NON serve un telescopio per vedere le aurore boreali o australi.**

Le aurore coprono ampie porzioni di cielo e un telescopio ha un campo troppo stretto:
- 👀 **Come osservarle:** **A occhio nudo.** Servono solo notte fonda, cielo sereno senza nuvole, scarso inquinamento luminoso e orizzonte libero verso il polo.
- 📱 **Foto:** Treppiede, grandangolo f/1.4–f/2.8, **1–5 s**, **ISO 1600–6400**.`,
      de: `🌌 **Nein, für Polarlichter braucht man KEIN Teleskop — sie werden mit bloßem Auge beobachtet.**

Polarlichter spannen sich über weite Teile des Himmels; ein Teleskop hat ein viel zu kleines Sichtfeld:
- 👀 **Was du wirklich brauchst:** Dunkle Nacht, klarer Himmel ohne Wolken, wenig Lichtverschmutzung, freier Horizont nach Norden (bzw. Süden) und geomagnetische Aktivität.
- 📱 **Kamera/Handy:** Stativ, Weitwinkel f/1.4–f/2.8, **1–5 s**, **ISO 1600–6400**.`,
    });
  }

  // 4. TELESCOPIOS & EQUIPO (solo cuando NO se pregunta por auroras)
  if (
    !mentionsAurora &&
    (q.includes('telescop') ||
      q.includes('prismatic') ||
      q.includes('binocular') ||
      q.includes('jumell') ||
      q.includes('fernglas') ||
      q.includes('comprar') ||
      q.includes('equipo') ||
      q.includes('ocular') ||
      q.includes('dobson') ||
      q.includes('refractor') ||
      q.includes('maksutov'))
  ) {
    return pick(l, {
      es: `🔭 **Recomendaciones de Telescopios y Óptica StellaWay**:

1. **Iniciación y Cielo Profundo:** **Dobson 150mm o 200mm (6"–8")** (*Sky-Watcher 200P*) — máxima apertura y luz por euro.
2. **Portátil y Planetaria:** **Maksutov-Cassegrain 90–127mm** (*Skymax 127*) — compacto y nítido para Luna, Júpiter y Saturno.
3. **Astrofotografía:** **Refractor ED/APO 70–80mm f/6** sobre montura ecuatorial motorizada (*HEQ5 Pro* o *Star Adventurer GTi*).
4. **Prismáticos:** **10x50** con prisma BAK-4 para empezar de forma inmediata.`,
      en: `🔭 **StellaWay Telescope & Optics Guide**:

1. **Best Value Visual & Deep-Sky:** **150mm or 200mm Dobsonian (6"–8")** — maximum aperture per dollar for nebulae, galaxies, and planets.
2. **Portable Planetary Observing:** **90–127mm Maksutov-Cassegrain** — compact, razor-sharp contrast on Moon, Jupiter & Saturn.
3. **Astrophotography:** **70–80mm f/6 ED/APO Refractor** on a tracking equatorial mount (*HEQ5 Pro* / *Star Adventurer GTi*).
4. **Binoculars:** **10x50 BAK-4** are ideal for wide-field stargazing.`,
      fr: `🔭 **Guide Télescopes & Optique StellaWay** :

1. **Ciel profond & visuel :** **Dobson 150 ou 200 mm (6"–8")** — le meilleur diamètre par euro.
2. **Compact & planétaire :** **Maksutov-Cassegrain 90–127 mm** — très piqué sur la Lune, Jupiter et Saturne.
3. **Astrophotographie :** **Lunette ED/APO 70–80 mm f/6** sur monture équatoriale motorisée (*HEQ5 Pro* / *Star Adventurer GTi*).
4. **Jumelles :** **10x50** à prismes BAK-4 pour débuter facilement.`,
      pt: `🔭 **Guia de Telescópios e Ótica StellaWay**:

1. **Iniciação e Céu Profundo:** **Dobson 150mm ou 200mm (6"–8")** — máxima abertura por euro.
2. **Portátil e Planetária:** **Maksutov-Cassegrain 90–127mm** — nítido para Lua, Júpiter e Saturno.
3. **Astrofotografia:** **Refrator ED/APO 70–80mm f/6** com montagem equatorial motorizada.
4. **Binóculos:** **10x50 BAK-4** para campos largos e Via Láctea.`,
      it: `🔭 **Guida Telescopi & Ottiche StellaWay**:

1. **Visuale & Profondo Cielo:** **Dobson 150 o 200 mm (6"–8")** — massima apertura al miglior prezzo.
2. **Portatile & Pianeti:** **Maksutov-Cassegrain 90–127 mm** — nitido per Luna, Giove e Saturno.
3. **Astrofotografia:** **Rifrattore ED/APO 70–80 mm f/6** su montatura equatoriale motorizzata.
4. **Binocoli:** **10x50 BAK-4** ideali per iniziare subito.`,
      de: `🔭 **StellaWay Teleskop- & Optik-Empfehlungen**:

1. **Einstieg & Deep-Sky:** **Dobson 150mm oder 200mm (6"–8")** — größte Öffnung pro Euro.
2. **Kompakt & Planeten:** **Maksutov-Cassegrain 90–127mm** — gestochen scharf für Mond, Jupiter & Saturn.
3. **Astrofotografie:** **ED/APO-Refraktor 70–80mm f/6** auf parallaktischer Montierung (*HEQ5 Pro* / *Star Adventurer GTi*).
4. **Fernglas:** **10x50 BAK-4** für weite Sternfelder.`,
    });
  }

  // 5. ASTROFOTOGRAFÍA
  if (
    q.includes('astrofot') ||
    q.includes('astrophoto') ||
    q.includes('camara') ||
    q.includes('camera') ||
    q.includes('movil') ||
    q.includes('smartphone') ||
    q.includes('handy') ||
    q.includes('via lactea') ||
    q.includes('voie lactee') ||
    q.includes('via lattea') ||
    q.includes('milchstrass') ||
    q.includes('milky way') ||
    q.includes('foto') ||
    q.includes('photo')
  ) {
    return pick(l, {
      es: `📸 **Astrofotografía de la Vía Láctea (Cámara y Móvil)**:

1. **Lente / Modo Pro:** Gran angular (14–24mm) a **f/1.4 – f/2.8**. En móvil activa Modo Pro/Noche sobre trípode.
2. **Exposición:** **10 a 15 s** (regla NPF) para estrellas puntuales sin trazos.
3. **ISO:** **3200 – 6400** (en móviles, ISO 1600–3200).
4. **Enfoque Manual (MF):** Zoom x10 a una estrella brillante (Vega/Sirio) hasta dejarla puntual y dispara siempre en **RAW** (apila 10–15 tomas en *Siril* o *Sequator*).`,
      en: `📸 **Milky Way & Smartphone Astrophotography Guide**:

1. **Lens / Pro Mode:** Fast wide-angle (14–24mm) at **f/1.4 – f/2.8**. On phones, mount on a tripod and enable Pro/RAW mode.
2. **Shutter Speed:** **10–15 seconds** (NPF rule) to avoid star trails.
3. **ISO:** **3200 – 6400** (or 1600–3200 on phones).
4. **Manual Focus:** Magnify 10x in Live View on a bright star (Vega/Sirius), shoot in **RAW**, and stack 10–20 frames in *Siril* or *Sequator*.`,
      fr: `📸 **Guide Astrophotographie Voie Lactée (Appareil & Mobile)** :

1. **Objectif / Mode Pro :** Grand angle lumineux (14–24 mm, **f/1.4 – f/2.8**) sur trépied.
2. **Exposition :** **10 à 15 s** (règle NPF) pour des étoiles bien ponctuelles.
3. **ISO :** **3200 – 6400** (1600–3200 sur smartphone).
4. **Mise au point manuelle :** Zoom x10 sur une étoile brillante (Véga) et prise de vue en **RAW** puis empilement sous *Siril* ou *Sequator*.`,
      pt: `📸 **Guia de Astrofotografia da Via Láctea (Câmara e Telemóvel)**:

1. **Objetiva / Modo Pro:** Grande angular (14–24mm, **f/1.4 – f/2.8**) em tripé firme.
2. **Exposição:** **10 a 15 s** (regra NPF) para estrelas sem arrasto.
3. **ISO:** **3200 – 6400** (1600–3200 em telemóveis).
4. **Foco Manual:** Zoom x10 numa estrela brilhante, fotografe em **RAW** e empilhe 10–20 fotos no *Siril* ou *Sequator*.`,
      it: `📸 **Guida Astrofotografia Via Lattea (Fotocamera & Smartphone)**:

1. **Obiettivo / Modalità Pro:** Grandangolo luminoso (14–24 mm, **f/1.4 – f/2.8**) su treppiede.
2. **Esposizione:** **10–15 secondi** (regola NPF) per stelle puntiformi.
3. **ISO:** **3200 – 6400** (1600–3200 su smartphone).
4. **Fuoco Manuale:** Zoom 10x su una stella luminosa, scatta in **RAW** e somma 10–20 scatti in *Siril* o *Sequator*.`,
      de: `📸 **Milchstraßen- & Smartphone-Astrofotografie**:

1. **Objektiv / Pro-Modus:** Lichtstarkes Weitwinkel (14–24mm, **f/1.4 – f/2.8**) auf stabilem Stativ.
2. **Belichtung:** **10–15 Sek.** (NPF-Regel) für punktförmige Sterne.
3. **ISO:** **3200 – 6400** (Smartphone 1600–3200).
4. **Manueller Fokus:** 10x Zoom auf einen hellen Stern (Wega), im **RAW-Format** fotografieren und in *Siril* oder *Sequator* stacken.`,
    });
  }

  // 6. CANARIAS
  if (
    q.includes('canarias') ||
    q.includes('canary') ||
    q.includes('canaries') ||
    q.includes('kanar') ||
    q.includes('palma') ||
    q.includes('teide') ||
    q.includes('tenerife') ||
    q.includes('muchachos') ||
    q.includes('fuerteventura') ||
    q.includes('gran canaria')
  ) {
    return pick(l, {
      es: `✨ **Islas Canarias — Cielos Starlight de Nivel Mundial** 🇮🇨
Protegidas por la Ley del Cielo: **Roque de los Muchachos** (La Palma, 2.426 m, GTC 10.4 m, SQM >21.9), **Parque Nacional del Teide** (Tenerife), **Fuerteventura** (Mirador de Sicasumbre, Bortle 1) y **Gran Canaria / Risco Caído**.`,
      en: `✨ **Canary Islands — World-Class Starlight Skies** 🇮🇨
Protected under the Sky Law: **Roque de los Muchachos** (La Palma, 2,426m, SQM >21.9), **Teide National Park** (Tenerife), **Fuerteventura** (Sicasumbre Viewpoint, Bortle 1), and **Gran Canaria / Risco Caído**.`,
      fr: `✨ **Îles Canaries — Ciels Starlight de Classe Mondiale** 🇮🇨
Protégées par la Loi du Ciel : **Roque de los Muchachos** (La Palma, 2 426 m, SQM >21,9), **Parc du Teide** (Tenerife), **Fuerteventura** (Sicasumbre, Bortle 1) et **Grande Canarie / Risco Caído**.`,
      pt: `✨ **Ilhas Canárias — Céus Starlight de Classe Mundial** 🇮🇨
Protegidas pela Lei do Céu: **Roque de los Muchachos** (La Palma, 2.426 m, SQM >21.9), **Parque Nacional do Teide** (Tenerife), **Fuerteventura** (Sicasumbre, Bortle 1) e **Gran Canaria**.`,
      it: `✨ **Isole Canarie — Cieli Starlight di Livello Mondiale** 🇮🇨
Protette dalla Legge del Cielo: **Roque de los Muchachos** (La Palma, 2.426 m, SQM >21.9), **Parco del Teide** (Tenerife), **Fuerteventura** (Sicasumbre, Bortle 1) e **Gran Canaria**.`,
      de: `✨ **Kanarische Inseln — Starlight-Himmel der Weltklasse** 🇮🇨
Durch das Himmelsgesetz geschützt: **Roque de los Muchachos** (La Palma, 2.426 m, SQM >21,9), **Teide-Nationalpark** (Teneriffa), **Fuerteventura** (Sicasumbre, Bortle 1) & **Gran Canaria**.`,
    });
  }

  // 6b. MENORCA / BALEARES
  if (q.includes('menorca') || q.includes('minorca') || q.includes('minorque') || q.includes('baleares') || q.includes('balearic')) {
    return pick(l, {
      es: `🏝️ **Reserva Starlight Isla de Menorca** — Toda la isla está certificada desde 2019. Destacan **Monte Toro (358 m)**, **Faro de Cavalleria**, **Punta Nati** y **s'Albufera des Grau**.`,
      en: `🏝️ **Menorca Starlight Reserve & Destination** — Certified island-wide since 2019. Highlights: **Monte Toro (358m)**, **Cavalleria Lighthouse**, **Punta Nati**, and **s'Albufera des Grau**.`,
      fr: `🏝️ **Réserve Starlight de Minorque** — Toute l'île est certifiée depuis 2019 : **Monte Toro (358 m)**, **Phare de Cavalleria**, **Punta Nati** et **s'Albufera des Grau**.`,
      pt: `🏝️ **Reserva Starlight Ilha de Menorca** — Toda a ilha certificada desde 2019: **Monte Toro (358 m)**, **Farol de Cavalleria**, **Punta Nati** e **s'Albufera des Grau**.`,
      it: `🏝️ **Riserva Starlight Isola di Minorca** — Certificata dal 2019: **Monte Toro (358 m)**, **Faro di Cavalleria**, **Punta Nati** e **s'Albufera des Grau**.`,
      de: `🏝️ **Starlight-Reservat Menorca** — Seit 2019 inselweit zertifiziert: **Monte Toro (358 m)**, **Leuchtturm Cavalleria**, **Punta Nati** & **s'Albufera des Grau**.`,
    });
  }

  // 6c. NAVARRA (RONCAL)
  if (q.includes('roncal') || q.includes('navarra') || q.includes('navarre') || q.includes('belagua') || q.includes('larra')) {
    return pick(l, {
      es: `🏔️ **Destino Starlight Valle de Roncal (Navarra)** — Primer Destino Starlight navarro en el Pirineo: **Larra-Belagua (>1.400 m)**, Mata de Haya, Isaba y Uztárroz con cielos Bortle 2.`,
      en: `🏔️ **Roncal Valley Starlight Destination (Navarre Pyrenees)** — **Larra-Belagua (>1,400m)**, Mata de Haya, Isaba & Uztárroz under pristine Bortle 2 mountain skies.`,
      fr: `🏔️ **Destination Starlight Vallée de Roncal (Navarre)** — **Larra-Belagua (>1 400 m)**, Mata de Haya, Isaba et Uztárroz sous des cieux pyrénéens Bortle 2.`,
      pt: `🏔️ **Destino Starlight Vale de Roncal (Navarra)** — **Larra-Belagua (>1.400 m)**, Mata de Haya e Isaba sob céus pirenaicos Bortle 2.`,
      it: `🏔️ **Destinazione Starlight Valle di Roncal (Navarra)** — **Larra-Belagua (>1.400 m)**, Mata de Haya e Isaba sotto cieli pirenaici Bortle 2.`,
      de: `🏔️ **Starlight-Reiseziel Roncal-Tal (Navarra-Pyrenäen)** — **Larra-Belagua (>1.400 m)**, Mata de Haya & Isaba unter klarem Bortle-2-Gebirgshimmel.`,
    });
  }

  // 6d. CASTILLA Y LEÓN
  if (q.includes('babia') || q.includes('cuatro valles') || q.includes('leon') || q.includes('gredos') || q.includes('sierra de francia') || q.includes('soria')) {
    return pick(l, {
      es: `🏰 **Territorios Starlight en Castilla y León**: **Babia y Cuatro Valles** (León, Bortle 1), **Sierra de Gredos Norte** (Ávila), **Sierra de Francia** (Salamanca) y **Tierras Altas / Muriel Viejo** (Soria).`,
      en: `🏰 **Starlight Territories in Castile & León**: **Babia & Cuatro Valles** (León, Bortle 1), **Northern Sierra de Gredos** (Ávila), **Sierra de Francia** (Salamanca) & **Tierras Altas / Muriel Viejo** (Soria).`,
      fr: `🏰 **Territoires Starlight en Castille-et-León** : **Babia & Cuatro Valles** (León, Bortle 1), **Sierra de Gredos Nord** (Ávila), **Sierra de Francia** (Salamanque) & **Soria**.`,
      pt: `🏰 **Territórios Starlight em Castela e Leão**: **Babia & Cuatro Valles** (Leão, Bortle 1), **Serra de Gredos** (Ávila), **Serra de França** e **Soria**.`,
      it: `🏰 **Territori Starlight in Castiglia e León**: **Babia & Cuatro Valles** (León, Bortle 1), **Sierra de Gredos** (Ávila), **Sierra de Francia** e **Soria**.`,
      de: `🏰 **Starlight-Gebiete in Kastilien und León**: **Babia & Cuatro Valles** (León, Bortle 1), **Sierra de Gredos** (Ávila), **Sierra de Francia** & **Soria**.`,
    });
  }

  // 6e. ANDALUCÍA
  if (
    q.includes('andaluc') ||
    q.includes('andalus') ||
    q.includes('pedroches') ||
    q.includes('cordoba') ||
    q.includes('torcal') ||
    q.includes('cazorla') ||
    q.includes('calar alto') ||
    q.includes('sierra morena') ||
    q.includes('sierra nevada')
  ) {
    return pick(l, {
      es: `⭐ **Andalucía Starlight & Eclipse 2027**: **Sierra Morena Andaluza** (mayor reserva del mundo >400 km), **Los Pedroches**, **El Torcal**, **Cazorla (Hernán Perea, Bortle 1)**, **Calar Alto (2.168 m)** y **Sierra Nevada**. Además, Tarifa, Cádiz y Málaga serán epicentro de totalidad el 2 de agosto de 2027.`,
      en: `⭐ **Andalusia Starlight & Eclipse 2027**: **Sierra Morena Reserve** (>400 km), **Los Pedroches**, **El Torcal**, **Cazorla (Bortle 1)**, **Calar Alto Observatory (2,168m)** & **Sierra Nevada**. Plus Tarifa, Cadiz and Malaga sit dead-center on the August 2, 2027 total solar eclipse path.`,
      fr: `⭐ **Andalousie Starlight & Éclipse 2027** : **Sierra Morena** (>400 km), **Los Pedroches**, **El Torcal**, **Cazorla (Bortle 1)**, **Calar Alto (2 168 m)** & **Sierra Nevada**. Tarifa, Cadix et Málaga seront aussi au cœur de l'éclipse totale du 2 août 2027.`,
      pt: `⭐ **Andaluzia Starlight & Eclipse 2027**: **Serra Morena** (>400 km), **Los Pedroches**, **El Torcal**, **Cazorla (Bortle 1)**, **Calar Alto (2.168 m)** & **Serra Nevada**. Tarifa, Cádis e Málaga estarão na faixa central de totalidade em 2 de agosto de 2027.`,
      it: `⭐ **Andalusia Starlight & Eclissi 2027**: **Sierra Morena** (>400 km), **Los Pedroches**, **El Torcal**, **Cazorla (Bortle 1)**, **Calar Alto (2.168 m)** & **Sierra Nevada**. Tarifa, Cadice e Malaga saranno al centro della totalità il 2 agosto 2027.`,
      de: `⭐ **Andalusien Starlight & Finsternis 2027**: **Sierra Morena** (>400 km), **Los Pedroches**, **El Torcal**, **Cazorla (Bortle 1)**, **Calar Alto (2.168 m)** & **Sierra Nevada**. Zudem liegen Tarifa, Cádiz und Málaga im Kern der Totalität am 2. August 2027.`,
    });
  }

  // 6f. CASTILLA-LA MANCHA
  if (q.includes('mancha') || q.includes('cuenca') || q.includes('nerpio') || q.includes('segura') || q.includes('alcudia') || q.includes('cabaneros')) {
    return pick(l, {
      es: `🌾 **Castilla-La Mancha Starlight**: **Serranía de Cuenca** (Bortle 2), **Sierra del Segura y Nerpio** (telescopios remotos en Bortle 1), **Alcaraz / Ruidera**, **Valle de Alcudia** y **P.N. de Cabañeros**.`,
      en: `🌾 **Castilla-La Mancha Starlight**: **Serranía de Cuenca** (Bortle 2), **Sierra del Segura & Nerpio** (Bortle 1 remote observatory hub), **Ruidera**, **Valle de Alcudia** & **Cabañeros National Park**.`,
      fr: `🌾 **Castille-La Manche Starlight** : **Serranía de Cuenca** (Bortle 2), **Sierra del Segura & Nerpio** (observatoires Bortle 1), **Ruidera**, **Valle de Alcudia** & **Cabañeros**.`,
      pt: `🌾 **Castela-La Mancha Starlight**: **Serranía de Cuenca** (Bortle 2), **Sierra del Segura e Nerpio** (Bortle 1), **Ruidera**, **Valle de Alcudia** e **Cabañeros**.`,
      it: `🌾 **Castiglia-La Mancia Starlight**: **Serranía de Cuenca** (Bortle 2), **Sierra del Segura e Nerpio** (Bortle 1), **Ruidera**, **Valle de Alcudia** e **Cabañeros**.`,
      de: `🌾 **Kastilien-La Mancha Starlight**: **Serranía de Cuenca** (Bortle 2), **Sierra del Segura & Nerpio** (Bortle 1), **Ruidera**, **Valle de Alcudia** & **Cabañeros**.`,
    });
  }

  // 6g. EXTREMADURA
  if (q.includes('extremadura') || q.includes('monfrague') || q.includes('gata') || q.includes('hurdes') || q.includes('alqueva')) {
    return pick(l, {
      es: `🦅 **Extremadura Starlight**: **Parque Nacional de Monfragüe** (Torrejón el Rubio), **Sierra de Gata y Las Hurdes**, **Tajo Internacional** y **Gran Lago de Alqueva**.`,
      en: `🦅 **Extremadura Starlight**: **Monfragüe National Park**, **Sierra de Gata & Las Hurdes**, **International Tagus**, and **Great Lake Alqueva**.`,
      fr: `🦅 **Estrémadure Starlight** : **Parc National de Monfragüe**, **Sierra de Gata & Las Hurdes**, **Tage International** et **Lac d'Alqueva**.`,
      pt: `🦅 **Estremadura Starlight**: **Parque Nacional de Monfragüe**, **Serra de Gata e Las Hurdes**, **Tejo Internacional** e **Grande Lago do Alqueva**.`,
      it: `🦅 **Estremadura Starlight**: **Parco Nazionale di Monfragüe**, **Sierra de Gata e Las Hurdes**, **Tago Internazionale** e **Lago di Alqueva**.`,
      de: `🦅 **Extremadura Starlight**: **Nationalpark Monfragüe**, **Sierra de Gata & Las Hurdes**, **Internationaler Tajo** & **Alqueva-Stausee**.`,
    });
  }

  // 6h. LA RIOJA & CATALUÑA
  if (q.includes('rioja') || q.includes('montsec') || q.includes('prades') || q.includes('montsant') || q.includes('catalun') || q.includes('catalon')) {
    return pick(l, {
      es: `🍇 **La Rioja y Cataluña Starlight**: **Valles de Leza, Jubera, Cidacos y Alhama** (La Rioja, Bortle 2), **Parc Astronòmic Montsec** (Lleida) y **Muntanyes de Prades & Montsant** (Tarragona).`,
      en: `🍇 **La Rioja & Catalonia Starlight**: **Leza, Jubera, Cidacos & Alhama Valleys** (Bortle 2), **Montsec Astronomical Park** (Lleida) and **Muntanyes de Prades & Montsant** (Tarragona).`,
      fr: `🍇 **La Rioja & Catalogne Starlight** : **Vallées du Leza et Jubera** (Bortle 2), **Parc Astronomique du Montsec** (Lérida) et **Prades & Montsant** (Tarragone).`,
      pt: `🍇 **La Rioja e Catalunha Starlight**: **Vales do Leza e Jubera** (Bortle 2), **Parque Astronómico Montsec** (Lleida) e **Prades & Montsant**.`,
      it: `🍇 **La Rioja & Catalogna Starlight**: **Valli del Leza e Jubera** (Bortle 2), **Parco Astronomico Montsec** (Lleida) e **Prades & Montsant**.`,
      de: `🍇 **La Rioja & Katalonien Starlight**: **Täler von Leza & Jubera** (Bortle 2), **Astronomiepark Montsec** (Lleida) und **Muntanyes de Prades**.`,
    });
  }

  // 7. CASTELLÓN, TERUEL Y ARCO MEDITERRÁNEO
  if (q.includes('castellon') || q.includes('penyagolosa') || q.includes('culla') || q.includes('teruel') || q.includes('javalambre') || q.includes('galactica') || q.includes('maestrat')) {
    return pick(l, {
      es: `🌌 **Castellón y Teruel Starlight**: **Penyagolosa (1.814 m)**, **Culla**, **Morella** y **Ares del Maestrat** en Castellón, junto a **Gúdar-Javalambre / Centro Galáctica** (Observatorio OAJ, 1.957 m) y **Sierra de Albarracín** en Teruel (Bortle 2).`,
      en: `🌌 **Castellón & Teruel Starlight**: **Penyagolosa (1,814m)**, **Culla**, **Morella** & **Maestrat** in Castellón, plus **Gúdar-Javalambre / Galáctica** (OAJ Observatory, 1,957m) and **Sierra de Albarracín** in Teruel (Bortle 2).`,
      fr: `🌌 **Castellón & Teruel Starlight** : **Penyagolosa (1 814 m)**, **Culla**, **Morella** (Castellón) et **Gúdar-Javalambre / Galáctica** (Observatoire OAJ, 1 957 m) à Teruel (Bortle 2).`,
      pt: `🌌 **Castellón e Teruel Starlight**: **Penyagolosa (1.814 m)**, **Culla**, **Morella** e **Gúdar-Javalambre / Centro Galáctica** (Observatório OAJ, 1.957 m) em Teruel (Bortle 2).`,
      it: `🌌 **Castellón e Teruel Starlight**: **Penyagolosa (1.814 m)**, **Culla**, **Morella** e **Gúdar-Javalambre / Centro Galáctica** (Osservatorio OAJ, 1.957 m) a Teruel (Bortle 2).`,
      de: `🌌 **Castellón & Teruel Starlight**: **Penyagolosa (1.814 m)**, **Culla**, **Morella** sowie **Gúdar-Javalambre / Galáctica** (Observatorium OAJ, 1.957 m) & **Sierra de Albarracín** (Bortle 2).`,
    });
  }

  // 8. ESCALA BORTLE
  if (q.includes('bortle') || q.includes('contaminacion') || q.includes('pollution') || q.includes('lichtverschmutzung') || q.includes('sqm') || q.includes('oscuridad')) {
    return pick(l, {
      es: `🌌 **Escala Bortle (1–9)**:
- **Bortle 1 (SQM >21.75):** Cielo virgen; Vía Láctea proyecta sombra (Roque, Trevinca, Ancares).
- **Bortle 2–3 (SQM 21.3–21.75):** Cielo oscuro/rural ideal para astrofotografía (Vicort, Gúdar, Cuenca).
- **Bortle 4–6:** Suburbano. **Bortle 7–9:** Urbano (Luna y planetas brillantes).`,
      en: `🌌 **Bortle Dark-Sky Scale (1–9)**:
- **Bortle 1 (SQM >21.75):** Pristine sky; Milky Way casts shadows (La Palma, Trevinca, Atacama).
- **Bortle 2–3 (SQM 21.3–21.75):** Typical dark/rural skies ideal for deep sky & astrophotography.
- **Bortle 4–6:** Suburban transition. **Bortle 7–9:** Urban sky (Moon & bright planets only).`,
      fr: `🌌 **Échelle de Bortle (1–9)** :
- **Bortle 1 (SQM >21,75) :** Ciel pur ; la Voie lactée projette une ombre.
- **Bortle 2–3 (SQM 21,3–21,75) :** Ciel noir rural idéal pour le ciel profond et l'astrophoto.
- **Bortle 4–6 :** Périurbain. **Bortle 7–9 :** Urbain (Lune et planètes brillantes).`,
      pt: `🌌 **Escala Bortle (1–9)**:
- **Bortle 1 (SQM >21.75):** Céu virgem; Via Láctea projeta sombra.
- **Bortle 2–3 (SQM 21.3–21.75):** Céu escuro rural ideal para astrofotografia.
- **Bortle 4–6:** Suburbano. **Bortle 7–9:** Urbano (Lua e planetas brilhantes).`,
      it: `🌌 **Scala di Bortle (1–9)**:
- **Bortle 1 (SQM >21.75):** Cielo incontaminato; la Via Lattea proietta ombre.
- **Bortle 2–3 (SQM 21.3–21.75):** Cielo buio rurale perfetto per astrofotografia e profondo cielo.
- **Bortle 4–6:** Suburbano. **Bortle 7–9:** Urbano (solo Luna e pianeti brillanti).`,
      de: `🌌 **Bortle-Skala (1–9)**:
- **Bortle 1 (SQM >21,75):** Absolut dunkler Himmel; Milchstraße wirft Schatten.
- **Bortle 2–3 (SQM 21,3–21,75):** Dunkler Landhimmel ideal für Deep-Sky & Astrofotografie.
- **Bortle 4–6:** Vorstadt. **Bortle 7–9:** Stadthimmel (Mond & helle Planeten).`,
    });
  }

  // 9. LUNA & EVENTOS CELESTES
  if (
    q.includes('luna') ||
    q.includes('moon') ||
    q.includes('lune') ||
    q.includes('lua') ||
    q.includes('mond') ||
    q.includes('lluvia') ||
    q.includes('perseid') ||
    q.includes('geminid') ||
    q.includes('planeta') ||
    q.includes('planet') ||
    q.includes('saturn') ||
    q.includes('jupiter')
  ) {
    return pick(l, {
      es: `🌠 **Luna, Meteoros y Planetas**:
- **Luna Nueva:** Ventana perfecta para galaxias y Vía Láctea; **Cuartos** ideales para cráteres en el terminador lunar.
- **Lluvias Top:** **Perseidas** (12–13 ago) y **Gemínidas** (13–14 dic).
- **Planetas:** Anillos de **Saturno** desde 50x; lunas galileanas de **Júpiter** ya visibles con prismáticos 10x50.`,
      en: `🌠 **Moon, Meteor Showers & Planets**:
- **New Moon:** Best dark window for galaxies & Milky Way; **Quarter phases** reveal dramatic crater shadows along the terminator.
- **Top Showers:** **Perseids** (Aug 12–13) & **Geminids** (Dec 13–14).
- **Planets:** **Saturn's rings** clear at 50x magnification; **Jupiter's** 4 Galilean moons visible even in 10x50 binoculars.`,
      fr: `🌠 **Lune, Météores & Planètes** :
- **Nouvelle Lune :** Fenêtre idéale pour galaxies et Voie lactée ; **Quartiers** parfaits pour les cratères sur le terminateur.
- **Pluies majeures :** **Perséides** (12–13 août) et **Géminides** (13–14 déc).
- **Planètes :** Anneaux de **Saturne** dès 50x ; satellites galiléens de **Jupiter** visibles aux jumelles 10x50.`,
      pt: `🌠 **Lua, Meteoros e Planetas**:
- **Lua Nova:** Ideal para galáxias e Via Láctea; **Quartos** excelentes para crateras no terminador lunar.
- **Chuvas Principais:** **Perseidas** (12–13 ago) e **Gemínidas** (13–14 dez).
- **Planetas:** Anéis de **Saturno** a partir de 50x; luas galileanas de **Júpiter** visíveis até com binóculos 10x50.`,
      it: `🌠 **Luna, Sciami Meteorici & Pianeti**:
- **Luna Nuova:** Ideale per galassie e Via Lattea; **Quarti** ottimi per crateri lungo il terminatore.
- **Sciami Top:** **Perseidi** (12–13 ago) e **Geminidi** (13–14 dic).
- **Pianeti:** Anelli di **Saturno** già a 50x; lune galileiane di **Giove** visibili con binocoli 10x50.`,
      de: `🌠 **Mond, Meteorströme & Planeten**:
- **Neumond:** Bestes Zeitfenster für Galaxien & Milchstraße; **Halbmond** ideal für Krater am Terminator.
- **Top-Ströme:** **Perseiden** (12.–13. Aug.) & **Geminiden** (13.–14. Dez.).
- **Planeten:** **Saturnringe** ab 50x Vergrößerung; **Jupitermonde** schon im 10x50 Fernglas.`,
    });
  }

  // 9b. DARKSKY GLOBAL & USA
  if (
    q.includes('darksky') ||
    q.includes('dark sky') ||
    q.includes('eeuu') ||
    q.includes('estados unidos') ||
    q.includes('etats-unis') ||
    q.includes('stati uniti') ||
    q.includes('vereinigte staaten') ||
    q.includes('usa') ||
    q.includes('big bend') ||
    q.includes('arches') ||
    q.includes('bryce') ||
    q.includes('grand canyon') ||
    q.includes('death valley')
  ) {
    return pick(l, {
      es: `🌌 **Catálogo Global DarkSky® International en StellaWay**:
Explora **Parques, Reservas y Santuarios** acreditados en la pestaña **DarkSky®**: *Greater Big Bend* (Texas, mayor reserva del mundo), *Death Valley*, *Grand Canyon*, *Natural Bridges / Arches / Bryce Canyon* (Utah), *Aoraki Mackenzie* (Nueva Zelanda), *NamibRand* (Namibia) y *Pic du Midi* (Francia).`,
      en: `🌌 **DarkSky® International Global Catalog in StellaWay**:
Open the **DarkSky®** tab to explore certified Parks, Reserves & Sanctuaries worldwide: *Greater Big Bend* (Texas), *Death Valley*, *Grand Canyon*, *Utah's Mighty 5 (Arches, Bryce, Natural Bridges)*, *Aoraki Mackenzie* (New Zealand), *NamibRand* (Namibia) & *Pic du Midi* (France).`,
      fr: `🌌 **Catalogue Mondial DarkSky® International dans StellaWay** :
Dans l'onglet **DarkSky®**, explorez *Greater Big Bend* (Texas), *Death Valley*, *Grand Canyon*, les parcs de l'Utah (*Arches, Bryce*), *Aoraki Mackenzie* (Nouvelle-Zélande), *NamibRand* (Namibie) et *Pic du Midi* (France).`,
      pt: `🌌 **Catálogo Global DarkSky® International no StellaWay**:
Explore Parques, Reservas e Santuários no separador **DarkSky®**: *Greater Big Bend* (Texas), *Death Valley*, *Grand Canyon*, *Arches / Bryce Canyon* (Utah), *Aoraki Mackenzie* (Nova Zelândia), *NamibRand* e *Pic du Midi*.`,
      it: `🌌 **Catalogo Globale DarkSky® International in StellaWay**:
Nella scheda **DarkSky®** trovi Parchi, Riserve e Santuari certificati: *Greater Big Bend* (Texas), *Death Valley*, *Grand Canyon*, *Arches / Bryce Canyon* (Utah), *Aoraki Mackenzie* (Nuova Zelanda), *NamibRand* e *Pic du Midi*.`,
      de: `🌌 **DarkSky® International Weltkatalog in StellaWay**:
Im Tab **DarkSky®** findest du Parks, Reservate & Schutzgebiete wie *Greater Big Bend* (Texas), *Death Valley*, *Grand Canyon*, *Arches / Bryce Canyon* (Utah), *Aoraki Mackenzie* (Neuseeland), *NamibRand* & *Pic du Midi*.`,
    });
  }

  // 9c. AURORAS BOREALES Y AUSTRALES
  if (
    q.includes('aurora') ||
    q.includes('aurore') ||
    q.includes('boreal') ||
    q.includes('austral') ||
    q.includes('northern lights') ||
    q.includes('southern lights') ||
    q.includes('polarlicht') ||
    q.includes('tromso') ||
    q.includes('abisko') ||
    q.includes('rakiura') ||
    q.includes('fairbanks') ||
    q.includes('ushuaia') ||
    q.includes('kp') ||
    q.includes('geomagnet')
  ) {
    return pick(l, {
      es: `✨ **Atlas Mundial de Auroras (Boreales & Australes) en StellaWay** 🌌

1. **Hemisferio Norte (Boreal):** Noruega (*Tromsø, Lofoten, Senja, Svalbard*), Suecia (*Abisko* "Agujero Azul"), Finlandia (*Inari, Rovaniemi*), Islandia, Groenlandia, Canadá (*Yellowknife*) y Alaska (*Fairbanks*).
2. **Hemisferio Sur (Austral):** Tasmania (*Bruny Island*), Nueva Zelanda (*Rakiura / Stewart Island*, *Lake Tekapo*) y Patagonia (*Ushuaia*, *Puerto Williams*).
3. **Criterios Científicos:** **Kp 2–3** dentro del óvalo polar (Kp ≥ 5–6 en tormentas solares), **Bz negativo (Sur)** indispensable para abrir la magnetosfera, y foto **f/1.4–f/2.8 · 1–5s · ISO 1600–6400**.`,
      en: `✨ **Worldwide Aurora Atlas (Northern & Southern Lights) in StellaWay** 🌌

1. **Northern Hemisphere (Borealis):** Norway (*Tromsø, Lofoten, Senja, Svalbard*), Sweden (*Abisko* clear-sky "Blue Hole"), Finland (*Inari, Rovaniemi*), Iceland, Greenland, Canada (*Yellowknife*) & Alaska (*Fairbanks*).
2. **Southern Hemisphere (Australis):** Tasmania (*Bruny Island*), New Zealand (*Rakiura / Stewart Island*, *Lake Tekapo*) & Patagonia (*Ushuaia*, *Puerto Williams*).
3. **Key Science & Camera Metrics:** **Kp 2–3** inside the auroral oval (Kp ≥ 5–6 during geomagnetic storms), **southward/negative IMF Bz**, and camera **f/1.4–f/2.8 · 1–5s · ISO 1600–6400**.`,
      fr: `✨ **Atlas Mondial des Aurores (Boréales & Australes) dans StellaWay** 🌌

1. **Hémisphère Nord (Boréal) :** Norvège (*Tromsø, Lofoten, Senja, Svalbard*), Suède (*Abisko* « Trou Bleu »), Finlande (*Inari, Rovaniemi*), Islande, Groenland, Canada (*Yellowknife*) & Alaska (*Fairbanks*).
2. **Hémisphère Sud (Austral) :** Tasmanie (*Bruny Island*), Nouvelle-Zélande (*Rakiura / Stewart Island*, *Lac Tekapo*) & Patagonie (*Ushuaia*, *Puerto Williams*).
3. **Critères scientifiques :** **Kp 2–3** dans l'ovale auroral (Kp ≥ 5–6 lors de tempêtes solaires), champ **Bz négatif (Sud)**, et photo **f/1.4–f/2.8 · 1–5s · ISO 1600–6400**.`,
      pt: `✨ **Atlas Mundial de Auroras (Boreais & Austrais) no StellaWay** 🌌

1. **Hemisfério Norte (Boreal):** Noruega (*Tromsø, Lofoten, Senja, Svalbard*), Suécia (*Abisko* "Buraco Azul"), Finlândia (*Inari, Rovaniemi*), Islândia, Gronelândia, Canadá (*Yellowknife*) e Alasca (*Fairbanks*).
2. **Hemisfério Sul (Austral):** Tasmânia (*Bruny Island*), Nova Zelândia (*Rakiura / Ilha Stewart*, *Lago Tekapo*) e Patagónia (*Ushuaia*, *Puerto Williams*).
3. **Ciência & Câmara:** **Kp 2–3** no oval polar (Kp ≥ 5–6 em tempestades solares), **Bz negativo (Sul)** e foto **f/1.4–f/2.8 · 1–5s · ISO 1600–6400**.`,
      it: `✨ **Atlante Mondiale delle Aurore (Boreali & Australi) in StellaWay** 🌌

1. **Emisfero Nord (Boreale):** Norvegia (*Tromsø, Lofoten, Senja, Svalbard*), Svezia (*Abisko*), Finlandia (*Inari, Rovaniemi*), Islanda, Groenlandia, Canada (*Yellowknife*) & Alaska (*Fairbanks*).
2. **Emisfero Sud (Australe):** Tasmania (*Bruny Island*), Nuova Zelanda (*Rakiura / Stewart Island*, *Lago Tekapo*) & Patagonia (*Ushuaia*, *Puerto Williams*).
3. **Metriche chiave:** **Kp 2–3** nell'ovale polare (Kp ≥ 5–6 in tempeste solari), campo **Bz negativo (Sud)** e scatto **f/1.4–f/2.8 · 1–5s · ISO 1600–6400**.`,
      de: `✨ **Weltweiter Polarlicht-Atlas (Nord & Süd) in StellaWay** 🌌

1. **Nordhalbkugel (Borealis):** Norwegen (*Tromsø, Lofoten, Senja, Spitzbergen*), Schweden (*Abisko* „Blaues Loch“), Finnland (*Inari, Rovaniemi*), Island, Grönland, Kanada (*Yellowknife*) & Alaska (*Fairbanks*).
2. **Südhalbkugel (Australis):** Tasmanien (*Bruny Island*), Neuseeland (*Rakiura / Stewart Island*, *Lake Tekapo*) & Patagonien (*Ushuaia*, *Puerto Williams*).
3. **Wissenschaft & Kamera:** **Kp 2–3** im Polaroval (Kp ≥ 5–6 bei Sonnenstürmen), **negativer Bz-Wert (Südausrichtung)**, sowie **f/1.4–f/2.8 · 1–5s · ISO 1600–6400**.`,
    });
  }

  // 10. SALUDO EXPLÍCITO VS CONSULTA FUERA DE GUÍA OFFLINE
  const isGreeting = /^(hola|buenas|hello|hi|hey|bonjour|salut|ola|ciao|hallo|ayuda|help|aide)\b/i.test(
    q.trim()
  );

  if (isGreeting) {
    return pick(l, {
      es: `✨ **¡Hola! Soy Stella (modo guía rápida sin conexión).**

Puedo consultar temas rápidos offline sobre:
- 🌌 **Auroras** (observación a simple vista, índice Kp, Bz y destinos)
- 🔭 **Telescopios y prismáticos**
- 🌑 **Eclipses 2026 y 2027**
- 🏛️ **Destinos Starlight y DarkSky®** (Escala Bortle 1–9)
- 📸 **Astrofotografía de Vía Láctea**`,
      en: `✨ **Hello! I'm Stella (offline quick-guide mode).**

Offline topics available:
- 🌌 **Auroras** (naked-eye viewing, Kp index, Bz & locations)
- 🔭 **Telescopes & binoculars**
- 🌑 **Solar Eclipses 2026 & 2027**
- 🏛️ **Starlight & DarkSky® Reserves** (Bortle 1–9)
- 📸 **Milky Way Astrophotography**`,
      fr: `✨ **Bonjour ! Je suis Stella (mode guide hors ligne).**

Thèmes disponibles hors ligne : aurores, télescopes, éclipses 2026–2027, sites Starlight/DarkSky® et astrophotographie.`,
      pt: `✨ **Olá! Sou a Stella (modo guia offline).**

Tópicos disponíveis offline: auroras, telescópios, eclipses 2026–2027, zonas Starlight/DarkSky® e astrofotografia.`,
      it: `✨ **Ciao! Sono Stella (modalità guida offline).**

Argomenti offline: aurore, telescopi, eclissi 2026–2027, riserve Starlight/DarkSky® e astrofotografia.`,
      de: `✨ **Hallo! Ich bin Stella (Offline-Kurzführer).**

Offline-Themen: Polarlichter, Teleskope, Sonnenfinsternisse 2026–2027, Starlight/DarkSky®-Gebiete & Astrofotografie.`,
    });
  }

  return pick(l, {
    es: `📡 **Sin conexión al motor IA en la nube.** No tengo una ficha específica offline para esa pregunta concreta. Conéctate a internet para respuestas abiertas en tiempo real o prueba en offline con términos como: *auroras*, *telescopios*, *eclipse 2027*, *Bortle*, *Vía Láctea* o *Zaragoza / Canarias / Galicia*.`,
    en: `📡 **Offline mode:** I don't have a specific offline entry for that exact question. Connect online for full AI answers, or ask offline about: *auroras*, *telescopes*, *eclipse 2027*, *Bortle*, *Milky Way*, or *DarkSky*.`,
    fr: `📡 **Mode hors ligne :** Je n'ai pas de fiche précise hors ligne pour cette question. Connectez-vous pour l'IA complète ou demandez des sujets comme *aurores*, *télescopes*, *éclipse*, *Bortle* ou *Voie lactée*.`,
    pt: `📡 **Modo offline:** Não tenho uma ficha offline específica para essa pergunta. Ligue-se à internet para respostas completas ou consulte offline sobre *auroras*, *telescópios*, *eclipse*, *Bortle* ou *Via Láctea*.`,
    it: `📡 **Modalità offline:** Non ho una scheda offline specifica per questa domanda. Connettiti per l'IA completa oppure chiedi di *aurore*, *telescopi*, *eclissi*, *Bortle* o *Via Lattea*.`,
    de: `📡 **Offline-Modus:** Für diese konkrete Frage liegt kein Offline-Eintrag vor. Verbinde dich online für die vollständige KI oder frage offline nach *Polarlichtern*, *Teleskopen*, *Finsternis*, *Bortle* oder *Milchstraße*.`,
  });
}
