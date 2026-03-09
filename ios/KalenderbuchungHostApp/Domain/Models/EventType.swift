import Foundation

struct EventType: Codable, Identifiable {
    let id: String
    let title: String
    let description: String?
    let duration: Int
    let slug: String
}

