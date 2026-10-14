export interface BaxSmsTemplate {
  event: 'otp' | 'order_confirmed' | 'courier_arrived' | 'delivery_code' | 'trip_completed';
  eventTitleFa: string;
  senderLine: string;
  recipientRole: 'مشتری (فرستنده)' | 'تحویل‌گیرنده';
  templateName: string;
  sampleMessageFa: string;
}

export const BAX_SMS_TEMPLATES: BaxSmsTemplate[] = [
  {
    event: 'otp',
    eventTitleFa: 'کد تایید ورود به باکس (OTP)',
    senderLine: '20006601',
    recipientRole: 'مشتری (فرستنده)',
    templateName: 'bax-otp-verify',
    sampleMessageFa: 'باکس: کد ورود شما ۴۸۹۲ می‌باشد. این کد محرمانه است.\nکد را در اختیار دیگران قرار ندهید.',
  },
  {
    event: 'order_confirmed',
    eventTitleFa: 'تایید سفارش و اعزام سفیر',
    senderLine: '20006601',
    recipientRole: 'تحویل‌گیرنده',
    templateName: 'bax-order-tracking',
    sampleMessageFa: 'مرسوله‌ای از طرف مهدی فخرایی برای شما با باکس ارسال شد.\nرهگیری زنده حرکت سفیر:\nhttps://dbax.ir/track/TRK-1403-8842',
  },
  {
    event: 'delivery_code',
    eventTitleFa: 'اعلام کد تحویل امن به گیرنده',
    senderLine: '20006601',
    recipientRole: 'تحویل‌گیرنده',
    templateName: 'bax-delivery-handshake',
    sampleMessageFa: 'سفیر باکس به آدرس شما رسید.\nرمز ۴ رقمی تحویل بسته: ۴۸۹۲\nلطفاً در زمان دریافت کالا این کد را به سفیر تحویل دهید.',
  },
  {
    event: 'trip_completed',
    eventTitleFa: 'رسید نهایی و اتمام سفر',
    senderLine: '20006601',
    recipientRole: 'مشتری (فرستنده)',
    templateName: 'bax-invoice-receipt',
    sampleMessageFa: 'سفارش شما با موفقیت تحویل داده شد.\nمبلغ نهایی: ۹۵,۰۰۰ تومان (تسویه در محل)\nفاکتور رسمی: https://dbax.ir/invoice/INV-9842',
  },
];
