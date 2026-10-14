export interface OfficialInvoiceItem {
  id: string;
  orderId: string;
  tripDateFa: string;
  originFa: string;
  destinationFa: string;
  vehicleTypeFa: string;
  netFareToman: number;
  vatTaxToman: number; // 10% VAT
  totalPayableToman: number;
  paymentMethodFa: string;
  taxInvoiceSerial: string;
}

export interface MonthlyBillingSummary {
  periodFa: string;
  totalTrips: number;
  subtotalFareToman: number;
  vatTaxToman: number;
  discountsAppliedToman: number;
  finalBilledToman: number;
  companyNameFa: string;
  nationalCode: string;
  economicCode: string;
  registeredPostalCode: string;
  items: OfficialInvoiceItem[];
}

export class CorporateInvoiceAdapter {
  public static getMonthlyStatement(): MonthlyBillingSummary {
    const items: OfficialInvoiceItem[] = [
      {
        id: 'INV-1403-09-001',
        orderId: 'BX-88219',
        tripDateFa: '۱۴۰۳/۰۹/۱۰',
        originFa: 'دفتر مرکزی میرداماد',
        destinationFa: 'انبار غرب جاده مخصوص',
        vehicleTypeFa: 'موتورسیکلت باکس‌دار',
        netFareToman: 65000,
        vatTaxToman: 6500,
        totalPayableToman: 71500,
        paymentMethodFa: 'کیف‌پول اعتباری شرکتی',
        taxInvoiceSerial: 'TX-2024-991204',
      },
      {
        id: 'INV-1403-09-002',
        orderId: 'BX-88220',
        tripDateFa: '۱۴۰۳/۰۹/۱۱',
        originFa: 'شعبه بازار علاالدین',
        destinationFa: 'سعادت‌آباد سرو غربی',
        vehicleTypeFa: 'وانت پراید سبک',
        netFareToman: 145000,
        vatTaxToman: 14500,
        totalPayableToman: 159500,
        paymentMethodFa: 'کیف‌پول اعتباری شرکتی',
        taxInvoiceSerial: 'TX-2024-991205',
      },
      {
        id: 'INV-1403-09-003',
        orderId: 'BX-88221',
        tripDateFa: '۱۴۰۳/۰۹/۱۲',
        originFa: 'انبار کالا جاده مخصوص',
        destinationFa: 'سفارش چند مقصده (۳ نقطه)',
        vehicleTypeFa: 'وانت آریسان مسقف',
        netFareToman: 220000,
        vatTaxToman: 22000,
        totalPayableToman: 242000,
        paymentMethodFa: 'کیف‌پول اعتباری شرکتی',
        taxInvoiceSerial: 'TX-2024-991206',
      },
    ];

    const subtotalFareToman = items.reduce((acc, curr) => acc + curr.netFareToman, 0);
    const vatTaxToman = items.reduce((acc, curr) => acc + curr.vatTaxToman, 0);
    const discountsAppliedToman = 20000;
    const finalBilledToman = subtotalFareToman + vatTaxToman - discountsAppliedToman;

    return {
      periodFa: 'آذر ماه ۱۴۰۳',
      totalTrips: items.length,
      subtotalFareToman,
      vatTaxToman,
      discountsAppliedToman,
      finalBilledToman,
      companyNameFa: 'شرکت تجارت الکترونیک آوا پارس (سهامی خاص)',
      nationalCode: '10103984512',
      economicCode: '411389745123',
      registeredPostalCode: '1918954321',
      items,
    };
  }

  public static exportOfficialCsv(): string {
    const summary = this.getMonthlyStatement();
    let csv = `شماره فاکتور دارایی,شماره سفارش باکس,تاریخ سفر,مبدا,مقصد,نوع ناوگان,کرایه خالص (تومان),مالیات بر ارزش افزوده ۱۰٪ (تومان),جمع کل فاکتور (تومان),روش پرداخت\n`;
    summary.items.forEach(item => {
      csv += `${item.taxInvoiceSerial},${item.orderId},${item.tripDateFa},${item.originFa},${item.destinationFa},${item.vehicleTypeFa},${item.netFareToman},${item.vatTaxToman},${item.totalPayableToman},${item.paymentMethodFa}\n`;
    });
    return csv;
  }
}
