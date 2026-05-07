---
title: "Bài 2: Thiết lập môi trường Local"
description: Tạo cấu trúc dự án, viết Dockerfile, cấu hình Nginx và chạy ứng dụng Python trên máy local với Podman Compose.
sidebar_position: 2
---

# Bài 2: Thiết lập môi trường Local

> **Series:** [CI/CD với Podman](../tong-quan) · Bài 2/4

Ở bài này, bạn sẽ xây dựng môi trường **development local** hoàn chỉnh: ứng dụng Python chạy trong container, kết nối Postgres, có Nginx đứng trước làm reverse proxy — tất cả điều phối bằng Podman Compose.

## Mục tiêu bài này

Sau khi hoàn thành, bạn sẽ:
- Có cấu trúc thư mục dự án chuẩn
- Chạy được app tại `http://localhost:8080`
- Chỉnh sửa code Python → thấy kết quả ngay (hot-reload qua volume mount)

---

## Bước 1: Tạo cấu trúc thư mục

Tạo thư mục gốc `khotruyen-ai` với cấu trúc sau:

```text
khotruyen-ai/
├── app/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── main.py
├── nginx/
│   └── default.conf
├── .env
├── docker-compose.yaml
└── .github/
    └── workflows/
        └── ci.yml          ← Sẽ tạo ở Bài 3
```

```bash
mkdir -p khotruyen-ai/app khotruyen-ai/nginx khotruyen-ai/.github/workflows
cd khotruyen-ai
```

---

## Bước 2: Viết Dockerfile cho ứng dụng Python

Tạo file `app/Dockerfile`. Dùng **multi-stage build** để Image production nhẹ hơn, không chứa build tools.

```dockerfile title="app/Dockerfile"
# ── Stage 1: Cài dependencies ──────────────────────────────
FROM python:3.11-slim AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# ── Stage 2: Chạy ứng dụng ─────────────────────────────────
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "main:app"]
```

:::tip Tại sao dùng multi-stage?
Stage 1 cài pip dependencies (có thể nặng). Stage 2 chỉ copy kết quả đã cài — Image cuối không có pip cache hay build tools, nhẹ hơn đáng kể.
:::

---

## Bước 3: Cấu hình Nginx

Tạo file `nginx/default.conf` để Nginx nhận request từ bên ngoài và chuyển vào container Python.

```nginx title="nginx/default.conf"
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://python_app:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /app/static/;
    }
}
```

:::note
`python_app` ở đây là **tên service** trong `docker-compose.yaml`. Podman Compose tự tạo DNS nội bộ để các container tìm thấy nhau qua tên service.
:::

---

## Bước 4: Tạo file cấu hình môi trường

**File `.env`** — chứa thông số database cho môi trường dev. **Không commit file này lên Git.**

```env title=".env"
DB_USER=postgres
DB_PASSWORD=local_password
DB_NAME=khotruyen_db
```

Thêm vào `.gitignore`:

```bash
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
```

---

## Bước 5: Tạo file Podman Compose

File `docker-compose.yaml` định nghĩa 3 services chạy cùng nhau:

```yaml title="docker-compose.yaml"
services:
  db:
    image: postgres:15-alpine
    container_name: dev_postgres
    env_file: .env
    volumes:
      - pg_dev_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  python_app:
    build: ./app
    container_name: dev_python
    env_file: .env
    volumes:
      - ./app:/app          # Mount code trực tiếp để hot-reload
    depends_on:
      - db

  nginx:
    image: nginx:alpine
    container_name: dev_nginx
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - python_app

volumes:
  pg_dev_data:
```

:::info Điểm quan trọng
`volumes: - ./app:/app` — dòng này mount thư mục code thực vào container. Mỗi khi bạn sửa file Python, container thấy thay đổi ngay lập tức mà không cần rebuild Image.
:::

---

## Chạy và kiểm tra

```bash
# Khởi động toàn bộ hệ thống
podman-compose up -d

# Xem log để chắc chắn không có lỗi
podman-compose logs -f python_app
```

Truy cập `http://localhost:8080` — bạn sẽ thấy ứng dụng Python đang chạy qua Nginx.

Để dừng:

```bash
podman-compose down
```

---

## Tóm tắt

| Thành phần | Vai trò | Port |
|---|---|---|
| `db` (Postgres) | Lưu trữ dữ liệu | 5432 (nội bộ) |
| `python_app` (Gunicorn) | Chạy ứng dụng | 8000 (nội bộ) |
| `nginx` | Nhận request từ bên ngoài, chuyển vào app | 8080 → 80 |

Dữ liệu Postgres được lưu vào Named Volume `pg_dev_data`, **không mất khi restart container**.

---

## Bước tiếp theo

Môi trường local đã sẵn sàng. Bài tiếp theo: tự động hóa việc build Image và push lên Docker Hub mỗi khi bạn push code.

→ [Bài 3: CI — Tự động hóa với GitHub Actions](../ci-github-actions)
