import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, ExternalLink, QrCode, Copy, Check, AlertCircle } from 'lucide-react';
import { generateQrDataUrl } from '../utils/qr';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  url?: string;
  fileName?: string;
  arch?: string;
  fileSize?: string;
}

export const QrModal: React.FC<QrModalProps> = ({
  isOpen,
  onClose,
  title = 'دانلود اپلیکیشن باکس (Bax APK)',
  url,
  fileName = 'bax-customer.apk',
  arch = 'Universal (همه پردازنده‌ها)',
  fileSize = '۳۴ مگابایت',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Reliable absolute download URL
  const safeUrl =
    url && url.trim().length > 0
      ? url
      : 'https://github.com/mehdi-fakhraei60/dbax-releases/releases/latest/download/bax-customer.apk';

  useEffect(() => {
    if (!isOpen) {
      setQrDataUrl('');
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    generateQrDataUrl(safeUrl, 260)
      .then((dataUrl) => {
        if (!active) return;
        if (dataUrl) {
          setQrDataUrl(dataUrl);
        } else {
          setError('خطا در تولید بارکد محلی');
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Failed to generate QR:', err);
        setError('خطا در پردازش تصویر بارکد');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen, safeUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(safeUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = safeUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{fileName} • {arch}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 flex flex-col items-center text-center space-y-3">
          {/* QR Code Canvas / Image Container */}
          <div className="p-4 bg-white rounded-2xl shadow-xl shadow-indigo-950/40 border-4 border-indigo-500/20 relative flex items-center justify-center min-w-[200px] min-h-[200px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 p-6 text-slate-600">
                <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold">تولید بارکد اختصاصی...</span>
              </div>
            ) : error || !qrDataUrl ? (
              <div className="flex flex-col items-center justify-center gap-2 p-4 text-rose-600">
                <AlertCircle className="w-8 h-8" />
                <span className="text-xs font-bold">{error || 'خطا در بارگذاری'}</span>
              </div>
            ) : (
              <img
                src={qrDataUrl}
                alt="QR Code for direct download"
                className="w-48 h-48 rounded-lg select-none block"
              />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm text-slate-200 font-bold flex items-center justify-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>دوربین گوشی را روی بارکد بگیرید</span>
            </p>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              لینک مستقیم فایل نصب APK باز شده و فرآیند دانلود روی گوشی اندروید آغاز می‌گردد ({fileSize}).
            </p>
          </div>

          {/* URL Box & Copy */}
          <div className="w-full flex items-center gap-2 bg-slate-950/80 rounded-xl p-2.5 border border-slate-800">
            <div className="flex-1 text-[11px] font-mono text-slate-300 break-all text-left dir-ltr truncate select-all px-1">
              {safeUrl}
            </div>
            <button
              onClick={handleCopy}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
              title="کپی لینک"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? 'کپی شد' : 'کپی'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
          <a
            href={safeUrl}
            download={fileName}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/30"
          >
            <Download className="w-4 h-4" />
            <span>دانلود مستقیم با مرورگر</span>
          </a>
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="باز کردن لینک مستقیم در تب جدید"
          >
            <ExternalLink className="w-4 h-4" />
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
