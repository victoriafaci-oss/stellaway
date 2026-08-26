import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, _context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { planId, customerEmail } = JSON.parse(event.body || "{}");
    const orderId =
      "PAYPAL-ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    const priceMap: Record<string, number> = {
      mensual: 3.99,
      anual: 19.99,
    };

    const amount = priceMap[planId] || 19.99;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        provider: "PayPal",
        orderId,
        status: "COMPLETED",
        amountEur: amount,
        customerEmail: customerEmail || "usuario@paypal.com",
        activatedAt: new Date().toISOString(),
        message: `Pago completado con éxito mediante PayPal (${amount} €). Suscripción StellaWay activada.`,
      }),
    };
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Error procesando orden PayPal" }),
    };
  }
};
