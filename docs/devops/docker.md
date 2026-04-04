---
title: Docker cơ bản — Container hóa ứng dụng
description: Hướng dẫn Docker từ khái niệm đến thực hành — image, container, volume, network và Docker Compose.
sidebar_position: 2
---

# Docker cơ bản — Container hóa ứng dụng

## Docker giải quyết vấn đề gì?

Câu chuyện quen thuộc trong mọi dự án:

> *"Trên máy tôi chạy được mà!"*

```mermaid
flowchart LR
    subgraph without["❌ Không có Docker"]
        D1["💻 Máy Dev\nNode 18\nMongoDB 6\nOS: macOS"]
        D2["🖥️ Máy Staging\nNode 16\nMongoDB 5\nOS: Ubuntu"]
        D3["⚙️ Máy Production\nNode 14\nMongoDB 4\nOS: CentOS"]
    end
    subgraph with["✅ Có Docker"]
        C1["💻 Máy Dev\n🐳 Container\nNode 18 + Mongo 6"]
        C2["🖥️ Máy Staging\n🐳 Container\nNode 18 + Mongo 6"]
        C3["⚙️ Production\n🐳 Container\nNode 18 + Mongo 6"]
    end

    classDef bad fill:#4a1e1e,color:#e37e7e,stroke:#c24a4a,stroke-width:1px
    classDef good fill:#1e4a2e,color:#7ecf8e,stroke:#25c2a0,stroke-width:1px
    class D1,D2,D3 bad
    class C1,C2,C3 good
```

Docker đóng gói ứng dụng cùng **toàn bộ dependencies** vào một container — chạy giống nhau trên mọi máy.

---

## Các khái niệm cốt lõi

```mermaid
flowchart TB
    DF["📄 Dockerfile\n──────────────\nBản thiết kế\nCông thức tạo Image"]
    DF -->|"docker build"| IMG

    IMG["🖼️ Image\n──────────────\nBản chụp tĩnh\nRead-only template"]
    IMG -->|"docker run"| C1
    IMG -->|"docker run"| C2
    IMG -->|"docker run"| C3

    C1["🐳 Container 1\nđang chạy"]
    C2["🐳 Container 2\nđang chạy"]
    C3["🐳 Container 3\nđang chạy"]

    IMG -->|"docker push"| REG["☁️ Registry\n(Docker Hub / ECR)\nKho lưu Image"]
    REG -->|"docker pull"| IMG2["🖼️ Image\n(máy khác)"]

    classDef file fill:#1e3a5f,color:#7ec8e3,stroke:#4a8ab5,stroke-width:2px
    classDef image fill:#3a2a10,color:#e3c47e,stroke:#c2884a,stroke-width:2px
    classDef container fill:#1e4a2e,color:#7ecf8e,stroke:#25c2a0,stroke-width:2px
    classDef registry fill:#2a1e3a,color:#b07ee3,stroke:#8a4ab5,stroke-width:2px
    class DF file
    class IMG,IMG2 image
    class C1,C2,C3 container
    class REG registry
```

| Khái niệm | Tương tự | Mô tả |
| :--- | :--- | :--- |
| **Dockerfile** | Công thức nấu ăn | Hướng dẫn từng bước tạo Image |
| **Image** | Class trong OOP | Bản thiết kế, bất biến, dùng lại được |
| **Container** | Object (instance) | Image đang chạy, có thể tạo nhiều cái |
| **Registry** | npm / App Store | Kho lưu và chia sẻ Image |
| **Volume** | Ổ đĩa gắn ngoài | Lưu dữ liệu bền vững ngoài container |

---

## Cài đặt và lệnh cơ bản

### Kiểm tra cài đặt

```bash
docker --version
docker compose version

# Chạy container test
docker run hello-world
```

### Làm việc với Image

