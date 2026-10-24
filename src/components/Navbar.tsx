import React, { useState } from 'react';
import {
  Search,
  Languages,
  User,
  MessageSquareQuote,
  Bot,
  Video,
  MessageCircle,
  Radio,
  Tv,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { UI_COPY } from '../data/uiTranslations';

interface NavbarProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenQuiz: () => void;
  onOpenAi: () => void;
  onOpenAuth: () => void;
  onNavigateToTeaching: () => void;
  onNavigateToAccessories?: () => void;
  onScrollToSection: (sectionId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  onOpenQuiz,
  onOpenAi,
  onOpenAuth,
  onNavigateToTeaching,
  onNavigateToAccessories,
  onScrollToSection,
  searchQuery,
  setSearchQuery,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = TRANSLATIONS[currentLang];
  const copy = UI_COPY[currentLang].nav;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-md">
      {/* Single Clean Unified Navbar Row */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Logo - Strictly Single Line */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group whitespace-nowrap shrink-0"
        >
          <img
            src="/images/Brand/svi-studio-logo.png"
            alt="Svi Studio 小云映画"
            className="w-24 sm:w-28 h-auto shrink-0"
          />

          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-cyan-400 border border-cyan-800">
              MALAYSIA
            </span>
          </div>
        </button>

        {/* Navigation Links - Single Harmonious Row */}
        <nav className="hidden md:flex items-center gap-3.5 lg:gap-5 text-sm font-medium text-slate-300 whitespace-nowrap">
          <button
            onClick={() => onScrollToSection('products-section')}
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors whitespace-nowrap py-1"
          >
            <Tv className="w-4 h-4 text-cyan-400" />
            <span>{t.nav.products}</span>
          </button>

          {onNavigateToAccessories && (
            <button
              onClick={onNavigateToAccessories}
              className="flex items-center gap-1.5 hover:text-amber-400 text-amber-300 transition-colors whitespace-nowrap py-1 font-semibold"
            >
              <Radio className="w-4 h-4 text-amber-400" />
              <span>{t.nav.accessories}</span>
            </button>
          )}

          <button
            onClick={onNavigateToTeaching}
            className="flex items-center gap-1.5 hover:text-cyan-400 text-cyan-300 transition-colors whitespace-nowrap py-1 font-semibold"
          >
            <Video className="w-4 h-4 text-cyan-400" />
            <span>{t.nav.teaching}</span>
          </button>

          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors whitespace-nowrap py-1"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.nav.quiz}</span>
          </button>

          <button
            onClick={() => onScrollToSection('reviews-section')}
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors whitespace-nowrap py-1"
          >
            <MessageSquareQuote className="w-4 h-4 text-slate-400" />
            <span>{t.nav.reviews}</span>
          </button>

          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 hover:text-indigo-300 text-indigo-400 transition-colors whitespace-nowrap py-1"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>{currentLang === 'zh' ? 'AI 客服' : currentLang === 'ms' ? 'Bantuan AI' : 'AI Help'}</span>
          </button>
        </nav>

        {/* Compact Search Bar (Desktop) */}
        <div className="hidden xl:flex items-center relative w-48 2xl:w-60 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={copy.search}
            className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 rounded-full pl-8 pr-3 py-1.5 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Right Action Icons: Language, Mobile buttons, WhatsApp */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap shrink-0">
          {/* Quick Accessories & Teaching Buttons on Mobile */}
          {onNavigateToAccessories && (
            <button
              onClick={onNavigateToAccessories}
              className="md:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-950/80 border border-amber-800 text-[10px] text-amber-300 font-bold hover:bg-amber-900 transition-all whitespace-nowrap"
              title={copy.accessoryShort}
            >
              <Radio className="w-3 h-3 text-amber-400" />
              <span>{copy.accessoryShort}</span>
            </button>
          )}

          <button
            onClick={onNavigateToTeaching}
            className="md:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800 text-[10px] text-cyan-300 font-bold hover:bg-cyan-900 transition-all whitespace-nowrap"
            title={copy.teachingShort}
          >
            <Video className="w-3 h-3 text-cyan-400" />
            <span>{copy.teachingShort}</span>
          </button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-[11px] sm:text-xs text-slate-300 hover:text-white hover:border-slate-700 transition-all whitespace-nowrap"
            >
              <Languages className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
              <span className="font-semibold uppercase">{currentLang}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 sm:w-36 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    onSelectLang('zh');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs flex items-center justify-between ${
                    currentLang === 'zh' ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>简体中文</span>
                  {currentLang === 'zh' && <span>✓</span>}
                </button>
                <button
                  onClick={() => {
                    onSelectLang('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs flex items-center justify-between ${
                    currentLang === 'en' ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>English</span>
                  {currentLang === 'en' && <span>✓</span>}
                </button>
                <button
                  onClick={() => {
                    onSelectLang('ms');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-xs flex items-center justify-between ${
                    currentLang === 'ms' ? 'text-cyan-400 font-bold bg-cyan-950/40' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>Bahasa Melayu</span>
                  {currentLang === 'ms' && <span>✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* User Account / Login */}
          <button
            onClick={onOpenAuth}
            className="p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all shrink-0"
            title={copy.account}
          >
            <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          {/* Direct WhatsApp Consultation / Order Button (Hidden on Mobile) */}
          <a
            href={`https://api.whatsapp.com/send?phone=60186663311&text=${encodeURIComponent(copy.whatsapp)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/40 transition-all active:scale-95 whitespace-nowrap shrink-0"
            title={copy.whatsapp}
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>{copy.whatsapp}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
