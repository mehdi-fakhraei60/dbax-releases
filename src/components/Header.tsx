import React, { useState } from 'react';
import {
  Package,
  ExternalLink,
  Sparkles,
  Smartphone,
  Layers,
  ShieldCheck,
  DownloadCloud,
  Navigation2,
  Bike,
  RefreshCw,
  Check
} from 'lucide-react';
import { CURRENT_RELEASE } from '../data/releases';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [purging, setPurging] = useState(false);
  const [purgedDone, setPurgedDone] = useState(false);

  const handlePurgeCache = async () => {
    setPurging(true);
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      setPurgedDone(true);
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch {
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'customer', label: 'باکس مسافر (مشتری)', icon: Smartphone, highlight: true },
    { id: 'captain-app', label: 'اپلیکیشن کاپتان (۰۹۳۹۹۸۸۷۷۸۲)', icon: Bike, highlight: true },
    { id: 'tracking-web', label: 'رهگیری وب گیرنده (C21)', icon: Navigation2, highlight: false },
    { id: 'downloads', label: 'دانلود فایل‌های APK', icon: DownloadCloud, highlight: false },
    { id: 'screens', label: 'فهرست صفحات (C01-C38)', icon: Layers, highlight: false },
    { id: 'notes', label: 'یادداشت انتشار (Release Notes)', icon: Sparkles, highlight: false },
    { id: 'calculator', label: 'کاپتان‌ها (۰٪ کمیسیون)', icon: ShieldCheck, highlight: false },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/85 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white">
                <Package className="w-6 h-6 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-sans">BAX</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono font-medium">
                  {CURRENT_RELEASE.version}
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  کاپتان تست: ۰۹۳۹۹۸۸۷۷۸۲ تایید شد
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                سامانه هوشمند حمل بار و پیک موتوری • پکیج ir.dbax.app
              </p>
            </div>
          </div>

          {/* Action buttons & Cache Purge for Android */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePurgeCache}
              disabled={purging}
              title="پاکسازی حافظه موقت مرورگر اندروید و بارگذاری آنی نسخه جدید"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 transition-all shadow-sm"
            >
              {purgedDone ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${purging ? 'animate-spin' : ''}`} />
              )}
              <span className="hidden sm:inline">
                {purgedDone ? 'انجام شد (بارگذاری مجدد...)' : purging ? 'در حال پاکسازی...' : 'بروزرسانی کش اندروید'}
              </span>
            </button>

            <a
              href={CURRENT_RELEASE.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 transition-all hover:border-slate-600 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">مخزن انتشارات</span>
            </a>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2.5 border-t border-slate-800/60 text-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-xs sm:text-sm ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                    : tab.highlight
                    ? 'text-indigo-300 bg-indigo-950/40 border border-indigo-500/30 hover:bg-indigo-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.highlight ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
