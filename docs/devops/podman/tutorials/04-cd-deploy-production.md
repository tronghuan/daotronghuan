---
title: "Bài 4: CD — Deploy lên Production"
description: Thiết lập môi trường production, kéo Image từ Docker Hub về và deploy ứng dụng với Podman Compose — kể cả mô phỏng production trên máy local.
sidebar_position: 4
---

# Bài 4: CD — Deploy lên Production

> **Series:** [CI/CD với Podman](../tong-quan) · Bài 4/4

Bài cuối của series. Sau khi CI đã push Image lên Docker Hub, bước này hướng dẫn bạn **kéo Image về và chạy trên production** — hoặc mô phỏng production ngay trên máy local để kiểm tra trước khi lên server thật.

## Mục tiêu bài này

Sau khi hoàn thành:
- Có môi trường production độc lập hoàn toàn với source code
- Deploy chỉ bằng 3 lệnh
- Dữ liệu database không bị mất khi update ứng dụng

---

## Bước 1: Tạo thư mục production riêng biệt

**Quan trọng:** Thư mục production phải **tách biệt hoàn toàn** với thư mục source code. Trên server thật, bạn thậm chí không cần clone repo — chỉ cần file compose và `.env.prod`.

```bash
# Trên server thật hoặc thư mục mock-production trên máy local
mkdir -p /home/huan/mock-production/
cd /home/huan/mock-production/
```

Cấu trúc thư mục production:

```text
mock-production/
├── docker-compose.prod.yaml
├── .env.prod
└── nginx.conf               ← Copy từ thư mục dự án
```

---

## Bước 2: Tạo file `.env.prod`

File này chứa cấu hình **thực tế** cho production. **Không bao giờ commit file này lên Git.**

```env title=".env.prod"
DB_USER=postgres
DB_PASSWORD=super_secure_password_prod
DB_NAME=khotruyen_prod_db
DATABASE_URL=postgresql://postgres:super_secure_password_prod@db:5432/khotruyen_prod_db
```

:::warning Bảo mật
- Dùng password mạnh, khác hoàn toàn với dev
- Trên server thật: dùng secret manager hoặc giới hạn permission file: `chmod 600 .env.prod`
:::

---

## Bước 3: Tạo file Podman Compose cho Production

Tạo file `docker-compose.prod.yaml`. Điểm khác biệt chính so với dev: `python_app` dùng **Image từ Docker Hub** thay vì build local.

```yaml title="docker-compose.prod.yaml"
services:
  db:
    image: postgres:15-alpine
    container_name: prod_postgres
    env_file: .env.prod
    volumes:
      - pg_prod_data:/var/lib/postgresql/data
    restart: always

  python_app:
    image: docker.io/YOUR_DOCKERHUB_USERNAME/khotruyen-ai:latest
    container_name: prod_python
    pull_policy: always          # Luôn kiểm tra Image mới khi khởi động
    env_file: .env.prod
    depends_on:
      - db
    restart: always

  nginx:
    image: nginx:alpine
    container_name: prod_nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - python_app
    restart: always

volumes:
  pg_prod_data:
```

:::caution
Thay `YOUR_DOCKERHUB_USERNAME` bằng username Docker Hub thực tế của bạn.
:::

**So sánh dev vs prod:**

| | `docker-compose.yaml` (dev) | `docker-compose.prod.yaml` (prod) |
|---|---|---|
| `python_app` image | Build từ `./app/Dockerfile` | Pull từ Docker Hub |
| Volume code | `./app:/app` (hot-reload) | Không có — code nằm trong Image |
| Port Nginx | `8080:80` | `80:80` |
| `restart` policy | Không có | `always` |

---

## Bước 4: Copy file cấu hình Nginx

```bash
# Copy nginx.conf từ thư mục dự án sang thư mục production
cp /path/to/khotruyen-ai/nginx/default.conf ./nginx.conf
```

---

## Bước 5: Chạy quy trình Deploy

Khi GitHub Actions đã build xong Image mới trên Docker Hub, chạy 3 lệnh sau tại thư mục `mock-production`:

```bash
# 1. Tải Image mới nhất từ Docker Hub
podman-compose -f docker-compose.prod.yaml pull

# 2. Khởi động lại với Image mới (Postgres không bị restart)
podman-compose -f docker-compose.prod.yaml up -d

# 3. Dọn dẹp Image cũ không còn dùng
podman image prune -f
```

:::tip Tại sao database không bị mất?
`podman-compose up -d` chỉ **recreate container** nào có thay đổi. Container `db` không thay đổi gì nên không bị restart. Dữ liệu nằm trong Named Volume `pg_prod_data` — độc lập với container.
:::

---

## Kiểm tra sau deploy

```bash
# Xem trạng thái tất cả container
podman-compose -f docker-compose.prod.yaml ps

# Xem log ứng dụng
podman-compose -f docker-compose.prod.yaml logs python_app

# Xem log Nginx
podman-compose -f docker-compose.prod.yaml logs nginx
```

Truy cập `http://localhost` (hoặc IP server) để kiểm tra ứng dụng đang chạy.

---

## Toàn bộ flow từ đầu đến cuối

```
Developer viết code
      │
      ▼
git push origin main
      │
      ▼
GitHub Actions kích hoạt (Bài 3)
      │
      ├── Build Image từ Dockerfile
      ├── Login Docker Hub
      └── Push image:latest lên Docker Hub
                    │
                    ▼
           Docker Hub lưu Image
                    │
                    ▼
      Trên server production (Bài 4)
      │
      ├── podman-compose pull    ← Tải Image mới
      ├── podman-compose up -d   ← Chạy với Image mới
      └── podman image prune     ← Dọn Image cũ
                    │
                    ▼
      ✅ Ứng dụng mới đang chạy
         Dữ liệu database: nguyên vẹn
```

---

## Xử lý lỗi thường gặp

**Container không start — "Error: image not found"**
→ Kiểm tra `DOCKERHUB_USERNAME` trong file compose có đúng không. Chạy `podman pull docker.io/username/khotruyen-ai:latest` để test.

**Nginx lỗi 502 Bad Gateway**
→ Container `python_app` chưa sẵn sàng. Chờ 10–15 giây hoặc xem log: `podman logs prod_python`.

**Database connection error**
→ Kiểm tra `DATABASE_URL` trong `.env.prod` — host phải là `db` (tên service), không phải `localhost`.

---

## Tổng kết series

Bạn đã hoàn thành toàn bộ pipeline CI/CD với Podman:

| Bài | Kết quả |
|---|---|
| Bài 1 — Tổng quan | Hiểu kiến trúc 3 môi trường |
| Bài 2 — Local setup | App chạy trên máy với Podman Compose |
| Bài 3 — GitHub Actions | Push code → Image tự động lên Docker Hub |
| Bài 4 — Production deploy | 3 lệnh deploy Image mới, data an toàn |

Từ đây, mỗi lần cập nhật code: `git push` → đợi CI → chạy 3 lệnh deploy. Không build tay, không sợ "chạy được trên máy tôi".
