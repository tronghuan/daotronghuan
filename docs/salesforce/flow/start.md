---
title: Làm quen với Flow Builder mới
description: Tổng quan về Flow Builder thế hệ mới của Salesforce — giao diện kéo thả thay thế Cloud Flow Designer cũ.
sidebar_position: 1
---

# Làm quen với Flow Builder mới

## Ba khái niệm cần nắm trước

Trước khi đi vào chi tiết, bạn cần phân biệt rõ ba thuật ngữ hay bị nhầm lẫn:

| Thuật ngữ | Ý nghĩa |
| :--- | :--- |
| **Salesforce Flow** | Tên gọi chung cho toàn bộ hệ thống — bao gồm việc xây dựng, quản lý và chạy các flow/process. |
| **Flow Builder** | Công cụ để tạo flow — giao diện kéo thả trực quan, không cần viết code. Đây là thứ chúng ta sẽ dùng trong bài này. |
| **Flow** | Một ứng dụng cụ thể được tạo ra từ Flow Builder — có thể tương tác với database, thực thi logic, gọi Apex, và thu thập dữ liệu từ người dùng. |

---

## Flow Builder mới khác gì so với trước?

Trước đây, Salesforce dùng **Cloud Flow Designer** (chạy bằng Adobe Flash) để thiết kế flow. Từ phiên bản **Spring '19**, Salesforce thay thế hoàn toàn bằng **Flow Builder** mới.

**Điều quan trọng:** Logic bên dưới không thay đổi — chỉ có giao diện thiết kế được làm mới.

### Những điểm cải tiến nổi bật

- Không còn phụ thuộc vào Adobe Flash Player
- Giao diện quen thuộc, dễ học hơn
- Nhiều component mới cho Screen element
- Tốc độ nhanh hơn đáng kể
- Thanh công cụ (toolbox) được sắp xếp gọn gàng, dễ tìm kiếm

---

## Nhận biết flow được tạo bằng công cụ nào

Nếu bạn đang quản lý một org có cả flow cũ lẫn mới, bạn có thể phân biệt chúng như sau:

**Truy cập:** Setup → tìm **Flows** trong thanh tìm kiếm.

![Trang quản lý Flow — nhận biết icon phân biệt Flow Builder mới và Cloud Flow Designer cũ](/img/salesforce/flows/Lightning-Flow-3.webp)

Ở trang danh sách Flow, hãy chú ý **icon nhỏ** bên cạnh tên mỗi flow — flow được tạo bằng Flow Builder mới sẽ có icon riêng biệt.

Ngoài ra, bạn cũng sẽ thấy **hai nút** trên trang này:
- **New Flow** — mở Flow Builder mới
- **New Flow in Cloud Flow Designer** — mở giao diện cũ (đã bị ẩn dần)

<!-- TODO: Thêm ảnh chụp màn hình trang danh sách Flow, chỉ rõ icon phân biệt -->

---

## Lưu ý khi dùng Flow Builder mới

Để các Screen element hiển thị đúng với giao diện mới, bạn cần bật **Lightning runtime for flows** trong org. Lý do là các component mới trong Screen element đều là Lightning Component, cần môi trường Lightning để render.

Một số thứ đã bị loại bỏ so với phiên bản cũ:
- **Draft element** (chế độ nháp cho screen) — đã bỏ, hầu như không ai dùng.
- **Run with Latest button** trong Subflow — không còn trong Flow Builder mới.

---

## Thực hành: Tạo form thu thập Lead

### Bài toán

Một System Admin nhận yêu cầu: tạo một **form nhập thông tin Lead** để người dùng điền trực tiếp trên giao diện Salesforce.

<!-- TODO: Thêm ảnh mockup/screenshot form Lead cần tạo -->

### Các bước thực hiện

**Bước 1 — Tạo Flow mới**

Vào **Setup → Flows → New Flow**. Canvas của Flow Builder sẽ hiện ra.

**Bước 2 — Làm quen với Canvas**

Các element trong Flow Builder mới được chia thành 4 nhóm:

<!-- TODO: Thêm ảnh chụp màn hình Canvas Flow Builder, chỉ rõ 4 nhóm element -->

| Nhóm | Các element |
| :--- | :--- |
| **User Interface** | Screen |
| **Logic** | Assignment, Decision, Loop, Pause |
| **Data** | Get Records, Create Records, Update Records, Delete Records |
| **Actions** | Subflow, Email Alert, Apex Action, Core Action |

:::tip Thay đổi quan trọng ở nhóm Data
Flow Builder mới gộp **Record Element** và **Fast Element** thành một. Đừng lo — chúng ta sẽ đi sâu vào phần này ở các bài sau.
:::

**Bước 3 — Thêm Screen element**

Kéo thả **Screen element** vào canvas. Cấu hình các trường cần thu thập từ người dùng (ví dụ: First Name, Last Name, Email, Company).

**Bước 4 — Thêm Create Records element**

Kéo thả **Create Records element** vào canvas. Map các giá trị người dùng nhập vào các field tương ứng của object **Lead**.

**Bước 5 — Kết nối các element**

Dùng **connector** (đường nối) để kết nối Screen element → Create Records element theo đúng thứ tự xử lý.

**Bước 6 — Lưu và kích hoạt**

- **Save** flow, đặt tên theo quy tắc: `Object_Action_MoTa` (ví dụ: `Lead_Create_CaptureForm`).
- Chọn **Type: Screen Flow**.
- Nhấn **Activate** để flow có hiệu lực.

---

## Bước tiếp theo

Bài này mới chỉ là cái nhìn tổng quan về Flow Builder. Trong các bài tiếp theo, chúng ta sẽ đi sâu vào từng loại Flow:

- [Screen Flow — Thu thập dữ liệu từ người dùng](./screen-flow)
- [Record-Triggered Flow — Tự động hóa khi bản ghi thay đổi](./record-triggered-flow)
- [Schedule-Triggered Flow — Chạy định kỳ theo lịch](./schedule-triggered-flow)
