import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Camera,
  MapPin,
  CreditCard,
  Download,
  QrCode,
  Search,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Filter,
  Check,
  ChevronRight,
  Info,
  Clock,
  Key,
  Flame,
  Link2,
  FileCode,
  Copy,
  Mail,
  Bike,
  Radio,
  RefreshCw
} from 'lucide-react';
import { ALL_CUSTOMER_SCREENS, CustomerScreenDetail } from '../data/customerFullDirectory';
import { CUSTOMER_GAP_ANALYSIS, GapItem } from '../data/customerGapAnalysis';
import { APPS, CURRENT_RELEASE } from '../data/releases';
import { CustomerAppSimulator } from './CustomerAppSimulator';
import { CaptainAppSimulator } from './CaptainAppSimulator';
import { EnterpriseEcosystemView } from './EnterpriseEcosystemView';
import { QrModal } from './QrModal';
import { MODUALS2_CONFIG } from '../moduals2';

export const CustomerMasterView: React.FC = () => {
  const customerApp = APPS.find((a) => a.id === 'customer')!;
  const [subTab, setSubTab] = useState<'simulator' | 'captain' | 'dual' | 'allScreens' | 'gapAnalysis' | 'enterprise' | 'developerSpecs'>('simulator');

  // Search & Filters for screens list
  const [screenSearch, setScreenSearch] = useState('');
  const [screenCategory, setScreenCategory] = useState<string>('all');

  // QR Modal
  const [qrOpen, setQrOpen] = useState(false);
  const [arch, setArch] = useState<'arm64' | 'universal'>('arm64');
  const activeFile = arch === 'arm64' ? customerApp.arm64Apk : customerApp.universalApk;

  // Copy indicator
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredScreens = ALL_CUSTOMER_SCREENS.filter((s) => {
    if (screenCategory !== 'all' && s.category !== screenCategory) return false;
    if (screenSearch.trim()) {
      const q = screenSearch.toLowerCase();
      return (
        s.code.toLowerCase().includes(q) ||
        s.nameFa.toLowerCase().includes(q) ||
        s.composeComponent.toLowerCase().includes(q) ||
        s.descriptionFa.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'همه صفحات (۳۸ صفحه)' },
    { id: 'onboarding', label: 'ورود و ثبت‌نام (C01-C04)' },
    { id: 'order', label: 'نقشه و سفارش (C05, C06, C14)' },
    { id: 'camera', label: 'ماژول دوربین AR (C07a/b/c)' },
    { id: 'fleet', label: 'ناوگان و گزینه‌ها (C08, C09)' },
    { id: 'payment', label: 'کیف پول و فاکتور (C10-C13)' },
    { id: 'tracking', label: 'رهگیری لایو و چت (C15-C24)' },
    { id: 'delivery', label: 'تحویل امن و امتیاز (C30, C31, C35)' },
    { id: 'history', label: 'سوابق و آدرس‌ها (C36, C37)' },
    { id: 'profile', label: 'پروفایل و آپدیتر (C38)' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Android Live Sync & Cache Purge Notice Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
              <span>کاپتان تستی تایید شده: ۰۹۳۹۹۸۸۷۷۸۲</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                CAP-9882 (فعال)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              سیستم دیسپچ زنده فعال است. درخواست‌های ثبت‌شده در اپ مشتری مستقیماً در رادار کاپتان زنگ می‌خورد و نمایش داده می‌شود.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if ('caches' in window) {
                caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))));
              }
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then((regs) => {
                  regs.forEach((r) => r.unregister());
                });
              }
              window.location.reload();
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>بروزرسانی فوری کش روی اندروید</span>
          </button>
        </div>
      </div>

      {/* Top Navigation Mode Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setSubTab('simulator')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'simulator'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>اپلیکیشن مسافر (مشتری)</span>
          </button>

          <button
            onClick={() => setSubTab('captain')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'captain'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-emerald-400/90 hover:text-emerald-200 hover:bg-emerald-950/40'
            }`}
          >
            <Bike className="w-4 h-4 text-emerald-400" />
            <span>اپلیکیشن کاپتان (۰۹۳۹۹۸۸۷۷۸۲)</span>
          </button>

          <button
            onClick={() => setSubTab('dual')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'dual'
                ? 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-indigo-300 hover:text-white hover:bg-indigo-950/40'
            }`}
          >
            <Radio className="w-4 h-4 text-amber-400" />
            <span>شبیه‌ساز همزمان دوطرفه (مسافر + کاپتان)</span>
          </button>

          <button
            onClick={() => setSubTab('allScreens')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'allScreens'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>کاتالوگ ۳۸ صفحه (C01-C38)</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-950 text-[11px] font-mono border border-slate-800 text-indigo-300">
              {ALL_CUSTOMER_SCREENS.length}
            </span>
          </button>

          <button
            onClick={() => setSubTab('gapAnalysis')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'gapAnalysis'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/30'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>ماژول‌های متصل (moduals2)</span>
          </button>

          <button
            onClick={() => setSubTab('enterprise')}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'enterprise'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'text-purple-300/80 hover:text-purple-200 hover:bg-purple-950/30'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>اکوسیستم لجستیک و B2B</span>
          </button>
        </div>

        {/* Quick APK action */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setQrOpen(true)}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">اسکن بارکد دانلود</span>
          </button>
          <a
            href={activeFile.url}
            target="_blank"
            rel="noopener noreferrer"
            download={activeFile.fileName}
            className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>دانلود APK مشتری از گیت‌هاب</span>
          </a>
        </div>
      </div>

      {/* SUBTAB 1: LIVE SIMULATOR (CUSTOMER) */}
      {subTab === 'simulator' && <CustomerAppSimulator />}

      {/* SUBTAB 2: CAPTAIN APP SIMULATOR (09399887782) */}
      {subTab === 'captain' && <CaptainAppSimulator />}

      {/* SUBTAB 3: DUAL SIMULATOR (CUSTOMER + CAPTAIN SIDE-BY-SIDE) */}
      {subTab === 'dual' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/40 text-center space-y-2">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center justify-center gap-2">
              <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />
              <span>شبیه‌ساز زنده دوطرفه: مسافر (چپ) + کاپتان ۰۹۳۹۹۸۸۷۷۸۲ (راست)</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">
              با فشردن «ثبت درخواست و اعزام کاپتان» در گوشی مسافر، گوشی کاپتان فوراً زنگ می‌خورد و درخواست سفر با جزئیات کامل و کرایه نمایش داده می‌شود. با فشردن «پذیرش سفر» در اپ کاپتان، گوشی مسافر فوراً وارد مرحله رهگیری زنده می‌شود.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 text-center text-xs font-bold text-indigo-300">
                گوشی شماره ۱: اپلیکیشن مشتری (مسافر)
              </div>
              <CustomerAppSimulator />
            </div>

            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-center text-xs font-bold text-emerald-300">
                گوشی شماره ۲: اپلیکیشن کاپتان (۰۹۳۹۹۸۸۷۷۸۲)
              </div>
              <CaptainAppSimulator />
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: COMPLETE SCREENS DIRECTORY C01-C38 */}
      {subTab === 'allScreens' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
                  <Layers className="w-6 h-6 text-indigo-400" />
                  <span>اطلس و مشخصات کامل ۳۸ صفحه اپلیکیشن مشتری (C01 تا C38)</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  تک‌تک صفحات با ذکر نام کامپوننت Jetpack Compose، روت ناوبری، ورودی‌ها و خروجی‌های موردنیاز
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-400">
                <span>پکیج نیتیو:</span>
                <span className="text-indigo-400 font-bold">ir.dbax.app</span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="pt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={screenSearch}
                  onChange={(e) => setScreenSearch(e.target.value)}
                  placeholder="جستجو بر اساس کد (C07a, C18, C38)، نام صفحه یا کامپوننت Compose..."
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setScreenCategory(c.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                      screenCategory === c.id
                        ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                        : 'text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-950'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScreens.map((screen) => (
              <div
                key={screen.code}
                className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 hover:border-slate-700 transition-all flex flex-col justify-between hover:bg-slate-900/90"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {screen.code}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {screen.categoryLabelFa}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">{screen.nameFa}</h3>
                  <div className="text-[11px] font-mono text-slate-400 mb-2">{screen.composeComponent}</div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{screen.descriptionFa}</p>

                  {/* Highlights */}
                  <div className="space-y-1 mb-4">
                    {screen.featuresFa.map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[10px] space-y-1.5 font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Route:</span>
                    <span className="text-indigo-400">{screen.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ورودی‌ها:</span>
                    <span className="text-slate-300">{screen.inputsNeeded.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 3: GAP ANALYSIS & CONNECTED MODUALS2 ADAPTERS */}
      {subTab === 'gapAnalysis' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Executive Summary Card */}
          <div className="rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
                <Link2 className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  اتصال به ریپوی {MODUALS2_CONFIG.repoUrl}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  یکپارچه‌سازی ماژول‌ها، آداپتورها و گیت‌وی‌های آماده moduals2
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  کلیه ماژول‌ها، آداپتورهای ارتباطی، لاجیک‌های محاسباتی و گیت‌وی‌ها از مخزن <code className="text-emerald-300 font-mono">moduals2</code> بدون نیاز به بازتولید، متصل شده و در اپلیکیشن مشتری فراخوانی شده‌اند:
                </p>
              </div>
            </div>
          </div>

          {/* Connected Checklist Items */}
          <div className="space-y-4">
            {CUSTOMER_GAP_ANALYSIS.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className="rounded-2xl p-5 sm:p-6 border bg-slate-900/80 border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-950 flex items-center justify-center font-mono font-bold text-xs text-slate-400 border border-slate-800 shrink-0">
                        0{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">{item.titleFa}</h3>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border bg-emerald-500/20 text-emerald-300 border-emerald-500/40 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>متصل</span>
                          </span>
                        </div>
                        <span className="text-xs text-slate-400">{item.categoryFa}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300">
                        {item.moduals2Adapter}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-800/80">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                      <div className="text-slate-300 font-bold flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-400" />
                        <span>نیاز عملکردی:</span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{item.missingDetailsFa}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>آداپتور و لاجیک متصل‌شده از moduals2:</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{item.solutionActionFa}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 4: ENTERPRISE & LOGISTICS ECOSYSTEM */}
      {subTab === 'enterprise' && <EnterpriseEcosystemView />}

      {/* SUBTAB 5: DEVELOPER TECHNICAL SPECS (MANIFEST & VERSION JSON) */}
      {subTab === 'developerSpecs' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5 mb-2">
              <FileCode className="w-6 h-6 text-indigo-400" />
              <span>مستندات و قراردادهای فنی اندروید (Kotlin Specs)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl">
              فایل‌های قرارداد رسمی ایجاد شده در این ریپو که برای توسعه نیتیو اندروید Jetpack Compose و تست آپدیتر مورد استفاده قرار می‌گیرند:
            </p>
          </div>

          {/* Section 1: version.json spec */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">۱. قرارداد متادیتای نسخه‌ها (version.json)</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  HTTP 200 OK
                </span>
              </div>
              <button
                onClick={() => handleCopyText('http://localhost:3000/version.json', 'vJson')}
                className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 font-mono"
              >
                {copiedKey === 'vJson' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'vJson' ? 'کپی شد' : 'کپی آدرس API'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">
              این فایل در مسیر <code className="text-indigo-300 font-mono">/version.json</code> و ریشه ریپو قرار دارد و توسط آپدیتر صفحه C38 فراخوانی می‌شود.
            </p>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto dir-ltr text-left">
{`{
  "schemaVersion": 1,
  "appId": "ir.dbax.app",
  "appName": "Bax",
  "latestVersion": "1.0.0-preview5",
  "versionCode": 5,
  "minSupportedVersionCode": 1,
  "forceUpdate": false,
  "artifacts": {
    "customer": {
      "packageName": "ir.dbax.app",
      "universal": { "fileName": "bax-customer.apk", "sizeEst": "34.2 MB" },
      "arm64": { "fileName": "bax-customer-arm64.apk", "sizeEst": "26.8 MB" }
    }
  }
}`}
            </pre>
          </div>

          {/* Section 2: AndroidManifest.xml spec */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">۲. مشخصات رسمی AndroidManifest.xml</span>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded">
                  Target SDK 35
                </span>
              </div>
              <a
                href="/android-manifest-spec.xml"
                target="_blank"
                className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>مشاهده فایل خام XML</span>
              </a>
            </div>
            <p className="text-xs text-slate-400">
              شامل مجوزهای دقیق دوربین AR، موقعیت نشان، تماس امن، نوتیفیکیشن‌ها و کانفیگ FileProvider آپدیتر در مسیر <code className="text-indigo-300 font-mono">/android-manifest-spec.xml</code>.
            </p>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto dir-ltr text-left">
{`<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="ir.dbax.app">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
</manifest>`}
            </pre>
          </div>
        </div>
      )}

      {/* QR Modal */}
      <QrModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        title={`${customerApp.nameFa} (${activeFile.arch})`}
        url={activeFile.url}
        directUrl={activeFile.directUrl}
        fileName={activeFile.fileName}
        arch={activeFile.arch}
        fileSize={activeFile.sizeEst}
      />
    </div>
  );
};
