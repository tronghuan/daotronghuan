---
title: Batch Apex — Xử lý dữ liệu lớn
description: Tìm hiểu Batch Apex từ khái niệm đến triển khai thực tế — bao gồm thiết kế, code mẫu và lên lịch tự động.
sidebar_position: 4
---

# Batch Apex — Xử lý dữ liệu lớn

## Tại sao cần Batch Apex?

Salesforce áp đặt **Governor Limits** để đảm bảo tài nguyên dùng chung không bị độc chiếm. Giới hạn quan trọng nhất khi xử lý dữ liệu:

| Giới hạn | Apex thường | Batch Apex |
| :--- | :---: | :---: |
| Số bản ghi SOQL trả về | 50.000 | **50.000 / mỗi chunk** |
| Số DML statement | 150 | **150 / mỗi chunk** |
| Tổng bản ghi có thể xử lý | 50.000 | **Không giới hạn** |
| Heap size | 6 MB | 12 MB |

→ Khi cần xử lý **hàng chục nghìn đến hàng triệu bản ghi**, Batch Apex là giải pháp duy nhất.

---

## Cơ chế hoạt động

Batch Apex chia toàn bộ dữ liệu thành các **chunk nhỏ** (mặc định 200 bản ghi/chunk), xử lý từng chunk trong một transaction riêng biệt.

```mermaid
%%{init: { 'theme': 'base', 'themeVariables': {
  'actorBkg': '#1e3a5f', 'actorTextColor': '#7ec8e3', 'actorBorder': '#4a8ab5',
  'activationBkgColor': '#1e4a2e', 'activationBorderColor': '#25c2a0',
  'signalColor': '#25c2a0', 'signalTextColor': '#ddd',
  'loopTextColor': '#e3a87e', 'labelBoxBkgColor': '#3a2a10', 'labelBoxBorderColor': '#c2884a',
  'sequenceNumberColor': '#fff', 'noteBkgColor': '#2a3a2a', 'noteTextColor': '#7ecf8e',
  'background': '#181818', 'mainBkg': '#181818'
} } }%%
sequenceDiagram
    participant Dev as Developer
    participant SF as Salesforce Platform
    participant DB as Database

    Dev->>SF: Database.executeBatch(job, 200)
    SF->>SF: Đưa job vào hàng đợi (Apex Flex Queue)

    SF->>DB: start() — Truy vấn toàn bộ scope
    DB-->>SF: Trả về QueryLocator (con trỏ dữ liệu)

    loop Mỗi chunk 200 bản ghi
        SF->>DB: execute() — Xử lý chunk
        DB-->>SF: Commit transaction
    end

    SF->>SF: finish() — Dọn dẹp, thông báo, chain job tiếp theo
    SF-->>Dev: Gửi email thông báo kết quả (nếu cấu hình)
```

### Ba phương thức bắt buộc

```mermaid
flowchart LR
    A([start]) -->|"QueryLocator\n toàn bộ data"| B([execute])
    B -->|"Xử lý\n 200 records"| B
    B -->|"Hết data"| C([finish])
    C -->|"Gửi email\n Chain batch"| D([Kết thúc])

    style A fill:#1e3a5f,color:#7ec8e3
    style B fill:#1e4a2e,color:#7ecf8e
    style C fill:#4a2a1e,color:#e3a87e
    style D fill:#2a2a2a,color:#aaa
```

| Phương thức | Chạy mấy lần | Mục đích |
| :--- | :---: | :--- |
| `start()` | 1 lần | Định nghĩa tập dữ liệu cần xử lý |
| `execute()` | N lần (mỗi chunk 1 lần) | Logic xử lý chính |
| `finish()` | 1 lần | Thông báo, dọn dẹp, hoặc kích hoạt batch tiếp theo |

---

## Bài toán thực tế

### Bối cảnh

Công ty bạn có **hàng chục nghìn Opportunity** trong Salesforce. Mỗi cuối tháng, bộ phận sale yêu cầu:

> *"Tự động đóng tất cả các deal đã quá hạn Close Date hơn 30 ngày mà chưa thắng — chuyển sang Closed Lost và ghi lý do."*

Nếu dùng Flow hay trigger thông thường: không thể xử lý hàng chục nghìn bản ghi trong một lần. → Cần Batch Apex.

---

