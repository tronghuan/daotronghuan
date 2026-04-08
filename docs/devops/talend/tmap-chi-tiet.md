---
title: tMap - Component cốt lõi của Talend
description: Hướng dẫn chi tiết tMap editor, join 2 nguồn dữ liệu, expressions Java thực dụng, reject flow, multiple outputs và các gotchas cần tránh.
sidebar_position: 5
---

Nếu chỉ được học 1 component của Talend, hãy học `tMap`. Đây là component xuất hiện trong hầu hết mọi Job thực tế — nó vừa transform dữ liệu, vừa join nhiều nguồn, vừa filter, vừa split ra nhiều output. Bài này đi sâu vào mọi khía cạnh của tMap.

## tMap là gì và tại sao quan trọng

`tMap` là viết tắt của "Talend Map" — một multi-purpose transformation engine. Trong một component duy nhất, tMap có thể:

- **Map** fields từ input sang output (đổi tên, đổi type)
- **Transform** giá trị bằng Java expressions
- **Filter** rows theo điều kiện
- **Join** nhiều input tables (như SQL JOIN)
- **Split** một input ra nhiều output streams
- **Reject** rows lỗi ra một output riêng

Component tương đương trong các tool khác:
- SQL: `SELECT ... FROM ... JOIN ... WHERE ...`
- pandas: `df.merge().assign().query()`
- SSIS: Derived Column + Conditional Split + Lookup kết hợp

## Giao diện tMap Editor

Double-click vào tMap component để mở editor:

```
┌─────────────────────────────────────────────────────────────────────────┐
│  tMap Editor                                                             │
├──────────────────────────────┬──────────────────────────────────────────┤
│         INPUT SIDE           │              OUTPUT SIDE                  │
│                              │                                          │
│  ┌─ row1 (main input) ──┐    │  ┌─ out1 (main output) ─────────────┐   │
│  │ id        : Integer  │    │  │ id          : Integer             │   │
│  │ name      : String   │ ──►│  │ name        : String              │   │
│  │ department: String   │    │  │ salary_usd  : Float               │   │
│  │ salary    : Integer  │    │  │                                   │   │
│  └──────────────────────┘    │  │ [Expression] row1.salary/25000.0  │   │
│                              │  │ [Filter]     row1.dept.equals("IT")│  │
│  ┌─ lookup1 (lookup) ───┐    │  └───────────────────────────────────┘   │
│  │ dept_id   : String   │    │                                          │
│  │ dept_name : String   │    │  ┌─ reject1 (reject) ───────────────┐   │
│  │ manager   : String   │    │  │ (rows không match lookup)         │   │
│  └──────────────────────┘    │  └───────────────────────────────────┘   │
├──────────────────────────────┴──────────────────────────────────────────┤
│                     EXPRESSION ZONE                                     │
│  Click vào ô Expression để edit, có syntax highlighting cơ bản         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Các button quan trọng trong toolbar:**

- `[+]` ở Output side: thêm output table mới
- `Auto map!`: tự động map fields có cùng tên và type
- `Propagate`: propagate schema changes từ input xuống output
- Nút kính lúp: xem/edit expression trong cửa sổ lớn hơn

## Bài tập: Join employees và departments

### Chuẩn bị dữ liệu

Tạo thêm file `departments.csv`:

```csv title="departments.csv"
dept_id,dept_name,manager
IT,Information Technology,Nguyen Van A
Sales,Sales Department,Tran Thi B
HR,Human Resources,Le Van C
Finance,Finance Department,Pham Thi D
```

### Thiết kế Job

Job sẽ join employees với departments theo `department = dept_id`, output ra file enriched với đầy đủ department name và manager.

```
tFileInputDelimited (employees.csv) ──── Main ────► tMap ──── out1 ────► tFileOutputDelimited
tFileInputDelimited (departments.csv) ── Lookup ──►       └── reject ──► tLogRow (lỗi)
```

### Thêm component

1. Tạo Job mới: `JoinEmployeesDepartments`
2. Thêm vào canvas:
   - `tFileInputDelimited` × 2 (đặt tên `inputEmployees` và `inputDepartments`)
   - `tMap` (đặt tên `mapJoin`)
   - `tFileOutputDelimited` (đặt tên `outputEnriched`)
   - `tLogRow` (đặt tên `logReject`)

### Config và kết nối

**Config `inputEmployees`:** schema 4 columns như bài trước (employees.csv).

**Config `inputDepartments`:** schema 3 columns:

```
dept_id   : String  (length 10)
dept_name : String  (length 100)
manager   : String  (length 100)
```

**Kết nối:**
- `inputEmployees` → **Row → Main** → `mapJoin`
- `inputDepartments` → **Row → Main** → `mapJoin` (Talend sẽ hỏi: Row type → chọn **Lookup**)
- `mapJoin` → **Row → out1** → `outputEnriched` (sẽ tạo sau)
- `mapJoin` → **Row → reject** → `logReject` (sẽ tạo sau)

### Config trong tMap Editor

Double-click `mapJoin` để mở editor. Bạn thấy 2 input tables: `row1` (employees) và `lookup1` (departments).

**Bước 1: Config Join trên lookup1**

Click vào tiêu đề table `lookup1` → xuất hiện các option:

| Option | Giá trị | Giải thích |
|---|---|---|
| **Join model** | `Inner Join` hoặc `Left Outer Join` | Xem bảng so sánh bên dưới |
| **Catch lookup inner join reject** | tick nếu dùng Inner Join | Rows không match đi vào reject output |
| **Match model** | `All rows` | Giữ nguyên nếu lookup có unique keys |
| **Load once** | tick | Xem phần gotcha bên dưới — rất quan trọng |

**Bước 2: Định nghĩa Join condition**

Trong expression zone của lookup1, thêm Join expression:

```java
row1.department == lookup1.dept_id
```

Hoặc kéo field `row1.department` vào cột `dept_id` của lookup1 để Talend tự tạo join condition.

**Bước 3: Thêm output table out1**

Click [+] để thêm `out1`, định nghĩa schema:

```
id         : Integer
name       : String
department : String
dept_name  : String   ← từ lookup
manager    : String   ← từ lookup
salary     : Integer
salary_usd : Float
```

**Bước 4: Map fields**

```
row1.id         → out1.id
row1.name       → out1.name
row1.department → out1.department
lookup1.dept_name → out1.dept_name
lookup1.manager   → out1.manager
row1.salary     → out1.salary
```

Expression cho `salary_usd`:
```java
row1.salary / 25000.0
```

**Bước 5: Thêm reject output**

Click [+] để thêm output table `reject1` với type **Reject**. Tick option **"Catch lookup inner join reject"**. Schema của reject có thể giữ nguyên schema của `row1`.

### Inner Join vs Left Outer Join

| Kiểu Join | Hành vi | Khi nào dùng |
|---|---|---|
| **Inner Join** | Chỉ giữ rows có match ở cả 2 phía | Khi biết chắc data lookup đầy đủ |
| **Left Outer Join** | Giữ tất cả rows từ main input, lookup miss → null | Khi lookup có thể thiếu (cần null handling) |

**Ví dụ với Inner Join:**
- employees có `department = "Legal"` nhưng departments.csv không có `dept_id = "Legal"`
- → Row đó bị reject (không xuất hiện trong out1)
- → Nếu tick "Catch lookup inner join reject" → row đi vào reject output

**Ví dụ với Left Outer Join:**
- employees có `department = "Legal"` nhưng departments.csv không có match
- → Row vẫn được giữ lại, `dept_name` và `manager` = null
- → Cần handle null trong expression:

```java
// Null-safe expression cho dept_name
lookup1.dept_name != null ? lookup1.dept_name : "Unknown Department"
```

## Expressions Java thực dụng

tMap dùng Java expression thuần. Dưới đây là các pattern thường gặp nhất:

### Null check

```java
// Ternary operator
row1.email != null ? row1.email : "no-email@example.com"

