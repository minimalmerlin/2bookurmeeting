package de.kalenderbuchung.data.remote

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import de.kalenderbuchung.data.remote.dto.BookingRequestDto
import de.kalenderbuchung.data.remote.dto.BookingResponseDto
import de.kalenderbuchung.data.remote.dto.EventTypeCreateRequestDto
import de.kalenderbuchung.data.remote.dto.EventTypeDto
import de.kalenderbuchung.data.remote.dto.UpdateSettingsRequestDto
import de.kalenderbuchung.data.remote.dto.WorkingHoursRequestDto
import de.kalenderbuchung.data.remote.dto.WorkingHoursSuccessResponseDto
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PATCH
import retrofit2.http.Query

/**
 * Retrofit-API-Definition für das bestehende Next.js-Backend.
 *
 * Pfade und Methoden sind 1:1 an die bereits existierenden Route-Handler angelehnt.
 */
interface ApiService {

    // /api/book – öffentliche Buchung
    @POST("api/book")
    suspend fun book(@Body body: BookingRequestDto): BookingResponseDto

    // /api/availability – freie Slots
    @GET("api/availability")
    suspend fun getAvailability(
        @Query("userId") userId: String,
        @Query("date") date: String,
        @Query("duration") durationMinutes: Int
    ): List<String>

    // /api/event-types – neuen Event-Typ anlegen (auth-pflichtig)
    @POST("api/event-types")
    suspend fun createEventType(
        @Body body: EventTypeCreateRequestDto
    ): EventTypeDto

    // /api/settings/availability – Working Hours speichern (auth-pflichtig)
    @POST("api/settings/availability")
    suspend fun updateWorkingHours(
        @Body body: WorkingHoursRequestDto
    ): WorkingHoursSuccessResponseDto

    // /api/settings – Username & Settings patchen (auth-pflichtig)
    @PATCH("api/settings")
    suspend fun updateSettings(
        @Body body: UpdateSettingsRequestDto
    ): Map<String, Any?>
}

fun createRetrofitApiService(
    baseUrl: String,
    okHttpClient: OkHttpClient,
    moshi: Moshi
): ApiService {
    val effectiveMoshi = moshi.newBuilder()
        .add(KotlinJsonAdapterFactory())
        .build()

    val retrofit = Retrofit.Builder()
        .baseUrl(baseUrl)
        .client(okHttpClient)
        .addConverterFactory(MoshiConverterFactory.create(effectiveMoshi))
        .build()

    return retrofit.create(ApiService::class.java)
}

