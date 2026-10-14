export interface SavedAddressRecord {
  id: string;
  tag: 'home' | 'work' | 'warehouse' | 'branch' | 'custom';
  titleFa: string;
  categoryLabelFa: string;
  fullAddressFa: string;
  unitNotesFa?: string;
  contactName: string;
  contactPhone: string;
  location: {
    lat: number;
    lng: number;
  };
  isDefaultPickup: boolean;
  isDefaultDestination: boolean;
  orderCountUsed: number;
}

export class AddressBookAdapter {
  public static getSavedAddresses(): SavedAddressRecord[] {
    return [
      {
        id: 'addr-01',
        tag: 'warehouse',
        titleFa: 'انبار مرکزی غرب (دیجیکالا / فروشگاه)',
        categoryLabelFa: 'انبار کالا',
        fullAddressFa: 'تهران، جاده مخصوص کرج، کیلومتر ۱۴، شهرک صنعتی ۲۲، بلوار کارگر، کوچه ۶',
        unitNotesFa: 'سکوی بارگیری شماره ۴ - جنب نگهبانی',
        contactName: 'حامد شریفی (مسئول خروج انبار)',
        contactPhone: '09123456780',
        location: { lat: 35.712, lng: 51.215 },
        isDefaultPickup: true,
        isDefaultDestination: false,
        orderCountUsed: 42,
      },
      {
        id: 'addr-02',
        tag: 'work',
        titleFa: 'دفتر مرکزی میرداماد',
        categoryLabelFa: 'دفتر اداری',
        fullAddressFa: 'تهران، خیابان میرداماد، میدان مادر، برج پایتخت، طبقه ۵ واحد ۲۱',
        unitNotesFa: 'زنگ شرکت - واحد حسابداری و دیسپچ',
        contactName: 'سرکار خانم محمدی',
        contactPhone: '09121112233',
        location: { lat: 35.7654, lng: 51.4367 },
        isDefaultPickup: false,
        isDefaultDestination: true,
        orderCountUsed: 19,
      },
      {
        id: 'addr-03',
        tag: 'branch',
        titleFa: 'شعبه بازار بزرگ تهران (پاساژ علاالدین)',
        categoryLabelFa: 'شعبه فروشگاهی',
        fullAddressFa: 'تهران، خیابان جمهوری، تقاطع حافظ، مجتمع تجاری علاالدین، طبقه همکف پلاک ۴۵',
        unitNotesFa: 'تحویل به آقای اسدی فروشنده شیفت صبح',
        contactName: 'مجید اسدی',
        contactPhone: '09355556677',
        location: { lat: 35.698, lng: 51.411 },
        isDefaultPickup: false,
        isDefaultDestination: false,
        orderCountUsed: 28,
      },
      {
        id: 'addr-04',
        tag: 'home',
        titleFa: 'منزل و کارگاه خانگی سعادت‌آباد',
        categoryLabelFa: 'منزل شخصی',
        fullAddressFa: 'تهران، سعادت‌آباد، میدان کاج، خیابان سرو غربی، کوچه ارغوان، پلاک ۱۲ واحد ۲',
        unitNotesFa: 'درب قهوه‌ای - طبقه اول',
        contactName: 'مهدی فخرایی',
        contactPhone: '09129998877',
        location: { lat: 35.783, lng: 51.372 },
        isDefaultPickup: false,
        isDefaultDestination: false,
        orderCountUsed: 14,
      },
    ];
  }
}
