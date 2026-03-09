package de.kalenderbuchung.ui.screens

import android.annotation.SuppressLint
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import de.kalenderbuchung.core.AppConfig

@Composable
fun LoginScreen(
    onLoginSuccess: () -> Unit
) {
    val showWebView = remember { mutableStateOf(false) }
    val loading = remember { mutableStateOf(false) }

    Scaffold { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            if (!showWebView.value) {
                Button(onClick = { showWebView.value = true }) {
                    Text("Mit Google anmelden")
                }
            } else {
                LoginWebView(
                    loading = loading,
                    onLoginSuccess = onLoginSuccess
                )
                if (loading.value) {
                    CircularProgressIndicator()
                }
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
private fun LoginWebView(
    loading: MutableState<Boolean>,
    onLoginSuccess: () -> Unit
) {
    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                settings.javaScriptEnabled = true
                loading.value = true
                webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        view: WebView?,
                        request: WebResourceRequest?
                    ): Boolean {
                        val url = request?.url?.toString().orEmpty()
                        if (url.contains(AppConfig.AUTH_SUCCESS_PATH)) {
                            onLoginSuccess()
                            return true
                        }
                        return false
                    }

                    override fun onPageFinished(view: WebView?, url: String?) {
                        loading.value = false
                    }
                }
                loadUrl("${AppConfig.BACKEND_BASE_URL}/api/auth/signin")
            }
        }
    )
}

