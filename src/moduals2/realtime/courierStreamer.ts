export interface CourierGeoPoint {
  id: string;
  nameFa: string;
  vehiclePlate: string;
  vehicleType: 'box_bike' | 'regular_bike' | 'pickup_van';
  lat: number;
  lng: number;
  bearingDegrees: number;
  speedKmh: number;
  rating: number;
  isOnline: boolean;
  distanceFromUserKm: number;
}

export class CourierStreamer {
  private static mockCouriers: CourierGeoPoint[] = [
    {
      id: 'drv-1',
      nameFa: 'علیرضا ر.',
      vehiclePlate: '۱۲۳ - ۷۸ ب ۹۹',
      vehicleType: 'box_bike',
      lat: 35.7025,
      lng: 51.3935,
      bearingDegrees: 45,
      speedKmh: 28,
      rating: 4.9,
      isOnline: true,
      distanceFromUserKm: 0.4,
    },
    {
      id: 'drv-2',
      nameFa: 'محمد ک.',
      vehiclePlate: '۴۵۶ - ۱۲ ج ۱۱',
      vehicleType: 'regular_bike',
      lat: 35.6985,
      lng: 51.3892,
      bearingDegrees: 180,
      speedKmh: 35,
      rating: 4.8,
      isOnline: true,
      distanceFromUserKm: 0.9,
    },
    {
      id: 'drv-3',
      nameFa: 'حسین م.',
      vehiclePlate: '۷۸۹ - ۵۵ د ۳۳',
      vehicleType: 'box_bike',
      lat: 35.7052,
      lng: 51.3985,
      bearingDegrees: 90,
      speedKmh: 22,
      rating: 5.0,
      isOnline: true,
      distanceFromUserKm: 1.2,
    },
    {
      id: 'drv-4',
      nameFa: 'رضا س.',
      vehiclePlate: '۳۲۱ - ۹۰ س ۴۴',
      vehicleType: 'pickup_van',
      lat: 35.712,
      lng: 51.405,
      bearingDegrees: 270,
      speedKmh: 40,
      rating: 4.7,
      isOnline: true,
      distanceFromUserKm: 2.1,
    },
  ];

  static findNearbyCouriers(userLat: number, userLng: number, radiusKm = 2.5): CourierGeoPoint[] {
    return this.mockCouriers.filter((c) => c.distanceFromUserKm <= radiusKm);
  }

  static subscribeToLiveMovement(
    courierId: string,
    callback: (point: { lat: number; lng: number; bearing: number; etaMinutes: number }) => void
  ): () => void {
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const t = (step % 50) / 50;
      const lat = 35.7005 + t * (35.7878 - 35.7005);
      const lng = 51.3912 + t * (51.3732 - 51.3912);
      const eta = Math.max(1, Math.round(18 * (1 - t)));
      callback({
        lat,
        lng,
        bearing: 350 + Math.sin(t * Math.PI) * 20,
        etaMinutes: eta,
      });
    }, 1500);

    return () => clearInterval(interval);
  }
}
