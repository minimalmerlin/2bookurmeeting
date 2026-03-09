package de.kalenderbuchung.sync

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters
import de.kalenderbuchung.core.ServiceLocator

/**
 * Hintergrund-Worker, der Pending-Änderungen (z.B. Working Hours) mit dem Backend synchronisiert.
 */
class SyncPendingChangesWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val repo = ServiceLocator.getSettingsRepository(applicationContext)
        return when (repo.processPendingChanges().isSuccess) {
            true -> Result.success()
            false -> Result.retry()
        }
    }
}

