import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Bike,
  Phone,
  ShieldCheck,
  Clock,
  Package,
  Navigation,
  CheckCircle2,
  Share2,
  ExternalLink,
  RotateCcw
} from 'lucide-react';

interface ReceiverTrackingProps {
  trackingCode?: string;
}

export const ReceiverTrackingView: React.FC<ReceiverTrackingProps> = ({
  trackingCode = 'TRK-1403-8842',
}) => {
  const [progress, setProgress] = useState(48); // 0 to 100%
  const [etaMinutes, setEtaMinutes] = useState(12);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        const next = p + 2;
        setEtaMinutes(Math.max(1, Math.round(18 * (1 - next / 100))));
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Simulated courier coordinates on SVG route
  const courierX = 80 + (420 - 80) * (progress / 100);
  const courierY = 300 - Math.sin((progress / 100) * Math.PI) * 120 - ((300 - 90) * (progress / 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>کاپتان در حال حرکت به سمت شما</span>
              </span>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-slate-950 text-indigo-300 border border-slate-800 font-bold">
                {trackingCode}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              صفحه وب رهگیری زنده مرسوله (C21 • گیرنده بدون نیاز به نصب اپ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              این لینک از طریق پیامک برای تحویل‌گیرنده ارسال می‌شود تا موقعیت زنده پیک را روی نقشه مشاهده کند.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:text-white"
            >
              {isPlaying ? 'توقف حرکت' : 'ادامه حرکت'}
            </button>
            <button
              onClick={() => {
                setProgress(20);
                setEtaMinutes(15);
              }}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              title="ریست مسیر"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Vector Map Simulation */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden min-h-[360px] flex flex-col justify-between shadow-inner">
            <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs flex items-center gap-2 pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300 font-medium">موتور نقشه نشان (Neshan Live Map)</span>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-mono text-emerald-400 pointer-events-auto">
                زمان تقریبی: {etaMinutes} دقیقه
              </div>
            </div>

            {/* Simulated Vector Map */}
            <svg className="w-full h-[360px] bg-slate-950" viewBox="0 0 500 360" fill="none">
              <defs>
                <pattern id="recRoadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,4" />
                </pattern>
                <linearGradient id="recRouteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              <rect width="500" height="360" fill="url(#recRoadGrid)" />

              {/* Highway lines */}
              <path d="M 0 180 Q 250 160 500 200" stroke="#334155" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              <path d="M 220 0 Q 240 200 230 360" stroke="#334155" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

              {/* Active Route Path */}
              <path
                d="M 80 300 C 140 280, 200 160, 280 180 C 340 200, 380 130, 420 90"
                stroke="url(#recRouteGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Origin Marker */}
              <g transform="translate(80, 300)">
                <circle r="6" fill="#64748b" />
                <text x="12" y="4" fill="#94a3b8" fontSize="10" fontFamily="Vazirmatn">مبدا: میدان انقلاب</text>
              </g>

              {/* Destination Marker */}
              <g transform="translate(420, 90)">
                <circle r="12" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                <circle r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <text x="-120" y="4" fill="#fca5a5" fontSize="10" fontFamily="Vazirmatn">مقصد: سعادت‌آباد، بلوار فرهنگ</text>
              </g>

              {/* Moving Driver Marker */}
              <g transform={`translate(${courierX}, ${courierY})`}>
                <circle r="16" fill="#10b981" fillOpacity="0.3" className="animate-pulse" />
                <circle r="9" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                <polygon points="0,-12 4,-5 -4,-5" fill="#ffffff" />
              </g>
            </svg>

            {/* Bottom floating details */}
            <div className="absolute bottom-3 right-3 left-3 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-bold">کاپتان مهدی (موتور آپاچی ۲۰۰) • ۰۹۳۹۹۸۸۷۷۸۲</div>
                  <div className="text-[11px] text-slate-400 font-mono">پلاک: ایران ۱۱ - ۴۸۲ ب ۹۹ • کد CAP-9882</div>
                </div>
              </div>
              <div className="text-left font-mono text-emerald-400 font-bold">
                {progress}٪ طی شده
              </div>
            </div>
          </div>

          {/* Right Column: Security Code & Handshake Card */}
          <div className="space-y-4">
            <div className="bg-slate-950/80 rounded-2xl p-5 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>کد امنیتی تحویل کالا (صفحه C30)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                این کد ۴ رقمی را در لحظه تحویل بسته به کاپتان تحویل دهید تا بسته به شما تحویل داده شود:
              </p>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                <span className="font-mono text-3xl font-black text-emerald-400 tracking-widest">
                  ۴۸۹۲
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">رمز یکبار مصرف تحویل</span>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 text-xs space-y-2">
              <div className="text-slate-300 font-bold mb-1">مشخصات مرسوله:</div>
              <div className="flex justify-between text-slate-400">
                <span>نوع وسیله:</span>
                <span className="text-slate-200">موتور باکس‌دار عایق</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>تحویل تضمینی:</span>
                <span className="text-emerald-400 font-bold">دارد (بیمه‌شده)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>فرستنده:</span>
                <span className="text-slate-200">مهدی فخرایی</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
