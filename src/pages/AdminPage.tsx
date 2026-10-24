import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Database,
  Archive,
  AlertTriangle,
  CheckCircle2,
  Download,
  Upload,
  RefreshCw,
  Truck,
  Plus,
  Minus,
  Save,
  Search,
  ExternalLink,
  Store,
  ChevronRight,
  ShieldCheck,
  User,
  Clock,
  Languages,
  DollarSign,
  BarChart3,
  Sliders,
  LogOut,
} from 'lucide-react';
import { TVBoxProduct, Order, SystemSnapshot, Language } from '../types';
import { storageService } from '../services/storageService';
import { TRANSLATIONS } from '../data/translations';

interface AdminPageProps {
  products: TVBoxProduct[];
  orders: Order[];
  onRefreshData: () => void;
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onNavigateToStore: () => void;
  onLogout?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  orders,
  onRefreshData,
  currentLang,
  onSelectLang,
  onNavigateToStore,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics' | 'db' | 'backup'>('inventory');
  const [editingStock, setEditingStock] = useState<Record<string, { stock: number; price: number }>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [snapshots, setSnapshots] = useState<SystemSnapshot[]>(() => storageService.getSnapshots());
  const [newSnapshotDesc, setNewSnapshotDesc] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [pendingRollbackId, setPendingRollbackId] = useState<string | null>(null);

  const t = TRANSLATIONS[currentLang];
  const analytics = storageService.getSalesAnalytics();
  const dbDiagnostics = storageService.getDatabaseDiagnostics();

  // Stock edit handler
  const handleStockChange = (id: string, field: 'stock' | 'price', val: number) => {
    setEditingStock((prev) => ({
      ...prev,
      [id]: {
        stock: field === 'stock' ? val : prev[id]?.stock ?? (products.find((p) => p.id === id)?.stock || 0),
        price: field === 'price' ? val : prev[id]?.price ?? (products.find((p) => p.id === id)?.price || 0),
      },
    }));
  };

  const handleSaveStock = (id: string) => {
    const edit = editingStock[id];
    const currentProd = products.find((p) => p.id === id);
    if (!currentProd) return;

    const newStock = edit?.stock ?? currentProd.stock;
    const newPrice = edit?.price ?? currentProd.price;

    storageService.updateProductStock(id, newStock, newPrice);
    onRefreshData();

    setSaveSuccessMsg(`已成功保存机型【${currentProd.nameZh}】的库存 (${newStock}台) 与售价 (RM${newPrice})`);
    setTimeout(() => setSaveSuccessMsg(''), 3500);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    storageService.updateOrderStatus(orderId, newStatus);
    onRefreshData();
  };

