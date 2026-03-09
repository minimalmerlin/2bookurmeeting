import Foundation

protocol EventTypeRepository {
    func fetchEventTypes() async -> Result<[EventType], DomainError>
    func createEventType(title: String, description: String?, duration: Int, slug: String) async -> Result<EventType, DomainError>
}

protocol SettingsRepository {
    func updateWorkingHours(_ hours: [WorkingHoursEntry]) async -> Result<Void, DomainError>
    func updateUsername(_ username: String) async -> Result<User, DomainError>
}

protocol AvailabilityRepository {
    func loadSlots(userId: String, date: String, durationMinutes: Int) async -> Result<[AvailabilitySlot], DomainError>
}

protocol AuthRepository {
    var isLoggedIn: Bool { get }
    func logout()
}

struct LoadEventTypesUseCase {
    let repository: EventTypeRepository

    func execute() async -> Result<[EventType], DomainError> {
        await repository.fetchEventTypes()
    }
}

struct CreateEventTypeUseCase {
    let repository: EventTypeRepository

    func execute(title: String, description: String?, duration: Int, slug: String) async -> Result<EventType, DomainError> {
        await repository.createEventType(title: title, description: description, duration: duration, slug: slug)
    }
}

struct UpdateWorkingHoursUseCase {
    let repository: SettingsRepository

    func execute(hours: [WorkingHoursEntry]) async -> Result<Void, DomainError> {
        await repository.updateWorkingHours(hours)
    }
}

struct UpdateUsernameUseCase {
    let repository: SettingsRepository

    func execute(username: String) async -> Result<User, DomainError> {
        await repository.updateUsername(username)
    }
}

struct LoadAvailabilitySlotsUseCase {
    let repository: AvailabilityRepository

    func execute(userId: String, date: String, durationMinutes: Int) async -> Result<[AvailabilitySlot], DomainError> {
        await repository.loadSlots(userId: userId, date: date, durationMinutes: durationMinutes)
    }
}

