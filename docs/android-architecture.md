## Android-App Architektur – Kalenderbuchungs-Tool

Ziel: Eine **klare, testbare und erweiterbare Architektur** für die Android-App, die das bestehende Next.js-Backend nutzt und Offline-Fähigkeit unterstützt – bei minimaler Komplexität (Least Power).

---

### 1. High-Level Modulstruktur

Wir planen zunächst **ein einziges Android-App-Modul** (`app`), das intern sauber in Schichten und Packages getrennt ist. Später kann bei Bedarf in Library-Module aufgeteilt werden.

**Module**:

- `:app`
  - Enthält:
    - UI (Jetpack Compose)
    - ViewModels
    - Domain-Layer (UseCases)
    - Data-Layer (Repositories, DTOs, API-Client, Room-DB)
    - DI-Setup (z.B. Hilt/Koin)

---

### 2. Package-Struktur im `app`-Modul

Vorschlag:

- `de.yourcompany.kalenderbuchung` (Root-Package)
  - `ui/`
    - `auth/` – Login/WebView-Flows
    - `booking/` – Öffentliche Buchungsscreens
    - `dashboard/` – Host-Dashboard (Übersicht EventTypes & Bookings)
    - `availability/` – Working-Hours-Editor
    - `settings/` – Profile/Settings (Username etc.)
    - `components/` – Shared UI-Bausteine (Buttons, Inputs, Snackbars,…)
    - `navigation/` – NavHost, Route-Definitionen
  - `domain/`
    - `model/` – Domänenmodelle (Kotlin-Datenklassen: `User`, `EventType`, `Booking`, `WorkingHours`, …)
    - `usecase/` – Anwendungsfälle (`LoadEventTypes`, `BookEvent`, `LoadAvailability`, `UpdateWorkingHours`, `UpdateSettings`, `LoadBookings`, …)
  - `data/`
    - `remote/` – API-Client, DTOs, Mapping (Next.js-Endpoints)
    - `local/` – Room-Entities, DAO-Interfaces, DB-Definition
    - `repository/` – Implementierungen der Domain-Repositories, die Remote + Local kombinieren
  - `sync/`
    - Komponenten für Background-Sync (WorkManager-Worker, Scheduler)
  - `di/`
    - DI-Module für Repositories, UseCases, HTTP-Client, Room-DB, etc.
  - `core/`
    - Gemeinsame Hilfsklassen, Result-Typen, Fehler-Objekte, Konfig (z.B. `AppConfig` für Base-URL).

---

### 3. Schichten & Verantwortlichkeiten

#### 3.1 UI-Layer (Jetpack Compose + ViewModels)

- **ViewModels pro Feature-Screen**:
  - `AuthViewModel`, `BookingViewModel`, `DashboardViewModel`, `AvailabilityViewModel`, `SettingsViewModel`.
  - Halten ausschließlich **UI-State** und orchestrieren UseCases.
- **State-Herkunft (Frontend Chain Guard)**:
  - UI-State ist eine **abgeleitete** Sicht auf:
    - Domain-Daten (z.B. EventTypes aus Repository).
    - UI-Ereignisse (z.B. „Buchen-Button geklickt“).
  - Kein „frei schwebender“ Zustand ohne Herkunft (kein globaler Singleton-UI-State).
- **Side-Effects**:
  - Netzwerk- und DB-Aufrufe laufen innerhalb von ViewModels über UseCases.
  - Jeder Effekt (z.B. „zeige Snackbar“) hat klaren Auslöser und wird mit Cleanup behandelt (z.B. Event-Channel, `SharedFlow`).

#### 3.2 Domain-Layer

- **Modelle**:
  - `User`, `EventType`, `Booking`, `WorkingHours`, `TimeSlot`, `PendingChange` (für Offline-Queue).
  - Domänenmodelle enthalten keine Framework- oder Persistenz-Details.
- **UseCases** (Beispiele):
  - `LoadEventTypes(userId) : Flow<List<EventType>>`
  - `LoadAvailability(userId, date, duration) : Flow<List<TimeSlot>>`
  - `BookEvent(eventTypeId, name, email, startTime) : Result<Booking>`
  - `UpdateWorkingHours(hours: List<WorkingHours>) : Result<Unit>`
  - `UpdateSettings(username: String) : Result<User>`
  - `LoadBookings() : Flow<List<Booking>>`
  - `SyncPendingChanges() : Result<Unit>` (für den Sync-Worker)
- **Fehlerbehandlung**:
  - UseCases geben typisierte Resultate zurück (`Success`, `NetworkError`, `ValidationError`, `ServerError`, …), keine nackten Exceptions.

#### 3.3 Data-Layer

- **Remote (HTTP)**:
  - HTTP-Client (z.B. OkHttp + Retrofit oder Ktor) spricht die in `docs/android-api-contracts.md` dokumentierten Endpoints an.
  - Pro Endpoint typisierte DTOs (Transport-Objekte), die in Domain-Modelle gemappt werden.
  - Zentrale Error-Mapping-Schicht: HTTP-Status → Domain-Error.