## Thiết kế giải pháp

### Phân tích yêu cầu

```mermaid
flowchart TD
    A[Bắt đầu cuối tháng] --> B{Opportunity nào\ncần đóng?}
    B --> C["CloseDate &lt; Hôm nay - 30 ngày\nVÀ Stage ≠ Closed Won\nVÀ Stage ≠ Closed Lost"]
    C --> D[Cập nhật StageName\n= 'Closed Lost']
    D --> E[Ghi Description\n= Lý do tự động đóng]
    E --> F[Tạo Task nhắc nhở\ncho Owner]
    F --> G[Gửi email báo cáo\ncho Manager]
    G --> H[Kết thúc]

    style A fill:#1e3a5f,color:#7ec8e3,stroke:#4a8ab5,stroke-width:2px
    style B fill:#3a2a10,color:#e3c47e,stroke:#c2884a,stroke-width:2px
    style C fill:#2a1e3a,color:#b07ee3,stroke:#8a4ab5,stroke-width:1px
    style D fill:#1e3a28,color:#7ecf8e,stroke:#25a060,stroke-width:1px
    style E fill:#1e3a28,color:#7ecf8e,stroke:#25a060,stroke-width:1px
    style F fill:#1e3a28,color:#7ecf8e,stroke:#25a060,stroke-width:1px
    style G fill:#1e3a28,color:#7ecf8e,stroke:#25a060,stroke-width:1px
    style H fill:#1e4a2e,color:#7ecf8e,stroke:#25c2a0,stroke-width:2px
```

### Thiết kế class

```mermaid
flowchart LR
    classDef iface fill:#1e3a5f,color:#7ec8e3,stroke:#4a8ab5,stroke-width:2px
    classDef batch fill:#1e4a2e,color:#7ecf8e,stroke:#25c2a0,stroke-width:2px
    classDef sched fill:#4a2a1e,color:#e3a87e,stroke:#c2884a,stroke-width:2px

    DB["«interface»\nDatabase.Batchable\n───────────────\n+ start()\n+ execute()\n+ finish()"]

    SS["«interface»\nSystem.Schedulable\n───────────────\n+ execute()"]

    CEB["CloseExpiredOpportunitiesBatch\n───────────────\n+ start(context)\n+ execute(context, scope)\n+ finish(context)\n- buildTasks(opps)"]

    CES["CloseExpiredOpportunitiesScheduler\n───────────────\n+ execute(context)"]

    DB -.->|implements| CEB
    SS -.->|implements| CES
    CES -->|khởi chạy| CEB

    class DB,SS iface
    class CEB batch
    class CES sched
```

---

## Triển khai

### Batch class chính

