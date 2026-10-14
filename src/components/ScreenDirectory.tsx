import React, { useState } from 'react';
import { Search, Filter, Smartphone, CheckCircle2, User, ShieldCheck, Tag } from 'lucide-react';
import { SCREEN_CATALOG, ScreenCatalogItem } from '../data/releases';

export const ScreenDirectory: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<'all' | 'customer' | 'driver'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScreens = SCREEN_CATALOG.filter((item) => {
    if (selectedApp !== 'all' && item.app !== selectedApp) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        item.code.toLowerCase().includes(q) ||
        item.nameFa.toLowerCase().includes(q) ||
        item.descriptionFa.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = [
    { id: 'all', label: 'همه دسته‌ها' },
    { id: 'auth', label: 'احراز هویت و ورود' },
    { id: 'map', label: 'نقشه و موقعیت' },
    { id: 'order', label: 'ثبت و مدیریت سفارش' },
    { id: 'delivery', label: 'تحویل و کد امنیتی' },
    { id: 'payment', label: 'مالی و کیف پول' },
    { id: 'profile', label: 'پروفایل و آپدیتر' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <span>راهنمای صفحات پیاده‌سازی شده</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {SCREEN_CATALOG.length} صفحه شاخص
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              مجموعه کامل صفحات کلاینت باکس (C01–C38 و ماژول دوربین C07) و سفیران (D00–D38)
            </p>
          </div>

          {/* App filter buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto text-xs">
            <button
              onClick={() => setSelectedApp('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                selectedApp === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              همه ({SCREEN_CATALOG.length})
            </button>
            <button
              onClick={() => setSelectedApp('customer')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
                selectedApp === 'customer'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>مشتری (C01-C38)</span>
            </button>
            <button
              onClick={() => setSelectedApp('driver')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors flex items-center gap-1 ${
                selectedApp === 'driver'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>سفیران (D00-D38)</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Row */}
        <div className="pt-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو بر اساس کد صفحه (مثلا C07 یا D18) یا نام..."
              className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-white border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Screen Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredScreens.map((item) => {
          const isCustomer = item.app === 'customer';
          return (
            <div
              key={item.code}
              className="rounded-2xl p-4 sm:p-5 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all hover:bg-slate-900/90 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span
                    className={`font-mono text-xs px-2.5 py-1 rounded-lg font-bold border ${
                      isCustomer
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    }`}
                  >
                    {item.code}
                  </span>
                  <span className="text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                    {isCustomer ? 'اپ مشتری' : 'اپ سفیران'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{item.nameFa}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{item.descriptionFa}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>تکمیل و فعال در Preview 5</span>
                </span>
                <span className="font-mono text-slate-500">Compose UI</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredScreens.length === 0 && (
        <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-400 text-sm">
          موردی متناسب با فیلترها و کلمه جستجو شده یافت نشد.
        </div>
      )}
    </div>
  );
};