```bash
# Tải image từ Docker Hub
docker pull node:18-alpine
docker pull nginx:latest

# Xem image đã có trên máy
docker images

# Xóa image
docker rmi node:18-alpine

# Tìm kiếm image
docker search nginx
```

### Làm việc với Container

```bash
# Chạy container (tải image nếu chưa có)
docker run nginx

# Chạy ngầm (detached mode)
docker run -d nginx

# Chạy với đặt tên
docker run -d --name my-nginx nginx

# Chạy với map port: máy_host:container
docker run -d -p 8080:80 --name my-nginx nginx
# → Truy cập http://localhost:8080

# Xem container đang chạy
docker ps

# Xem tất cả container (kể cả đã dừng)
docker ps -a

# Dừng container
docker stop my-nginx

# Xóa container
docker rm my-nginx

# Xem log
docker logs my-nginx
docker logs -f my-nginx     # follow log real-time

# Vào bên trong container
docker exec -it my-nginx bash
docker exec -it my-nginx sh  # Nếu không có bash
```

---

## Viết Dockerfile

### Cấu trúc cơ bản

```dockerfile
# 1. Base image
FROM node:18-alpine

# 2. Thư mục làm việc trong container
WORKDIR /app

# 3. Copy file package trước (tận dụng cache layer)
COPY package*.json ./

# 4. Cài dependencies
RUN npm install --production

# 5. Copy toàn bộ source code
COPY . .

# 6. Build (nếu cần)
RUN npm run build

# 7. Khai báo port container sẽ lắng nghe
EXPOSE 3000

# 8. Lệnh chạy khi container khởi động
CMD ["node", "src/index.js"]
```

### Bài toán thực tế: Dockerize ứng dụng Node.js + React

Giả sử bạn có dự án:
```
my-app/
  backend/     ← Node.js API
  frontend/    ← React app
  docker-compose.yml
```

**Dockerfile cho Backend:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Tách riêng bước install để tận dụng Docker cache layer
# → Chỉ re-install khi package.json thay đổi
COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 4000
CMD ["node", "server.js"]
```

**Dockerfile cho Frontend:**

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve (image nhỏ hơn nhiều)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

:::tip Multi-stage Build
Kỹ thuật dùng nhiều `FROM` — build ở stage 1 (image lớn, nhiều tool), copy artifact sang stage 2 (image nhỏ, chỉ có runtime). Image cuối có thể nhỏ hơn **10 lần**.
:::

### .dockerignore

Tương tự `.gitignore` — tránh copy file thừa vào image:

```
node_modules
.git
.env
*.log
dist
coverage
```

---

## Volume — Lưu dữ liệu bền vững

Container bị xóa thì dữ liệu bên trong **mất theo**. Volume giải quyết vấn đề này.

```mermaid
flowchart LR
    subgraph host["💻 Máy Host"]
        V["📦 Volume\n/var/lib/docker/volumes/\nmydb-data"]
    end

    subgraph containers["🐳 Containers"]
        C1["Container DB\n/data/db"]
        C2["Container DB mới\n(sau khi xóa C1)\n/data/db"]
    end

    V <-->|"mount"| C1
    V <-->|"mount"| C2

    classDef vol fill:#1e3a5f,color:#7ec8e3,stroke:#4a8ab5,stroke-width:2px
    classDef con fill:#1e4a2e,color:#7ecf8e,stroke:#25c2a0,stroke-width:2px
    class V vol
    class C1,C2 con
```

```bash
# Tạo volume
docker volume create mydb-data

# Chạy container với volume
docker run -d \
  --name mongodb \
  -v mydb-data:/data/db \
  -p 27017:27017 \
  mongo:6

# Xem danh sách volume
docker volume ls

# Xóa volume
docker volume rm mydb-data

# Mount thư mục máy host (bind mount) — dùng khi dev
docker run -d \
  -v $(pwd)/src:/app/src \   # thay đổi code → tự reload
  -p 3000:3000 \
  my-app