// Với method calls (tránh NPE)
row1.name != null ? row1.name.trim() : ""
```

### String operations

```java
// Upper/lower case
StringHandling.UPCASE(row1.name)        // NGUYEN VAN A
StringHandling.DOWNCASE(row1.email)     // user@example.com

// Trim whitespace
StringHandling.TRIM(row1.department)

// Kiểm tra rỗng
StringHandling.EMPTY(row1.name)         // trả về boolean

// Substring
StringHandling.LEFT(row1.phone, 4)      // 4 ký tự đầu
StringHandling.RIGHT(row1.code, 3)      // 3 ký tự cuối
StringHandling.MID(row1.id_card, 3, 6)  // từ vị trí 3, lấy 6 ký tự

// Replace
row1.phone.replace("-", "").replace(" ", "")

// Concat
row1.first_name + " " + row1.last_name

// Kiểm tra chứa
row1.email.contains("@gmail.com")

// Starts/ends with
row1.code.startsWith("VN")
row1.product_id.endsWith("_ACTIVE")
```

### Number operations

```java
// Tính toán cơ bản
row1.salary * 1.1           // tăng 10%
row1.quantity * row1.price  // tổng tiền

// Round 2 chữ số thập phân
Math.round(row1.salary / 25000.0 * 100.0) / 100.0

// Absolute value
Math.abs(row1.balance)

// Min/max
Math.min(row1.score, 100)
Math.max(row1.discount, 0)
```

### Date operations

```java
// Ngày hiện tại dưới dạng String
TalendDate.formatDate("yyyy-MM-dd", TalendDate.getCurrentDate())
// Kết quả: "2024-03-15"

// Ngày hiện tại dạng Date object
TalendDate.getCurrentDate()

