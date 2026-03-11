CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  series VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  stock INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, series, price, description, stock, status) VALUES
  ('NŌVA Noir', 'Obsidian Series', 890000, 'Matte đen tuyền với phụ kiện vàng 18k.', 120, 'active'),
  ('NŌVA Aurora', 'Aurora Series', 1490000, 'Vỏ titan phủ PVD xanh hoàng hôn.', 45, 'active'),
  ('NŌVA Heritage', 'Heritage Series', 1190000, 'Đồng thau mạ vàng champagne ấm áp.', 85, 'active'),
  ('NŌVA Phantom', 'Obsidian Series', 950000, 'Đen mờ toàn phần, ngòi thép không gỉ đen.', 60, 'active'),
  ('NŌVA Crimson', 'Heritage Series', 1190000, 'Đỏ rượu vang sơn mài cao cấp.', 30, 'active'),
  ('NŌVA Azure', 'Aurora Series', 1490000, 'Thân xanh lam biển sâu, clip mạ bạc.', 40, 'active'),
  ('NŌVA Lumina', 'Lumina Series', 750000, 'Nhựa trong suốt cao cấp, thấy được ruột mực.', 150, 'active'),
  ('NŌVA Onyx', 'Obsidian Series', 890000, 'Bản đặc biệt đánh bóng thủy tinh.', 20, 'draft'),
  ('NŌVA Eclipse', 'Aurora Series', 1590000, 'Phủ carbon nguyên khối.', 15, 'active'),
  ('NŌVA Rose', 'Heritage Series', 1250000, 'Mạ vàng hồng nguyên khối.', 25, 'active'),
  ('NŌVA Mint', 'Lumina Series', 750000, 'Màu xanh bạc hà Pastel nhẹ nhàng.', 100, 'active'),
  ('NŌVA Forest', 'Heritage Series', 1190000, 'Sơn mài xanh rêu phong mộc mạc.', 45, 'draft'),
  ('NŌVA Ivory', 'Lumina Series', 750000, 'Màu trắng ngà cổ điển.', 80, 'active'),
  ('NŌVA Sapphire', 'Aurora Series', 1490000, 'Xanh Sapphire sang trọng bóng bẩy.', 35, 'active'),
  ('NŌVA Gold', 'Heritage Series', 1890000, 'Mạ vàng 24k đánh xước.', 10, 'active'),
  ('NŌVA Graphite', 'Obsidian Series', 850000, 'Nhám xám kim loại mạnh mẽ.', 90, 'active'),
  ('NŌVA Pearl', 'Lumina Series', 800000, 'Điểm xuyết ánh ngọc trai.', 60, 'active'),
  ('NŌVA Amethyst', 'Aurora Series', 1490000, 'Tím thạch anh lôi cuốn.', 30, 'active'),
  ('NŌVA Cobalt', 'Heritage Series', 1190000, 'Men sứ xanh Cobalt đặc trưng.', 50, 'draft'),
  ('NŌVA Silver', 'Obsidian Series', 950000, 'Mạ bạc Sterling sang trọng.', 40, 'active'),
  ('NŌVA Bronze', 'Heritage Series', 1290000, 'Đồng nguyên khối phong cách Steampunk.', 20, 'active')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  total_amount INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, processing, shipped, completed, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name_at_purchase VARCHAR(255) NOT NULL,
  price_at_purchase INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1
);

-- Seed sample orders
INSERT INTO orders (customer_name, customer_phone, total_amount, status) VALUES 
('Nguyễn Văn A', '0901234567', 890000, 'pending'),
('Trần Thị B', '0912345678', 3870000, 'processing'),
('Lê Văn C', '0987654321', 1490000, 'completed')
ON CONFLICT DO NOTHING;

-- Seed sample order items (assuming IDs 1, 2, 3 correspond to Noir, Aurora, Heritage)
INSERT INTO order_items (order_id, product_id, product_name_at_purchase, price_at_purchase, quantity) VALUES 
(1, 1, 'NŌVA Noir', 890000, 1),
(2, 2, 'NŌVA Aurora', 1490000, 1),
(2, 3, 'NŌVA Heritage', 1190000, 2),
(3, 2, 'NŌVA Aurora', 1490000, 1)
ON CONFLICT DO NOTHING;
