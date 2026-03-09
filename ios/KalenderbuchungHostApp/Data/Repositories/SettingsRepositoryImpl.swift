import Foundation

final class SettingsRepositoryImpl: SettingsRepository {
    private let apiClient: APIClient

    init(apiClient: APIClient = .shared) {
        self.apiClient = apiClient
    }

    func updateWorkingHours(_ hours: [WorkingHoursEntry]) async -> Result<Void, DomainError> {
        let encoder = JSONEncoder()
        guard let hoursData = try? encoder.encode(hours),
              let hoursJSONArray = try? JSONSerialization.jsonObject(with: hoursData) as? [[String: Any]] else {
            return .failure(.validation(message: "Invalid working hours payload"))
        }

        let payload: [String: Any] = [
            "hours": hoursJSONArray
        ]

        guard let body = try? JSONSerialization.data(withJSONObject: payload, options: []) else {
            return .failure(.validation(message: "Invalid working hours payload"))
        }

        let request = APIRequest(
            path: "/api/settings/availability",
            method: "POST",
            queryItems: nil,
            body: body
        )

        let result: Result<EmptyResponse, DomainError> = await apiClient.send(request, decodeTo: EmptyResponse.self)
        switch result {
        case .success:
            return .success(())
        case .failure(let error):
            return .failure(error)
        }
    }

    func updateUsername(_ username: String) async -> Result<User, DomainError> {
        let payload: [String: Any] = [
            "username": username
        ]
        guard let body = try? JSONSerialization.data(withJSONObject: payload, options: []) else {
            return .failure(.validation(message: "Invalid username payload"))
        }

        let request = APIRequest(
            path: "/api/settings",
            method: "PATCH",
            queryItems: nil,
            body: body
        )

        return await apiClient.send(request, decodeTo: User.self)
    }
}

