package de.kalenderbuchung.core

/**
 * Zentrale technische Konfiguration der Android-App.
 *
 * WICHTIG:
 * - Passe [BACKEND_BASE_URL] an die Deploy-URL deiner Next.js-App an (ohne abschließenden Slash).
 */
object AppConfig {
    // Deploy-URL der Next.js-App (Vercel)
    const val BACKEND_BASE_URL: String = "https://2bookurmeetings.vercel.app"

    // Standard-Route, auf die nach erfolgreichem Login weitergeleitet wird.
    // Diese URL wird verwendet, um im WebView-Login den Erfolg zu erkennen.
    const val AUTH_SUCCESS_PATH: String = "/dashboard"
}

