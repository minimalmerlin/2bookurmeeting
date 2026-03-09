package de.kalenderbuchung

import android.app.Application
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import de.kalenderbuchung.sync.SyncPendingChangesWorker
import java.util.concurrent.TimeUnit

class KalenderbuchungApp : Application() {

    override fun onCreate() {
        super.onCreate()
        schedulePeriodicSync()
    }

    private fun schedulePeriodicSync() {
        val request = PeriodicWorkRequestBuilder<SyncPendingChangesWorker>(
            repeatInterval = 15, // Mindestintervall von WorkManager
            repeatIntervalTimeUnit = TimeUnit.MINUTES
        ).setConstraints(
            androidx.work.Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()
        ).build()

        WorkManager.getInstance(this).enqueueUniquePeriodicWork(
            "pending_changes_sync",
            ExistingPeriodicWorkPolicy.KEEP,
            request
        )
    }
}