  const handleExportBackup = () => {
    const jsonStr = storageService.exportFullSystemBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SVI-STUDIO-MALAYSIA-BACKUP-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ text: '系统全量备份包 (.json) 已成功生成并下载到您的本地设备！', type: 'success' });
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const ok = storageService.importFullSystemBackup(importJsonText);
    if (ok) {
      onRefreshData();
      setSnapshots(storageService.getSnapshots());
      setStatusMsg({ text: '备份数据导入成功！数据库及所有机型库存已即时重载。', type: 'success' });
      setImportJsonText('');
    } else {
      setStatusMsg({ text: '导入失败：JSON 数据格式有误或校验不通过。', type: 'error' });
    }
  };

  const handleCreateSnapshot = () => {
    const snap = storageService.createSnapshot(newSnapshotDesc.trim());
    setSnapshots(storageService.getSnapshots());
    setNewSnapshotDesc('');
    setStatusMsg({ text: `快照【${snap.description}】已创建并安全归档！`, type: 'success' });
  };

  const handleConfirmRollback = () => {
    if (!pendingRollbackId) return;
    const ok = storageService.restoreSnapshot(pendingRollbackId);
    if (ok) {
      onRefreshData();
      setStatusMsg({ text: '系统已成功安全回滚至选定快照版本！', type: 'success' });
    } else {
      setStatusMsg({ text: '回滚失败：快照数据损坏。', type: 'error' });
    }
    setPendingRollbackId(null);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Admin App Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <img
              src="/images/Brand/svi-studio-logo.png"
              alt="Svi Studio 小云映画"
              className="w-28 h-auto"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                  商户管理中心
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  系统正常运行 (Live)
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                独立后台管理系统 · 路由: /admin · Svi Studio Malaysia 官方管理中心
              </p>
            </div>
          </div>

          {/* Right Top Actions */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              {(['zh', 'en', 'ms'] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => onSelectLang(lng)}
                  className={`px-2 py-0.5 rounded uppercase font-bold text-[10px] transition-colors ${
                    currentLang === lng
                      ? 'bg-cyan-500 text-slate-950'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lng}
                </button>
              ))}
            </div>

            {/* View Storefront Button (Same Window Route) */}
            <button
              onClick={onNavigateToStore}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Store className="w-3.5 h-3.5 text-cyan-400" />
              <span>前台店铺</span>
            </button>

            {/* Logout Admin Button */}
            <button
              onClick={onLogout || onNavigateToStore}
              className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 border border-rose-800/60 text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95"
              title="退出管理后台并清除认证会话"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>退出登入</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 block mb-1">
              核心运营导航
            </span>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'inventory'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>{t.admin.tabInventory}</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  activeTab === 'inventory' ? 'bg-slate-950 text-cyan-400' : 'bg-slate-950 text-slate-400'
                }`}
              >
                5款
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'orders'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-4 h-4" />
                <span>{t.admin.tabOrders}</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  activeTab === 'orders' ? 'bg-slate-950 text-cyan-400' : 'bg-slate-950 text-slate-400'
                }`}
              >
                {orders.length}笔
              </span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'analytics'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4" />
                <span>{t.admin.tabAnalytics}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">30D</span>
            </button>

            <button
              onClick={() => setActiveTab('db')}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'db'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>{t.admin.tabDbIndexes}</span>
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">0.28ms</span>
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'backup'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Archive className="w-4 h-4" />
                <span>{t.admin.tabBackup}</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold">安全</span>
            </button>
          </div>

          {/* Quick Metrics Widget in Sidebar */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              今日经营概况
            </span>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">总销售额</span>
              <span className="font-mono font-bold text-cyan-400">RM {analytics.totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">待发货订单</span>
              <span className="font-mono font-bold text-amber-400">
                {orders.filter((o) => o.status === 'paid' || o.status === 'processing').length} 单
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">库存紧张机型</span>
              <span className={`font-mono font-bold ${lowStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {lowStockCount} 款
              </span>
            </div>
          </div>

          {/* Admin User Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Administrator (Jack Ong)</p>
              <p className="text-[10px] text-emerald-400">Super Admin · Full Access</p>
            </div>
          </div>
        </aside>

        {/* Right Main Body Content */}
        <main className="lg:col-span-9 space-y-4">
          {/* Global Alert Messages */}
          {saveSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-xs text-emerald-300 flex items-center gap-2 shadow-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          {statusMsg && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 shadow-lg animate-in fade-in ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                  : 'bg-rose-950/90 border-rose-500 text-rose-300'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* TAB 1: Inventory & Catalog (5 Models) */}
          {activeTab === 'inventory' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white">{t.admin.inventory.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    直接编辑现货可用库存、修改标价及配置低库存预警阈值
                  </p>
                </div>
                <button
                  onClick={onRefreshData}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>刷新实时数据</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">机型图片 & 名称</th>
                      <th className="p-3.5">核心规格</th>
                      <th className="p-3.5 text-center">{t.admin.inventory.stockCol}</th>
                      <th className="p-3.5 text-center">{t.admin.inventory.priceCol}</th>
                      <th className="p-3.5 text-center">{t.admin.inventory.statusCol}</th>
                      <th className="p-3.5 text-center">{t.admin.inventory.actionCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    {products.map((p) => {
                      const edit = editingStock[p.id];
                      const currentStock = edit?.stock ?? p.stock;
                      const currentPrice = edit?.price ?? p.price;
                      const isLow = currentStock <= p.lowStockThreshold;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="p-3.5 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-950 border border-slate-800 shrink-0 flex items-center justify-center p-1">
                              <img
                                src={p.image}
                                alt={p.nameZh}
                                className="max-w-full max-h-full w-auto h-auto object-contain object-center"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{p.name}</p>
                              <p className="text-[11px] text-slate-400">{p.nameZh}</p>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <p className="text-slate-200 font-medium">{p.specs.ramRom}</p>
                            <p className="text-[10px] text-cyan-400">{p.specs.resolution}</p>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="inline-flex items-center gap-1.5 border border-slate-700 rounded-lg p-1 bg-slate-950">
                              <button
                                onClick={() =>
                                  handleStockChange(p.id, 'stock', Math.max(0, currentStock - 5))
                                }
                                className="p-1 hover:text-white text-slate-400"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                value={currentStock}
                                onChange={(e) =>
                                  handleStockChange(p.id, 'stock', parseInt(e.target.value) || 0)
                                }
                                className="w-16 bg-transparent text-center font-bold text-white text-xs focus:outline-none"
                              />
                              <button
                                onClick={() => handleStockChange(p.id, 'stock', currentStock + 5)}
                                className="p-1 hover:text-white text-slate-400"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="inline-flex items-center gap-1">
                              <span className="text-slate-400 font-bold">RM</span>
                              <input
                                type="number"
                                value={currentPrice}
                                onChange={(e) =>
                                  handleStockChange(p.id, 'price', parseInt(e.target.value) || 0)
                                }
                                className="w-20 bg-slate-950 border border-slate-700 rounded px-2 py-1 font-black text-cyan-400 text-xs text-center focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          </td>

                          <td className="p-3.5 text-center">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                                <AlertTriangle className="w-3 h-3 text-rose-400" />
                                {t.admin.inventory.alertLow} (&lt;={p.lowStockThreshold})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                {t.admin.inventory.alertNormal}
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-center">
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 mx-auto transition-colors shadow-sm active:scale-95"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{t.admin.inventory.saveChanges}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Orders & Logistics */}
          {activeTab === 'orders' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-white">{t.admin.orders.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    实时监控在线订单流水、核对付款并更新物流履约节点
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  {['all', 'paid', 'shipped', 'out_for_delivery', 'delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                        orderFilter === st
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st.replace(/_/g, ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{ord.id}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-white font-bold">{ord.customerName}</span>
                        <span className="text-slate-400">({ord.phone})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {new Date(ord.createdAt).toLocaleString('en-MY')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px]">购买产品清单:</span>
                        <ul className="mt-1 space-y-1">
                          {ord.items.map((it, idx) => (
                            <li key={idx} className="text-slate-200 font-medium">
                              • {it.productName} - RM {it.unitPrice}
                            </li>
                          ))}
                        </ul>
                        <p className="text-emerald-400 font-bold mt-2">
                          实付总额: RM {ord.total} ({ord.paymentMethod.toUpperCase()})
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px]">收件地址:</span>
                        <p className="text-slate-300 mt-1 leading-relaxed">
                          {ord.shippingAddress.addressLine1}, {ord.shippingAddress.city},{' '}
                          {ord.shippingAddress.state} {ord.shippingAddress.postcode}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px]">承运快递 & 单号:</span>
                        <p className="text-cyan-400 font-mono font-bold mt-1">
                          {ord.courier}: {ord.trackingNumber}
                        </p>

                        {/* Status Change Buttons */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                          >
                            已发货
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'out_for_delivery')}
                            className="px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[11px] font-semibold"
                          >
                            派送中
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-semibold"
                          >
                            已签收
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Sales Analytics & 30-Day Forecast */}
          {activeTab === 'analytics' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white">{t.admin.analytics.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.admin.analytics.forecastDesc}</p>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs">{t.admin.analytics.revenueCard}</span>
                  <p className="text-2xl font-black text-cyan-400 mt-1">RM {analytics.totalRevenue.toLocaleString()}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">+18.4% 较上月</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs">{t.admin.analytics.orderCard}</span>
                  <p className="text-2xl font-black text-white mt-1">{analytics.totalOrders}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">100% 履约派送率</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-xs">{t.admin.analytics.aovCard}</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">RM {analytics.averageOrderValue}</p>
                  <span className="text-[10px] text-slate-500">含配件合购转化</span>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950 to-slate-950 border border-indigo-700/60 shadow-lg">
                  <span className="text-indigo-300 text-xs font-semibold">{t.admin.analytics.forecastCard}</span>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 mt-1">
                    RM {analytics.forecast30DayRevenue.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-indigo-400">周转周期: {analytics.inventoryTurnoverDays} 天</span>
                </div>
              </div>

              {/* Ranking & Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h5 className="text-sm font-bold text-white">{t.admin.analytics.bestSellerTitle}</h5>
                  <div className="space-y-3">
                    {analytics.productSalesShare.map((prod) => (
                      <div key={prod.productId} className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-200">{prod.name}</span>
                          <span className="text-cyan-400 font-mono font-bold">
                            {prod.units} 台 (RM {prod.revenue.toLocaleString()})
                          </span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.min(100, (prod.units / 20) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                  <h5 className="text-sm font-bold text-white">{t.admin.analytics.paymentMethodShare}</h5>
                  <div className="space-y-3">
                    {analytics.paymentMethodDistribution.map((pm, i) => (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-200">{pm.method}</span>
                          <span className="text-emerald-400 font-bold">{pm.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${pm.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Database Indexes & Concurrency */}
          {activeTab === 'db' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white">{t.admin.db.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.admin.db.desc}</p>
              </div>

              {/* Performance Indicator Meters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">{t.admin.db.cacheHitRate}</p>
                  <p className="text-xl font-black text-emerald-400 mt-1">{dbDiagnostics.cacheHitRatio}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">{t.admin.db.avgQueryTime}</p>
                  <p className="text-xl font-black text-cyan-400 mt-1">{dbDiagnostics.avgLatencyMs}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">{t.admin.db.concurrentSessions}</p>
                  <p className="text-xl font-black text-indigo-400 mt-1">{dbDiagnostics.concurrentCapacity}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Locking Policy</p>
                  <p className="text-xs font-bold text-slate-200 mt-2">{dbDiagnostics.lockStatus}</p>
                </div>
              </div>

              {/* Active Indexes Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Index Name</th>
                      <th className="p-3">Index Type</th>
                      <th className="p-3">Indexed Columns</th>
                      <th className="p-3">Engine Status</th>
                      <th className="p-3 text-right">Avg Lookup Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50 font-mono">
                    {dbDiagnostics.indexes.map((idx, i) => (
                      <tr key={i} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-cyan-400">{idx.name}</td>
                        <td className="p-3 text-slate-300">{idx.type}</td>
                        <td className="p-3 text-slate-400">{idx.keys}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            {idx.status}
                          </span>
                        </td>
                        <td className="p-3 text-right text-emerald-400 font-bold">{idx.latency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Backup & Disaster Recovery */}
          {activeTab === 'backup' && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="text-lg font-black text-white">{t.admin.backup.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t.admin.backup.desc}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h5 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>导出全系统备份 (.json)</span>
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    打包所有 5 款机型实时库存、订单交易记录、真实评价及系统快照元数据。
                  </p>
                  <button
                    onClick={handleExportBackup}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md"
                  >
                    {t.admin.backup.exportBtn}
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h5 className="text-sm font-bold text-white flex items-center gap-2">
                    <Archive className="w-4 h-4 text-amber-400" />
                    <span>创建即时系统快照 (Snapshot)</span>
                  </h5>
                  <input
                    type="text"
                    value={newSnapshotDesc}
                    onChange={(e) => setNewSnapshotDesc(e.target.value)}
                    placeholder="输入快照备注 (如: 大促调库存前备份)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <button
                    onClick={handleCreateSnapshot}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-amber-500/30"
                  >
                    {t.admin.backup.snapshotBtn}
                  </button>
                </div>
              </div>

              {/* Snapshots Rollback History */}
              <div className="space-y-3">
                <h5 className="text-sm font-bold text-white">{t.admin.backup.snapshotsHistory}</h5>
                <div className="space-y-2">
                  {snapshots.map((snap) => (
                    <div
                      key={snap.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{snap.description}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(snap.timestamp).toLocaleString('en-MY')} · 包含 {snap.recordCount.products}款机型，
                          {snap.recordCount.orders}笔订单，{snap.recordCount.reviews}条买家评价
                        </p>
                      </div>

                      <button
                        onClick={() => setPendingRollbackId(snap.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold"
                      >
                        秒级回滚到此版本
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restore from JSON */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h5 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  <span>{t.admin.backup.importBtn}</span>
                </h5>
                <textarea
                  rows={3}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="在此粘贴导出的备份 JSON 内容..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-300"
                />
                <button
                  onClick={handleImportBackup}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs border border-cyan-800"
                >
                  确认导入并恢复
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Safe In-App Confirmation Modal for Snapshot Rollback (No window.confirm) */}
      {pendingRollbackId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="font-bold text-white text-base">确认秒级回滚数据库？</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              您即将把全站数据库（包含 5 款 TVBOX 库存数据、所有订单流水和买家评价）安全还原至该快照归档状态。此操作将即刻生效并重载数据。
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setPendingRollbackId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRollback}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30"
              >
                确认恢复并回滚
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
