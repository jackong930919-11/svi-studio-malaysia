import React from 'react';
import { ShieldCheck, Truck, Award, Headphones, Phone, MessageCircle } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { UI_COPY } from '../data/uiTranslations';

interface FooterProps {
  currentLang: Language;
  onOpenAi: () => void;
  onNavigateToTeaching?: () => void;
  onNavigateToAccessories?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenAi,
  onNavigateToTeaching,
  onNavigateToAccessories,
}) => {
  const t = TRANSLATIONS[currentLang];
  const copy = UI_COPY[currentLang].footer;

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(copy.whatsappMessage);
    window.open(`https://api.whatsapp.com/send?phone=60186663311&text=${text}`, '_blank');
  };

  return (
    <footer className="border-t border-slate-900/80 bg-slate-950/70 backdrop-blur-sm text-slate-400 text-xs">
      {/* 4 Pillars Strip */}
      <div className="border-b border-slate-900 py-10 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.footer.g1}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{copy.serial}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.footer.g2}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{copy.replacement}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.footer.g3}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{copy.shipping}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.footer.g4}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">{copy.engineers}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl text-white">Svi Studio</span>
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-[11px] font-bold text-cyan-400 border border-cyan-800">
                MALAYSIA
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footer.aboutDesc}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: +60186663311</span>
              </p>
            </div>

          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">{copy.quickLinks}</h4>
            <ul className="space-y-2 text-xs">
              {onNavigateToAccessories && (
                <li>
                  <button onClick={onNavigateToAccessories} className="hover:text-amber-400 text-amber-300 font-semibold transition-colors flex items-center gap-1">
                    <span>{copy.accessories}</span>
                  </button>
                </li>
              )}
              {onNavigateToTeaching && (
                <li>
                  <button onClick={onNavigateToTeaching} className="hover:text-cyan-400 text-cyan-300 font-semibold transition-colors flex items-center gap-1">
                    <span>{copy.teaching}</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenAi} className="hover:text-cyan-400 transition-colors">
                  {copy.ai}
                </button>
              </li>
              <li>
                <span className="text-slate-400">{copy.genuine}</span>
              </li>
              <li>
                <span className="text-slate-400">{copy.warranty}</span>
              </li>
            </ul>
          </div>

          {/* Official Order & Service Guarantees (Replacing Payment Gateway) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {t.footer.paymentPartners}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
              <a
                href="https://api.whatsapp.com/send?phone=60186663311&text=Hi%20Svi%20Studio%20Malaysia,%20我想咨询订购电视盒"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500 text-left font-bold text-[11px] text-emerald-400 flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400 text-slate-900 shrink-0" />
                <span>{copy.order}</span>
              </a>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left font-bold text-[11px] text-cyan-400 flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{copy.freeShipping}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left font-bold text-[11px] text-blue-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{copy.replacementShort}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left font-bold text-[11px] text-amber-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{copy.certification}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{copy.support}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-slate-400 text-[11px] relative">
        <p>{t.footer.copyright}</p>
        <p className="mt-1 text-slate-500">
          {copy.legal}
        </p>
        <div className="mt-5 flex flex-col sm:flex-row justify-center items-center gap-3">
          <a
            href="https://www.facebook.com/profile.php?id=61595285290835"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <span aria-hidden="true" className="flex items-center justify-center w-4 h-4 rounded-full bg-white text-blue-600 font-black text-xs">f</span>
            <span>{copy.facebookPage}</span>
          </a>
          <button
            onClick={handleOpenWhatsApp}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{copy.whatsapp}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
