---
title: Schedule-Triggered Flow
description: Chạy Flow tự động theo lịch với Schedule-Triggered Flow trong Salesforce.
sidebar_position: 3
---

Schedule-Triggered Flow là loại Flow chạy tự động vào một thời điểm cố định theo lịch định sẵn — không cần người dùng tương tác và không cần có sự kiện record thay đổi. Đây là công cụ thay thế Scheduled Apex cho các tác vụ batch xử lý dữ liệu định kỳ.

## Schedule-Triggered Flow là gì

Mỗi lần Schedule-Triggered Flow chạy, nó truy vấn một tập records thỏa mãn điều kiện lọc, rồi xử lý từng record một trong một collection loop. Salesforce chia tập records thành các **batch**, mỗi batch tối đa 200 records, và Flow chạy từng batch độc lập với nhau.

**Use cases điển hình:**
- Gửi email nhắc nhở hàng ngày (Opportunity sắp đến hạn, renewal sắp hết hạn)
- Cập nhật trạng thái hàng loạt (đánh dấu Lead "Inactive" sau 90 ngày không có hoạt động)
- Tổng hợp dữ liệu định kỳ (tính điểm, reset counter)
- Sync dữ liệu với external system theo batch

## Cấu hình Schedule-Triggered Flow

### Bước 1: Chọn Object và điều kiện lọc

Khi tạo Flow mới và chọn Schedule-Triggered Flow, bạn cấu hình:

**Object:** Object mà Flow sẽ query và lặp qua. Ví dụ: Opportunity, Lead, Account.

**Filter Conditions:** Điều kiện để lọc records cần xử lý. Ví dụ:

```
CloseDate = TODAY
StageName Not Equal To "Closed Won"
StageName Not Equal To "Closed Lost"
```

**Sort:** Tùy chọn sắp xếp records trước khi xử lý — hữu ích nếu bạn muốn xử lý theo thứ tự nhất định.

### Bước 2: Cấu hình thời gian chạy

**Start Date / Start Time:** Ngày và giờ Flow chạy lần đầu. Salesforce dùng timezone của org (Setup → Company Information → Default Time Zone).

**Frequency:**

| Tùy chọn | Ý nghĩa |
|---|---|
| Once | Chạy một lần duy nhất vào thời điểm đã chọn |
| Daily | Chạy mỗi ngày vào giờ đã chọn |
| Weekly | Chạy mỗi tuần vào ngày và giờ đã chọn |

:::warning Không có "Hourly" hay "Monthly"
Schedule-Triggered Flow chỉ hỗ trợ Once, Daily, Weekly. Nếu cần chạy theo giờ hoặc tháng, bạn phải dùng Scheduled Apex.
:::

### Bước 3: Batch size

Mặc định, Schedule-Triggered Flow xử lý **200 records mỗi batch**. Salesforce tự chia tập records thành các batch và chạy chúng theo thứ tự. Mỗi batch là một transaction độc lập — governor limits reset sau mỗi batch.

Điều này có nghĩa:
- Nếu bạn có 1000 records cần xử lý, Flow chạy 5 batch (5 transactions)
- Mỗi batch có governor limits riêng: 150 SOQL queries, 150 DML statements
- Nếu một batch fail, các batch khác vẫn tiếp tục chạy

:::note Batch size không thể tùy chỉnh trong Flow
Khác với Batch Apex nơi bạn set scope size, Schedule-Triggered Flow cố định ở 200. Đây là giới hạn quan trọng cần tính đến khi thiết kế logic.
:::

## Pattern xử lý records trong Loop

Đây là pattern chuẩn cho mọi Schedule-Triggered Flow:

```
[Start: Schedule + Filter]
        ↓
[Loop: lặp qua từng record]
    ↓ (For Each Item)
    [Decision: kiểm tra điều kiện cần xử lý?]
        ↓ Yes
        [Action: tạo/update record, gửi email...]
        ↓ No
        [Next iteration]
    ↓ (After Last Item)
[End]
```

Flow tự động cung cấp biến **loop variable** (thường đặt tên là `currentRecord`) đại diện cho record đang được xử lý trong iteration hiện tại.

### Ví dụ: Các element trong Loop

**Decision element** bên trong Loop:

```
Outcome "Cần tạo Task":
- {!currentRecord.OwnerId} Is Not Null
- {!currentRecord.CloseDate} = TODAY
```

