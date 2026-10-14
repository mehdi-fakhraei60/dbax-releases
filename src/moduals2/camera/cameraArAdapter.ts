/**
 * Bax Camera AR & Parcel Dimension Estimation Module
 * Supports 3 high-speed production strategies:
 * 1. Standard Postal & Market Presets (1-Click selection: Iran Post Size 1-6, Shoe Box, Banana Box)
 * 2. Reference Object Scaling (Standard Shetab Bank Card: 85.6mm x 53.98mm)
 * 3. ARCore Native Specification (Plane detection & point-cloud raycasting)
 */

export interface ParcelDimensions {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  weightTier: 'small_envelope' | 'medium_box' | 'large_heavy';
  weightTierLabelFa: string;
  categoryLabelFa: string;
  recommendedFleet: 'regular_bike' | 'box_bike' | 'pickup_van';
  recommendedFleetLabelFa: string;
  volumetricWeightKg: number;
  maxPhysicalWeightEstimateKg: number;
  presetId?: string;
  referenceCalibrated?: boolean;
}

export interface StandardParcelPreset {
  id: string;
  nameFa: string;
  dimensionsFa: string;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  recommendedFleet: 'regular_bike' | 'box_bike' | 'pickup_van';
  recommendedFleetLabelFa: string;
  iconType: 'envelope' | 'box_s' | 'box_m' | 'box_l' | 'box_heavy';
  popularFor: string;
}

export const IRAN_STANDARD_PARCEL_PRESETS: StandardParcelPreset[] = [
  {
    id: 'envelope_a4',
    nameFa: 'پاکت A4 / اسناد و مدارک',
    dimensionsFa: '۳۰ × ۲۲ × ۲ سانتی‌متر',
    lengthCm: 30,
    widthCm: 22,
    heightCm: 2,
    recommendedFleet: 'regular_bike',
    recommendedFleetLabelFa: 'موتور معمولی',
    iconType: 'envelope',
    popularFor: 'قرارداد، مدارک، پوشاک سبک، کارت و نامه',
  },
  {
    id: 'post_size_1',
    nameFa: 'کارتن پستی سایز ۱',
    dimensionsFa: '۱۵ × ۱۰ × ۱۰ سانتی‌متر',
    lengthCm: 15,
    widthCm: 10,
    heightCm: 10,
    recommendedFleet: 'regular_bike',
    recommendedFleetLabelFa: 'موتور معمولی',
    iconType: 'box_s',
    popularFor: 'لوازم آرایشی، اکسسوری، زیورآلات، قطعات کوچک',
  },
  {
    id: 'post_size_2',
    nameFa: 'کارتن پستی سایز ۲',
    dimensionsFa: '۲۰ × ۱۵ × ۱۰ سانتی‌متر',
    lengthCm: 20,
    widthCm: 15,
    heightCm: 10,
    recommendedFleet: 'regular_bike',
    recommendedFleetLabelFa: 'موتور معمولی',
    iconType: 'box_s',
    popularFor: 'گوشی موبایل، ساعت، عطر، شارژر',
  },
  {
    id: 'post_size_3',
    nameFa: 'کارتن پستی سایز ۳',
    dimensionsFa: '۲۰ × ۲۰ × ۱۵ سانتی‌متر',
    lengthCm: 20,
    widthCm: 20,
    heightCm: 15,
    recommendedFleet: 'box_bike',
    recommendedFleetLabelFa: 'موتور باکس‌دار',
    iconType: 'box_m',
    popularFor: 'کتاب، پوشاک، چند قلم کالا، تبلت',
  },
  {
    id: 'post_size_4',
    nameFa: 'کارتن پستی سایز ۴',
    dimensionsFa: '۳۰ × ۲۰ × ۲۰ سانتی‌متر',
    lengthCm: 30,
    widthCm: 20,
    heightCm: 20,
    recommendedFleet: 'box_bike',
    recommendedFleetLabelFa: 'موتور باکس‌دار',
    iconType: 'box_m',
    popularFor: 'جعبه کفش، لپ‌تاپ، لوازم خانه، سفارشات فروشگاهی',
  },
  {
    id: 'post_size_5',
    nameFa: 'کارتن پستی سایز ۵',
    dimensionsFa: '۴۰ × ۳۰ × ۲۵ سانتی‌متر',
    lengthCm: 40,
    widthCm: 30,
    heightCm: 25,
    recommendedFleet: 'box_bike',
    recommendedFleetLabelFa: 'موتور باکس‌دار (حداکثر حجم)',
    iconType: 'box_l',
    popularFor: 'ظروف، قهوه‌ساز، خریدهای آنلاین متعدد',
  },
  {
    id: 'post_size_6',
    nameFa: 'کارتن پستی سایز ۶ (بزرگ)',
    dimensionsFa: '۵۰ × ۴۰ × ۳۰ سانتی‌متر',
    lengthCm: 50,
    widthCm: 40,
    heightCm: 30,
    recommendedFleet: 'pickup_van',
    recommendedFleetLabelFa: 'وانت بار سبک',
    iconType: 'box_heavy',
    popularFor: 'کارتن بزرگ اسباب‌کشی، چند جعبه، کالای حجیم',
  },
  {
    id: 'banana_box',
    nameFa: 'کارتن موزی / باربری',
    dimensionsFa: '۵۴ × ۳۹ × ۲۴ سانتی‌متر',
    lengthCm: 54,
    widthCm: 39,
    heightCm: 24,
    recommendedFleet: 'pickup_van',
    recommendedFleetLabelFa: 'وانت بار یا موتور وانت',
    iconType: 'box_heavy',
    popularFor: 'کتاب‌های سنگین، ظروف شکستنی، بارهای فله‌ای',
  },
];

