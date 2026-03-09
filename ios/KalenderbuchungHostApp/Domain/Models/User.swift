import Foundation

struct User: Codable, Identifiable {
    let id: String
    let email: String
    let username: String?
    let name: String?
}

