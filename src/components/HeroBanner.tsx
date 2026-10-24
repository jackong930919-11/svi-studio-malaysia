import React from 'react';
import { ShieldCheck, Truck, Sparkles, CheckCircle2, Play, Flame, Tv, Wifi, Award } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MoviePosterWall } from './MoviePosterWall';

interface HeroBannerProps {
  currentLang: Language;
  onExploreProducts: () => void;
  onStartQuiz: () => void;
  onQuickSelectFlagship: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentLang,
  onExploreProducts,
  onStartQuiz,
  onQuickSelectFlagship,
}) => {
  const t = TRANSLATIONS[currentLang];

  return (
    <section className="relative overflow-hidden pt-5 pb-6 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-16 border-b border-slate-900/60 bg-radial-[at_50%_0%] from-cyan-950/20 via-slate-950/30 to-transparent">
      {/* Background Neon Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-center">
          {/* Left Column: Headlines, Slogans, Guarantees */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-6 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-[9px] sm:text-xs font-semibold shadow-inner">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 animate-pulse" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Title */}
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight leading-snug sm:leading-[1.15]">
              {t.hero.titleHighlight}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                {t.hero.titleMain}
              </span>
            </h1>

            {/* Subtext description */}
            <p className="text-slate-300 text-[11px] sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.hero.desc}
            </p>

            {/* 4 Core Pillars */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-3 pt-1">
              <div className="flex items-center gap-1.5 p-1.5 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[9px] sm:text-xs text-slate-200">
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{t.hero.sirimBadge}</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[9px] sm:text-xs text-slate-200">
                <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{t.hero.warrantyBadge}</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[9px] sm:text-xs text-slate-200">
                <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                <span className="truncate">{t.hero.shippingBadge}</span>
              </div>
              <div className="flex items-center gap-1.5 p-1.5 sm:p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[9px] sm:text-xs text-slate-200">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{t.hero.freeGiftBadge}</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-4 pt-1.5 sm:pt-4">
              <button
                onClick={onExploreProducts}
                className="w-full sm:w-auto px-4 py-2 sm:px-7 sm:py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[11px] sm:text-sm shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-1.5"
              >
                <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t.hero.ctaBuy}</span>
              </button>

              <button
                onClick={onStartQuiz}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-cyan-400 font-bold text-[11px] sm:text-sm border border-cyan-800/80 hover:border-cyan-500 shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span>{t.hero.ctaQuiz}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Flagship Hardware Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/95 p-1 sm:p-1.5 border border-slate-700/80 shadow-2xl shadow-cyan-950/40">
              {/* Inner Preview Window */}
              <div className="relative overflow-hidden rounded-xl bg-slate-950 p-2 sm:p-4 space-y-2 sm:space-y-3">
                {/* Top Badge */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[8px] sm:text-[10px] font-bold">
                    <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400" />
                    Bestseller • Svicloud 15P
                  </span>
                  <span className="text-[8px] sm:text-[10px] text-slate-400 flex items-center gap-1">
                    <Wifi className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                    WiFi 6E + 8K Ultra HDR
                  </span>
                </div>

                {/* Device Image Preview with Glow */}
                <div className="relative group overflow-hidden rounded-lg bg-slate-950 aspect-square flex items-center justify-center border border-slate-800 p-1 sm:p-2">
                  <img
                    src="/images/Profile/15P_main.jpg"
                    alt="Svicloud 15P Flagship TV Box"
                    className="max-w-full max-h-full w-auto h-auto object-contain object-center group-hover:scale-105 transition-transform duration-300 opacity-95 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-white text-[8px] sm:text-[10px]">
                    <span className="font-semibold bg-black/60 px-1 py-0.5 rounded backdrop-blur truncate max-w-[65%]">
                      小云 15P 极致性能巅峰机皇
                    </span>
                    <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800">
                      现货 22 台
                    </span>
                  </div>
                </div>

                {/* Key Spec highlights */}
                <div className="grid grid-cols-3 gap-1 sm:gap-1.5 text-center">
                  <div className="p-1 sm:p-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <p className="text-slate-400 text-[7px] sm:text-[9px]">运行内存</p>
                    <p className="font-bold text-white text-[9px] sm:text-xs">8GB+128GB</p>
                  </div>
                  <div className="p-1 sm:p-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <p className="text-slate-400 text-[7px] sm:text-[9px]">最高分辨率</p>
                    <p className="font-bold text-cyan-400 text-[9px] sm:text-xs">8K 超高清</p>
                  </div>
                  <div className="p-1 sm:p-1.5 rounded-lg bg-slate-900/90 border border-slate-800">
                    <p className="text-slate-400 text-[7px] sm:text-[9px]">官方认证</p>
                    <p className="font-bold text-emerald-400 text-[9px] sm:text-xs">SIRIM/MCMC</p>
                  </div>
                </div>

                {/* Live Channel Strip */}
                <div className="p-1 sm:p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[8px] sm:text-[10px] text-slate-300 flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 truncate">
                    <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 fill-red-500 shrink-0" />
                    <span className="truncate">预装 1,000+ 热门频道 (VIP 体育/4K点播)</span>
                  </div>
                  <span className="text-amber-400 font-semibold shrink-0 text-[8px] sm:text-[10px]">终身无月费</span>
                </div>

                {/* Price and Instant Quick Order */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base sm:text-xl font-black text-cyan-400">RM 749</span>
                      <span className="text-[8px] sm:text-[10px] text-slate-500 line-through">RM 849</span>
                    </div>
                    <p className="text-[7px] sm:text-[9px] text-emerald-400 font-medium">全马包邮 · 赠千兆网线+8K线+飞鼠键盘</p>
                  </div>

                  <button
                    onClick={onQuickSelectFlagship}
                    className="px-2.5 py-1 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-[9px] sm:text-[10px] shadow-md transition-all active:scale-95"
                  >
                    WhatsApp 订购 15P
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visual Position: Animated Movie Poster Wall Showcase */}
      <MoviePosterWall onSelectBox={onQuickSelectFlagship} />
    </section>
  );
};
