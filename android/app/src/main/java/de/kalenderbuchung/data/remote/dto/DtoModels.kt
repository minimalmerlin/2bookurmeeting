package de.kalenderbuchung.data.remote.dto

/**
 * DTOs spiegeln die JSON-Struktur der bestehenden Next.js-Endpoints.
 * Sie werden in Domain-Modelle gemappt.
 */

data class BookingRequestDto(
    val eventTypeId: String,
    val name: String,
    val email: String,
    val startTime: String
)

data class BookingResponseDto(
    val id: String,
    val eventTypeId: String,
    val userId: String,
    val attendeeName: String,
    val attendeeEmail: String,
    val startTime: String,
    val endTime: String,
    val googleEventId: String?,
    val meetLink: String?
)

data class EventTypeCreateRequestDto(
    val title: String,
    val description: String?,
    val duration: Int,
    val slug: String
)

data class EventTypeDto(
    val id: String,
    val title: String,
    val description: String?,
    val duration: Int,
    val slug: String,
    val userId: String
)

data class WorkingHoursEntryDto(
    val day: Int,
    val start: String,
    val end: String
)

data class WorkingHoursRequestDto(
    val hours: List<WorkingHoursEntryDto>
)

data class WorkingHoursSuccessResponseDto(
    val success: Boolean
)

data class UpdateSettingsRequestDto(
    val username: String
)

