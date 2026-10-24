import React, { useState } from 'react';
import { Eye, Star, Share2, Check, Wifi, Cpu, ShieldCheck, Zap, MessageCircle } from 'lucide-react';
import { TVBoxProduct, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { UI_COPY } from '../data/uiTranslations';

interface ProductCardProps {
  product: TVBoxProduct;
  currentLang: Language;
  onViewDetails: (product: TVBoxProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currentLang,
  onViewDetails,
}) => {
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const t = TRANSLATIONS[currentLang];
  const copy = UI_COPY[currentLang];

  const productName = currentLang === 'zh' ? product.nameZh : currentLang === 'ms' ? product.nameMs : product.name;
  const productSubtitle = currentLang === 'zh' ? product.subtitleZh : currentLang === 'ms' ? product.subtitleMs : product.subtitle;
  const badgeText = currentLang === 'zh' ? product.badge.textZh : currentLang === 'ms' ? product.badge.textMs : product.badge.textEn;

  const handleCopyShare = (platform: 'whatsapp' | 'facebook' | 'copy') => {
    const url = window.location.href;
    const shareText = copy.productCard.shareText
      .replace('{name}', productName)
      .replace('{originalPrice}', String(product.originalPrice))
      .replace('{price}', String(product.price))
      .replace('{url}', url);

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowShareMenu(false);
  };

  const isLowStock = product.stock <= product.lowStockThreshold;

  return (
    <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 p-3 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between">
      {/* Top Floating Badge */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-bold text-white bg-gradient-to-r ${product.badge.color} shadow-sm`}
        >
          <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          {badgeText}
        </span>

        {/* Share Button & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
            title={copy.nav.share}
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {showShareMenu && (
            <div className="absolute right-0 top-7 sm:top-8 z-20 w-40 sm:w-44 rounded-xl bg-slate-950 border border-slate-700 shadow-2xl py-1 text-[11px] sm:text-xs">
              <button
                onClick={() => handleCopyShare('whatsapp')}
                className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-emerald-950/60 hover:text-emerald-400 flex items-center gap-2"
              >
                <span>{copy.nav.shareWhatsapp}</span>
              </button>
              <button
                onClick={() => handleCopyShare('facebook')}
                className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-blue-950/60 hover:text-blue-400 flex items-center gap-2"
              >
                <span>{copy.nav.facebook}</span>
              </button>
              <button
                onClick={() => handleCopyShare('copy')}
                className="w-full text-left px-3 py-1.5 text-slate-200 hover:bg-slate-800 flex items-center justify-between"
              >
                <span>{copied ? copy.nav.copied : copy.nav.copyLink}</span>
                {copied && <Check className="w-3 h-3 text-cyan-400" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Image Showcase */}
      <div
        onClick={() => onViewDetails(product)}
        className="relative overflow-hidden rounded-xl bg-slate-950 aspect-[4/3] mb-2.5 sm:mb-4 cursor-pointer flex items-center justify-center p-2.5 sm:p-3 group/img group-hover:shadow-inner"
      >
        <img
          src={product.image}
          alt={productName}
          className="max-w-full max-h-full w-auto h-auto object-contain object-center group-hover/img:scale-105 transition-transform duration-300 opacity-95 group-hover/img:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none"></div>

        {/* Stock pill on bottom left of image */}
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5">
          {isLowStock ? (
            <span className="inline-flex items-center gap-1 rounded bg-rose-950/90 border border-rose-700/80 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-rose-300">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
              {t.products.lowStock} ({product.stock})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-950/90 border border-emerald-700/80 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {t.products.inStock} ({product.stock})
            </span>
          )}
        </div>

        {/* Quick View Button Hover overlay */}
        <div className="absolute inset-0 bg-cyan-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center">
          <button className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900/90 text-cyan-300 font-semibold text-[11px] sm:text-xs border border-cyan-500/50 flex items-center gap-1.5 shadow-lg">
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{t.products.viewDetails}</span>
          </button>
        </div>
      </div>

      {/* Product Title and Subtitle */}
      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3 flex-1">
        <h3
          onClick={() => onViewDetails(product)}
          className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors cursor-pointer leading-snug"
        >
          {productName}
        </h3>
        <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {productSubtitle}
        </p>
      </div>

      {/* Spec Pills */}
      <div className="grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] mb-2.5 sm:mb-4 text-slate-300">
        <div className="flex items-center gap-1 p-1 sm:p-1.5 rounded bg-slate-950/70 border border-slate-800/80">
          <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
          <span className="truncate">{product.specs.ramRom}</span>
        </div>
        <div className="flex items-center gap-1 p-1 sm:p-1.5 rounded bg-slate-950/70 border border-slate-800/80">
          <Wifi className="w-3 h-3 text-indigo-400 shrink-0" />
          <span className="truncate">{product.specs.wifi.split(' ')[0]}</span>
        </div>
      </div>

      {/* Ratings & Sales count */}
      <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-400 pb-2 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" />
          <span className="font-bold text-white text-[11px] sm:text-xs">{product.rating}</span>
          <span className="text-slate-500 text-[10px] sm:text-[11px]">({product.reviewCount})</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span className="truncate">{product.specs.warranty}</span>
        </div>
      </div>

      {/* Pricing and Action Buttons */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-2xl font-black text-cyan-400">RM {product.price}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 line-through">RM {product.originalPrice}</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-emerald-400 font-medium">
              {product.id === 'svi-9p'
                ? copy.productCard.limitedOffer
                : copy.productCard.shippingWarranty}
            </p>
          </div>
        </div>

        {/* Action Buttons: View Details & WhatsApp Order */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <button
            onClick={() => onViewDetails(product)}
            className="w-full py-1.5 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-semibold text-[11px] sm:text-xs border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center gap-1 transition-all active:scale-95"
          >
            <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{t.products.viewDetails}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const text = encodeURIComponent(
                copy.productCard.orderText
                  .replace('{name}', productName)
                  .replace('{price}', String(product.price))
              );
              window.open(`https://api.whatsapp.com/send?phone=601111766671&text=${text}`, '_blank');
            }}
            className="w-full py-1.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold text-[11px] sm:text-xs shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1 transition-all active:scale-95"
            title={copy.productCard.whatsappOrder}
          >
            <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950" />
            <span>{copy.productCard.whatsappOrder}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
