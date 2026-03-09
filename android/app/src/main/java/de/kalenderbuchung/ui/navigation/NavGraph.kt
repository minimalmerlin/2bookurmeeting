package de.kalenderbuchung.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import de.kalenderbuchung.ui.screens.AvailabilityScreen
import de.kalenderbuchung.ui.screens.DashboardScreen
import de.kalenderbuchung.ui.screens.LoginScreen

sealed class Screen(val route: String) {
    data object Login : Screen("login")
    data object Dashboard : Screen("dashboard")
    data object Availability : Screen("availability")
}

@Composable
fun AppNavHost() {
    val navController = rememberNavController()
    val isAuthenticatedState = remember { mutableStateOf(false) }

    NavHost(
        navController = navController,
        startDestination = if (isAuthenticatedState.value) Screen.Dashboard.route else Screen.Login.route
    ) {
        composable(Screen.Login.route) {
            LoginScreen(
                onLoginSuccess = {
                    isAuthenticatedState.value = true
                    navController.navigate(Screen.Dashboard.route) {
                        popUpTo(Screen.Login.route) {
                            inclusive = true
                        }
                    }
                }
            )
        }
        composable(Screen.Dashboard.route) {
            DashboardScreen(
                onOpenAvailability = {
                    navController.navigate(Screen.Availability.route)
                }
            )
        }
        composable(Screen.Availability.route) {
            AvailabilityScreen(
                onBack = { navController.popBackStack() }
            )
        }
    }
}

