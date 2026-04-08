---
title: Cài đặt Talend 7 với JDK 8 trên Windows
description: Hướng dẫn cài Temurin JDK 8 bằng Scoop, tải Talend Open Studio 7 từ GitHub, cấu hình .ini và xử lý lỗi biên dịch phổ biến.
sidebar_position: 2
---

Talend 7 (Open Studio for Data Integration) yêu cầu **Java 8** — không tương thích với Java 9+. Hướng dẫn này sẽ giúp bạn cài đặt đúng JDK, tải đúng bản Talend 7, và cấu hình để tránh các lỗi khó chịu ngay từ đầu.

## Tổng quan quy trình

```
Bước 1 → Cài Scoop (Windows package manager)
Bước 2 → Cài Temurin JDK 8 qua Scoop
Bước 3 → Tải Talend 7 từ GitHub
Bước 4 → Cấu hình file .ini (ép Talend dùng JDK 8)
Bước 5 → Cấu hình bên trong Talend Studio
Bước 6 → Xử lý lỗi biên dịch nếu gặp
```

---

## Bước 1 — Cài Scoop

[Scoop](https://scoop.sh) là package manager cho Windows — giúp cài phần mềm qua command line, không cần click Next→Next→Finish, không cần quyền Admin.

Mở **PowerShell** (không cần Run as Administrator) và chạy:

```powershell
# Cho phép chạy script
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Cài Scoop
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

Kiểm tra cài thành công:

```powershell
scoop --version
# Output: current: vX.X.X
```

---

## Bước 2 — Cài Temurin JDK 8 bằng Scoop

Temurin (trước đây là AdoptOpenJDK) là bản OpenJDK miễn phí, ổn định, được cộng đồng tin dùng thay thế Oracle JDK.

```powershell
# Thêm bucket java (chứa các bản JDK)
scoop bucket add java

# Cài Temurin JDK 8
scoop install temurin8-jdk
```

Scoop sẽ cài vào `C:\Users\<username>\scoop\apps\temurin8-jdk\current\`.

Kiểm tra:

```powershell
# Xem đường dẫn thực tế của JDK vừa cài
scoop prefix temurin8-jdk
# Output: C:\Users\huand\scoop\apps\temurin8-jdk\current

# Kiểm tra java version
java -version
# openjdk version "1.8.0_xxx"
```

:::tip Máy có nhiều Java
Nếu máy đã cài Java 17 hoặc 21 trước đó, lệnh `java -version` có thể vẫn trả về phiên bản cũ. Không sao — quan trọng là biết **đường dẫn chính xác** của Temurin 8 để dùng ở bước 4.

```powershell
scoop prefix temurin8-jdk
```
:::

---

## Bước 3 — Tải Talend Open Studio 7

Tải bản Talend 7 đã được maintain bởi cộng đồng tại:

**👉 https://github.com/advanova/talend-open-studio/releases**

Tải file `TOS_DI-win-x86_64-*.zip` (phiên bản mới nhất của series 7.x).

Sau đó:
1. **Giải nén** vào đường dẫn **không có dấu tiếng Việt hoặc khoảng trắng** — ví dụ: `C:\Talend\TOS_DI`
2. Không cần cài đặt — Talend chạy trực tiếp từ thư mục giải nén

```
C:\Talend\TOS_DI\
├── TOS_DI-win-x86_64.exe     ← File chạy chính
├── TOS_DI-win-x86_64.ini     ← File cấu hình (sẽ sửa ở bước 4)
├── configuration\
├── features\
├── plugins\
└── workspace\                 ← Projects lưu ở đây
```

:::warning Đường dẫn thư mục
Tránh cài vào `C:\Program Files\` hoặc `C:\Users\Nguyễn Văn A\` — dấu cách và tiếng Việt trong đường dẫn gây lỗi khi Talend generate Java code.
:::

---

## Bước 4 — Cấu hình file .ini

Đây là bước **quan trọng nhất** — đảm bảo Talend luôn dùng JDK 8 dù máy có bao nhiêu phiên bản Java.

Mở file `TOS_DI-win-x86_64.ini` bằng Notepad (hoặc VS Code), thêm 2 dòng vào **đầu file**, trước dòng `-vmargs`:

```ini
-vm
C:\Users\huand\scoop\apps\temurin8-jdk\current\bin\javaw.exe
-vmargs
-Xms256m
-Xmx2048m
...
```

:::warning Thay đường dẫn thực tế
Thay `C:\Users\huand\scoop\apps\temurin8-jdk\current` bằng output của lệnh `scoop prefix temurin8-jdk` trên máy bạn.

`-vm` và đường dẫn phải nằm trên **2 dòng riêng biệt** — không được viết trên cùng một dòng.
:::

Sau khi sửa, chạy `TOS_DI-win-x86_64.exe` — Talend sẽ khởi động với JDK 8.

:::note Dấu hiệu đang chạy sai Java
Nếu thấy lỗi `sun.misc.Unsafe` khi khởi động → Talend đang dùng Java 9+, chưa đọc được file `.ini`. Kiểm tra lại đường dẫn trong `.ini` có đúng không.
:::

---

## Bước 5 — Cấu hình bên trong Talend Studio

Sau khi mở được Talend, cần thiết lập thêm 3 điểm để tránh lỗi compile.

### 5.1 — Thêm JDK 8 vào Installed JREs

Vào **Window → Preferences → Java → Installed JREs**:

1. Nhấn **Add...** → chọn **Standard VM** → **Next**
2. Nhấn **Directory...**, trỏ đến thư mục JDK 8:
   ```
   C:\Users\huand\scoop\apps\temurin8-jdk\current
   ```
3. Nhấn **Finish**
4. **Tích chọn** JDK 8 vừa thêm làm mặc định → **Apply**

### 5.2 — Cấu hình Java Interpreter

Vào **Window → Preferences → Talend → Java Interpreter**:

- Trỏ **Executable** đến:
  ```
  C:\Users\huand\scoop\apps\temurin8-jdk\current\bin\javaw.exe
  ```
- Nhấn **Apply and Close**

### 5.3 — Đặt Compiler Compliance Level về 1.8

Vào **File → Edit Project Properties → Build → Java Version**:

- Đặt **Compiler compliance level**: `1.8`
- Nhấn **OK**

:::tip Tại sao cần bước này?
Đây là bước hay bị bỏ qua nhất và gây lỗi `missing type List/Map` hoặc `cannot find symbol`. Talend mặc định compile với Java version cao hơn, cần ép về `1.8` để khớp với JDK đang dùng.
:::

---

## Bước 6 — Xử lý lỗi biên dịch

Nếu cấu hình đúng mà Job vẫn báo lỗi `Job compile errors`, thực hiện theo thứ tự:

### 6.1 — Force Generate Code

Chuột phải vào Job trong Repository → **Generate Code**

### 6.2 — Xóa cache OSGi

Đóng Talend, xóa thư mục:
```
C:\Talend\TOS_DI\configuration\org.eclipse.osgi\
```
Mở lại Talend — nó sẽ rebuild cache.

### 6.3 — Xóa workspace metadata

Xóa thư mục:
```
C:\Talend\TOS_DI\workspace\.metadata\.plugins\org.eclipse.core.resources\.root\
```

:::warning Backup trước khi xóa
Bước 6.3 xóa metadata nội bộ của Eclipse, **không** xóa Job hay code của bạn. Nhưng vẫn nên backup thư mục `workspace` trước cho chắc.
:::

### 6.4 — Tắt Stats & Logs

Nếu gặp lỗi `IPersistableRow` hoặc code sinh ra quá phức tạp:

Vào **Job Settings → Stats & Logs** → bỏ tích tất cả các mục log tự động.

---

## Cài thủ công thiếu Module (Modules View)

Talend 7 đôi khi không tự download được thư viện (do server module không ổn định). Cách cài thủ công:

1. Vào **Window → Show View → Modules**
2. Danh sách module sẽ hiện ra — những cái **Status: Not installed** là đang thiếu
3. Chọn module cần cài → nhấn **Install**
4. Nếu tự download không được, tải file `.jar` thủ công và copy vào:
   ```
   C:\Talend\TOS_DI\lib\java\
   ```

---

## Checklist hoàn chỉnh

| Bước | Nội dung | Kiểm tra |
|:---|:---|:---|
| JDK | Temurin 8 cài qua Scoop | `scoop prefix temurin8-jdk` có output |
| Talend | Giải nén vào đường dẫn không dấu tiếng Việt | Mở được `TOS_DI-win-x86_64.exe` |
| `.ini` | `-vm` trỏ đúng `javaw.exe` của JDK 8 | Không có lỗi `sun.misc.Unsafe` |
| Installed JREs | JDK 8 được tích chọn mặc định | Preferences → Java → Installed JREs |
| Java Interpreter | Trỏ đúng `javaw.exe` | Preferences → Talend → Java Interpreter |
| Compliance level | Đặt `1.8` | File → Edit Project Properties → Build |
