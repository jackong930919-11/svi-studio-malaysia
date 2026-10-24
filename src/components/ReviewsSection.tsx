import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, Plus, ShieldCheck, MapPin } from 'lucide-react';
import { CustomerReview, TVBoxProduct, Language } from '../types';
import { storageService } from '../services/storageService';
import { TRANSLATIONS } from '../data/translations';
import { UI_COPY } from '../data/uiTranslations';

interface ReviewsSectionProps {
  reviews: CustomerReview[];
  products: TVBoxProduct[];
  currentLang: Language;
  onReviewAdded: (newReview: CustomerReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  products,
  currentLang,
  onReviewAdded,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpfulLiked, setHelpfulLiked] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    productId: products[0]?.id || 'svi-9p',
    author: '',
    location: 'Kuala Lumpur',
    rating: 5,
    comment: '',
    tags: '高清流畅, 快速发货',
  });

  const t = TRANSLATIONS[currentLang];
  const copy = UI_COPY[currentLang].reviews;

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === 'all') return true;
    return r.rating === selectedFilter;
  });

  const handleLike = (id: string) => {
    setHelpfulLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author.trim() || !form.comment.trim()) return;

    const prod = products.find((p) => p.id === form.productId);
    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      productId: form.productId,
      productName: prod ? (currentLang === 'zh' ? prod.nameZh : prod.name) : 'SVICloud TV Box',
      author: form.author.trim(),
      location: form.location.trim(),
      rating: form.rating,
      date: new Date().toISOString().slice(0, 10),
      comment: form.comment.trim(),
      verifiedPurchase: true,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      helpfulCount: 1,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    storageService.addReview(newRev);
    onReviewAdded(newRev);
    setIsModalOpen(false);
    setForm({
      productId: products[0]?.id || 'svi-9p',
      author: '',
      location: 'Kuala Lumpur',
      rating: 5,
      comment: '',
      tags: '高清流畅, 快速发货',
    });
  };

  return (
    <section id="reviews-section" className="py-10 sm:py-16 border-t border-slate-900/80 bg-slate-950/40 backdrop-blur-[2px]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">
        {/* Section Header & Rating Summary */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] sm:text-xs font-bold mb-1.5 sm:mb-2">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
              <span>{t.reviews.overallRating}: 4.94 / 5.0</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white">{t.reviews.title}</h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1">{t.reviews.subtitle}</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[11px] sm:text-xs shadow-md shadow-cyan-900/30 flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t.reviews.writeReviewBtn}</span>
          </button>
        </div>

        {/* Rating Breakdown Badges and Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {t.reviews.allReviews} ({reviews.length})
          </button>
          <button
            onClick={() => setSelectedFilter(5)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              selectedFilter === 5
                ? 'bg-amber-400 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>{copy.fiveStar}</span>
          </button>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredReviews.map((rev) => {
            const isLiked = helpfulLiked[rev.id];
            return (
              <div
                key={rev.id}
                className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 space-y-2.5 sm:space-y-3 flex flex-col justify-between transition-all"
              >
                <div className="space-y-2.5 sm:space-y-3">
                  {/* Author Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <h4 className="text-[11px] sm:text-xs font-bold text-white">{rev.author}</h4>
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-400">
                          <MapPin className="w-2.5 h-2.5 text-cyan-400" />
                          <span>{rev.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Verified Badge & Product Purchased */}
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] pb-2 border-b border-slate-800">
                    <span className="text-cyan-400 font-medium truncate max-w-[170px]">{rev.productName}</span>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                      <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      {t.reviews.verifiedBadge}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                  {/* Tags */}
                  {rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.tags.map((tg, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-950 text-[10px] text-slate-400 border border-slate-800"
                        >
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Helpful count footer */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{rev.date}</span>
                  <button
                    onClick={() => handleLike(rev.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      isLiked ? 'text-cyan-400 bg-cyan-950/60 font-bold' : 'hover:text-slate-300'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{copy.helpful} ({rev.helpfulCount + (isLiked ? 1 : 0)})</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Write a review */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <h3 className="text-lg font-bold text-white">{t.reviews.submitReviewTitle}</h3>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">{copy.productModel}</label>
                  <select
                    value={form.productId}
                    onChange={(e) => setForm({ ...form, productId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {currentLang === 'zh' ? p.nameZh : p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{t.reviews.yourName}</label>
                  <input
                    type="text"
                    required
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    placeholder={copy.namePlaceholder}
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{t.reviews.yourLocation}</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    placeholder="e.g. Subang Jaya, Selangor"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{t.reviews.yourRating}</label>
                  <div className="flex gap-2 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, rating: s })}
                        className="text-lg"
                      >
                        <Star className={`w-6 h-6 ${s <= form.rating ? 'fill-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">{t.reviews.yourComment}</label>
                  <textarea
                    rows={3}
                    required
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                    placeholder={copy.commentPlaceholder}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold"
                >
                  {t.reviews.submitBtn}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
