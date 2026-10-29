export type Language = 'zh' | 'en' | 'ms';

export interface TVBoxProduct {
  id: string;
  name: string;
  nameZh: string;
  nameMs: string;
  subtitle: string;
  subtitleZh: string;
  subtitleMs: string;
  price: number;
  originalPrice: number;
  stock: number;
  lowStockThreshold: number;
  image: string;
  gallery: string[];
  badge: {
    textZh: string;
    textEn: string;
    textMs: string;
    color: string;
  };
  specs: {
    ramRom: string;
    cpu: string;
    resolution: string;
    wifi: string;
    os: string;
    bluetooth: string;
    certification: string;
    warranty: string;
  };
  specDetails?: Record<Language, string[]>;
  highlights: {
    zh: string[];
    en: string[];
    ms: string[];
  };
  rating: number;
  reviewCount: number;
  salesCount: number;
  category: 'flagship' | 'sports' | 'ultra' | 'family' | 'portable' | 'soundbar';
}

export interface AccessoryOption {
  id: string;
  nameZh: string;
  nameEn: string;
  nameMs: string;
  price: number;
  originalPrice?: number;
  image: string;
}

export interface CartItem {
  product: TVBoxProduct;
  quantity: number;
  selectedAccessories: AccessoryOption[];
}

export type PaymentMethod = 'transfer' | 'tng' | 'duitnow' | 'card' | 'fpx';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  accessories: { name: string; price: number }[];
}

export interface OrderShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  city: string;
  state: string;
  postcode: string;
}

export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface OrderTrackingMilestone {
  time: string;
  titleZh: string;
  titleEn: string;
  titleMs: string;
  descriptionZh: string;
  descriptionEn: string;
  descriptionMs: string;
  location: string;
  done: boolean;
}

export interface Order {
  id: string; // e.g. SVI-MY-20261018-8421
  createdAt: string;
  customerName: string;
  phone: string;
  email: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid';
  status: OrderStatus;
  courier: 'J&T Express' | 'Ninja Van' | 'Pos Laju' | 'DHL eCommerce';
  trackingNumber: string;
  shippingAddress: OrderShippingAddress;
  milestones: OrderTrackingMilestone[];
  notes?: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  avatar: string;
  helpfulCount: number;
  tags: string[];
}

export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  forecast30DayRevenue: number;
  inventoryTurnoverDays: number;
  dailySalesTrend: { date: string; revenue: number; orders: number }[];
  productSalesShare: { productId: string; name: string; revenue: number; units: number }[];
  paymentMethodDistribution: { method: string; count: number; percentage: number }[];
}

export interface SystemSnapshot {
  id: string;
  timestamp: string;
  description: string;
  recordCount: {
    products: number;
    orders: number;
    reviews: number;
  };
  dataJson: string;
}
