import SwiftUI

struct RootView: View {
    @EnvironmentObject private var authViewModel: AuthViewModel

    var body: some View {
        switch authViewModel.state {
        case .unknown, .loggedOut:
            LoginView()
        case .loggedIn:
            NavigationStack {
                DashboardView()
            }
        }
    }
}

