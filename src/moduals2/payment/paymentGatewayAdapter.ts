import { MODUALS2_CONFIG } from '../config';

export type PaymentMethod = 'wallet_credit' | 'cash_on_delivery' | 'card_to_card';

export interface OfficialInvoice {
  invoiceNumber: string;
  dateShamsi: string;
  customerName: string;
  orderId: string;
  baseFareToman: number;
  insuranceToman: number;
  vatToman: number;
  totalToman: number;
  paymentMethod: PaymentMethod;
  paymentMethodLabelFa: string;
  trackingCode: string;
  payerType: 'sender' | 'receiver';
}

export class PaymentGatewayAdapter {
  private static walletCreditBalance = 1200000; // 1,200,000 Tomans credit line default

  // IPG Status: Disabled as per current project phase
  static isIpgOnlineGatewayActive(): boolean {
    return false;
  }

  static getWalletCreditBalance(): number {
    return this.walletCreditBalance;
  }

  static addCredit(amountToman: number): number {
    this.walletCreditBalance += amountToman;
    return this.walletCreditBalance;
  }

  static payWithCredit(amountToman: number): { success: boolean; newBalance: number; errorFa?: string } {
    if (this.walletCreditBalance < amountToman) {
      return {
        success: false,
        newBalance: this.walletCreditBalance,
        errorFa: `موجودی حساب اعتباری (${new Intl.NumberFormat('fa-IR').format(this.walletCreditBalance)} تومان) کافی نیست. می‌توانید روش پرداخت نقدی در محل را انتخاب نمایید.`,
      };
    }
    this.walletCreditBalance -= amountToman;
    return {
      success: true,
      newBalance: this.walletCreditBalance,
    };
  }

  static generateOfficialInvoice(
    customerName: string,
    orderId: string,
    baseFareToman: number,
    isGuaranteed: boolean,
    paymentMethod: PaymentMethod,
    payerType: 'sender' | 'receiver' = 'sender'
  ): OfficialInvoice {
    const insuranceToman = isGuaranteed ? 18000 : 0;
    const subtotal = baseFareToman + insuranceToman;
    const vatToman = Math.round(subtotal * 0.1); // 10% VAT
    const totalToman = subtotal + vatToman;

    let paymentMethodLabelFa = 'نقدی / کارتخوان در محل (فرستنده)';
    if (paymentMethod === 'wallet_credit') {
      paymentMethodLabelFa = 'کسر از حساب اعتباری کیف پول';
    } else if (paymentMethod === 'card_to_card') {
      paymentMethodLabelFa = 'کارت‌به‌کارت مستقیم با شناسه پیگیری';
    } else if (payerType === 'receiver') {
      paymentMethodLabelFa = 'نقدی در مقصد توسط گیرنده (پس‌کرایه)';
    }

    return {
      invoiceNumber: `BAX-INV-1403-${Math.floor(Math.random() * 89999 + 10000)}`,
      dateShamsi: '۱۴۰۳/۰۷/۲۴',
      customerName,
      orderId,
      baseFareToman,
      insuranceToman,
      vatToman,
      totalToman,
      paymentMethod,
      paymentMethodLabelFa,
      trackingCode: `TRK-${Math.floor(Math.random() * 8999999 + 1000000)}`,
      payerType,
    };
  }
}
