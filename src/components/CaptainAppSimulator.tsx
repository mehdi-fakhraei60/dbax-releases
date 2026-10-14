import React, { useState, useEffect } from 'react';
import {
  Bike,
  CheckCircle2,
  Phone,
  Navigation,
  MapPin,
  Clock,
  DollarSign,
  AlertCircle,
  ShieldCheck,
  Power,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Package,
  Layers,
  Check,
  Send,
  Radio,
  ExternalLink,
  Volume2
} from 'lucide-react';
import {
  CaptainDispatchBridge,
  ActiveTrip,
  CaptainProfile,
  PRE_APPROVED_TEST_CAPTAIN
} from '../moduals2/dispatch/captainDispatchBridge';
import { SoundEffects } from '../moduals2/audio/soundEffects';

export const CaptainAppSimulator: React.FC = () => {
  const [captain, setCaptain] = useState<CaptainProfile>(CaptainDispatchBridge.getCaptain());
  const [activeTrip, setActiveTrip] = useState<ActiveTrip | null>(CaptainDispatchBridge.getActiveTrip());
  const [securityInput, setSecurityInput] = useState('');
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'radar' | 'earnings' | 'profile'>('radar');

  useEffect(() => {
    const unsubscribe = CaptainDispatchBridge.subscribe((trip) => {
      setActiveTrip(trip);
      if (trip && trip.status === 'searching') {
        SoundEffects.playPop();
      }
    });
    return () => unsubscribe();
  }, []);

  const handleToggleOnline = () => {
    const nextState = !captain.isOnline;
    CaptainDispatchBridge.setCaptainOnline(nextState);
    setCaptain({ ...captain, isOnline: nextState });
    SoundEffects.playPop();
  };

  const handleAcceptTrip = () => {
    if (!activeTrip) return;
    CaptainDispatchBridge.acceptTrip(activeTrip.id, captain);
    SoundEffects.playSuccess();
  };

  const handleArrivedAtPickup = () => {
    if (!activeTrip) return;
    CaptainDispatchBridge.captainArrivedAtPickup(activeTrip.id);
    SoundEffects.playPop();
  };

  const handleConfirmPackagePickedUp = () => {
    if (!activeTrip) return;
    CaptainDispatchBridge.confirmPackagePickedUp(activeTrip.id);
    SoundEffects.playSuccess();
  };

  const handleSimulateCustomerPayment = () => {
    if (!activeTrip) return;
    CaptainDispatchBridge.confirmFarePayment(activeTrip.id);
    SoundEffects.playSuccess();
  };

  const handleCompleteDelivery = () => {
    if (!activeTrip) return;
    const res = CaptainDispatchBridge.completeDelivery(activeTrip.id, securityInput || '4892');
    if (!res.success) {
      setSecurityError(res.errorFa || 'کد امنیتی نادرست است');
      SoundEffects.playAlert();
    } else {
      setSecurityError(null);
      SoundEffects.playSuccess();
    }
  };

  const handleTriggerTestTrip = () => {
    CaptainDispatchBridge.createTripRequest({
      customerName: 'مهدی فخرایی',
      customerPhone: '09121112233',
      pickupTitle: 'میدان ولیعصر، کوچه فیروزه',
      pickupAddress: 'تهران، میدان ولیعصر، کوچه فیروزه، پلاک ۱۲، واحد ۴',
      destinations: [
        {
          id: 'dest-1',
          title: 'بلوار کشاورز، پلاک ۸۵',
          address: 'تهران، بلوار کشاورز، تقاطع کارگر شمالی، پلاک ۸۵، شرکت بازرگانی',
          recipientName: 'رضا حسینی',
          recipientPhone: '09351234567',
          status: 'pending'
        }
      ],
      packageType: 'بسته متوسط تجاری (کارتن ابعاد ۳۰×۲۰×۱۵)',
      packageDims: { lengthCm: 30, widthCm: 20, heightCm: 15, weightKg: 2.5 },
      vehicleType: 'box_bike',
      vehicleTitleFa: 'موتور باکس‌دار استاندارد',
      fareAmount: 78000
    });
    SoundEffects.playPop();
  };

  const handleResetTrip = () => {
    CaptainDispatchBridge.resetDemoTrip();
    setSecurityInput('');
    setSecurityError(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
      {/* Control & Test Panel on Left/Top */}
      <div className="w-full lg:w-80 space-y-4">
        {/* Verification Status Card */}
        <div className="p-5 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">پنل اعتبارسنجی کاپتان</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3 h-3" />
              تایید رسمی سیستم
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-black text-white">{captain.name}</div>
              <div className="text-xs text-emerald-400 font-mono font-bold mt-0.5">
                {captain.phone}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">کد پرسنلی کاپتان:</span>
              <span className="font-mono font-bold text-white">{captain.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">وسیله نقلیه:</span>
              <span>{captain.vehicle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">پلاک ثبت‌شده:</span>
              <span className="font-mono text-slate-200">{captain.plate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">کمیسیون باکس:</span>
              <span className="text-emerald-400 font-bold font-mono">۰٪ (صفر درصد واقعی)</span>
            </div>
          </div>
        </div>

        {/* Live Trip Dispatch Test Trigger */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-indigo-400 animate-pulse" />
              رادار دیسپچ و تست سفر
            </span>
            <span className="text-[10px] text-slate-400">همگام با اپ مشتری</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            این شبیه‌ساز مستقیماً به سیستم سفارش‌گذاری متصل است. می‌توانید از اپ مشتری سفارش ثبت کنید یا مستقیماً یک سفر تستی به این کاپتان ارسال نمایید.
          </p>
          <div className="space-y-2">
            <button
              onClick={handleTriggerTestTrip}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              ارسال درخواست سفر تستی به 09399887782
            </button>
            {activeTrip && (
              <button
                onClick={handleResetTrip}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                ریست کردن وضعیت سفر فعلی
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 space-y-1">
          <div className="font-bold flex items-center gap-1 text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            تغییر جریان پرداخت طبق دستور:
          </div>
          <p className="text-[11px] text-indigo-200/90 leading-relaxed">
            ۱. درخواست بدون کسر پول ثبت می‌شود.{'\n'}
            ۲. کاپتان درخواست را می‌پذیرد و به مبدا می‌رسد.{'\n'}
            ۳. بسته فیزیکی رویت و تحویل گرفته می‌شود.{'\n'}
            ۴. مشتری واریزی کرایه را تایید می‌کند.{'\n'}
            ۵. کالا به مقصد منتقل شده و با رمز ۴ رقمی تحویل می‌گردد.
          </p>
        </div>
      </div>

      {/* Mobile Device Frame - Native Captain App */}
      <div className="relative mx-auto w-[360px] sm:w-[380px] h-[760px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700 flex flex-col justify-between overflow-hidden select-none">
        {/* Device Notch & Status Bar */}
        <div className="flex items-center justify-between px-4 pt-2 pb-1 text-slate-400 text-xs shrink-0 border-b border-slate-900">
          <span className="font-mono font-bold text-white text-[11px]">۱۲:۴۵</span>
          <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span>5G</span>
            <span>۹۸٪</span>
          </div>
        </div>

        {/* Mobile Header: Bax Captain App */}
        <div className="px-3 py-2.5 bg-slate-900/90 border-b border-slate-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow">
              <Bike className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-white">باکس کاپتان</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  تایید شده
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {captain.phone}
              </div>
            </div>
          </div>

          {/* Online / Offline Toggle */}
          <button
            onClick={handleToggleOnline}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow ${
              captain.isOnline
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{captain.isOnline ? 'آنلاین' : 'آفلاین'}</span>
          </button>
        </div>

        {/* Main Body Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 flex flex-col justify-between">
          {/* TAB 1: RADAR & ACTIVE TRIPS */}
          {activeTab === 'radar' && (
            <div className="flex-1 flex flex-col justify-between">
              {/* Scenario A: Captain is OFFLINE */}
              {!captain.isOnline && (
                <div className="my-auto text-center p-6 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                    <Power className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">حالت آفلاین</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      برای دریافت درخواست‌های سفر در محدوده، وضعیت خود را به «آنلاین» تغییر دهید.
                    </p>
                  </div>
                  <button
                    onClick={handleToggleOnline}
                    className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30"
                  >
                    شروع شیفت و آنلاین شدن
                  </button>
                </div>
              )}

              {/* Scenario B: Captain is ONLINE & NO TRIP */}
              {captain.isOnline && !activeTrip && (
                <div className="my-auto text-center p-4 space-y-4">
                  {/* Radar Pulse */}
                  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-emerald-600/10 border border-emerald-500/20 animate-ping" />
                    <div className="absolute inset-3 rounded-full bg-emerald-600/15 border border-emerald-500/30 animate-pulse" />
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-600/40">
                      <Radio className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">در حال رصد درخواست‌های جدید...</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      محدوده فعالیت: تهران، منطقه ۶ و مرکز • اولویت با سفارشات نزدیک
                    </p>
                  </div>

                  {/* Guaranteed Shift Status */}
                  <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-right space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">شیفت تضمینی امروز:</span>
                      <span className="text-emerald-400 font-bold font-mono">۱,۴۰۰,۰۰۰ تومان</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">کمیسیون سفرها:</span>
                      <span className="text-white font-mono font-bold">۰٪ (۱۰۰٪ کرایه مال شما)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario C: NEW INCOMING TRIP REQUEST (status === 'searching') */}
              {captain.isOnline && activeTrip && activeTrip.status === 'searching' && (
                <div className="my-auto space-y-3 animate-in zoom-in-95 duration-200">
                  <div className="p-1 rounded-2xl bg-gradient-to-r from-amber-500 via-emerald-500 to-indigo-500 p-0.5 shadow-2xl">
                    <div className="bg-slate-900 rounded-[14px] p-4 text-right space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 animate-pulse">
                          <Volume2 className="w-4 h-4" />
                          درخواست سفر جدید رسید!
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                          {activeTrip.id}
                        </span>
                      </div>

                      {/* Fare & Vehicle */}
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">کرایه خالص دریافتی:</span>
                          <span className="text-base font-black text-emerald-400 font-mono">
                            {new Intl.NumberFormat('fa-IR').format(activeTrip.fareAmount)} تومان
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 block">ناوگان:</span>
                          <span className="text-xs font-bold text-white">{activeTrip.vehicleTitleFa}</span>
                        </div>
                      </div>

                      {/* Route Details */}
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-400 block">مبدا فرستنده:</span>
                            <span className="text-white font-medium">{activeTrip.pickupTitle}</span>
                            <p className="text-[10px] text-slate-400 truncate max-w-[260px]">{activeTrip.pickupAddress}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                          <div>
                            <span className="text-[10px] text-slate-400 block">مقصد تحویل:</span>
                            <span className="text-white font-medium">{activeTrip.destinations[0]?.title}</span>
                            <p className="text-[10px] text-slate-400 truncate max-w-[260px]">{activeTrip.destinations[0]?.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Package details */}
                      <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-850 text-[11px] text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-indigo-400" />
                          {activeTrip.packageType}
                        </span>
                        <span className="text-[10px] text-amber-400 font-bold">تسویه نقدی/کیف‌پول در مبدا</span>
                      </div>

                      {/* Accept / Reject Buttons */}
                      <div className="pt-2 flex items-center gap-2">
                        <button
                          onClick={handleAcceptTrip}
                          className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/40 flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>پذیرش درخواست سفر</span>
                        </button>
                        <button
                          onClick={handleResetTrip}
                          className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                        >
                          رد
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario D: TRIP ACCEPTED - STEP 1 (En route to pickup) */}
              {captain.isOnline && activeTrip && activeTrip.status === 'accepted' && (
                <div className="my-auto space-y-3">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-right space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                        مرحله ۱: در مسیر رسیدن به مبدا
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        حدود ۴ دقیقه
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
                      <span className="text-slate-400 text-[10px] block">آدرس فرستنده جهت دریافت بسته:</span>
                      <div className="text-white font-bold">{activeTrip.pickupTitle}</div>
                      <p className="text-[11px] text-slate-300">{activeTrip.pickupAddress}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>فرستنده: {activeTrip.customerName}</span>
                      <a
                        href={`tel:${activeTrip.customerPhone}`}
                        className="p-1.5 px-2.5 rounded-lg bg-slate-800 text-emerald-400 flex items-center gap-1"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        تماس
                      </a>
                    </div>

                    <button
                      onClick={handleArrivedAtPickup}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>رسیدم به مبدا فرستنده</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Scenario E: ARRIVED AT PICKUP - STEP 2 (Receive Package & Trigger Payment) */}
              {captain.isOnline && activeTrip && activeTrip.status === 'at_pickup' && (
                <div className="my-auto space-y-3">
                  <div className="p-4 bg-slate-900 rounded-2xl border-2 border-emerald-500/60 text-right space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Package className="w-4 h-4" />
                        مرحله ۲: حضور در مبدا و دریافت بسته
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        مبدا
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      بسته را از فرستنده رویت و تحویل بگیرید. پس از فشردن دکمه زیر، درخواست واریزی کرایه به گوشی مشتری ارسال می‌شود.
                    </p>

                    <div className="p-2.5 bg-slate-950 rounded-xl text-xs space-y-1">
                      <div className="text-slate-400 text-[10px]">نوع مرسوله:</div>
                      <div className="text-white font-bold">{activeTrip.packageType}</div>
                    </div>

                    <button
                      onClick={handleConfirmPackagePickedUp}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-emerald-600/40 flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>بسته را تحویل گرفتم (تایید دریافت در مبدا)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Scenario F: PACKAGE PICKED UP - STEP 3 (Customer Payment Pending) */}
              {captain.isOnline && activeTrip && activeTrip.status === 'package_picked_up' && (
                <div className="my-auto space-y-3">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-amber-500/60 text-right space-y-3 shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-4 h-4" />
                        منتظر تایید واریزی کرایه توسط مشتری...
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      بسته تحویل گرفته شد! طبق دستور سامانه، اکنون مشتری باید واریزی کرایه ({new Intl.NumberFormat('fa-IR').format(activeTrip.fareAmount)} ت) را تایید نماید.
                    </p>

                    <div className="p-2.5 bg-amber-950/40 border border-amber-500/30 rounded-xl text-[11px] text-amber-200">
                      مشتری در اپلیکیشن خود اعلان واریزی را مشاهده می‌کند. جهت تست فوری می‌توانید دکمه زیر را بزنید:
                    </div>

                    <button
                      onClick={handleSimulateCustomerPayment}
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center gap-1.5"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>تایید شبیه‌سازی واریزی مشتری و حرکت به مقصد</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Scenario G: IN TRANSIT TO DESTINATION - STEP 4 (Delivery Code) */}
              {captain.isOnline && activeTrip && (activeTrip.status === 'in_transit' || activeTrip.status === 'paid') && (
                <div className="my-auto space-y-3">
                  <div className="p-4 bg-slate-900 rounded-2xl border border-indigo-500/50 text-right space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        کرایه واریز شد • در مسیر تحویل به گیرنده
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                        واریز تایید شد
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs space-y-1">
                      <span className="text-slate-400 text-[10px] block">آدرس مقصد و گیرنده:</span>
                      <div className="text-white font-bold">{activeTrip.destinations[0]?.title}</div>
                      <p className="text-[11px] text-slate-300">{activeTrip.destinations[0]?.address}</p>
                      <div className="pt-1 flex items-center justify-between text-slate-400 text-[10px]">
                        <span>گیرنده: {activeTrip.destinations[0]?.recipientName}</span>
                        <a href={`tel:${activeTrip.destinations[0]?.recipientPhone}`} className="text-indigo-400 font-mono">
                          {activeTrip.destinations[0]?.recipientPhone}
                        </a>
                      </div>
                    </div>

                    {/* Security Code Input */}
                    <div className="space-y-1.5 pt-2">
                      <label className="text-[11px] font-bold text-white block">
                        کد ۴ رقمی تحویل بسته (از گیرنده بپرسید):
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={securityInput}
                          onChange={(e) => setSecurityInput(e.target.value)}
                          placeholder="کد ۴ رقمی (مثلا ۴۸۹۲)"
                          className="flex-1 py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-base text-white tracking-widest focus:border-indigo-500 outline-none"
                        />
                        <button
                          onClick={() => setSecurityInput('4892')}
                          className="px-2.5 py-2 rounded-xl bg-slate-800 text-[10px] text-slate-300 hover:text-white"
                        >
                          کد پیش‌فرض ۴۸۹۲
                        </button>
                      </div>
                      {securityError && (
                        <p className="text-[10px] text-rose-400">{securityError}</p>
                      )}
                    </div>

                    <button
                      onClick={handleCompleteDelivery}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>ثبت نهایی تحویل بسته و پایان سفر</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Scenario H: DELIVERED SUCCESS */}
              {captain.isOnline && activeTrip && activeTrip.status === 'delivered' && (
                <div className="my-auto text-center p-4 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">سفر با موفقیت انجام شد!</h3>
                    <p className="text-xs text-slate-300 mt-1">
                      بسته تحویل داده شد و مبلغ {new Intl.NumberFormat('fa-IR').format(activeTrip.fareAmount)} تومان به کیف‌پول شما منظور گردید.
                    </p>
                  </div>
                  <button
                    onClick={handleResetTrip}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                  >
                    بازگشت به رادار و دریافت سفر بعدی
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: EARNINGS */}
          {activeTab === 'earnings' && (
            <div className="flex-1 space-y-3 p-1">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-950 to-slate-900 border border-emerald-500/40 text-right space-y-2">
                <span className="text-[10px] text-slate-400 block">درآمد کل امروز:</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ۱,۴۸۵,۰۰۰ تومان
                </span>
                <p className="text-[10px] text-slate-300">
                  شامل شیفت تضمینی پایه + سفرهای انجام شده با کمیسیون ۰٪
                </p>
              </div>

              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-right space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>پایه شیفت تضمینی ۸ ساعته:</span>
                  <span className="font-mono font-bold text-white">۱,۴۰۰,۰۰۰ تومان</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>کارکرد سفرهای اختصاصی:</span>
                  <span className="font-mono font-bold text-emerald-400">۸۵,۰۰۰ تومان</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>کسر کمیسیون باکس:</span>
                  <span className="font-mono font-bold text-emerald-400">۰ تومان (رایگان)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <div className="flex-1 space-y-3 p-1 text-right">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg">
                  ک
                </div>
                <div className="text-sm font-bold text-white">{captain.name}</div>
                <div className="text-xs text-emerald-400 font-mono font-bold">{captain.phone}</div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  کاپتان مورد تایید سیستم
                </span>
              </div>

              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">وسیله نقلیه:</span>
                  <span className="text-white">{captain.vehicle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">پلاک:</span>
                  <span className="text-white font-mono">{captain.plate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">امتیاز کیفی:</span>
                  <span className="text-amber-400 font-bold">★ {captain.rating}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Native Android Bottom Navigation Bar */}
        <div className="border-t border-slate-900 pt-2 pb-1 shrink-0">
          <div className="grid grid-cols-3 gap-1 text-[10px]">
            <button
              onClick={() => setActiveTab('radar')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                activeTab === 'radar'
                  ? 'text-emerald-400 font-bold bg-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>رادار سفرها</span>
            </button>
            <button
              onClick={() => setActiveTab('earnings')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                activeTab === 'earnings'
                  ? 'text-emerald-400 font-bold bg-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>درآمد و شیفت</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center justify-center py-1.5 rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'text-emerald-400 font-bold bg-emerald-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>پروفایل کاپتان</span>
            </button>
          </div>
          {/* Android Home Bar */}
          <div className="w-28 h-1 bg-slate-700 mx-auto mt-2 rounded-full" />
        </div>
      </div>
    </div>
  );
};
