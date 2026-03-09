package de.kalenderbuchung.data.local

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "working_hours")
data class WorkingHoursEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "user_id") val userId: String,
    @ColumnInfo(name = "day") val day: Int,
    @ColumnInfo(name = "start") val start: String,
    @ColumnInfo(name = "end") val end: String,
    @ColumnInfo(name = "updated_at") val updatedAt: Long
)

@Entity(tableName = "pending_changes")
data class PendingChangeEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    @ColumnInfo(name = "type") val type: String,
    @ColumnInfo(name = "payload") val payload: String,
    @ColumnInfo(name = "created_at") val createdAt: Long,
    @ColumnInfo(name = "retry_count") val retryCount: Int = 0,
    @ColumnInfo(name = "last_error") val lastError: String? = null
)

