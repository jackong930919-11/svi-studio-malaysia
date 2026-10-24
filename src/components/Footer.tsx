import React from 'react';
import { ShieldCheck, Truck, Award, Headphones, Phone, MessageCircle, Lock, Lightbulb } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  currentLang: Language;
  onOpenAdmin: () => void;
  onOpenAi: () => void;
  onNavigateToTeaching?: () => void;
  onNavigateToAccessories?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLang,
  onOpenAdmin,
  onOpenAi,
  onNavigateToTeaching,
  onNavigateToAccessories,
}) => {
  const t = TRANSLATIONS[currentLang];

  const handleOpenWhatsApp = () => {
    window.open('https://api.whatsapp.com/send?phone=601111766671&text=Hi%20Svi%20Studio%20Malaysia,%20I%20would%20like%20to%20inquire%20about%20TV%20Box%20models', '_blank');
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
                <p className="text-[11px] text-slate-400 mt-0.5">每台机身配带专属电子核验防伪标</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.footer.g2}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">硬件非人为损坏原厂直接换新</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.footer.g3}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">西马 1-2 天送到 · 东马航空直发</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{t.footer.g4}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">全马本地工程师在线指导网络配置</p>
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
                <span>WhatsApp: +601111766671</span>
              </p>
            </div>

            {/* WhatsApp Direct Chat Button */}
            <button
              onClick={handleOpenWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>官方 WhatsApp 咨询: +601111766671</span>
            </button>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">客户服务 & 导航</h4>
            <ul className="space-y-2 text-xs">
              {onNavigateToAccessories && (
                <li>
                  <button onClick={onNavigateToAccessories} className="hover:text-amber-400 text-amber-300 font-semibold transition-colors flex items-center gap-1">
                    <span>⚡ 原厂配件与周边专区 (Accessories)</span>
                  </button>
                </li>
              )}
              {onNavigateToTeaching && (
                <li>
                  <button onClick={onNavigateToTeaching} className="hover:text-cyan-400 text-cyan-300 font-semibold transition-colors flex items-center gap-1">
                    <span>🎬 官方教學視頻庫 (Teaching Videos)</span>
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenAi} className="hover:text-cyan-400 transition-colors">
                  SviBot 24/7 AI 客服咨询
                </button>
              </li>
              <li>
                <span className="text-slate-400">100% 官方正品 (SIRIM & MCMC 认证)</span>
              </li>
              <li>
                <span className="text-slate-400">只有 1年内原厂 1对1 换新质保</span>
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
                href="https://api.whatsapp.com/send?phone=601111766671&text=Hi%20Svi%20Studio%20Malaysia,%20我想咨询订购电视盒"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500 text-left font-bold text-[11px] text-emerald-400 flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400 text-slate-900 shrink-0" />
                <span>WhatsApp 专人下单</span>
              </a>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left font-bold text-[11px] text-cyan-400 flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>全马包邮现货直发</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left font-bold text-[11px] text-blue-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>1年原厂1对1换新</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left font-bold text-[11px] text-amber-400 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>SIRIM / MCMC 正品</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5 text-[11px] text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>官方专员 1 对 1 售前咨询与现货确认，安排极速安全派送，安心无忧。</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-6 px-4 text-center text-slate-400 text-[11px] relative">
        <p>{t.footer.copyright}</p>
        <p className="mt-1 text-slate-500">
          Svi Studio Malaysia 官方指定直属专卖店 · 认准 SIRIM QAS 贴纸
        </p>

        {/* Discreet Bulb Logo at the Bottom Right Corner (Disguised Admin Entrance) */}
        <div className="mt-3 flex justify-center sm:absolute sm:right-6 sm:bottom-5 sm:mt-0">
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded-full text-slate-700 hover:text-amber-400 hover:bg-slate-900/80 transition-all opacity-40 hover:opacity-100"
            title="Tips"
            aria-label="Tips"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
