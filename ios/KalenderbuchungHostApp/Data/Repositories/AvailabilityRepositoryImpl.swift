import Foundation

final class AvailabilityRepositoryImpl: AvailabilityRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient = .shared) {
        self.apiClient = apiClient
    }

    func loadSlots(userId: String, date: String, durationMinutes: Int) async -> Result<[AvailabilitySlot], DomainError> {
        let queryItems = [
            URLQueryItem(name: "userId", value: userId),
            URLQueryItem(name: "date", value: date),
            URLQueryItem(name: "duration", value: String(durationMinutes))
        ]

        let request = APIRequest(
            path: "/api/availability",
            method: "GET",
            queryItems: queryItems,
            body: nil
        )

        let result: Result<[String], DomainError> = await apiClient.send(request, decodeTo: [String].self)
        switch result {
        case .success(let isoStrings):
            let formatter = ISO8601DateFormatter()
            let slots = isoStrings.compactMap { iso -> AvailabilitySlot? in
                guard let date = formatter.date(from: iso) else { return nil }
                return AvailabilitySlot(startTime: date)
            }
            return .success(slots)
        case .failure(let error):
            return .failure(error)
        }
    }
}

