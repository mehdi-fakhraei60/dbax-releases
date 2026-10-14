import { MODUALS2_CONFIG } from '../config';

export interface SendOtpResult {
  success: boolean;
  messageId?: string;
  remainingCooldownSeconds: number;
  messageFa: string;
}

export interface VerifyOtpResult {
  success: boolean;
  token?: string;
  userId?: string;
  messageFa: string;
}

export class KavenegarAdapter {
  private static cooldownTimer: Record<string, number> = {};

  static validateIranianMobile(phone: string): boolean {
    const clean = phone.replace(/[\s-]/g, '');
    const regex = /^(\+98|0)?9\d{9}$/;
    return regex.test(clean);
  }

  static formatToE164(phone: string): string {
    let clean = phone.replace(/[\s-]/g, '');
    if (clean.startsWith('0')) {
      clean = '+98' + clean.slice(1);
    } else if (!clean.startsWith('+98')) {
      clean = '+98' + clean;
    }
    return clean;
  }

  static async sendOtp(phone: string): Promise<SendOtpResult> {
    if (!this.validateIranianMobile(phone)) {
      return {
        success: false,
        remainingCooldownSeconds: 0,
        messageFa: 'شماره تلفن وارد شده نامعتبر است. فرمت صحیح: ۰۹۱۲۳۴۵۶۷۸۹',
      };
    }

    const now = Date.now();
    const lastSent = this.cooldownTimer[phone] || 0;
    const elapsedSeconds = Math.floor((now - lastSent) / 1000);

    if (elapsedSeconds < 120) {
      return {
        success: false,
        remainingCooldownSeconds: 120 - elapsedSeconds,
        messageFa: `لطفاً ${120 - elapsedSeconds} ثانیه تا ارسال مجدد کد پیامکی صبر نمایید.`,
      };
    }

    this.cooldownTimer[phone] = now;

    // Simulate sending OTP via Kavenegar template
    return {
      success: true,
      messageId: `kav-${Math.random().toString(36).substring(2, 9)}`,
      remainingCooldownSeconds: 120,
      messageFa: `کد تایید ۴ رقمی از طریق درگاه کاوه‌نگار (الگوی ${MODUALS2_CONFIG.kavenegar.templateName}) به شماره ${phone} ارسال شد.`,
    };
  }

  static async verifyOtp(phone: string, code: string): Promise<VerifyOtpResult> {
    if (!code || code.length !== 4) {
      return {
        success: false,
        messageFa: 'کد تایید پیامکی باید ۴ رقم باشد.',
      };
    }

    // Standard demo OTP code or test code
    if (code === '4892' || code === '1234') {
      return {
        success: true,
        token: `jwt_bax_${Math.random().toString(36).substring(2, 16)}`,
        userId: 'usr_mehdi_fakhraei',
        messageFa: 'احراز هویت پیامکی کاوه‌نگار با موفقیت انجام شد.',
      };
    }

    return {
      success: false,
      messageFa: 'کد وارد شده اشتباه یا منقضی شده است. کد پیش‌فرض تست: ۴۸۹۲',
    };
  }
}
