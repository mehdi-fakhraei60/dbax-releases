import React from 'react';
import { Package, GitBranch, ExternalLink, Heart, ShieldCheck } from 'lucide-react';
import { CURRENT_RELEASE } from '../data/releases';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-200">Bax Releases & Downloads</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                مخزن رسمی توزیع فایل‌های APK اپلیکیشن‌های باکس و باکس سفیر
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400">
            <a
              href={CURRENT_RELEASE.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GitBranch className="w-4 h-4" />
              <span>گیت‌هاب: mehdi-fakhraei60/dbax-releases</span>
            </a>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">نسخه {CURRENT_RELEASE.version}</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            توسعه‌یافته با کاتلین، Jetpack Compose، نقشه نشان و احراز هویت پیامکی کاوه‌نگار
          </div>
          <div className="font-mono text-slate-600">
            ir.dbax.app • ir.dbax.app.driver
          </div>
        </div>
      </div>
    </footer>
  );
};
