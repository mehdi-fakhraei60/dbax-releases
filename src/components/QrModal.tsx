import React from 'react';
import { X, Smartphone, Download, ExternalLink, QrCode } from 'lucide-react';
import { generateQrSvg } from '../utils/qr';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  fileName: string;
  arch: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  fileName,
  arch,
}) => {
  if (!isOpen) return null;

  const qrImageUrl = generateQrSvg(url, 240);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">اسکن کد QR جهت دانلود</h3>
              <p className="text-xs text-slate-400 font-mono">{fileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 flex flex-col items-center text-center">
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-indigo-950/40 border-4 border-indigo-500/20 mb-4">
            <img
              src={qrImageUrl}
              alt="QR Code for APK download"
              className="w-48 h-48 rounded-lg"
              loading="lazy"
            />
          </div>

          <p className="text-sm text-slate-200 font-medium mb-1">
            دوربین گوشی اندروید خود را روی تصویر بالا بگیرید
          </p>
          <p className="text-xs text-slate-400 max-w-xs mb-4">
            لینک مستقیم فایل نصب APK ({arch}) برای شروع دانلود خودکار روی دستگاه شما باز خواهد شد.
          </p>

          <div className="w-full bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs font-mono text-slate-300 break-all text-left dir-ltr select-all">
            {url}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 pt-2 border-t border-slate-800">
          <a
            href={url}
            download={fileName}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition-colors shadow-lg shadow-indigo-600/25"
          >
            <Download className="w-4 h-4" />
            <span>دانلود مستقیم با مرورگر</span>
          </a>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
