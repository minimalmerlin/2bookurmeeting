package de.kalenderbuchung.data.local

import androidx.room.Database
import androidx.room.RoomDatabase

@Database(
    entities = [
        WorkingHoursEntity::class,
        PendingChangeEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun workingHoursDao(): WorkingHoursDao
    abstract fun pendingChangeDao(): PendingChangeDao
}

