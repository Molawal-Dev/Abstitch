export type ProductType = "simple" | "variable";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  images: string[];
}

export interface SizeVariant {
  size: string;
  price: number;
  sale_price: number | null;
  in_stock: boolean;
  stock_qty: number | null;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  color: string | null;
  size: string | null;
  price: number;
  sale_price: number | null;
  sku: string | null;
  in_stock: boolean;
  stock_qty: number | null;
  images: string[];
}

export interface SizeGuide {
  id: string;
  product_id: string;
  title: string;
  headers: string[];
  rows: string[][];
  notes: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  type: ProductType;
  sku: string | null;
  short_description: string | null;
  description: string | null;
  regular_price: number;
  sale_price: number | null;
  price_range_min: number | null;
  price_range_max: number | null;
  images: string[];
  categories: string[];
  category_names: string[];
  in_stock: boolean;
  stock_qty: number | null;
  featured: boolean;
  published: boolean;
  colors: ColorSwatch[];
  sizes: string[];
  variants: ProductVariant[];
  size_guide: SizeGuide | null;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  variant_id: string | null;
  name: string;
  slug: string;
  image: string;
  color: string | null;
  size: string | null;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  item_count: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_slug: string;
  variant_id: string | null;
  color: string | null;
  size: string | null;
  image: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  stripe_payment_intent_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface OrderEnquiryFormData {
  name: string;
  email: string;
  phone: string;
  school_or_organisation?: string;
  items_required: string;
  quantity: string;
  embroidery_required: boolean;
  logo_description?: string;
  additional_notes?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "superadmin";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Navigation
export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

// Filters
export interface ProductFilters {
  category?: string;
  school?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  search?: string;
  page?: number;
  per_page?: number;
  sort?: "price_asc" | "price_desc" | "name_asc" | "newest";
}
