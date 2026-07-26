export type Category = "erkaklar" | "ayollar" | "unisex" | "aksessuar";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  collection: string;
  price: number;
  discount: number;
  rating: number;
  ratingCount: number;
  popularity: number;
  isNew: boolean;
  tags: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  fabric: string;
  care: string[];
  images: string[];
  stock: number;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CartItem {
  productId: string;
  qty: number;
  size: string;
  color: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
}

export interface Order {
  id: string;
  date: string;
  items: { productId: string; name: string; qty: number; size: string; color: string; price: number; image: string }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  payment: string;
  promo?: string;
  shippingInfo: { fullName: string; phone: string; city: string; address: string; note?: string };
}

export interface LookbookStory {
  id: string;
  slug: string;
  title: string;
  season: string;
  excerpt: string;
  cover: string;
  images: string[];
  body: string[];
  productIds: string[];
}

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  cover: string;
  date: string;
  readMinutes: number;
  author: string;
  body: { type: "p" | "h" | "quote" | "img"; content: string }[];
}

export interface StoreBranch {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  flagship: boolean;
}

export interface PromoCode {
  code: string;
  type: "percent" | "freeship";
  value: number;
  minOrder: number;
  label: string;
}
