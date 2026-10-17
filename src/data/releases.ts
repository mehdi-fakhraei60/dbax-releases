export interface AppRelease {
  id: string;
  name: string;
  nameFa: string;
  role: 'customer' | 'driver';
  packageName: string;
  version: string;
  tag: string;
  releaseDate: string;
  taglineFa: string;
  taglineEn: string;
  universalApk: {
    fileName: string;
    url: string;
    directUrl?: string;
    arch: string;
    sizeEst: string;
  };
  arm64Apk: {
    fileName: string;
    url: string;
    directUrl?: string;
    arch: string;
    sizeEst: string;
  };
  highlights: string[];
  screenRange: string;
  keyFeaturesFa: string[];
}

export interface GitHubReleaseItem {
  tag: string;
  version: string;
  name: string;
  date: string;
  dateShamsi: string;
  isLatest?: boolean;
  htmlUrl: string;
  customerUniversalUrl: string;
  customerArm64Url: string;
  driverUniversalUrl: string;
  driverArm64Url: string;
  customerUniversalSize: string;
  customerArm64Size: string;
  driverUniversalSize: string;
  driverArm64Size: string;
}

export const CURRENT_RELEASE = {
  version: '1.0.0-preview41',
  versionCode: 41,
  name: 'Bax 1.0.0 Preview 41',
  releaseDate: 'مهر ۱۴۰۳ / اکتبر ۲۰۲۴',
  repoUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases',
  author: 'mehdi-fakhraei60',
  notesRaw: `## Bax 1.0.0 preview 41 (نسخه ۴۱)

Native Kotlin + Jetpack Compose و وب‌اپلیکیشن PWA. دو اپلیکیشن: **Bax مشتری** (\`ir.dbax.app\`) و **Bax کاپتان** (\`ir.dbax.app.driver\`).

- **اتصال مستقیم لینک‌های دانلود به مخزن رسمی گیت‌هاب**: دریافت بی‌واسطه و ۱۰۰٪ مستقیم فایل‌های باینری APK یونیورسال و ARM64 از GitHub Releases.
- **آرشیو کامل نسخه‌ها در پنل سمت چپ**: دسترسی تک‌لمسی به دانلود مستقیم فایل‌های نصب نسخه‌های قبلی و جاری (preview41 تا preview21).
- **فلو هوشمند تفکیک مبدا و مقصد**: انتخاب اول مبدا و فرستنده روی نقشه زنده، ثبت کامل و سپس ورود به مرحله مقصد و گیرنده.
- **تسهیل حداکثری فلو با کلید جابجایی مبدا/مقصد (Swap ⇄)**: امکان معکوس کردن فوری مبدا و مقصد روی نقشه تعاملی نشان با یک لمس.
- **انتخاب پرسرعت مقاصد پرتردد (Quick Chips)**: پیشنهاد مستقیم مقاصد پرتقاضا بدون نیاز به تایپ.
- **کپی فوری کد تحویل ۴ رقمی**: کلید کپی تک‌لمسی و ارسال مستقیم پیامک کد تحویل به گیرنده مرسوله.
- **مسیریابی زنده نشان و ویز برای کاپتان**: دسترسی مستقیم از صفحه در مسیر رسیدن به مبدا و مقصد به اپ‌های ناوبری.
- **تایید آنی و بدون تاخیر کد تحویل کاپتان**: خودکارسازی بررسی کد امنیتی ۴ رقمی جهت اتمام سریع سفر.
- پایداری کامل استایل، رنگ‌ها، هویت بصری و تم بدون هیچ‌گونه دستکاری در ظاهر اپلیکیشن.`,
};

