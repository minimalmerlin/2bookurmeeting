## Android Auth-Strategie für die Kalenderbuchungs-App

Ziel: **Sichere, möglichst einfache Wiederverwendung der bestehenden NextAuth-Google-OAuth-Integration** für die Android-App, ohne unnötig neue Token-Infrastruktur zu erfinden (Least-Power-Prinzip).

---

### 1. Rahmenbedingungen & Anforderungen

- Backend nutzt **NextAuth mit Google OAuth**:
  - Session-Cookies (`next-auth.session-token` o.Ä.) identifizieren den User.
  - Tokens für Google Calendar liegen serverseitig in der Prisma-DB (`Account`-Tabelle).
- Die Android-App soll:
  - **Hosts/Admins** sicher anmelden (Google Login).
  - **Kein eigenes Passwort-System** einführen.
  - Möglichst **keine neue Token-Logik im Backend** erfinden, solange nicht nötig.
  - OWASP Mobile Top 10 & GDPR berücksichtigen (kein Klartext-Token in Storage, minimaler Scope).

---

### 2. Gewählte Strategie: WebView + NextAuth-Session (Least Power)

Wir nutzen einen **In-App-WebView** (oder Custom Tab), um den bestehenden NextAuth-Loginflow auszuführen, und teilen anschließend die **Session-Cookies** zwischen WebView und HTTP-Client der App.

**Ablauf (High Level)**:

1. User startet die App und wählt „Mit Google anmelden“.
2. App öffnet eine In-App-WebView auf die bestehende Login-URL (z.B. `/api/auth/signin` bzw. die Landing-Page mit Login-Button).
3. User durchläuft den **Google OAuth-Flow** wie im Browser.
4. Nach erfolgreichem Login setzt NextAuth eine **Session-Cookie**-basierte Session auf der Backend-Domain.
5. Die WebView wird auf eine spezielle **Callback-URL** (z.B. `/mobile/auth/success`) weitergeleitet:
   - Diese Seite existiert im Web-Frontend und zeigt nur eine knappe „Login erfolgreich, Sie können zur App zurückkehren“-Ansicht.
   - Gleichzeitig prüft die App via **URL-Interceptor** in der WebView, ob diese URL erreicht ist.
6. Ab diesem Punkt gelten:
   - Die Session-Cookies liegen im gemeinsamen Cookie-Store des Systems (WebView + `CookieManager`).
   - Der **Android-HTTP-Client (z.B. OkHttp)** nutzt einen `CookieJar` auf Basis von `CookieManager`, sodass alle nachfolgenden REST-Requests die NextAuth-Session-Cookies mitsenden.

Damit „sieht“ das Backend die Android-App exakt wie einen normalen Browser-Client – inklusive aller bestehenden Security-Mechanismen.

---

### 3. Technische Umsetzung (Android-Seite)

#### 3.1 Komponenten

- `AuthWebViewActivity` (oder Compose-basierter Screen mit WebView-Wrapper):
  - Lädt die Login-URL (`https://<deine-domain>/api/auth/signin` oder Landing-Page).
  - Beobachtet URL-Änderungen im WebView.
  - Sobald eine definierte Erfolgs-URL (z.B. `/mobile/auth/success`) erreicht ist:
    - WebView wird geschlossen.
    - App markiert User als „eingeloggt“ (z.B. speichert `isAuthenticated = true` in verschlüsseltem Storage).

- `HttpClient` (z.B. OkHttp + Retrofit/Ktor):
  - Verwendet einen `CookieJar`, der auf `android.webkit.CookieManager` basiert (z.B. via `JavaNetCookieJar` oder eigene Implementierung).
  - Domain der Requests entspricht der WebView-Domain; damit werden die NextAuth-Cookies automatisch mitgesendet.

#### 3.2 Security-Aspekte

- **HttpOnly-Cookies**:
  - Die App greift nicht direkt auf den Cookie-Inhalt zu; `CookieManager`/`CookieJar` reicht die Cookies nur beim HTTP-Request weiter.
  - HttpOnly-Semantik bleibt erhalten; kein Zugriff aus JS oder App-Code auf den Session-Token.
