import { NeshanLocation } from '../neshan/neshanAdapter';

export interface MultiDropDestination {
  id: string;
  location: NeshanLocation;
  recipientName: string;
  recipientPhone: string;
  unitNotes?: string;
  status: 'pending' | 'in_transit' | 'delivered';
}

export interface DeliveryScheduleOption {
  type: 'immediate' | 'scheduled';
  dateLabel?: string;
  timeSlot?: string;
}

export interface PricingBreakdown {
  baseFare: number;
  distanceFare: number;
  multiDropFare: number;
  surgeMultiplier: number;
  surgeAmount: number;
  surgeReason?: string;
  discountAmount: number;
  totalFinalPrice: number;
}

export class DispatchScheduler {
  /**
   * Available time slots for scheduled deliveries
   */
  public static getScheduledTimeSlots(): { id: string; label: string; period: string }[] {
    return [
      { id: 'today_16_18', label: 'امروز ۱۶:۰۰ تا ۱۸:۰۰', period: 'عصر' },
      { id: 'today_18_20', label: 'امروز ۱۸:۰۰ تا ۲۰:۰۰', period: 'غروب (اوج ترافیک)' },
      { id: 'tomorrow_10_12', label: 'فردا ۱۰:۰۰ تا ۱۲:۰۰', period: 'صبح' },
      { id: 'tomorrow_14_16', label: 'فردا ۱۴:۰۰ تا ۱۶:۰۰', period: 'ظهر' },
      { id: 'tomorrow_17_19', label: 'فردا ۱۷:۰۰ تا ۱۹:۰۰', period: 'عصر' },
    ];
  }

  /**
   * Calculate dynamic pricing based on multiple drops, distance, weather, and schedule
   */
  public static calculatePricing(
    totalDistanceKm: number,
    destinationsCount: number,
    schedule: DeliveryScheduleOption,
    weatherCondition: 'clear' | 'rain' | 'snow' = 'clear',
    trafficCondition: 'smooth' | 'heavy' = 'smooth'
  ): PricingBreakdown {
    const baseFare = 45000; // Base pickup fare in Tomans
    const perKmRate = 6000;
    const distanceFare = Math.round(totalDistanceKm * perKmRate);

    // Multi-drop additional fare (each extra destination adds 25,000 Tomans)
    const extraDestinations = Math.max(0, destinationsCount - 1);
    const multiDropFare = extraDestinations * 25000;

    // Calculate surge multiplier
    let surgeMultiplier = 1.0;
    let surgeReason: string | undefined;

    if (weatherCondition === 'rain') {
      surgeMultiplier += 0.2;
      surgeReason = 'افزایش قیمت به علت بارندگی و لغزندگی معابر (+۲۰٪)';
    } else if (weatherCondition === 'snow') {
      surgeMultiplier += 0.35;
      surgeReason = 'افزایش قیمت به علت شرایط برفی و کندی تردد (+۳۵٪)';
    }

    if (trafficCondition === 'heavy') {
      surgeMultiplier += 0.15;
      surgeReason = (surgeReason ? surgeReason + ' و ' : '') + 'ترافیک سنگین معابر (+۱۵٪)';
    }

    if (schedule.type === 'scheduled') {
      // Small scheduled guarantee fee
      surgeMultiplier += 0.05;
      surgeReason = (surgeReason ? surgeReason + ' و ' : '') + 'رزرو زمان تحویل قطعی (+۵٪)';
    }

    const subTotal = baseFare + distanceFare + multiDropFare;
    const surgeAmount = Math.round(subTotal * (surgeMultiplier - 1));
    const totalFinalPrice = subTotal + surgeAmount;

    return {
      baseFare,
      distanceFare,
      multiDropFare,
      surgeMultiplier: Number(surgeMultiplier.toFixed(2)),
      surgeAmount,
      surgeReason,
      discountAmount: 0,
      totalFinalPrice,
    };
  }
}