```

---

## Docker Compose — Quản lý nhiều container

Thay vì gõ lệnh `docker run` dài dòng cho từng service, Docker Compose dùng file YAML.

```mermaid
flowchart TB
    DC["📄 docker-compose.yml"]
    DC -->|"docker compose up"| FE
    DC -->|"docker compose up"| BE
    DC -->|"docker compose up"| DB

    subgraph network["🌐 Docker Network (tự tạo)"]
        FE["🐳 frontend\nReact :80"]
        BE["🐳 backend\nNode.js :4000"]
        DB["🐳 mongodb\nMongo :27017"]
    end

    FE -->|"API calls"| BE
    BE -->|"query"| DB

    classDef svc fill:#1e3a5f,color:#7ec8e3,stroke:#4a8ab5,stroke-width:2px
    classDef file fill:#3a2a10,color:#e3c47e,stroke:#c2884a,stroke-width:2px
    class FE,BE,DB svc
    class DC file
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  # MongoDB
  mongodb:
    image: mongo:6
    container_name: app-mongodb
    restart: unless-stopped
    volumes:
      - mongodb-data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: secret
    ports:
      - "27017:27017"

  # Backend API
  backend:
    build: ./backend         # Build từ Dockerfile trong ./backend
    container_name: app-backend
    restart: unless-stopped
    depends_on:
      - mongodb              # Đợi mongodb khởi động trước
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://admin:secret@mongodb:27017/myapp
    ports:
      - "4000:4000"

  # Frontend
  frontend:
    build: ./frontend
    container_name: app-frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "80:80"

volumes:
  mongodb-data:              # Khai báo volume dùng chung
```

### Các lệnh Docker Compose hay dùng

```bash
# Khởi động tất cả service (build nếu chưa có image)
docker compose up -d

# Build lại image trước khi chạy
docker compose up -d --build

# Xem log tất cả service
docker compose logs -f

# Xem log 1 service cụ thể
docker compose logs -f backend

# Dừng tất cả
docker compose down

# Dừng và xóa luôn volume (⚠️ mất data)
docker compose down -v

# Restart 1 service
docker compose restart backend

# Vào shell trong service
docker compose exec backend sh

# Xem trạng thái các service
docker compose ps
```

---

## Workflow phát triển với Docker

```mermaid
flowchart TD
    A([Bắt đầu dự án]) --> B["Viết Dockerfile\ncho từng service"]
    B --> C["Viết docker-compose.yml\ncho môi trường dev"]
    C --> D["docker compose up -d"]
    D --> E["Code trên máy host\nvới bind mount\n→ tự reload trong container"]
    E --> F{Xong tính năng?}
    F -->|Chưa| E
    F -->|Rồi| G["docker compose down\ndọn dẹp"]
    G --> H["git push\nCI/CD build image"]
    H --> I["docker compose up -d\ntrên server production"]

    classDef action fill:#1e3a5f,color:#7ec8e3,stroke:#4a8ab5,stroke-width:1px
    classDef decision fill:#3a2a10,color:#e3c47e,stroke:#c2884a,stroke-width:2px
    classDef deploy fill:#1e4a2e,color:#7ecf8e,stroke:#25c2a0,stroke-width:2px
    class A,B,C,D,E,G,H action
    class F decision
    class I deploy
```

---

## Cheat sheet nhanh

| Việc cần làm | Lệnh |
| :--- | :--- |
| Chạy container | `docker run -d -p 8080:80 nginx` |
| Xem container đang chạy | `docker ps` |
| Xem log | `docker logs -f <tên>` |
| Vào trong container | `docker exec -it <tên> sh` |
| Dừng container | `docker stop <tên>` |
| Xóa container | `docker rm <tên>` |
| Build image | `docker build -t my-app .` |
| Xem image | `docker images` |
| Khởi động Compose | `docker compose up -d` |
| Dừng Compose | `docker compose down` |
| Dọn rác (image cũ) | `docker system prune` |
