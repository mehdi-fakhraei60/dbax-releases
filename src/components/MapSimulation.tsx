import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Bike, 
  Camera, 
  Search, 
  Compass, 
  Clock, 
  ShieldCheck, 
  Box, 
  Play, 
  RotateCcw,
  Maximize2
} from 'lucide-react';

export const MapSimulation: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [driverProgress, setDriverProgress] = useState(35); // 0 to 100%
  const [selectedDestination, setSelectedDestination] = useState<'saadat' | 'tajrish' | 'tehranpars'>('saadat');
  const [cameraMeasured, setCameraMeasured] = useState<{
    length: number;
    width: number;
    height: number;
    weightTier: string;
  } | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Animated driver movement along the route
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setDriverProgress((prev) => (prev >= 100 ? 0 : prev + 2));
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const destinations = {
    saadat: {
      name: 'سعادت‌آباد، بلوار فرهنگ',
      distance: '۹.۴ کیلومتر',
      eta: '۱۸ دقیقه',
      routeColor: '#6366f1',
    },
    tajrish: {
      name: 'میدان تجریش، خیابان فناخسرو',
      distance: '۱۲.۲ کیلومتر',
      eta: '۲۴ دقیقه',
      routeColor: '#10b981',
    },
    tehranpars: {
      name: 'تهرانپارس، فلکه اول',
      distance: '۱۴.۸ کیلومتر',
      eta: '۲۹ دقیقه',
      routeColor: '#0ea5e9',
    },
  };

  const currentDest = destinations[selectedDestination];

  const handleSimulateCameraMeasure = () => {
    setIsMeasuring(true);
    setTimeout(() => {
      setCameraMeasured({
        length: 32,
        width: 24,
        height: 18,
        weightTier: 'کلاس استاندارد (تا ۵ کیلوگرم)',
      });
      setIsMeasuring(false);
    }, 1200);
  };

  // Compute simulated driver coordinates on SVG path
  // Origin (x: 80, y: 300) to Destination (x: 420, y: 90)
  const driverX = 80 + (420 - 80) * (driverProgress / 100);
  const driverY = 300 - Math.sin((driverProgress / 100) * Math.PI) * 120 - ((300 - 90) * (driverProgress / 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-2">
              <Navigation className="w-3.5 h-3.5" />
              <span>دموی یکپارچه‌سازی نقشه نشان (Neshan Map SDK)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              رهگیری زنده حرکت سفیر و اندازه‌گیری هوشمند با دوربین (C07)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              پیش‌نمایش عملکرد موتور مسیریابی نشان، مارکر متحرک سفیر، ژئوکدینگ معکوس و ماژول دوربین AR مرسوله
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 hover:text-white flex items-center gap-2"
            >
              {isPlaying ? 'توقف انیمیشن' : 'ادامه حرکت'}
            </button>
            <button
              onClick={() => setDriverProgress(0)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-400 hover:text-white"
              title="شروع مجدد مسیر"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interactive Map & Route Container */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Canvas (Left 2 cols) */}
          <div className="lg:col-span-2 relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden min-h-[380px] flex flex-col justify-between shadow-inner">
            {/* Map Header Overlay */}
            <div className="absolute top-3 right-3 left-3 z-10 flex items-center justify-between pointer-events-none">
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs flex items-center gap-2 pointer-events-auto shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-slate-300 font-medium">موتور نقشه نشان (Neshan Vector Map)</span>
              </div>

              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs font-mono text-indigo-400 pointer-events-auto">
                پیشرفت مسیر: {driverProgress}٪
              </div>
            </div>

            {/* Simulated Vector Map SVG */}
            <svg
              className="w-full h-[380px] bg-slate-950"
              viewBox="0 0 500 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid / City Road Grid */}
              <defs>
                <pattern id="roadGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="2,4" />
                </pattern>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              <rect width="500" height="380" fill="url(#roadGrid)" />

              {/* City landmark blocks */}
              <rect x="50" y="50" width="80" height="60" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <rect x="200" y="40" width="90" height="70" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <rect x="340" y="140" width="100" height="90" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <rect x="150" y="240" width="110" height="70" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />

              {/* Highway lines */}
              <path d="M 0 180 Q 250 160 500 200" stroke="#334155" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
              <path d="M 220 0 Q 240 200 230 380" stroke="#334155" strokeWidth="6" strokeLinecap="round" opacity="0.6" />

              {/* Active Route Path */}
              <path
                d="M 80 300 C 140 280, 200 160, 280 180 C 340 200, 380 130, 420 90"
                stroke="url(#routeGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />

              {/* Origin Marker */}
              <g transform="translate(80, 300)">
                <circle r="12" fill="#22c55e" fillOpacity="0.2" className="animate-ping" />
                <circle r="7" fill="#22c55e" stroke="#ffffff" strokeWidth="2" />
                <text x="12" y="4" fill="#86efac" fontSize="10" fontFamily="Vazirmatn">مبدا: میدان ولیعصر</text>
              </g>

              {/* Destination Marker */}
              <g transform="translate(420, 90)">
                <circle r="12" fill="#ef4444" fillOpacity="0.2" />
                <circle r="7" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <text x="-90" y="4" fill="#fca5a5" fontSize="10" fontFamily="Vazirmatn">مقصد: {currentDest.name}</text>
              </g>

              {/* Moving Driver Marker */}
              <g transform={`translate(${driverX}, ${driverY})`}>
                <circle r="16" fill="#6366f1" fillOpacity="0.3" className="animate-pulse" />
                <circle r="9" fill="#4f46e5" stroke="#ffffff" strokeWidth="2" />
                {/* Direction pointer */}
                <polygon points="0,-12 4,-5 -4,-5" fill="#ffffff" />
              </g>
            </svg>

            {/* Bottom Floating Card */}
            <div className="absolute bottom-3 right-3 left-3 bg-slate-900/90 backdrop-blur-md rounded-xl p-3 border border-slate-700/80 flex items-center justify-between text-xs shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-white font-bold flex items-center gap-1.5">
                    <span>سفیر علیرضا ر. (موتور باکس)</span>
                    <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">★ ۴.۹</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    پلاک: ۱۲۳ - ۷۸ ب ۹۹ • در حال حرکت به سمت مقصد
                  </div>
                </div>
              </div>

              <div className="text-left font-mono">
                <div className="text-emerald-400 font-bold">{currentDest.eta} تا تحویل</div>
                <div className="text-slate-400 text-[11px]">{currentDest.distance} باقی‌مانده</div>
              </div>
            </div>
          </div>

          {/* Right Col: Controls & C07 Camera Measurement Tool */}
          <div className="space-y-4">
            {/* Destination Selector */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                <span>شبیه‌سازی تغییر مقصد در نقشه نشان:</span>
              </h4>
              <div className="space-y-2">
                {(['saadat', 'tajrish', 'tehranpars'] as const).map((destKey) => (
                  <button
                    key={destKey}
                    onClick={() => setSelectedDestination(destKey)}
                    className={`w-full text-right p-2.5 rounded-xl text-xs transition-all border ${
                      selectedDestination === destKey
                        ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div>{destinations[destKey].name}</div>
                    <div className="text-[10px] opacity-75 mt-0.5 font-mono">
                      {destinations[destKey].distance} • {destinations[destKey].eta}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* C07 Camera Measurement Simulation */}
            <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ماژول دوربین C07a/b/c</span>
                </h4>
                <span className="text-[10px] text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  AR Measure
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                در صفحه C07 کلاینت باکس، مشتری با دوربین گوشی ابعاد بسته را اسکن می‌کند تا کرایه دقیق محاسبه شود.
              </p>

              <button
                onClick={handleSimulateCameraMeasure}
                disabled={isMeasuring}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <Camera className="w-4 h-4 text-indigo-400" />
                <span>{isMeasuring ? 'در حال پردازش سنسور دوربین...' : 'تست اسکن ابعاد مرسوله'}</span>
              </button>

              {cameraMeasured && (
                <div className="mt-3 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1.5 animate-in fade-in">
                  <div className="flex justify-between text-slate-300">
                    <span>ابعاد شناسایی‌شده:</span>
                    <span className="font-mono text-indigo-300">
                      {cameraMeasured.length} × {cameraMeasured.width} × {cameraMeasured.height} cm
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>کلاس وزنی مرسوله:</span>
                    <span className="text-emerald-400 font-medium">{cameraMeasured.weightTier}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
