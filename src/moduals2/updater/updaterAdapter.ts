import { CURRENT_RELEASE } from '../../data/releases';
import { MODUALS2_CONFIG } from '../config';

export interface UpdateCheckResult {
  hasUpdate: boolean;
  latestVersion: string;
  latestVersionCode: number;
  currentVersion: string;
  currentVersionCode: number;
  releaseDateFa: string;
  downloadUrl: string;
  arm64DownloadUrl: string;
  changelogHighlights: string[];
  forceUpdate?: boolean;
  isAutomaticDetection: boolean;
  detectedAt: string;
}

type UpdateListener = (result: UpdateCheckResult) => void;

export class UpdaterAdapter {
  private static listeners: Set<UpdateListener> = new Set();
  private static cachedResult: UpdateCheckResult | null = null;
  private static defaultCurrentVersion = CURRENT_RELEASE.version;
  private static defaultCurrentCode = CURRENT_RELEASE.versionCode;

  /**
   * Subscribe to automatic update events.
   * Emits immediately if an update was already detected in the background.
   */
  static subscribeToUpdateAlerts(listener: UpdateListener): () => void {
    this.listeners.add(listener);
    if (this.cachedResult) {
      listener(this.cachedResult);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Automatic background check on app launch or mount.
   * Compares the installed app version against /version.json.
   * Runs silently with zero user prompt or manual query.
   */
  static async autoCheckInBackground(
    installedVersion: string = this.defaultCurrentVersion,
    installedCode: number = this.defaultCurrentCode
  ): Promise<UpdateCheckResult> {
    try {
      let remoteData: any = null;
      try {
        const response = await fetch('/version.json', { cache: 'no-cache' });
        if (response.ok) {
          remoteData = await response.json();
        }
      } catch {
        // Fallback if running offline or in restricted environment
      }

      const latestVer = remoteData?.latestVersion || CURRENT_RELEASE.version;
      const latestCode = remoteData?.versionCode || CURRENT_RELEASE.versionCode;
      const releaseDateFa = remoteData?.releaseDateShamsi || '۱۴۰۳/۰۷/۲۳';
      const changelog = remoteData?.changelog || [
        'امکان ثبت سفارش چند مقصده با توقف‌های دلخواه (Multi-Stop Delivery)',
        'سفارش زمان‌بندی‌شده و رزرو قطعی ساعت مراجعه سفیر (Scheduled Delivery)',
        'اضافه شدن ناوگان بارهای سنگین، نیسان، خاور و کارگر باربری (Freight & Porter)',
        'سامانه امانت‌داری و تسویه آنی بهای کالا در محل تحویل (Goods COD Escrow)',
        'پنل سازمانی اختصاصی B2B با قابلیت ایمپورت فایل اکسل/CSV سفارشات گروهی',
        'لینک ردیابی زنده تحت وب بدون نیاز به نصب اپ برای گیرندگان مرسوله',
        'صدور صورتحساب رسمی مالیاتی مودیان با ۱۰٪ مالیات بر ارزش افزوده',
      ];

      const hasUpdate = latestCode > installedCode || latestVer !== installedVersion;

      const result: UpdateCheckResult = {
        hasUpdate,
        latestVersion: latestVer,
        latestVersionCode: latestCode,
        currentVersion: installedVersion,
        currentVersionCode: installedCode,
        releaseDateFa,
        downloadUrl:
          remoteData?.artifacts?.customer?.universal?.url ||
          'https://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer.apk',
        arm64DownloadUrl:
          remoteData?.artifacts?.customer?.arm64?.url ||
          'https://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer-arm64.apk',
        changelogHighlights: changelog,
        forceUpdate: remoteData?.forceUpdate || false,
        isAutomaticDetection: true,
        detectedAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };

      this.cachedResult = result;
      this.notifyListeners(result);
      return result;
    } catch {
      const fallbackResult: UpdateCheckResult = {
        hasUpdate: false,
        latestVersion: CURRENT_RELEASE.version,
        latestVersionCode: CURRENT_RELEASE.versionCode,
        currentVersion: installedVersion,
        currentVersionCode: installedCode,
        releaseDateFa: '۱۴۰۳/۰۷/۲۳',
        downloadUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer.apk',
        arm64DownloadUrl: 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer-arm64.apk',
        changelogHighlights: [
          'سفارش چند مقصده و توقف در مسیر',
          'سفارش زمان‌بندی‌شده و رزرو ساعت اعزام',
          'ناوگان باربری سنگین، نیسان و کارگر بار',
          'تسویه امن وجه کالا در محل (COD Escrow)',
          'ردیابی زنده تحت وب بدون نیاز به نصب اپ',
        ],
        isAutomaticDetection: true,
        detectedAt: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      this.cachedResult = fallbackResult;
      this.notifyListeners(fallbackResult);
      return fallbackResult;
    }
  }

  static async checkForUpdates(): Promise<UpdateCheckResult> {
    return this.autoCheckInBackground();
  }

  private static notifyListeners(result: UpdateCheckResult) {
    this.listeners.forEach((listener) => {
      try {
        listener(result);
      } catch (err) {
        console.error('Error notifying update listener:', err);
      }
    });
  }

  static simulateDownload(
    onProgress: (percent: number) => void,
    onComplete: () => void
  ): () => void {
    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      if (current >= 100) {
        clearInterval(interval);
        onProgress(100);
        onComplete();
      } else {
        onProgress(current);
      }
    }, 250);

    return () => clearInterval(interval);
  }
}
