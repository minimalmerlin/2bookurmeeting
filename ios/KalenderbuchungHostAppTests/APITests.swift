import XCTest
@testable import KalenderbuchungHostApp

final class APITests: XCTestCase {
    func testDomainErrorEquatable() {
        XCTAssertEqual(DomainError.network, DomainError.network)
        XCTAssertNotEqual(DomainError.network, DomainError.unauthorized)
    }
}

