import SwiftUI

@MainActor
final class AvailabilityViewModel: ObservableObject {
    @Published var hours: [WorkingHoursEntry] = []
    @Published var isSaving = false
    @Published var error: DomainError?
    @Published var didSave = false

    private let updateUseCase: UpdateWorkingHoursUseCase

    init(updateUseCase: UpdateWorkingHoursUseCase = UpdateWorkingHoursUseCase(repository: SettingsRepositoryImpl())) {
        self.updateUseCase = updateUseCase
        self.hours = Self.defaultHours()
    }

    private static func defaultHours() -> [WorkingHoursEntry] {
        // Montag–Freitag 09:00–17:00
        return (1...5).map { day in
            WorkingHoursEntry(day: day, start: "09:00", end: "17:00")
        }
    }

    func save() {
        isSaving = true
        error = nil

        Task {
            let result = await updateUseCase.execute(hours: hours)
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
}

struct AvailabilityView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = AvailabilityViewModel()

    var body: some View {
        Form {
            Section("Arbeitszeiten") {
                ForEach($viewModel.hours) { $entry in
                    HStack {
                        Text(dayName(for: entry.day))
                        Spacer()
                        TextField("Start", text: $entry.start)
                            .frame(width: 70)
                            .textInputAutocapitalization(.never)
                        TextField("Ende", text: $entry.end)
                            .frame(width: 70)
                            .textInputAutocapitalization(.never)
                    }
                }
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
        .navigationTitle("Verfügbarkeit")
        .onChange(of: viewModel.didSave) { didSave in
            if didSave {
                dismiss()
            }
        }
    }

    private func dayName(for day: Int) -> String {
        switch day {
        case 0: return "So"
        case 1: return "Mo"
        case 2: return "Di"
        case 3: return "Mi"
        case 4: return "Do"
        case 5: return "Fr"
        case 6: return "Sa"
        default: return "Tag \(day)"
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
            return message ?? "Konflikt beim Speichern."
        case .server:
            return "Serverfehler. Bitte später erneut versuchen."
        case .decoding, .unknown:
            return "Unerwarteter Fehler."
        }
    }
}

