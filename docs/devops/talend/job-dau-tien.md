---
title: Job đầu tiên - Đọc CSV và xử lý
description: Xây dựng 2 Job thực tế với Talend - Hello World với tFileInputDelimited và tLogRow, sau đó filter và transform dữ liệu với tMap, ghi ra CSV mới.
sidebar_position: 4
---

Lý thuyết đủ rồi — bài này bắt tay làm luôn. Bạn sẽ xây dựng 2 Job: Job đầu đọc CSV và in ra console (Hello World), Job hai filter và transform dữ liệu rồi ghi ra file mới.

## Chuẩn bị dữ liệu mẫu

Tạo file `employees.csv` tại đường dẫn dễ nhớ, ví dụ `C:/data/employees.csv` (Windows) hoặc `~/data/employees.csv` (macOS/Linux):

```csv title="employees.csv"
id,name,department,salary
1,Nguyen Van A,IT,15000000
2,Tran Thi B,Sales,12000000
3,Le Van C,HR,10000000
4,Pham Thi D,IT,18000000
5,Hoang Van E,Sales,11000000
6,Nguyen Thi F,IT,16000000
7,Tran Van G,HR,9500000
8,Le Thi H,Finance,13000000
```

:::tip Encoding
Lưu file với encoding **UTF-8** để tránh lỗi với tên có dấu tiếng Việt. Trong Notepad: File → Save As → Encoding: UTF-8.
:::

## Bài tập 1: Hello World (tFileInputDelimited → tLogRow)

### Tạo Job mới

1. Trong Repository, chuột phải vào **Job Designs → process** (hoặc tạo folder riêng)
2. Chọn **"Create job"**
3. Điền thông tin:
   - **Name**: `HelloWorldCSV`
   - **Purpose**: Đọc file CSV và in ra console
   - **Description**: First job - read employees.csv and log to console
4. Click **Finish**

Job Designer mở ra với canvas trống.

### Thêm tFileInputDelimited

1. Trong Palette, search `fileinput`
2. Kéo **tFileInputDelimited** vào canvas
3. Double-click vào component để mở config (hoặc xem tab **Component** ở panel dưới)

**Tab Basic settings — từng field:**

| Field | Giá trị | Giải thích |
|---|---|---|
| **File Name** | `"C:/data/employees.csv"` | Đường dẫn file, phải có dấu ngoặc kép, dùng `/` kể cả trên Windows |
| **Field Separator** | `","` | Dấu phân cách cột |
| **Row Separator** | `"\n"` | Dấu xuống dòng (mặc định) |
| **Header** | `1` | Bỏ qua 1 dòng header |
| **Footer** | `0` | Không có footer |
| **Limit** | `-1` | Không giới hạn số row (-1 = đọc tất cả) |
| **Encoding** | `UTF-8` | Encoding file |
| **CSV options** | tick | Xử lý đúng trường hợp field có dấu phẩy trong ngoặc kép |

**Định nghĩa Schema — quan trọng nhất:**

Click button **"Edit schema"** (hoặc click icon bên cạnh Schema field):

```
Schema editor mở ra. Click nút [+] để thêm columns:

Column Name  | Type     | Length | Nullable
id           | Integer  | -      | -
name         | String   | 100    | true
department   | String   | 50     | true
salary       | Integer  | -      | true
```

Click **OK** để lưu schema. Talend sẽ map columns từ CSV vào schema theo thứ tự (không theo tên — thứ tự quan trọng!).

:::warning Thứ tự columns trong schema
Schema mapping dựa theo **vị trí** (position), không phải tên. Column đầu tiên trong schema map với column đầu tiên trong file CSV. Nếu thứ tự lệch, data sẽ bị sai. Luôn kiểm tra header của file CSV trước.
:::

### Thêm tLogRow và kết nối

1. Search `logrow` trong Palette, kéo **tLogRow** vào canvas bên phải tFileInputDelimited
2. **Kết nối 2 component**: chuột phải vào tFileInputDelimited → **Row → Main** → click vào tLogRow

Bạn sẽ thấy đường mũi tên màu xanh nối 2 component.

