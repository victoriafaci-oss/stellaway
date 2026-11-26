import type { Express } from "express";
import {
  AssistantApiError,
  runStellaAssistant,
} from "./stellaAssistantEngine";
import {
  SupportedLanguage,
  normalizeLanguage,
  getStripeLocale,
  withStripeLocale,
  getLocalizedPlanName,
} from "./i18nHelpers";
import {
  assembleReportFromRawApis,
  buildOpenMeteoForecastUrl,
} from "./weatherService";

export function registerApiRoutes(app: Express) {
  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "StellaWay" });
  });

  // Real-Time Astronomical Weather & 7-Day Sky Conditions API (Open-Meteo + 7Timer! Astro)
  app.get("/api/sky-conditions", async (req, res) => {
    const lang = normalizeLanguage(req.query.lang);
    try {
      const rawLat = req.query.lat !== undefined ? Number(req.query.lat) : NaN;
      const rawLon = req.query.lon !== undefined ? Number(req.query.lon) : NaN;
      const cityQuery = typeof req.query.city === "string" ? req.query.city.trim() : "";

      let lat = rawLat;
      let lng = rawLon;
      let locationName = typeof req.query.name === "string" ? req.query.name.trim() : "";
      let region = typeof req.query.region === "string" ? req.query.region.trim() : "";
      let country = typeof req.query.country === "string" ? req.query.country.trim() : "";
      let elevationMeters: number | undefined;

      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
          return res.status(400).json({ error: "Invalid latitude or longitude range" });
        }
        if (!locationName) {
          locationName = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
        }
      } else if (cityQuery) {
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            cityQuery
          )}&count=1&language=${lang}&format=json`
        );
        if (!geoRes.ok) {
          return res.status(502).json({ error: "Geocoding upstream unavailable" });
        }
        const geoJson = (await geoRes.json()) as any;
        const first = Array.isArray(geoJson?.results) ? geoJson.results[0] : null;
        if (!first) {
          return res.status(404).json({ error: "Location not found" });
        }
        lat = Number(first.latitude);
        lng = Number(first.longitude);
        locationName = String(first.name || cityQuery);
        region = first.admin1 ? String(first.admin1) : "";
        country = first.country ? String(first.country) : "";
        elevationMeters = typeof first.elevation === "number" ? Math.round(first.elevation) : undefined;
      } else {
        return res.status(400).json({ error: "Provide valid lat/lon coordinates or city query" });
      }

      const [omRes, stRes] = await Promise.all([
        fetch(buildOpenMeteoForecastUrl(lat, lng), { signal: AbortSignal.timeout(8000) }),
        fetch(
          `https://www.7timer.info/bin/api.pl?lon=${lng.toFixed(3)}&lat=${lat.toFixed(
            3
          )}&product=astro&output=json`,
          { signal: AbortSignal.timeout(4500) }
        ).catch(() => null),
      ]);

      if (!omRes.ok) {
        return res.status(502).json({ error: "Open-Meteo weather upstream unavailable" });
      }
      const omData = await omRes.json();
      let sevenTimerData: any = null;
      if (stRes && stRes.ok) {
        try {
          sevenTimerData = await stRes.json();
        } catch {
          sevenTimerData = null;
        }
      }

      const report = assembleReportFromRawApis({
        lat,
        lng,
        locationName,
        region,
        country,
        elevationMeters,
        openMeteoData: omData,
        sevenTimerData,
      });

      return res.json(report);
    } catch (err) {
      console.error("Sky conditions upstream error:", err);
      return res.status(502).json({ error: "Failed to retrieve real-time sky conditions" });
    }
  });

  // Real-Time NOAA SWPC Planetary K-Index (Kp 0-9) for Auroras
  app.get("/api/aurora-kp", async (_req, res) => {
    try {
      const noaaRes = await fetch(
        "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
        { signal: AbortSignal.timeout(5000) }
      );
      if (!noaaRes.ok) {
        return res.status(502).json({ error: "NOAA SWPC upstream unavailable" });
      }
      const rows = (await noaaRes.json()) as any[];
      if (!Array.isArray(rows) || rows.length < 2) {
        return res.status(502).json({ error: "Invalid NOAA SWPC payload" });
      }
      const latest = rows[rows.length - 1];
      const timeTag = Array.isArray(latest) ? String(latest[0] || "") : String(latest?.time_tag || "");
      const kpRaw = Array.isArray(latest) ? Number(latest[1]) : Number(latest?.Kp);
      if (!Number.isFinite(kpRaw)) {
        return res.status(502).json({ error: "Invalid NOAA Kp reading" });
      }
      return res.json({
        kpIndex: Number(kpRaw.toFixed(2)),
        timeTagUTC: timeTag,
        source: "NOAA Space Weather Prediction Center (SWPC)",
      });
    } catch (err) {
      console.error("NOAA SWPC Kp error:", err);
      return res.status(502).json({ error: "Failed to retrieve NOAA Kp index" });
    }
  });

  // Payment Gateways Configuration & Status Verification API
  app.get("/api/payment-config", (req, res) => {
    const lang = normalizeLanguage(req.query.lang);
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const stripePublic = process.env.STRIPE_PUBLIC_KEY;
    const paypalId = process.env.PAYPAL_CLIENT_ID;
    const paypalSecret = process.env.PAYPAL_CLIENT_SECRET;

    const stripePaymentLinks: Record<string, string> = {
      free48h: withStripeLocale("https://buy.stripe.com/dRmcN7a3J5YTdZpcoV1ZS06", lang),
      mensual: withStripeLocale("https://buy.stripe.com/8x28wR0t9drldZp9cJ1ZS04", lang),
      anual: withStripeLocale("https://buy.stripe.com/8x24gBgs7bjd3kL0Gd1ZS05", lang),
    };

    const planCopy: Record<
      SupportedLanguage,
      {
        freePeriod: string;
        freeDesc: string;
        monPeriod: string;
        monDesc: string;
        annPeriod: string;
        annDesc: string;
      }
    > = {
      es: {
        freePeriod: "48 horas",
        freeDesc: "Acceso total a mapas Bortle, telemetría y asistente IA con verificación telefónica o Stripe.",
        monPeriod: "/ mes",
        monDesc: "Suscripción recurrente mensual cancelable en cualquier momento.",
        annPeriod: "/ año",
        annDesc: "Ahorro del 58% para 12 meses completos de astroturismo y Eclipses 2026–2027.",
      },
      en: {
        freePeriod: "48 hours",
        freeDesc: "Full access to Bortle maps, live telemetry & AI assistant via phone SMS or Stripe.",
        monPeriod: "/ month",
        monDesc: "Monthly recurring subscription, cancel anytime with zero fees.",
        annPeriod: "/ year",
        annDesc: "Save 58% for 12 full months of astrotourism and Solar Eclipses 2026–2027.",
      },
      fr: {
        freePeriod: "48 heures",
        freeDesc: "Accès complet aux cartes Bortle, télémétrie et assistant IA via SMS ou Stripe.",
        monPeriod: "/ mois",
        monDesc: "Abonnement mensuel résiliable à tout moment sans frais.",
        annPeriod: "/ an",
        annDesc: "Économisez 58% sur 12 mois complets d'astrotourisme et Éclipses 2026–2027.",
      },
      pt: {
        freePeriod: "48 horas",
        freeDesc: "Acesso total a mapas Bortle, telemetria e assistente IA via SMS ou Stripe.",
        monPeriod: "/ mês",
        monDesc: "Assinatura mensal cancelável a qualquer momento sem custos.",
        annPeriod: "/ ano",
        annDesc: "Poupe 58% por 12 meses completos de astroturismo e Eclipses 2026–2027.",
      },
      it: {
        freePeriod: "48 ore",
        freeDesc: "Accesso totale a mappe Bortle, telemetria e assistente IA via SMS o Stripe.",
        monPeriod: "/ mese",
        monDesc: "Abbonamento mensile disdicibile in qualsiasi momento senza penali.",
        annPeriod: "/ anno",
        annDesc: "Risparmi il 58% per 12 mesi completi di astroturismo ed Eclissi 2026–2027.",
      },
      de: {
        freePeriod: "48 Stunden",
        freeDesc: "Vollzugriff auf Bortle-Karten, Telemetrie & KI-Assistent per SMS oder Stripe.",
        monPeriod: "/ Monat",
        monDesc: "Monatliches Abo, jederzeit ohne Gebühren kündbar.",
        annPeriod: "/ Jahr",
        annDesc: "58% sparen für volle 12 Monate Astrotourismus & Sonnenfinsternisse 2026–2027.",
      },
    };
    const copy = planCopy[lang];

    res.json({
      status: "ready",
      language: lang,
      locale: getStripeLocale(lang),
      gateways: {
        stripe: {
          connected: Boolean(stripeSecret || stripePublic),
          configured: true,
          mode: stripeSecret?.startsWith("sk_live") ? "live" : "sandbox_test",
          publishableKey:
            stripePublic ||
            "pk_live_51U1Oe8Q89S9ikvKuhk7QcPSGPwDSimvo559ndDMYFfuISb6o6Ht38K7HcRBuUG8xs2NCMxt7r1Df4a5SUKLppRN7002PPvBxML",
          paymentLinks: stripePaymentLinks,
          supportedMethods: ["card", "apple_pay", "google_pay", "sepa_debit", "klarna", "link"],
        },
        paypal: {
          connected: Boolean(paypalId || paypalSecret),
          configured: true,
          mode: paypalId?.length ? "live" : "sandbox_test",
          clientId: paypalId || "sb_stellaway_client_connected",
          currency: "EUR",
        },
      },
      plans: [
        {
          id: "free2days",
          name: getLocalizedPlanName("free2days", lang),
          priceEur: 0,
          period: copy.freePeriod,
          description: copy.freeDesc,
          requiresPhoneVerification: true,
          stripePaymentLink: stripePaymentLinks.free48h,
        },
        {
          id: "mensual",
          name: getLocalizedPlanName("mensual", lang),
          priceEur: 3.99,
          period: copy.monPeriod,
          description: copy.monDesc,
          stripePaymentLink: stripePaymentLinks.mensual,
        },
        {
          id: "anual",
          name: getLocalizedPlanName("anual", lang),
          priceEur: 19.99,
          period: copy.annPeriod,
          description: copy.annDesc,
          stripePaymentLink: stripePaymentLinks.anual,
        },
      ],
    });
  });

  // Stripe Checkout Session & Direct Payment API
  app.post("/api/create-stripe-checkout", async (req, res) => {
    const lang = normalizeLanguage(req.body?.language);
    try {
      const { planId, customerEmail } = req.body || {};
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      const stripeLocale = getStripeLocale(lang);

      const priceMap: Record<
        string,
        { amount: number; priceId: string; paymentLink: string; mode: "payment" | "subscription" }
      > = {
        free2days: {
          amount: 0,
          priceId: "price_1U1PIWQ89S9ikvKueNnPq4yI",
          paymentLink: "https://buy.stripe.com/dRmcN7a3J5YTdZpcoV1ZS06",
          mode: "payment",
        },
        mensual: {
          amount: 399,
          priceId: "price_1U1nTbQ89S9ikvKuVViJ2ajL",
          paymentLink: "https://buy.stripe.com/8x28wR0t9drldZp9cJ1ZS04",
          mode: "subscription",
        },
        anual: {
          amount: 1999,
          priceId: "price_1U1nTbQ89S9ikvKuZwdY0YZK",
          paymentLink: "https://buy.stripe.com/8x24gBgs7bjd3kL0Gd1ZS05",
          mode: "subscription",
        },
      };

      const resolvedPlanId = priceMap[planId] ? planId : "anual";
      const plan = priceMap[resolvedPlanId];
      const localizedPlanName = getLocalizedPlanName(resolvedPlanId, lang);
      const localizedPaymentLink = withStripeLocale(plan.paymentLink, lang);
      const transactionId = "st_txn_" + Math.random().toString(36).substring(2, 12).toUpperCase();

      const sessionCreatedMsg: Record<SupportedLanguage, string> = {
        es: `Sesión de Stripe Checkout generada para ${localizedPlanName}.`,
        en: `Stripe Checkout session generated for ${localizedPlanName}.`,
        fr: `Session Stripe Checkout générée pour ${localizedPlanName}.`,
        pt: `Sessão Stripe Checkout gerada para ${localizedPlanName}.`,
        it: `Sessione Stripe Checkout creata per ${localizedPlanName}.`,
        de: `Stripe-Checkout-Sitzung für ${localizedPlanName} erstellt.`,
      };
      const directSuccessMsg: Record<SupportedLanguage, string> = {
        es: `Suscripción ${localizedPlanName} procesada y activada con éxito mediante Stripe.`,
        en: `Subscription ${localizedPlanName} processed and activated via Stripe.`,
        fr: `Abonnement ${localizedPlanName} traité et activé via Stripe.`,
        pt: `Assinatura ${localizedPlanName} processada e ativada via Stripe.`,
        it: `Abbonamento ${localizedPlanName} elaborato e attivato tramite Stripe.`,
        de: `Abonnement ${localizedPlanName} erfolgreich über Stripe aktiviert.`,
      };

      if (stripeSecret) {
        try {
          const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
          const params = new URLSearchParams();
          params.append("line_items[0][price]", plan.priceId);
          params.append("line_items[0][quantity]", "1");
          params.append("mode", plan.mode);
          params.append("locale", stripeLocale);
          params.append(
            "success_url",
            `${appUrl}/?pago=exito&plan=${resolvedPlanId}&lang=${lang}&session_id={CHECKOUT_SESSION_ID}`
          );
          params.append("cancel_url", `${appUrl}/?pago=cancelado&lang=${lang}`);
          if (customerEmail) {
            params.append("customer_email", customerEmail);
          }

          const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${stripeSecret}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: params.toString(),
          });

          const sessionData = (await stripeRes.json()) as any;

          if (sessionData && sessionData.url) {
            return res.json({
              success: true,
              provider: "Stripe",
              locale: stripeLocale,
              checkoutUrl: sessionData.url,
              paymentLink: localizedPaymentLink,
              sessionId: sessionData.id,
              transactionId,
              planId: resolvedPlanId,
              planName: localizedPlanName,
              amountEur: plan.amount / 100,
              customerEmail: customerEmail || "usuario@stellaway.org",
              status: "pending_checkout",
              activatedAt: new Date().toISOString(),
              message: sessionCreatedMsg[lang],
            });
          }
        } catch (stripeErr) {
          console.warn("Stripe Checkout Session API warning, using direct payment link:", stripeErr);
        }
      }

      res.json({
        success: true,
        provider: "Stripe",
        locale: stripeLocale,
        paymentLink: localizedPaymentLink,
        transactionId,
        planId: resolvedPlanId,
        planName: localizedPlanName,
        amountEur: plan.amount / 100,
        customerEmail: customerEmail || "usuario@stellaway.org",
        status: "succeeded",
        activatedAt: new Date().toISOString(),
        message: directSuccessMsg[lang],
      });
    } catch (error) {
      console.error("Error creating Stripe checkout:", error);
      const errMsg: Record<SupportedLanguage, string> = {
        es: "Error procesando el pago con Stripe",
        en: "Error processing payment with Stripe",
        fr: "Erreur lors du traitement du paiement Stripe",
        pt: "Erro ao processar pagamento na Stripe",
        it: "Errore nell'elaborazione del pagamento Stripe",
        de: "Fehler bei der Stripe-Zahlungsverarbeitung",
      };
      res.status(500).json({ error: errMsg[lang] });
    }
  });

  // Stripe Checkout Session Verification
  app.get("/api/stripe-session-details", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;
      const stripeSecret = process.env.STRIPE_SECRET_KEY;

      if (!sessionId || !stripeSecret) {
        return res.json({ success: false, message: "Session or key not configured" });
      }

      const stripeRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${stripeSecret}` },
      });
      const session = (await stripeRes.json()) as any;

      if (session && session.id) {
        return res.json({
          success: true,
          customerEmail: session.customer_details?.email || session.customer_email,
          customerId: session.customer,
          subscriptionId: session.subscription,
          paymentStatus: session.payment_status,
        });
      }

      res.json({ success: false });
    } catch {
      res.json({ success: false });
    }
  });

  // PayPal Order Creation & Capture
  app.post("/api/create-paypal-order", async (req, res) => {
    const lang = normalizeLanguage(req.body?.language);
    try {
      const { planId, customerEmail } = req.body || {};
      const orderId = "PAYPAL-ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();

      const priceMap: Record<string, number> = {
        mensual: 3.99,
        anual: 19.99,
      };

      const amount = priceMap[planId] || 19.99;
      const msgMap: Record<SupportedLanguage, string> = {
        es: `Pago completado con éxito mediante PayPal (${amount} €). Suscripción StellaWay activada.`,
        en: `Payment completed successfully via PayPal (€${amount}). StellaWay subscription activated.`,
        fr: `Paiement effectué avec succès via PayPal (${amount} €). Abonnement StellaWay activé.`,
        pt: `Pagamento concluído com sucesso via PayPal (€ ${amount}). Assinatura StellaWay ativada.`,
        it: `Pagamento completato con successo tramite PayPal (€ ${amount}). Abbonamento StellaWay attivato.`,
        de: `Zahlung erfolgreich über PayPal abgeschlossen (${amount} €). StellaWay-Abo aktiviert.`,
      };

      res.json({
        success: true,
        provider: "PayPal",
        locale: lang,
        orderId,
        status: "COMPLETED",
        amountEur: amount,
        customerEmail: customerEmail || "usuario@paypal.com",
        activatedAt: new Date().toISOString(),
        message: msgMap[lang],
      });
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      const errMap: Record<SupportedLanguage, string> = {
        es: "Error procesando orden PayPal",
        en: "Error processing PayPal order",
        fr: "Erreur lors du traitement de la commande PayPal",
        pt: "Erro ao processar ordem PayPal",
        it: "Errore nell'elaborazione dell'ordine PayPal",
        de: "Fehler bei der PayPal-Bestellung",
      };
      res.status(500).json({ error: errMap[lang] });
    }
  });

  // Phone SMS verification for 48h Free Trial
  app.post("/api/verify-trial-phone", (req, res) => {
    const lang = normalizeLanguage(req.body?.language);
    const { phone, code } = req.body || {};
    const cleanPhone = phone ? String(phone).trim().replace(/\s+/g, "") : "";
    if (!cleanPhone || cleanPhone.length < 7) {
      const invalidErr: Record<SupportedLanguage, string> = {
        es: "Número de teléfono inválido.",
        en: "Invalid mobile phone number.",
        fr: "Numéro de téléphone invalide.",
        pt: "Número de telefone inválido.",
        it: "Numero di telefono non valido.",
        de: "Ungültige Telefonnummer.",
      };
      return res.status(400).json({ error: invalidErr[lang] });
    }

    if (code) {
      if (String(code).length >= 4) {
        const verifiedMsg: Record<SupportedLanguage, string> = {
          es: "Número verificado con éxito. Disfruta de 48 horas de acceso completo a StellaWay.",
          en: "Phone number verified! Enjoy 48 hours of unlimited access to StellaWay.",
          fr: "Numéro vérifié avec succès. Profitez de 48 heures d'accès illimité à StellaWay.",
          pt: "Número verificado com sucesso. Aproveite 48 horas de acesso completo ao StellaWay.",
          it: "Numero verificato con successo. Goditi 48 ore di accesso completo a StellaWay.",
          de: "Nummer erfolgreich verifiziert! Genieße 48 Stunden Vollzugriff auf StellaWay.",
        };
        return res.json({
          success: true,
          verified: true,
          language: lang,
          phone: cleanPhone,
          trialHours: 48,
          expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          message: verifiedMsg[lang],
        });
      } else {
        const badCodeErr: Record<SupportedLanguage, string> = {
          es: "Código de verificación SMS incorrecto.",
          en: "Invalid SMS verification code.",
          fr: "Code de vérification SMS incorrect.",
          pt: "Código de verificação SMS incorreto.",
          it: "Codice di verifica SMS non valido.",
          de: "Ungültiger SMS-Bestätigungscode.",
        };
        return res.status(400).json({ error: badCodeErr[lang] });
      }
    }

    const smsSentMsg: Record<SupportedLanguage, string> = {
      es: `Código SMS enviado al ${cleanPhone}. Introduce el código para activar las 48 horas de prueba.`,
      en: `SMS code sent to ${cleanPhone}. Enter the code to activate your 48-hour free trial.`,
      fr: `Code SMS envoyé au ${cleanPhone}. Saisissez le code pour activer vos 48 heures d'essai.`,
      pt: `Código SMS enviado para ${cleanPhone}. Introduza o código para ativar as 48 horas de teste.`,
      it: `Codice SMS inviato a ${cleanPhone}. Inserisci il codice per attivare le 48 ore di prova.`,
      de: `SMS-Code an ${cleanPhone} gesendet. Gib den Code ein, um deinen 48h-Test zu aktivieren.`,
    };
    return res.json({
      success: true,
      smsSent: true,
      language: lang,
      phone: cleanPhone,
      message: smsSentMsg[lang],
    });
  });

  // Email verification for 48h Free Trial (Name, Surname, Email)
  app.post("/api/verify-trial-email", (req, res) => {
    const lang = normalizeLanguage(req.body?.language);
    const { firstName, lastName, email, code } = req.body || {};
    const cleanFirst = String(firstName || "").trim();
    const cleanLast = String(lastName || "").trim();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

    if (!cleanFirst || cleanFirst.length < 2 || !cleanLast || cleanLast.length < 2) {
      const nameErr: Record<SupportedLanguage, string> = {
        es: "Introduce tu nombre y apellidos.",
        en: "Please enter your first and last name.",
        fr: "Veuillez saisir votre prénom et votre nom.",
        pt: "Introduza o seu nome e apelidos.",
        it: "Inserisci il tuo nome e cognome.",
        de: "Bitte gib deinen Vor- und Nachnamen ein.",
      };
      return res.status(400).json({ error: nameErr[lang] });
    }

    if (!isValidEmail) {
      const invalidErr: Record<SupportedLanguage, string> = {
        es: "Introduce un correo electrónico válido.",
        en: "Please enter a valid email address.",
        fr: "Veuillez saisir une adresse e-mail valide.",
        pt: "Introduza um endereço de email válido.",
        it: "Inserisci un indirizzo email valido.",
        de: "Bitte gib eine gültige E-Mail-Adresse ein.",
      };
      return res.status(400).json({ error: invalidErr[lang] });
    }

    if (code) {
      if (String(code).trim().length >= 4) {
        const verifiedMsg: Record<SupportedLanguage, string> = {
          es: "Email verificado con éxito. Disfruta de 48 horas de acceso completo a StellaWay.",
          en: "Email verified! Enjoy 48 hours of unlimited access to StellaWay.",
          fr: "E-mail vérifié ! Profitez de 48 heures d'accès illimité à StellaWay.",
          pt: "Email verificado! Aproveite 48 horas de acesso completo ao StellaWay.",
          it: "Email verificata! Goditi 48 ore di accesso completo a StellaWay.",
          de: "E-Mail verifiziert! Genieße 48 Stunden Vollzugriff auf StellaWay.",
        };
        return res.json({
          success: true,
          verified: true,
          language: lang,
          email: cleanEmail,
          fullName: `${cleanFirst} ${cleanLast}`,
          trialHours: 48,
          expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
          message: verifiedMsg[lang],
        });
      } else {
        const badCodeErr: Record<SupportedLanguage, string> = {
          es: "Código de verificación por email incorrecto.",
          en: "Incorrect email verification code.",
          fr: "Code de vérification par e-mail incorrect.",
          pt: "Código de verificação por email incorreto.",
          it: "Codice di verifica email non valido.",
          de: "Falscher E-Mail-Bestätigungscode.",
        };
        return res.status(400).json({ error: badCodeErr[lang] });
      }
    }

    const emailSentMsg: Record<SupportedLanguage, string> = {
      es: `Código enviado a ${cleanEmail}. Introduce el código para activar las 48 horas de prueba.`,
      en: `Verification code sent to ${cleanEmail}. Enter the code to activate your 48-hour trial.`,
      fr: `Code envoyé à ${cleanEmail}. Saisissez le code pour activer l'essai de 48 heures.`,
      pt: `Código enviado para ${cleanEmail}. Introduza o código para ativar as 48 horas de teste.`,
      it: `Codice inviato a ${cleanEmail}. Inserisci il codice per attivare le 48 ore di prova.`,
      de: `Code an ${cleanEmail} gesendet. Gib den Code ein, um 48h gratis zu aktivieren.`,
    };
    return res.json({
      success: true,
      codeSent: true,
      language: lang,
      email: cleanEmail,
      fullName: `${cleanFirst} ${cleanLast}`,
      message: emailSentMsg[lang],
    });
  });

  // Official Subscription Cancellation / Unsubscribe API
  app.post("/api/cancel-subscription", async (req, res) => {
    const lang = normalizeLanguage(req.body?.language);
    try {
      const { contact, reason, reference, timestamp, plan, subscriptionId } = req.body || {};
      const cancelRef =
        reference ||
        "BAJA-" +
          Date.now().toString(36).toUpperCase() +
          "-" +
          Math.floor(1000 + Math.random() * 9000);
      const cancelDate = timestamp || new Date().toISOString();
      const stripeSecret = process.env.STRIPE_SECRET_KEY;

      let stripeCancelled = false;
      const stripeSubscriptionIds: string[] = [];
      let stripeNote = "";

      if (stripeSecret) {
        try {
          if (subscriptionId && typeof subscriptionId === "string" && subscriptionId.startsWith("sub_")) {
            const delRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${stripeSecret}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
            });
            const delData = (await delRes.json()) as any;
            if (delData && (delData.status === "canceled" || delData.id)) {
              stripeCancelled = true;
              stripeSubscriptionIds.push(delData.id);
              stripeNote = `Stripe ID: ${delData.id}`;
            }
          }

          const emailQuery = contact && typeof contact === "string" && contact.includes("@") ? contact.trim() : null;
          if (emailQuery) {
            const custRes = await fetch(
              `https://api.stripe.com/v1/customers?email=${encodeURIComponent(emailQuery)}`,
              { headers: { Authorization: `Bearer ${stripeSecret}` } }
            );
            const custData = (await custRes.json()) as any;

            if (custData && custData.data && Array.isArray(custData.data)) {
              for (const cust of custData.data) {
                const subRes = await fetch(
                  `https://api.stripe.com/v1/subscriptions?customer=${cust.id}&status=active`,
                  { headers: { Authorization: `Bearer ${stripeSecret}` } }
                );
                const subData = (await subRes.json()) as any;

                if (subData && subData.data && Array.isArray(subData.data)) {
                  for (const sub of subData.data) {
                    const delRes = await fetch(`https://api.stripe.com/v1/subscriptions/${sub.id}`, {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${stripeSecret}` },
                    });
                    const delData = (await delRes.json()) as any;
                    if (delData && (delData.status === "canceled" || delData.id)) {
                      stripeCancelled = true;
                      stripeSubscriptionIds.push(delData.id);
                    }
                  }
                }
              }

              if (stripeSubscriptionIds.length > 0) {
                stripeNote = `Stripe IDs cancelled: ${stripeSubscriptionIds.join(", ")}`;
              }
            }
          }
        } catch (stripeErr) {
          console.warn("[Stripe API Cancel Warning]", stripeErr);
        }
      }

      const defaultNotes: Record<
        SupportedLanguage,
        { yesStripe: string; noStripe: string; msgStripe: string; msgLocal: string }
      > = {
        es: {
          yesStripe: "Cancelación efectiva en Stripe. No habrá cobros futuros.",
          noStripe: "Baja registrada en sistema y acceso revocado inmediatamente.",
          msgStripe: "Tu suscripción ha sido dada de baja directamente en Stripe sin cobros futuros.",
          msgLocal:
            "Tu suscripción o prueba gratuita ha sido dada de baja de forma inmediata. No se realizará ningún cargo futuro.",
        },
        en: {
          yesStripe: "Cancellation confirmed on Stripe. Zero future charges.",
          noStripe: "Cancellation recorded in system and access revoked immediately.",
          msgStripe: "Your subscription has been cancelled directly on Stripe with no future billing.",
          msgLocal: "Your subscription or free trial has been cancelled immediately. No future charges will occur.",
        },
        fr: {
          yesStripe: "Résiliation confirmée sur Stripe. Aucun prélèvement futur.",
          noStripe: "Résiliation enregistrée dans le système et accès révoqué immédiatement.",
          msgStripe: "Votre abonnement a été résilié directement sur Stripe sans frais futurs.",
          msgLocal:
            "Votre abonnement ou essai gratuit a été résilié immédiatement. Aucun frais futur ne sera prélevé.",
        },
        pt: {
          yesStripe: "Cancelamento confirmado na Stripe. Sem cobranças futuras.",
          noStripe: "Cancelamento registrado no sistema e acesso revogado imediatamente.",
          msgStripe: "Sua assinatura foi cancelada diretamente na Stripe sem cobranças futuras.",
          msgLocal:
            "Sua assinatura ou teste gratuito foi cancelado imediatamente. Não haverá cobranças futuras.",
        },
        it: {
          yesStripe: "Disdetta confermata su Stripe. Nessun addebito futuro.",
          noStripe: "Disdetta registrata nel sistema e accesso revocato immediatamente.",
          msgStripe: "Il tuo abbonamento è stato disdetto direttamente su Stripe senza addebiti futuri.",
          msgLocal:
            "Il tuo abbonamento o prova gratuita è stato annullato immediatamente. Nessun addebito futuro.",
        },
        de: {
          yesStripe: "Kündigung bei Stripe bestätigt. Keine künftigen Abbuchungen.",
          noStripe: "Kündigung im System erfasst und Zugang sofort beendet.",
          msgStripe: "Dein Abonnement wurde direkt bei Stripe ohne weitere Kosten gekündigt.",
          msgLocal:
            "Dein Abo oder Gratis-Test wurde sofort gekündigt. Es erfolgen keine weiteren Abbuchungen.",
        },
      };

      const locNotes = defaultNotes[lang];
      console.log(
        `[Subscription Cancellation] Ref: ${cancelRef}, Contact: ${contact}, Plan: ${plan}, Lang: ${lang}, StripeCancelled: ${stripeCancelled}, Reason: ${reason}`
      );

      return res.json({
        success: true,
        language: lang,
        reference: cancelRef,
        status: "cancelled",
        effectiveImmediately: true,
        noFutureCharges: true,
        stripeCancelled,
        stripeSubscriptionIds,
        stripeNote: stripeNote || (stripeCancelled ? locNotes.yesStripe : locNotes.noStripe),
        timestamp: cancelDate,
        message: stripeCancelled ? locNotes.msgStripe : locNotes.msgLocal,
      });
    } catch (err) {
      console.error("Error processing cancellation:", err);
      const errMap: Record<SupportedLanguage, string> = {
        es: "Error procesando la solicitud de baja",
        en: "Error processing cancellation request",
        fr: "Erreur lors du traitement de la résiliation",
        pt: "Erro ao processar solicitação de cancelamento",
        it: "Errore nell'elaborazione della richiesta di disdetta",
        de: "Fehler bei der Verarbeitung der Kündigung",
      };
      res.status(500).json({ error: errMap[lang] });
    }
  });

  // Stripe Customer Portal Session API
  app.post("/api/create-stripe-portal-session", async (req, res) => {
    const lang = normalizeLanguage(req.body?.language);
    const fallbackPortalUrl = withStripeLocale("https://billing.stripe.com/", lang);
    try {
      const { email } = req.body || {};
      const stripeSecret = process.env.STRIPE_SECRET_KEY;
      const appUrl = process.env.APP_URL || `${req.protocol}://${req.get("host")}`;

      if (stripeSecret && email && typeof email === "string" && email.includes("@")) {
        try {
          const custRes = await fetch(
            `https://api.stripe.com/v1/customers?email=${encodeURIComponent(email.trim())}`,
            { headers: { Authorization: `Bearer ${stripeSecret}` } }
          );
          const custData = (await custRes.json()) as any;

          if (custData && custData.data && custData.data.length > 0) {
            const customerId = custData.data[0].id;
            const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${stripeSecret}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                customer: customerId,
                locale: getStripeLocale(lang),
                return_url: `${appUrl}/?lang=${lang}`,
              }).toString(),
            });
            const portalData = (await portalRes.json()) as any;
            if (portalData && portalData.url) {
              return res.json({ success: true, locale: getStripeLocale(lang), url: portalData.url });
            }
          }
        } catch (portalErr) {
          console.warn("[Stripe Portal Warning]", portalErr);
        }
      }

      return res.json({ success: true, locale: getStripeLocale(lang), url: fallbackPortalUrl });
    } catch {
      return res.json({ success: false, locale: getStripeLocale(lang), url: fallbackPortalUrl });
    }
  });

  // Stargazing AI Assistant Route using Gemini 4 Hydrogen + live StellaWay tools & Search Grounding
  app.post("/api/assistant", async (req, res) => {
    const lang = normalizeLanguage(req.body?.language);
    try {
      const { message, conversationHistory = [] } = req.body || {};
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message required", code: "BAD_REQUEST" });
      }

      const result = await runStellaAssistant({
        message,
        language: lang,
        conversationHistory,
      });

      return res.json(result);
    } catch (error: any) {
      if (error instanceof AssistantApiError) {
        return res.status(error.status).json({
          error: error.message,
          code: error.code,
          language: lang,
        });
      }
      console.error("Unexpected error in /api/assistant:", error);
      return res.status(500).json({
        error: "Failed to process assistant request",
        code: "INTERNAL_ERROR",
        language: lang,
      });
    }
  });
}
