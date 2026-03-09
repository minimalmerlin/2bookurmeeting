# 2BookUrMeetings

**Die kostenlose, Open-Source-Alternative zu Calendly** – gebaut für Solo-Freelancer, Creator und alle, die ohne Abo-Fallstricke Termine buchen wollen.

---

## Was ist das?

2BookUrMeetings ist ein selbst hostbares Buchungs-Tool mit Google Calendar-Anbindung. Erstelle Termintypen, teile deinen Link – fertig. Keine versteckten Kosten, keine Datenweitergabe an Dritte.

**Live-Demo:** [2bookurmeetings.vercel.app](https://2bookurmeetings.vercel.app)

---

## Features

- **Unbegrenzte Termintypen** – Erstelle so viele Buchungsseiten wie du brauchst
- **Google Calendar-Integration** – Automatische Prüfung auf Doppelbuchungen, Google Meet-Link inklusive
- **Individuelle Qualifizierungsfragen** – Filtere Leads direkt beim Buchen (z.B. „Was ist dein Budget?")
- **14-Tage-Vorschau** – Besucher sehen deine nächsten verfügbaren Slots auf einen Blick
- **Öffentliche Buchungsseite** – Dein persönlicher Link: `yourapp.com/deinname/beratung`
- **Einbettbarer Widget** – Booking-Form direkt auf deiner eigenen Website
- **Webhook-Integration** – Automatisierungen mit n8n oder Zapier
- **Mobile-first Design** – Vollständig responsiv
- **DSGVO-konform** – Open Source, selbst hostbar, kein Tracking

---

## Tech Stack

| Bereich | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) |
| Sprache | TypeScript |
| Styling | Tailwind CSS |
| Auth | NextAuth.js v4 (Google OAuth) |
| Datenbank | PostgreSQL via Prisma ORM |
| Kalender | Google Calendar API v3 |
| Deployment | Vercel |

---

## Schnellstart

### Voraussetzungen

- Node.js 18+
- PostgreSQL-Datenbank (oder SQLite für lokale Entwicklung)
- Google Cloud Project mit aktivierter Calendar API

### Installation

```bash
# Repository klonen
git clone https://github.com/deinname/2bookurmeetings.git
cd 2bookurmeetings

# Abhängigkeiten installieren
npm install

# Prisma Client generieren
npx prisma generate
```

### Umgebungsvariablen

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
# Datenbank
DATABASE_URL="file:./dev.db"           # SQLite (lokal)
# DATABASE_URL="postgres://..."        # PostgreSQL (Produktion)

# NextAuth
NEXTAUTH_SECRET=""                     # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Google OAuth (Google Cloud Console)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Entwicklungsserver starten

```bash
npm run dev
# → http://localhost:3000
```

### Datenbank einrichten

```bash
# Migrationen erstellen (erstmalig)
npx prisma migrate dev --name initial

# Oder Schema direkt pushen
npx prisma db push
```

---

## Google OAuth einrichten

1. [Google Cloud Console](https://console.cloud.google.com) öffnen
2. Neues Projekt erstellen
3. **APIs & Dienste → APIs aktivieren → Google Calendar API** aktivieren
4. **APIs & Dienste → Anmeldedaten → OAuth 2.0-Client-IDs** erstellen
   - Anwendungstyp: Webanwendung
   - Autorisierte Weiterleitungs-URIs: `http://localhost:3000/api/auth/callback/google`
5. Client-ID und Client-Secret in `.env.local` eintragen

**Benötigte OAuth-Scopes:**
- `https://www.googleapis.com/auth/calendar`
- `openid`, `email`, `profile`

---

## Deployment auf Vercel

```bash
# Vercel CLI installieren
npm i -g vercel

# Deployen
vercel

# Produktions-Deployment
vercel --prod
```

**Umgebungsvariablen im Vercel Dashboard setzen:**
- `DATABASE_URL` – Vercel Postgres oder externe PostgreSQL-URL
- `NEXTAUTH_SECRET` – Zufälliger String (`openssl rand -base64 32`)
- `NEXTAUTH_URL` – Deine Produktions-URL (z.B. `https://2bookurmeetings.vercel.app`)
- `NEXT_PUBLIC_APP_URL` – Gleiche URL wie oben
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`

Für Vercel Postgres: In den Vercel Project Settings unter **Storage** eine Postgres-Datenbank verbinden – die `DATABASE_URL` wird automatisch als Umgebungsvariable gesetzt.

---

## Selbst hosten (DSGVO-konform)

Für vollständige Datenkontrolle auf eigenem Server (z.B. Hetzner in Deutschland):

```bash
# Build erstellen
npm run build

# Starten
npm start
```

Empfohlener Stack: **Ubuntu + Node.js + PostgreSQL + Caddy** als Reverse Proxy.

---

## Projektstruktur

```
├── app/
│   ├── [username]/[slug]/      # Öffentliche Buchungsseite
│   ├── dashboard/              # Geschützter Nutzerbereich
│   │   ├── page.tsx            # Übersicht Termintypen
│   │   ├── availability/       # Verfügbarkeit konfigurieren
│   │   └── settings/           # Einstellungen (Username, Webhook)
│   ├── api/
│   │   ├── auth/               # NextAuth Handler
│   │   ├── book/               # Buchung erstellen
│   │   ├── availability/       # Freie Slots abfragen
│   │   └── event-types/        # Termintypen verwalten
│   ├── impressum/
│   ├── datenschutz/
│   └── nutzungsbedingungen/
├── components/
│   ├── BookingForm.tsx          # Buchungsformular mit Slot-Picker
│   ├── EventTypeCard.tsx
│   ├── AvailabilityForm.tsx
│   └── SettingsForm.tsx
├── lib/
│   ├── auth.ts                  # NextAuth Konfiguration
│   ├── google.ts                # Google Calendar Client
│   └── prisma.ts                # Prisma Client
└── prisma/
    └── schema.prisma            # Datenbankschema
```

---

## Webhooks

Unter **Dashboard → Einstellungen** kannst du eine Webhook-URL hinterlegen. Bei jeder neuen Buchung wird ein `POST`-Request mit folgendem Body gesendet:

```json
{
  "event": "booking.created",
  "booking": {
    "id": "...",
    "attendeeName": "Max Mustermann",
    "attendeeEmail": "max@example.com",
    "startTime": "2026-03-15T10:00:00.000Z",
    "endTime": "2026-03-15T10:30:00.000Z",
    "meetLink": "https://meet.google.com/...",
    "customAnswers": []
  }
}
```

Kompatibel mit **n8n**, **Zapier**, **Make** und jedem anderen Webhook-Empfänger.

---

## Lizenz

MIT License – frei verwendbar, frei anpassbar, frei selbst hostbar.

---

## Kontakt

**Merlin Mechler** – [merlin@merlinmechler.de](mailto:merlin@merlinmechler.de)
