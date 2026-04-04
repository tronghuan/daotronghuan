---
title: Java - Hướng dẫn
description: Hướng dẫn Quản lý Đa phiên bản Java trên Windows với Scoop
sidebar_position: 1
---

# Hướng dẫn Quản lý Đa phiên bản Java trên Windows với Scoop

Tài liệu này hướng dẫn cách cài đặt **Scoop** (Trình quản lý gói cho Windows) và cách sử dụng nó để cài đặt, chuyển đổi qua lại giữa nhiều phiên bản Java (JDK) một cách nhanh chóng.

---

## 1. Cài đặt Scoop

### Bước 1: Mở PowerShell
Nhấn phím `Windows`, gõ **PowerShell** và chọn **Run as Administrator**.

### Bước 2: Thiết lập quyền thực thi
Cho phép PowerShell chạy các script cài đặt từ internet:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Bước 3: Chạy lệnh cài đặt
Dán dòng lệnh sau để cài đặt Scoop vào thư mục người dùng:
```powershell
irm get.scoop.sh | iex
```

---

## 2. Cài đặt các phiên bản Java (JDK)

Mặc định Scoop chỉ chứa các phần mềm cơ bản. Để cài Java, bạn cần thêm "bucket" (kho chứa) chuyên dụng cho Java.

### Bước 1: Thêm Java Bucket
```powershell
scoop bucket add java
```

### Bước 2: Tìm kiếm phiên bản Java
Bạn có thể tìm các bản JDK từ nhiều nguồn (Oracle, Temurin, Zulu, OpenJDK...):
```powershell
scoop search jdk
```

### Bước 3: Cài đặt các phiên bản mong muốn
Ví dụ cài đặt Java 8 (Temurin) và Java 17 (OpenJDK):
```powershell
scoop install temurin8-jdk
scoop install openjdk17
```

---

## 3. Quản lý và Chuyển đổi Phiên bản

Scoop sử dụng cơ chế **Shim** để điều hướng lệnh `java` toàn hệ thống. Bạn không cần phải sửa biến môi trường (Environment Variables) thủ công.

### Xem các bản Java đã cài
```powershell
scoop list | Select-String "jdk"
```

### Chuyển đổi sang phiên bản cụ thể
Sử dụng lệnh `reset` để chỉ định phiên bản bạn muốn "active":

* **Sử dụng Java 8:**
  ```powershell
  scoop reset temurin8-jdk
  ```
* **Sử dụng Java 17:**
  ```powershell
  scoop reset openjdk17
  ```

### Kiểm tra kết quả
```powershell
java -version
```
> **Lưu ý:** Với Java 8, sử dụng `java -version`. Với Java 11 trở lên, có thể dùng `java --version`.

---

## 4. Các lệnh Scoop hữu ích khác

| Lệnh | Ý nghĩa |
| :--- | :--- |
| `scoop update *` | Cập nhật tất cả các ứng dụng lên bản mới nhất |
| `scoop status` | Kiểm tra xem có bản cập nhật nào mới không |
| `scoop uninstall <app>` | Gỡ cài đặt ứng dụng cực sạch |
| `where.exe java` | Kiểm tra đường dẫn vật lý của phiên bản Java đang dùng |

---

## 5. Mẹo cho Developer (Salesforce & Backend)
Nếu bạn làm việc với **Salesforce CLI** hoặc các công cụ khác, bạn cũng có thể cài nhanh qua Scoop:
```powershell
scoop install salesforce-cli git dbeaver python
```

---
*Người soạn: Huấn (DAO TRONG HUAN)*
*Ngày cập nhật: 04/04/2026*