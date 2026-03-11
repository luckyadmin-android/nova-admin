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
  ('NŌVA Noir', 'Obsidian Series', 890000, 'Matte đen tuyền với phụ kiện vàng 18k. Dành cho những ai yêu sự tối giản sang trọng.', 120, 'active'),
  ('NŌVA Aurora', 'Aurora Series', 1490000, 'Vỏ titan phủ PVD xanh hoàng hôn, clip bạch kim. Phiên bản giới hạn 500 chiếc toàn cầu.', 45, 'active'),
  ('NŌVA Heritage', 'Heritage Series', 1190000, 'Đồng thau mạ vàng champagne ấm áp. Thiết kế lấy cảm hứng từ kiến trúc Đông Dương.', 85, 'active')
ON CONFLICT DO NOTHING;
