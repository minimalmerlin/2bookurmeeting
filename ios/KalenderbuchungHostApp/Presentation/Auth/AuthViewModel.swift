import Foundation

@MainActor
final class AuthViewModel: ObservableObject {
    enum AuthState {
        case unknown
        case loggedOut
        case loggedIn
    }

    @Published private(set) var state: AuthState = .loggedOut

    func markLoggedIn() {
        state = .loggedIn
    }

    func logout() {
        state = .loggedOut
    }
}

