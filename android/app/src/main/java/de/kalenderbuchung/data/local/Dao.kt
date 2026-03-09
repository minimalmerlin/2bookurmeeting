package de.kalenderbuchung.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update

@Dao
interface WorkingHoursDao {

    @Query("SELECT * FROM working_hours WHERE user_id = :userId")
    suspend fun getForUser(userId: String): List<WorkingHoursEntity>

    @Query("DELETE FROM working_hours WHERE user_id = :userId")
    suspend fun deleteForUser(userId: String)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(entities: List<WorkingHoursEntity>)
}

@Dao
interface PendingChangeDao {

    @Query("SELECT * FROM pending_changes ORDER BY created_at ASC")
    suspend fun getAll(): List<PendingChangeEntity>

    @Insert
    suspend fun insert(change: PendingChangeEntity)

    @Update
    suspend fun update(change: PendingChangeEntity)

    @Query("DELETE FROM pending_changes WHERE id = :id")
    suspend fun deleteById(id: Long)
}

