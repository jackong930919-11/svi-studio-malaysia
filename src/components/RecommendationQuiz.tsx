import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, MessageCircle, Eye, Zap } from 'lucide-react';
import { TVBoxProduct, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

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

  // Match calculation logic
  const calculateBestMatch = (): { product: TVBoxProduct; score: number; reason: string } => {
    // 1. Home Theater Soundbar match
    if (answers.priority === 'soundbar' || answers.priority === 'travel') {
      const p = products.find((prod) => prod.id === 'svi-soundbar10') || products[4];
      return {
        product: p,
        score: 99,
        reason:
          currentLang === 'zh'
            ? 'Svicloud Soundbar 10 (RM1399) 拥有 300W 峰值功率与 6.5 寸无线深沉低音炮，支持真实杜比全景声 3D 环绕，完美升级客厅家庭影院！'
            : 'Svicloud Soundbar 10 (RM1399) features 300W peak power and wireless deep subwoofer with Dolby Atmos for full living room cinema immersion!',
      };
    }

    // 2. Elderly parents / budget family match
    if (answers.priority === 'elderly') {
      const p = products.find((prod) => prod.id === 'svi-10s') || products[1];
      return {
        product: p,
        score: 99,
        reason:
          currentLang === 'zh'
            ? 'Svicloud 10S (RM549) 简易大图标界面，开机直接播放直播电视台，长辈一键语音呼出频道，RM549 高性价比首选！'
            : 'Svicloud 10S (RM549) features oversized easy icons and boots directly into live TV channels with voice commands!',
      };
    }

    // 3. Sports & Ultimate 8GB Monster Performance
    if (answers.priority === 'sports' || answers.wifiDistance === 'lan' || answers.tvType === '8k') {
      const p = products.find((prod) => prod.id === 'svi-15p') || products[3];
      return {
        product: p,
        score: 98,
        reason:
          currentLang === 'zh'
            ? 'Svicloud 15P (RM749) 搭载晶晨 S928X 强芯、8GB 超大运存、千兆网口与英超/欧冠零延迟专线服务器，性能天花板当之无愧！'
            : 'Svicloud 15P (RM749) with 8GB RAM, Gigabit LAN, and dedicated sports stream engine ensures zero-lag live football!',
      };
    }

    // 4. Next-Gen 8K AV1 & Karaoke
    if (answers.priority === 'karaoke') {
      const p = products.find((prod) => prod.id === 'svi-10p') || products[2];
      return {
        product: p,
        score: 97,
        reason:
          currentLang === 'zh'
            ? 'Svicloud 10P (RM699) 全面升级 8K AV1 解码与双频 WiFi 6，内置家庭 KTV 点歌娱乐系统，新一代旗舰全能机型！'
            : 'Svicloud 10P (RM699) features 8K AV1 decoding, WiFi 6, and built-in home karaoke KTV system for family entertainment!',
      };
    }

    // 5. Default Bestseller Flagship 9P
    const p = products.find((prod) => prod.id === 'svi-9p') || products[0];
    return {
      product: p,
      score: 96,
      reason:
        currentLang === 'zh'
          ? 'Svicloud 9P (RM699) 是全马销量第一经典旗舰，4G+64G 内存、双频 WiFi 6、8K 超清解码与终身免费直播，品质有口皆碑！'
          : 'Svicloud 9P (RM699) is Malaysia #1 best-selling flagship with 4GB+64GB, WiFi 6, and 8K clarity for family living rooms!',
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
                  <span className="text-xs text-slate-400">日常 1080P / 4K 播放，性价比第一</span>
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
                  <span className="text-xs text-slate-400">超大尺寸 OLED/QLED，发烧画质追求</span>
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
                    {currentLang === 'zh' ? result.product.nameZh : result.product.name}
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
                  const pName = currentLang === 'zh' ? result.product.nameZh : result.product.name;
                  const text = encodeURIComponent(
                    `你好！我在 Svi Studio 智能测验中匹配了推荐型号：【${pName}】(RM${result.product.price})，请问有现货吗？想通过 WhatsApp 专人下单订购！`
                  );
                  window.open(`https://api.whatsapp.com/send?phone=601111766671&text=${text}`, '_blank');
                  onClose();
                }}
                className="flex-1 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 active:scale-95 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>WhatsApp 订购此推荐机型</span>
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
                  <span>查看详情</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