```apex
public class CloseExpiredOpportunitiesBatch
    implements Database.Batchable<SObject>, Database.Stateful {

    // Database.Stateful cho phép giữ biến giữa các chunk
    private Integer totalProcessed = 0;
    private Integer totalClosed    = 0;
    private String  managerEmail   = 'manager@company.com';

    // ─────────────────────────────────────────
    // 1. START — Định nghĩa tập dữ liệu
    // ─────────────────────────────────────────
    public Database.QueryLocator start(Database.BatchableContext context) {
        Date cutoffDate = Date.today().addDays(-30);

        return Database.getQueryLocator([
            SELECT Id, Name, StageName, CloseDate, OwnerId, Description
            FROM   Opportunity
            WHERE  CloseDate < :cutoffDate
            AND    StageName NOT IN ('Closed Won', 'Closed Lost')
        ]);
    }

    // ─────────────────────────────────────────
    // 2. EXECUTE — Xử lý từng chunk 200 bản ghi
    // ─────────────────────────────────────────
    public void execute(Database.BatchableContext context, List<Opportunity> scope) {
        List<Opportunity> toUpdate = new List<Opportunity>();
        List<Task>        tasks    = new List<Task>();

        for (Opportunity opp : scope) {
            // Cập nhật stage
            opp.StageName   = 'Closed Lost';
            opp.Description = 'Tự động đóng: quá hạn 30 ngày kể từ '
                            + opp.CloseDate.format()
                            + '. Xử lý ngày ' + Date.today().format();
            toUpdate.add(opp);

            // Tạo Task nhắc nhở cho Owner
            tasks.add(new Task(
                WhatId    = opp.Id,
                OwnerId   = opp.OwnerId,
                Subject   = 'Deal "' + opp.Name + '" đã bị đóng tự động — cần review',
                Status    = 'Not Started',
                Priority  = 'Normal',
                ActivityDate = Date.today()
            ));
        }

        // Dùng Database.update để không dừng khi 1 bản ghi lỗi
        List<Database.SaveResult> results = Database.update(toUpdate, false);

        // Đếm kết quả để báo cáo ở finish()
        totalProcessed += scope.size();
        for (Database.SaveResult r : results) {
            if (r.isSuccess()) totalClosed++;
        }

        insert tasks;
    }

    // ─────────────────────────────────────────
    // 3. FINISH — Gửi báo cáo sau khi xong
    // ─────────────────────────────────────────
    public void finish(Database.BatchableContext context) {
        AsyncApexJob job = [
            SELECT Status, NumberOfErrors, JobItemsProcessed, TotalJobItems
            FROM   AsyncApexJob
            WHERE  Id = :context.getJobId()
        ];

        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setToAddresses(new String[]{ managerEmail });
        email.setSubject('Batch hoàn thành: Đóng Opportunity quá hạn');
        email.setPlainTextBody(
            'Kết quả xử lý:\n'
            + '• Tổng bản ghi kiểm tra : ' + totalProcessed  + '\n'
            + '• Đã đóng thành công    : ' + totalClosed     + '\n'
            + '• Chunk đã xử lý        : ' + job.JobItemsProcessed + '/' + job.TotalJobItems + '\n'
            + '• Lỗi                   : ' + job.NumberOfErrors    + '\n'
            + '• Trạng thái job        : ' + job.Status
        );

        Messaging.sendEmail(new Messaging.SingleEmailMessage[]{ email });
    }
}
```

:::tip Database.Stateful
Không có `implements Database.Stateful`, biến `totalProcessed` và `totalClosed` sẽ bị **reset về 0 sau mỗi chunk**. Thêm interface này khi cần tích lũy dữ liệu qua các chunk để báo cáo.
:::

:::warning Database.update(list, false)
Tham số `false` (allOrNothing = false) cho phép batch tiếp tục chạy dù một số bản ghi bị lỗi validation rule. Nếu dùng `update list` thông thường, một bản ghi lỗi sẽ rollback toàn bộ chunk.
:::

---

### Chạy thủ công (Developer Console / Anonymous Apex)

```apex
// Chạy với chunk size mặc định 200
CloseExpiredOpportunitiesBatch job = new CloseExpiredOpportunitiesBatch();
Database.executeBatch(job);

// Hoặc chỉ định chunk size nhỏ hơn để test
Database.executeBatch(job, 50);
```

---

### Lên lịch tự động — chạy cuối mỗi tháng

```apex
public class CloseExpiredOpportunitiesScheduler implements Schedulable {

    public void execute(SchedulableContext context) {
        CloseExpiredOpportunitiesBatch job = new CloseExpiredOpportunitiesBatch();
        Database.executeBatch(job, 200);
    }
}
```

**Kích hoạt từ Developer Console:**

```apex
// Chạy vào 02:00 sáng ngày 1 hàng tháng
// Cú pháp: Seconds Minutes Hours Day Month DayOfWeek Year
String cronExpression = '0 0 2 1 * ?';
System.schedule('Đóng Opportunity quá hạn', cronExpression, new CloseExpiredOpportunitiesScheduler());
```

```mermaid
flowchart LR
    T["🗓️ Ngày 1\nhàng tháng\n02:00 AM"]
    A["⚡ start()\nQuery toàn bộ\nOpportunity quá hạn"]
    B["🔄 execute()\nXử lý 200 bản ghi\n× N chunk"]
    C["✅ finish()\nGửi email báo cáo\ncho Manager"]

    T --> A --> B --> B
    B -->|"Hết data"| C

    style T fill:#1e3a5f,color:#7ec8e3,stroke:#4a8ab5,stroke-width:2px
    style A fill:#3a2a10,color:#e3c47e,stroke:#c2884a,stroke-width:2px
    style B fill:#1e3a28,color:#7ecf8e,stroke:#25c2a0,stroke-width:2px
    style C fill:#1e4a2e,color:#7ecf8e,stroke:#25c2a0,stroke-width:2px
```

