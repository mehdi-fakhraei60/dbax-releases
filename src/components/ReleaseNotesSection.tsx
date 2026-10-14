import React, { useState } from 'react';
import { 
  FileText, 
  MapPin, 
  Key, 
  CreditCard, 
  RefreshCw, 
  DollarSign, 
  Smartphone, 
  Layers, 
  Code2, 
  Copy, 
  Check 
} from 'lucide-react';
import { CURRENT_RELEASE } from '../data/releases';

export const ReleaseNotesSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState(false);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(CURRENT_RELEASE.notesRaw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const featureCards = [
    {
      title: 'پوشش کامل صفحات (C01–C38 و D00–D38)',
      desc: 'تمامی صفحات کلاینت مشتری و اپلیکیشن سفیران پیاده‌سازی شده، از جمله فرآیند دوربین C07a/b/c برای اندازه‌گیری و تایید ابعاد مرسوله.',
      icon: Layers,
      color: 'from-blue-500/20 to-indigo-500/10 text-indigo-400 border-indigo-500/30',
    },
    {
      title: 'نقشه زنده نشان (Neshan Live Map)',
      desc: 'تشخیص موقعیت کاربر، انتخاب مبدا/مقصد روی نقشه با ژئوکدینگ معکوس، جستجوی اماکن، مسیریابی هوشمند و حرکت زنده نشانگر سفیر.',
      icon: MapPin,
      color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'ورود پیامکی کاوه‌نگار (Kavenegar OTP)',
      desc: 'احراز هویت بدون رمز عبور برای هر دو اپلیکیشن مشتری و سفیر، با کلیدهای محرمانه ذخیره شده صرفاً در سمت سرور امن.',
      icon: Key,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    },
    {
      title: 'کیف پول و تحویل تضمینی (Wallet & Invoices)',
      desc: 'امکان پرداخت از موجودی کیف پول، صدور فاکتور رسمی، و ارائه گزینه تحویل تضمینی کالا با کد تایید امنیتی.',
      icon: CreditCard,
      color: 'from-purple-500/20 to-fuchsia-500/10 text-purple-400 border-purple-500/30',
    },
    {
      title: 'به‌روزرسان درون‌برنامه‌ای (In-App Updater)',
      desc: 'بررسی خودکار نسخه‌های جدید در صفحه حساب کاربری و دریافت مستقیم فایل‌های APK از همین مخزن گیت‌هاب عمومی.',
      icon: RefreshCw,
      color: 'from-sky-500/20 to-cyan-500/10 text-sky-400 border-sky-500/30',
    },
    {
      title: 'مدل اقتصادی جدید سفیران (۰٪ کارمزد)',
      desc: 'پرداخت هزینه ورودی + اشتراک ماهانه، دستمزد ثابت تضمین‌شده برای هر بلوک ۸ ساعته و صفر درصد کمیسیون از کرایه سفرها.',
      icon: DollarSign,
      color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header card */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
                RELEASE NOTES
              </span>
              <span className="text-xs text-slate-400">فایل مرجع: notes/v1.0.0-preview5.md</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{CURRENT_RELEASE.name}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Native Kotlin + Jetpack Compose • ir.dbax.app & ir.dbax.app.driver
            </p>
          </div>

          {/* Toggle view mode */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
              <button
                onClick={() => setViewMode('formatted')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  viewMode === 'formatted'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                نمایش ساختاریافته
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                  viewMode === 'raw'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>متن خام Markdown</span>
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'formatted' ? (
          <div className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureCards.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={index}
                    className={`rounded-2xl p-5 border bg-gradient-to-b ${feat.color} bg-slate-950/60 backdrop-blur-sm transition-all hover:translate-y-[-2px]`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center mb-3.5">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{feat.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Architecture Details Box */}
            <div className="rounded-2xl bg-slate-950/70 border border-slate-800/90 p-5 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                <span>مشخصات فنی و پکیج‌های اندروید (Technical Architecture)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 mb-1">Customer App (مشتری):</div>
                  <div className="text-indigo-400 font-bold">Package: ir.dbax.app</div>
                  <div className="text-slate-500 text-[11px] mt-1">Screens: C01 to C38 + C07a/b/c</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 mb-1">Driver App (سفیر):</div>
                  <div className="text-emerald-400 font-bold">Package: ir.dbax.app.driver</div>
                  <div className="text-slate-500 text-[11px] mt-1">Screens: D00 to D38</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-6">
            <div className="flex items-center justify-between pb-2 text-xs text-slate-400">
              <span>محتوای مستقیم فایل notes/v1.0.0-preview5.md</span>
              <button
                onClick={handleCopyRaw}
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'کپی شد' : 'کپی کل متن'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed dir-ltr text-left">
              {CURRENT_RELEASE.notesRaw}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
