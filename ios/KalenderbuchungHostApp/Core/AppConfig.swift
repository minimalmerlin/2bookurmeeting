import Foundation

enum AppEnvironment {
    case development
    case production
}

struct AppConfig {
    static let environment: AppEnvironment = .development

    static var baseURL: URL {
        switch environment {
        case .development:
            // Passe diese URL bei Bedarf an deine Dev-Umgebung an.
            return URL(string: "http://localhost:3000")!
        case .production:
            return URL(string: "https://your-production-domain.example")!
        }
    }
}

