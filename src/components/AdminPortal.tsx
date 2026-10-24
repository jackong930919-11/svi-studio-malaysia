import React, { useState } from 'react';
import {
  X,
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
} from 'lucide-react';
import { TVBoxProduct, Order, SystemSnapshot, Language } from '../types';
import { storageService } from '../services/storageService';
import { TRANSLATIONS } from '../data/translations';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: TVBoxProduct[];
  orders: Order[];
  onRefreshData: () => void;
  currentLang: Language;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onRefreshData,
  currentLang,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'analytics' | 'db' | 'backup'>('inventory');
  const [editingStock, setEditingStock] = useState<Record<string, { stock: number; price: number }>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [snapshots, setSnapshots] = useState<SystemSnapshot[]>(() => storageService.getSnapshots());
  const [newSnapshotDesc, setNewSnapshotDesc] = useState('');
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const t = TRANSLATIONS[currentLang];
  const analytics = storageService.getSalesAnalytics();
  const dbDiagnostics = storageService.getDatabaseDiagnostics();

  // Handle stock value inputs
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
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    storageService.updateOrderStatus(orderId, newStatus);
    onRefreshData();
  };

  // Export system backup
  const handleExportBackup = () => {
    const jsonStr = storageService.exportFullSystemBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SVI-STUDIO-MALAYSIA-BACKUP-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ text: '系统全量备份包 (.json) 已成功生成并下载！', type: 'success' });
  };

  // Import system backup
  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const ok = storageService.importFullSystemBackup(importJsonText);
    if (ok) {
      onRefreshData();
      setSnapshots(storageService.getSnapshots());
      setStatusMsg({ text: '备份数据导入成功！数据库及商品库存已即时重载。', type: 'success' });
      setImportJsonText('');
    } else {
      setStatusMsg({ text: '导入失败：JSON 数据格式有误或校验不通过。', type: 'error' });
    }
  };

  // Create snapshot
  const handleCreateSnapshot = () => {
    const snap = storageService.createSnapshot(newSnapshotDesc.trim());
    setSnapshots(storageService.getSnapshots());
    setNewSnapshotDesc('');
    setStatusMsg({ text: `快照【${snap.description}】已创建并归档！`, type: 'success' });
  };

  // Rollback to snapshot
  const handleRollback = (id: string) => {
    if (confirm('确认将全站数据库（库存、订单、评价）秒级回滚到该快照版本吗？')) {
      const ok = storageService.restoreSnapshot(id);
      if (ok) {
        onRefreshData();
        setStatusMsg({ text: '系统已成功安全回滚至选定快照！', type: 'success' });
      }
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl min-h-[700px] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col justify-between overflow-hidden my-6">
        {/* Top Bar */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{t.admin.portalTitle}</h3>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  v2.0 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400">实时库存调控 · 订单发货 · 30天销售预测 · 数据库索引 · 灾难备份</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>{t.admin.exitAdmin}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="px-5 border-b border-slate-800 bg-slate-950/80 flex gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'inventory'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{t.admin.tabInventory} (5)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t.admin.tabOrders} ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'analytics'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{t.admin.tabAnalytics}</span>
          </button>

          <button
            onClick={() => setActiveTab('db')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'db'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span>{t.admin.tabDbIndexes}</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3.5 font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'backup'
                ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Archive className="w-4 h-4 text-amber-400" />
            <span>{t.admin.tabBackup}</span>
          </button>
        </div>

        {/* Global Toast Alert */}
        {saveSuccessMsg && (
          <div className="m-4 p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {statusMsg && (
          <div
            className={`m-4 p-3 rounded-xl border text-xs flex items-center gap-2 ${
              statusMsg.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                : 'bg-rose-950/90 border-rose-500 text-rose-300'
            }`}
          >
            {statusMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Main Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* TAB 1: Inventory & Catalog */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{t.admin.inventory.title}</h4>
                  <p className="text-xs text-slate-400">支持直接修改现货数量、调控售价及配置低库存预警阈值</p>
                </div>
                <button
                  onClick={onRefreshData}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>刷新实时库存</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">机型图片 & 名称</th>
                      <th className="p-3.5">参数规格</th>
                      <th className="p-3.5 text-center">{t.admin.inventory.stockCol}</th>
                      <th className="p-3.5 text-center">{t.admin.inventory.priceCol}</th>
                      <th className="p-3.5 text-center">{t.admin.inventory.statusCol}</th>
                      <th className="p-3.5 text-center">{t.admin.inventory.actionCol}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                    {products.map((p) => {
                      const edit = editingStock[p.id];
                      const currentStock = edit?.stock ?? p.stock;
                      const currentPrice = edit?.price ?? p.price;
                      const isLow = currentStock <= p.lowStockThreshold;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40">
                          <td className="p-3.5 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.nameZh}
                              className="w-12 h-12 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white text-sm">{p.nameZh}</p>
                              <p className="text-[10px] text-slate-400">{p.name}</p>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <p className="text-slate-200">{p.specs.ramRom}</p>
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
                              <span className="text-slate-400">RM</span>
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
                              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 mx-auto transition-colors shadow-sm"
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
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-white">{t.admin.orders.title}</h4>
                  <p className="text-xs text-slate-400">管理所有在线下单、查看支付凭证、并一键更新实时快递派送节点</p>
                </div>

                <div className="flex items-center gap-2 text-xs">
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
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-400">{ord.id}</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-300 font-semibold">{ord.customerName}</span>
                        <span className="text-slate-400">({ord.phone})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
                          {ord.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400 text-[11px]">{new Date(ord.createdAt).toLocaleString('en-MY')}</span>
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
                        <p className="text-slate-300 mt-1">
                          {ord.shippingAddress.addressLine1}, {ord.shippingAddress.city}, {ord.shippingAddress.state} {ord.shippingAddress.postcode}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px]">快递单号 & 追踪:</span>
                        <p className="text-cyan-400 font-mono font-bold mt-1">
                          {ord.courier}: {ord.trackingNumber}
                        </p>

                        {/* Status Change Buttons */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold"
                          >
                            标为发货
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'out_for_delivery')}
                            className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] font-semibold"
                          >
                            标为派送中
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                            className="px-2 py-1 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[10px] font-semibold"
                          >
                            标为已送达
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
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white">{t.admin.analytics.title}</h4>
                <p className="text-xs text-slate-400">{t.admin.analytics.forecastDesc}</p>
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

              {/* Sales Distribution & Ranking */}
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
                            style={{ width: `${Math.min(100, (prod.units / 18) * 100)}%` }}
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
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white">{t.admin.db.title}</h4>
                <p className="text-xs text-slate-400">{t.admin.db.desc}</p>
              </div>

              {/* Performance Indicator Meters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">{t.admin.db.cacheHitRate}</p>
                  <p className="text-xl font-black text-emerald-400 mt-1">{dbDiagnostics.cacheHitRatio}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">{t.admin.db.avgQueryTime}</p>
                  <p className="text-xl font-black text-cyan-400 mt-1">{dbDiagnostics.avgLatencyMs}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">{t.admin.db.concurrentSessions}</p>
                  <p className="text-xl font-black text-indigo-400 mt-1">{dbDiagnostics.concurrentCapacity}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-[10px] text-slate-400">Locking Policy</p>
                  <p className="text-sm font-bold text-slate-200 mt-2">{dbDiagnostics.lockStatus}</p>
                </div>
              </div>

              {/* Active Indexes Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Index Name</th>
                      <th className="p-3">Index Structure</th>
                      <th className="p-3">Target Columns</th>
                      <th className="p-3">Status</th>
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
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white">{t.admin.backup.title}</h4>
                <p className="text-xs text-slate-400">{t.admin.backup.desc}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h5 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>导出全系统备份 (.json)</span>
                  </h5>
                  <p className="text-xs text-slate-400">
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
                        onClick={() => handleRollback(snap.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-semibold"
                      >
                        秒级回滚到此版本
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restore from Raw JSON */}
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
        </div>
      </div>
    </div>
  );
};