**Create Records element** bên trong Loop:

```
Object: Task
WhatId: {!currentRecord.Id}
OwnerId: {!currentRecord.OwnerId}
Subject: "Nhắc: " & {!currentRecord.Name} & " đến hạn hôm nay"
ActivityDate: TODAY()
Status: "Not Started"
Priority: "High"
```

## Lưu ý về Governor Limits

Đây là phần quan trọng nhất khi xây dựng Schedule-Triggered Flow cho production.

### DML trong Loop — tránh tuyệt đối

Mỗi element **Create Records** hoặc **Update Records** bên trong Loop tốn 1 DML statement cho mỗi record. Với 200 records/batch, nếu mỗi record tạo 1 Task → 200 DML. Giới hạn là 150 DML/transaction → **FAIL**.

**Giải pháp: dùng Collection variable và bulk DML ngoài Loop.**

Pattern an toàn:

```
[Loop: lặp qua records]
    ↓
    [Decision: cần tạo Task?]
        ↓ Yes
        [Assignment: thêm Task vào TaskCollection]
        ↓ No
        [Next iteration]
    ↓ (After Last Item)
[Create Records: TaskCollection]  ← 1 DML cho tất cả
```

Cách này tốn đúng 1 DML statement cho toàn bộ batch, bất kể có bao nhiêu records cần tạo Task.

**Cách tạo record trong Collection:**

1. Tạo một **Record variable** (không phải Collection) cùng type với object cần tạo (ví dụ: Task)
2. Bên trong Loop, dùng **Assignment element** để set các field của record variable
3. Dùng **Assignment element** (Add) để thêm record variable vào Collection variable
4. Sau Loop, dùng **Create Records** với "Use all values from a record collection"

### SOQL trong Loop — tránh nếu có thể

Mỗi **Get Records element** bên trong Loop tốn 1 SOQL query per iteration. 200 records × 1 SOQL = 200 queries, vượt giới hạn 150.

**Giải pháp:** Query dữ liệu cần thiết **trước Loop** với related records nếu cần, hoặc dùng Sub-Flow nếu logic phức tạp.

:::warning SOQL inside Loop là lỗi phổ biến nhất
Khi Flow chạy ổn với 10-20 records trong sandbox nhưng fail ở production với 200+ records, nguyên nhân 90% là do SOQL hoặc DML bên trong Loop. Luôn review logic trước khi deploy.
:::

## Monitoring: Theo dõi Schedule-Triggered Flow

### Xem lịch chạy

**Setup → Scheduled Jobs:**
- Hiển thị danh sách các Flow đã được lên lịch
- Cột "Job Type" = "Flow" cho Schedule-Triggered Flow
- Cột "Next Run" = thời điểm chạy tiếp theo
- Có thể Delete để hủy lịch (Flow vẫn Active, chỉ hủy lần chạy tiếp theo)

### Xem kết quả chạy

**Setup → Apex Jobs** (dù không phải Apex, Schedule-Triggered Flow vẫn log ở đây):
- Cột "Status": Completed, Failed, Processing
- Cột "Items Processed" và "Items Failed"
- Click "View" để xem error message nếu fail

**Flow Error Emails:**
- Khi Flow fail, Salesforce tự gửi email thông báo đến người tạo Flow và Salesforce Admin
- Email chứa error message và interview ID để trace

**Setup → Flow Interview Logs** (nếu Flow Logging được bật):
- Chi tiết từng bước thực thi
- Chỉ có trong Developer Edition và Sandbox theo mặc định

:::tip Bật debug logging tạm thời
Khi cần debug Schedule-Triggered Flow ở production, vào **Setup → Debug Log** → thêm user "Automated Process" với log level "FLOW: FINEST". Log sẽ capture chi tiết thực thi của Flow.
:::

## Thực hành: Tạo Task nhắc Opportunity đến hạn

**Yêu cầu:** Mỗi ngày lúc 7:00 sáng, tìm tất cả Opportunity có CloseDate = ngày hôm nay và Stage chưa Closed → tạo Task nhắc Owner.

### Bước 1: Tạo Flow mới

Setup → Flows → New Flow → **Schedule-Triggered Flow**.

### Bước 2: Cấu hình Start element

