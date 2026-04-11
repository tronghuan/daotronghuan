---
title: Cài đặt Anypoint Studio
description: Hướng dẫn cài đặt Anypoint Studio trên Windows, macOS và Linux — từ tạo tài khoản Anypoint Platform đến chạy project Mule đầu tiên.
sidebar_position: 2
---

## Yêu cầu hệ thống

| Yêu cầu | Chi tiết |
|:---|:---|
| **OS** | Windows 10/11, macOS 12+, Ubuntu 20.04+ |
| **RAM** | Tối thiểu 8 GB (khuyến nghị 16 GB) |
| **Disk** | ~2 GB cho Anypoint Studio + JDK |
| **JDK** | JDK 17 (khuyến nghị) hoặc JDK 11 |
| **CPU** | 64-bit, 4 cores+ |

:::warning JDK — không phải JRE
Anypoint Studio cần **JDK** (Java Development Kit) — bao gồm compiler. JRE (Java Runtime Environment) không đủ. Kiểm tra: `java -version` và `javac -version` đều phải có output.
:::

---

## Bước 1 — Tạo tài khoản Anypoint Platform

Anypoint Platform có **free tier** — đủ để học và deploy ứng dụng nhỏ.

1. Truy cập [anypoint.mulesoft.com](https://anypoint.mulesoft.com)
2. Click **Sign Up** → điền email, tên, tên công ty (có thể dùng tên cá nhân)
3. Xác nhận email
4. Đăng nhập lần đầu → chọn **Try for free**

Sau khi tạo xong, bạn sẽ có:
- **Organization ID** — cần khi deploy lên CloudHub
- **CloudHub** với 0.1 vCPU miễn phí
- **Anypoint Exchange** để tải connectors và templates

---

## Bước 2 — Cài JDK 17

### Windows (PowerShell)

```powershell
# Cài JDK 17 qua winget
winget install EclipseAdoptium.Temurin.17.JDK

# Hoặc Microsoft OpenJDK 17
winget install Microsoft.OpenJDK.17

# Kiểm tra sau khi cài
java -version
javac -version
```

### macOS

```bash
# Cài qua Homebrew
brew install --cask temurin@17

# Kiểm tra
java -version
```

### Linux (Ubuntu/Debian)

```bash
# Cài OpenJDK 17
sudo apt update
sudo apt install openjdk-17-jdk

# Kiểm tra
java -version
javac -version
```

### Cấu hình JAVA_HOME (Windows)

Anypoint Studio cần biến môi trường `JAVA_HOME`. Trên Windows:

```powershell
# Tìm đường dẫn JDK vừa cài
where java
# Thường là: C:\Program Files\Eclipse Adoptium\jdk-17.x.x.x-hotspot\

# Set JAVA_HOME (thay đường dẫn thực tế)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME",
  "C:\Program Files\Eclipse Adoptium\jdk-17.0.12.7-hotspot",
  "Machine")

# Thêm vào PATH
[System.Environment]::SetEnvironmentVariable("PATH",
  $env:PATH + ";$env:JAVA_HOME\bin",
  "Machine")

# Mở PowerShell mới và kiểm tra
$env:JAVA_HOME
java -version
```

---

## Bước 3 — Tải và cài Anypoint Studio

1. Đăng nhập [anypoint.mulesoft.com](https://anypoint.mulesoft.com)
2. Menu trên cùng → **Downloads** → **Anypoint Studio**
3. Chọn phiên bản mới nhất → chọn OS của bạn
4. Tải về (file ~1.5 GB)

### Windows

- File tải về: `AnypointStudio-<version>-win64.exe`
- Double-click → chạy installer → Next → chọn thư mục cài (mặc định: `C:\AnypointStudio`)
- Sau khi cài xong, mở **Anypoint Studio** từ Start Menu hoặc shortcut

### macOS

```bash
# Giải nén file .tar.gz
tar -xzf AnypointStudio-*.tar.gz -C /Applications/

# Chạy
open /Applications/AnypointStudio.app
```

### Linux

```bash
# Giải nén
tar -xzf AnypointStudio-*.tar.gz

# Chạy
cd AnypointStudio
./AnypointStudio
```

---

## Bước 4 — Cấu hình JDK trong Anypoint Studio

Lần đầu mở Anypoint Studio, nó sẽ hỏi workspace directory. Chọn hoặc tạo thư mục mới (ví dụ: `C:\Users\<tên>\MuleProjects`).

Nếu Studio không tự nhận JDK:

1. Menu **Window** → **Preferences** (hoặc **AnypointStudio** → **Preferences** trên Mac)
2. Expand **Java** → **Installed JREs**
3. Click **Add...** → **Standard VM** → **Directory...** → chọn thư mục JDK
4. Click **Finish** → đánh dấu JDK mới → **Apply and Close**

---

## Bước 5 — Cài Anypoint CLI (tùy chọn nhưng nên có)

Anypoint CLI cho phép deploy và quản lý ứng dụng từ terminal:

```bash
# Cần Node.js 16+ (cài nếu chưa có)
# Windows: winget install OpenJS.NodeJS.LTS
# macOS: brew install node

# Cài Anypoint CLI v4
npm install -g anypoint-cli-v4

# Kiểm tra
anypoint-cli-v4 --version

# Đăng nhập
anypoint-cli-v4 conf username <email-anypoint>
anypoint-cli-v4 conf password <password>
```

---

## Bước 6 — Tạo project đầu tiên để kiểm tra

1. Mở Anypoint Studio
2. **File** → **New** → **Mule Project**
3. Điền **Project Name**: `hello-mule`
4. **Mule Runtime**: chọn phiên bản mới nhất (4.6.x)
5. Click **Finish**

Studio sẽ tạo project với cấu trúc:

```
hello-mule/
├── src/
│   ├── main/
│   │   ├── mule/          ← File flow (.xml)
│   │   └── resources/     ← Config files
│   └── test/
│       └── munit/         ← Unit test files
├── pom.xml                ← Maven build config
└── mule-artifact.json     ← Mule app metadata
```

6. Trong Package Explorer, mở file `hello-mule.xml` trong `src/main/mule/`
7. Click **Run** (▶) trên toolbar để chạy
8. Xem Console ở cuối màn hình — thấy dòng `**** Mule is up and kicking` là thành công!

---

## Troubleshooting thường gặp

### "Java was started but returned exit code 13"

JDK không đúng kiến trúc (32-bit vs 64-bit). Đảm bảo cài JDK **64-bit**.

```powershell
# Kiểm tra kiến trúc JDK
java -version
# Output phải có "64-Bit Server VM"
```

### "Workspace is locked" khi mở Studio

Xóa file lock:

```bash
# Windows
del "C:\Users\<tên>\MuleProjects\.metadata\.lock"

# macOS/Linux
rm ~/MuleProjects/.metadata/.lock
```

### Studio khởi động chậm hoặc đứng

Tăng bộ nhớ cho Studio:

1. Tìm file `AnypointStudio.ini` trong thư mục cài Anypoint Studio
2. Sửa các dòng:
```
-Xms512m
-Xmx2048m
```
3. Khởi động lại Studio

### Không tải được dependencies (Maven timeout)

```bash
# Thử từ terminal để xem lỗi cụ thể
cd <project-folder>
mvn clean package -U

# Nếu cần proxy, cấu hình trong ~/.m2/settings.xml
```

---

:::tip Bước tiếp theo
Sau khi cài xong và project đầu tiên chạy được, hãy làm quen với [giao diện Anypoint Studio](../giao-dien) trước khi viết flow thực sự.
:::
