import Foundation

@MainActor
final class EventTypesViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var eventTypes: [EventType] = []
    @Published var error: DomainError?

    private let loadUseCase: LoadEventTypesUseCase

    init(loadUseCase: LoadEventTypesUseCase = LoadEventTypesUseCase(repository: EventTypeRepositoryImpl())) {
        self.loadUseCase = loadUseCase
    }

    func load() {
        isLoading = true
        error = nil

        Task {
            let result = await loadUseCase.execute()
            await MainActor.run {
                self.isLoading = false
                switch result {
                case .success(let types):
                    self.eventTypes = types
                case .failure(let err):
                    self.error = err
                }
            }
        }
    }
}

@MainActor
final class NewEventTypeViewModel: ObservableObject {
    @Published var title: String = ""
    @Published var description: String = ""
    @Published var duration: String = "30"
    @Published var slug: String = ""
    @Published var isSaving = false
    @Published var error: DomainError?
    @Published var didSave = false

    private let createUseCase: CreateEventTypeUseCase

    init(createUseCase: CreateEventTypeUseCase = CreateEventTypeUseCase(repository: EventTypeRepositoryImpl())) {
        self.createUseCase = createUseCase
    }

    func save() {
        guard !title.isEmpty, !slug.isEmpty, let durationInt = Int(duration) else {
            error = .validation(message: "Titel, Dauer und Slug sind erforderlich.")
            return
        }

        isSaving = true
        error = nil

        Task {
            let result = await createUseCase.execute(
                title: title,
                description: description.isEmpty ? nil : description,
                duration: durationInt,
                slug: slug
            )
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

