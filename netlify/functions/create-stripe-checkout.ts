import type { Handler } from "@netlify/functions";
import { normalizeLanguage, getLocalizedPlanName, withStripeLocale, getStripeLocale, SupportedLanguage } from "../../src/lib/i18nHelpers";

export const handler: Handler = async (event, _context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  let lang: SupportedLanguage = "es";
  try {
    const body = JSON.parse(event.body || "{}");
    lang = normalizeLanguage(body?.language);
    const { planId, customerEmail } = body;

    const priceMap: Record<string, { amount: number; link: string }> = {
      free2days: { amount: 0, link: "https://buy.stripe.com/dRmcN7a3J5YTdZpcoV1ZS06" },
      mensual: { amount: 399, link: "https://buy.stripe.com/8x28wR0t9drldZp9cJ1ZS04" },
      anual: { amount: 1999, link: "https://buy.stripe.com/8x24gBgs7bjd3kL0Gd1ZS05" },
    };

    const resolvedId = priceMap[planId] ? planId : "anual";
    const plan = priceMap[resolvedId];
    const planName = getLocalizedPlanName(resolvedId, lang);
    const paymentLink = withStripeLocale(plan.link, lang);
    const transactionId = "st_txn_" + Math.random().toString(36).substring(2, 12).toUpperCase();

    const msgMap: Record<SupportedLanguage, string> = {
      es: `Suscripción ${planName} procesada y activada con éxito mediante Stripe.`,
      en: `Subscription ${planName} processed and activated via Stripe.`,
      fr: `Abonnement ${planName} traité et activé via Stripe.`,
      pt: `Assinatura ${planName} processada e ativada via Stripe.`,
      it: `Abbonamento ${planName} elaborato e attivato tramite Stripe.`,
      de: `Abonnement ${planName} erfolgreich über Stripe aktiviert.`,
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        provider: "Stripe",
        locale: getStripeLocale(lang),
        paymentLink,
        transactionId,
        planId: resolvedId,
        planName,
        amountEur: plan.amount / 100,
        customerEmail: customerEmail || "usuario@stellaway.org",
        status: "succeeded",
        activatedAt: new Date().toISOString(),
        message: msgMap[lang],
      }),
    };
  } catch (error) {
    console.error("Error creating Stripe checkout:", error);
    const errMap: Record<SupportedLanguage, string> = {
      es: "Error procesando el pago con Stripe",
      en: "Error processing payment with Stripe",
      fr: "Erreur lors du traitement du paiement Stripe",
      pt: "Erro ao processar pagamento na Stripe",
      it: "Errore nell'elaborazione del pagamento Stripe",
      de: "Fehler bei der Stripe-Zahlungsverarbeitung",
    };
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: errMap[lang] }),
    };
  }
};
