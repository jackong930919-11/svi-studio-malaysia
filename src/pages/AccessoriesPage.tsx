import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Search,
  Sliders,
  CheckCircle2,
  ShieldCheck,
  Truck,
  MessageCircle,
  X,
  Eye,
  Sparkles,
  Layers,
  Radio,
  Tv,
  Fan,
  Keyboard,
  Cable,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  PhoneCall,
  ExternalLink,
} from 'lucide-react';
import { Language } from '../types';
import { ACCESSORIES_CATALOG, StandaloneAccessory } from '../data/accessoriesData';
import { StarfieldBackground } from '../components/StarfieldBackground';
import { UI_COPY } from '../data/uiTranslations';

interface AccessoriesPageProps {
  currentLang: Language;
  onNavigateToStore: () => void;
  onNavigateToTeaching?: () => void;
}

export const AccessoriesPage: React.FC<AccessoriesPageProps> = ({
  currentLang,
  onNavigateToStore,
  onNavigateToTeaching,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<StandaloneAccessory | null>(null);
  const [selectedProductImage, setSelectedProductImage] = useState('');
  const [cartInquiryItems, setCartInquiryItems] = useState<string[]>([]);
  const copy = UI_COPY[currentLang].accessories;

  const openProductDetails = (item: StandaloneAccessory) => {
    setSelectedProduct(item);
    setSelectedProductImage(item.image);
  };

  // Keyboard Escape listener for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProduct) {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct]);

  // Categories definitions
  const categories = useMemo(() => [
    { id: 'all', labelZh: '全部配件 (All)', labelEn: 'All Accessories', labelMs: 'Semua Aksesori', icon: Layers },
    { id: 'remote', labelZh: '智能遥控器', labelEn: 'Remote Controls', labelMs: 'Alat Kawalan', icon: Radio },
    { id: 'cable', labelZh: '8K HDMI & 千兆网线', labelEn: 'HDMI & LAN Cables', labelMs: 'Kabel HDMI & LAN', icon: Cable },
    { id: 'keyboard', labelZh: '迷你飞鼠键盘', labelEn: 'Mini Keyboards', labelMs: 'Papan Kekunci', icon: Keyboard },
    { id: 'cooling', labelZh: '静音散热底座', labelEn: 'Cooling Fans', labelMs: 'Kipas Penyejuk', icon: Fan },
  ], []);

  // Filtered accessories
  const filteredAccessories = useMemo(() => {
    return ACCESSORIES_CATALOG.filter((item) => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.nameZh.toLowerCase().includes(q) ||
        item.nameMs.toLowerCase().includes(q) ||
        item.features.some((f) => f.toLowerCase().includes(q)) ||
        item.featuresZh.some((f) => f.toLowerCase().includes(q)) ||
        item.featuresMs.some((f) => f.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  // Toggle accessory in multi-item inquiry
  const toggleInquiryItem = (id: string) => {
    if (cartInquiryItems.includes(id)) {
      setCartInquiryItems(cartInquiryItems.filter((i) => i !== id));
    } else {
      setCartInquiryItems([...cartInquiryItems, id]);
    }
  };

  // WhatsApp order for single item
  const handleSingleItemWhatsApp = (item: StandaloneAccessory) => {
    const itemName = currentLang === 'zh' ? item.nameZh : currentLang === 'ms' ? item.nameMs : item.name;
    const warrantyNote = item.warranty.hasWarranty
      ? currentLang === 'zh'
        ? '质保说明：只提供 1 个月质保'
        : currentLang === 'ms'
        ? 'Waranti: 1 bulan'
        : 'Warranty: 1 month'
      : copy.fanNoWarranty;
    const text = encodeURIComponent(
      `${currentLang === 'zh' ? '你好！我想在 Svi Studio Malaysia 订购原厂配件：' : currentLang === 'ms' ? 'Hai! Saya ingin memesan aksesori rasmi daripada Svi Studio Malaysia:' : 'Hi! I would like to order an official accessory from Svi Studio Malaysia:'}\n` +
      `${currentLang === 'zh' ? '商品名称' : currentLang === 'ms' ? 'Nama produk' : 'Product'}: ${itemName}\n` +
      `${currentLang === 'zh' ? '价格' : currentLang === 'ms' ? 'Harga' : 'Price'}: RM ${item.price.toFixed(2)} (${currentLang === 'zh' ? '原价' : currentLang === 'ms' ? 'Harga asal' : 'Original price'} RM ${item.originalPrice.toFixed(2)})\n` +
      `${warrantyNote}\n` +
      `${currentLang === 'zh' ? '请问目前有现货吗？想了解如何安排包邮派送。' : currentLang === 'ms' ? 'Adakah stok tersedia dan bagaimana saya boleh mengatur penghantaran percuma?' : 'Is it in stock, and how can I arrange free delivery?'}`
    );
    window.open(`https://api.whatsapp.com/send?phone=601111766671&text=${text}`, '_blank');
  };

  // WhatsApp order for multi-item inquiry
  const handleMultiItemWhatsApp = () => {
    const selectedItems = ACCESSORIES_CATALOG.filter((item) => cartInquiryItems.includes(item.id));
    if (selectedItems.length === 0) return;

    const total = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
    const itemsList = selectedItems
      .map(
        (i, idx) =>
          `${idx + 1}. ${currentLang === 'zh' ? i.nameZh : currentLang === 'ms' ? i.nameMs : i.name} - RM ${i.price.toFixed(2)} (${
            i.warranty.hasWarranty
              ? currentLang === 'zh' ? '1个月质保' : currentLang === 'ms' ? 'Waranti 1 bulan' : '1-month warranty'
              : currentLang === 'zh' ? '特别注明:无质保' : currentLang === 'ms' ? 'Tiada waranti' : 'No warranty'
          })`
      )
      .join('\n');

    const text = encodeURIComponent(
      `${currentLang === 'zh' ? '你好！我想在 Svi Studio Malaysia 合并咨询订购以下配件：' : currentLang === 'ms' ? 'Hai! Saya ingin bertanya tentang pesanan gabungan aksesori berikut:' : 'Hi! I would like to enquire about ordering these accessories together:'}\n\n` +
      `${itemsList}\n\n` +
      `${currentLang === 'zh' ? '预估总计' : currentLang === 'ms' ? 'Jumlah anggaran' : 'Estimated total'}: RM ${total.toFixed(2)}\n` +
      `${currentLang === 'zh' ? '请问这些配件目前都有现货吗？想了解如何一并打包包邮派送。' : currentLang === 'ms' ? 'Adakah semua aksesori ini tersedia dan bolehkah penghantaran percuma dibuat dalam satu bungkusan?' : 'Are these accessories in stock, and can they be shipped together for free?'}`
    );
    window.open(`https://api.whatsapp.com/send?phone=601111766671&text=${text}`, '_blank');
  };

  const selectedInquiryCount = cartInquiryItems.length;
  const selectedInquiryTotal = ACCESSORIES_CATALOG
    .filter((item) => cartInquiryItems.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Background Interactive Starfield */}
      <StarfieldBackground />

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
          {/* Back to Home Button & Brand Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all active:scale-95 shadow-sm"
              title={copy.backTitle}
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>{currentLang === 'zh' ? '返回主页' : currentLang === 'ms' ? 'Laman Utama' : 'Back to Store'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800">
              <span className="font-extrabold text-base tracking-tight text-white">
                Svi Studio
              </span>
              <span className="rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-800">
                {copy.badge}
              </span>
            </div>
          </div>

          {/* Quick Search on Top (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xs mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.search}
              className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 rounded-full pl-9 pr-3 py-1.5 border border-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {onNavigateToTeaching && (
              <button
                onClick={onNavigateToTeaching}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-cyan-400 hover:border-slate-700 transition-all"
              >
                <span>{copy.teaching}</span>
              </button>
            )}

            <a
              href={`https://api.whatsapp.com/send?phone=601111766671&text=${encodeURIComponent(copy.whatsappSupport)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/40 transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>{copy.whatsappSupport}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Hero Section Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-cyan-950/30 p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{copy.authorization}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {copy.title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-base leading-relaxed">
              {copy.introduction}
            </p>

            {/* 4 Guarantees Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{copy.genuine}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{copy.freeShipping}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{copy.warranty}</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{copy.directOrder}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Warranty Notice Announcement Bar */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/40 border border-amber-500/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">{copy.warrantyPolicy}</span>
              <span className="text-amber-200/90 font-medium ml-1">
                {copy.warrantyPolicyText}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 font-bold text-[11px] shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            <span>{copy.fanNoWarranty}</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{currentLang === 'zh' ? cat.labelZh : currentLang === 'ms' ? cat.labelMs : cat.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile / Secondary Search */}
            <div className="relative sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={copy.searchMobile}
                className="w-full bg-slate-900/90 text-xs text-slate-200 placeholder-slate-500 rounded-xl pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <p>
              {copy.resultsPrefix} <span className="font-bold text-cyan-400">{filteredAccessories.length}</span> {copy.resultsSuffix}
            </p>
            <p className="text-[11px] text-emerald-400">
              {copy.bundleHint}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAccessories.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <Search className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">{copy.noMatch}</h3>
            <p className="text-xs text-slate-400">{copy.noMatchHelp}</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              {copy.reset}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredAccessories.map((item) => {
              const isCheckedForInquiry = cartInquiryItems.includes(item.id);
              const itemName = currentLang === 'zh' ? item.nameZh : currentLang === 'ms' ? item.nameMs : item.name;
              const features = currentLang === 'zh' ? item.featuresZh : currentLang === 'ms' ? item.featuresMs : item.features;

              return (
                <div
                  key={item.id}
                  className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col justify-between"
                >
                  {/* Top Header: Badge & Category */}
                  <div>
                    <div className="flex items-center justify-between gap-1.5 mb-2.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white bg-gradient-to-r ${item.badge.color} shadow-sm`}
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{item.badge[currentLang === 'zh' ? 'zh' : currentLang === 'ms' ? 'ms' : 'en']}</span>
                      </span>

                      {/* Multi-item Checkbox Button */}
                      <button
                        onClick={() => toggleInquiryItem(item.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all border cursor-pointer ${
                          isCheckedForInquiry
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                        title={copy.selectTitle}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isCheckedForInquiry ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600'
                          }`}
                        >
                          {isCheckedForInquiry && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <span>{copy.select}</span>
                      </button>
                    </div>

                    {/* Image Area */}
                    <div
                      onClick={() => openProductDetails(item)}
                      className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 mb-3 cursor-pointer group/img flex items-center justify-center p-3 sm:p-4"
                    >
                      <img
                        src={item.image}
                        alt={itemName}
                        className="max-w-full max-h-full w-auto h-auto object-contain object-center transition-transform duration-300 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-2 pointer-events-none">
                        <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {copy.quickView}
                        </span>
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1 mb-3">
                      <h3
                        onClick={() => openProductDetails(item)}
                        className="font-bold text-sm text-white hover:text-cyan-400 transition-colors cursor-pointer line-clamp-2"
                        title={itemName}
                      >
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{itemName}</p>
                    </div>

                    {/* Warranty Tag Badge on Card */}
                    <div className="mb-2.5">
                      {item.warranty?.hasWarranty ? (
                        <div className="inline-flex items-center gap-1 text-[10.5px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                          <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{copy.warrantyShort}</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-[10.5px] text-rose-300 font-bold bg-rose-950/80 border border-rose-500/50 px-2 py-0.5 rounded-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                          <span>{copy.fanNoWarrantyShort}</span>
                        </div>
                      )}
                    </div>

                    {/* Features list (top 3) */}
                    <ul className="space-y-1.5 text-[11px] text-slate-300 mb-4 pb-3 border-b border-slate-800/80">
                      {features.slice(0, 3).map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-black text-cyan-400">
                          RM {item.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-slate-500 line-through">
                          RM {item.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                        {copy.savings} {(item.originalPrice - item.price).toFixed(0)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => openProductDetails(item)}
                        className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 font-semibold text-xs border border-slate-700 hover:border-cyan-500/50 flex items-center justify-center gap-1 transition-all active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{copy.details}</span>
                      </button>

                      <button
                        onClick={() => handleSingleItemWhatsApp(item)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-950/40 flex items-center justify-center gap-1 transition-all active:scale-95"
                        title={copy.orderTitle}
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                        <span>{copy.order}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Multi-Item Inquiry Floating Bar */}
        {selectedInquiryCount > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-3 sm:p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/50 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">
                      {copy.selectedPrefix} {selectedInquiryCount} {copy.selectedSuffix}
                    </span>
                    <span className="text-xs font-black text-cyan-400">
                      {copy.subtotal} RM {selectedInquiryTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {copy.selectedHelp}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setCartInquiryItems([])}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all"
                >
                  {copy.clear}
                </button>
                <button
                  onClick={handleMultiItemWhatsApp}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>{copy.batchOrder} (RM {selectedInquiryTotal.toFixed(2)})</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6 cursor-default"
          >
            {/* Prominent Top-Right Exit Button */}
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/95 hover:bg-rose-600 text-slate-200 hover:text-white border border-slate-600 hover:border-rose-500 shadow-xl backdrop-blur-md transition-all duration-150 text-xs sm:text-sm font-bold group cursor-pointer active:scale-95"
              title={copy.closeTitle}
            >
              <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200 text-slate-300 group-hover:text-white" />
              <span>{copy.exit}</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
              {/* Left Column: Image & Guarantees */}
              <div className="md:col-span-5 space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-4 sm:p-6">
                  <img
                    src={selectedProductImage || selectedProduct.image}
                    alt={selectedProduct.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain object-center"
                  />
                </div>
                {selectedProduct.gallery.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[selectedProduct.image, ...selectedProduct.gallery].map((image, index) => (
                      <button
                        key={image}
                        type="button"
                        onClick={() => setSelectedProductImage(image)}
                        className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 bg-slate-950 flex items-center justify-center p-1.5 ${
                          selectedProductImage === image
                            ? 'border-cyan-400'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                        aria-label={copy.imageAlt.replace('{item}', currentLang === 'zh' ? selectedProduct.nameZh : currentLang === 'ms' ? selectedProduct.nameMs : selectedProduct.name).replace('{index}', String(index + 1))}
                      >
                        <img
                          src={image}
                          alt=""
                          className="max-w-full max-h-full w-auto h-auto object-contain object-center"
                        />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{copy.genuineParts}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedProduct.warranty?.hasWarranty ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-emerald-400">{copy.warranty}</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="font-bold text-rose-400">{copy.fanNoWarrantyShort}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>{copy.express}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Details & Specs */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-white bg-gradient-to-r ${selectedProduct.badge.color}`}
                    >
                      {selectedProduct.badge[currentLang === 'zh' ? 'zh' : currentLang === 'ms' ? 'ms' : 'en']}
                    </span>
                    <span className="text-xs text-cyan-400 font-semibold">
                      {currentLang === 'zh'
                        ? selectedProduct.categoryLabelZh
                        : currentLang === 'ms'
                        ? selectedProduct.categoryLabelMs
                        : selectedProduct.categoryLabelEn}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white">{selectedProduct.name}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentLang === 'zh' ? selectedProduct.nameZh : currentLang === 'ms' ? selectedProduct.nameMs : selectedProduct.name}
                  </p>
                </div>

                {/* Price Bar */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-cyan-400">
                        RM {selectedProduct.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-500 line-through">
                        RM {selectedProduct.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      {copy.savings} {(selectedProduct.originalPrice - selectedProduct.price).toFixed(0)} · {copy.freeShipping}
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400">{copy.inventory}</span>
                    <p className="text-emerald-400 font-bold">{selectedProduct.stockCount} {copy.available}</p>
                  </div>
                </div>

                {/* Explicit Warranty Policy Highlight Box */}
                {selectedProduct.warranty?.hasWarranty ? (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <span className="font-bold text-emerald-400 block">
                        {copy.warrantyTitle}
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                        {copy.warrantyText}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-start gap-2.5">
                    <div className="p-1 rounded bg-rose-500/20 text-rose-400 shrink-0 mt-0.5">
                      <X className="w-3.5 h-3.5 text-rose-400" />
                    </div>
                    <div className="text-xs">
                      <span className="font-black text-rose-300 block">
                        {copy.fanWarrantyTitle}
                      </span>
                      <p className="text-[11px] text-rose-200/90 mt-0.5 leading-relaxed">
                        {copy.fanWarrantyText}
                      </p>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
                  {currentLang === 'zh' ? selectedProduct.summaryZh : currentLang === 'ms' ? selectedProduct.summaryMs : selectedProduct.summaryEn}
                </p>

                {/* Full Features */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                    {copy.features}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {(currentLang === 'zh' ? selectedProduct.featuresZh : currentLang === 'ms' ? selectedProduct.featuresMs : selectedProduct.features).map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compatibility */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="font-bold text-cyan-400 block mb-0.5">{copy.compatible}</span>
                  <p className="text-slate-300 text-[11px]">{selectedProduct.compatibility[currentLang]}</p>
                </div>

                {/* Specs Matrix */}
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1.5">
                    {copy.specifications}
                  </h4>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {selectedProduct.specs[currentLang].map((s, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800/80">
                        <span className="text-slate-400 block text-[10px]">{s.label}:</span>
                        <span className="font-semibold text-slate-200">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      toggleInquiryItem(selectedProduct.id);
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      cartInquiryItems.includes(selectedProduct.id)
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    {cartInquiryItems.includes(selectedProduct.id) ? copy.addedToInquiry : copy.addToInquiry}
                  </button>

                  <button
                    onClick={() => handleSingleItemWhatsApp(selectedProduct)}
                    className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 fill-slate-950" />
                    <span>{copy.orderItem}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>{copy.footer}</p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <button onClick={onNavigateToStore} className="hover:text-cyan-400 transition-colors">
              {copy.backStore}
            </button>
            <span>·</span>
            {onNavigateToTeaching && (
              <button onClick={onNavigateToTeaching} className="hover:text-cyan-400 transition-colors">
                {copy.viewTeaching}
              </button>
            )}
            <span>·</span>
            <a
              href="https://api.whatsapp.com/send?phone=601111766671"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300"
            >
              {copy.contact}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
