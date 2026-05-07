---
title: "Bài 3: CI — Tự động hóa với GitHub Actions"
description: Cấu hình GitHub Actions để tự động build Docker Image và push lên Docker Hub mỗi khi có commit mới trên nhánh main.
sidebar_position: 3
---

# Bài 3: CI — Tự động hóa với GitHub Actions

> **Series:** [CI/CD với Podman](../tong-quan) · Bài 3/4

Ở bài này, bạn sẽ thiết lập pipeline **CI (Continuous Integration)**: mỗi khi push code lên GitHub, hệ thống tự động build Docker Image và đẩy lên Docker Hub — không cần làm thủ công.

## Mục tiêu bài này

Sau khi hoàn thành, mỗi lần bạn chạy `git push origin main`:
1. GitHub Actions tự động kích hoạt
2. Build Image từ `app/Dockerfile`
3. Push Image lên Docker Hub với tag `latest`

---

## Bước 1: Tạo Access Token trên Docker Hub

Không dùng password trực tiếp — hãy tạo **Access Token** riêng cho CI:

1. Đăng nhập [hub.docker.com](https://hub.docker.com)
2. Vào **Account Settings** → **Security** → **New Access Token**
3. Đặt tên token: `github-actions-khotruyen`
4. Chọn quyền **Read & Write**
5. **Copy token ngay** — chỉ hiện một lần

:::warning
Lưu token vào nơi an toàn. Nếu mất, phải tạo token mới và cập nhật lại GitHub Secrets.
:::

---

## Bước 2: Thêm Secrets vào GitHub Repository

Secrets là nơi GitHub lưu thông tin nhạy cảm — không ai xem được, chỉ Actions mới dùng được.

1. Vào repository trên GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Thêm **2 secrets** sau:

| Secret name | Giá trị |
|---|---|
| `DOCKERHUB_USERNAME` | Tên đăng nhập Docker Hub của bạn |
| `DOCKERHUB_TOKEN` | Access Token vừa tạo ở Bước 1 |

---

## Bước 3: Tạo workflow GitHub Actions

Tạo file `.github/workflows/ci.yml` trong thư mục dự án:

```yaml title=".github/workflows/ci.yml"
name: Build and Push to Docker Hub

on:
  push:
    branches: ["main"]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and Push Docker Image
        uses: docker/build-push-action@v4
        with:
          context: ./app
          push: true
          tags: ${{ secrets.DOCKERHUB_USERNAME }}/khotruyen-ai:latest
```

:::note Giải thích workflow
- **`on: push: branches: ["main"]`** — chỉ chạy khi push lên nhánh `main`
- **`actions/checkout@v3`** — tải code từ repository về runner
- **`docker/login-action`** — đăng nhập Docker Hub bằng secrets
- **`docker/build-push-action`** — build từ `./app/Dockerfile` và push Image
:::

---

## Bước 4: Commit và kiểm tra

```bash
git add .github/workflows/ci.yml
git commit -m "ci: thêm GitHub Actions tự động build và push Image"
git push origin main
```

Sau khi push, vào tab **Actions** trên GitHub để xem pipeline chạy:

```
✅ Checkout code         ~5s
✅ Login to Docker Hub   ~3s
✅ Build and Push Image  ~60–120s
```

Kiểm tra Docker Hub — Image `your-username/khotruyen-ai:latest` đã xuất hiện.

---

## Sơ đồ flow CI

```
Git Push (main)
      │
      ▼
GitHub Actions trigger
      │
      ▼
Checkout code
      │
      ▼
Login to Docker Hub
      │
      ▼
Build Image (từ app/Dockerfile)
      │
      ▼
Push Image → Docker Hub
      │
      ▼
✅ Image sẵn sàng cho Production
```

---

## Xử lý lỗi thường gặp

**Build thất bại — "requirements.txt not found"**
→ Kiểm tra `context: ./app` trong workflow và chắc file tồn tại.

**Login thất bại — "unauthorized"**
→ Token Docker Hub đã hết hạn hoặc sai. Tạo token mới, cập nhật lại GitHub Secret.

**Push thất bại — "denied: requested access to the resource is denied"**
→ Token thiếu quyền Write. Tạo lại token với quyền Read & Write.

---

## Tóm tắt

Sau bài này, mỗi commit lên `main` = một Image mới trên Docker Hub. Quy trình thủ công "build → tag → push" đã được tự động hóa hoàn toàn.

---

## Bước tiếp theo

Image đã có trên Docker Hub. Bài cuối: kéo Image về và chạy trên môi trường production.

→ [Bài 4: CD — Deploy lên Production](../cd-deploy-production)
