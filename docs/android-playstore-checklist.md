## Google Play Store Checkliste – Android-Kalenderbuchungs-App

Diese Checkliste fasst die wichtigsten technischen und organisatorischen Anforderungen für das Veröffentlichen der App im Google Play Store zusammen.

---

### 1. App-Identität & Package-Name

- **Eindeutiger Package-Name** wählen, z.B.:
  - `de.yourcompany.kalenderbuchung`
- Sicherstellen, dass:
  - Der Package-Name stabil bleibt (spätere Änderungen sind aufwändig).
  - Kein Konflikt mit bereits existierenden Apps besteht.

---

### 2. Signierung & Build-Konfiguration

- **Release-Signing-Key** erstellen:
  - Keystore generieren (z.B. via Android Studio oder `keytool`).
  - Starke Passwörter verwenden, Keystore sicher speichern (nicht im Git-Repo).
- **Gradle-Konfiguration**:
  - `release`-BuildType mit:
    - Minify/ProGuard/R8-Konfiguration.
    - Aktiviertem Shrinking/Obfuscation (unter Berücksichtigung benötigter Reflection, z.B. bei Hilt/Room).
- Optional: Nutzung von **Play App Signing** zur Schlüsselspeicherung bei Google.

---

### 3. Ziel- & Mindest-API-Level

- **Minimale Empfehlung**:
  - `minSdkVersion`: **29** (Android 10) – wie im TDD empfohlen.
- **Target-Level**:
  - `targetSdkVersion`: Aktuell von Google Play geforderte Version (jährlich aktualisiert; vor Release prüfen).
- Sicherstellen, dass alle verwendeten Libraries das Ziel-API-Level unterstützen.

---

### 4. Berechtigungen (Permissions)

- Prinzip: **Least Privilege** – nur Permissions, die für die Funktion unbedingt nötig sind.
- Voraussichtliche Permissions:
  - Netzwerkzugriff:
    - `android.permission.INTERNET`
  - Optional:
    - `android.permission.ACCESS_NETWORK_STATE` (für Online/Offline-Erkennung).
- Nicht nötig (und daher zu vermeiden), solange kein direkter Zugriff erfolgt:
  - Kalender-Permissions (`READ_CALENDAR`, `WRITE_CALENDAR`) – da Kalenderzugriff über Backend/Google-API läuft.
  - Standort, Kontakte, Kamera, Mikrofon, etc. – außer später explizit eingeführt.

---

### 5. Datenschutz & GDPR

- **Privacy Policy**:
  - Eine öffentlich erreichbare Datenschutz­erklärung (URL), die in der Play-Console hinterlegt wird.
  - Inhalt:
    - Welche Daten werden verarbeitet? (Name, E-Mail, Meeting-Daten, ggf. Geräteinformationen).
    - Wo werden die Daten gespeichert? (Server/Region).
    - Wie lange werden die Daten aufbewahrt?
    - Rechte der Nutzer:innen (Auskunft, Löschung, Berichtigung).
- **In-App-Hinweise**:
  - Kurze Einwilligungs-/Informationstexte beim ersten Start oder bei kritischen Aktionen (z.B. „Ihre Kalenderdaten werden über Google verarbeitet“).
- **Datenminimierung**:
  - Lokal nur die Daten speichern, die für Offline-Zwecke zwingend nötig sind (vgl. `docs/android-offline-sync.md`).

---

### 6. Sicherheitsanforderungen (OWASP Mobile, Play-Richtlinien)

- **Sichere Kommunikation**:
  - Alle Requests nur über HTTPS zur Backend-Domain.
  - Keine eigenen Certificate-Pinning-Lösungen, solange nicht klar notwendig (erhöht Komplexität).
- **Secret Handling**:
  - Keine API-Keys oder Client-Secrets im Klartext im Code.
  - Verwendung von Backend-Proxy/Server-Seite für Integrationen (Google Calendar etc.).
- **Code-Obfuscation**:
  - R8/ProGuard aktivieren, sensible Klassen/Felder nicht in Klartext.
- **Root/Jailbreak-Erkennung** (optional):
  - Kann später ergänzt werden, um z.B. besonders sensible Operationen auf kompromittierten Geräten einzuschränken.

---

### 7. Store-Assets & Metadaten

- **Grafische Assets**:
  - App-Icon (verschiedene Auflösungen).
  - Screenshots in den geforderten Größen (Phones, ggf. Tablets).
  - Optional: Feature Graphic.
- **Textliche Inhalte**:
  - App-Name, Kurzbeschreibung, ausführliche Beschreibung.
  - Keywords und klare Kommunikation der Kernfeatures (Buchung, Kalenderintegration, Offline-Fähigkeit).
- **Klassifizierungen**:
  - Altersfreigabe (Content Rating).
  - Angabe, ob es In-App-Käufe oder Abos gibt (für MVP vermutlich nicht).

---

### 8. Qualitätssicherung vor dem Upload

- **Technische Tests**:
  - Unit-Tests für Domain- und Data-Layer.
  - Instrumented UI-Tests für kritische Flows (Login, Booking, Settings).
  - Manuelle Tests auf mehreren Geräteklassen (kleine + große Displays, verschiedene Android-Versionen).
- **Performance & Stabilität**:
  - App-Startzeiten prüfen.
  - Speicherverbrauch und Netzwerk-Usage überprüfen.
  - Crash-freies Verhalten über längere Sessions testen.

---

### 9. Release-Prozess

- **Build-Pipeline** (optional, empfohlen):
  - CI/CD-Setup, das:
    - Release-Builds baut.
    - Tests ausführt.
    - Signierte Artifacts generiert (unter sicherer Handhabung der Keys).
- **Interner Test**:
  - Upload in internen oder geschlossenen Testkanal der Play-Console.
  - Verteilung an Testnutzer:innen (z.B. Hosts/Admins).
- **Rollout**:
  - Staged Rollout (z.B. 10 %, 50 %, 100 %), um Probleme früh zu erkennen.

