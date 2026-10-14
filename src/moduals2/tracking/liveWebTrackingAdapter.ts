export interface LiveTrackingTelemetry {
  trackingCode: string;
  shareableUrl: string;
  recipientName: string;
  recipientPhone: string;
  senderName: string;
  courierNameFa: string;
  courierPhone: string;
  vehiclePlateFa: string;
  vehicleTypeFa: string;
  currentStatusFa: string;
  currentStatusKey: 'dispatched' | 'at_pickup' | 'in_transit' | 'approaching' | 'delivered';
  currentLocation: {
    lat: number;
    lng: number;
    addressFa: string;
  };
  destinationLocation: {
    lat: number;
    lng: number;
    addressFa: string;
  };
  estimatedMinutesToArrival: number;
  courierSpeedKmH: number;
  remainingDistanceKm: number;
  lastPingTimestamp: string;
}

export class LiveWebTrackingAdapter {
  public static generateTrackingLink(orderId: string = 'BX-88219'): LiveTrackingTelemetry {
    const cleanId = orderId.replace('#', '').trim();
    return {
      trackingCode: cleanId,
      shareableUrl: `https://track.bax.ir/live/${cleanId}`,
      recipientName: 'خانم علیزاده (گیرنده نهایی)',
      recipientPhone: '09121112233',
      senderName: 'فروشگاه آنلاین آوا',
      courierNameFa: 'سجاد رضایی',
      courierPhone: '09361234567',
      vehiclePlateFa: 'ایران ۱۱ - ۷۸۴ د ۵۲',
      vehicleTypeFa: 'موتورسیکلت هوندا ۱۲۵ باکس‌دار',
      currentStatusFa: 'سفیر در مسیر رسیدن به مقصد تحویل مرسوله است',
      currentStatusKey: 'in_transit',
      currentLocation: {
        lat: 35.7589,
        lng: 51.4287,
        addressFa: 'تهران، بزرگراه شهید همت شرق، خروجی گاندی',
      },
      destinationLocation: {
        lat: 35.7654,
        lng: 51.4367,
        addressFa: 'تهران، خیابان میرداماد، میدان مادر، مجتمع پایتخت، واحد ۱۲',
      },
      estimatedMinutesToArrival: 14,
      courierSpeedKmH: 38,
      remainingDistanceKm: 3.4,
      lastPingTimestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
  }

  public static formatSmsNotification(telemetry: LiveTrackingTelemetry): string {
    return `مشتری گرامی ${telemetry.recipientName}؛\nمرسوله شما از طرف "${telemetry.senderName}" تحویل سفیر باکس (${telemetry.courierNameFa}) گردید.\nمشاهده زنده مسیر سفیر روی نقشه بدون نیاز به نصب برنامه:\n${telemetry.shareableUrl}\nزمان تقریبی تحویل: حدود ${telemetry.estimatedMinutesToArrival} دقیقه دیگر`;
  }
}
