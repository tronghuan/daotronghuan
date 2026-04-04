# Hướng dẫn lập trình Apex cho người mới bắt đầu (Apex Quickstart)

## 1. Giới thiệu về Apex
**Apex** là một ngôn ngữ lập trình hướng đối tượng, có cú pháp mạnh (strongly typed), được phát triển bởi Salesforce. Nó có cú pháp rất giống Java và được thực thi hoàn toàn trên nền tảng Force.com (Multi-tenant architecture).

---

## 2. Các kiểu dữ liệu cơ bản (Data Types)

| Kiểu dữ liệu | Mô tả | Ví dụ |
| :--- | :--- | :--- |
| **Integer** | Số nguyên | `Integer count = 10;` |
| **Decimal** | Số thập phân (dùng cho tiền tệ) | `Decimal price = 19.99;` |
| **Boolean** | Giá trị đúng/sai | `Boolean isActive = true;` |
| **String** | Chuỗi ký tự (luôn dùng nháy đơn) | `String name = 'Salesforce';` |
| **ID** | ID hợp lệ của 1 bản ghi Salesforce | `Id recordId = '001P000001ExyzI';` |
| **Date/DateTime** | Ngày tháng và thời gian | `Date today = Date.today();` |

---

## 3. Collections (Danh sách tập hợp)
Đây là phần cực kỳ quan trọng để xử lý dữ liệu hàng loạt (Bulkify).

### List (Danh sách có thứ tự)
```java
List<String> colors = new List<String>();
colors.add('Red');
colors.add('Blue');
String firstColor = colors[0];
```

### Set (Tập hợp không trùng lặp)
```java
Set<Id> accountIds = new Set<Id>();
accountIds.add('001...abc');
```

### Map (Cặp Key-Value)
```java
Map<Id, Account> accountMap = new Map<Id, Account>();
// Key là Id, Value là đối tượng Account
```

---

## 4. Làm việc với Salesforce Data (SOQL & DML)

### SOQL (Salesforce Object Query Language)
Dùng để truy vấn dữ liệu. Kết quả trả về luôn là một `List`.
```java
List<Account> accs = [SELECT Id, Name FROM Account WHERE Industry = 'Technology' LIMIT 10];
```

### DML (Data Manipulation Language)
Dùng để thay đổi dữ liệu trong Database.
```java
Account acc = new Account(Name = 'New Tech Corp');
insert acc; // Thêm mới

acc.Phone = '0123456789';
update acc; // Cập nhật

delete acc; // Xóa
```

---

## 5. Control Flow (Cấu trúc điều khiển)

### If-Else
```java
if (score > 90) {
    System.debug('Excellent');
} else {
    System.debug('Keep trying');
}
```

### Loops (Vòng lặp) - Luôn dùng vòng lặp cho List
```java
for (Account acc : accList) {
    acc.Description = 'Updated by Apex';
}
```

---

## 6. Lớp và Phương thức (Classes & Methods)
Cấu trúc cơ bản của một file Apex:
```java
public class AccountService {
    // Phương thức tĩnh có thể gọi mà không cần khởi tạo class
    public static void updateAccountPhone(Id accId, String newPhone) {
        Account acc = [SELECT Id FROM Account WHERE Id = :accId];
        acc.Phone = newPhone;
        update acc;
    }
}
```
**Cách gọi:** `AccountService.updateAccountPhone('001...', '090...');`

---

## 7. Triggers (Bộ kích hoạt)
Dùng để thực thi logic tự động khi có sự thay đổi dữ liệu.
```java
trigger AccountTrigger on Account (before insert, after update) {
    if (Trigger.isBefore && Trigger.isInsert) {
        for (Account acc : Trigger.new) {
            if (acc.ShippingCity == null) {
                acc.ShippingCity = 'Hanoi';
            }
        }
    }
}
```

---

## 8. Nguyên tắc vàng (Best Practices)
1. **Không bao giờ đặt SOQL hoặc DML bên trong vòng lặp `for`** (Lỗi Governor Limits).
2. **Bulkify code:** Luôn giả định code của bạn sẽ xử lý 200 bản ghi cùng lúc.
3. **Sử dụng Map:** Để tránh lặp qua lặp lại các danh sách dữ liệu.
4. **Unit Test:** Phải đạt ít nhất 75% code coverage để deploy lên Production.

---

## 9. Công cụ thực hành
* **Developer Console:** Truy cập trực tiếp trên trình duyệt (Setup > Developer Console).
* **Anonymous Window:** Nhấn `Ctrl + E` trong Developer Console để chạy nhanh các đoạn code nháp.
* **VS Code + Salesforce Extension Pack:** Công cụ chuyên nghiệp nhất hiện nay.