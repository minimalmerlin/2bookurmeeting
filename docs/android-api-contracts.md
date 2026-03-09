## Android API Contracts – Kalenderbuchungs-Backend

Diese Datei beschreibt die HTTP-Contracts der bestehenden Next.js-API-Endpunkte aus Sicht der Android-App.

Alle Endpunkte sprechen JSON über HTTPS. Fehlerantworten sind aktuell überwiegend einfache Text-Responses mit HTTP-Statuscodes; für die Android-App sollten wir diese Statuscodes explizit auswerten und im UI differenziert behandeln.

---

### 1. `POST /api/book`

**Zweck**: Erstellt eine Booking im System und legt gleichzeitig einen Termin im Google Calendar des Hosts inkl. Meet-Link an.

**Authentication**: Keine Session/Token erforderlich (öffentlicher Buchungs-Endpunkt für Endkund:innen).

**Request Body (JSON)**:

```json
{
  "eventTypeId": "string",  // Prisma ID des EventType
  "name": "string",         // Name des Teilnehmenden
  "email": "string",        // E-Mail des Teilnehmenden
  "startTime": "ISO-8601"   // Startzeit der Buchung (z.B. "2025-01-15T09:30:00.000Z")
}
```

**Validierungen / Fehlerfälle**:

- `400 Bad Request` – wenn einer der Felder `eventTypeId`, `name`, `email`, `startTime` fehlt.
- `404 Not Found` – wenn der referenzierte `eventTypeId` nicht existiert.
- `500 Internal Server Error` – interne Fehler, z.B. beim Aufruf der Google Calendar API oder der DB.

**Response 200 (JSON)**:

Rohes Prisma-`Booking`-Objekt plus `meetLink`:

```json
{
  "id": "string",
  "eventTypeId": "string",
  "userId": "string",
  "attendeeName": "string",
  "attendeeEmail": "string",
  "startTime": "2025-01-15T09:30:00.000Z",
  "endTime": "2025-01-15T10:00:00.000Z",
  "googleEventId": "string",
  "meetLink": "https://meet.google.com/xyz-abcd-efg"  // oder null
}
```

---

### 2. `GET /api/availability`

**Zweck**: Liefert verfügbare Zeit-Slots für einen Host an einem bestimmten Tag, basierend auf Google Calendar Free/Busy und den Working Hours.

**Authentication**: Keine Session/Token erforderlich (öffentlich lesbar).

**Query Parameter**:

- `userId` – `string`, ID des Hosts (Prisma `User.id`).
- `date` – `string`, Datum im Format `YYYY-MM-DD` (z.B. `2025-01-15`).
- `duration` – `string` oder `number`, Dauer des gewünschten Slots in Minuten (z.B. `30`).

**Validierungen / Fehlerfälle**:

- `400 Bad Request` – wenn einer der Parameter fehlt (`Missing parameters`) oder `date` ungültig ist (`Invalid date`).
- `404 Not Found` – wenn der `user` nicht existiert.
- `500 Internal Server Error` – unerwartete Fehler, z.B. beim Google Free/Busy Call.

**Arbeitszeiten**:

- Falls `user.workingHours` gesetzt ist, wird dieses JSON verwendet.
- Andernfalls Default: Montag–Freitag 09:00–17:00.

**Response 200 (JSON)**:

Eine Liste von ISO-Zeitstempeln, jeweils Startzeiten der möglichen Slots:

```json
[
  "2025-01-15T09:00:00.000Z",
  "2025-01-15T09:30:00.000Z",
  "2025-01-15T10:00:00.000Z"
]
```

---

### 3. `POST /api/event-types`

**Zweck**: Legt einen neuen EventType für den eingeloggten User an.

**Authentication**: Erfordert gültige NextAuth-Session (Google OAuth).

**Request Body (JSON)**:

```json
{
  "title": "string",        // Pflicht
  "description": "string",  // optional
  "duration": 30,           // Minuten, wird serverseitig via parseInt(...) in Zahl umgewandelt
  "slug": "my-meeting"      // Pflicht, slug-unique pro User
}
```

