---
title: Screen Flow
description: Xây dựng giao diện tương tác với người dùng bằng Screen Flow trong Salesforce.
sidebar_position: 1
---

Screen Flow là loại Flow duy nhất trong Salesforce có giao diện hiển thị ra cho người dùng tương tác. Thay vì viết code Visualforce hay LWC từ đầu, bạn dùng Flow Builder để kéo thả các component, thiết lập logic điều hướng, và publish — tất cả không cần một dòng code.

<!--truncate-->

## Screen Flow là gì và khi nào dùng

Screen Flow về bản chất là một **wizard nhiều bước** chạy trên nền tảng Salesforce. Người dùng điền thông tin qua từng màn hình, Flow xử lý dữ liệu và thực hiện các thao tác như tạo record, gửi email, gọi Apex.

**So sánh với LWC / Aura:**

| Tiêu chí | Screen Flow | LWC / Aura |
|---|---|---|
| Tốc độ phát triển | Nhanh (kéo thả) | Chậm hơn (viết code) |
| Tùy biến UI | Giới hạn trong component có sẵn | Tùy biến hoàn toàn |
| Maintainability | Admin có thể chỉnh sửa | Cần developer |
| Performance | Thấp hơn với flow phức tạp | Cao hơn |
| Phù hợp khi | CRUD đơn giản, wizard thu thập data | UI phức tạp, custom behavior |

**Nên dùng Screen Flow khi:**
- Thu thập thông tin qua nhiều bước (wizard)
- Tạo/cập nhật record từ Quick Action hoặc Lightning Page
- Guided process mà admin có thể tự maintain sau khi developer bàn giao
- Không cần custom event, real-time validation phức tạp, hay integration nặng

**Nên dùng LWC khi:**
- Cần real-time filtering, dynamic UI phức tạp
- Tích hợp với external library (chart, map)
- Performance là ưu tiên hàng đầu

## Các Screen Component phổ biến

Khi thêm Screen element vào Flow, bạn kéo các component từ palette bên trái. Dưới đây là những component thường dùng nhất.

### Input Components

**Text** — nhập chuỗi văn bản, có thể set Required, Max Length, và Default Value.

**Number / Currency / Percentage** — nhập số với validation kiểu dữ liệu tự động. Currency tự hiển thị ký hiệu tiền tệ theo org locale.

**Date / DateTime** — hiển thị date picker, lưu dưới dạng Date/DateTime field.

**Toggle** — checkbox dạng on/off, lưu ra Boolean. Dùng thay Checkbox khi UI cần thân thiện hơn.

**Picklist** — dropdown chọn một giá trị. Có thể map vào field Picklist của object để tự lấy values, hoặc define manual choice collection.

**Multi-Select Picklist** — cho phép chọn nhiều giá trị, lưu ra text cách nhau dấu chấm phẩy (giống behavior của Multi-Select Picklist field).

**Lookup** — tìm và chọn record của một object. Component này render search box, user gõ để tìm, kết quả trả về là Record ID.

### Display Components

**Display Text** — hiển thị text tĩnh hoặc dynamic (merge field từ biến Flow). Dùng để show message hướng dẫn, tóm tắt thông tin.

**Display Image** — hiển thị ảnh từ URL hoặc Salesforce Content. Thường dùng ở màn hình xác nhận.

**Datatable** — hiển thị danh sách records dạng bảng. Hỗ trợ checkbox để user chọn nhiều rows — các record được chọn lưu vào Collection variable.

:::tip Sắp xếp component
Trong một Screen, bạn có thể drag-drop để sắp xếp lại thứ tự component. Dùng tính năng **Section** để chia component thành 2 cột cho giao diện gọn hơn.
:::

## Navigation: Điều hướng giữa các màn hình

Screen Flow mặc định có 2 nút **Previous** và **Next** (hoặc **Finish** ở màn hình cuối). Bạn có thể tùy chỉnh label của từng nút trong Screen properties.

### Conditional Navigation

Thay vì đi thẳng từ Screen A sang Screen B, bạn có thể chèn **Decision element** giữa hai màn hình để phân nhánh:

```
[Screen: Nhập loại yêu cầu]
        ↓
[Decision: Loại = "Kỹ thuật"?]
   ↓ Yes                ↓ No
[Screen: Chi tiết KT]   [Screen: Chi tiết khác]
        ↓                       ↓
[Create Record]         [Create Record]
        ↓
[Screen: Xác nhận]
```

Cấu hình Decision element với Outcome conditions dựa trên giá trị biến từ Screen trước. Nếu không có Outcome nào khớp, Flow chạy Default Outcome (thường là path "catch-all").

### Ẩn nút Previous

Trong Screen properties, bật tùy chọn **Allow Back** để kiểm soát màn hình nào cho phép quay lại. Ví dụ: màn hình xác nhận cuối thường ẩn nút Previous để tránh user quay lại sau khi record đã tạo.

## Validation: Kiểm tra dữ liệu

### Required Field

Mỗi input component có checkbox **Required** trong properties. Khi bật, Flow tự chặn Next nếu field còn trống — không cần viết thêm logic.

### Custom Validation với Formula

Với logic phức tạp hơn, dùng tính năng **Validate** trong Screen properties:

1. Mở Screen element → tab **Validate**
2. Thêm Validation rule mới
3. **Error Condition Formula**: điều kiện gây ra lỗi (trả về `true` = có lỗi)
4. **Error Message**: thông báo hiển thị cho user

Ví dụ: kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu:

```
{!EndDate} < {!StartDate}
```

Nếu formula trả về `true`, Flow hiển thị Error Message và chặn user tiến tới màn hình tiếp theo.

