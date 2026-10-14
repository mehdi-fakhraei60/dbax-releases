export interface FreightVehicleOption {
  id: 'bike_box' | 'pickup_pride' | 'pickup_peugeot' | 'nissan_heavy' | 'truck_closed';
  titleFa: string;
  subtitleFa: string;
  capacityFa: string;
  dimensionsFa: string;
  baseFareToman: number;
  perKmRateToman: number;
  iconType: 'bike' | 'pickup' | 'truck';
  popularForFa: string;
}

export interface FreightAddonService {
  id: 'helper_worker' | 'stairs_floor' | 'bubble_wrap' | 'waterproof_tarp';
  titleFa: string;
  descriptionFa: string;
  unitPriceToman: number;
  selected: boolean;
  quantity?: number;
}

export class FreightFleetAdapter {
  public static getVehicleOptions(): FreightVehicleOption[] {
    return [
      {
        id: 'bike_box',
        titleFa: 'موتور باکس‌دار استاندارد',
        subtitleFa: 'مرسولات خرد، پاکت، غذا، دارو و کارتن‌های سبک',
        capacityFa: 'حداکثر ۲۵ کیلوگرم',
        dimensionsFa: '۴۵ × ۴۵ × ۵۰ سانتی‌متر',
        baseFareToman: 38000,
        perKmRateToman: 3500,
        iconType: 'bike',
        popularForFa: 'بسته‌های اداری، فروشگاهی و شخصی',
      },
      {
        id: 'pickup_pride',
        titleFa: 'وانت پراید بار سبک',
        subtitleFa: 'کارتن‌های متوسط، کالای الکترونیک، تا ۳۵۰ کیلوگرم',
        capacityFa: 'حداکثر ۴۰۰ کیلوگرم',
        dimensionsFa: '۱.۴ × ۱.۲ × ۰.۹ متر',
        baseFareToman: 95000,
        perKmRateToman: 8500,
        iconType: 'pickup',
        popularForFa: 'خرده بار شهری و قطعات صنعتی متوسط',
      },
      {
        id: 'pickup_peugeot',
        titleFa: 'وانت آریسان / پیکان بار مسقف یا کفی',
        subtitleFa: 'لوازم خانگی سبک، چندین کارتن بزرگ، مصالح تا ۸۰۰ کیلو',
        capacityFa: 'حداکثر ۸۰۰ کیلوگرم',
        dimensionsFa: '۱.۸ × ۱.۴ × ۱.۲ متر',
        baseFareToman: 135000,
        perKmRateToman: 11000,
        iconType: 'pickup',
        popularForFa: 'لوازم خانگی و پخش عمده کارتن',
      },
      {
        id: 'nissan_heavy',
        titleFa: 'نیسان بار پرقدرت',
        subtitleFa: 'بارهای فوق‌العاده سنگین شهری، تجهیزات کارگاهی تا ۲ تن',
        capacityFa: 'حداکثر ۲۲۰۰ کیلوگرم',
        dimensionsFa: '۲.۲ × ۱.۶ × ۱.۳ متر',
        baseFareToman: 195000,
        perKmRateToman: 16000,
        iconType: 'truck',
        popularForFa: 'بارهای بسیار سنگین و تجهیزات سنگین',
      },
      {
        id: 'truck_closed',
        titleFa: 'خاور و ایسوزو مسقف موکت‌دار',
        subtitleFa: 'اسباب‌کشی منازل، دفاتر شرکت‌ها و مبلمان حساس',
        capacityFa: 'حداکثر ۴۵۰۰ کیلوگرم',
        dimensionsFa: '۵.۲ × ۲.۲ × ۲.۴ متر',
        baseFareToman: 420000,
        perKmRateToman: 28000,
        iconType: 'truck',
        popularForFa: 'اثاثیه منزل، مبلمان و بارهای لوکس',
      },
    ];
  }

  public static getDefaultAddons(): FreightAddonService[] {
    return [
      {
        id: 'helper_worker',
        titleFa: 'کارگر کمکی جهت بارگیری و تخلیه',
        descriptionFa: 'حضور ۱ یا چند کارگر ورزیده و مجرب در کنار راننده',
        unitPriceToman: 120000,
        selected: false,
        quantity: 1,
      },
      {
        id: 'stairs_floor',
        titleFa: 'حمل در طبقات بدون آسانسور',
        descriptionFa: 'محاسبه به ازای هر طبقه پله برای بارهای نیمه‌سنگین',
        unitPriceToman: 35000,
        selected: false,
        quantity: 2,
      },
      {
        id: 'bubble_wrap',
        titleFa: 'بسته‌بندی ضربه‌گیر حباب‌دار (Bubble Wrap)',
        descriptionFa: 'پوشش محافظ دولایه برای شکستنی‌ها و مانیتورها',
        unitPriceToman: 45000,
        selected: false,
        quantity: 1,
      },
      {
        id: 'waterproof_tarp',
        titleFa: 'چادر ضدآب و باربند مخصوص روزهای بارانی',
        descriptionFa: 'تضمین سلامت کالا در برابر رطوبت و گرد و خاک',
        unitPriceToman: 25000,
        selected: false,
        quantity: 1,
      },
    ];
  }

  public static calculateFreightFare(
    vehicleId: FreightVehicleOption['id'],
    distanceKm: number,
    selectedAddons: FreightAddonService[]
  ): {
    baseFare: number;
    distanceFare: number;
    addonsTotal: number;
    totalFreightFare: number;
  } {
    const vehicle = this.getVehicleOptions().find(v => v.id === vehicleId) || this.getVehicleOptions()[0];
    const baseFare = vehicle.baseFareToman;
    const distanceFare = Math.round(distanceKm * vehicle.perKmRateToman);
    const addonsTotal = selectedAddons
      .filter(a => a.selected)
      .reduce((sum, a) => sum + a.unitPriceToman * (a.quantity || 1), 0);
    const totalFreightFare = baseFare + distanceFare + addonsTotal;

    return {
      baseFare,
      distanceFare,
      addonsTotal,
      totalFreightFare,
    };
  }
}
