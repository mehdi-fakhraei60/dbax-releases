export interface BulkOrderItem {
  rowId: number;
  recipientName: string;
  recipientPhone: string;
  address: string;
  districtFa: string;
  packageType: string;
  weightKg: number;
  declaredValueToman: number;
  codAmountToman?: number;
  deliveryWindow: string;
  status: 'valid' | 'warning' | 'error';
  errorMessage?: string;
  assignedTrackingCode?: string;
}

export interface BulkBatchSummary {
  batchId: string;
  batchName: string;
  createdAt: string;
  totalOrders: number;
  validOrders: number;
  totalEstimatedDistanceKm: number;
  totalFreightCostToman: number;
  totalCodCollectionToman: number;
  status: 'draft' | 'dispatching' | 'completed';
}

export class BulkDispatchAdapter {
  public static getSampleBatch(): BulkOrderItem[] {
    return [
      {
        rowId: 1,
        recipientName: 'خانم علیزاده (دفتر میرداماد)',
        recipientPhone: '09121112233',
        address: 'تهران، میرداماد، میدان مادر، مجتمع پایتخت، طبقه ۳ واحد ۱۲',
        districtFa: 'میرداماد (منطقه ۳)',
        packageType: 'پاکت اسناد تجاری',
        weightKg: 0.5,
        declaredValueToman: 5000000,
        codAmountToman: 0,
        deliveryWindow: '۱۰:۰۰ تا ۱۲:۰۰',
        status: 'valid',
        assignedTrackingCode: 'BX-BLK-101',
      },
      {
        rowId: 2,
        recipientName: 'آقای رمضانی (فروشگاه انقلاب)',
        recipientPhone: '09359876543',
        address: 'تهران، خیابان انقلاب، نبش ابوریحان، پاساژ دانشجو، پلاک ۵',
        districtFa: 'انقلاب (منطقه ۱۱)',
        packageType: 'بسته حاوی قطعات لپ‌تاپ',
        weightKg: 2.3,
        declaredValueToman: 18000000,
        codAmountToman: 2450000,
        deliveryWindow: '۱۲:۰۰ تا ۱۴:۰۰',
        status: 'valid',
        assignedTrackingCode: 'BX-BLK-102',
      },
      {
        rowId: 3,
        recipientName: 'مهندس کاظمی (انبار غرب)',
        recipientPhone: '09194561234',
        address: 'تهران، بزرگراه ستاری شمال، بلوار کبیری طامه، کوچه بنفشه، پلاک ۱۸',
        districtFa: 'پونک (منطقه ۵)',
        packageType: 'کارتن لوازم اداری',
        weightKg: 4.8,
        declaredValueToman: 8500000,
        codAmountToman: 1100000,
        deliveryWindow: '۱۴:۰۰ تا ۱۶:۰۰',
        status: 'valid',
        assignedTrackingCode: 'BX-BLK-103',
      },
      {
        rowId: 4,
        recipientName: 'شرکت نوآوران پارس (شعبه شریعتی)',
        recipientPhone: '09028887766',
        address: 'تهران، خیابان شریعتی، بالاتر از سیدخندان، کوچه بسطامی، پلاک ۲',
        districtFa: 'سیدخندان (منطقه ۷)',
        packageType: 'بسته نمونه محصول دارویی',
        weightKg: 1.2,
        declaredValueToman: 12000000,
        codAmountToman: 0,
        deliveryWindow: '۱۶:۰۰ تا ۱۸:۰۰',
        status: 'valid',
        assignedTrackingCode: 'BX-BLK-104',
      },
    ];
  }

  public static calculateBatchSummary(items: BulkOrderItem[]): BulkBatchSummary {
    const totalOrders = items.length;
    const validOrders = items.filter(i => i.status === 'valid').length;
    // Base batch pricing discount: 15% off regular rates for bulk customers
    const avgDistancePerDrop = 7.5;
    const totalEstimatedDistanceKm = Math.round(totalOrders * avgDistancePerDrop);
    const baseCostPerOrder = 45000;
    const bulkDiscountRate = 0.85;
    const totalFreightCostToman = Math.round(validOrders * baseCostPerOrder * bulkDiscountRate);
    const totalCodCollectionToman = items.reduce((acc, curr) => acc + (curr.codAmountToman || 0), 0);

    return {
      batchId: `BATCH-${Date.now().toString().slice(-6)}`,
      batchName: 'بسته ارسال گروهی سفارش‌های فروشگاه اینترنتی',
      createdAt: new Date().toLocaleDateString('fa-IR'),
      totalOrders,
      validOrders,
      totalEstimatedDistanceKm,
      totalFreightCostToman,
      totalCodCollectionToman,
      status: 'draft',
    };
  }

  public static generateCsvTemplate(): string {
    return `شماره ردیف,نام تحویل‌گیرنده,شماره همراه,آدرس پستی کامل,منطقه,نوع مرسوله,وزن تقریبی (کیلوگرم),ارزش کالا (تومان),مبلغ وجه دریافتی در محل COD (تومان),بازه زمانی تحویل
1,خانم علیزاده,09121112233,تهران میرداماد میدان مادر مجتمع پایتخت واحد ۱۲,منطقه ۳,پاکت اسناد,0.5,5000000,0,۱۰:۰۰ تا ۱۲:۰۰
2,آقای رمضانی,09359876543,تهران خیابان انقلاب پاساژ دانشجو پلاک ۵,منطقه ۱۱,قطعات الکترونیک,2.0,18000000,2450000,۱۲:۰۰ تا ۱۴:۰۰
3,مهندس کاظمی,09194561234,تهران بزرگراه ستاری بلوار کبیری کوچه بنفشه پلاک ۱۸,منطقه ۵,لوازم اداری,4.5,8500000,1100000,۱۴:۰۰ تا ۱۶:۰۰`;
  }
}
