import SwiftUI

struct DashboardView: View {
    var body: some View {
        List {
            Section("Event-Typen") {
                NavigationLink("Event-Typen verwalten") {
                    EventTypesListView()
                }
            }

            Section("Verfügbarkeit") {
                NavigationLink("Arbeitszeiten bearbeiten") {
                    AvailabilityView()
                }
            }

            Section("Einstellungen") {
                NavigationLink("Profil & Username") {
                    SettingsView()
                }
            }
        }
        .navigationTitle("Dashboard")
    }
}