3. Click vào tLogRow để xem config:

**Tab Basic settings của tLogRow:**

| Field | Giá trị | Giải thích |
|---|---|---|
| **Mode** | `Table` | In dạng bảng đẹp |
| **Print header** | tick | In tên columns |

**Các mode của tLogRow:**

```
Table mode (đẹp nhất để debug):
|----+-------------+------------+------------|
| id | name        | department | salary     |
|----+-------------+------------+------------|
|  1 | Nguyen Van A| IT         | 15000000   |
|  2 | Tran Thi B  | Sales      | 12000000   |

Vertical mode (tốt khi nhiều columns):
id: 1
name: Nguyen Van A
department: IT
salary: 15000000
---

CSV mode (dễ copy kết quả):
1;Nguyen Van A;IT;15000000
2;Tran Thi B;Sales;12000000
```

### Chạy Job

1. Nhấn **F6** hoặc click nút **Run** trong tab Run ở panel dưới
2. Xem kết quả trong console:

```
Starting job HelloWorldCSV at 14:35:01.
|----+--------------+------------+----------|
| id | name         | department | salary   |
|----+--------------+------------+----------|
|  1 | Nguyen Van A | IT         | 15000000 |
|  2 | Tran Thi B   | Sales      | 12000000 |
|  3 | Le Van C     | HR         | 10000000 |
...
[statistics] connectedComponentInfo_HelloWorldCSV_0_1 - duration: 0.123s
Job HelloWorldCSV ended at 14:35:01. [exit code=0]
```

**Exit code = 0** nghĩa là thành công. Bạn đã có Hello World đầu tiên!

## Bài tập 2: Filter và Transform (tFileInputDelimited → tMap → tFileOutputDelimited)

Job này sẽ:
- Đọc `employees.csv`
- Chỉ giữ lại nhân viên phòng IT
- Thêm cột `salary_usd` = salary chia 25000
- Ghi kết quả ra `employees_it.csv`

### Tạo Job mới

Tạo Job tên `FilterAndTransformCSV`.

### Thêm 3 component

Kéo từ Palette vào canvas theo thứ tự từ trái sang phải:
1. `tFileInputDelimited` — đặt tên `inputEmployees`
2. `tMap` — đặt tên `mapFilterIT`
3. `tFileOutputDelimited` — đặt tên `outputITEmployees`

### Config tFileInputDelimited

Config giống Bài tập 1 — cùng file `employees.csv`, cùng schema 4 columns.

### Kết nối và config tMap

1. Chuột phải `inputEmployees` → Row → Main → click `mapFilterIT`
2. Double-click `mapFilterIT` để mở **tMap editor**