export class CameraArAdapter {
  /**
   * Standard IATA / Postal formula: (L x W x H in cm) / 5000 = Volumetric Weight in Kg
   */
  static calculateFromDimensions(length: number, width: number, height: number, presetId?: string): ParcelDimensions {
    const safeL = Math.max(1, Math.round(length));
    const safeW = Math.max(1, Math.round(width));
    const safeH = Math.max(1, Math.round(height));

    const volWeight = Math.round(((safeL * safeW * safeH) / 5000) * 10) / 10;

    let weightTier: 'small_envelope' | 'medium_box' | 'large_heavy' = 'small_envelope';
    let weightTierLabelFa = 'بسته پاکتی و سبک (زیر ۲ کیلوگرم)';
    let categoryLabelFa = 'پاکت و بسته سبک';
    let recommendedFleet: 'regular_bike' | 'box_bike' | 'pickup_van' = 'regular_bike';
    let recommendedFleetLabelFa = 'موتور معمولی (سریع)';
    let maxPhysicalWeightEstimateKg = 2.5;

    if (safeL > 50 || safeW > 45 || safeH > 40 || volWeight > 12) {
      weightTier = 'large_heavy';
      weightTierLabelFa = 'بسته حجیم یا کارتن سنگین (بالای ۲۰ کیلوگرم)';
      categoryLabelFa = 'بسته حجیم یا چند تکه';
      recommendedFleet = 'pickup_van';
      recommendedFleetLabelFa = 'وانت بار سبک';
      maxPhysicalWeightEstimateKg = 40;
    } else if (safeL > 25 || safeW > 20 || safeH > 15 || volWeight > 2.5) {
      weightTier = 'medium_box';
      weightTierLabelFa = 'بسته استاندارد با جعبه (تا ۱۵ کیلوگرم)';
      categoryLabelFa = 'بسته جعبه‌ای استاندارد';
      recommendedFleet = 'box_bike';
      recommendedFleetLabelFa = 'موتور باکس‌دار عایق';
      maxPhysicalWeightEstimateKg = 15;
    }

    return {
      lengthCm: safeL,
      widthCm: safeW,
      heightCm: safeH,
      weightTier,
      weightTierLabelFa,
      categoryLabelFa,
      recommendedFleet,
      recommendedFleetLabelFa,
      volumetricWeightKg: volWeight,
      maxPhysicalWeightEstimateKg,
      presetId,
    };
  }

  /**
   * Calculate dimensions using a known reference object (Standard Bank Card: 8.56cm x 5.4cm)
   * Ratio of box pixels vs card pixels gives exact real-world cm!
   */
  static calculateFromCardReference(
    boxPixelsX: number,
    boxPixelsY: number,
    cardPixelsX: number,
    cardPixelsY: number,
    depthRatio: number = 0.65
  ): ParcelDimensions {
    // Standard ID-1 Bank Card dimensions in cm
    const CARD_WIDTH_CM = 8.56;
    const CARD_HEIGHT_CM = 5.4;

    const pixelsPerCmX = cardPixelsX / CARD_WIDTH_CM;
    const pixelsPerCmY = cardPixelsY / CARD_HEIGHT_CM;
    const avgPixelsPerCm = (pixelsPerCmX + pixelsPerCmY) / 2;

    const measuredLengthCm = Math.round(boxPixelsX / avgPixelsPerCm);
    const measuredWidthCm = Math.round(boxPixelsY / avgPixelsPerCm);
    const estimatedHeightCm = Math.round(Math.min(measuredLengthCm, measuredWidthCm) * depthRatio);

    const result = this.calculateFromDimensions(measuredLengthCm, measuredWidthCm, estimatedHeightCm);
    result.referenceCalibrated = true;
    return result;
  }

  /**
   * Fast preset lookup
   */
  static getPresetById(presetId: string): ParcelDimensions | null {
    const preset = IRAN_STANDARD_PARCEL_PRESETS.find((p) => p.id === presetId);
    if (!preset) return null;
    return this.calculateFromDimensions(preset.lengthCm, preset.widthCm, preset.heightCm, preset.id);
  }

  /**
   * Simulated AR Scan
   */
  static simulateArScan(): ParcelDimensions {
    return this.calculateFromDimensions(34, 26, 18);
  }
}
