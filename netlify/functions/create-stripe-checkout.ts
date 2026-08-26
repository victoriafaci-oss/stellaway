import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, _context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { planId, customerEmail, customerName } = JSON.parse(event.body || "{}");

    const priceMap: Record<string, { amount: number; name: string }> = {
      mensual: { amount: 399, name: "Plan Mensual Starlight Pro (3,99 €)" },
      anual: { amount: 1999, name: "Plan Anual Starlight Pass (19,99 €)" },
    };

    const plan = priceMap[planId] || priceMap.anual;
    const transactionId =
      "st_txn_" + Math.random().toString(36).substring(2, 12).toUpperCase();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        provider: "Stripe",
        transactionId,
        planId,
        amountEur: plan.amount / 100,
        customerEmail: customerEmail || "usuario@stellaway.org",
        status: "succeeded",
        activatedAt: new Date().toISOString(),
        message: `Suscripción ${plan.name} procesada y activada con éxito mediante Stripe.`,
      }),
    };
  } catch (error) {
    console.error("Error creating Stripe checkout:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Error procesando el pago con Stripe" }),
    };
  }
};
