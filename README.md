# NŌVA Admin – Bảng Quản Trị Hệ Thống

> Bảng điều khiển quản trị nội bộ dành cho thương hiệu bút cao cấp **NŌVA PEN**.  
> Được xây dựng với sự hỗ trợ của **Antigravity** – trợ lý lập trình AI bởi **Google DeepMind**.

---

## 🧩 Vấn Đề Được Giải Quyết

Trước khi có hệ thống này, việc quản lý sản phẩm và đơn hàng của NŌVA PEN phải thực hiện thủ công qua bảng tính hoặc các công cụ rời rạc, dẫn đến:

- **Thiếu tổng quan tập trung:** Không có nơi duy nhất để xem toàn bộ danh mục sản phẩm, tồn kho và trạng thái.
- **Quản lý sản phẩm kém hiệu quả:** Thêm, sửa, xoá sản phẩm tốn thời gian và dễ xảy ra sai sót.
- **Không có lọc & tìm kiếm nhanh:** Khó tra cứu sản phẩm khi danh mục ngày càng mở rộng.
- **Thiếu phân loại trạng thái:** Không phân biệt rõ ràng giữa sản phẩm *đang bán* và *bản nháp*.

---

## ✅ Tính Năng Chính

| Tính năng | Mô tả |
|---|---|
| 📦 Quản lý sản phẩm | Xem, thêm, sửa, xoá sản phẩm trong thời gian thực |
| 🔍 Tìm kiếm & lọc | Tìm theo tên, lọc theo trạng thái Active / Draft |
| 🏷️ Trạng thái sản phẩm | Phân biệt rõ sản phẩm đang bán và bản nháp |
| 🗃️ Tồn kho | Theo dõi số lượng tồn kho từng sản phẩm |
| 🐳 Docker hỗ trợ | Triển khai nhanh bằng `docker-compose` |

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend:** HTML, CSS, JavaScript (thuần)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL
- **Deployment:** Docker + Docker Compose

---

## 🚀 Khởi Chạy Nhanh

```bash
# Clone repository
git clone https://github.com/luckyadmin-android/nova-admin.git
cd nova-admin

# Chạy toàn bộ hệ thống bằng Docker
docker-compose up --build
```

Truy cập tại: `http://localhost:3000`

---

## 🤝 Cộng Tác

Dự án này được phát triển với sự hỗ trợ của **Antigravity** – trợ lý lập trình AI thế hệ mới được tạo ra bởi đội ngũ **Google DeepMind**. Antigravity hỗ trợ lập kế hoạch kiến trúc, viết code, gỡ lỗi và triển khai toàn bộ dự án.

---

*© 2026 NŌVA PEN. Mọi quyền được bảo lưu.*
