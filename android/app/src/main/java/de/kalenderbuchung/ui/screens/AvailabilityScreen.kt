package de.kalenderbuchung.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import de.kalenderbuchung.core.ServiceLocator
import de.kalenderbuchung.data.remote.dto.WorkingHoursEntryDto
import kotlinx.coroutines.launch

@Composable
fun AvailabilityScreen(
    onBack: () -> Unit
) {
    val context = LocalContext.current
    val repo = remember { ServiceLocator.getSettingsRepository(context) }
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    // Vereinfachung: wir arbeiten mit einem festen User-Kontext (später aus Session ableiten)
    val userId = remember { mutableStateOf("me") }

    // State für Montag–Freitag
    val hoursState = remember {
        mutableStateOf(
            (1..5).map { day ->
                day to ("09:00" to "17:00")
            }.toMap()
        )
    }

    LaunchedEffect(Unit) {
        // TODO: vorhandene WorkingHours aus DB laden, sobald User-Kontext vorhanden ist
    }

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Text("Arbeitszeiten (Host)")

            (1..5).forEach { day ->
                val (start, end) = hoursState.value[day] ?: ("09:00" to "17:00")
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(labelForDay(day), modifier = Modifier.weight(1f))
                    OutlinedTextField(
                        value = start,
                        onValueChange = { new ->
                            hoursState.value = hoursState.value.toMutableMap().apply {
                                this[day] = new to end
                            }
                        },
                        modifier = Modifier.weight(1f),
                        label = { Text("Start") }
                    )
                    OutlinedTextField(
                        value = end,
                        onValueChange = { new ->
                            hoursState.value = hoursState.value.toMutableMap().apply {
                                this[day] = start to new
                            }
                        },
                        modifier = Modifier.weight(1f),
                        label = { Text("Ende") }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = onBack) {
                    Text("Zurück")
                }
                Button(onClick = {
                    scope.launch {
                        val hours = hoursState.value.entries.map { (day, times) ->
                            WorkingHoursEntryDto(
                                day = day,
                                start = times.first,
                                end = times.second
                            )
                        }

                        val result = repo.setWorkingHoursOnlineOrQueue(
                            userId = userId.value,
                            hours = hours
                        )
                        if (result.isSuccess) {
                            snackbarHostState.showSnackbar("Arbeitszeiten gespeichert")
                        } else {
                            snackbarHostState.showSnackbar("Speichern fehlgeschlagen – wird synchronisiert, sobald Online")
                        }
                    }
                }) {
                    Text("Speichern")
                }
            }
        }
    }
}

private fun labelForDay(day: Int): String = when (day) {
    1 -> "Montag"
    2 -> "Dienstag"
    3 -> "Mittwoch"
    4 -> "Donnerstag"
    5 -> "Freitag"
    6 -> "Samstag"
    0 -> "Sonntag"
    else -> "Tag $day"
}

