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
  RefreshCw
} from 'lucide-react';
import { APPS, AppRelease, CURRENT_RELEASE } from '../data/releases';
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
    fileName: string;
    arch: string;
    fileSize: string;
  }>({
    isOpen: false,
    title: '',
    url: '',
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
                  download={currentFile.fileName}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                    isCustomer
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>دانلود فایل نصب ({currentFile.fileName})</span>
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

      {/* QR Modal */}
      <QrModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        title={modalState.title}
        url={modalState.url}
        fileName={modalState.fileName}
        arch={modalState.arch}
        fileSize={modalState.fileSize}
      />
    </div>
  );
};