export const APPS: AppRelease[] = [
  {
    id: 'customer',
    name: 'Bax',
    nameFa: 'باکس (مشتری)',
    role: 'customer',
    packageName: 'ir.dbax.app',
    version: '1.0.0-preview41',
    tag: 'v1.0.0-preview41',
    releaseDate: '۱۴۰۳/۰۷/۲۶',
    taglineFa: 'سامانه هوشمند سفارش پیک موتوری، وانت و تحویل تضمینی کالا با نقشه تمام‌صفحه',
    taglineEn: 'Map-first on-demand parcel delivery, live tracking & guaranteed shipments',
    universalApk: {
      fileName: 'bax-customer.apk',
      url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-customer.apk',
      directUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-customer.apk',
      arch: 'Universal (همه پردازنده‌ها)',
      sizeEst: '۱۸.۱ مگابایت',
    },
    arm64Apk: {
      fileName: 'bax-customer-arm64.apk',
      url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-customer-arm64.apk',
      directUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-customer-arm64.apk',
      arch: 'arm64-v8a (بهینه‌شده برای گوشی‌های مدرن)',
      sizeEst: '۷.۶ مگابایت',
    },
    screenRange: 'C01 تا C38 + C07a/b/c',
    highlights: [
      'اتصال مستقیم به لینک‌های باینری گیت‌هاب با قابلیت دانلود پایدار',
      'پیاده‌سازی تمام صفحات مشتری از C01 تا C38',
      'اندازه‌گیری ابعاد مرسوله با دوربین (C07a/b/c)',
      'نقشه زنده نشان: جستجو، تفکیک گام‌به‌گام مبدا و مقصد، ژئوکدینگ معکوس',
      'رهگیری زنده حرکت سفیر روی نقشه',
      'ورود سریع با پیامک تایید (Kavenegar OTP)',
      'کیف پول درون‌برنامه‌ای، فاکتور رسمی و گزینه تحویل تضمینی',
      'سیستم به‌روزرسانی خودکار درون‌برنامه‌ای از مخزن رسمی',
    ],
    keyFeaturesFa: [
      'دانلود مستقیم و بدون واسطه از ریپازیتوری رسمی GitHub',
      'ثبت سفارش آسان در دو مرحله شفاف مبدا و سپس مقصد با برآورد هوشمند قیمت',
      'محاسبه خودکار ابعاد و وزن بسته با دوربین گوشی',
      'پشتیبانی از چند مقصد و توقف در مسیر',
      'پرداخت از کیف پول، درگاه بانکی یا نقدی در محل',
    ],
  },
  {
    id: 'driver',
    name: 'Bax Captain',
    nameFa: 'باکس کاپتان (راننده / سفیر)',
    role: 'driver',
    packageName: 'ir.dbax.app.driver',
    version: '1.0.0-preview41',
    tag: 'v1.0.0-preview41',
    releaseDate: '۱۴۰۳/۰۷/۲۶',
    taglineFa: 'اپلیکیشن اختصاصی کاپتان‌های حمل با کارمزد ۰٪ و درآمد ثابت شیفتی',
    taglineEn: 'Exclusive captain app with 0% commission and 8-hour fixed block earnings',
    universalApk: {
      fileName: 'bax-driver.apk',
      url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-driver.apk',
      directUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-driver.apk',
      arch: 'Universal (همه پردازنده‌ها)',
      sizeEst: '۱۸.۱ مگابایت',
    },
    arm64Apk: {
      fileName: 'bax-driver-arm64.apk',
      url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-driver-arm64.apk',
      directUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-driver-arm64.apk',
      arch: 'arm64-v8a (بهینه‌شده برای گوشی‌های مدرن)',
      sizeEst: '۷.۶ مگابایت',
    },
    screenRange: 'D00 تا D38',
    highlights: [
      'دانلود مستقیم APK کاپتان از گیت‌هاب با یک کلیک',
      'پیاده‌سازی کامل تمام صفحات سفیر از D00 تا D38',
      'مدل اقتصادی انقلابی: ۰٪ کارمزد کمیسیون از سفرها',
      'درآمد تضمینی ثابت برای هر بلوک کاری ۸ ساعته + اشتراک ماهانه',
      'مسیریابی حرفه‌ای نشان با هشدارهای ترافیکی و راهنمای صوتی',
      'داشبورد جامع درآمد، تسویه روزانه و سابقه شیفت‌ها',
      'پشتیبانی آنلاین و سیستم تایید و تحویل امن مرسوله با کد تحویل',
      'به‌روزرسانی مستقیم از مخزن عمومی گیت‌هاب',
    ],
    keyFeaturesFa: [
      'اتصال مستقیم به فایل‌های Release در سرورهای امن GitHub',
      'درآمد ۱۰۰٪ متعلق به خود سفیر بدون کسر درصد از سفرها',
      'انتخاب شیفت‌های دلخواه ۸ ساعته با پرداختی تضمین‌شده',
      'اعلان‌های صوتی و لرزشی فوق سریع برای درخواست‌های سفر',
      'احراز هویت سریع با کاوه‌نگار و فعال‌سازی آسان مدارک',
    ],
  },
];

