/**
 * Bax Android Native (Kotlin + Jetpack Compose)
 * In-App Auto-Updater Specification (Zero-Prompt Background Detection)
 * Target SDK: 35 | Kotlin 2.0+ | Coroutines & StateFlow
 */

package ir.dbax.app.feature.updater

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.core.content.FileProvider
import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.File
import java.net.HttpURLConnection
import java.net.URL

// 1. Data Model
data class UpdateInfo(
    val hasUpdate: Boolean = false,
    val latestVersion: String = "",
    val latestVersionCode: Int = 0,
    val currentVersion: String = "1.0.0-preview5",
    val currentVersionCode: Int = 5,
    val downloadUrl: String = "",
    val changelog: List<String> = emptyList(),
    val isAutoDetected: Boolean = true
)

// 2. Repository with Silent Background Fetch
object UpdateRepository {
    private const val VERSION_URL = "https://raw.githubusercontent.com/mehdi-fakhraei60/dbax-releases/main/version.json"

    suspend fun checkUpdateSilently(currentCode: Int, currentVer: String): UpdateInfo = withContext(Dispatchers.IO) {
        try {
            val url = URL(VERSION_URL)
            val conn = (url.openConnection() as HttpURLConnection).apply {
                connectTimeout = 4000
                readTimeout = 4000
                requestMethod = "GET"
            }
            if (conn.responseCode == 200) {
                val jsonStr = conn.inputStream.bufferedReader().use { it.readText() }
                val json = JSONObject(jsonStr)
                val latestCode = json.optInt("versionCode", 6)
                val latestVer = json.optString("latestVersion", "1.0.0-preview6")
                val artifacts = json.optJSONObject("artifacts")?.optJSONObject("customer")
                val downloadUrl = artifacts?.optJSONObject("universal")?.optString("url") ?: ""
                
                val changelogArr = json.optJSONArray("changelog")
                val changelogList = mutableListOf<String>()
                if (changelogArr != null) {
                    for (i in 0 until changelogArr.length()) {
                        changelogList.add(changelogArr.getString(i))
                    }
                }

                return@withContext UpdateInfo(
                    hasUpdate = latestCode > currentCode,
                    latestVersion = latestVer,
                    latestVersionCode = latestCode,
                    currentVersion = currentVer,
                    currentVersionCode = currentCode,
                    downloadUrl = downloadUrl,
                    changelog = changelogList,
                    isAutoDetected = true
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return@withContext UpdateInfo(hasUpdate = false, currentVersion = currentVer)
    }
}

// 3. ViewModel with Auto-check on launch
class AccountViewModel(
    private val appContext: Context,
    private val currentVersionCode: Int = 5,
    private val currentVersionName: String = "1.0.0-preview5"
) {
    private val _updateState = MutableStateFlow(UpdateInfo(currentVersion = currentVersionName))
    val updateState: StateFlow<UpdateInfo> = _updateState.asStateFlow()

    suspend fun autoCheckOnLaunch() {
        val result = UpdateRepository.checkUpdateSilently(currentVersionCode, currentVersionName)
        _updateState.value = result
    }

    fun triggerDirectInstall(apkFile: File) {
        val uri: Uri = FileProvider.getUriForFile(
            appContext,
            "${appContext.packageName}.fileprovider",
            apkFile
        )
        val installIntent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(uri, "application/vnd.android.package-archive")
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        appContext.startActivity(installIntent)
    }
}

// 4. Jetpack Compose UI: C38 Account Auto-Updater CTA
@Composable
fun AccountUpdaterCta(
    updateInfo: UpdateInfo,
    isDownloading: Boolean,
    downloadProgress: Int,
    onStartDownloadAndInstall: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (updateInfo.hasUpdate) {
        // Glowing Amber Container with Zero-Prompt Direct 1-Tap CTA
        Card(
            modifier = modifier
                .fillMaxWidth()
                .border(2.dp, Color(0xFFF59E0B), RoundedCornerShape(20.dp)),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1B4B))
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "⚡ نسخه جدید شناسایی شد!",
                        color = Color.White,
                        fontSize = 13.sp,
                        style = MaterialTheme.typography.titleSmall
                    )
                    Badge(containerColor = Color(0xFFF59E0B)) {
                        Text("v${updateInfo.latestVersion}", color = Color.Black, fontSize = 10.sp)
                    }
                }

                Text(
                    text = "شناسایی خودکار در پس‌زمینه • آماده دریافت و نصب مستقیم",
                    color = Color(0xFFCBD5E1),
                    fontSize = 11.sp
                )

                // 1-Tap Direct Install Action
                Button(
                    onClick = onStartDownloadAndInstall,
                    enabled = !isDownloading,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4F46E5))
                ) {
                    Text(
                        if (isDownloading) "در حال دریافت ($downloadProgress٪)..."
                        else "⚡ نصب مستقیم نسخه ${updateInfo.latestVersion}",
                        fontSize = 12.sp,
                        color = Color.White
                    )
                }
            }
        }
    } else {
        // Up-to-date State
        Card(
            modifier = modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "✓ نسخه شما به‌روز است (${updateInfo.currentVersion})",
                    color = Color(0xFF34D399),
                    fontSize = 12.sp
                )
            }
        }
    }
}
