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
    const { phone, code } = body;

    if (!phone || String(phone).trim().length < 7) {
      const invalidErr: Record<SupportedLanguage, string> = {
        es: "Número de teléfono inválido (mínimo 7 dígitos).",
        en: "Invalid mobile phone number (min 7 digits).",
        fr: "Numéro de téléphone invalide (min. 7 chiffres).",
        pt: "Número de telefone inválido (mín. 7 dígitos).",
        it: "Numero di telefono non valido (min. 7 cifre).",
        de: "Ungültige Mobilnummer (mind. 7 Ziffern).",
      };
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: invalidErr[lang] }),
      };
    }

    const cleanPhone = String(phone).trim().replace(/\s+/g, "");

    if (code) {
      if (String(code).length >= 4) {
        const verifiedMsg: Record<SupportedLanguage, string> = {
          es: "Número verificado con éxito. Disfruta de 48 horas de acceso completo a StellaWay.",
          en: "Phone verified! Enjoy 48 hours of unlimited access to StellaWay.",
          fr: "Numéro vérifié ! Profitez de 48 heures d'accès illimité à StellaWay.",
          pt: "Número verificado! Aproveite 48 horas de acesso completo ao StellaWay.",
          it: "Numero verificato! Goditi 48 ore di accesso completo a StellaWay.",
          de: "Nummer verifiziert! Genieße 48 Stunden Vollzugriff auf StellaWay.",
        };
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            success: true,
            verified: true,
            language: lang,
            phone: cleanPhone,
            trialHours: 48,
            expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
            message: verifiedMsg[lang],
          }),
        };
      } else {
        const badCodeErr: Record<SupportedLanguage, string> = {
          es: "Código de verificación SMS incorrecto.",
          en: "Incorrect SMS verification code.",
          fr: "Code de vérification SMS incorrect.",
          pt: "Código de verificação SMS incorreto.",
          it: "Codice di verifica SMS non valido.",
          de: "Falscher SMS-Bestätigungscode.",
        };
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: badCodeErr[lang] }),
        };
      }
    }

    const sentMsg: Record<SupportedLanguage, string> = {
      es: `Código SMS enviado al ${cleanPhone}. Introduce el código para activar las 48 horas de prueba.`,
      en: `SMS code sent to ${cleanPhone}. Enter the code to activate your 48-hour trial.`,
      fr: `Code SMS envoyé au ${cleanPhone}. Saisissez le code pour activer l'essai de 48 heures.`,
      pt: `Código SMS enviado para ${cleanPhone}. Introduza o código para ativar as 48 horas de teste.`,
      it: `Codice SMS inviato a ${cleanPhone}. Inserisci il codice per attivare le 48 ore di prova.`,
      de: `SMS-Code an ${cleanPhone} gesendet. Gib den Code ein, um 48h gratis zu aktivieren.`,
    };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        smsSent: true,
        language: lang,
        phone: cleanPhone,
        message: sentMsg[lang],
      }),
    };
  } catch (error) {
    console.error("Error verifying phone:", error);
    const errMap: Record<SupportedLanguage, string> = {
      es: "Error verificando el teléfono",
      en: "Error verifying phone number",
      fr: "Erreur lors de la vérification du téléphone",
      pt: "Erro ao verificar o telefone",
      it: "Errore nella verifica del telefono",
      de: "Fehler bei der Telefonprüfung",
    };
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: errMap[lang] }),
    };
  }
};
