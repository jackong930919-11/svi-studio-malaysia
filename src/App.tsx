import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Sparkles,
  Truck,
  MessageSquareQuote,
  ShieldCheck,
  Bot,
  HelpCircle,
  Tv,
  CheckCircle2,
  ChevronDown,
  PhoneCall,
  Search,
} from 'lucide-react';
import { TVBoxProduct, Order, CustomerReview, Language } from './types';
import { storageService } from './services/storageService';
import { TRANSLATIONS } from './data/translations';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { RecommendationQuiz } from './components/RecommendationQuiz';
import { ReviewsSection } from './components/ReviewsSection';
import { AiCustomerServiceModal } from './components/AiCustomerServiceModal';
import { TeachingPage } from './pages/TeachingPage';
import { AccessoriesPage } from './pages/AccessoriesPage';
import { Footer } from './components/Footer';
import { StarfieldBackground } from './components/StarfieldBackground';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('zh');
  const [products, setProducts] = useState<TVBoxProduct[]>(() => storageService.getProducts());
  const [orders, setOrders] = useState<Order[]>(() => storageService.getOrders());
  const [reviews, setReviews] = useState<CustomerReview[]>(() => storageService.getReviews());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Standalone Page Routing for the Storefront, Teaching Page, and Accessories Page
  const getInitialPath = (): string => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (
        pathname === '/teaching' ||
        pathname === '/teaching.html' ||
        pathname === '/tutorials' ||
        pathname === '/guide'
      )
        return '/teaching';
      if (
        pathname === '/accessories' ||
        pathname === '/accessories.html' ||
        pathname === '/parts' ||
        pathname === '/peripherals'
      )
        return '/accessories';
      const params = new URLSearchParams(window.location.search);
      if (params.get('page') === 'teaching') return '/teaching';
      if (params.get('page') === 'accessories') return '/accessories';
      if (window.location.hash === '#teaching') return '/teaching';
      if (window.location.hash === '#accessories') return '/accessories';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);

  useEffect(() => {
    const syncRoute = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      if (
        pathname === '/teaching' ||
        pathname === '/teaching.html' ||
        pathname === '/tutorials' ||
        pathname === '/guide' ||
        params.get('page') === 'teaching' ||
        window.location.hash === '#teaching'
      ) {
        setCurrentPath('/teaching');
      } else if (
        pathname === '/accessories' ||
        pathname === '/accessories.html' ||
        pathname === '/parts' ||
        pathname === '/peripherals' ||
        params.get('page') === 'accessories' ||
        window.location.hash === '#accessories'
      ) {
        setCurrentPath('/accessories');
      } else {
        setCurrentPath('/');
      }
    };
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('hashchange', syncRoute);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('hashchange', syncRoute);
    };
  }, []);

  const navigateToTeaching = () => {
    try {
      window.history.pushState(null, '', '/teaching');
    } catch {
      window.location.hash = 'teaching';
    }
    setCurrentPath('/teaching');
    window.scrollTo(0, 0);
  };

  const navigateToAccessories = () => {
    try {
      window.history.pushState(null, '', '/accessories');
    } catch {
      window.location.hash = 'accessories';
    }
    setCurrentPath('/accessories');
    window.scrollTo(0, 0);
  };

  const navigateToStore = () => {
    try {
      window.history.pushState(null, '', '/');
    } catch {
      window.location.hash = '';
    }
    setCurrentPath('/');
    window.scrollTo(0, 0);
  };

  // Modals state
  const [activeModalProduct, setActiveModalProduct] = useState<TVBoxProduct | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const t = TRANSLATIONS[currentLang];

  const refreshAllData = () => {
    setProducts(storageService.getProducts());
    setOrders(storageService.getOrders());
    setReviews(storageService.getReviews());
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filter products by category and search
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      p.nameZh.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.specs.ramRom.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  if (currentPath === '/teaching') {
    return (
      <TeachingPage
        currentLang={currentLang}
        onNavigateToStore={navigateToStore}
        onNavigateToAccessories={navigateToAccessories}
      />
    );
  }

  if (currentPath === '/accessories') {
    return (
      <AccessoriesPage
        currentLang={currentLang}
        onNavigateToStore={navigateToStore}
        onNavigateToTeaching={navigateToTeaching}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Interactive Flowing Starfield Canvas Background (Follows Mouse Movement) */}
      <StarfieldBackground />

      {/* Navbar */}
      <Navbar
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onNavigateToTeaching={navigateToTeaching}
        onNavigateToAccessories={navigateToAccessories}
        onScrollToSection={scrollToSection}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <HeroBanner
          currentLang={currentLang}
          onExploreProducts={() => scrollToSection('products-section')}
          onStartQuiz={() => setIsQuizOpen(true)}
          onQuickSelectFlagship={() => {
            const p = products.find((prod) => prod.id === 'svi-15p') || products[0];
            setActiveModalProduct(p);
          }}
        />

        {/* 5 TV Box Products Showcase Section */}
        <section id="products-section" className="py-8 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-2.5 sm:gap-4 mb-5 sm:mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] sm:text-xs font-bold mb-1 sm:mb-2">
                <Tv className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>马来西亚正品 5 大旗舰型号</span>
              </div>
              <h2 className="text-lg sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">{t.products.title}</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 max-w-2xl leading-relaxed">{t.products.subtitle}</p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1 sm:gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {[
                { id: 'all', label: t.products.filterAll },
                { id: 'flagship', label: currentLang === 'zh' ? '旗舰 9P / 10P' : 'Flagship 9P/10P' },
                { id: 'ultra', label: currentLang === 'zh' ? '性能巅峰 15P' : 'Ultra 15P' },
                { id: 'family', label: currentLang === 'zh' ? '简易智选 10S' : 'Smart 10S' },
                { id: 'soundbar', label: t.products.filterSoundbar },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid (5 Products) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currentLang={currentLang}
                onViewDetails={(p) => setActiveModalProduct(p)}
              />
            ))}
          </div>
        </section>

        {/* Live Channel & Content Strip Showcase */}
        <section className="py-8 sm:py-14 border-y border-slate-900 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-3.5 sm:space-y-6">
            <div className="text-center space-y-0.5 sm:space-y-1">
              <span className="text-[9px] sm:text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Comprehensive Channels & VOD
              </span>
              <h3 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                覆盖全马乃至全球 1,000+ 高清直播与百万影视
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                一次购买，工厂终身免费授权，无月费无隐藏收费，开机秒播！
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-3 text-center text-[10px] sm:text-xs">
              <div className="p-2.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5 sm:space-y-1">
                <span className="text-lg sm:text-2xl block">🇲🇾</span>
                <p className="font-bold text-white text-[10px] sm:text-xs">大马 Astro 全套</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400">华丽台、AEC、欢喜台</p>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5 sm:space-y-1">
                <span className="text-lg sm:text-2xl block">⚽</span>
                <p className="font-bold text-white text-[10px] sm:text-xs">体育直播专线</p>
                <p className="text-[9px] sm:text-[10px] text-cyan-400">英超 EPL、欧冠、BWF羽球</p>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5 sm:space-y-1">
                <span className="text-lg sm:text-2xl block">🇭🇰</span>
                <p className="font-bold text-white text-[10px] sm:text-xs">香港 TVB 翡翠台</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400">即日粤语港剧同步更新</p>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5 sm:space-y-1">
                <span className="text-lg sm:text-2xl block">🇹🇼</span>
                <p className="font-bold text-white text-[10px] sm:text-xs">台湾热门综艺</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400">中天、东森、三立新闻</p>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5 sm:space-y-1">
                <span className="text-lg sm:text-2xl block">🎬</span>
                <p className="font-bold text-white text-[10px] sm:text-xs">4K 院线点播</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400">好莱坞大片、中韩泰剧</p>
              </div>
              <div className="p-2.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5 sm:space-y-1">
                <span className="text-lg sm:text-2xl block">🎤</span>
                <p className="font-bold text-white text-[10px] sm:text-xs">家庭 K歌点歌台</p>
                <p className="text-[9px] sm:text-[10px] text-emerald-400">海量双麦合唱曲库</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Recommendation Quiz CTA Banner */}
        <section className="py-6 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-800/60 p-4 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="space-y-1.5 sm:space-y-3 text-center md:text-left max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-bold">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                个性化智能推荐引擎
              </span>
              <h3 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                不知道 5 款电视盒该选哪台？
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                只需 30 秒，告诉我们您的电视尺寸、网络距离和家庭观影偏好，智能算法即可为您精准匹配最适合您的型号！
              </p>
            </div>

            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-[11px] sm:text-xs shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 shrink-0 transition-all transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950" />
              <span>立即开始 30秒 智能测试</span>
            </button>
          </div>
        </section>

        {/* Customer Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          products={products}
          currentLang={currentLang}
          onReviewAdded={(newRev) => setReviews((prev) => [newRev, ...prev])}
        />

        {/* FAQ Section */}
        <section className="py-8 sm:py-16 border-t border-slate-900 bg-slate-900/30">
          <div className="max-w-4xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-8">
            <div className="text-center space-y-0.5 sm:space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-slate-900 text-slate-300 border border-slate-800 text-[10px] sm:text-xs font-bold">
                <HelpCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                <span>FAQ</span>
              </div>
              <h3 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">购买前常见问题解答</h3>
              <p className="text-[10px] sm:text-xs text-slate-400">大马用户最关心的网络、频道、质保与派送时效</p>
            </div>

            <div className="space-y-2 sm:space-y-3.5 text-xs">
              {/* FAQ 1: Internet Speed */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 space-y-1 sm:space-y-2 hover:border-cyan-500/40 transition-colors">
                <h4 className="font-bold text-white text-[11px] sm:text-xs flex items-start gap-1.5 sm:gap-2 leading-snug">
                  <span className="text-cyan-400 font-black">Q:</span>
                  <span>
                    {currentLang === 'zh'
                      ? '家里需要多少 Mbps 的宽带速度才能流畅观看？'
                      : currentLang === 'ms'
                      ? 'Berapakah kelajuan internet (Mbps) yang diperlukan untuk penstriman lancar?'
                      : 'What broadband speed (Mbps) is recommended for smooth streaming?'}
                  </span>
                </h4>
                <p className="text-slate-300 text-[10px] sm:text-xs leading-relaxed pl-3.5 sm:pl-5">
                  {currentLang === 'zh'
                    ? 'A: 观看高清直播与 4K 点播，建议宽带速度在 100Mbps 以上（如 Unifi 100M/300M/500M、Time 宽带、Maxis Home Fibre、CelcomDigi）。小云电视盒在大马本地部署有专属 CDN 高速节点，高峰期也能极速流畅秒开。'
                    : currentLang === 'ms'
                    ? 'A: Untuk siaran langsung HD dan video 4K, dicadangkan kelajuan internet 100Mbps ke atas (seperti Unifi 100M/300M/500M, Time, Maxis Home Fibre, CelcomDigi). TV Box Svicloud mempunyai nod CDN tempatan Malaysia yang pantas tanpa sangkut.'
                    : 'A: For live HD channels and 4K VOD, a broadband speed of 100Mbps or higher is recommended (e.g. Unifi 100M/300M/500M, Time, Maxis Home Fibre, CelcomDigi). Svicloud TV boxes feature dedicated Malaysia CDN nodes for fast, buffer-free playback even during peak hours.'}
                </p>
              </div>

              {/* FAQ 2: Monthly Fees */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 space-y-1 sm:space-y-2 hover:border-cyan-500/40 transition-colors">
                <h4 className="font-bold text-white text-[11px] sm:text-xs flex items-start gap-1.5 sm:gap-2 leading-snug">
                  <span className="text-cyan-400 font-black">Q:</span>
                  <span>
                    {currentLang === 'zh'
                      ? '需要缴纳月费或年费吗？真的终身免费吗？'
                      : currentLang === 'ms'
                      ? 'Adakah perlu membayar yuran bulanan atau tahunan? Adakah benar-benar percuma seumur hidup?'
                      : 'Do I need to pay monthly or annual subscription fees? Is it truly lifetime free?'}
                  </span>
                </h4>
                <p className="text-slate-300 text-[10px] sm:text-xs leading-relaxed pl-3.5 sm:pl-5">
                  {currentLang === 'zh'
                    ? 'A: 不需要！一次性购买机器后，机身内置的小云官方直播与点播软件均为永久授权，无任何隐藏月租或续费套路。'
                    : currentLang === 'ms'
                    ? 'A: Tidak perlu! Selepas pembelian sekali sahaja, aplikasi siaran langsung dan VOD terbina dalam Svicloud dilesenkan secara kekal tanpa sebarang caj tersembunyi.'
                    : 'A: No! Once purchased, the built-in official Svicloud live TV and VOD apps are lifetime authorized with zero hidden monthly fees or renewal charges.'}
                </p>
              </div>

              {/* FAQ 3: Warranty */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 space-y-1 sm:space-y-2 hover:border-cyan-500/40 transition-colors">
                <h4 className="font-bold text-white text-[11px] sm:text-xs flex items-start gap-1.5 sm:gap-2 leading-snug">
                  <span className="text-cyan-400 font-black">Q:</span>
                  <span>
                    {currentLang === 'zh'
                      ? '马来西亚本地保修如何执行？万一故障怎么处理？'
                      : currentLang === 'ms'
                      ? 'Bagaimanakah tuntutan waranti tempatan di Malaysia dilakukan jika berlaku kerosakan?'
                      : 'How does the Malaysia local warranty work in case of hardware defects?'}
                  </span>
                </h4>
                <p className="text-slate-300 text-[10px] sm:text-xs leading-relaxed pl-3.5 sm:pl-5">
                  {currentLang === 'zh'
                    ? 'A: 我们是 Svi Studio Malaysia 官方授权店，每台机器均带有 SIRIM/MCMC 防伪标。享有 1 年内原厂 1 对 1 换新质保，如遇硬件故障，全马支持寄回官方售后中心直接换新机！'
                    : currentLang === 'ms'
                    ? 'A: Kami adalah wakil pengedar rasmi Svi Studio Malaysia dengan label SIRIM/MCMC tulen. Dilindungi jaminan 1-ke-1 ganti baharu selama 1 tahun di pusat servis rasmi kami.'
                    : 'A: We are an authorized Svi Studio Malaysia store with verified SIRIM/MCMC security labels. Enjoy 1-year 1-to-1 hardware replacement warranty directly with our local service hub.'}
                </p>
              </div>

              {/* FAQ 4: Shipping Time */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 space-y-1 sm:space-y-2 hover:border-cyan-500/40 transition-colors">
                <h4 className="font-bold text-white text-[11px] sm:text-xs flex items-start gap-1.5 sm:gap-2 leading-snug">
                  <span className="text-cyan-400 font-black">Q:</span>
                  <span>
                    {currentLang === 'zh'
                      ? '下单后几天能收到？全马都免运费吗？'
                      : currentLang === 'ms'
                      ? 'Berapa hari penghantaran selepas pesanan dibuat? Adakah pos percuma ke seluruh Malaysia?'
                      : 'How many days for delivery after placing an order? Is shipping free across Malaysia?'}
                  </span>
                </h4>
                <p className="text-slate-300 text-[10px] sm:text-xs leading-relaxed pl-3.5 sm:pl-5">
                  {currentLang === 'zh'
                    ? 'A: 全马订单一律免运费！西马地区（雪兰莪、吉隆坡、槟城、柔佛等）1-2 个工作日由 J&T Express 或 Ninja Van 送达；东马（沙巴、砂拉越）4-5 个工作日空运送达。'
                    : currentLang === 'ms'
                    ? 'A: Semua pesanan adalah percuma kos penghantaran! Semenanjung Malaysia (Selangor, KL, Penang, Johor dll.) 1-2 hari bekerja melalui J&T Express/Ninja Van; Sabah & Sarawak 4-5 hari bekerja melalui penerbangan kurier.'
                    : 'A: Free shipping on all orders nationwide! Peninsular Malaysia (Selangor, KL, Penang, Johor, etc.) arrives in 1-2 working days via J&T Express or Ninja Van; East Malaysia (Sabah & Sarawak) arrives in 4-5 working days via air courier.'}
                </p>
              </div>

              {/* FAQ 5: Lagging & Troubleshooting */}
              <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-950 border border-slate-800 space-y-1 sm:space-y-2 hover:border-cyan-500/40 transition-colors">
                <h4 className="font-bold text-white text-[11px] sm:text-xs flex items-start gap-1.5 sm:gap-2 leading-snug">
                  <span className="text-cyan-400 font-black">Q:</span>
                  <span>
                    {currentLang === 'zh'
                      ? '如果遇到卡顿怎么办？'
                      : currentLang === 'ms'
                      ? 'Apakah yang perlu dilakukan jika mengalami masalah sangkut/buffering?'
                      : 'What should I do if experiencing buffering or lag?'}
                  </span>
                </h4>
                <p className="text-slate-300 text-[10px] sm:text-xs leading-relaxed pl-3.5 sm:pl-5">
                  {currentLang === 'zh'
                    ? 'A：重启Wi-Fi 和 电视盒，再进行尝试！如果还是卡顿，请联系我们客服询问！'
                    : currentLang === 'ms'
                    ? 'A: Sila mulakan semula (restart) Wi-Fi router dan TV Box anda, kemudian cuba lagi! Jika masih mengalami masalah sangkut, sila hubungi khidmat pelanggan kami!'
                    : 'A: Please restart your Wi-Fi router and TV Box, then try again! If buffering persists, please contact our customer support for immediate assistance!'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Button: 24/7 AI Customer Assistant */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        <button
          onClick={() => setIsAiOpen(true)}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[11px] sm:text-xs shadow-2xl shadow-cyan-500/40 border border-cyan-400/40 transition-all transform hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-white"></span>
          </span>
          <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t.aiSupport.floatingBtn}</span>
        </button>
      </div>

      {/* Footer */}
      <Footer
        currentLang={currentLang}
        onOpenAi={() => setIsAiOpen(true)}
        onNavigateToTeaching={navigateToTeaching}
        onNavigateToAccessories={navigateToAccessories}
      />

      {/* MODALS */}
      {/* Product Details Modal */}
      <ProductModal
        product={activeModalProduct}
        isOpen={!!activeModalProduct}
        onClose={() => setActiveModalProduct(null)}
        currentLang={currentLang}
      />


      {/* 30-sec Recommendation Quiz */}
      <RecommendationQuiz
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        products={products}
        currentLang={currentLang}
        onSelectProduct={(p) => setActiveModalProduct(p)}
      />

      {/* AI Customer Service Modal */}
      <AiCustomerServiceModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        currentLang={currentLang}
      />

    </div>
  );
}