- **Storage**:
  - Wir speichern **kein Access-Token im Klartext**.
  - Der Login-Status (z.B. `isAuthenticated`) kann in verschlüsseltem Storage persistiert werden, aber niemals die Session-Token selbst.
- **Logout**:
  - Logout-Flow ruft `/api/auth/signout` im WebView/HTTP-Client auf und leert zusätzlich den Cookie-Store (über `CookieManager.removeAllCookies`).

---

### 4. Alternative (Reserve): Dedizierter Mobile-Token-Endpunkt

Falls die WebView-/Cookie-basierte Lösung sich in der Praxis als unzureichend erweist (z.B. wegen starker Trennung von WebView- und HTTP-Cookie-Storage in bestimmten Android-Versionen oder komplexen Multi-Domain-Setups), ist ein **zweiter, expliziter Pfad** vorgesehen:

- Neuer Endpoint, z.B. `POST /api/mobile/login`, der:
  - Entweder ein von der App bereitgestelltes **Google ID-Token** validiert **oder**
  - Einen bereits bestehenden NextAuth-Session-Cookie in ein **kurzlebiges JWT** übersetzt.
  - Bei Erfolg ein Access-Token (z.B. JWT) zurückgibt, das die App für alle weiteren REST-Calls im `Authorization: Bearer <token>`-Header verwendet.
- Dieser Ansatz erfordert zusätzliche Implementierung im Backend (Token-Ausstellung, Verifikation, Ablauf) und birgt neue Sicherheits- und Komplexitätsrisiken.

**Status**: Nicht implementiert, nur als **Option für später** vorgesehen, falls die Browser-basierte Lösung nicht ausreicht.

---

### 5. Bewertung im Sinne der Chain Guards

- **Backend Chain Guard**
  - Kein neuer Endpoint ohne Contract: Aktuell wird **kein** neuer Mobile-spezifischer Login-Endpoint eingeführt → kein zusätzlicher Angriffsvektor.
  - Kein Silent-Failure: Login-Erfolg wird explizit über Erreichen der Erfolgs-URL + sichtbare UI-Rückmeldung signalisiert; Fehler (z.B. abgebrochener OAuth-Flow) werden im WebView-Screen behandelt und dem User angezeigt.
  - Kein Retry ohne Idempotenz: Login ist idempotent genug (mehrfacher Start des OAuth-Flow schadet nicht).

- **Frontend Chain Guard**
  - Kein UI-State ohne Quelle: `isAuthenticated` leitet sich ausschließlich vom erfolgreichen Abschluss des WebView-Loginflows ab.
  - Kein Effect ohne Cleanup: WebView-Instanz wird nach Login/Abbruch sauber geschlossen; Cookie-Cleanup beim Logout explizit.

- **Security / OWASP / GDPR**
  - Keine Klartext-Zugriff auf Session-Tokens im App-Code.
  - Minimierung der lokal gespeicherten Daten auf Metadaten (Login-Status) und Domain-spezifische Caches.
  - Klarer Trennstrich: alle „harten“ Security-Entscheidungen (Token Refresh, Google-Scopes,…) liegen weiterhin im Backend/NextAuth.

---

### 6. Konsequenzen für die Android-Implementierung

- Alle **authentifizierten Endpunkte** (`POST /api/event-types`, `POST /api/settings/availability`, `PATCH /api/settings`, sowie später `GET /api/event-types`, `GET /api/bookings` etc.) werden aus der App **ohne zusätzliche Auth-Header**, sondern ausschließlich mit Cookies angesprochen.
- Der HTTP-Client muss so konfiguriert werden, dass:
  - Nur Requests zur eigenen Backend-Domain die Session-Cookies mitbekommen.
  - Kein Third-Party-Tracking entsteht (keine unnötigen Cookies anderer Domains).
- Testfälle:
  - Login-Flow end-to-end (inkl. Fehlerfälle wie abgebrochener OAuth-Flow).
  - Aufruf eines geschützten Endpoints vor/nach Login.
  - Logout-Flow inklusive Cookie-Löschung und erneuter Zugriff auf geschützte Endpoints (erwartet: 401).

