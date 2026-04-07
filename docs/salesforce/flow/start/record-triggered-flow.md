---
title: Record-Triggered Flow
description: Tự động hóa nghiệp vụ khi bản ghi được tạo, cập nhật hoặc xóa với Record-Triggered Flow.
sidebar_position: 2
---

Record-Triggered Flow là loại Flow chạy tự động khi có thay đổi trên một Salesforce record — không cần người dùng kích hoạt thủ công. Đây là công cụ thay thế Workflow Rules và Process Builder (cả hai đã bị Salesforce deprecate), và trong nhiều trường hợp còn có thể thay thế cả Apex Trigger.

## Record-Triggered Flow là gì

Khi một record được tạo, cập nhật, hoặc xóa, Salesforce kích hoạt Record-Triggered Flow theo cơ chế tương tự Apex Trigger. Bạn định nghĩa:

1. **Object**: Flow chạy trên object nào (Account, Opportunity, Case...)
2. **Trigger event**: khi nào chạy (created / updated / created or updated / deleted)
3. **Entry conditions**: điều kiện lọc — chỉ chạy khi thỏa mãn
4. **Timing**: Before Save hay After Save

## Before Save vs After Save

Đây là điểm quan trọng nhất cần hiểu khi dùng Record-Triggered Flow.

### Before Save

Flow chạy **trước khi** record được commit vào database.

**Được phép:**
- Cập nhật field trên chính record đang được save (không tốn DML)
- Đọc giá trị `$Record` (giá trị mới) và `$Record__Prior` (giá trị cũ trước khi update)

**Không được phép:**
- Query SOQL (Get Records element)
- Tạo/cập nhật record khác (Create Records, Update Records)
- Gọi Apex action
- Gửi email

**Ưu điểm của Before Save:** Cực kỳ nhanh vì không tốn DML transaction riêng. Mọi thay đổi field được gộp vào cùng 1 database write với record gốc. Đây là lý do Salesforce khuyến khích ưu tiên Before Save khi chỉ cần update field.

### After Save

Flow chạy **sau khi** record đã được commit vào database.

**Được phép:**
- Query SOQL (Get Records)
- Tạo/cập nhật/xóa record liên quan
- Gọi Apex (synchronous và asynchronous actions)
- Gửi email, tạo notification
- Gọi subflow

**Không được phép:**
- Update field trực tiếp trên record vừa trigger (nếu cần, phải dùng Update Records element — tốn thêm 1 DML)

:::note Execution order
Thứ tự thực thi trong Salesforce transaction: Validation Rules → Before Triggers (Apex) → **Before Save Flow** → Record Save → After Triggers (Apex) → **After Save Flow** → Commit

Before Save Flow nằm giữa Before Trigger và After Trigger — đây là thứ tự quan trọng cần nhớ khi debug.
:::

### Bảng tóm tắt

| Tính năng | Before Save | After Save |
|---|---|---|
| Update field trên record trigger | Có (free) | Không trực tiếp |
| Get Records (SOQL) | Không | Có |
| Create / Update related records | Không | Có |
| Gọi Apex action | Không | Có |
| Gửi email | Không | Có |
| Performance | Nhanh hơn | Chậm hơn |
| Tốn DML | Không | Có |

## Entry Conditions

Entry Conditions là bộ lọc để quyết định Flow có chạy hay không, ngay cả khi trigger event đã xảy ra.

**Ví dụ:** Flow trigger khi Opportunity được cập nhật, nhưng chỉ thực sự xử lý khi `StageName` chuyển sang "Closed Won":

```
Condition: {!$Record.StageName} Equals "Closed Won"
```

**Tùy chọn "When to Run the Flow":**

- **Only when a record is created** — chỉ lần đầu tạo
- **Only when a record is updated** — mọi lần update (kể cả khi field trigger không đổi)
- **Any time a record is created or updated** — cả hai

Kết hợp với Entry Conditions theo kiểu "A record is updated AND meets condition requirements":

- **Every time** — chạy mỗi khi update nếu điều kiện thỏa
- **Only the first time** — chỉ chạy lần đầu tiên điều kiện chuyển từ không thỏa sang thỏa (tương tự `ISCHANGED` in Workflow)

:::tip Dùng "Only the first time" để tránh chạy lặp
Nếu bạn muốn Flow chỉ trigger khi field chuyển sang giá trị cụ thể (không phải mỗi lần save), chọn "Only the first time". Ví dụ: gửi email welcome khi Account Type đổi sang "Customer" — chỉ gửi 1 lần, không gửi lại mỗi khi user save record.
:::

## Tránh vòng lặp (Infinite Loop)

Infinite loop xảy ra khi:
1. Flow After Save update record A
2. Update đó kích hoạt lại Flow cùng loại
3. Flow lại update record A → lặp vô tận → Salesforce ném exception sau 100 lần

**Tình huống phổ biến gây loop:**

```
[After Save Flow trên Account]
Trigger: Account updated
Action: Update Records — cập nhật field Description trên Account

→ Việc update Description lại trigger Flow → loop
```

**Cách tránh:**

Dùng `$Record__Prior` để kiểm tra xem giá trị có thực sự thay đổi không trước khi update:

```
Entry Condition:
{!$Record.Rating} <> {!$Record__Prior.Rating}
```

Cách này đảm bảo Flow chỉ chạy khi `Rating` thực sự thay đổi. Nếu Flow tự update field khác (không phải Rating), lần trigger tiếp theo điều kiện này không thỏa → Flow dừng.

