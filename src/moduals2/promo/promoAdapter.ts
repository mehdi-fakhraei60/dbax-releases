export interface PromoValidationResult {
  valid: boolean;
  code: string;
  discountToman: number;
  discountPercentage?: number;
  messageFa: string;
}

export class PromoAdapter {
  private static validCodes: Record<string, { percent: number; maxDiscountToman: number; descFa: string }> = {
    BAXFIRST: { percent: 25, maxDiscountToman: 30000, descFa: '۲۵٪ تخفیف اولین سفارش باکس' },
    BAXVIP: { percent: 15, maxDiscountToman: 20000, descFa: '۱۵٪ تخفیف مشتریان وفادار' },
    TEHRAN: { percent: 10, maxDiscountToman: 15000, descFa: '۱۰٪ تخفیف درون‌شهری تهران' },
  };

  static validatePromo(code: string, subtotalToman: number): PromoValidationResult {
    const clean = code.trim().toUpperCase();
    const found = this.validCodes[clean];

    if (!found) {
      return {
        valid: false,
        code: clean,
        discountToman: 0,
        messageFa: 'کد تخفیف وارد شده نامعتبر است یا منقضی شده است. کدهای تست: BAXFIRST یا BAXVIP',
      };
    }

    const calculated = Math.round((subtotalToman * found.percent) / 100);
    const finalDiscount = Math.min(calculated, found.maxDiscountToman);

    return {
      valid: true,
      code: clean,
      discountToman: finalDiscount,
      discountPercentage: found.percent,
      messageFa: `کد تخفیف ${found.descFa} با موفقیت اعمال گردید.`,
    };
  }
}