- **Local (Room)**:
  - `EventTypeEntity`, `BookingEntity`, `WorkingHoursEntity`, `UserEntity`, `PendingChangeEntity`.
  - DAOs pro Entität (`EventTypeDao`, `BookingDao`, `WorkingHoursDao`, `UserDao`, `PendingChangeDao`).
  - Lokale Daten sind **Cache** bzw. **Queue**, Server bleibt Source-of-Truth (siehe Offline-Dokument).

- **Repositories**:
  - `AuthRepository`: Login-Status, Logout, ggf. Token-Refresh-Trigger (über WebView/Session).
  - `EventTypeRepository`: Lädt EventTypes lokal/remote, speichert Cache.
  - `BookingRepository`: Erzeugt Buchungen (direkt remote) und liest Bookinglisten (lokal+remote).
  - `AvailabilityRepository`: Berechnet nur lesend verfügbare Slots (keine Persistenz nötig).
  - `SettingsRepository`: Liest/schreibt WorkingHours und Username.
  - Repositories kapseln die Geschäftsregeln für:
    - **Wann** auf Remote vs. Local zugegriffen wird.
    - **Wie** Offline-Caches und Pending-Änderungen gehandhabt werden.

---

### 4. Navigation & User-Flows

- **Startfluss**:
  - Beim App-Start prüft ein `Splash/StartupViewModel`, ob:
    - bereits ein gültiger Auth-Status vorliegt (z.B. Session-Cookies vorhanden).
    - Onboarding/Ersteinrichtung nötig ist.
  - Routing:
    - Nicht authentifiziert (Host/Admin): → Auth-Flow (WebView-Login).
    - Authentifiziert: → Dashboard.

- **Endkund:innen-Flows**:
  - Entweder:
    - Public-Booking-Flow in derselben App (ohne Auth, nur mit `username` + `slug`-Parameter), oder
    - nur für Hosts gedacht, die z.B. Buchungen im Namen anderer anlegen.
  - Für MVP ist der Fokus auf **Host/Admin-App**; der klassische Endkund:innen-Fluss kann weiterhin über die bestehende Web-URL laufen (z.B. über Deep Links in der App geöffnet).

- **Host-Flows**:
  - Dashboard → EventTypes-Übersicht, Buttons für „Neuen EventType anlegen“ und „Verfügbarkeit bearbeiten“.
  - Availability → Anzeige/Änderung der WorkingHours, Speichern via `/api/settings/availability`.
  - Settings → Username & Profilinformationen.

---

### 5. Dependency Injection

- Empfehlung: **Hilt** (oder Koin) als DI-Framework.
- DI-Module (`di/`):
  - `NetworkModule`:
    - Bereitstellung von HTTP-Client (OkHttp), Retrofit/Ktor, Base-URL.
    - Konfiguration des CookieJar (für NextAuth-Session).
  - `DatabaseModule`:
    - Room-DB-Instanz, DAOs.
  - `RepositoryModule`:
    - Bindings der Repository-Interfaces auf ihre Implementierungen.
  - `UseCaseModule`:
    - Bereitstellung der UseCases als abhängige Objekte.

---

### 6. Performance- & Wartbarkeitsaspekte

- **Re-Renders (Frontend Chain Guard)**:
  - Compose-Screens beobachten Flows/State aus ViewModels mit `collectAsStateWithLifecycle`.
  - Feingranulare State-Objekte vermeiden unnötige Re-Renders.
- **Blocking Operations**:
  - Alle Netzwerk-/DB-Operationen laufen in Coroutines (`Dispatchers.IO`).
  - Kein Blocking im Main-Thread; lange Operationen mit Ladezuständen und Cancel-Option.
- **Testbarkeit**:
  - Repositories und UseCases als Interfaces → einfache Mockbarkeit in Unit-Tests.
  - UI-Tests (Instrumented) für kritische Flows (Login, Booking, Availability, Settings).

---

### 7. Sicherheits- und Compliance-Aspekte in der Architektur

- **Security**:
  - Kein direkter Umgang der App mit Google- oder Session-Tokens (nur Cookie-basiert über HTTP-Stack).
  - Minimale Datenhaltung lokal (nur notwendige Caches, keine unnötigen Personendaten).
- **GDPR**:
  - Benutzerfreundliche Wege für:
    - Account-Löschung (sofern vom Backend angeboten).
    - Einsicht in gespeicherte Daten (über Booking-/EventType-Listen).
  - Trennung von technischen IDs und sichtbaren Nutzerinformationen in der UI.

---

### 8. Nächste Schritte für die Implementierung

1. Anlegen eines Android-App-Moduls `:app` mit Kotlin, Jetpack Compose, Hilt, Room, WorkManager, OkHttp/Retrofit oder Ktor.
2. Anlegen der Package-Struktur wie oben beschrieben.
3. Implementieren der Basis-`AppConfig` (Base-URL) und des HTTP-Clients mit CookieJar.
4. Implementieren der Room-DB-Grundstruktur (Entities, DAOs) nach den in der Offline-Spezifikation definierten Schemas.
5. Schrittweiser Aufbau der Repositories, UseCases und ViewModels, beginnend mit:
   - Auth/WebView-Login.
   - EventType-Lesen/Erstellen.
   - WorkingHours-Verwaltung.

