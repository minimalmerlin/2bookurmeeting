package de.kalenderbuchung.data.repository

import com.squareup.moshi.Moshi
import de.kalenderbuchung.data.local.PendingChangeEntity
import de.kalenderbuchung.data.local.PendingChangeDao
import de.kalenderbuchung.data.local.WorkingHoursDao
import de.kalenderbuchung.data.local.WorkingHoursEntity
import de.kalenderbuchung.data.remote.ApiService
import de.kalenderbuchung.data.remote.dto.WorkingHoursEntryDto
import de.kalenderbuchung.data.remote.dto.WorkingHoursRequestDto
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.IOException
import java.time.Instant

/**
 * Repository für Settings-bezogene Operationen (Working Hours etc.).
 *
 * Implementiert eine einfache Offline-Strategie:
 * - Bei Netzwerkfehlern werden Änderungen in der Pending-Queue gespeichert.
 */
class SettingsRepository(
    private val api: ApiService,
    private val workingHoursDao: WorkingHoursDao,
    private val pendingChangeDao: PendingChangeDao,
    private val moshi: Moshi
) {

    suspend fun getWorkingHoursForUser(userId: String): List<WorkingHoursEntity> =
        withContext(Dispatchers.IO) {
            workingHoursDao.getForUser(userId)
        }

    suspend fun setWorkingHoursOnlineOrQueue(
        userId: String,
        hours: List<WorkingHoursEntryDto>
    ): Result<Unit> = withContext(Dispatchers.IO) {
        val request = WorkingHoursRequestDto(hours = hours)
        try {
            val response = api.updateWorkingHours(request)
            if (response.success) {
                // Server hat übernommen → lokale DB aktualisieren
                val now = Instant.now().toEpochMilli()
                workingHoursDao.deleteForUser(userId)
                workingHoursDao.insertAll(
                    hours.map {
                        WorkingHoursEntity(
                            userId = userId,
                            day = it.day,
                            start = it.start,
                            end = it.end,
                            updatedAt = now
                        )
                    }
                )
                Result.success(Unit)
            } else {
                // Defensive: Sollte laut aktuellem Backend nicht passieren
                Result.failure(IllegalStateException("Backend returned success=false"))
            }
        } catch (io: IOException) {
            // Netzwerkfehler → in Pending-Queue schieben
            enqueuePendingWorkingHoursChange(request)
            Result.failure(io)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    private suspend fun enqueuePendingWorkingHoursChange(request: WorkingHoursRequestDto) {
        val adapter = moshi.adapter(WorkingHoursRequestDto::class.java)
        val json = adapter.toJson(request)
        val entity = PendingChangeEntity(
            type = TYPE_UPDATE_WORKING_HOURS,
            payload = json,
            createdAt = Instant.now().toEpochMilli()
        )
        pendingChangeDao.insert(entity)
    }

    suspend fun processPendingChanges(): Result<Unit> = withContext(Dispatchers.IO) {
        val changes = pendingChangeDao.getAll()
        for (change in changes) {
            when (change.type) {
                TYPE_UPDATE_WORKING_HOURS -> {
                    val adapter = moshi.adapter(WorkingHoursRequestDto::class.java)
                    val body = adapter.fromJson(change.payload)
                    if (body != null) {
                        try {
                            val response = api.updateWorkingHours(body)
                            if (response.success) {
                                pendingChangeDao.deleteById(change.id)
                            } else {
                                // Server lehnt ab → wir behalten den Eintrag, erhöhen Retry-Count
                                pendingChangeDao.update(
                                    change.copy(
                                        retryCount = change.retryCount + 1,
                                        lastError = "Backend returned success=false"
                                    )
                                )
                            }
                        } catch (io: IOException) {
                            // Netzwerkfehler → Retry beim nächsten Durchlauf
                            pendingChangeDao.update(
                                change.copy(
                                    retryCount = change.retryCount + 1,
                                    lastError = io.message
                                )
                            )
                        } catch (e: Exception) {
                            pendingChangeDao.update(
                                change.copy(
                                    retryCount = change.retryCount + 1,
                                    lastError = e.message
                                )
                            )
                        }
                    } else {
                        // Payload nicht mehr parsebar → Eintrag entfernen
                        pendingChangeDao.deleteById(change.id)
                    }
                }
                else -> {
                    // Unbekannter Typ – konservativ löschen, um die Queue nicht zu blockieren
                    pendingChangeDao.deleteById(change.id)
                }
            }
        }
        Result.success(Unit)
    }

    companion object {
        const val TYPE_UPDATE_WORKING_HOURS = "UPDATE_WORKING_HOURS"
    }
}

