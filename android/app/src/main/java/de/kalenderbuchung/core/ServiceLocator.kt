package de.kalenderbuchung.core

import android.content.Context
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.preferencesDataStore
import androidx.room.Room
import com.squareup.moshi.Moshi
import de.kalenderbuchung.data.local.AppDatabase
import de.kalenderbuchung.data.remote.ApiService
import de.kalenderbuchung.data.remote.createRetrofitApiService
import de.kalenderbuchung.data.repository.SettingsRepository
import okhttp3.OkHttpClient
import java.util.concurrent.TimeUnit

/**
 * Einfache, framework-freie DI/Service-Locator-Implementierung.
 *
 * Ziel: minimale Abhängigkeiten, trotzdem klare Trennung der Verantwortlichkeiten.
 */
object ServiceLocator {

    // region DataStore

    private const val DATA_STORE_NAME = "kalenderbuchung_prefs"

    val Context.dataStore by preferencesDataStore(name = DATA_STORE_NAME)

    // endregion

    // region Netzwerk

    @Volatile
    private var apiService: ApiService? = null

    private fun createOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(15, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .writeTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    private fun createMoshi(): Moshi = Moshi.Builder().build()

    fun getApiService(): ApiService {
        return apiService ?: synchronized(this) {
            apiService ?: createRetrofitApiService(
                baseUrl = AppConfig.BACKEND_BASE_URL,
                okHttpClient = createOkHttpClient(),
                moshi = createMoshi()
            ).also { apiService = it }
        }
    }

    // endregion

    // region Room-Datenbank

    @Volatile
    private var database: AppDatabase? = null

    fun getDatabase(context: Context): AppDatabase {
        return database ?: synchronized(this) {
            database ?: Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                "kalenderbuchung.db"
            ).build().also { database = it }
        }
    }

    // endregion

    // region Repositories

    fun getSettingsRepository(context: Context): SettingsRepository {
        val db = getDatabase(context)
        return SettingsRepository(
            api = getApiService(),
            workingHoursDao = db.workingHoursDao(),
            pendingChangeDao = db.pendingChangeDao(),
            moshi = createMoshi()
        )
    }

    // endregion
}

