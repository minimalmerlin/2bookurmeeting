import Foundation

enum DomainError: Error, Equatable {
    case network
    case unauthorized
    case validation(message: String?)
    case notFound
    case conflict(message: String?)
    case server
    case decoding
    case unknown
}

