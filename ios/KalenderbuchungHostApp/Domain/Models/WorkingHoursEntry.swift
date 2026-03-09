import Foundation

struct WorkingHoursEntry: Codable, Identifiable {
    let id = UUID()
    var day: Int
    var start: String
    var end: String
}

