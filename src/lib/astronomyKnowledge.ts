/**
 * StellaWay - Motor Experto de Conocimiento Astronómico
 * Proporciona respuestas astronómicas ricas, precisas y rigurosas.
 * Actúa como motor principal y fallback inteligente ante indisponibilidad del modelo en la nube.
 */

export function generateAstronomicalAnswer(message: string, language: string = 'es'): string {
  const q = (message || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const isGerman = language === 'de';
  const isEnglish = language === 'en';

  // 1. ZARAGOZA & ARAGÓN
  if (q.includes('zaragoza') || q.includes('vicort') || q.includes('aranda') || q.includes('ariza') || q.includes('moncayo') || q.includes('daroca')) {
    if (isGerman) {
      return `🏛️ **Zertifizierte Starlight-Zonen in Saragossa (Aragonien, Spanien)** ⭐

In der Provinz Saragossa gibt es **3 offiziell von der Fundación Starlight zertifizierte Territorien**:
1. **Comarca del Aranda (Starlight-Reiseziel seit 2022):** Netzwerk von 11 Sternbeobachtungspunkten (Illueca, Purujosa, Calcena, Jarque, Tierga, Pomer).
2. **Sierra de Vicort (Starlight-Reiseziel seit Juli 2025):** Sediles, El Frasno, Mara, Miedes und der spektakuläre Aussichtspunkt *Pico del Rayo (1.427 m)* mit Bortle-2-Himmel.
3. **Ariza (Starlight-Gemeinde seit 2026):** Burg-Aussichtspunkt und Tal des Flusses Jalón.

*Zusätzliche Bergzonen:* Naturpark Moncayo (Observatorium Moncayo in Lituénigo) und Campo de Daroca / Lagune von Gallocanta.`;
    }
    if (isEnglish) {
      return `🏛️ **Certified Starlight Destinations in Zaragoza (Aragon, Spain)** ⭐

The province of Zaragoza features **3 official territories certified by the Starlight Foundation**:

1. **Comarca del Aranda (Starlight Tourist Destination since July 2022):**
   - Network of **11 stellar viewpoints** in mountain villages like Illueca, Purujosa ("Eagle's Nest"), Calcena, Jarque de Moncayo, Tierga, Pomer, and Gotor.
   - Astronomical trails and the historic Papa Luna Palace Castle.

2. **Sierra de Vicort (Starlight Tourist Destination since July 2025):**
   - Mountain range in Calatayud integrating Sediles, El Frasno, Mara, Miedes, and Villalba Perejil.
   - High summits exceeding 1,400m, featuring the **Pico del Rayo Viewpoint (1,427m)** with pristine Bortle 2 skies.

3. **Ariza (Starlight Municipality since 2026):**
   - Certified municipality with night-sky protected public lighting and panoramic castle ruin viewpoints.

*Complementary High-Sky Enclaves:*
- **Moncayo Natural Park & Lituénigo:** Somontano slopes with the Moncayo Astronomical Observatory.
- **Campo de Daroca & Gallocanta Lake:** "Daroca, mine of stars" project with unobstructed 360° horizons.`;
    }
    return `🏛️ **Zonas Certificadas Starlight en Zaragoza (Aragón, España)** ⭐

En la provincia de Zaragoza existen **3 territorios certificados oficialmente por la Fundación Starlight**:

1. **Comarca del Aranda (Destino Turístico Starlight desde julio de 2022):**
   - Red comarcal de **11 miradores estelares** protegidos en municipios como Illueca, Purujosa ("El Nido de Águilas"), Calcena, Jarque de Moncayo, Tierga, Pomer y Gotor.
   - Cuenta con senderos astronómicos señalizados y el imponente Castillo Palacio del Papa Luna.

2. **Sierra de Vicort (Destino Turístico Starlight desde julio de 2025):**
   - Espacio de montaña en la comarca de Calatayud que integra municipios como Sediles, El Frasno, Mara, Miedes y Villalba Perejil.
   - Cumbres que superan los 1.400 m con el **Mirador astronómico del Pico del Rayo (1.427 m)** y el Santuario de la Virgen de Vicor, con cielos oscuros de Bortle 2.

3. **Ariza (Municipio Starlight desde 2026):**
   - Municipio acreditado oficialmente en la comarca de Calatayud con alumbrado de protección nocturna y mirador panorámico en las ruinas del Castillo de Ariza sobre el valle del río Jalón.

*Enclaves complementarios de montaña en Zaragoza:*
- **Parque Natural del Moncayo & Lituénigo:** Cumbre del Moncayo (2.314 m) y el Observatorio Astronómico del Moncayo.
- **Campo de Daroca & Laguna de Gallocanta:** Proyecto "Daroca, mina de estrellas" con amplios horizontes despejados de 360°.`;
  }

  // 2. GALICIA
  if (q.includes('galicia') || q.includes('trevinca') || q.includes('cies') || q.includes('muras') || q.includes('finisterre') || q.includes('fisterra') || q.includes('costa da morte') || q.includes('ancares')) {
    if (isGerman) {
      return `🌊 **Zertifizierte Starlight-Zonen in Galicien (Spanien)** ⭐

Galicien verfügt über **7 offiziell zertifizierte Starlight-Gebiete**:
1. **Pena Trevinca - A Veiga (Ourense, 2015):** Erstes Starlight-Reiseziel Galiciens auf 2.127 m mit Observatorium & Planetarium.
2. **Nationalpark Illas Atlánticas (Pontevedra/A Coruña, 2016):** Cíes- und Ons-Inseln mit ozeanischer Dunkelheit.
3. **Muras - Serra do Xistral (Lugo, 2020):** Starlight-Gemeinde mit kristallklarem Himmel.
4. **Costa da Morte (A Coruña, 2023):** Fisterra, Muxía und Carnota mit endlosem Westhorizont.
5. **Mariñas Coruñesas e Terras do Mandeo (A Coruña, 2023):** Biosphärenreservat.
6. **Lalín (Pontevedra, 2023):** Starlight-Gemeinde mit Observatorium do Castro.
7. **Ancares Lucenses (Lugo, 2023):** Hochgebirgstal unter Bortle-1-Himmel.`;
    }
    if (isEnglish) {
      return `🌊 **Certified Starlight Spaces in Galicia (Spain)** ⭐

Galicia is an international dark-sky reference with **7 official territories certified by the Starlight Foundation**:

1. **Pena Trevinca - A Veiga (Ourense - Certified 2015):** The first Starlight Destination in Galicia. Highest peak in the region (2,127m) hosting the Trevinca Astronomical Center with observatory and planetarium.
2. **Atlantic Islands National Park (Pontevedra / A Coruña - Certified 2016):** Cíes Islands, Ons, Sálvora, and Cortegada with ocean-dark skies and Milky Way arching over the sea.
3. **Muras - Serra do Xistral (Lugo - Certified 2020):** Starlight town with high peat bogs and zero light pollution.
4. **Costa da Morte (A Coruña - Certified 2023):** Cape Finisterre, Muxía, Carnota, and Camariñas with infinite western horizons.
5. **Mariñas Coruñesas e Terras do Mandeo (A Coruña - Certified 2023):** Biosphere Reserve & Starlight Destination.
6. **Lalín - Deza (Pontevedra - Certified 2023):** Starlight Municipality with the Lalín Astronomical Observatory.
7. **Ancares Lucenses, Cervantes & Navia (Lugo - Certified 2023):** Glacial valleys and ancient mountain pallozas under pure Bortle 1 skies.`;
    }
    return `🌊 **Zonas Certificadas Starlight en Galicia (España)** ⭐

Galicia cuenta con **7 espacios certificados oficialmente por la Fundación Starlight**:

1. **Pena Trevinca - A Veiga (Ourense - Certificado en 2015):**
   - El primer Destino Turístico Starlight de Galicia. Enclavado en el Macizo de Trevinca con el pico más alto de Galicia (2.127 m), alberga el Centro Astronómico de Trevinca con planetario y cúpula.
2. **Parque Nacional das Illas Atlánticas (Pontevedra / A Coruña - Certificado en 2016):**
   - Archipiélagos de las **Islas Cíes, Isla de Ons, Sálvora y Cortegada**. Oscuridad oceánica pura, Vía Láctea sobre el mar y rutas nocturnas guiadas con astrónomos.
3. **Muras - Serra do Xistral (Lugo - Certificado en 2020):**
   - Municipio Starlight en el norte montañoso de Lugo, con los miradores astronómicos de Campo da Feira y O Cristo.
4. **Costa da Morte (A Coruña - Certificado en 2023):**
   - Extremo occidental continental (Fisterra, Muxía, Carnota y Camariñas) con horizonte oeste de oscuridad oceánica infinita sobre el Atlántico.
5. **Mariñas Coruñesas e Terras do Mandeo (A Coruña - Certificado en 2023):**
   - Reserva de la Biosfera Starlight que protege los valles y montes de Curtis, Sobrado y Aranga.
6. **Lalín - Deza (Pontevedra - Certificado en 2023):**
   - Municipio Starlight con el Observatorio Astronómico de Lalín en el Castro Tecnológico y miradores en la Serra do Candán.
7. **Ancares Lucenses, Cervantes y Navia (Lugo - Certificado en 2023):**
   - Reserva de la Biosfera en alta montaña con valles glaciares y pallozas milenarias bajo una cúpula estelar Bortle 1.`;
  }

  // 3. ECLIPSES (2026 / 2027)
  if (q.includes('eclipse') || q.includes('2026') || q.includes('2027') || q.includes('solar') || q.includes('finsternis')) {
    if (isGerman) {
      return `✨ **Leitfaden zu den großen totalen Sonnenfinsternissen in Spanien** 🌑

1. **12. August 2026 (Große totale Sonnenfinsternis):**
   - **Totalitätszone:** Galicien, Asturien, Kastilien und León, Aragón (Saragossa, Teruel), Castellón (Maestrat/Penyagolosa) und Balearen.
   - **Uhrzeit:** Später Nachmittag (~19:30 - 20:30 Uhr MESZ), Sonne steht ca. 10°-12° über dem Westhorizont.
   - **Augenschutz:** Verwende unbedingt eine nach **ISO 12312-2** zertifizierte Sonnenfinsternisbrille während aller partiellen Phasen.

2. **2. August 2027 (Das Jahrhundert-Eclipse):**
   - **Totalitätszone:** Südspanien / Andalusien (Cádiz, Tarifa, Málaga, Granada, Almería).
   - **Dauer:** Über **4 Minuten und 30 Sekunden** totale Verfinsterung zur Mittagszeit!`;
    }
    if (isEnglish) {
      return `✨ **Guide to the Great Total Solar Eclipses in Spain** 🌑

1. **August 12, 2026 — The Great Iberian Total Solar Eclipse:**
   - **Totality Path:** Crosses Galicia, Asturias, Castile & León, Aragon (Zaragoza, Teruel), northern Castellón (Maestrat & Penyagolosa), and the Balearic Islands.
   - **Timing:** Late afternoon (~19:30 to 20:30 CEST), with the Sun 10°–12° above the western horizon.
   - **Safety:** You MUST use certified **ISO 12312-2** eclipse glasses during all partial phases. Remove glasses only during totality (~1m 45s).

2. **August 2, 2027 — Eclipse of the Century:**
   - **Totality Path:** Southern Spain (Andalusia: Cádiz, Tarifa, Málaga, Granada, Almería) and North Africa.
   - **Duration:** Over **4 minutes and 30 seconds** of daytime darkness at solar noon!`;
    }
    return `✨ **Guía de los Grandes Eclipses Solares Totales en España** 🌑

1. **Gran Eclipse Solar Total — 12 de Agosto de 2026:**
   - **Franja de Totalidad:** Cruza Galicia, Asturias, Cantabria, Castilla y León, Aragón (Zaragoza, Teruel), interior y costa norte de Castellón (Maestrat / Penyagolosa) y las Islas Baleares.
   - **Horario:** Ocurrirá a última hora de la tarde (~19:30 a 20:30h CEST), con el Sol a baja elevación (unos 10°-12° sobre el horizonte oeste).
   - **Seguridad:** Usa gafas con filtro certificado **ISO 12312-2** o lámina Baader AstroSolar durante todas las fases parciales. Solo se retiran durante los ~1m45s de totalidad.

2. **Gran Eclipse del Siglo — 2 de Agosto de 2027:**
   - **Franja de Totalidad:** Sur de Andalucía (Cádiz, Tarifa, Málaga, costa de Granada y Almería) y norte de África.
   - **Duración:** ¡Más de **4 minutos y 30 segundos** de oscuridad absoluta a pleno mediodía!

¿Deseas coordenadas de miradores despejados al oeste o ajustes de cámara para fotografiar la corona?`;
  }

  // 4. TELESCOPIOS & EQUIPO
  if (q.includes('telescop') || q.includes('comprar') || q.includes('equipo') || q.includes('ocular') || q.includes('apertura') || q.includes('dobson') || q.includes('refractor') || q.includes('maksutov')) {
    if (isGerman) {
      return `🔭 **StellaWays Teleskop- und Optik-Empfehlungen**:

1. **Beste Wahl für Einsteiger & visuelle Beobachtung (Große Öffnung):**
   - **Dobson 150mm oder 200mm (6" oder 8")** (z. B. *Sky-Watcher Classic 200P*). Größte Lichtsammelleistung pro Euro für Mondkrater, Saturnringe, Jupiterbänder und Galaxien unter Bortle 2–4.
2. **Kompakt & für Planeten/Reisen:**
   - **Maksutov-Cassegrain 90mm bis 127mm** auf azimutaler Montierung. Keine chromatische Aberration.
3. **Für Deep-Sky-Astrofotografie:**
   - **Apochromatischer ED-Refraktor (70–80mm f/6)** auf parallaktischer GoTo-Montierung (*HEQ5 Pro* oder *Star Adventurer GTi*).
4. **Wichtiges Zubehör:** 2x achromatische Barlow-Linse, 32mm Plössl-Okular für Weitfeld und Rotlichtlampe.`;
    }
    if (isEnglish) {
      return `🔭 **StellaWay's Telescope & Optics Buying Guide**:

1. **Best for Beginners / Visual Astronomy (Maximum Aperture):**
   - **Dobsonian 150mm or 200mm (6" or 8")** (e.g. *Sky-Watcher Classic 200P*). Offers the most light-gathering power per dollar, revealing Saturn's rings, Jupiter's Great Red Spot, and Messier deep-sky objects.
2. **Best for Portability & Lunar/Planetary observing:**
   - **Maksutov-Cassegrain 90mm to 127mm** (e.g. *Skymax 102/127*). Ultra-compact optical tube, razor-sharp on planets.
3. **Best for Deep-Sky Astrophotography:**
   - **ED / APO Refractor (70–80mm f/6)** on a motorized equatorial mount (e.g. *Sky-Watcher Star Adventurer GTi* or *HEQ5 Pro*).
4. **Essential Accessories:** 2x Barlow lens, a 32mm Plössl wide-field eyepiece, and a red headlamp for dark adaptation.`;
    }
    return `🔭 **Recomendaciones de Telescopios por StellaWay**:

1. **Mejor opción para iniciación y observación visual (Gran Apertura):**
   - **Telescopio Dobson de 150mm o 200mm (6" u 8")** (ej. *Sky-Watcher Skyliner 200P* o *GSO Deluxe*).
   - *Por qué:* Ofrece la mayor captación de luz por euro invertido. Permite resolver cúmulos globulares (M13), detalles en Júpiter, los anillos de Saturno y nebulosas (Orión M42) con claridad inigualable en cielos Bortle 2-4.

2. **Mejor para portabilidad y observación planetaria / urbana:**
   - **Maksutov-Cassegrain de 90mm a 127mm** (ej. *Sky-Watcher Skymax 102/127*).
   - *Por qué:* Tubo óptico ultra compacto, sin aberración cromática y fácil de transportar en mochila de senderismo.

3. **Mejor para Astrofotografía de Cielo Profundo:**
   - **Refractor Apocromático (ED Triplete o Doblete 70-80mm f/6)** montado sobre una base ecuatorial motorizada (ej. *Sky-Watcher HEQ5 Pro* o montura ligera *Star Adventurer GTi*).

4. **Accesorios Indispensables:**
   - Ocular gran angular (24mm o 32mm) para localizar objetos débiles.
   - Lente Barlow 2x acromática para duplicar aumentos en planetaria.
   - Luz roja de preservación de visión nocturna (para no deslumbrar la retina).

¿Tienes algún presupuesto estimado o prefieres visualización vs astrofotografía?`;
  }

  // 5. ASTROFOTOGRAFÍA
  if (q.includes('astrofotograf') || q.includes('camara') || q.includes('via lactea') || q.includes('milky way') || q.includes('foto') || q.includes('sensor') || q.includes('apilado') || q.includes('siril')) {
    if (isGerman) {
      return `📸 **Astrofotografie-Kurztipps für die Milchstraße**:

1. **Objektiv:** Lichtstarkes Weitwinkel (14mm bis 24mm) mit Offenblende (**f/1.4, f/1.8 oder f/2.8**).
2. **Belichtungszeit (NPF-Regel):** Ca. 10 bis 15 Sekunden bei 24mm Vollformat, um punktförmige Sterne zu behalten.
3. **ISO-Wert:** Zwischen **ISO 3200 und 6400**.
4. **Manueller Fokus (MF):** 10x Digitalzoom im Live-View auf einen hellen Stern (z. B. Wega), bis er nadelspitz klein ist.
5. **Stacking:** Im **RAW-Format** aufnehmen und 10–15 Bilder in *Siril* oder *Sequator* stacken, um das Sensorrauschen zu eliminieren.`;
    }
    if (isEnglish) {
      return `📸 **Milky Way & Night Landscape Photography Guide**:

1. **Lens:** Ultra-wide angle (14mm to 24mm) with fast aperture (**f/1.8 or f/2.8**).
2. **Exposure Time (NPF Rule):** Around 10–15s on 24mm full frame to keep stars as sharp pinpoints without trailing.
3. **ISO Setting:** Between **ISO 3200 and 6400** (depending on sensor ISO invariance).
4. **Pinpoint Focus:** Switch to Manual Focus (MF), 10x digital zoom in Live View on a bright star (e.g. Vega), and adjust until it's as small as possible.
5. **Post-Processing:** Shoot strictly in **RAW**, capture 10–20 consecutive frames, and stack them in free software like *Siril* or *Sequator* to eliminate digital noise.`;
    }
    return `📸 **Guía Experta para Astrofotografía de la Vía Láctea**:

1. **Objetivo Recomendado:** Gran angular luminoso (14mm a 24mm) con apertura amplia (**f/1.4, f/1.8 o f/2.8**).
2. **Tiempo de Exposición (Regla NPF):**
   - Para un objetivo de 24mm en sensor Full Frame: entre 10 y 15 segundos para evitar que las estrellas salgan como trazos.
3. **Sensibilidad ISO:** Entre **ISO 3200 y 6400** (busca el punto de invariancia ISO de tu sensor).
4. **Enfoque Preciso:**
   - Desactiva el autoenfoque (pasa a Enfoque Manual - MF).
   - Haz zoom digital x10 en la pantalla LCD apuntando a una estrella brillante (como Vega o Sirio) y gira el anillo milimétricamente hasta que sea un punto minúsculo.
5. **Procesado y Apilado:**
   - Dispara siempre en formato **RAW**.
   - Haz entre 10 y 20 tomas consecutivas y apílalas con software gratuito como *Sequator* (Windows) o *Siril* (Mac/Linux) para eliminar el ruido térmico del sensor.`;
  }

  // 6. CANARIAS
  if (q.includes('canarias') || q.includes('palma') || q.includes('teide') || q.includes('tenerife') || q.includes('muchachos') || q.includes('fuerteventura') || q.includes('gran canaria') || q.includes('sicasumbre') || q.includes('risco caido')) {
    return `✨ **Astroturismo en las Islas Canarias (Cielos Starlight de Nivel Mundial)** 🇮🇨

Canarias alberga una de las ventanas astronómicas más limpias del planeta gracias a la **Ley del Cielo** (Ley 31/1988) y la capa de inversión térmica provocada por los vientos alisios:

1. **La Palma — Reserva Starlight y Roque de los Muchachos (2.426 m):**
   - Sede del Gran Telescopio Canarias (GTC, 10.4 m) y observatorios de astrofísica de altas energías MAGIC y CTA.
   - SQM > 21.90 mag/arcsec² y más de 300 noches despejadas al año.
2. **Tenerife — Parque Nacional del Teide:**
   - Destino Turístico Starlight por encima del mar de nubes (2.000 - 2.400 m) y el Observatorio del Teide en Izaña.
3. **Fuerteventura — Reserva Starlight completa:**
   - Cielos desérticos oceánicos de Bortle 1. Destaca el **Mirador Astronómico de Sicasumbre** (equipado con relojes de sol y nocturnos y soportes para telescopios), Morro Velosa y la península de Jandía.
4. **Cumbres de Gran Canaria & Risco Caído:**
   - Destino Turístico Starlight donde la arqueoastronomía aborigen (Patrimonio Mundial UNESCO) se une con la cumbre del Pico de las Nieves (1.949 m) y la Degollada de las Palomas.`;
  }

  // 6b. ISLAS BALEARES (MENORCA)
  if (q.includes('menorca') || q.includes('baleares') || q.includes('toro') || q.includes('cavalleria')) {
    return `🏝️ **Reserva y Destino Turístico Starlight Isla de Menorca** ⭐

Toda la isla de Menorca está certificada por la Fundación Starlight desde enero de 2019:
- **Monte Toro (358 m):** Cima central con visión panorámica de 360° sobre toda la isla y horizonte marino sin obstáculos.
- **Faros Históricos:** Faro de Cavalleria y Faro de Punta Nati, en los acantilados de la costa norte, con horizonte marino de altísima oscuridad.
- **Parque Natural s'Albufera des Grau y Cala Pregonda:** Cielos protegidos y acústica natural nocturna perfecta.
- Menorca cuenta con una red de alojamientos rurales Starlight y empresas de divulgación astronómica con telescopios en calas vírgenes.`;
  }

  // 6c. NAVARRA (VALLE DE RONCAL)
  if (q.includes('roncal') || q.includes('navarra') || q.includes('belagua') || q.includes('isaba') || q.includes('larra')) {
    return `🏔️ **Destino Turístico Starlight Valle de Roncal (Navarra)** ⭐

El Valle de Roncal, en el Pirineo navarro oriental, es el primer Destino Starlight de Navarra:
- **Macizo de Larra y Rincón de Belagua:** Alta montaña pirenaica kárstica a más de 1.400 m de altitud con aire finísimo y Bortle 2.
- **Centro de Montaña Larra-Belagua y Mata de Haya:** Puntos de observación acondicionados para telescopios y astrofotografía.
- **Municipios del Valle:** Isaba, Uztárroz, Roncal, Burgui, Garde, Urzainqui y Vidángoz, todos comprometidos con la protección de la noche pirenaica.`;
  }

  // 6d. CASTILLA Y LEÓN (BABIA, GREDOS, SIERRA DE FRANCIA, TIERRAS ALTAS DE SORIA)
  if (q.includes('babia') || q.includes('cuatro valles') || q.includes('leon') || q.includes('gredos') || q.includes('sierra de francia') || q.includes('soria') || q.includes('tierras altas') || q.includes('muriel')) {
    return `🏰 **Territorios Starlight en Castilla y León** ⭐

Castilla y León cuenta con una excepcional constelación de espacios Starlight:
1. **Parque Estelar y Reserva Starlight Cuatro Valles y Babia (León):** En la Cordillera Cantábrica (San Emiliano, Riolago de Babia, Puerto de Ventana) a más de 1.300 m con cielo Bortle 1.
2. **Sierra de Gredos Norte (Ávila):** Uno de los primeros Destinos Starlight de España, con miradores en Navarredonda, Hoyos del Espino y la Plataforma de Gredos.
3. **Sierra de Francia y Las Quilamas (Salamanca):** El Santuario de la Peña de Francia (1.727 m) y pueblos como La Alberca y Miranda del Castañar.
4. **Soria Starlight:** **Muriel Viejo** (Pueblo Starlight pionero) y el **Destino Starlight Tierras Altas de Soria** (San Pedro Manrique, Puerto de Oncala a 1.454 m y Fuentes de Magaña).`;
  }

  // 6e. ANDALUCÍA (SIERRA MORENA, PEDROCHES, CAZORLA, FILABRES/CALAR ALTO, TORCAL, SIERRA NEVADA)
  if (q.includes('andalucia') || q.includes('pedroches') || q.includes('cordoba') || q.includes('torcal') || q.includes('antequera') || q.includes('cazorla') || q.includes('alar alto') || q.includes('filabres') || q.includes('almanzora') || q.includes('sierra morena') || q.includes('sierra nevada') || q.includes('alpujarra')) {
    return `⭐ **Red de Territorios Starlight en Andalucía** 🌌

Andalucía posee la mayor concentración de reservas y destinos astronómicos de Europa:
1. **Reserva Starlight Sierra Morena Andaluza:** La reserva de cielo oscuro más grande del planeta (más de 400 km a través de Jaén, Córdoba, Sevilla y Huelva).
2. **Reserva Starlight Los Pedroches (Córdoba):** 17 municipios con una red de 17 miradores astronómicos en dehesas centenarias de encinas.
3. **Paraje Starlight El Torcal de Antequera (Málaga):** Paisaje kárstico a 1.200 m con su Observatorio Astronómico (OATA) permanente.
4. **Sierras de Cazorla, Segura y Las Villas (Jaén):** Con los Campos de Hernán Perea (1.650 m), el mayor altiplano desértico estelar de España con Bortle 1.
5. **Sierra de Los Filabres y Calar Alto (Almería):** Hogar del mayor observatorio astrofísico continental (CAHA, 2.168 m) bajo cielos semidesérticos ultrasecos.
6. **Sierra Nevada y La Alpujarra (Granada):** Cúpulas a más de 2.500 m en la Hoya de la Mora y pueblos de alta montaña como Capileira y Trevélez.
7. **Sierra Sur de Jaén:** Destino Starlight pionero con observatorios en Alcalá la Real y Frailes.`;
  }

  // 6f. CASTILLA-LA MANCHA (CUENCA, SIERRA DEL SEGURA, NERPIO, ALCUDIA, CABAÑEROS)
  if (q.includes('castilla-la mancha') || q.includes('mancha') || q.includes('cuenca') || q.includes('nerpio') || q.includes('sierra del segura') || q.includes('alcudia') || q.includes('cabaneros') || q.includes('alcaraz')) {
    return `🌾 **Destinos Starlight en Castilla-La Mancha** ⭐

1. **Serranía de Cuenca:** Reserva y Destino Starlight (Vega del Codorno, Las Majadas, Parque Cinegético de El Hosquillo) con cañones kársticos y cielo Bortle 2.
2. **Sierra del Segura y Nerpio (Albacete):** Nerpio es Municipio Starlight y alberga telescopios remotos profesionales; Ayna, Yeste y Riópar completan la comarca con Bortle 1.
3. **Sierra de Alcaraz y Campo de Montiel (Albacete / Ciudad Real):** Horizontes cervantinos abiertos de 360° y Lagunas de Ruidera.
4. **Valle de Alcudia y Sierra Madrona (Ciudad Real):** Dehesas protegidas y pinturas rupestres bajo cielos vírgenes en Fuencaliente y Pico de la Bañuela (1.332 m).
5. **Parque Nacional de Cabañeros:** Rutas nocturnas 4x4 por la raña y centro de visitantes con observatorio astronómico.`;
  }

  // 6g. EXTREMADURA (MONFRAGÜE, SIERRA DE GATA, HURDES, TAJO INTERNACIONAL, ALQUEVA)
  if (q.includes('extremadura') || q.includes('monfrague') || q.includes('gata') || q.includes('hurdes') || q.includes('tajo internacional') || q.includes('alqueva') || q.includes('caceres') || q.includes('badajoz')) {
    return `🦅 **Extremadura Buenas Noches — Destinos y Reservas Starlight** ⭐

Extremadura es pionera en la integración de redes de miradores celestes retroiluminados:
1. **Parque Nacional de Monfragüe (Cáceres):** Reserva Starlight con el Observatorio de Torrejón el Rubio y el mirador del Salto del Gitano.
2. **Sierra de Gata y Las Hurdes (Cáceres):** Destino Starlight con el Castillo de Trevejo, Meandro del Melero y Puerto de Esperabán (1.295 m).
3. **Parque Natural Tajo Internacional (Cáceres):** Reserva Starlight en el cañón fronterizo del río Tajo, con dólmenes prehistóricos en Valencia de Alcántara.
4. **Entorno del Gran Lago de Alqueva (Badajoz):** Primer Destino Starlight Transfronterizo (Olivenza, Cheles, Alconchel y Villanueva del Fresno).`;
  }

  // 6h. LA RIOJA & CATALUÑA
  if (q.includes('rioja') || q.includes('montsec') || q.includes('prades') || q.includes('montsant') || q.includes('cataluna')) {
    return `🍇 **Territorios Starlight en La Rioja y Cataluña** ⭐

- **La Rioja — Reserva Starlight Valles del Leza, Jubera, Cidacos y Alhama:** Reserva de la Biosfera en el Sistema Ibérico riojano (Munilla, Enciso, Contrebia Leucade) con huellas de dinosaurios y noches de Bortle 2.
- **Cataluña — Parc Astronòmic Montsec (Lleida):** Uno de los centros astronómicos más avanzados del mundo con el OAdM y cúpula "Ojo del Montsec".
- **Cataluña — Muntanyes de Prades y Montsant (Tarragona):** Destino Starlight con el Parc Astronòmic Muntanyes de Prades (PAMP) y la cumbre del Tossal de la Baltasana (1.201 m).`;
  }

  // 7. CASTELLÓN, TERUEL Y ARCO MEDITERRÁNEO
  if (q.includes('castellon') || q.includes('penyagolosa') || q.includes('culla') || q.includes('teruel') || q.includes('javalambre') || q.includes('galactica') || q.includes('maestrat')) {
    return `🌌 **Cielos Starlight en Castellón y Teruel (Gúdar-Javalambre & Maestrat)** ⭐

El sistema ibérico oriental cuenta con una de las mayores reservas de cielo oscuro de la Europa continental:

1. **Castellón (Maestrat & Penyagolosa):**
   - **Parque Natural del Penyagolosa (1.814 m):** La cumbre más emblemática de Castellón con cielo Bortle 2-3.
   - **Culla:** Municipio y Destino Starlight certificado con observatorio astronómico municipal y actividades regulares de divulgación.
   - **Ares del Maestrat y Morella:** Alta meseta con horizontes diáfanos y muy baja humedad en noches invernales.
2. **Teruel (Comarca Gúdar-Javalambre):**
   - **Arcos de las Salinas y Centro Galáctica:** Parque de divulgación astronómica profesional al pie del Observatorio Astrofísico de Javalambre (OAJ) en el Pico del Buitre (1.957 m).
   - **Sierra de Albarracín:** Bosques de pino albar bajo cielos de Bortle 2.`;
  }

  // 8. ESCALA BORTLE & CONTAMINACIÓN LUMÍNICA
  if (q.includes('bortle') || q.includes('contaminacion') || q.includes('sqm') || q.includes('oscuridad')) {
    return `🌌 **La Escala Bortle de Calidad de Cielo Nocturno (1 al 9)**:

- **Clase 1 (Cielo Oscuro Virgen):** La Vía Láctea arroja sombra visible en el suelo. Galaxia de Andrómeda y M33 visibles a simple vista. SQM > 21.75. (Ej. Roque de los Muchachos, Trevinca, Ancares).
- **Clase 2 (Cielo Oscuro Típico):** Vía Láctea con estructuras complejas y nebulosas oscuras visibles. SQM 21.5 - 21.75. (Ej. Vicort, Gúdar-Javalambre, Serranía de Cuenca, Gredos).
- **Clase 3 (Cielo Rural):** Alguna cúpula de luz lejana en el horizonte. SQM 21.3 - 21.5. (Ej. Penyagolosa, Muras, Aranda).
- **Clase 4 (Transición Rural / Suburbana):** Vía Láctea visible alta en el cielo pero débil cerca del horizonte. SQM 20.4 - 21.3.
- **Clase 5-6 (Cielo Suburbano):** Vía Láctea muy difusa o imperceptible. SQM 19.1 - 20.4.
- **Clase 7-9 (Cielo Urbano e Interior de Ciudad):** Solo la Luna, planetas y estrellas más brillantes (Vega, Sirio) son visibles. SQM < 18.0.

*Consejo:* En StellaWay puedes filtrar miradores directamente por su Clase Bortle y SQM certificado.`;
  }

  // 9. LUNA & EVENTOS CELESTES
  if (q.includes('luna') || q.includes('lluvia') || q.includes('perseidas') || q.includes('geminidas') || q.includes('planeta') || q.includes('saturno') || q.includes('jupiter')) {
    return `🌠 **Efemérides y Observación del Sistema Solar**:

- **Fases Lunares:**
  - Para observar objetos de cielo profundo (galaxias, nebulosas y cúmulos), planifica tus salidas durante la **Luna Nueva** o los 4 días antes y después.
  - Para observar la Luna con telescopio, el mejor momento son los **cuartos creciente y menguante**, apuntando al *terminador* (la línea que separa el día de la noche lunar) para apreciar el relieve de cráteres y montañas.
- **Grandes Lluvias de Meteoros:**
  - **Perseidas ("Lágrimas de San Lorenzo"):** Pico el 12-13 de agosto (~100 meteoros/hora).
  - **Gemínidas:** Pico el 13-14 de diciembre (~120-150 meteoros/hora, muy brillantes y lentas).
  - **Cuadrántidas:** Pico a principios de enero.
- **Planetas Gigantes:**
  - **Saturno:** Anillos visibles con cualquier telescopio a partir de 60mm de apertura con 50x aumentos.
  - **Júpiter:** 4 lunas galileanas (Ío, Europa, Ganímedes y Calisto) visibles incluso con prismáticos 10x50.`;
  }

  // 10. GENERAL / BIENVENIDA
  if (isGerman) {
    return `✨ **Hallo! Ich bin Stella, deine astronomische KI-Assistentin von StellaWay.**

Ich unterstütze dich bei allen Themen rund um den Nachthimmel:
- 🔭 **Teleskop- und Okularkauf** passend zu deinem Budget.
- 🌑 **Totale Sonnenfinsternis 2026 & 2027 in Spanien** (Totalitätszonen, Zeiten, ISO-Filter).
- 🏛️ **Zertifizierte Starlight-Zonen** (Saragossa, Galicien, Teruel, Kanaren, Andalusien).
- 📸 **Astrofotografie der Milchstraße** (Kameraeinstellungen, NPF-Regel, RAW-Stacking).
- 🌌 **Bortle-Skala & Dunkelhimmelsuche**.

Wie kann ich dir bei deiner nächsten Beobachtungsnacht helfen?`;
  }
  if (isEnglish) {
    return `✨ **Hello! I'm Stella, your Starlight Astronomical AI Assistant from StellaWay.**

I am ready to assist you with everything related to astronomy and the cosmos:
- 🔭 **Telescope & Eyepiece recommendations** tailored to your budget and observing goals.
- 🌑 **Planning the Great Total Solar Eclipses of 2026 & 2027 in Spain** (totality paths, timing, ISO 12312-2 filters).
- 🏛️ **Certified Starlight Destinations** in Spain (Zaragoza, Galicia, Teruel, Canary Islands, Cuenca, Andalusia).
- 📸 **Milky Way & Deep-Sky Astrophotography** (exposure settings, NPF rule, stacking).
- 🌌 **Dark Sky Locations (Bortle Scale 1-3)** and real-time observing conditions.

What would you like to explore in the night sky today?`;
  }

  return `✨ **¡Hola! Soy Stella, tu Asistente Astronómica experta de StellaWay.**

Estoy lista para guiarte en cualquier consulta astronómica:
- 🔭 **Telescopios, oculares y equipo de observación** adaptados a tu presupuesto y nivel.
- 🌑 **Gran Eclipse Solar Total de 2026 y 2027 en España** (franjas exactas de totalidad, horarios y filtros certificados ISO 12312-2).
- 🏛️ **Zonas Certificadas Starlight** (Zaragoza, Galicia, Teruel, Castellón, Canarias, Serranía de Cuenca, Sierra Morena).
- 📸 **Astrofotografía de la Vía Láctea y cielo profundo** (parámetros de cámara, regla NPF, enfoque y apilado).
- 🌌 **Calidad de cielo y Escala Bortle** para elegir el mejor punto sin contaminación lumínica.

¿Qué te gustaría preparar o consultar hoy?`;
}
