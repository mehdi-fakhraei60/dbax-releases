import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Globe,
  Coins,
  Truck,
  Building2,
  Receipt,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Phone,
  User,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  Percent,
  CheckCircle2,
  Clock,
  Navigation
} from 'lucide-react';
import {
  BulkDispatchAdapter,
  BulkOrderItem,
  BulkBatchSummary,
  LiveWebTrackingAdapter,
  LiveTrackingTelemetry,
  CashOnDeliveryAdapter,
  CodTransaction,
  FreightFleetAdapter,
  FreightVehicleOption,
  FreightAddonService,
  AddressBookAdapter,
  SavedAddressRecord,
  CorporateInvoiceAdapter,
  MonthlyBillingSummary
} from '../moduals2';

export const EnterpriseEcosystemView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'bulk' | 'tracking' | 'cod' | 'freight' | 'address' | 'invoice'>('bulk');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // 1. Bulk state
  const [bulkOrders, setBulkOrders] = useState<BulkOrderItem[]>(BulkDispatchAdapter.getSampleBatch());
  const batchSummary: BulkBatchSummary = BulkDispatchAdapter.calculateBatchSummary(bulkOrders);

  // 2. Tracking state
  const [trackingTelemetry, setTrackingTelemetry] = useState<LiveTrackingTelemetry>(LiveWebTrackingAdapter.generateTrackingLink());
  const smsText = LiveWebTrackingAdapter.formatSmsNotification(trackingTelemetry);

  // 3. COD state
  const [codAmountInput, setCodAmountInput] = useState<number>(2450000);
  const codCalc = CashOnDeliveryAdapter.calculateCod(codAmountInput);
  const sampleCodTx = CashOnDeliveryAdapter.getSampleCodTransaction();

  // 4. Freight state
  const vehicles = FreightFleetAdapter.getVehicleOptions();
  const [selectedVehicleId, setSelectedVehicleId] = useState<FreightVehicleOption['id']>('pickup_pride');
  const [addons, setAddons] = useState<FreightAddonService[]>(FreightFleetAdapter.getDefaultAddons());
  const freightFareCalc = FreightFleetAdapter.calculateFreightFare(selectedVehicleId, 12.5, addons);

  // 5. Address Book state
  const [savedAddresses, setSavedAddresses] = useState<SavedAddressRecord[]>(AddressBookAdapter.getSavedAddresses());

  // 6. Corporate Invoice state
  const invoiceStatement: MonthlyBillingSummary = CorporateInvoiceAdapter.getMonthlyStatement();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadCsvTemplate = () => {
    const csv = BulkDispatchAdapter.generateCsvTemplate();
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bax_bulk_orders_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInvoiceCsv = () => {
    const csv = CorporateInvoiceAdapter.exportOfficialCsv();
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'bax_tax_invoice_statement.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleAddon = (id: FreightAddonService['id']) => {
    setAddons(prev => prev.map(a => a.id === id ? { ...a, selected: !a.selected } : a));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900/90 to-purple-950/30 border border-indigo-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>اکوسیستم یکپارچه لجستیک و سازمانی باکس (Enterprise Suite)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              ۶ قابلیت مکمل برای کسب‌وکارها، فروشگاه‌های آنلاین و ناوگان باری
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              تمامی زیرسیستم‌های حرفه‌ای شامل ثبت گروهی سفارشات با اکسل، رهگیری زنده وب برای گیرنده، تسویه وجه کالا در محل (COD)، ناوگان سنگین و کارگر کمکی، دفترچه آدرس‌های منتخب و فاکتور رسمی دارایی به پلتفرم متصل گردیدند.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 shrink-0">
            <div className="text-right px-3">
              <div className="text-[11px] text-slate-400">ماژول‌های متصل</div>
              <div className="text-sm font-bold text-emerald-400">۶ ماژول فعال در moduals2</div>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse mr-1"></div>
          </div>
        </div>

        {/* Feature Navigation Pill-Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSection('bulk')}
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'bulk'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span className="truncate">۱. سفارش انبوه B2B</span>
          </button>

          <button
            onClick={() => setActiveSection('tracking')}
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'tracking'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4 shrink-0" />
            <span className="truncate">۲. رهگیری زنده وب</span>
          </button>

          <button
            onClick={() => setActiveSection('cod')}
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'cod'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Coins className="w-4 h-4 shrink-0" />
            <span className="truncate">۳. وجه کالا در محل (COD)</span>
          </button>

          <button
            onClick={() => setActiveSection('freight')}
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'freight'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Truck className="w-4 h-4 shrink-0" />
            <span className="truncate">۴. ناوگان باری و کارگر</span>
          </button>

          <button
            onClick={() => setActiveSection('address')}
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'address'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="truncate">۵. شعب و دفترچه آدرس</span>
          </button>

          <button
            onClick={() => setActiveSection('invoice')}
            className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold transition-all ${
              activeSection === 'invoice'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4 shrink-0" />
            <span className="truncate">۶. فاکتور رسمی دارایی</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: B2B BULK DISPATCH */}
      {activeSection === 'bulk' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">ثبت گروهی سفارش‌ها و اتصال به اکسل / CSV</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    تخفیف تیراژ ۱۵٪
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  فروشگاه‌های اینترنتی می‌توانند صدها بسته روزانه را در یک مرحله بارگذاری کرده و فاکتور تجمیعی دریافت نمایند.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCsvTemplate}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>دانلود فایل نمونه Excel / CSV</span>
                </button>
              </div>
            </div>

            {/* Batch Metrics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">تعداد کل سفارشات بسته</div>
                <div className="text-xl font-black text-white mt-1 font-mono">{batchSummary.totalOrders} مرسوله</div>
                <div className="text-[10px] text-emerald-400 mt-1">۱۰۰٪ اعتبارسنجی شده</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">مسافت تجمیعی تخمینی</div>
                <div className="text-xl font-black text-indigo-400 mt-1 font-mono">{batchSummary.totalEstimatedDistanceKm} کیلومتر</div>
                <div className="text-[10px] text-slate-400 mt-1">بهینه‌سازی خوشه‌ای مسیر</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">کرایه تجمیعی با تخفیف</div>
                <div className="text-xl font-black text-emerald-400 mt-1 font-mono">
                  {batchSummary.totalFreightCostToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">تومان</span>
                </div>
                <div className="text-[10px] text-emerald-400 mt-1">کسر از اعتبار کیف‌پول شرکتی</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-[11px] text-slate-400">مجموع وصول وجه کالا (COD)</div>
                <div className="text-xl font-black text-amber-400 mt-1 font-mono">
                  {batchSummary.totalCodCollectionToman.toLocaleString('fa-IR')} <span className="text-xs font-normal text-slate-400">تومان</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">واریز خودکار به موجودی</div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="py-3 px-4">ردیف</th>
                    <th className="py-3 px-4">کد رهگیری</th>
                    <th className="py-3 px-4">گیرنده</th>
                    <th className="py-3 px-4">تماس</th>
                    <th className="py-3 px-4">آدرس مقصد و منطقه</th>
                    <th className="py-3 px-4">مرسوله / وزن</th>
                    <th className="py-3 px-4">وجه کالا (COD)</th>
                    <th className="py-3 px-4">بازه تحویل</th>
                    <th className="py-3 px-4">وضعیت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {bulkOrders.map(order => (
                    <tr key={order.rowId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500">{order.rowId}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">{order.assignedTrackingCode}</td>
                      <td className="py-3 px-4 font-bold text-white">{order.recipientName}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{order.recipientPhone}</td>
                      <td className="py-3 px-4 max-w-xs text-slate-300 truncate" title={order.address}>
                        {order.address}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {order.packageType} ({order.weightKg} kg)
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-amber-300">
                        {order.codAmountToman ? `${order.codAmountToman.toLocaleString('fa-IR')} تومان` : '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{order.deliveryWindow}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          آماده دیسپچ
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: LIVE WEB TRACKING LINK */}
      {activeSection === 'tracking' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMS & Share Info */}
            <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>بدون نیاز به نصب اپلیکیشن برای گیرنده</span>
                </div>
                <h3 className="text-lg font-black text-white">پیامک خودکار و لینک وب ردیابی زنده</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  به محض پذیرش سفارش توسط سفیر، یک پیامک اختصاصی با لینک وب به شماره گیرنده ارسال می‌شود تا موقعیت زنده سفیر را مشاهده کند.
                </p>
              </div>

              {/* SMS Preview Card */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="flex items-center gap-1.5 font-bold text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" />
                    <span>متن پیامک ارسالی به {trackingTelemetry.recipientPhone}</span>
                  </span>
                  <button
                    onClick={() => handleCopy(smsText, 'sms')}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    {copiedKey === 'sms' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'sms' ? 'کپی شد' : 'کپی متن'}</span>
                  </button>
                </div>
                <pre className="text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
                  {smsText}
                </pre>
              </div>

              {/* Shareable Link Box */}
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <div className="text-[11px] text-indigo-300 font-bold">لینک اختصاصی ردیابی تحت وب (Web Tracker URL):</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={trackingTelemetry.shareableUrl}
                    className="flex-1 bg-slate-950 text-xs font-mono text-indigo-300 px-3 py-2 rounded-xl border border-indigo-500/40 select-all"
                  />
                  <button
                    onClick={() => handleCopy(trackingTelemetry.shareableUrl, 'link')}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    {copiedKey === 'link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>کپی</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Live Web Tracking Interface */}
            <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
              <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                  <span className="text-xs font-mono text-slate-400 mr-2">track.bax.ir/live/{trackingTelemetry.trackingCode}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  ● زنده (Live)
                </span>
              </div>

              <div className="p-6 space-y-5 flex-1 bg-gradient-to-b from-slate-950 to-slate-900/60">
                {/* Status Bar */}
                <div className="p-4 rounded-2xl bg-indigo-600 text-white flex items-center justify-between shadow-lg shadow-indigo-600/20">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-indigo-100 font-bold">زمان تخمینی رسیدن سفیر:</div>
                    <div className="text-2xl font-black font-mono">حدود {trackingTelemetry.estimatedMinutesToArrival} دقیقه دیگر</div>
                  </div>
                  <Navigation className="w-8 h-8 text-indigo-200 animate-bounce" />
                </div>

                {/* Map Simulation Box */}
                <div className="relative h-44 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                  
                  {/* Origin & Destination Line */}
                  <div className="relative z-10 w-4/5 flex items-center justify-between">
                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="text-[10px] text-emerald-300 font-bold">مبدا (تحویل گرفته شد)</div>
                    </div>

                    <div className="flex-1 mx-4 relative flex items-center">
                      <div className="w-full h-1 bg-slate-800 rounded-full">
                        <div className="h-full bg-indigo-500 rounded-full w-2/3 animate-pulse"></div>
                      </div>
                      <div className="absolute right-1/3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white shadow-lg">
                        <Truck className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="text-center space-y-1">
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center mx-auto text-rose-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div className="text-[10px] text-rose-300 font-bold">مقصد تحویل شما</div>
                    </div>
                  </div>
                </div>

                {/* Courier Details Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm">
                      {trackingTelemetry.courierNameFa.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{trackingTelemetry.courierNameFa}</div>
                      <div className="text-[11px] text-slate-400">{trackingTelemetry.vehicleTypeFa}</div>
                      <div className="text-[10px] font-mono text-indigo-300 mt-0.5">{trackingTelemetry.vehiclePlateFa}</div>
                    </div>
                  </div>

                  <a
                    href={`tel:${trackingTelemetry.courierPhone}`}
                    className="p-3 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>تماس امن</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: GOODS CASH ON DELIVERY (COD) */}
      {activeSection === 'cod' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">سرویس پرداخت در محل وجه کالا و امانت‌داری مالی (Goods COD)</h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                  بدون نیاز به درگاه بانکی آنلاین
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                سفیر باکس هنگام تحویل کالا به مشتری نهایی، مبلغ بهای کالا را از طریق پوز یا وجه نقد دریافت کرده و سیستم به‌صورت خودکار پس از کسر کارمزد تضمین امانت‌داری، مبلغ خالص را به کیف‌پول اعتباری فرستنده منظور می‌نماید.
              </p>
            </div>

            {/* Interactive COD Calculator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>محاسبه‌گر تسویه وجه کالا</span>
                </h4>

                <div className="space-y-2">
                  <label className="text-[11px] text-slate-400">مبلغ کالای فروخته‌شده (تومان):</label>
                  <input
                    type="number"
                    step="50000"
                    value={codAmountInput}
                    onChange={(e) => setCodAmountInput(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>کارمزد امانت‌داری و تضمین مالی (۰.۸٪):</span>
                    <span className="font-mono text-rose-400">-{codCalc.escrowFeeToman.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-400 pt-2 border-t border-slate-800">
                    <span>مبلغ خالص واریزی به کیف‌پول فرستنده:</span>
                    <span className="font-mono text-base">{codCalc.netCreditedToman.toLocaleString('fa-IR')} تومان</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>پوشش بیمه مفقودی یا عدم پرداخت تا سقف ۵۰ میلیون تومان توسط صندوق ضمانت باکس</span>
                </div>
              </div>

              {/* Sample Transaction Receipt */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-indigo-400" />
                    <span>رسید دیجیتال امانت‌داری سفیر</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold font-mono">
                    {sampleCodTx.id}
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs space-y-2">
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">شماره سفارش:</span>
                    <span className="font-mono text-white font-bold">{sampleCodTx.orderId}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">خریدار (پرداخت‌کننده):</span>
                    <span className="text-white">{sampleCodTx.customerRecipientName}</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">سفیر وصول‌کننده:</span>
                    <span className="text-white">{sampleCodTx.courierNameFa} (دستگاه پوز سیار)</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">وضعیت تسویه:</span>
                    <span className="text-emerald-400 font-bold">تسویه‌شده به کیف‌پول مشتری</span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-slate-400">زمان وصول:</span>
                    <span className="text-slate-300 font-mono">{sampleCodTx.settledAt}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FREIGHT FLEET & PORTER ADDONS */}
      {activeSection === 'freight' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">ناوگان باری سبک، سنگین و کارگر کمکی حمل بار</h3>
              <p className="text-xs text-slate-400">
                پوشش نیاز بارهای بالای ۲۵ کیلوگرم، خرده‌بار بازار، اسباب‌کشی و قطعات صنعتی با انواع وانت و خاور.
              </p>
            </div>

            {/* Vehicle Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`p-4 rounded-2xl text-right transition-all border flex flex-col justify-between ${
                    selectedVehicleId === v.id
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Truck className={`w-5 h-5 ${selectedVehicleId === v.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                      {selectedVehicleId === v.id && (
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-white">{v.titleFa}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-2">{v.subtitleFa}</div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
                    <div className="text-[10px] text-emerald-400 font-bold">{v.capacityFa}</div>
                    <div className="text-xs font-mono font-bold text-white">
                      ورودی: {v.baseFareToman.toLocaleString('fa-IR')} <span className="text-[10px] font-normal text-slate-400">تومان</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Helper & Addon Services */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-white">خدمات مازاد و نیروی کمکی:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {addons.map(addon => (
                  <div
                    key={addon.id}
                    onClick={() => toggleAddon(addon.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      addon.selected
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-white'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white">{addon.titleFa}</span>
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                        addon.selected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {addon.selected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed mb-2">{addon.descriptionFa}</p>
                    <div className="text-[11px] font-mono font-bold text-emerald-400">
                      +{addon.unitPriceToman.toLocaleString('fa-IR')} تومان
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Freight Fare Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span>کرایه پایه: <strong className="font-mono text-white">{freightFareCalc.baseFare.toLocaleString('fa-IR')}</strong></span>
                <span>+ مسافت (۱۲.۵ کیلومتر): <strong className="font-mono text-white">{freightFareCalc.distanceFare.toLocaleString('fa-IR')}</strong></span>
                <span>+ خدمات جانبی: <strong className="font-mono text-white">{freightFareCalc.addonsTotal.toLocaleString('fa-IR')}</strong></span>
              </div>

              <div className="text-left">
                <span className="text-[11px] text-slate-400 ml-2">جمع کل کرایه حمل بار:</span>
                <span className="text-base font-black font-mono text-indigo-400">
                  {freightFareCalc.totalFreightFare.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: ADDRESS BOOK & BRANCHES */}
      {activeSection === 'address' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">دفترچه آدرس‌ها، انبارها و شعب سازمانی</h3>
                <p className="text-xs text-slate-400">
                  انتخاب سریع مبدا یا مقصد در فرآیند ثبت سفارش با اطلاعات تماس تحویل‌گیرنده ذخیره‌شده.
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                {savedAddresses.length} آدرس ذخیره شده
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map(addr => (
                <div key={addr.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{addr.titleFa}</h4>
                        <span className="text-[10px] text-slate-400">{addr.categoryLabelFa}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {addr.isDefaultPickup && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          مبدا پیش‌فرض
                        </span>
                      )}
                      {addr.isDefaultDestination && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                          مقصد پیش‌فرض
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{addr.fullAddressFa}</p>
                  {addr.unitNotesFa && (
                    <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                      یادداشت: {addr.unitNotesFa}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>{addr.contactName} ({addr.contactPhone})</span>
                    </span>
                    <span className="text-slate-500 font-mono">{addr.orderCountUsed} سفارش</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: CORPORATE TAX INVOICES & STATEMENTS */}
      {activeSection === 'invoice' && (
        <div className="space-y-6">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white">صورتحساب و فاکتور رسمی دارایی (Tax Invoice)</h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    مورد تایید سازمان امور مالیاتی
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  شامل کد اقتصادی، شناسه ملی، تفکیک ارزش افزوده ۱۰٪ و قابلیت دانلود خروجی استاندارد حسابداری.
                </p>
              </div>

              <button
                onClick={handleDownloadInvoiceCsv}
                className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
              >
                <Download className="w-4 h-4" />
                <span>دانلود گزارش اکسل / CSV مالیاتی</span>
              </button>
            </div>

            {/* Corporate Identification Card */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">نام شخصیت حقوقی:</span>
                <span className="font-bold text-white">{invoiceStatement.companyNameFa}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">شناسه ملی شرکت:</span>
                <span className="font-mono font-bold text-indigo-300">{invoiceStatement.nationalCode}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">کد اقتصادی:</span>
                <span className="font-mono font-bold text-indigo-300">{invoiceStatement.economicCode}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">دوره گزارش مالی:</span>
                <span className="font-bold text-emerald-400">{invoiceStatement.periodFa}</span>
              </div>
            </div>

            {/* Statement Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="py-3 px-4">سریال فاکتور دارایی</th>
                    <th className="py-3 px-4">سفارش باکس</th>
                    <th className="py-3 px-4">تاریخ</th>
                    <th className="py-3 px-4">مبدا و مقصد</th>
                    <th className="py-3 px-4">نوع ناوگان</th>
                    <th className="py-3 px-4">کرایه خالص</th>
                    <th className="py-3 px-4">ارزش افزوده (۱۰٪)</th>
                    <th className="py-3 px-4">مبلغ نهایی فاکتور</th>
                    <th className="py-3 px-4">نحوه تسویه</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {invoiceStatement.items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">{item.taxInvoiceSerial}</td>
                      <td className="py-3 px-4 font-mono text-slate-300">{item.orderId}</td>
                      <td className="py-3 px-4 font-mono text-slate-400">{item.tripDateFa}</td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.originFa} ← {item.destinationFa}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{item.vehicleTypeFa}</td>
                      <td className="py-3 px-4 font-mono">{item.netFareToman.toLocaleString('fa-IR')} تومان</td>
                      <td className="py-3 px-4 font-mono text-amber-400">+{item.vatTaxToman.toLocaleString('fa-IR')} تومان</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        {item.totalPayableToman.toLocaleString('fa-IR')} تومان
                      </td>
                      <td className="py-3 px-4 text-slate-400">{item.paymentMethodFa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Billing Footer */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs text-slate-300">
                <span>جمع کرایه خالص: <strong className="font-mono text-white">{invoiceStatement.subtotalFareToman.toLocaleString('fa-IR')} تومان</strong></span>
                <span>+ مالیات ۱۰٪: <strong className="font-mono text-amber-400">{invoiceStatement.vatTaxToman.toLocaleString('fa-IR')} تومان</strong></span>
                <span>- تخفیف دوره‌ای: <strong className="font-mono text-emerald-400">{invoiceStatement.discountsAppliedToman.toLocaleString('fa-IR')} تومان</strong></span>
              </div>

              <div className="text-left">
                <span className="text-[11px] text-slate-400 ml-2">جمع کل قابل پرداخت صورتحساب:</span>
                <span className="text-base font-black font-mono text-white">
                  {invoiceStatement.finalBilledToman.toLocaleString('fa-IR')} تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