:::warning Custom Validation chạy phía client
Validate trong Screen chỉ chạy trên browser, không phải server. Đừng dùng nó để enforce security rules — hãy để server-side validation (field required, record rule) lo phần đó.
:::

### Validate với Apex

Nếu cần validation gọi database (ví dụ: kiểm tra email đã tồn tại), dùng **Apex Action** trong Screen element. Component custom LWC có thể implement `lightning-flow-support` để trả về validation error trực tiếp vào Screen.

## Fault Path — Bắt lỗi trong Screen Flow

Khi Flow thực hiện DML (tạo/sửa record), gọi Apex, hay gọi API — những thao tác này có thể thất bại. Nếu không xử lý, user sẽ thấy lỗi kỹ thuật khó hiểu.

**Cách thêm Fault Path:**

1. Click vào element có thể fail (Create Records, Apex Action, HTTP Callout)
2. Phía dưới element xuất hiện connector màu đỏ "Add Fault Path"
3. Nối Fault Path vào một Screen element hiển thị thông báo lỗi thân thiện

Biến hệ thống `{!$Flow.FaultMessage}` chứa thông báo lỗi gốc — bạn có thể hiển thị nó trong Display Text để admin debug.

```
[Create Records: Tạo Case]
    ↓ (success)              ↓ (fault)
[Screen: Xác nhận]    [Screen: Có lỗi xảy ra]
                       → Display Text: "Không thể tạo Case: {!$Flow.FaultMessage}"
```

:::note Best practice
Luôn thêm Fault Path cho mọi DML element và Apex callout trong Screen Flow. Đây là yêu cầu khi release Flow ra production vì nó ảnh hưởng trực tiếp đến trải nghiệm người dùng.
:::

## Thực hành: Tạo Screen Flow "Tạo Case từ giao diện"

Mục tiêu: User nhập thông tin Case qua 2 màn hình → Flow tạo Case → hiển thị xác nhận với link đến Case vừa tạo.

### Bước 1: Tạo Flow mới

Vào **Setup → Flows → New Flow → Screen Flow**.

### Bước 2: Màn hình 1 — Nhập thông tin

Thêm **Screen element**, đặt label "Thông tin Case". Thêm các component:

- **Lookup** (Label: "Tài khoản", API: `AccountId`, Object: Account) — Required
- **Text** (Label: "Tiêu đề", API: `Subject`) — Required
- **Picklist** (Label: "Mức độ ưu tiên", API: `Priority`, dùng field values từ Case.Priority)
- **Text Area** (Label: "Mô tả chi tiết", API: `Description`)

### Bước 3: Màn hình 2 — Xác nhận trước khi tạo

Thêm **Screen element** thứ hai, đặt label "Xác nhận". Thêm Display Text để tóm tắt:

```
Bạn sắp tạo Case với thông tin sau:
• Tài khoản: {!AccountId}
• Tiêu đề: {!Subject}
• Mức độ ưu tiên: {!Priority}

Nhấn Finish để xác nhận.
```

Ở Screen này, ẩn nút Previous bằng cách bỏ chọn "Allow Back" nếu bạn muốn quy trình một chiều (hoặc giữ lại để user có thể chỉnh sửa).

### Bước 4: Tạo Case

Thêm **Create Records element**:

- Object: Case
- Set field values thủ công:
  - `AccountId` = `{!AccountId}` (biến từ Screen)
  - `Subject` = `{!Subject}`
  - `Priority` = `{!Priority}`
  - `Description` = `{!Description}`
  - `Origin` = "Web" (hardcode)
- Lưu ID của Case vừa tạo vào variable `NewCaseId`

### Bước 5: Fault Path

Kéo Fault connector từ Create Records sang một Screen mới "Có lỗi" với Display Text:

```
Không thể tạo Case. Vui lòng thử lại hoặc liên hệ IT Support.
Chi tiết lỗi: {!$Flow.FaultMessage}
```

### Bước 6: Màn hình xác nhận thành công

Thêm Screen cuối "Tạo Case thành công":

- Display Text: "Case của bạn đã được tạo thành công!"
- Để hiển thị link đến Case vừa tạo, dùng formula variable với giá trị:

```
"https://" & LEFT({!$Api.Enterprise_Server_URL_260}, FIND(".salesforce.com", {!$Api.Enterprise_Server_URL_260}) + 12) & "/" & {!NewCaseId}
```

### Bước 7: Save và Activate

Save Flow, đặt tên `Create_Case_Screen_Flow`. Click **Activate**.

### Bước 8: Nhúng vào Lightning Page

**Cách 1 — App Builder (Lightning Page):**

1. Mở record page của Account → **Edit Page**
2. Kéo component **Flow** từ palette vào layout
3. Chọn Flow `Create_Case_Screen_Flow`
4. Save và Activate page

**Cách 2 — Quick Action:**

1. Setup → Object Manager → Account → Buttons, Links, and Actions → New Action
2. Action Type: **Flow**, chọn Flow `Create_Case_Screen_Flow`
3. Label: "Tạo Case mới"
4. Thêm action vào Page Layout của Account

**Cách 3 — Flow Action trong Path:**

1. Setup → Path Settings → chọn Path trên Opportunity
2. Ở bước muốn trigger Flow, thêm **Guidance for Success** và embed button gọi Flow
3. Hoặc dùng **Dynamic Action** trên Lightning Page để hiển thị button có điều kiện

:::tip Truyền dữ liệu vào Screen Flow
Khi nhúng vào Lightning Page, bạn có thể map `recordId` của page vào input variable của Flow. Ví dụ: tự điền sẵn AccountId từ Account page vào Lookup field — user không cần tìm lại.

Trong component Flow trên App Builder, bật "Pass data to flow" và map `{!recordId}` vào variable tương ứng.
:::
