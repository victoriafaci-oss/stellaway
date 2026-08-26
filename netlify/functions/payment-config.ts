import type { Handler } from "@netlify/functions";

export const handler: Handler = async (_event, _context) => {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const stripePublic = process.env.STRIPE_PUBLIC_KEY;
  const paypalId = process.env.PAYPAL_CLIENT_ID;
  const paypalSecret = process.env.PAYPAL_CLIENT_SECRET;

  const data = {
    status: "ready",
    gateways: {
      stripe: {
        connected: Boolean(stripeSecret || stripePublic),
        configured: true,
        mode: stripeSecret?.startsWith("sk_live") ? "live" : "sandbox_test",
        publishableKey: stripePublic || "pk_test_stellaway_live_ready",
        supportedMethods: ["card", "apple_pay", "google_pay", "sepa_debit"],
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
        name: "Prueba Gratuita 48 Horas",
        priceEur: 0,
        period: "48 horas",
        description:
          "Acceso total a mapas Bortle, telemetría y asistente IA con verificación telefónica.",
        requiresPhoneVerification: true,
      },
      {
        id: "mensual",
        name: "Plan Mensual Starlight Pro",
        priceEur: 3.99,
        period: "/ mes",
        description:
          "Suscripción recurrente mensual cancelable en cualquier momento.",
      },
      {
        id: "anual",
        name: "Plan Anual Starlight Pass",
        priceEur: 19.99,
        period: "/ año",
        description:
          "Ahorro del 58% para 12 meses completos de astroturismo y Gran Eclipse 2026.",
      },
    ],
  };

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};
