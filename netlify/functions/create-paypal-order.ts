import type { Handler } from "@netlify/functions";
import { normalizeLanguage, SupportedLanguage } from "../../src/lib/i18nHelpers";

export const handler: Handler = async (event, _context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  let lang: SupportedLanguage = "es";
  try {
    const body = JSON.parse(event.body || "{}");
    lang = normalizeLanguage(body?.language);
    const { planId, customerEmail } = body;
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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        provider: "PayPal",
        locale: lang,
        orderId,
        status: "COMPLETED",
        amountEur: amount,
        customerEmail: customerEmail || "usuario@paypal.com",
        activatedAt: new Date().toISOString(),
        message: msgMap[lang],
      }),
    };
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
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: errMap[lang] }),
    };
  }
};
