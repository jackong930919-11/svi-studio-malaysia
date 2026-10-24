import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, MessageCircle, Eye, Zap } from 'lucide-react';
import { TVBoxProduct, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { UI_COPY } from '../data/uiTranslations';

interface RecommendationQuizProps {
  isOpen: boolean;
  onClose: () => void;
  products: TVBoxProduct[];
  currentLang: Language;
  onSelectProduct?: (product: TVBoxProduct) => void;
}

export const RecommendationQuiz: React.FC<RecommendationQuizProps> = ({
  isOpen,
  onClose,
  products,
  currentLang,
  onSelectProduct,
}) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    tvType: '',
    priority: '',
    wifiDistance: '',
  });

  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang];
  const copy = UI_COPY[currentLang].quiz;

  // Match calculation logic
  const calculateBestMatch = (): { product: TVBoxProduct; score: number; reason: string } => {
    // 1. Home Theater Soundbar match
    if (answers.priority === 'soundbar' || answers.priority === 'travel') {
      const p = products.find((prod) => prod.id === 'svi-soundbar10') || products[4];
      return {
        product: p,
        score: 99,
        reason: copy.soundbarReason,
      };
    }

    // 2. Elderly parents / budget family match
    if (answers.priority === 'elderly') {
      const p = products.find((prod) => prod.id === 'svi-10s') || products[1];
      return {
        product: p,
        score: 99,
        reason: copy.familyReason,
      };
    }

    // 3. Sports and flagship performance
    if (answers.priority === 'sports' || answers.wifiDistance === 'lan') {
      const p = products.find((prod) => prod.id === 'svi-15p') || products[3];
      return {
        product: p,
        score: 98,
        reason: copy.sportsReason,
      };
    }

    // 4. Dual-band Wi-Fi and karaoke
    if (answers.priority === 'karaoke') {
      const p = products.find((prod) => prod.id === 'svi-10p') || products[2];
      return {
        product: p,
        score: 97,
        reason: copy.karaokeReason,
      };
    }

    // 5. Default Bestseller Flagship 9P
    const p = products.find((prod) => prod.id === 'svi-9p') || products[0];
    return {
      product: p,
      score: 96,
      reason: copy.flagshipReason,
    };
  };

  const isCompleted = step > 3;
  const result = isCompleted ? calculateBestMatch() : null;

  const handleReset = () => {
    setStep(1);
    setAnswers({ tvType: '', priority: '', wifiDistance: '' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Wizard Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3 shadow-inner">
            <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black text-white">{t.quiz.title}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">{t.quiz.subtitle}</p>

          {/* Stepper Dots */}
          {!isCompleted && (
            <div className="flex items-center justify-center gap-2 mt-4">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s === step ? 'w-8 bg-cyan-400' : s < step ? 'w-4 bg-emerald-400' : 'w-4 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Step 1: TV Type */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-200">{t.quiz.step1}</h4>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setAnswers({ ...answers, tvType: '4k' });
                  setStep(2);
                }}
                className="w-full p-4 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                    {t.quiz.step1Opt1}
                  </p>
                  <span className="text-xs text-slate-400">{copy.dailyUse}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setAnswers({ ...answers, tvType: '8k' });
                  setStep(2);
                }}
                className="w-full p-4 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                    {t.quiz.step1Opt2}
                  </p>
                  <span className="text-xs text-slate-400">{copy.largeScreen}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Main viewing priority */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-200">{t.quiz.step2}</h4>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setAnswers({ ...answers, priority: 'sports' });
                  setStep(3);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                    ⚽ {t.quiz.step2Opt1}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setAnswers({ ...answers, priority: 'elderly' });
                  setStep(3);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                    👵 {t.quiz.step2Opt2}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setAnswers({ ...answers, priority: 'karaoke' });
                  setStep(3);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                    🎤 {t.quiz.step2Opt3}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setAnswers({ ...answers, priority: 'travel' });
                  setStep(3);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                    ✈️ {t.quiz.step2Opt4}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: WiFi distance */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-sm font-bold text-slate-200">{t.quiz.step3}</h4>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setAnswers({ ...answers, wifiDistance: 'close' });
                  setStep(4);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                  📶 {t.quiz.step3Opt1}
                </p>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setAnswers({ ...answers, wifiDistance: 'far' });
                  setStep(4);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                  🧱 {t.quiz.step3Opt2}
                </p>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setAnswers({ ...answers, wifiDistance: 'lan' });
                  setStep(4);
                }}
                className="w-full p-3.5 rounded-xl border border-slate-700 hover:border-cyan-500 bg-slate-950/60 hover:bg-cyan-950/20 text-left transition-all flex items-center justify-between group"
              >
                <p className="font-semibold text-sm text-slate-200 group-hover:text-cyan-400">
                  🔌 {t.quiz.step3Opt3}
                </p>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Result Display */}
        {isCompleted && result && (
          <div className="space-y-5 animate-in zoom-in-95 duration-300">
            {/* Top Match Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/50 to-slate-950 border border-cyan-500/50 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.quiz.bestMatchBadge}
                </span>
                <span className="text-xs font-black text-cyan-400">
                  {t.quiz.matchScore}: {result.score}%
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={result.product.image}
                  alt={result.product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-700"
                />
                <div>
                  <h4 className="text-lg font-black text-white">
                    {currentLang === 'zh' ? result.product.nameZh : currentLang === 'ms' ? result.product.nameMs : result.product.name}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-1">{result.product.specs.ramRom}</p>
                  <p className="text-xl font-black text-cyan-400 mt-1">
                    RM {result.product.price}
                    <span className="text-xs text-slate-500 line-through ml-2">
                      RM {result.product.originalPrice}
                    </span>
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="font-bold text-amber-400">{t.quiz.reasonTitle} </span>
                {result.reason}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.quiz.retakeBtn}</span>
              </button>

              <button
                onClick={() => {
                  const pName = currentLang === 'zh' ? result.product.nameZh : currentLang === 'ms' ? result.product.nameMs : result.product.name;
                  const text = encodeURIComponent(
                    copy.whatsapp.replace('{name}', pName).replace('{price}', String(result.product.price))
                  );
                  window.open(`https://api.whatsapp.com/send?phone=60186663311&text=${text}`, '_blank');
                  onClose();
                }}
                className="flex-1 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>{currentLang === 'zh' ? 'WhatsApp 订购此推荐机型' : currentLang === 'ms' ? 'Pesan model ini melalui WhatsApp' : 'Order this recommendation via WhatsApp'}</span>
              </button>

              {onSelectProduct && (
                <button
                  onClick={() => {
                    onSelectProduct(result.product);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{copy.details}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
