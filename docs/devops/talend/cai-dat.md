---
title: Cài đặt Talend Open Studio
description: Hướng dẫn cài đặt Java JDK 17 và Talend Open Studio trên Windows, macOS, Linux. Bao gồm cả hướng dẫn Qlik Talend Cloud trial.
sidebar_position: 2
---

Trước khi viết job ETL đầu tiên, bạn cần cài đặt 2 thứ: **Java JDK 17** (vì Talend generate và compile Java code) và **Talend Open Studio**. Bài này hướng dẫn từng bước trên cả 3 hệ điều hành.

## Yêu cầu hệ thống

| Thành phần | Yêu cầu tối thiểu | Khuyến nghị |
|---|---|---|
| **Java** | JDK 17 (không phải JRE) | Eclipse Temurin JDK 17 (Adoptium) |
| **RAM** | 4 GB | 8 GB+ (khi xử lý file lớn) |
| **Disk** | 2 GB (cài đặt) | 10 GB+ (workspace, logs, generated code) |
| **OS** | Windows 10, macOS 10.15, Ubuntu 18.04 | Phiên bản mới nhất |
| **CPU** | 2 cores | 4 cores+ |

:::warning Lưu ý Java
Talend yêu cầu **JDK** (Java Development Kit), không phải JRE (Runtime Environment). JDK bao gồm compiler `javac` cần thiết để Talend generate code. Cài JRE thuần sẽ bị lỗi khi chạy job.
:::

## Bước 1: Cài đặt Java JDK 17

Khuyến nghị dùng **Eclipse Temurin** (tên cũ: AdoptOpenJDK) — bản open source, miễn phí, không có điều khoản thương mại như Oracle JDK.

### Windows

**1. Tải JDK 17:**