---

## Viết Unit Test

```apex
@IsTest
private class CloseExpiredOpportunitiesBatchTest {

    @TestSetup
    static void setup() {
        List<Opportunity> opps = new List<Opportunity>();

        // 5 deal quá hạn → cần bị đóng
        for (Integer i = 0; i < 5; i++) {
            opps.add(new Opportunity(
                Name        = 'Expired Deal ' + i,
                StageName   = 'Prospecting',
                CloseDate   = Date.today().addDays(-31),
                Amount      = 10000
            ));
        }

        // 2 deal chưa hết hạn → không được đụng vào
        for (Integer i = 0; i < 2; i++) {
            opps.add(new Opportunity(
                Name        = 'Active Deal ' + i,
                StageName   = 'Prospecting',
                CloseDate   = Date.today().addDays(30),
                Amount      = 10000
            ));
        }

        insert opps;
    }

    @IsTest
    static void testBatchClosesExpiredOpportunities() {
        Test.startTest();
        CloseExpiredOpportunitiesBatch job = new CloseExpiredOpportunitiesBatch();
        Database.executeBatch(job, 200);
        Test.stopTest();

        // Kiểm tra 5 deal quá hạn đã bị đóng
        List<Opportunity> closed = [
            SELECT Id, StageName FROM Opportunity
            WHERE Name LIKE 'Expired Deal%'
        ];
        for (Opportunity opp : closed) {
            Assert.areEqual('Closed Lost', opp.StageName, 'Deal quá hạn phải được đóng');
        }

        // Kiểm tra 2 deal còn hạn không bị ảnh hưởng
        List<Opportunity> active = [
            SELECT Id, StageName FROM Opportunity
            WHERE Name LIKE 'Active Deal%'
        ];
        for (Opportunity opp : active) {
            Assert.areEqual('Prospecting', opp.StageName, 'Deal còn hạn không được thay đổi');
        }

        // Kiểm tra Task đã được tạo
        Integer taskCount = [SELECT COUNT() FROM Task WHERE Subject LIKE '%đã bị đóng tự động%'];
        Assert.areEqual(5, taskCount, 'Mỗi deal quá hạn phải có 1 Task');
    }
}
```

---

## Checklist thiết kế Batch Apex

```mermaid
flowchart TD
    A{Cần xử lý\nnhiều bản ghi?} -->|"&lt; 10.000"| B[Queueable Apex\nhoặc Future method]
    A -->|"&gt; 10.000"| C[✅ Dùng Batch Apex]

    C --> D{Cần tích lũy\ndữ liệu giữa chunk?}
    D -->|Có| E[implements\nDatabase.Stateful]
    D -->|Không| F[Bỏ qua\nnhẹ hơn ⚡]

    C --> G{Một bản ghi lỗi\nảnh hưởng cả chunk?}
    G -->|Không muốn| H["Database.update(list, false)"]
    G -->|Chấp nhận| I["update list thông thường"]

    C --> J{Chunk size?}
    J --> K["200 — mặc định ✓"]
    J --> L["50–100 — nhiều SOQL phức tạp"]
    J --> M["2000 — xử lý đơn giản, không callout"]

    classDef question fill:#3a2a10,color:#e3c47e,stroke:#c2884a,stroke-width:2px
    classDef yes      fill:#1e4a2e,color:#7ecf8e,stroke:#25c2a0,stroke-width:2px
    classDef no       fill:#4a2a1e,color:#e3a87e,stroke:#c2884a,stroke-width:2px
    classDef info     fill:#2a1e3a,color:#b07ee3,stroke:#8a4ab5,stroke-width:1px

    class A,D,G,J question
    class C,E,H,K yes
    class B,F,I no
    class L,M info
```

### Quy tắc vàng

1. **Không có SOQL / DML trong vòng lặp** bên trong `execute()` — giống Apex thường
2. **Không gọi callout** (HTTP request) trong batch trừ khi implement thêm `Database.AllowsCallouts`
3. **Tối đa 5 batch job** chạy đồng thời trên một org
4. **Chunk size nhỏ hơn** nếu mỗi bản ghi cần nhiều SOQL phụ — tránh hit CPU limit
5. **Dùng `Database.Stateful`** chỉ khi thực sự cần — làm chậm job vì Salesforce phải serialize state