**Pattern an toàn cho After Save update record trigger:**

1. Dùng Entry Conditions chặt chẽ với `$Record__Prior`
2. Chỉ update những field không phải là điều kiện trigger
3. Xem xét dùng Custom Metadata hoặc flag field để mark "đã xử lý"

:::warning $Record__Prior chỉ có trong Update trigger
`{!$Record__Prior}` chỉ available khi trigger event là "Updated" hoặc "Created or Updated". Nếu trigger là "Created only", biến này không tồn tại và Flow sẽ lỗi nếu bạn reference đến nó.
:::

## Thực hành 1: Before Save — Format số điện thoại

**Yêu cầu:** Khi Account được tạo hoặc cập nhật và field Phone thay đổi, tự động thêm prefix "+84" nếu số bắt đầu bằng "0".

**Thiết lập:**

- Object: Account
- Trigger: A record is created or updated
- When to Run: Every time
- Entry Conditions: `{!$Record.Phone} starts with "0"` AND `{!$Record.Phone} <> {!$Record__Prior.Phone}`
- Timing: **Before Save**

**Các element:**

1. **Formula element** — tính số điện thoại mới:

```
"+84" & RIGHT({!$Record.Phone}, LEN({!$Record.Phone}) - 1)
```

Lưu kết quả vào Text variable `FormattedPhone`.

2. **Assignment element** — gán lại:

```
{!$Record.Phone} = {!FormattedPhone}
```

Với Before Save, assignment này không tốn DML — nó chỉ thay đổi giá trị trước khi record được write vào DB.

:::note Entry condition với $Record__Prior khi trigger là "Created or Updated"
Khi trigger event là "Created or Updated", `$Record__Prior.Phone` sẽ là `null` khi record mới được tạo. Formula `{!$Record.Phone} <> {!$Record__Prior.Phone}` sẽ luôn đúng cho record mới (vì bất kỳ giá trị nào cũng khác `null`) — đây là behavior mong muốn trong trường hợp này.
:::

## Thực hành 2: After Save — Tạo Task và gửi email khi Closed Won

**Yêu cầu:** Khi Opportunity chuyển sang Stage "Closed Won", tự động tạo Task follow-up cho Owner và gửi email thông báo.

**Thiết lập:**

- Object: Opportunity
- Trigger: A record is updated
- When to Run: Only the first time
- Entry Conditions: `{!$Record.StageName} Equals "Closed Won"`
- Timing: **After Save**

**Các element:**

1. **Get Records** — lấy thông tin User (Owner) để dùng trong email:

```
Object: User
Filter: Id = {!$Record.OwnerId}
Store: Single record → variable OpportunityOwner
```

2. **Create Records** — tạo Task:

```
Object: Task
Subject: "Follow up sau khi Closed Won - " & {!$Record.Name}
ActivityDate: TODAY() + 7
OwnerId: {!$Record.OwnerId}
WhatId: {!$Record.Id}
Status: "Not Started"
Priority: "High"
Description: "Opportunity " & {!$Record.Name} & " đã Closed Won với giá trị " & TEXT({!$Record.Amount})
```

3. **Send Email element** (Action: Send Email):

```
To: {!OpportunityOwner.Email}
Subject: "Chúc mừng! Opportunity Closed Won: " & {!$Record.Name}
Body: "Xin chúc mừng " & {!OpportunityOwner.FirstName} & "!\n\nOpportunity [" & {!$Record.Name} & "] đã được đóng thành công với giá trị " & TEXT({!$Record.Amount}) & ".\n\nMột Task follow-up đã được tạo cho bạn vào " & TEXT(TODAY() + 7) & "."
```

4. **Fault Path** trên Create Records và Send Email — log lỗi vào Platform Event hoặc Custom Object nếu cần audit trail.

## So sánh với Apex Trigger

| Tiêu chí | Record-Triggered Flow | Apex Trigger |
|---|---|---|
| Yêu cầu kỹ năng | Admin / low-code | Developer |
| Maintainability | Admin có thể chỉnh | Cần developer |
| Debug | Flow interview, pause | Debug logs |
| Bulkification | Salesforce tự xử lý | Dev phải tự handle |
| Complex logic | Giới hạn | Không giới hạn |
| Test coverage | Không bắt buộc | Bắt buộc 75% |
| Recursion control | Entry conditions | isRunning flag |
| Cross-object complex | Khó | Dễ |
| Callout async | Có (Async After Save) | Có (future/queueable) |

**Dùng Record-Triggered Flow khi:**
- Logic đơn giản đến trung bình: update field, tạo record liên quan, gửi email/notification
- Team có admin capability, muốn tự maintain
- Use case fit với UI của Flow Builder
- Không cần xử lý complex collection manipulation

**Dùng Apex Trigger khi:**
- Logic phức tạp: nested loops, complex aggregation, nhiều object liên quan
- Cần xử lý collection lớn với custom algorithm
- Integration phức tạp với error handling chi tiết
- Cần full control over transaction, savepoints
- Hiệu năng là yêu cầu bắt buộc (high-volume org)

:::tip Kết hợp Flow và Apex
Một pattern phổ biến: Record-Triggered Flow (After Save) gọi **Invocable Apex** cho phần logic phức tạp, còn phần trigger đơn giản xử lý trong Flow. Cách này giữ được tính maintainable của Flow nhưng vẫn có sức mạnh của Apex khi cần.
:::
