/**
 * Google Calendar API integration helpers.
 */

export interface CalendarEventPayload {
  summary: string;
  description: string;
  location?: string;
  startDateTime: string; // ISO 8601 string, e.g. "2026-08-12T21:00:00Z"
  endDateTime: string;   // ISO 8601 string, e.g. "2026-08-13T01:00:00Z"
  timeZone?: string;
}

/**
 * Creates an event in the user's primary Google Calendar.
 */
export async function createGoogleCalendarEvent(
  accessToken: string,
  eventData: CalendarEventPayload
): Promise<{ id: string; htmlLink: string }> {
  const timeZone = eventData.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

  const body = {
    summary: `✨ StellaWay: ${eventData.summary}`,
    description: `${eventData.description}\n\nOrganizado con StellaWay Explorer - Astroturismo España`,
    location: eventData.location || 'Observación Astronómica',
    start: {
      dateTime: eventData.startDateTime,
      timeZone: timeZone,
    },
    end: {
      dateTime: eventData.endDateTime,
      timeZone: timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 }, // 24 hours before
        { method: 'popup', minutes: 120 },  // 2 hours before
      ],
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Error al crear el evento en Google Calendar (${response.status})`
    );
  }

  const result = await response.json();
  return {
    id: result.id,
    htmlLink: result.htmlLink,
  };
}

/**
 * Removes an event from the user's primary Google Calendar.
 */
export async function deleteGoogleCalendarEvent(
  accessToken: string,
  eventId: string
): Promise<void> {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message ||
        `Error al eliminar evento de Google Calendar (${response.status})`
    );
  }
}
