import SwiftUI
import SafariServices

struct LoginView: View {
    @EnvironmentObject private var authViewModel: AuthViewModel
    @State private var isPresentingSafari = false

    private var signInURL: URL {
        AppConfig.baseURL.appendingPathComponent("/api/auth/signin")
    }

    var body: some View {
        VStack(spacing: 24) {
            Text("Kalenderbuchung")
                .font(.largeTitle.bold())

            Text("Melde dich mit deinem Google-Account an, um dein Dashboard zu verwalten.")
                .multilineTextAlignment(.center)
                .foregroundColor(.secondary)

            Button(action: {
                isPresentingSafari = true
            }) {
                Text("Mit Google anmelden")
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.blue)
                    .foregroundColor(.white)
                    .cornerRadius(12)
            }
            .accessibilityLabel("Mit Google anmelden")

            Button(role: .cancel) {
                // Abbruchpfad: bleibt auf Login-Screen.
            } label: {
                Text("Abbrechen")
            }
        }
        .padding()
        .sheet(isPresented: $isPresentingSafari) {
            SafariView(url: signInURL) {
                // In einer echten App würde hier ein Deep-Link oder Cookie-Check
                // den erfolgreichen Login erkennen und `markLoggedIn` aufrufen.
                authViewModel.markLoggedIn()
            }
        }
    }
}

private struct SafariView: UIViewControllerRepresentable {
    let url: URL
    let onDismiss: () -> Void

    func makeUIViewController(context: Context) -> SFSafariViewController {
        let controller = SFSafariViewController(url: url)
        controller.delegate = context.coordinator
        return controller
    }

    func updateUIViewController(_ uiViewController: SFSafariViewController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(onDismiss: onDismiss)
    }

    final class Coordinator: NSObject, SFSafariViewControllerDelegate {
        private let onDismiss: () -> Void

        init(onDismiss: @escaping () -> Void) {
            self.onDismiss = onDismiss
        }

        func safariViewControllerDidFinish(_ controller: SFSafariViewController) {
            onDismiss()
        }
    }
}