```
Object: Opportunity
Filter Conditions:
  - CloseDate = {!$Flow.CurrentDate}
  - StageName Not Equal To "Closed Won"
  - StageName Not Equal To "Closed Lost"
  - IsDeleted = false

Sort: CloseDate Ascending

Start Date: [ngày mai]
Start Time: 7:00 AM
Frequency: Daily
```

### Bước 3: Tạo Collection variable

Tạo variable `TasksToCreate`:
- Data Type: Record
- Object: Task
- Allow Multiple Values (Collection): Checked

Tạo variable `newTask`:
- Data Type: Record
- Object: Task
- Allow Multiple Values: Không chọn (single record)

### Bước 4: Loop element

Thêm **Loop element**:
- Collection Variable: Records từ Start element (Salesforce tự map)
- Loop Variable: `currentOpportunity`

### Bước 5: Bên trong Loop — Assignment

Thêm **Assignment element** bên trong Loop, trước iteration tiếp theo:

```
Set variable values:
{!newTask.Subject}        = "Cần chốt hôm nay: " & {!currentOpportunity.Name}
{!newTask.WhatId}         = {!currentOpportunity.Id}
{!newTask.OwnerId}        = {!currentOpportunity.OwnerId}
{!newTask.ActivityDate}   = {!$Flow.CurrentDate}
{!newTask.Status}         = "Not Started"
{!newTask.Priority}       = "High"
{!newTask.Description}    = "Opportunity " & {!currentOpportunity.Name}
                            & " có CloseDate hôm nay với giá trị "
                            & TEXT({!currentOpportunity.Amount})
                            & ". Stage hiện tại: " & {!currentOpportunity.StageName}
```

Thêm **Assignment element** thứ hai để append vào Collection:

```
{!TasksToCreate} Add {!newTask}
```

### Bước 6: Sau Loop — Create Records bulk

Sau khi Loop kết thúc (After Last Item path), thêm **Create Records element**:

```
How to Set the Record Fields: Use all values from a record collection
Select a Record Collection: {!TasksToCreate}
```

### Bước 7: Fault Path

Thêm Fault Path từ Create Records:

```
Action: Send Email
To: {!$Setup.OrgWideEmailAddress.Address}  (hoặc hardcode email admin)
Subject: "Flow Error: Opportunity Daily Reminder"
Body: {!$Flow.FaultMessage}
```

### Bước 8: Activate

Save với tên `Opportunity_Daily_Reminder_Flow`. Click **Activate**.

Vào **Setup → Scheduled Jobs** để xác nhận lịch đã được đăng ký.

## So sánh với Scheduled Apex

| Tiêu chí | Schedule-Triggered Flow | Scheduled Apex |
|---|---|---|
| Yêu cầu kỹ năng | Admin / low-code | Developer |
| Test coverage | Không bắt buộc | Bắt buộc 75% |
| Frequency | Once / Daily / Weekly | Cron expression (linh hoạt hơn) |
| Batch size | Cố định 200 | Tùy chỉnh (scope size) |
| Bulk DML | Cần dùng Collection pattern | Native, dễ handle |
| Complex logic | Giới hạn bởi Flow Builder | Không giới hạn |
| Monitoring | Apex Jobs + email | Apex Jobs + debug log |
| Error handling | Fault path + email | Try/catch, custom logging |
| Maintainability | Admin có thể chỉnh | Cần developer |

**Dùng Schedule-Triggered Flow khi:**
- Logic tương đối đơn giản: lọc records → create/update/send email
- Team có admin tự maintain
- Tần suất Daily hoặc Weekly là đủ
- Không cần xử lý logic phức tạp trong loop

**Dùng Scheduled Apex khi:**
- Cần chạy theo giờ hoặc tháng (cron expression)
- Logic phức tạp với nhiều object liên quan
- Cần kiểm soát chi tiết batch size và concurrency
- Volume records lớn (>10,000) cần optimize
- Cần chain nhiều batch jobs

:::tip Kết hợp cả hai
Schedule-Triggered Flow có thể gọi **Invocable Apex** bên trong Loop để tận dụng sức mạnh Apex cho logic phức tạp, trong khi vẫn giữ được tính linh hoạt của Flow cho phần scheduling và filtering. Đây là pattern tốt khi muốn admin control lịch chạy nhưng developer xử lý business logic.
:::
