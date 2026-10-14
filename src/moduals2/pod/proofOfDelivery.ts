export interface ProofOfDeliveryRecord {
  orderId: string;
  recipientName: string;
  recipientPhone: string;
  deliveredAt: string;
  destinationAddress: string;
  signatureSvgData?: string;
  photoDataUrl?: string;
  securityCodeConfirmed: boolean;
  courierName: string;
  geoSeal: {
    lat: number;
    lng: number;
    accuracyMeters: number;
  };
}

export class ProofOfDeliveryAdapter {
  /**
   * Generates a sample confirmed PoD record
   */
  public static createRecord(params: Partial<ProofOfDeliveryRecord>): ProofOfDeliveryRecord {
    return {
      orderId: params.orderId || `BX-${Math.floor(100000 + Math.random() * 900000)}`,
      recipientName: params.recipientName || 'سعید رضوانی',
      recipientPhone: params.recipientPhone || '۰۹۱۲۹۹۸۸۷۷۶',
      deliveredAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      destinationAddress: params.destinationAddress || 'تهران، سعادت‌آباد، بلوار فرهنگ، پلاک ۸',
      securityCodeConfirmed: true,
      courierName: params.courierName || 'علی محمدی (سفیر کد ۲۱۰۴)',
      photoDataUrl: params.photoDataUrl || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80',
      geoSeal: {
        lat: 35.7878,
        lng: 51.3732,
        accuracyMeters: 4.5,
      },
      ...params,
    };
  }
}
