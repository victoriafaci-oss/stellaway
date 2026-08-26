import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, _context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { phone, code } = JSON.parse(event.body || "{}");

    if (!phone || phone.trim().length < 9) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Número de teléfono inválido (mínimo 9 dígitos).",
        }),
      };
    }

    const cleanPhone = phone.trim().replace(/\s+/g, "");

    // Verificación de código SMS (mock)
    if (code) {
      if (code.length >= 4) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: true,
            verified: true,
            phone: cleanPhone,
            trialHours: 48,
            expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
            message:
              "Número verificado con éxito. Disfruta de 48 horas de acceso completo a StellaWay.",
          }),
        };
      } else {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: "Código de verificación SMS incorrecto.",
          }),
        };
      }
    }

    // Envío de código SMS (mock)
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        smsSent: true,
        phone: cleanPhone,
        message: `Código SMS enviado al ${cleanPhone}. Introduce el código para activar las 48 horas de prueba.`,
      }),
    };
  } catch (error) {
    console.error("Error verifying phone:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Error verificando el teléfono" }),
    };
  }
};
