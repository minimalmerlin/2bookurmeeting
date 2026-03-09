import Foundation

struct APIRequest {
    let path: String
    let method: String
    let queryItems: [URLQueryItem]?
    let body: Data?
}

final class APIClient {
    static let shared = APIClient()

    private let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    func send<T: Decodable>(_ request: APIRequest, decodeTo type: T.Type) async -> Result<T, DomainError> {
        var components = URLComponents(url: AppConfig.baseURL, resolvingAgainstBaseURL: false)
        components?.path = request.path
        if let queryItems = request.queryItems {
            components?.queryItems = queryItems
        }

        guard let url = components?.url else {
            return .failure(.unknown)
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = request.method
        urlRequest.httpBody = request.body
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            let (data, response) = try await session.data(for: urlRequest)
            guard let httpResponse = response as? HTTPURLResponse else {
                return .failure(.unknown)
            }

            switch httpResponse.statusCode {
            case 200..<300:
                if T.self == EmptyResponse.self {
                    return .success(EmptyResponse() as! T)
                }
                do {
                    let decoded = try JSONDecoder().decode(T.self, from: data)
                    return .success(decoded)
                } catch {
                    return .failure(.decoding)
                }
            case 400:
                let message = String(data: data, encoding: .utf8)
                return .failure(.validation(message: message))
            case 401:
                return .failure(.unauthorized)
            case 404:
                return .failure(.notFound)
            case 409:
                let message = String(data: data, encoding: .utf8)
                return .failure(.conflict(message: message))
            case 500..<600:
                return .failure(.server)
            default:
                return .failure(.unknown)
            }
        } catch {
            return .failure(.network)
        }
    }
}

struct EmptyResponse: Decodable { }