export const GITHUB_RELEASES_ARCHIVE: GitHubReleaseItem[] = [
  {
    tag: 'v1.0.0-preview41',
    version: '1.0.0-preview41',
    name: 'Bax 1.0.0-preview41 (آخرین نسخه)',
    date: '2026-10-17',
    dateShamsi: '۱۴۰۳/۰۷/۲۶',
    isLatest: true,
    htmlUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/tag/v1.0.0-preview41',
    customerUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-customer.apk',
    customerArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-customer-arm64.apk',
    driverUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-driver.apk',
    driverArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview41/bax-driver-arm64.apk',
    customerUniversalSize: '۱۸.۱ MB',
    customerArm64Size: '۷.۶ MB',
    driverUniversalSize: '۱۸.۱ MB',
    driverArm64Size: '۷.۶ MB',
  },
  {
    tag: 'v1.0.0-preview40',
    version: '1.0.0-preview40',
    name: 'Bax 1.0.0-preview40',
    date: '2026-10-16',
    dateShamsi: '۱۴۰۳/۰۷/۲۵',
    htmlUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/tag/v1.0.0-preview40',
    customerUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview40/bax-customer.apk',
    customerArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview40/bax-customer-arm64.apk',
    driverUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview40/bax-driver.apk',
    driverArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview40/bax-driver-arm64.apk',
    customerUniversalSize: '۱۸.۱ MB',
    customerArm64Size: '۷.۵ MB',
    driverUniversalSize: '۱۸.۱ MB',
    driverArm64Size: '۷.۵ MB',
  },
  {
    tag: 'v1.0.0-preview39',
    version: '1.0.0-preview39',
    name: 'Bax 1.0.0-preview39',
    date: '2026-10-16',
    dateShamsi: '۱۴۰۳/۰۷/۲۵',
    htmlUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/tag/v1.0.0-preview39',
    customerUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview39/bax-customer.apk',
    customerArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview39/bax-customer-arm64.apk',
    driverUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview39/bax-driver.apk',
    driverArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview39/bax-driver-arm64.apk',
    customerUniversalSize: '۱۸.۱ MB',
    customerArm64Size: '۷.۵ MB',
    driverUniversalSize: '۱۸.۱ MB',
    driverArm64Size: '۷.۵ MB',
  },
  {
    tag: 'v1.0.0-preview38',
    version: '1.0.0-preview38',
    name: 'Bax 1.0.0-preview38',
    date: '2026-10-15',
    dateShamsi: '۱۴۰۳/۰۷/۲۴',
    htmlUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/tag/v1.0.0-preview38',
    customerUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview38/bax-customer.apk',
    customerArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview38/bax-customer-arm64.apk',
    driverUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview38/bax-driver.apk',
    driverArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview38/bax-driver-arm64.apk',
    customerUniversalSize: '۱۸.۱ MB',
    customerArm64Size: '۷.۵ MB',
    driverUniversalSize: '۱۸.۱ MB',
    driverArm64Size: '۷.۵ MB',
  },
  {
    tag: 'v1.0.0-preview37',
    version: '1.0.0-preview37',
    name: 'Bax 1.0.0-preview37',
    date: '2026-10-15',
    dateShamsi: '۱۴۰۳/۰۷/۲۴',
    htmlUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/tag/v1.0.0-preview37',
    customerUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview37/bax-customer.apk',
    customerArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview37/bax-customer-arm64.apk',
    driverUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview37/bax-driver.apk',
    driverArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview37/bax-driver-arm64.apk',
    customerUniversalSize: '۱۸.۱ MB',
    customerArm64Size: '۷.۵ MB',
    driverUniversalSize: '۱۸.۱ MB',
    driverArm64Size: '۷.۵ MB',
  },
  {
    tag: 'v1.0.0-preview36',
    version: '1.0.0-preview36',
    name: 'Bax 1.0.0-preview36',
    date: '2026-10-15',
    dateShamsi: '۱۴۰۳/۰۷/۲۴',
    htmlUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/tag/v1.0.0-preview36',
    customerUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview36/bax-customer.apk',
    customerArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview36/bax-customer-arm64.apk',
    driverUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview36/bax-driver.apk',
    driverArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview36/bax-driver-arm64.apk',
    customerUniversalSize: '۱۸.۱ MB',
    customerArm64Size: '۷.۵ MB',
    driverUniversalSize: '۱۸.۱ MB',
    driverArm64Size: '۷.5 MB',
  },
  {
    tag: 'v1.0.0-preview30',
    version: '1.0.0-preview30',
    name: 'Bax 1.0.0-preview30',
    date: '2026-10-14',
    dateShamsi: '۱۴۰۳/۰۷/۲۳',
    htmlUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/tag/v1.0.0-preview30',
    customerUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview30/bax-customer.apk',
    customerArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview30/bax-customer-arm64.apk',
    driverUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview30/bax-driver.apk',
    driverArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview30/bax-driver-arm64.apk',
    customerUniversalSize: '۱۸.۰ MB',
    customerArm64Size: '۷.۵ MB',
    driverUniversalSize: '۱۸.۰ MB',
    driverArm64Size: '۷.۵ MB',
  },
  {
    tag: 'v1.0.0-preview21',
    version: '1.0.0-preview21',
    name: 'Bax 1.0.0-preview21',
    date: '2026-10-14',
    dateShamsi: '۱۴۰۳/۰۷/۲۳',
    htmlUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/tag/v1.0.0-preview21',
    customerUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview21/bax-customer.apk',
    customerArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview21/bax-customer-arm64.apk',
    driverUniversalUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview21/bax-driver.apk',
    driverArm64Url: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/download/v1.0.0-preview21/bax-driver-arm64.apk',
    customerUniversalSize: '۱۸.۸ MB',
    customerArm64Size: '۷.۸ MB',
    driverUniversalSize: '۱۸.۸ MB',
    driverArm64Size: '۷.۸ MB',
  },
];