Truy cập [https://adoptium.net](https://adoptium.net), chọn:
- Version: **Temurin 17 (LTS)**
- OS: **Windows**
- Architecture: **x64**
- Package Type: **.msi** (installer, dễ nhất)

**2. Chạy installer:**

Double-click file `.msi`, chọn **Next** qua các bước. Quan trọng: tick vào **"Set JAVA_HOME variable"** và **"Add to PATH"** nếu được hỏi.

**3. Verify:**

Mở Command Prompt mới (Ctrl+R → `cmd`):

```bash
java -version
# Output mong đợi:
# openjdk version "17.0.x" 202x-xx-xx
# OpenJDK Runtime Environment Temurin-17.0.x+x
# OpenJDK 64-Bit Server VM Temurin-17.0.x+x (build 17.0.x+x, mixed mode, sharing)

javac -version
# Output mong đợi:
# javac 17.0.x
```

Nếu thấy output trên là thành công. Nếu báo `command not found`, cần thêm PATH thủ công (xem phần Troubleshooting bên dưới).

### macOS

**Option 1: Dùng Homebrew (nhanh nhất)**

```bash
# Cài Homebrew nếu chưa có
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Cài Temurin JDK 17
brew install --cask temurin@17

# Verify
java -version
# openjdk version "17.0.x" ...

javac -version
# javac 17.0.x
```

**Option 2: Tải installer**

Truy cập [https://adoptium.net](https://adoptium.net), chọn macOS + pkg installer, chạy file `.pkg`.

**Kiểm tra JAVA_HOME:**

```bash
echo $JAVA_HOME
# Nếu rỗng, thêm vào ~/.zshrc hoặc ~/.bash_profile:
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH
```

### Linux (Ubuntu/Debian)

```bash
# Update package index
sudo apt update

# Cài Temurin JDK 17 từ apt
wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | sudo apt-key add -
echo "deb https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | sudo tee /etc/apt/sources.list.d/adoptium.list
sudo apt update
sudo apt install temurin-17-jdk

# Verify
java -version
javac -version
```

**Nếu máy có nhiều JDK (dùng update-alternatives):**

```bash
sudo update-alternatives --config java
# Chọn số tương ứng với Java 17
```

### Troubleshooting Java PATH

Nếu `java -version` báo lỗi sau khi cài:

```bash
# Windows: tìm đường dẫn JDK
dir "C:\Program Files\Eclipse Adoptium\" /b
# Kết quả: jdk-17.0.x.x-hotspot

# Thêm vào System Environment Variables:
# JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.x.x-hotspot
# PATH += %JAVA_HOME%\bin

# macOS/Linux: tìm đường dẫn
which java
# /usr/bin/java → thường là symlink

readlink -f $(which java)
# /usr/lib/jvm/temurin-17.../bin/java
# JAVA_HOME = /usr/lib/jvm/temurin-17...
```

## Bước 2: Tải Talend Open Studio

TOS được host trên SourceForge vì đây là project open source.

**URL tải:** [https://sourceforge.net/projects/talend-studio/](https://sourceforge.net/projects/talend-studio/)

Hoặc tìm trên [https://www.talend.com/products/talend-open-studio/](https://www.talend.com/products/talend-open-studio/) rồi chọn "Download Free".

:::note Chọn đúng phiên bản
Tải **Talend Open Studio for Data Integration** — đây là bản đầy đủ nhất cho ETL. Có các bản chuyên biệt khác như Big Data, ESB nhưng Data Integration là nền tảng bạn cần học trước.
:::

File tải về sẽ có dạng:
- Windows: `TOS_DI-Win-20241xxx.zip` (~500 MB)
- macOS: `TOS_DI-MacOSX-20241xxx.tar.gz`
- Linux: `TOS_DI-Linux-20241xxx.tar.gz`

## Bước 3: Cài đặt và chạy TOS

Talend Open Studio **không cần cài đặt** — chỉ giải nén và chạy. Đây là kiến trúc portable.

### Windows

```bash
# Giải nén zip vào thư mục không có space và ký tự đặc biệt
# VÍ DỤ TỐT:  C:\Tools\Talend\
# VÍ DỤ XẤU:  C:\Program Files\My Tools\Talend (có space)

# Sau khi giải nén, cấu trúc thư mục:
# C:\Tools\Talend\
# ├── TOS_DI-Win-x86_64.exe   ← chạy file này
# ├── configuration/
# ├── plugins/
# ├── features/
# └── ...
```

Double-click `TOS_DI-Win-x86_64.exe` để khởi động.

:::warning Thư mục cài đặt
Tránh đặt Talend trong `C:\Program Files\` vì Windows UAC có thể gây lỗi write permission khi Talend cần ghi log và generated code. Dùng `C:\Tools\` hoặc `D:\Tools\` thay thế.
:::

### macOS

```bash
# Giải nén
tar -xzf TOS_DI-MacOSX-*.tar.gz -C ~/Tools/

# Cấp quyền execute
chmod +x ~/Tools/TOS_DI-macosx-cocoa-x86_64/TOS_DI-macosx-cocoa-x86_64

# Chạy
~/Tools/TOS_DI-macosx-cocoa-x86_64/TOS_DI-macosx-cocoa-x86_64
```

Nếu macOS Gatekeeper chặn: System Preferences → Security & Privacy → "Open Anyway".

### Linux

```bash
# Giải nén
tar -xzf TOS_DI-Linux-*.tar.gz -C ~/tools/

# Cấp quyền execute
chmod +x ~/tools/TOS_DI-linux-gtk-x86_64/TOS_DI-linux-gtk-x86_64

# Chạy
~/tools/TOS_DI-linux-gtk-x86_64/TOS_DI-linux-gtk-x86_64
```

## Bước 4: Khởi động lần đầu

Lần đầu chạy TOS, bạn sẽ thấy màn hình chào:

**1. Registration screen:**

TOS yêu cầu đăng ký email. Bạn có thể:
- Điền email thật để nhận update
- Hoặc click "Register Later" nếu có option đó

**2. Workspace selection:**

```
Workspace là thư mục lưu toàn bộ projects và metadata của bạn.

Khuyến nghị:
- Windows: C:\TalendWorkspace\
- macOS:   ~/TalendWorkspace/
- Linux:   ~/talend-workspace/

KHÔNG đặt workspace trong thư mục cài đặt Talend.
```

Tick vào **"Use this as default"** để không hỏi lại mỗi lần.

**3. Create Project:**

Màn hình "Welcome" xuất hiện với nút **"Create a new project"**:

- **Project Name**: `MyFirstTalendProject` (không dấu cách, không dấu tiếng Việt)
- **Description**: Mô tả tùy ý
- Click **"Finish"**

TOS sẽ load project và mở giao diện chính. Lần đầu load khá chậm (~1-2 phút) vì cần khởi tạo workspace.

:::tip Performance tip
Nếu TOS chạy chậm, tăng heap memory. Mở file `TOS_DI-Win-x86_64.ini` (cùng thư mục với executable), tìm và sửa:

```
-Xms256m
-Xmx2048m
```

Thay `2048m` bằng `4096m` nếu máy có 8GB+ RAM.
:::

## Bước 5 (Optional): Qlik Talend Cloud Trial

Nếu muốn thử phiên bản Enterprise có đầy đủ tính năng:

**1. Đăng ký trial:**

Truy cập [https://www.talend.com/products/data-fabric/](https://www.talend.com/products/data-fabric/), click **"Free Trial"**. Điền thông tin, verify email.

**2. Setup Management Console:**

Sau khi đăng ký, bạn vào Talend Management Console (TMC) — web UI quản lý. Tại đây:
- Tạo Environment (dev/staging/prod)
- Tạo Workspace
- Download Talend Studio (bản cloud-connected)

**3. Download Talend Studio (cloud version):**

TMC → Downloads → Talend Studio → Download. File này giống TOS nhưng có thêm cloud connector.

**4. Connect Studio với Cloud:**

Khi mở Studio lần đầu:
- Chọn "Connect to Qlik Talend Cloud"
- Nhập Cloud URL và token từ TMC

:::note Cloud vs Local
Trong cloud version, Jobs được store trên cloud repository thay vì local workspace. Team members có thể share và co-edit jobs. License hết hạn sau trial period (thường 30 ngày).
:::

## Kiểm tra cài đặt thành công

Sau khi TOS mở và tạo project, xác nhận các điểm sau:

- [ ] Giao diện chính load không có error dialog
- [ ] Panel "Repository" bên trái hiển thị project structure
- [ ] Panel "Palette" bên phải có thể search component
- [ ] Tạo thư mục Job Design mới không bị lỗi permission

Nếu mọi thứ ổn, bạn đã sẵn sàng cho bài tiếp theo: [Làm quen giao diện và core concepts](./giao-dien.md).
