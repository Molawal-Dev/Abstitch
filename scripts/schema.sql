
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);


CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'simple' CHECK (type IN ('simple', 'variable')),
  sku TEXT,
  short_description TEXT,
  description TEXT,
  regular_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  price_range_min DECIMAL(10,2),
  price_range_max DECIMAL(10,2),
  images TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT true,
  stock_qty INTEGER,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  wc_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_published ON products(published);
CREATE INDEX idx_products_featured ON products(featured);

CREATE TABLE product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

CREATE INDEX idx_product_categories_cat ON product_categories(category_id);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color TEXT,
  color_hex TEXT,
  size TEXT,
  price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2),
  sku TEXT,
  in_stock BOOLEAN DEFAULT true,
  stock_qty INTEGER,
  images TEXT[] DEFAULT '{}',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

CREATE TABLE product_color_swatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  hex_code TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  position INTEGER DEFAULT 0
);

CREATE INDEX idx_swatches_product ON product_color_swatches(product_id);

CREATE TABLE size_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Size Guide',
  headers TEXT[] NOT NULL,
  rows JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id)
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  stripe_payment_intent_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  color TEXT,
  size TEXT,
  image TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

CREATE TABLE admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published products"
  ON products FOR SELECT USING (published = true);
CREATE POLICY "Admin full access to products"
  ON products FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

-- Categories: public read
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories"
  ON categories FOR SELECT USING (true);
CREATE POLICY "Admin full access to categories"
  ON categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

-- Product categories: public read
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read product categories"
  ON product_categories FOR SELECT USING (true);
CREATE POLICY "Admin full access"
  ON product_categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

-- Variants: public read
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read variants"
  ON product_variants FOR SELECT USING (true);
CREATE POLICY "Admin full access to variants"
  ON product_variants FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

-- Color swatches: public read
ALTER TABLE product_color_swatches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read swatches"
  ON product_color_swatches FOR SELECT USING (true);
CREATE POLICY "Admin full access to swatches"
  ON product_color_swatches FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

-- Size guides: public read
ALTER TABLE size_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read size guides"
  ON size_guides FOR SELECT USING (true);
CREATE POLICY "Admin full access to size guides"
  ON size_guides FOR ALL
  USING (auth.uid() IN (SELECT id FROM admin_profiles))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_profiles));

-- Orders: admin only read, service role insert (via API)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can read orders"
  ON orders FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can read order items"
  ON order_items FOR SELECT
  USING (auth.uid() IN (SELECT id FROM admin_profiles));

-- Admin profiles: admin read own
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin can read own profile"
  ON admin_profiles FOR SELECT
  USING (auth.uid() = id);


CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE SEQUENCE order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'ABS-' || LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();
