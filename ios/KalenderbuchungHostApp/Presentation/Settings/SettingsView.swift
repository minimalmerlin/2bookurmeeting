import SwiftUI

@MainActor
final class SettingsViewModel: ObservableObject {
    @Published var username: String = ""
    @Published var isSaving = false
    @Published var error: DomainError?
    @Published var didSave = false

    private let updateUsernameUseCase: UpdateUsernameUseCase

    init(updateUsernameUseCase: UpdateUsernameUseCase = UpdateUsernameUseCase(repository: SettingsRepositoryImpl())) {
        self.updateUsernameUseCase = updateUsernameUseCase
    }

    func save() {
        guard Self.isValid(username: username) else {
            error = .validation(message: "Nur Buchstaben, Zahlen und Bindestriche sind erlaubt.")
            return
        }

        isSaving = true
        error = nil

        Task {
            let result = await updateUsernameUseCase.execute(username: username)
            await MainActor.run {
                self.isSaving = false
                switch result {
                case .success:
                    self.didSave = true
                case .failure(let err):
                    self.error = err
                }
            }
        }
    }

    private static func isValid(username: String) -> Bool {
        let regex = try? NSRegularExpression(pattern: "^[a-zA-Z0-9-]+$")
        let range = NSRange(location: 0, length: username.utf16.count)
        return regex?.firstMatch(in: username, options: [], range: range) != nil
    }
}

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = SettingsViewModel()

    var body: some View {
        Form {
            Section("Öffentlicher Username") {
                TextField("username", text: $viewModel.username)
                    .textInputAutocapitalization(.never)
                    .disableAutocorrection(true)
            }

            if let error = viewModel.error {
                Section("Fehler") {
                    Text(errorMessage(for: error))
                        .foregroundColor(.red)
                }
            }

            Section {
                Button {
                    viewModel.save()
                } label: {
                    if viewModel.isSaving {
                        ProgressView()
                    } else {
                        Text("Speichern")
                    }
                }
                .disabled(viewModel.isSaving)
            }
        }
        .navigationTitle("Einstellungen")
        .onChange(of: viewModel.didSave) { didSave in
            if didSave {
                dismiss()
            }
        }
    }

    private func errorMessage(for error: DomainError) -> String {
        switch error {
        case .network:
            return "Netzwerkfehler. Bitte überprüfe deine Verbindung."
        case .unauthorized:
            return "Session abgelaufen. Bitte melde dich erneut an."
        case .validation(let message):
            return message ?? "Ungültige Eingabe."
        case .notFound:
            return "Nicht gefunden."
        case .conflict(let message):
            return message ?? "Username bereits vergeben."
        case .server:
            return "Serverfehler. Bitte später erneut versuchen."
        case .decoding, .unknown:
            return "Unerwarteter Fehler."
        }
    }
}

