import React, { useState, useEffect } from 'react';
import { X, Check, Star, ShieldCheck, Truck, Plus, Minus, CheckCircle2, Info, MessageCircle, Sparkles } from 'lucide-react';
import { TVBoxProduct, AccessoryOption, Language } from '../types';
import { ACCESSORY_OPTIONS } from '../data/initialData';
import { TRANSLATIONS } from '../data/translations';

interface ProductModalProps {
  product: TVBoxProduct | null;
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  currentLang,
}) => {
  const [selectedImg, setSelectedImg] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryOption[]>([]);
  const [showWarrantyModal, setShowWarrantyModal] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showWarrantyModal) {
          setShowWarrantyModal(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showWarrantyModal, onClose]);

  if (!isOpen || !product) return null;

  const t = TRANSLATIONS[currentLang];
  const activeImage = selectedImg || product.image;

  const productName = currentLang === 'zh' ? product.nameZh : currentLang === 'ms' ? product.nameMs : product.name;
  const productSubtitle = currentLang === 'zh' ? product.subtitleZh : currentLang === 'ms' ? product.subtitleMs : product.subtitle;
  const highlights = product.highlights[currentLang] || product.highlights.zh;

  const toggleAccessory = (acc: AccessoryOption) => {
    if (selectedAccessories.some((a) => a.id === acc.id)) {
      setSelectedAccessories(selectedAccessories.filter((a) => a.id !== acc.id));
    } else {
      setSelectedAccessories([...selectedAccessories, acc]);
    }
  };

  const accessoriesTotal = selectedAccessories.reduce((sum, acc) => sum + acc.price, 0);
  const grandTotal = (product.price * quantity) + (accessoriesTotal * quantity);

  const handleWhatsAppOrder = () => {
    const accessoriesText =
      selectedAccessories.length > 0
        ? `\n加购配件：${selectedAccessories
            .map(
              (a) =>
                (currentLang === 'zh' ? a.nameZh : currentLang === 'ms' ? a.nameMs : a.nameEn) +
                ` (+RM${a.price})`
            )
            .join('、')}`
        : '';
    const text = encodeURIComponent(
      `你好！我想在 Svi Studio Malaysia 订购电视盒：\n` +
      `型号：【${productName}】\n` +
      `订购数量：${quantity} 台${accessoriesText}\n` +
      `预估总计：RM ${grandTotal}\n` +
      `请问目前有现货吗？想了解如何安排包邮派送。`
    );
    window.open(`https://api.whatsapp.com/send?phone=601111766671&text=${text}`, '_blank');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6 cursor-default"
      >
        {/* Prominent Top-Right Exit Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/95 hover:bg-rose-600 text-slate-200 hover:text-white border border-slate-600/80 hover:border-rose-500 shadow-xl backdrop-blur-md transition-all duration-150 text-xs sm:text-sm font-bold group cursor-pointer active:scale-95"
          title="点击退出详情 (Click to exit)"
        >
          <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200 text-slate-300 group-hover:text-white" />
          <span>{currentLang === 'zh' ? '退出' : currentLang === 'ms' ? 'Tutup' : 'Exit'}</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
          {/* Left Column: Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="overflow-hidden rounded-xl bg-slate-950 aspect-square border border-slate-800 flex items-center justify-center p-3 sm:p-5">
              <img
                src={activeImage}
                alt={productName}
                className="max-w-full max-h-full w-auto h-auto object-contain object-center transition-all duration-300"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  className={`relative w-full aspect-square rounded-xl overflow-hidden border-2 bg-slate-950 flex items-center justify-center p-3 transition-colors ${
                    activeImage === img ? 'border-cyan-400' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`${productName} 图片 ${idx + 1}`}
                >
                  <img src={img} alt="" className="max-w-full max-h-full w-auto h-auto object-contain object-center" />
                </button>
              ))}
            </div>

            {/* Guarantees Box */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{product.specs.certification}</span>
              </div>
              <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-bold text-emerald-400 truncate">{product.specs.warranty}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWarrantyModal(true)}
                  className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] font-bold transition-all active:scale-95 shadow-sm cursor-pointer"
                  title="查看 1年内1对1换新保修详情"
                >
                  <Info className="w-3 h-3 text-emerald-300" />
                  <span>{currentLang === 'zh' ? '保修说明' : currentLang === 'ms' ? 'Info Waranti' : 'Warranty Info'}</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>全马包邮 (西马 1-2 天 / 东马 4-5 天)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Specs, Highlights & Add-on Bundles */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  官方正品旗舰
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold">{product.rating}</span>
                  <span className="text-slate-400">({product.reviewCount} {t.products.reviews})</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{productName}</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">{productSubtitle}</p>
            </div>

            {/* Price section */}
            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-cyan-400">RM {product.price}</span>
                  <span className="text-xs sm:text-sm text-slate-500 line-through">RM {product.originalPrice}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-emerald-400 mt-0.5">
                  立省 RM {product.originalPrice - product.price} · 全马现货免运费极速派送
                </p>
              </div>
              <div className="text-right text-[11px] sm:text-xs">
                <span className="font-semibold text-slate-300">库存状态:</span>
                <p className="text-emerald-400 font-bold">{product.stock} 台现货可用</p>
              </div>
            </div>

            {/* Highlights List */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                {t.products.highlightsHeader}
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Spec Matrix */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
                {t.products.specsHeader}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">内存组合:</span>
                  <p className="font-semibold text-slate-200">{product.specs.ramRom}</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">芯片处理器:</span>
                  <p className="font-semibold text-slate-200">{product.specs.cpu}</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">最高画质:</span>
                  <p className="font-semibold text-cyan-400">{product.specs.resolution}</p>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400">无线网络:</span>
                  <p className="font-semibold text-slate-200">{product.specs.wifi}</p>
                </div>
              </div>
            </div>

            {/* Bundled Accessories Add-ons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {t.products.accessoriesTitle}
                </h4>
                <span className="text-[11px] text-amber-400 font-semibold">特惠套餐加购</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ACCESSORY_OPTIONS.map((acc) => {
                  const isSelected = selectedAccessories.some((a) => a.id === acc.id);
                  const accName = currentLang === 'zh' ? acc.nameZh : currentLang === 'ms' ? acc.nameMs : acc.nameEn;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => toggleAccessory(acc)}
                      className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-cyan-500 bg-cyan-950/30 text-white'
                          : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="overflow-hidden min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate">{accName}</p>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[11px] font-bold text-cyan-400">+RM {acc.price}</span>
                          {acc.originalPrice && (
                            <span className="text-[10px] text-slate-500 line-through">
                              原价 RM {acc.originalPrice}
                            </span>
                          )}
                          {acc.originalPrice && (
                            <span className="text-[9px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 px-1 py-0.2 rounded">
                              Special
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 1 Year 1-to-1 Replacement Guarantee Highlight Card */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/50 border border-emerald-500/30 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-white">
                      {currentLang === 'zh'
                        ? '官方 1年内原厂 1 对 1 换新保障'
                        : currentLang === 'ms'
                        ? 'Jaminan 1-ke-1 Ganti Baharu 1 Tahun'
                        : '1-Year 1-to-1 Direct Replacement'}
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      1-to-1 Guarantee
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 mt-0.5 truncate">
                    {currentLang === 'zh'
                      ? '365天内非人为硬件故障只换不修 · 全马官方售后网络极速支持'
                      : currentLang === 'ms'
                      ? 'Kerosakan perkakasan dalam 365 hari terus ganti unit baharu tanpa tunggu baiki'
                      : 'Hardware defects within 365 days replaced with a new unit without repair delays'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowWarrantyModal(true)}
                className="shrink-0 px-2.5 py-1.5 rounded-xl bg-emerald-600/25 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] sm:text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{currentLang === 'zh' ? '保修细则' : currentLang === 'ms' ? 'Info Waranti' : 'Warranty Info'}</span>
              </button>
            </div>

            {/* Quantity Selector & Confirm Add to Cart */}
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Quantity */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-300 font-medium">数量:</span>
                <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-bold text-white min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Total & Action */}
              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-end sm:items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">预估总计金额</span>
                  <p className="text-xl font-black text-cyan-400">RM {grandTotal}</p>
                  <span className="text-[9px] text-emerald-400 block">无须在线绑卡 · 专人对接确认</span>
                </div>

                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                  <span>
                    {currentLang === 'zh'
                      ? 'WhatsApp 专人下单订购'
                      : currentLang === 'ms'
                      ? 'Tempah Terus via WhatsApp'
                      : 'Order via WhatsApp'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warranty Info Popup Modal */}
      {showWarrantyModal && (
        <div
          onClick={() => setShowWarrantyModal(false)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4 cursor-default"
          >
            {/* Top Close Button */}
            <button
              onClick={() => setShowWarrantyModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3 pr-6">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Svi Studio 官方售后承诺</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {currentLang === 'zh'
                    ? '1年内原厂 1 对 1 换新质保细则'
                    : currentLang === 'ms'
                    ? 'Polisi Jaminan 1-ke-1 Ganti Baharu 1 Tahun'
                    : '1-Year 1-to-1 Replacement Guarantee Policy'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {currentLang === 'zh'
                    ? '马来西亚官方授权店铺 · 终身技术支持与原厂质保保障'
                    : currentLang === 'ms'
                    ? 'Kedai Rasmi Dibenarkan Svi Studio Malaysia · Sokongan Teknikal Seumur Hidup'
                    : 'Official Svi Studio Malaysia Authorized Store · Lifetime Tech Support'}
                </p>
              </div>
            </div>

            {/* 4 Pillars Details */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>1. 只换不修 · 1 对 1 直接换新机 (Direct Unit Replacement)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                  {currentLang === 'zh'
                    ? '自收货日起 365 天内，若机器发生主板、CPU、电源模块、Wi-Fi/蓝牙天线或 HDMI 输出等非人为硬件故障，我们无需进行返修拆机，直接换发全新机器！'
                    : currentLang === 'ms'
                    ? 'Dalam tempoh 365 hari dari tarikh penerimaan, jika berlaku kerosakan perkakasan bukan akibat kemalangan (motherboard, CPU, kuasa, Wi-Fi), unit baharu akan ditukar terus tanpa baiki!'
                    : 'Within 365 days of delivery, non-accidental hardware defects (mainboard, CPU, power module, Wi-Fi) qualify for an immediate 1-to-1 brand-new replacement without waiting for repairs!'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>2. 马来西亚本地官方售后网点 (Local Service Center)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                  {currentLang === 'zh'
                    ? '拥有马来西亚本地专业技术团队与现货售后中心，所有保修换新均在本地快速处理，无需承担寄往国外的漫长等待与关税风险。'
                    : currentLang === 'ms'
                    ? 'Pusat perkhidmatan tempatan Malaysia membolehkan proses tuntutan pantas tanpa perlu pos ke luar negara.'
                    : 'Local Malaysia support team and fulfillment hub ensure fast replacement processing without international shipping delays.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>3. 顺丰 / J&T / Ninja Van 极速换新支持 (Fast Logistics)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                  {currentLang === 'zh'
                    ? '西马支持 1-2 个工作日极速派送新机，东马（沙巴、砂拉越）4-5 天空运送达，换新流程省心便捷。'
                    : currentLang === 'ms'
                    ? 'Penghantaran ekspres 1-2 hari bekerja untuk Semenanjung dan 4-5 hari untuk Sabah/Sarawak.'
                    : 'Express courier delivery takes 1-2 working days for Peninsular and 4-5 days for East Malaysia.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>4. 官方 WhatsApp 专属工程师 1 对 1 对接 (Dedicated Hotline)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed pl-6">
                  {currentLang === 'zh'
                    ? '如遇网络设置、画质调优或保修换新需求，欢迎随时联系官方客服 WhatsApp (+601111766671)，工程师 1 对 1 在线指导与跟进。'
                    : currentLang === 'ms'
                    ? 'Sebarang pertanyaan teknikal atau tuntutan waranti boleh dihubungi terus melalui WhatsApp rasmi (+601111766671).'
                    : 'Contact our official WhatsApp engineers (+601111766671) anytime for 1-on-1 setup assistance or instant RMA authorization.'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <a
                href="https://api.whatsapp.com/send?phone=601111766671&text=Hi%20Svi%20Studio%20Malaysia,%20I%20would%20like%20to%20inquire%20about%20the%201-Year%201-to-1%20Replacement%20Warranty"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 font-bold text-xs border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp 咨询保修 (+601111766671)</span>
              </a>

              <button
                onClick={() => setShowWarrantyModal(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 transition-all active:scale-95"
              >
                {currentLang === 'zh' ? '我已了解，放心选购' : currentLang === 'ms' ? 'Faham & Teruskan' : 'Understood, Shop with Confidence'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
