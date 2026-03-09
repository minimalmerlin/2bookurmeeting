import Foundation

final class EventTypeRepositoryImpl: EventTypeRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient = .shared) {
        self.apiClient = apiClient
    }

    func fetchEventTypes() async -> Result<[EventType], DomainError> {
        let request = APIRequest(
            path: "/api/event-types",
            method: "GET",
            queryItems: nil,
            body: nil
        )
        return await apiClient.send(request, decodeTo: [EventType].self)
    }

    func createEventType(title: String, description: String?, duration: Int, slug: String) async -> Result<EventType, DomainError> {
        let payload: [String: Any] = [
            "title": title,
            "description": description as Any,
            "duration": duration,
            "slug": slug
        ]
        let body = try? JSONSerialization.data(withJSONObject: payload, options: [])

        let request = APIRequest(
            path: "/api/event-types",
            method: "POST",
            queryItems: nil,
            body: body
        )
        return await apiClient.send(request, decodeTo: EventType.self)
    }
}

