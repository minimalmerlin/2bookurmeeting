## Offline- & Sync-Strategie – Android-App

Ziel: **Robuster, aber begrenzter Offline-Support**, bei dem der Server (Next.js + Prisma + Google Calendar) immer Source-of-Truth bleibt und die App
lokale Caches und eine Pending-Queue für Änderungen nutzt.

---

### 1. Scope des Offline-Supports

**Unterstützt (MVP)**:

- Lesen:
  - EventTypes (Host-seitig).
  - Eigene Buchungen (Host-seitig, sofern später implementierter Endpoint vorhanden ist).
  - WorkingHours (damit der Host seine aktuelle Konfiguration sehen kann).
- Schreiben:
  - Änderungen an WorkingHours (werden bei Offline in eine Pending-Queue geschrieben).
  - Erstellen neuer EventTypes (falls wir das in Offline erlauben wollen – Empfehlung: nur Online).

**Nicht unterstützt (MVP)**:

- Vollständige Offline-Buchung mit garantiertem Slot (für Endkund:innen), weil:
  - Verfügbarkeit stark von Google Calendar Free/Busy abhängt.
  - Konfliktfreie Reservierung ohne Live-Abgleich schwer zu garantieren ist.
- Offline-Änderung an Bookings (z.B. Storno/Umbuchung).

Damit bleiben die Gherkin-Szenarien konsistent, aber wir **schränken Offline-Schreiboperationen auf Host-spezifische, konfliktarme Settings ein** (v.a. WorkingHours).

---

### 2. Lokale Datenbank (Room) – Schema

#### 2.1 Tabellenübersicht

- `users`
- `event_types`
- `bookings`
- `working_hours`
- `pending_changes`

#### 2.2 Beispiel-Schemas (konzeptionell)

**`users`**

- `id: String` (Primary Key, entspricht Prisma `User.id`)
- `name: String?`
- `email: String`
- `username: String?`
- `updated_at: Long` (Unix-Timestamp, für Cache-Invalidierung)

**`event_types`**

- `id: String` (Primary Key, Prisma `EventType.id`)
- `user_id: String` (FK → `users.id`)
- `title: String`
- `description: String?`
- `duration_minutes: Int`
- `slug: String`
- `updated_at: Long`

**`bookings`**

- `id: String` (Primary Key, Prisma `Booking.id`)
- `event_type_id: String`
- `user_id: String`
- `attendee_name: String`
- `attendee_email: String`
- `start_time: Long` (UTC in ms)
- `end_time: Long`
- `google_event_id: String?`
- `meet_link: String?`
- `updated_at: Long`

**`working_hours`**

- `id: Long` (Primary Key)
- `user_id: String`
- `day: Int` (0=Sonntag … 6=Samstag, konsistent mit Backend)
- `start: String` (z.B. `"09:00"`)
- `end: String` (z.B. `"17:00"`)
- `updated_at: Long`

**`pending_changes`**

- `id: Long` (Primary Key, Autoincrement)
- `type: String` (z.B. `"UPDATE_WORKING_HOURS"`, `"CREATE_EVENT_TYPE"`, …)
- `payload: String` (JSON, der die nötigen Daten für den Request enthält)
- `created_at: Long`
- `retry_count: Int`
- `last_error: String?` (Fehlermeldung der letzten Sync-Iteration)

---

### 3. Change-Queue & Sync-Mechanismus

#### 3.1 Erzeugen von Pending Changes

- Bei jeder Operation, die offline erlaubt ist (z.B. Änderung von WorkingHours), passiert:
  - **Online-Fall**:
    - App versucht, den Remote-Endpoint direkt aufzurufen (`POST /api/settings/availability`).
    - Bei Erfolg: UI wird aktualisiert, lokale DB synchronisiert (`working_hours` aktualisiert).
    - Bei temporärem Fehler (Netzwerk/Timeout): optional **Fallback in Pending-Queue**.
  - **Offline-Fall**:
    - Request wird **nicht** direkt abgeschickt.
    - Stattdessen wird ein Eintrag in `pending_changes` angelegt:
      - `type = "UPDATE_WORKING_HOURS"`
      - `payload` enthält z.B. das JSON für den späteren Request `{ "hours": [...] }`.

#### 3.2 Sync-Prozess (WorkManager)

