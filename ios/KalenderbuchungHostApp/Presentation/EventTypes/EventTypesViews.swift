import SwiftUI

struct EventTypesListView: View {
    @StateObject private var viewModel = EventTypesViewModel()

    var body: some View {
        List {
            if viewModel.isLoading {
                ProgressView("Lade Event-Typen …")
            }

            ForEach(viewModel.eventTypes) { eventType in
                VStack(alignment: .leading, spacing: 4) {
                    Text(eventType.title)
                        .font(.headline)
                    if let description = eventType.description, !description.isEmpty {
                        Text(description)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    Text("\(eventType.duration) Minuten")
                        .font(.footnote)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 4)
            }
        }
        .overlay {
            if let error = viewModel.error {
                errorView(error: error)
            }
        }
        .navigationTitle("Event-Typen")
        .toolbar {
            NavigationLink("Neu") {
                NewEventTypeView()
            }
        }
        .onAppear {
            viewModel.load()
        }
    }

    @ViewBuilder
    private func errorView(error: DomainError) -> some View {
        VStack {
            Text("Fehler beim Laden")
                .font(.headline)
            Text(errorMessage(for: error))
                .font(.subheadline)
                .foregroundColor(.secondary)
        }
        .padding()
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
            return "Keine Event-Typen gefunden."
        case .conflict(let message):
            return message ?? "Konflikt beim Speichern."
        case .server:
            return "Serverfehler. Bitte später erneut versuchen."
        case .decoding, .unknown:
            return "Unerwarteter Fehler."
        }
    }
}

struct NewEventTypeView: View {
    @Environment(\.dismiss) private var dismiss
    @StateObject private var viewModel = NewEventTypeViewModel()

    var body: some View {
        Form {
            Section("Basisdaten") {
                TextField("Titel", text: $viewModel.title)
                TextField("Beschreibung", text: $viewModel.description, axis: .vertical)
                TextField("Dauer (Minuten)", text: $viewModel.duration)
                    .keyboardType(.numberPad)
                TextField("Slug", text: $viewModel.slug)
                    .textInputAutocapitalization(.never)
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
        .navigationTitle("Neuer Event-Typ")
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
            return message ?? "Slug bereits vergeben."
        case .server:
            return "Serverfehler. Bitte später erneut versuchen."
        case .decoding, .unknown:
            return "Unerwarteter Fehler."
        }
    }
}

