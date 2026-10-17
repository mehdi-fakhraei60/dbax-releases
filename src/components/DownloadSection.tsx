import React, { useState } from 'react';
import { 
  Download, 
  Cpu, 
  Smartphone, 
  QrCode, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldAlert, 
  Sparkles, 
  ArrowDownToLine, 
  Layers, 
  Info,
  RefreshCw,
  ExternalLink,
  Tag,
  Calendar,
  FileDown
} from 'lucide-react';
import { APPS, AppRelease, CURRENT_RELEASE, GITHUB_RELEASES_ARCHIVE, GitHubReleaseItem } from '../data/releases';
import { QrModal } from './QrModal';

export const DownloadSection: React.FC = () => {
  // Selected architecture for each app: 'universal' or 'arm64'
  const [selectedArch, setSelectedArch] = useState<Record<string, 'universal' | 'arm64'>>({
    customer: 'universal',
    driver: 'universal',
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // QR Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    directUrl?: string;
    fileName: string;
    arch: string;
    fileSize: string;
  }>({
    isOpen: false,
    title: '',
    url: '',
    directUrl: '',
    fileName: '',
    arch: '',
    fileSize: '',
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openQr = (app: AppRelease, arch: 'universal' | 'arm64') => {
    const file = arch === 'arm64' ? app.arm64Apk : app.universalApk;
    setModalState({
      isOpen: true,
      title: `${app.nameFa} (${file.arch})`,
      url: file.url,
      directUrl: file.directUrl,
      fileName: file.fileName,
      arch: file.arch,
      fileSize: file.sizeEst,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Notice Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900/40 via-blue-900/30 to-slate-900/50 border border-indigo-500/30 p-5 shadow-lg shadow-indigo-950/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shrink-0">
              <RefreshCw className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>سیستم انتشار و به‌روزرسانی خودکار Bax</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  همگام با گیت‌هاب
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
                این مخزن عمومی مرجع دانلود مستقیم فایل‌های نصب APK و سیستم به‌روزرسانی درون‌برنامه‌ای (بخش حساب کاربری ← به‌روزرسانی) هر دو اپلیکیشن است.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 text-xs font-mono bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
            <span>نسخه فعلی:</span>
            <span className="text-indigo-400 font-bold">{CURRENT_RELEASE.version}</span>
          </div>
        </div>
      </div>

      {/* Main Apps Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {APPS.map((app) => {
          const arch = selectedArch[app.id] || 'universal';
          const currentFile = arch === 'arm64' ? app.arm64Apk : app.universalApk;
          const isCustomer = app.role === 'customer';

          return (
            <div
              key={app.id}
              className={`relative rounded-3xl p-6 sm:p-7 border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                isCustomer
                  ? 'bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-indigo-500/30 shadow-indigo-950/20 hover:border-indigo-500/50'
                  : 'bg-gradient-to-b from-slate-900/90 to-slate-950/95 border-emerald-500/30 shadow-emerald-950/20 hover:border-emerald-500/50'
              }`}
            >
              {/* Glow accent */}
              <div
                className={`absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 ${
                  isCustomer ? 'bg-indigo-500' : 'bg-emerald-500'
                }`}
              />

              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-md ${
                        isCustomer
                          ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      <Smartphone className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{app.nameFa}</h3>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">{app.packageName}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                      isCustomer
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {app.screenRange}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
                  {app.taglineFa}
                </p>

                {/* Architecture Switcher */}
                <div className="bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800/80 mb-5">
                  <div className="text-[11px] font-medium text-slate-400 px-3 py-1 flex items-center justify-between">
                    <span>انتخاب معماری پردازنده (Architecture):</span>
                    <span className="text-[10px] text-slate-500">حجم تقریبی: {currentFile.sizeEst}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mt-1">
                    <button
                      onClick={() => setSelectedArch((prev) => ({ ...prev, [app.id]: 'universal' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        arch === 'universal'
                          ? isCustomer
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Universal (همه گوشی‌ها)</span>
                    </button>

                    <button
                      onClick={() => setSelectedArch((prev) => ({ ...prev, [app.id]: 'arm64' }))}
                      className={`py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        arch === 'arm64'
                          ? isCustomer
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                            : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <Cpu className="w-3.5 h-3.5" />
                      <span>arm64-v8a (سبک‌تر)</span>
                    </button>
                  </div>
                </div>

                {/* File Details Box */}
                <div className="bg-slate-950/40 border border-slate-800/70 rounded-xl p-3 mb-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">نام فایل:</span>
                    <span className="font-mono text-slate-200 font-semibold">{currentFile.fileName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">سازگاری:</span>
                    <span className="text-slate-300">{currentFile.arch}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">فناوری:</span>
                    <span className="text-indigo-300 font-medium">Jetpack Compose + Kotlin Native</span>
                  </div>
                </div>

                {/* Feature Highlights */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>ویژگی‌های کلیدی این نسخه:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {app.highlights.slice(0, 4).map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2
                          className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                            isCustomer ? 'text-indigo-400' : 'text-emerald-400'
                          }`}
                        />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Actions */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800/70">
                <a
                  href={currentFile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={currentFile.fileName}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                    isCustomer
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>دانلود فایل نصب ({currentFile.fileName}) از گیت‌هاب</span>
                </a>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openQr(app, arch)}
                    className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-indigo-400" />
                    <span>اسکن QR در گوشی</span>
                  </button>

                  <button
                    onClick={() => handleCopy(currentFile.url, currentFile.fileName)}
                    className="py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedId === currentFile.fileName ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">کپی شد!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>کپی لینک مستقیم</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sideloading & Security Notice */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="text-sm font-bold text-white">راهنمای نصب فایل‌های APK در اندروید</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              هنگام نصب فایل ممکن است اندروید پیغام «نصب از منابع ناشناخته» (Install from Unknown Sources) را نمایش دهد. با فعال‌سازی موقت این گزینه برای مرورگر خود، نصب به سرعت و بدون مشکل انجام می‌پذیرد.
            </p>
            <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-slate-400">
              <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
                ✓ سازگار با اندروید ۸ به بالا (API 26+)
              </span>
              <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
                ✓ معماری Kotlin Jetpack Compose مدرن
              </span>
              <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800">
                ✓ سرور OTP کاوه‌نگار امن
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Releases Direct Download Archive */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                مخزن رسمی گیت‌هاب
              </span>
              <span className="text-xs text-slate-400 font-mono">
                github.com/mehdi-fakhraei60/dbax-releases
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-indigo-400" />
              <span>آرشیو نسخه‌های منتشرشده در گیت‌هاب (GitHub Releases Archive)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              تمامی فایل‌های باینری APK مستقیماً از مخزن رسمی گیت‌هاب و با نهایت سرعت قابل دانلود هستند.
            </p>
          </div>

          <a
            href={CURRENT_RELEASE.repoUrl + '/releases'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700 shadow-sm shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
            <span>مشاهده همه در گیت‌هاب</span>
          </a>
        </div>

        {/* Releases List */}
        <div className="space-y-4">
          {GITHUB_RELEASES_ARCHIVE.map((rel) => (
            <div
              key={rel.tag}
              className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                rel.isLatest
                  ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 border-indigo-500/50 shadow-lg shadow-indigo-950/20'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      rel.isLatest
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <FileDown className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white text-sm sm:text-base">{rel.name}</span>
                      {rel.isLatest && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          آخرین نسخه رسمی (Latest)
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="font-mono text-slate-300">{rel.tag}</span>
                      <span>•</span>
                      <span>تاریخ انتشار: {rel.dateShamsi} ({rel.date})</span>
                    </div>
                  </div>
                </div>

                <a
                  href={rel.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition-colors self-start lg:self-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>صفحه انتشار در گیت‌هاب</span>
                </a>
              </div>

              {/* Download Buttons Grid (4 APKs) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                {/* Customer Universal */}
                <a
                  href={rel.customerUniversalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`bax-customer-${rel.tag}.apk`}
                  className="p-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>مشتری Universal</span>
                  </div>
                  <span className="text-[10px] opacity-80">{rel.customerUniversalSize}</span>
                </a>

                {/* Customer ARM64 */}
                <a
                  href={rel.customerArm64Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`bax-customer-arm64-${rel.tag}.apk`}
                  className="p-2.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900 text-indigo-200 hover:text-white border border-indigo-500/20 text-xs font-bold flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                    <span>مشتری ARM64</span>
                  </div>
                  <span className="text-[10px] opacity-80">{rel.customerArm64Size}</span>
                </a>

                {/* Driver Universal */}
                <a
                  href={rel.driverUniversalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`bax-driver-${rel.tag}.apk`}
                  className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-bold flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span>کاپتان Universal</span>
                  </div>
                  <span className="text-[10px] opacity-80">{rel.driverUniversalSize}</span>
                </a>

                {/* Driver ARM64 */}
                <a
                  href={rel.driverArm64Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`bax-driver-arm64-${rel.tag}.apk`}
                  className="p-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900 text-emerald-200 hover:text-white border border-emerald-500/20 text-xs font-bold flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>کاپتان ARM64</span>
                  </div>
                  <span className="text-[10px] opacity-80">{rel.driverArm64Size}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Modal */}
      <QrModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        url={modalState.url}
        directUrl={modalState.directUrl}
        fileName={modalState.fileName}
        arch={modalState.arch}
        fileSize={modalState.fileSize}
      />
    </div>
  );
};