- Ein **periodischer WorkManager-Job** (z.B. alle 15 Minuten bei verfügbarem Netzwerk) und ein **manueller Trigger** (z.B. „Jetzt synchronisieren“-Button) rufen denselben UseCase auf:
  - `SyncPendingChanges() : Result<Unit>`.

**Algorithmus (vereinfacht)**:

1. Lade alle Einträge aus `pending_changes`, sortiert nach `created_at`.
2. Für jeden Eintrag:
   - Interpretiere `type` und `payload`.
   - Versuche, den entsprechenden HTTP-Request ans Backend zu senden.
   - Erfolg:
     - Entferne Eintrag aus `pending_changes`.
     - Aktualisiere betroffene lokale Tabellen (`working_hours`, `event_types`, …) mit Response-Daten.
   - Fehler:
     - Erhöhe `retry_count`, schreibe `last_error`.
     - Bei **definitiven** Fehlern (4xx, Validation Error) optional:
       - Markiere Change als „failed permanently“ oder entferne ihn mit UI-Hinweis.
3. Gib konsolidiertes `Result` zurück, damit UI/Logs sehen, ob Sync erfolgreich war.

#### 3.3 Konfliktregeln

- **Source-of-Truth**:
  - Server → Prisma → Google Calendar.
  - Lokale Daten sind nur Cache + Pending-Änderungen.
- **Last-Write-Wins** (vereinfachtes Modell):
  - Jede Server-Änderung überschreibt lokale Daten.
  - Lokale Pending-Changes werden beim Sync in Server-Änderungen übersetzt; bei Erfolg ist der Serverzustand wieder führend.
- **Fehlerfälle**:
  - Wenn ein Pending-Change aufgrund geänderter Serverdaten scheitert (z.B. Username inzwischen vergeben), erhält die App eine 400er-Antwort mit Message.
  - Dieser Pending-Change wird als Fehler markiert und im UI sichtbar gemacht (z.B. „Änderung nicht übernommen: Username bereits vergeben“).

---

### 4. Daten-Fetch-Strategien

#### 4.1 Lesen (EventTypes, WorkingHours, Bookings)

- **Strategie**: **Cache-first mit Hintergrund-Refresh**
  - Beim Öffnen eines Screens:
    - Zuerst lokale Daten aus Room laden (sofortige Anzeige).
    - Parallel einen Remote-Call starten:
      - Bei Erfolg: lokale DB aktualisieren → UI updaten.
      - Bei Fehler: UI zeigt optional Info („Offline – zeige ggf. veraltete Daten“).

#### 4.2 Schreiben (WorkingHours, perspektivisch EventTypes)

- **Strategie**: **Versuche Online, sonst Queue**
  - Versuche immer zuerst, den Remote-Endpoint zu treffen.
  - Fällt das Netzwerk aus oder reagiert der Server nicht:
    - Schreibe die Änderung in `pending_changes`.
    - Markiere im UI, dass die Änderung „ausstehend“ ist.

---

### 5. Edge Cases & Ausfallmuster

- **App wird deinstalliert**:
  - Lokale Pending-Changes gehen verloren → ist akzeptabel, da Server Source-of-Truth ist.
- **Gerät bleibt lange offline**:
  - Pending-Changes sammeln sich; bei Re-Connect kann es zu einer größeren Anzahl Requests kommen.
  - WorkManager-Konfiguration sollte Rate-Limits (Backoff-Strategie) beachten.
- **Backend-Schema ändert sich**:
  - Versionierung der `payload`-Struktur in `pending_changes` kann nötig werden; für MVP akzeptieren wir, dass App-Version und Backend-Version synchron entwickelt werden.

---

### 6. Abbildung auf Domain- & Data-Layer

- Domain-UseCases wie `LoadEventTypes`, `LoadBookings`, `UpdateWorkingHours` und `SyncPendingChanges` kapseln die oben beschriebene Logik.
- Repositories wissen:
  - Welche DAOs und Remote-Clients sie ansprechen.
  - Wann sie Pending-Changes erstellen oder entfernen.
- UI sieht nur:
  - Domain-Modelle (z.B. `WorkingHours`, `EventType`).
  - Statusflags (z.B. `isPendingSync` für bestimmte Einstellungen).