**tMap Editor layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│  tMap Editor                                                     │
├────────────────────────────┬────────────────────────────────────┤
│  INPUT (bên trái)          │  OUTPUT (bên phải)                 │
│                            │                                    │
│  row1 (từ inputEmployees)  │  out1 (sẽ đi vào outputITEmployees)│
│  ┌────────────────────┐    │  ┌────────────────────────────┐    │
│  │ id         Integer │    │  │ id           Integer       │    │
│  │ name       String  │    │  │ name         String        │    │
│  │ department String  │    │  │ department   String        │    │
│  │ salary     Integer │    │  │ salary       Integer       │    │
│  └────────────────────┘    │  │ salary_usd   Float         │    │
│                            │  └────────────────────────────┘    │
│  Expression zone:          │                                    │
│  (kéo field vào để map)    │  Filter: row1.department=="IT"     │
└────────────────────────────┴────────────────────────────────────┘
```

**Bước 1: Thêm output table**

Trong tMap editor, click nút **[+]** ở góc trên bên phải (Output side) để thêm output table `out1`.

**Bước 2: Thêm column salary_usd vào output**

Click [+] trong table out1 để thêm column mới:
- Name: `salary_usd`
- Type: `Float`

**Bước 3: Map các fields**

Kéo từng field ở Input sang Output, hoặc click đôi vào field input để tự map theo tên:
- `row1.id` → `out1.id`
- `row1.name` → `out1.name`
- `row1.department` → `out1.department`
- `row1.salary` → `out1.salary`

**Bước 4: Expression cho salary_usd**

Click vào ô Expression của `salary_usd` trong out1, nhập:

```java
row1.salary / 25000.0
```

:::note Tại sao dùng 25000.0 chứ không phải 25000?
Java integer division: `15000000 / 25000` = `600` (integer, bị truncate). Dùng `25000.0` hoặc `(float)row1.salary / 25000` để có kết quả float `600.0`.
:::

**Bước 5: Filter chỉ lấy IT**

Trong out1 output table, tìm field **"Filter expression"** ở phần header của table:

```java
row1.department.equals("IT")
```

Hoặc viết tắt:

```java
"IT".equals(row1.department)
```

:::tip Null-safe comparison
`"IT".equals(row1.department)` an toàn hơn `row1.department.equals("IT")` vì nếu `row1.department` là null, cách sau sẽ throw NullPointerException. Cách đầu sẽ return `false`.
:::

**Bước 6: Đóng tMap editor**

Click **OK** để lưu và đóng.

### Config tFileOutputDelimited

1. Chuột phải `mapFilterIT` → Row → out1 → click `outputITEmployees`
2. Config `outputITEmployees`:

| Field | Giá trị |
|---|---|
| **File Name** | `"C:/data/employees_it.csv"` |
| **Field Separator** | `","` |
| **Row Separator** | `"\n"` |
| **Append** | không tick (overwrite mỗi lần chạy) |
| **Include Header** | tick (ghi dòng header) |
| **Encoding** | `UTF-8` |

Schema của tFileOutputDelimited tự động lấy từ out1 của tMap.

### Chạy và kiểm tra

Nhấn F6 để run. Sau khi chạy, mở `C:/data/employees_it.csv`:

```csv
id,name,department,salary,salary_usd
1,Nguyen Van A,IT,15000000,600.0
4,Pham Thi D,IT,18000000,720.0
6,Nguyen Thi F,IT,16000000,640.0
```

Chỉ có 3 nhân viên IT được giữ lại, và có thêm cột `salary_usd`.

### Sơ đồ Job hoàn chỉnh

```
┌───────────────────────┐    Main    ┌──────────────────┐    out1    ┌─────────────────────┐
│  tFileInputDelimited  │ ─────────► │      tMap        │ ─────────► │ tFileOutputDelimited│
│  inputEmployees       │            │  mapFilterIT     │            │  outputITEmployees  │
│                       │            │                  │            │                     │
│  - employees.csv      │            │  Filter: IT only │            │  - employees_it.csv │
│  - 4 columns          │            │  + salary_usd    │            │  - 5 columns        │
└───────────────────────┘            └──────────────────┘            └─────────────────────┘
```

## Thêm tLogRow để debug

Trong quá trình phát triển, bạn thường muốn xem data trung gian. Dùng **tReplicate** để split một flow ra 2 nhánh:

```
tFileInputDelimited ──► tReplicate ──► tMap ──► tFileOutputDelimited
                              │
                              └──► tLogRow (debug)
```

Hoặc đơn giản hơn, tạm thời thêm tLogRow sau tMap:

```
tMap ──out1──► tFileOutputDelimited
     └──out2──► tLogRow (xem data trước khi ghi file)
```

Trong tMap, thêm output table thứ 2 tên `out2` với cùng schema, map tương tự `out1`, và nối với tLogRow.

## Checklist trước khi chạy Job

Trước khi click Run, kiểm tra:

- [ ] File input tồn tại và đúng đường dẫn
- [ ] Schema khớp với actual columns của file (thứ tự, type)
- [ ] Thư mục output tồn tại (Talend không tự tạo thư mục)
- [ ] Không có đường kết nối nào broken (dấu X đỏ trên connection)
- [ ] Không có component nào warning màu vàng (hover để xem lý do)

Bài tiếp theo đi sâu vào [tMap](./tmap-chi-tiet.md) — component bạn sẽ dùng trong hầu hết mọi Job thực tế.
