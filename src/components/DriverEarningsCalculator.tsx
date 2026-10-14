import React, { useState } from 'react';
import {
  Calculator,
  Check,
  TrendingUp,
  ShieldAlert,
  Award,
  Clock,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Bike,
  Sparkles,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export const DriverEarningsCalculator: React.FC = () => {
  // Pre-approved test Captain state
  const testCaptain = {
    phone: '09399887782',
    name: 'کاپتان مهدی (تست سیستمی)',
    code: 'CAP-9882',
    status: 'verified_active',
    vehicle: 'موتورسیکلت آپاچی ۲۰۰',
    plate: 'ایران ۱۱ - ۴۸۲ ب ۹۹',
    rating: 5.0,
    commissionRate: 0,
    fixedShiftPay: '۱,۴۰۰,۰۰۰ تومان در هر شیفت',
  };

  // Configurable inputs
  const [shiftsPerMonth, setShiftsPerMonth] = useState<number>(24); // 24 days / month
  const [fixedPayPerBlock, setFixedPayPerBlock] = useState<number>(1400000); // 1.4m Tomans per 8-hour block
  const [averageTripRevenue, setAverageTripRevenue] = useState<number>(600000); // additional order surge/tips
  const [monthlySubscription, setMonthlySubscription] = useState<number>(750000); // monthly subscription
  const [traditionalCommissionRate, setTraditionalCommissionRate] = useState<number>(20); // 20%

  // Bax Model Calculations:
  // Fixed pay per block * shifts
  const baxFixedEarnings = shiftsPerMonth * fixedPayPerBlock;
  // Extra trips with 0% commission
  const baxExtraEarnings = shiftsPerMonth * averageTripRevenue;
  const baxTotalGross = baxFixedEarnings + baxExtraEarnings;
  const baxNetEarnings = baxTotalGross - monthlySubscription;

  // Traditional Model Calculations (e.g., 20% commission, no fixed block guarantee):
  // Assumes total revenue is same volume, but traditional takes 20% commission
  const traditionalGross = baxTotalGross;
  const traditionalCommissionDeducted = traditionalGross * (traditionalCommissionRate / 100);
  const traditionalNet = traditionalGross - traditionalCommissionDeducted;

  // Driver advantage with Bax:
  const difference = baxNetEarnings - traditionalNet;

  const formatToman = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(amount)) + ' تومان';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Pre-approved Test Captain Profile Card */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-2 border-emerald-500/60 p-5 sm:p-6 shadow-xl shadow-emerald-950/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 shrink-0">
              <Bike className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white">
                  {testCaptain.name}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>تایید شده در سیستم</span>
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1">
                <span className="font-mono text-emerald-400 font-bold bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
                  شماره همراه: {testCaptain.phone}
                </span>
                <span>•</span>
                <span>کد کاپتان: <strong className="text-white font-mono">{testCaptain.code}</strong></span>
                <span>•</span>
                <span>{testCaptain.vehicle}</span>
                <span>•</span>
                <span className="text-amber-400 font-bold">★ {testCaptain.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 block">کمیسیون سفرها</span>
              <span className="text-xs sm:text-sm font-black text-emerald-400 font-mono">۰٪ (صفر درصد)</span>
            </div>
            <a
              href={`tel:${testCaptain.phone}`}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>تماس مستقیم تستی</span>
            </a>
          </div>
        </div>
      </div>

      {/* Intro Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-slate-950 border border-emerald-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>مدل اقتصادی اختصاصی کاپتان‌های باکس (Bax Captain)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              کارمزد ۰٪ + پرداخت تضمینی بلوک ۸ ساعته
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              در باکس برخلاف سایر سامانه‌ها، ۲۰٪ از زحمت هر سفر کاپتان کسر نمی‌شود. با پرداخت هزینه اشتراک ماهانه، هم درآمد تضمینی بابت ساعات آنلاین بودن در شیفت ۸ ساعته دریافت می‌کنید و هم ۱۰۰٪ کرایه‌ها بدون هیچ کمیسیونی متعلق به شماست.
            </p>
          </div>

          <div className="shrink-0 p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-center">
            <span className="text-xs text-slate-400 block mb-1">کمیسیون باکس از کاپتان</span>
            <span className="text-4xl font-black text-emerald-400 font-mono">0%</span>
            <span className="text-[11px] text-emerald-300/80 block mt-1">صفر درصد قطعی</span>
          </div>
        </div>

        {/* Sliders & Controls */}
        <div className="pt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>تنظیم پارامترهای کاری شما در ماه</span>
            </h3>

            {/* Slider 1: Shifts per month */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-slate-300">
                  تعداد بلوک‌های کاری ۸ ساعته در ماه:
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {shiftsPerMonth} شیفت (بلوک)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={shiftsPerMonth}
                onChange={(e) => setShiftsPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>۵ روز پاره‌وقت</span>
                <span>۱۵ روز نیمه‌وقت</span>
                <span>۳۰ روز تمام‌وقت</span>
              </div>
            </div>

            {/* Slider 2: Fixed pay per block */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-slate-300">
                  کف پرداختی ثابت بابت هر بلوک ۸ ساعته:
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {formatToman(fixedPayPerBlock)}
                </span>
              </div>
              <input
                type="range"
                min="800000"
                max="2500000"
                step="50000"
                value={fixedPayPerBlock}
                onChange={(e) => setFixedPayPerBlock(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Slider 3: Trip revenue */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-medium text-slate-300">
                  میانگین کل کرایه و پاداش دریافتی در هر شیفت:
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  {formatToman(averageTripRevenue)}
                </span>
              </div>
              <input
                type="range"
                min="200000"
                max="1500000"
                step="50000"
                value={averageTripRevenue}
                onChange={(e) => setAverageTripRevenue(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          </div>

          {/* Results Comparison Card */}
          <div className="bg-slate-950/90 rounded-2xl p-6 border border-emerald-500/40 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>مقایسه درآمد خالص ماهانه شما</span>
                </h4>
                <span className="text-xs text-slate-400">محاسبه در {shiftsPerMonth} روز</span>
              </div>

              {/* Comparison items */}
              <div className="space-y-4 py-5">
                {/* Bax Net */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-300">درآمد خالص با مدل باکس (BAX):</span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      {formatToman(baxNetEarnings)}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 flex flex-wrap gap-2">
                    <span>پرداخت ثابت: {formatToman(baxFixedEarnings)}</span>
                    <span>•</span>
                    <span>کارمزد کسر شده: ۰ تومان</span>
                    <span>•</span>
                    <span>کسر اشتراک: {formatToman(monthlySubscription)}</span>
                  </div>
                </div>

                {/* Traditional Net */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-slate-300">درآمد در سامانه‌های با کارمزد {traditionalCommissionRate}٪:</span>
                    <span className="text-sm font-bold text-slate-400 font-mono">
                      {formatToman(traditionalNet)}
                    </span>
                  </div>
                  <div className="text-[11px] text-rose-400/80 mt-2">
                    کارمزد کسر شده از جیب شما: {formatToman(traditionalCommissionDeducted)}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Difference Highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/40">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium block opacity-90">سود و درآمد بیشتر ماهانه شما در باکس:</span>
                  <span className="text-lg sm:text-xl font-black font-mono">
                    + {formatToman(difference)}
                  </span>
                </div>
                <span className="text-xs bg-white/20 px-2.5 py-1 rounded-lg backdrop-blur-sm font-bold">
                  {Math.round((difference / traditionalNet) * 100)}٪ سود بیشتر
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