// Parse string thành Date
TalendDate.parseDate("dd/MM/yyyy", row1.date_string)
// row1.date_string = "15/03/2024" → Date object

// Format Date object thành String
TalendDate.formatDate("yyyy-MM-dd HH:mm:ss", row1.created_at)

// Cộng thêm ngày
TalendDate.addDate(row1.start_date, 30, "dd")  // +30 ngày
TalendDate.addDate(row1.date, 3, "MM")          // +3 tháng

// So sánh ngày
TalendDate.compareDate(row1.date1, row1.date2)  // -1, 0, hoặc 1
```

### Type conversion

```java
// String → Integer
Integer.parseInt(row1.id_string)

// String → Double
Double.parseDouble(row1.amount_string)

// Integer → String
String.valueOf(row1.id)
row1.id + ""   // cách ngắn

// Integer → Long (tránh overflow với số lớn)
(long) row1.big_number

// Null-safe parse
row1.amount_string != null && !row1.amount_string.isEmpty()
    ? Double.parseDouble(row1.amount_string)
    : 0.0
```

## Reject Flow: Bắt row lỗi

Reject flow cho phép bạn xử lý rows bị lỗi thay vì để Job crash. Hai nguồn reject phổ biến:

**1. tMap reject (join miss):**

Như đã đề cập — rows không match trong Inner Join đi vào reject output. Bắt bằng "Catch lookup inner join reject".

**2. tDBOutput reject:**

Khi insert vào DB lỗi (duplicate key, constraint violation), tDBOutput có thể route lỗi ra reject:

```
tMap ──out1──► tDBOutput ──reject──► tFileOutputDelimited (ghi ra file lỗi)
                                          └──► tLogRow (log lỗi)
```

Config tDBOutput: tick **"Catch output reject"** trong Advanced settings.

**Xử lý reject row thực tế:**

```
tFileInputDelimited (employees.csv)
    │ Main
    ▼
tMap (validate + transform)
    │ out1 (valid rows)              │ reject1 (invalid rows)
    ▼                                ▼
tDBOutput ──reject──► tFileOutputDelimited (rejected_employees.csv)
                             │ Main
                             ▼
                         tLogRow (log số lượng reject)
```

Sau mỗi Job run, kiểm tra `rejected_employees.csv` để biết bao nhiêu rows bị lỗi và lý do.

## Multiple Outputs: Filter ra 2 stream khác nhau

Một trong những dùng tMap nhiều nhất: split data theo điều kiện.

**Usecase:** Đọc employees.csv, chia ra 3 file: IT, Sales, và Other.

Trong tMap, tạo 3 output tables:

**out_it:**
- Filter: `row1.department.equals("IT")`
- Map fields bình thường

**out_sales:**
- Filter: `row1.department.equals("Sales")`
- Map fields bình thường

**out_other:**
- Filter: `!row1.department.equals("IT") && !row1.department.equals("Sales")`
- Map fields bình thường

Kết nối:
- `tMap.out_it` → `tFileOutputDelimited` (employees_it.csv)
- `tMap.out_sales` → `tFileOutputDelimited` (employees_sales.csv)
- `tMap.out_other` → `tFileOutputDelimited` (employees_other.csv)

:::warning Lưu ý Multiple Output Filters
Một row **có thể đi vào nhiều output cùng lúc** nếu nhiều filter đều true. Nếu muốn exclusive routing (chỉ đi vào 1 output), dùng `tRouter` thay thế, hoặc đảm bảo filter conditions mutually exclusive.
:::

## Gotcha quan trọng: Load once vs Reload at each row

Đây là setting cực kỳ quan trọng ảnh hưởng trực tiếp đến performance.

**Load once** (mặc định khi tick):
- Lookup table được **load toàn bộ vào RAM** một lần khi Job bắt đầu
- Mỗi row từ main input tra cứu trong memory → **rất nhanh**
- Phù hợp khi lookup table nhỏ (< vài trăm ngàn rows)

**Reload at each row** (khi bỏ tick):
- Mỗi row từ main input → tMap **reload lại toàn bộ lookup table**
- Extremely slow vì đọc file/DB lại từ đầu cho mỗi row
- Chỉ dùng khi lookup table thay đổi trong quá trình Job chạy (rất hiếm gặp)

:::warning Load once và RAM
Nếu lookup table có 10 triệu rows và mỗi row 200 bytes → cần ~2GB RAM. Khi lookup table lớn, cân nhắc dùng `tHashJoin` (sorted join, ít RAM hơn) hoặc làm join trực tiếp ở DB thay vì Talend.
:::

```
Cấu hình trong tMap editor:
Click vào tiêu đề lookup table → 

  [x] Load once    ← tick này cho performance tốt
  [ ] Reload at each row  ← ĐỪNG tick trừ khi có lý do đặc biệt
```

Bài tiếp theo: [Kết nối Database](./ket-noi-database.md) — đưa data từ CSV vào MySQL với error handling đầy đủ.