export interface ScreenCatalogItem {
  code: string;
  nameFa: string;
  descriptionFa: string;
  category: 'auth' | 'order' | 'map' | 'payment' | 'profile' | 'delivery';
  app: 'customer' | 'driver';
}

export const SCREEN_CATALOG: ScreenCatalogItem[] = [
  // Customer Screens
  { code: 'C01', nameFa: 'صفحه اسپلش و بارگذاری', descriptionFa: 'بررسی وضعیت شبکه، اعتبارسنجی توکن و بررسی نسخه جدید (v1.0.0-preview6)', category: 'auth', app: 'customer' },
  { code: 'C02', nameFa: 'ورود / ثبت‌نام شماره همراه', descriptionFa: 'دریافت شماره موبایل کاربر جهت ارسال کد احراز هویت Kavenegar', category: 'auth', app: 'customer' },
  { code: 'C03', nameFa: 'تایید کد پیامکی (OTP)', descriptionFa: 'ورود کد ۴ رقمی یکبار مصرف با قابلیت شمارش معکوس و ارسال مجدد', category: 'auth', app: 'customer' },
  { code: 'C04', nameFa: 'تکمیل مشخصات فردی', descriptionFa: 'نام، نام خانوادگی، کد ملی اختیاری و آدرس‌های پرکاربرد', category: 'profile', app: 'customer' },
  { code: 'C05', nameFa: 'صفحه اصلی و نقشه زنده نشان (انتخاب روی نقشه)', descriptionFa: 'اولویت نخست: انتخاب مستقیم مبدا و مقصد روی نقشه زنده تمام‌صفحه؛ استفاده اختیاری از آدرس‌های ذخیره‌شده', category: 'map', app: 'customer' },
  { code: 'C06', nameFa: 'انتخاب مبدا و چند مقصد روی نقشه', descriptionFa: 'پین مستقیم روی نقشه، ژئوکدینگ معکوس نشان، افزودن مقاصد بعدی و انتخاب اختیاری از دفترچه آدرس', category: 'order', app: 'customer' },
  { code: 'C07a', nameFa: 'اندازه‌گیری با دوربین (ابعاد)', descriptionFa: 'تشخیص ابعاد بسته با دوربین و AR جهت تعیین کلاس وزنی', category: 'order', app: 'customer' },
  { code: 'C07b', nameFa: 'عکاسی از مرسوله و بسته', descriptionFa: 'ثبت تصویر اولیه کالا جهت تضمین سلامت بار و بیمه سفر', category: 'order', app: 'customer' },
  { code: 'C07c', nameFa: 'تایید مشخصات فیزیکی مرسوله', descriptionFa: 'وزن، شکستنی بودن، ارزش ریالی بسته و انتخاب بیمه تکمیلی', category: 'order', app: 'customer' },
  { code: 'C08', nameFa: 'انتخاب نوع سرویس و وسیله نقلیه', descriptionFa: 'موتور معمولی، باکس جعبه‌دار، وانت بار سبک یا وانت سنگین', category: 'order', app: 'customer' },
  { code: 'C10', nameFa: 'پیش‌فاکتور و گزینه‌های تحویل', descriptionFa: 'انتخاب تحویل تضمینی، کد تحویل پیامکی، توقف در مسیر', category: 'payment', app: 'customer' },
  { code: 'C12', nameFa: 'کیف پول و درگاه پرداخت', descriptionFa: 'پرداخت پس از رویت بسته و تحویل به کاپتان از موجودی یا شتاب', category: 'payment', app: 'customer' },
  { code: 'C15', nameFa: 'جستجوی کاپتان در نزدیکی (رادار اعزام)', descriptionFa: 'رادار جستجو با انیمیشن روان و امکان لغو درخواست تا قبل از قبول کاپتان', category: 'order', app: 'customer' },
  { code: 'C18', nameFa: 'رهگیری زنده حرکت کاپتان', descriptionFa: 'نمایش زنده حرکت مارکر کاپتان روی نقشه نشان با تخمین زمان رسیدن (ETA) و تسویه پس از تحویل بار', category: 'map', app: 'customer' },
  { code: 'C22', nameFa: 'اطلاعات کاپتان و تماس امن', descriptionFa: 'مشخصات کاپتان، شماره پلاک، امتیاز و دکمه تماس با حفظ حریم خصوصی', category: 'delivery', app: 'customer' },
  { code: 'C30', nameFa: 'تایید تحویل و کد امنیتی', descriptionFa: 'تحویل بسته به گیرنده و ثبت کد تایید ۴ رقمی و امضای دیجیتال PoD', category: 'delivery', app: 'customer' },
  { code: 'C35', nameFa: 'رسید نهایی و امتیازدهی', descriptionFa: 'امتیاز ستاره‌ای، ثبت نظر و فاکتور تفکیک‌شده رسمی', category: 'profile', app: 'customer' },
  { code: 'C38', nameFa: 'حساب کاربری و به‌روزرسانی اپ', descriptionFa: 'تنظیمات، سوابق سفرها، شارژ حساب و دانلود آخرین نسخه APK v1.0.0-preview6', category: 'profile', app: 'customer' },

  // Driver Screens
  { code: 'D00', nameFa: 'اسپلش اختصاصی کاپتان', descriptionFa: 'بررسی سنسور GPS، مجوزهای دسترسی موقعیت در پس‌زمینه و احراز وضعیت', category: 'auth', app: 'driver' },
  { code: 'D01', nameFa: 'ورود کاپتان با OTP', descriptionFa: 'ورود سریع با شماره ثبت‌نام‌شده کاپتان (شامل شماره تست ۰۹۳۹۹۸۸۷۷۸۲)', category: 'auth', app: 'driver' },
  { code: 'D03', nameFa: 'داشبورد شیفت و وضعیت آنلاین کاپتان', descriptionFa: 'فعال‌سازی شیفت، انتخاب بلوک ۸ ساعته و سوئیچ آنلاین/آفلاین', category: 'map', app: 'driver' },
  { code: 'D07', nameFa: 'مدل اقتصادی و وضعیت اشتراک', descriptionFa: 'مشاهده طرح کارمزد صفر درصد، هزینه ورودی و اعتبار اشتراک ماهانه', category: 'payment', app: 'driver' },
  { code: 'D12', nameFa: 'کارت اعلان درخواست جدید کاپتان', descriptionFa: 'پاپ‌آپ صوتی تمام صفحه با نمایش کرایه، مبدا، مقصد و مسافت با مهلت پاسخ', category: 'order', app: 'driver' },
  { code: 'D18', nameFa: 'مسیریابی نقشه نشان به سمت مبدا', descriptionFa: 'هدایت گام‌به‌گام با نقشه نشان برای رسیدن سریع به فرستنده', category: 'map', app: 'driver' },
  { code: 'D22', nameFa: 'دریافت بار و چک‌لیست بسته', descriptionFa: 'تطبیق عکس بسته ثبت شده توسط مشتری با بار فیزیکی و تایید تحویل', category: 'delivery', app: 'driver' },
  { code: 'D26', nameFa: 'مسیریابی به سمت مقصد تحویل', descriptionFa: 'راهنمای صوتی و ترافیک زنده تا درب آدرس گیرنده نهایی', category: 'map', app: 'driver' },
  { code: 'D30', nameFa: 'تحویل و ثبت کد تایید مشتری', descriptionFa: 'ورود کد رمز گیرنده جهت اتمام سفارش و اضافه شدن کرایه به حساب', category: 'delivery', app: 'driver' },
  { code: 'D34', nameFa: 'گزارش کارکرد و تسویه حساب', descriptionFa: 'مشاهده درآمد شیفت، پاداش‌ها و درخواست تسویه آنی به شماره شبا', category: 'payment', app: 'driver' },
  { code: 'D38', nameFa: 'پروفایل کاپتان و آپدیتر اختصاصی', descriptionFa: 'مدارک خودرو، وضعیت سلامت حساب و دریافت آخرین آپدیت‌های APK', category: 'profile', app: 'driver' },
];