**Validierungen / Fehlerfälle**:

- `401 Unauthorized` – wenn keine gültige Session vorhanden ist.
- `400 Bad Request` – wenn `title`, `duration` oder `slug` fehlen (`Missing required fields`).
- `400 Bad Request` – wenn für den User bereits ein EventType mit dem gleichen `slug` existiert (`Slug already exists for this user`).
- `500 Internal Server Error` – unerwartete Fehler.

**Response 200 (JSON)**:

Prisma-`EventType`-Objekt:

```json
{
  "id": "string",
  "title": "string",
  "description": "string | null",
  "duration": 30,
  "slug": "my-meeting",
  "userId": "string",
  "createdAt": "2025-01-10T10:00:00.000Z",
  "updatedAt": "2025-01-10T10:00:00.000Z"
}
```

---

### 4. `POST /api/settings/availability`

**Zweck**: Speichert die Working Hours (Verfügbarkeit) des eingeloggten Hosts.

**Authentication**: Erfordert gültige NextAuth-Session.

**Request Body (JSON)**:

```json
{
  "hours": [
    {
      "day": 1,         // number, 0 = Sonntag, 1 = Montag, ...
      "start": "09:00", // string "HH:MM"
      "end": "17:00"    // string "HH:MM"
    }
  ]
}
```

**Validierungen / Fehlerfälle**:

- `401 Unauthorized` – wenn keine gültige Session vorhanden ist.
- `400 Bad Request` – wenn `hours` kein Array ist (`Invalid payload`).
- `500 Internal Server Error` – unerwartete Fehler.

**Response 200 (JSON)**:

```json
{
  "success": true
}
```

Die tatsächliche Struktur der Einträge in `hours` wird nicht weiter validiert, d.h. die Android-App muss selbst sicherstellen, dass `day`, `start`, `end` konsistent sind.

---

### 5. `PATCH /api/settings`

**Zweck**: Setzt bzw. ändert den öffentlichen `username` eines Users (für die öffentliche URL und damit später auch Deep Links).

**Authentication**: Erfordert gültige NextAuth-Session.

**Request Body (JSON)**:

```json
{
  "username": "my-name-123"
}
```

**Validierungen / Fehlerfälle**:

- `401 Unauthorized` – wenn keine gültige Session vorhanden ist.
- `400 Bad Request` – wenn `username` fehlt (`Username missing`).
- `400 Bad Request` – wenn der Username nicht dem Regex `^[a-zA-Z0-9-]+$` entspricht (`Invalid username format. Only alphanumeric and dashes allowed.`).
- `400 Bad Request` – wenn der Username bereits von einem anderen User verwendet wird (`Username already taken`).
- `500 Internal Server Error` – unerwartete Fehler.

**Response 200 (JSON)**:

Aktualisiertes Prisma-`User`-Objekt (mindestens mit neuem `username`), z.B.:

```json
{
  "id": "string",
  "name": "string | null",
  "email": "string",
  "image": "string | null",
  "username": "my-name-123",
  "...": "weitere Felder je nach Schema"
}
```

---

### 6. Offene Punkte / Erweiterungsbedarf für Android

Für die Android-App fehlen aktuell noch offizielle, dokumentierte Endpunkte für:

- **Lesende Event-Type-Liste** (für Hosts und evtl. öffentliche Views): z.B. `GET /api/event-types` für den eingeloggten User.
- **Lesende Buchungsliste** für Hosts: z.B. `GET /api/bookings` mit Filtermöglichkeit.
- **Mobile Auth-Token oder Session-Übergabe**:
  - Entweder dedizierter Endpoint wie `POST /api/mobile/token` (gibt ein kurzlebiges Access Token zurück, wenn eine gültige NextAuth-Session existiert), oder
  - Eine klar definierte Cookie-/Session-Strategie, die Android (OkHttp) mit dem Browser/WebView-Login teilen kann.

Diese Endpunkte und Strategien werden im Rahmen der Mobile-spezifischen Backend-Erweiterungen ergänzt und hier dokumentiert, sobald sie implementiert sind.

