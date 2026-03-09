import Foundation

struct AvailabilitySlot: Codable, Identifiable {
    let id = UUID()
    let startTime: Date
}

