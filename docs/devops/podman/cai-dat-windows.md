---
title: Cài đặt Podman trên Windows
description: Hướng dẫn cài đặt Podman trên Windows bằng winget trên PowerShell — từng bước từ cài đặt đến chạy container đầu tiên.
sidebar_position: 2
---

## Yêu cầu hệ thống

Trước khi bắt đầu, kiểm tra máy bạn đáp ứng:

| Yêu cầu | Chi tiết |
|:---|:---|
| OS | Windows 10 version 1903+ hoặc Windows 11 |
| Kiến trúc | 64-bit (x86_64) |
| RAM | Tối thiểu 4 GB (khuyến nghị 8 GB+) |
| WSL2 | Cần bật WSL2 (Windows Subsystem for Linux) |
| Virtualization | Cần bật trong BIOS/UEFI |

:::note WSL2
Podman Desktop trên Windows chạy container thông qua WSL2 — một môi trường Linux nhẹ nhàng được tích hợp sẵn trong Windows 10/11.
:::

---

## Bước 1 — Bật WSL2

Mở **PowerShell với quyền Administrator** và chạy:

```powershell
# Bật WSL và Virtual Machine Platform
wsl --install

# Nếu đã cài WSL1, nâng lên WSL2
wsl --set-default-version 2

# Kiểm tra phiên bản WSL
wsl --version
```

Sau khi chạy xong, **khởi động lại máy** nếu được yêu cầu.

:::tip Kiểm tra WSL2 đang hoạt động
```powershell
wsl --list --verbose
# Kết quả sẽ hiện distro với VERSION = 2
```
:::

---

## Bước 2 — Cài đặt Podman bằng winget

**winget** là package manager chính thức của Windows, có sẵn trên Windows 10 1709+ và Windows 11.

### Kiểm tra winget

```powershell
winget --version
# Kết quả ví dụ: v1.9.25200
```

Nếu chưa có winget, cài từ [Microsoft Store — App Installer](https://apps.microsoft.com/detail/9nblggh4nns1).

### Cài Podman Desktop

**Podman Desktop** là ứng dụng GUI kèm Podman CLI — cách đơn giản nhất để bắt đầu trên Windows:

```powershell
winget install RedHat.Podman-Desktop
```

### Cài Podman CLI (không có GUI)

Nếu chỉ cần CLI (nhẹ hơn, phù hợp cho server/automation):

```powershell
winget install RedHat.Podman
```

### Xem thông tin package trước khi cài

```powershell
# Tìm kiếm các package Podman có sẵn
winget search podman

# Xem chi tiết package
winget show RedHat.Podman-Desktop
```

---

## Bước 3 — Khởi tạo Podman Machine

Sau khi cài xong, mở **PowerShell** (không cần Administrator) và chạy:

```powershell
# Khởi tạo máy ảo Linux cho Podman (chỉ làm một lần)
podman machine init

# Khởi động Podman Machine
podman machine start
```

Kết quả thành công trông như sau:

```
Starting machine "podman-machine-default"
...
Machine "podman-machine-default" started successfully
```

### Các lệnh quản lý Podman Machine

```powershell
# Xem danh sách machine
podman machine list

# Xem thông tin chi tiết machine
podman machine inspect

# Dừng machine (tiết kiệm tài nguyên khi không dùng)
podman machine stop

# Khởi động lại machine
podman machine start

# Xóa machine và tạo lại
podman machine rm
podman machine init
```

---

## Bước 4 — Kiểm tra cài đặt

```powershell
# Kiểm tra phiên bản
podman --version
# Kết quả ví dụ: podman version 5.x.x

# Kiểm tra thông tin hệ thống
podman info

# Chạy container test
podman run hello-world
```

Nếu thấy dòng `Hello from Docker!` (hoặc tương tự), Podman đã hoạt động.

---

## Bước 5 — Cấu hình thêm (tùy chọn)

### Alias `docker` → `podman`

Nếu muốn gõ `docker` nhưng thực ra chạy `podman`:

```powershell
# Thêm vào PowerShell profile
notepad $PROFILE

# Dán vào file profile
Set-Alias -Name docker -Value podman
```

Hoặc dùng PowerShell trực tiếp:

```powershell
# Tạo file profile nếu chưa có
if (!(Test-Path -Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# Thêm alias vào cuối file profile
Add-Content -Path $PROFILE -Value "Set-Alias -Name docker -Value podman"

# Reload profile
. $PROFILE
```

### Cài Podman Compose

Podman Compose giúp dùng file `docker-compose.yml` với Podman:

```powershell
# Cài Python trước (nếu chưa có)
winget install Python.Python.3.13

# Cài podman-compose qua pip
pip install podman-compose

# Kiểm tra
podman-compose --version
```

---

## Troubleshooting thường gặp

### Lỗi: "Podman machine not running"

```powershell
# Khởi động lại machine
podman machine start

# Nếu vẫn lỗi, xóa và tạo lại
podman machine rm --force
podman machine init
podman machine start
```

### Lỗi: "WSL 2 requires an update"

```powershell
# Cập nhật WSL kernel
wsl --update

# Khởi động lại WSL
wsl --shutdown
```

### Lỗi: "Hyper-V not supported" hoặc Virtualization chưa bật

1. Vào **BIOS/UEFI** → bật **Intel VT-x** hoặc **AMD-V**
2. Trên Windows: vào **Turn Windows features on or off** → bật **Virtual Machine Platform** và **Windows Subsystem for Linux**

```powershell
# Kiểm tra virtualization có bật không
Get-ComputerInfo -Property HyperVisorPresent
# Kết quả: HyperVisorPresent = True là OK
```

### Kiểm tra Podman Machine logs khi gặp lỗi

```powershell
podman machine inspect
podman system connection list
```

---

## Kiểm tra hoàn chỉnh sau cài đặt

Chạy toàn bộ lệnh sau để xác nhận môi trường hoạt động tốt:

```powershell
# 1. Kiểm tra phiên bản
podman --version

# 2. Machine đang chạy
podman machine list

# 3. Kéo và chạy image nginx
podman run -d -p 8080:80 --name test-nginx nginx

# 4. Kiểm tra container đang chạy
podman ps

# 5. Truy cập http://localhost:8080 trên trình duyệt
# → Thấy trang welcome của Nginx là thành công!

# 6. Dọn dẹp
podman stop test-nginx
podman rm test-nginx
```

---

:::tip Bước tiếp theo
Sau khi cài đặt xong, tiếp tục với [Lệnh cơ bản với Podman](../lenh-co-ban) để làm quen với cách tạo và quản lý container.
:::
