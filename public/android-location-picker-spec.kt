/**
 * Bax Android Native (Kotlin + Jetpack Compose)
 * Screen C05/C06: Two-Stage Sequential Location Picker Specification
 * Flow: Step 1 (Pickup + Sender Only) -> Step 2 (Destination + Recipient Only) -> Complete
 */

package ir.dbax.app.feature.order.location

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Place
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

// 1. Order Step State
enum class OrderLocationStep {
    PICKUP_SENDER,       // مرحله اول: صرفاً مبدأ و فرستنده (گیرنده کاملاً پنهان)
    DESTINATION_RECIPIENT // مرحله دوم: تعیین مقصد و مشخصات گیرنده
}

// 2. Data Models
data class LocationPoint(
    val lat: Double = 35.6892,
    val lng: Double = 51.3890,
    val title: String = "تهران",
    val fullAddress: String = "در حال بارگذاری نشانی..."
)

data class OrderSenderInfo(
    val name: String = "",
    val phone: String = "",
    val unitNotes: String = ""
)

data class OrderRecipientInfo(
    val name: String = "",
    val phone: String = "",
    val unitNotes: String = ""
)

// 3. Two-Stage Compose UI
@Composable
fun TwoStageLocationPickerScreen(
    onConfirmRouteAndProceed: (pickup: LocationPoint, sender: OrderSenderInfo, dest: LocationPoint, recipient: OrderRecipientInfo) -> Unit,
    modifier: Modifier = Modifier
) {
    var currentStep by remember { mutableStateOf(OrderLocationStep.PICKUP_SENDER) }

    // Pickup State
    var pickupLocation by remember { mutableStateOf(LocationPoint(title = "میدان آزادی", fullAddress = "تهران، میدان آزادی، ضلع شمال غربی")) }
    var senderInfo by remember { mutableStateOf(OrderSenderInfo(name = "مهدی فخرایی", phone = "09121234567", unitNotes = "پلاک ۱۲، واحد ۴")) }

    // Destination State
    var destinationLocation by remember { mutableStateOf(LocationPoint(lat = 35.7878, lng = 51.3732, title = "سعادت‌آباد", fullAddress = "تهران، سعادت‌آباد، میدان کاج")) }
    var recipientInfo by remember { mutableStateOf(OrderRecipientInfo(name = "", phone = "", unitNotes = "")) }

    Box(modifier = modifier.fillMaxSize().background(Color(0xFF020617))) {
        // [NESHAN MAP VIEWPORT HERE]
        // Live Neshan Map with dynamic Center Pin (Green for Pickup, Red for Destination)
        Box(modifier = Modifier.fillMaxSize()) {
            Text(
                text = if (currentStep == OrderLocationStep.PICKUP_SENDER) "نقشه نشان: پین مبدأ" else "نقشه نشان: پین مقصد",
                color = Color.Gray,
                modifier = Modifier.align(Alignment.Center)
            )
        }

        // Top Step Indicator Pill
        Row(
            modifier = Modifier
                .align(Alignment.TopCenter)
                .padding(top = 48.dp, start = 16.dp, end = 16.dp)
                .fillMaxWidth()
                .background(Color(0xFF0F172A).copy(alpha = 0.95f), RoundedCornerShape(16.dp))
                .border(1.dp, Color(0xFF334155), RoundedCornerShape(16.dp))
                .padding(horizontal = 14.dp, vertical = 10.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = if (currentStep == OrderLocationStep.PICKUP_SENDER)
                        "مرحله ۱ از ۲: تعیین مبدأ و فرستنده"
                    else
                        "مرحله ۲ از ۲: تعیین مقصد و گیرنده",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = Color.White
                )
                Text(
                    text = if (currentStep == OrderLocationStep.PICKUP_SENDER)
                        "پین را روی موقعیت فرستنده تنظیم کنید"
                    else
                        "پین را روی مقصد تحویل بار تنظیم کنید",
                    fontSize = 11.sp,
                    color = Color(0xFF94A3B8)
                )
            }

            // Quick Swap Button (Available in Destination Step)
            if (currentStep == OrderLocationStep.DESTINATION_RECIPIENT) {
                OutlinedButton(
                    onClick = {
                        val tempLoc = pickupLocation
                        pickupLocation = destinationLocation
                        destinationLocation = tempLoc
                    },
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF818CF8))
                ) {
                    Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("جابجایی ⇄", fontSize = 11.sp)
                }
            }
        }

        // Bottom Form Drawer
        Card(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(16.dp)
                .fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A).copy(alpha = 0.98f)),
            border = CardDefaults.outlinedCardBorder().copy(brush = Brush.verticalGradient(listOf(Color(0xFF334155), Color(0xFF1E293B))))
        ) {
            Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                // Address Label
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        Icons.Default.Place,
                        contentDescription = null,
                        tint = if (currentStep == OrderLocationStep.PICKUP_SENDER) Color(0xFF34D399) else Color(0xFFF43F5E),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(
                        text = if (currentStep == OrderLocationStep.PICKUP_SENDER)
                            "آدرس مبدأ: ${pickupLocation.title}"
                        else
                            "آدرس مقصد: ${destinationLocation.title}",
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        fontSize = 13.sp
                    )
                }
                Text(
                    text = if (currentStep == OrderLocationStep.PICKUP_SENDER) pickupLocation.fullAddress else destinationLocation.fullAddress,
                    fontSize = 11.sp,
                    color = Color(0xFFCBD5E1),
                    maxLines = 2
                )

                // STAGE 1: SENDER FORM ONLY
                AnimatedVisibility(visible = currentStep == OrderLocationStep.PICKUP_SENDER, enter = fadeIn(), exit = fadeOut()) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("مشخصات فرستنده:", fontWeight = FontWeight.SemiBold, fontSize = 11.sp, color = Color(0xFF34D399))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = senderInfo.name,
                                onValueChange = { senderInfo = senderInfo.copy(name = it) },
                                placeholder = { Text("نام فرستنده", fontSize = 11.sp) },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp)
                            )
                            OutlinedTextField(
                                value = senderInfo.phone,
                                onValueChange = { senderInfo = senderInfo.copy(phone = it) },
                                placeholder = { Text("موبایل فرستنده", fontSize = 11.sp) },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp)
                            )
                        }
                        OutlinedTextField(
                            value = senderInfo.unitNotes,
                            onValueChange = { senderInfo = senderInfo.copy(unitNotes = it) },
                            placeholder = { Text("پلاک و واحد مبدأ (مثلاً: پلاک ۱۲، واحد ۴)", fontSize = 11.sp),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        }

                        Button(
                            onClick = { currentStep = OrderLocationStep.DESTINATION_RECIPIENT },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF059669))
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("تایید مبدأ و فرستنده ⬅️ مرحله ۲: مقصد و گیرنده", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }

                // STAGE 2: RECIPIENT FORM ONLY
                AnimatedVisibility(visible = currentStep == OrderLocationStep.DESTINATION_RECIPIENT, enter = fadeIn(), exit = fadeOut()) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("مشخصات گیرنده:", fontWeight = FontWeight.SemiBold, fontSize = 11.sp, color = Color(0xFFF43F5E))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            OutlinedTextField(
                                value = recipientInfo.name,
                                onValueChange = { recipientInfo = recipientInfo.copy(name = it) },
                                placeholder = { Text("نام گیرنده", fontSize = 11.sp) },
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp)
                            )
                            OutlinedTextField(
                                value = recipientInfo.phone,
                                onValueChange = { recipientInfo = recipientInfo.copy(phone = it) },
                                placeholder = { Text("موبایل گیرنده", fontSize = 11.sp) },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                                modifier = Modifier.weight(1f),
                                shape = RoundedCornerShape(12.dp)
                            )
                        }
                        OutlinedTextField(
                            value = recipientInfo.unitNotes,
                            onValueChange = { recipientInfo = recipientInfo.copy(unitNotes = it) },
                            placeholder = { Text("پلاک و واحد مقصد (مثلاً: پلاک ۸، زنگ ۲)", fontSize = 11.sp),
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp)
                        }

                        Button(
                            onClick = {
                                onConfirmRouteAndProceed(pickupLocation, senderInfo, destinationLocation, recipientInfo)
                            },
                            modifier = Modifier.fillMaxWidth().height(48.dp),
                            shape = RoundedCornerShape(14.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4F46E5))
                        ) {
                            Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(Modifier.width(6.dp))
                            Text("تایید نهایی مقصد و گیرنده ⬅️ انتخاب ناوگان", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}
