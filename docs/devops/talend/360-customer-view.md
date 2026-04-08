---
title: "Thực hành: 360-Degree Customer View"
description: Xây dựng ETL pipeline tổng hợp dữ liệu khách hàng từ MySQL, Excel và REST API — tính Loyalty Score và xuất cho Marketing bằng Talend.
sidebar_position: 8
---

Trong Retail và E-commerce, dữ liệu khách hàng thường nằm rải rác ở nhiều hệ thống: POS lưu lịch sử mua hàng, Marketing quản lý thành viên trong Excel, Logistics theo dõi tỉ lệ hoàn trả qua API riêng. Bài này xây dựng một ETL pipeline hoàn chỉnh bằng Talend để tổng hợp ba nguồn đó, tính **Loyalty Score**, phân loại khách hàng và xuất kết quả cho bộ phận Marketing.

Đây là bài thực hành cấp trung — bạn nên đọc qua [tMap chi tiết](./tmap-chi-tiet.md) và [kết nối database](./ket-noi-database.md) trước khi bắt đầu.

## Tổng quan bài toán

Mỗi ngày, team Data cần cập nhật bảng `customer_360` trong PostgreSQL để Marketing có thể segment khách hàng theo tier. Pipeline cần:

1. Đọc tổng chi tiêu (LTV) từ MySQL — hệ thống POS
2. Join với danh sách thành viên từ file Excel/CSV của Marketing
3. Gọi REST API Logistics để lấy tỉ lệ hoàn trả (refund rate) theo từng khách
4. Tính Loyalty Score theo công thức nghiệp vụ
5. Ghi kết quả vào PostgreSQL và xuất JSON report

Sơ đồ toàn bộ pipeline:

```
[MySQL POS] ──┐
              ├──► [tMap: Join + Clean] ──► [tFilterRow] ──► [tJavaFlex: Validate]
[Excel CSV] ──┘                                                      │
                                                               [tFlowToIterate]
                                                                     │
                                                         [tRESTClient: API Lookup]
                                                                     │
                                                          [tJavaRow: Scoring Engine]
                                                               ┌─────┴─────┐
                                                         [PostgreSQL]   [JSON File]
                                                               └─────┬─────┘
                                                             [tStatCatcher]
                                                                     │
                                                             [tLogCatcher]
                                                                     │
                                                             [tSendMail: Alert]
```

Các component chính trong bài:

| Component | Vai trò |
|---|---|
| `tMysqlInput` | Đọc và aggregate LTV từ bảng transactions |
| `tFileInputExcel` | Đọc danh sách thành viên từ CSV/Excel |
| `tMap` | Join hai nguồn, chuẩn hóa dữ liệu |
| `tFilterRow` | Lọc bỏ row không hợp lệ |
| `tJavaFlex` | Validate email, đếm counter |
| `tFlowToIterate` | Chuyển flow thành vòng lặp cho API call |
| `tRESTClient` | Gọi API Logistics lấy refund_rate |
| `tJavaRow` | Tính Loyalty Score và phân loại tier |
| `tPostgresqlOutput` | Upsert vào bảng customer_360 |
| `tFileOutputJSON` | Xuất JSON report có tên động theo timestamp |
| `tLogCatcher` | Bắt lỗi toàn cục |
| `tStatCatcher` | Ghi số liệu vào bảng etl_logs |
| `tSendMail` | Gửi email cảnh báo khi có lỗi |

## Chuẩn bị dữ liệu mẫu

### Bảng MySQL: transactions

Tạo database `retail_pos` và bảng `transactions` với dữ liệu mẫu:

```sql
CREATE DATABASE retail_pos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE retail_pos;

CREATE TABLE transactions (
  invoice_id   VARCHAR(20)    NOT NULL,
  customer_id  VARCHAR(10)    NOT NULL,
  amount       DECIMAL(15,2)  NOT NULL,
  purchase_date DATE          NOT NULL,
  PRIMARY KEY (invoice_id)
);

INSERT INTO transactions VALUES
('INV-001', 'C001', 5500000,  '2024-01-15'),
('INV-002', 'C001', 7200000,  '2024-02-20'),
('INV-003', 'C002', -500000,  '2024-01-10'),  -- giao dịch hoàn trả ảo
('INV-004', 'C003', 3000000,  '2024-03-01'),
('INV-005', 'C002', 4100000,  '2024-02-28');
```

Sau khi lọc `amount > 0`, kết quả aggregate sẽ là:
- C001: LTV = 12,700,000 (2 giao dịch)
- C002: LTV = 4,100,000 (1 giao dịch hợp lệ, 1 bị loại)
- C003: LTV = 3,000,000 (1 giao dịch)

### File thành viên Marketing: members.csv

Lưu file này tại `C:/talend-data/members.csv` (hoặc đường dẫn tương ứng trong context):

```csv
customer_id,full_name,email,phone,referral_code
C001,nguyen van an,an.nguyen@email.com,0912345678,REF-2024-001
C002,tran thi bich,bich.tran@email.com,+84987654321,REF-2024-002
C003,le minh cuong,cuong.le@badmail,0905111222,REF-2024-003
C004,pham thu dung,dung.pham@email.com,0971234567,REF-2024-004
```

Lưu ý: C004 không có giao dịch nào trong MySQL — đây là case để test Left Outer Join. C003 có email sai format — để test validate trong tJavaFlex.

### Mock API response

API Logistics trả về JSON theo pattern `/orders/{customer_id}/stats`:

```json
{
  "customer_id": "C001",
  "total_orders": 12,
  "refund_count": 1,
  "refund_rate": 0.083
}
```

```json
{
  "customer_id": "C002",
  "total_orders": 8,
  "refund_count": 3,
  "refund_rate": 0.375
}
```

```json
{
  "customer_id": "C003",
  "total_orders": 5,
  "refund_count": 0,
  "refund_rate": 0.0
}
```

Nếu chưa có API thật, bạn có thể dùng [mockapi.io](https://mockapi.io) hoặc viết một endpoint Express.js đơn giản để test.

## Tạo Context Variables

### Tại sao phải dùng Context?

Hardcode credentials trong Job là anti-pattern nghiêm trọng: password lộ khi export archive, không thể chuyển giữa môi trường dev/prod, và khó audit. Context Variables trong Talend giải quyết cả ba vấn đề — bạn định nghĩa một lần, dùng ở nhiều job, và override khi cần khi chạy CLI.

### Danh sách context variables

| Variable | Type | Dev value | Prod value | Mô tả |
|---|---|---|---|---|
| `db_host` | String | `localhost` | `192.168.1.100` | MySQL host |
| `db_port` | String | `3306` | `3306` | MySQL port |
| `db_user` | String | `root` | `etl_user` | MySQL username |
| `db_password` | Password | `root` | `(encrypted)` | MySQL password |
| `pg_host` | String | `localhost` | `10.0.0.50` | PostgreSQL host |
| `pg_port` | String | `5432` | `5432` | PostgreSQL port |
| `pg_user` | String | `postgres` | `etl_writer` | PostgreSQL username |
| `pg_password` | Password | `postgres` | `(encrypted)` | PostgreSQL password |
| `api_base_url` | String | `http://localhost:8080` | `https://api.logistics.com` | Base URL của Logistics API |
| `api_token` | Password | `dev-token-123` | `(encrypted)` | Bearer token cho API |
| `input_file_path` | String | `C:/talend-data/members.csv` | `/data/feeds/members.csv` | Đường dẫn file Excel/CSV |
| `output_dir` | String | `C:/talend-output/` | `/data/output/` | Thư mục lưu JSON output |
| `is_promotion_day` | Boolean | `false` | `false` | Kích hoạt bonus điểm ngày khuyến mãi |
| `alert_email` | String | `dev@company.com` | `data-team@company.com` | Email nhận cảnh báo lỗi |

### Tạo Context Group trong Talend Studio

1. Trong Job Designer, click tab **Contexts** ở phần dưới màn hình
2. Click biểu tượng **+** để thêm variable mới, nhập từng dòng theo bảng trên
3. Để tạo group: click dropdown **Default** → **Add a context** → đặt tên `dev`
4. Lặp lại để tạo group `prod`
5. Với mỗi group, điền giá trị tương ứng theo cột trong bảng
6. Chọn group mặc định khi chạy local: click chuột phải vào group `dev` → **Set as default**

:::tip
Với các field dạng `Password`, Talend sẽ mã hóa giá trị khi lưu vào file `.item`. Tuy nhiên, khi export archive để share với người khác, hãy xóa giá trị password trước — dùng environment variable hoặc file properties bên ngoài cho production.
:::

### Override khi chạy CLI

Khi chạy job qua command line (ví dụ trong CI/CD pipeline hoặc cron job):

```bash
# Chạy với context group prod
./Customer360_run.sh --context=prod

# Override một biến cụ thể
./Customer360_run.sh --context=prod --context_param db_host=192.168.1.100

# Override nhiều biến
./Customer360_run.sh \
  --context=prod \
  --context_param db_password=mysecretpass \
  --context_param api_token=prod-bearer-xyz \
  --context_param is_promotion_day=true
```

:::note
Trong Talend 7.x, file shell được generate tự động khi bạn build Job. Đường dẫn thường là `[export_folder]/[JobName]/[JobName]_run.sh` trên Linux hoặc `[JobName]_run.bat` trên Windows.
:::

## Bước 1 — Đọc và Join dữ liệu với tMap

### Config tMysqlInput

Kéo `tMysqlInput` vào canvas. Double-click để mở component view:

- **Host**: `context.db_host`
- **Port**: `context.db_port`
- **Database**: `retail_pos`
- **Username**: `context.db_user`
- **Password**: `context.db_password`

Phần **Query**, nhập câu SQL aggregate LTV ngay tại tầng database để giảm tải:

```sql
SELECT
    customer_id,
    SUM(amount)  AS ltv,
    COUNT(*)     AS tx_count
FROM transactions
WHERE amount > 0
GROUP BY customer_id
```

Click **Guess Schema** để Talend tự detect kiểu dữ liệu. Kiểm tra lại:
- `customer_id`: String
- `ltv`: Double hoặc BigDecimal
- `tx_count`: Integer

:::tip
Lọc `amount > 0` ngay trong SQL thay vì dùng tFilterRow phía sau — đẩy filter về gần nguồn dữ liệu giúp giảm số row truyền qua pipeline, đặc biệt khi bảng có hàng triệu records.
:::

### Config tFileInputExcel

Kéo `tFileInputExcel` vào canvas:

- **File Name / Stream**: `context.input_file_path`
- **Sheet Name**: `Sheet1` (hoặc tên sheet thực tế)
- **Header**: tích chọn **Set header**, **Row header**: `1`
- **First row**: `2` (bắt đầu đọc từ dòng dữ liệu)

Schema mapping:
| Column index | Column name | Type |
|---|---|---|
| 0 | customer_id | String |
| 1 | full_name | String |
| 2 | email | String |
| 3 | phone | String |
| 4 | referral_code | String |

:::note
Nếu file là `.csv` thuần, dùng `tFileInputDelimited` thay thế — cấu hình tương tự nhưng cần set **Field separator** là dấu phẩy và bỏ qua cột header nếu có.
:::

### Kéo dây và config tMap

Kéo đường nối từ `tMysqlInput` (Main output) vào `tMap`. Kéo tiếp từ `tFileInputExcel` (Main output) vào `tMap`. Double-click tMap để mở editor.

**Thiết lập Join:**
- Bảng trái (row1): MySQL data — đây là **main flow**
- Bảng phải (row2): Excel data — đây là **lookup**
- Click vào biểu tượng Join ở bảng row2, chọn **Left Outer Join**
- Join key: kéo `row1.customer_id` sang `row2.customer_id`

**Output schema** — tạo một output table, đặt tên `out`, với các cột:

| Column | Expression | Ghi chú |
|---|---|---|
| `customer_id` | `row1.customer_id` | Từ MySQL (main) |
| `ltv` | `row1.ltv` | Tổng chi tiêu |
| `tx_count` | `row1.tx_count` | Số giao dịch |
| `full_name` | `StringHandling.UPCASE(StringHandling.TRIM(row2.full_name))` | UPCASE tên |
| `email` | `row2.email` | Email gốc |
| `phone` | Xem expression bên dưới | Phone chuẩn hóa |
| `referral_code` | `row2.referral_code` | Mã giới thiệu |

Expression chuẩn hóa phone về format `+84xxxxxxxxx`:

```java
// Bước 1: loại bỏ tất cả ký tự không phải số
String p = row2.phone == null ? "" : row2.phone.replaceAll("[^0-9]", "");
// Bước 2: nếu bắt đầu bằng 0 thì thay bằng +84, ngược lại giữ nguyên
p.startsWith("0") ? "+84" + p.substring(1) : "+" + p
```

**Reject flow:** ở bảng row2, tích chọn **Catch output reject** và kết nối Reject output sang một `tLogRow` để debug — đây là các customer có trong Excel nhưng không có giao dịch MySQL (ví dụ: C004).

:::warning
Trong Left Outer Join, row2 (Excel) có thể là null khi không match. Luôn wrap expression bằng null-check hoặc dùng `Relational.ISNULL(row2.email) ? "N/A" : row2.email` để tránh NullPointerException.
:::

## Bước 2 — Filter và Validate với tFilterRow + tJavaFlex

### tFilterRow: loại customer không có dữ liệu hợp lệ

Kéo `tFilterRow` sau tMap. Config:

- **Logical operator**: AND
- **Input column**: `ltv`
- **Function**: `>` (greater than)
- **Value**: `0`

Thêm điều kiện thứ hai:
- **Input column**: `customer_id`
- **Function**: `!=`
- **Value**: `""`

Kết nối **Reject output** của tFilterRow sang một `tFileOutputDelimited` lưu file `rejected_no_tx_{date}.csv` để audit sau.

### tJavaFlex: validate email và đếm counter

`tJavaFlex` khác `tJavaRow` ở chỗ nó có 3 vùng code riêng biệt: **Start**, **Main**, và **End** — cho phép khởi tạo biến trước khi xử lý và tổng kết sau khi xong.

**Start Code** — chạy một lần trước khi flow bắt đầu:

```java
int processedCount = 0;
int rejectedCount  = 0;
java.util.List<String> rejectedIds = new java.util.ArrayList<>();
```

**Main Code** — chạy cho mỗi row:

```java
// Validate email bằng regex đơn giản
if (input_row.email == null
        || !input_row.email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {

    output_row.customer_id  = input_row.customer_id;
    output_row.full_name    = input_row.full_name;
    output_row.email        = input_row.email;
    output_row.phone        = input_row.phone;
    output_row.referral_code = input_row.referral_code;
    output_row.ltv          = input_row.ltv;
    output_row.tx_count     = input_row.tx_count;
    output_row.status       = "REJECTED";
    output_row.error_msg    = "Invalid email format: " + input_row.email;
    rejectedCount++;
    rejectedIds.add(input_row.customer_id);

} else {

    output_row.customer_id  = input_row.customer_id;
    output_row.full_name    = input_row.full_name;
    output_row.email        = input_row.email;
    output_row.phone        = input_row.phone;
    output_row.referral_code = input_row.referral_code;
    output_row.ltv          = input_row.ltv;
    output_row.tx_count     = input_row.tx_count;
    output_row.status       = "VALID";
    output_row.error_msg    = "";
    processedCount++;

}
```

**End Code** — chạy một lần sau khi tất cả row đã xử lý:

```java
System.out.println("=== tJavaFlex Summary ===");
System.out.println("Processed (VALID)  : " + processedCount);
System.out.println("Rejected (INVALID) : " + rejectedCount);
if (!rejectedIds.isEmpty()) {
    System.out.println("Rejected IDs       : " + rejectedIds.toString());
}
System.out.println("=========================");
```

**Output schema** của tJavaFlex thêm hai cột mới so với input: `status` (String) và `error_msg` (String).

Sau tJavaFlex, dùng một `tFilterRow` nữa để tách dòng:
- Flow chính: `status == "VALID"` → tiếp tục sang API lookup
- Reject flow: `status == "REJECTED"` → lưu vào file `rejected_customers_{date}.csv`

:::tip
Đặt tên file reject có ngày tháng để dễ audit: dùng expression `context.output_dir + "rejected_customers_" + TalendDate.formatDate("yyyyMMdd", TalendDate.getCurrentDate()) + ".csv"` trong tFileOutputDelimited.
:::

## Bước 3 — API Lookup với tFlowToIterate + tRESTClient

### Pattern tFlowToIterate là gì?

Một Flow trong Talend chạy tất cả row liên tục qua pipeline. Nhưng để gọi API riêng cho từng customer, ta cần "pause" flow, gọi API, nhận kết quả rồi mới xử lý row tiếp theo. `tFlowToIterate` làm đúng điều đó: nó nhận một row, lưu vào `globalMap`, rồi trigger subjob tiếp theo — tạo ra một vòng lặp.

### Config tFlowToIterate

Kéo `tFlowToIterate` sau bước validate. Trong tab Component:
- Tích chọn **Use column as a global variable**
- Thêm dòng: **Column** = `customer_id`, **Global variable name** = `current_customer_id`
- Tương tự thêm `ltv` → `current_ltv` và `status` → `current_status`

Kết nối `tFlowToIterate` sang `tRESTClient` bằng **Iterate link** (không phải Main, chuột phải vào đường nối để chọn loại).

### Config tRESTClient

Double-click `tRESTClient`:

- **URL**: `context.api_base_url + "/orders/" + (String)globalMap.get("current_customer_id") + "/stats"`
- **Method**: GET
- **HTTP Headers**:
  - `Authorization` : `"Bearer " + context.api_token`
  - `Accept` : `"application/json"`
- **Die on error**: bỏ tích (để pipeline không chết khi API lỗi)

Output schema của tRESTClient (dạng String raw JSON — ta sẽ parse bên dưới):
- `body`: String

Để parse JSON response, thêm một `tExtractJSONFields` sau tRESTClient:
- **JSON content**: `row1.body`
- **Loop jsonpath**: `$`
- Schema mapping:

| Column | JSONPath | Type |
|---|---|---|
| `total_orders` | `$.total_orders` | Integer |
| `refund_count` | `$.refund_count` | Integer |
| `refund_rate` | `$.refund_rate` | Float |

### Xử lý lỗi API

Kết nối **OnComponentError** từ `tRESTClient` sang một `tJavaRow` nhỏ để gán giá trị mặc định:

```java
output_row.total_orders = 0;
output_row.refund_count = 0;
output_row.refund_rate  = 0.0f;
System.out.println("[WARN] API failed for customer: "
    + (String)globalMap.get("current_customer_id")
    + " — using default refund_rate=0");
```

:::warning
`tFlowToIterate` gọi API **tuần tự từng row** — với 10,000 khách hàng và API latency trung bình 200ms, pipeline sẽ mất tối thiểu 33 phút chỉ cho bước này. Nếu API hỗ trợ bulk request (gửi một danh sách IDs), hãy thu thập tất cả IDs vào một list trước (dùng `tAggregateRow` hoặc `tJavaRow` với List), gọi một lần và join kết quả về. Xem phần Tối ưu hóa ở cuối bài.
:::

## Bước 4 — Tính Loyalty Score với tJavaRow

Đây là trái tim của pipeline — tJavaRow nhận dữ liệu đã join đầy đủ và áp dụng business logic.

### Input schema cần có

Trước khi đến tJavaRow, cần merge data từ hai nhánh: data customer (từ validate step) và API result (từ tRESTClient/tExtractJSONFields). Dùng một `tMap` nhỏ để merge globalMap values với API output:
- Đọc `current_ltv`, `current_customer_id` từ globalMap
- Kết hợp với `total_orders`, `refund_count`, `refund_rate` từ tExtractJSONFields

### Code tJavaRow: Scoring Engine

```java
// ==========================================
// LOYALTY SCORING ENGINE
// ==========================================

// 1. Base score
int score = 100;

// 2. LTV Bonus — khách hàng chi tiêu nhiều được thưởng điểm
double ltv = input_row.ltv == null ? 0.0 : input_row.ltv;
if (ltv > 10000000) {
    score += 100;
}

// 3. Refund Penalty — tỉ lệ hoàn trả cao bị trừ điểm
float refundRate = input_row.refund_rate == null ? 0.0f : input_row.refund_rate;
if (refundRate > 0.20f) {
    score -= 50;
}

// 4. Promotion Day Bonus — áp dụng khi chạy job vào ngày khuyến mãi
if (context.is_promotion_day) {
    score = (int)(score * 1.2);
}

output_row.loyalty_score = score;

// 5. Phân loại tier
if (score >= 150) {
    output_row.tier = "GOLD";
} else if (score >= 100) {
    output_row.tier = "SILVER";
} else {
    output_row.tier = "BRONZE";
}

// 6. Timestamp cho tên file output
output_row.report_filename = "Customer_Report_"
    + TalendDate.formatDate("yyyyMMdd_HHmm", TalendDate.getCurrentDate())
    + ".json";

// 7. Timestamp cập nhật record
output_row.updated_at = TalendDate.getCurrentDate();

// 8. Pass-through các field khác
output_row.customer_id  = input_row.customer_id;
output_row.full_name    = input_row.full_name;
output_row.email        = input_row.email;
output_row.phone        = input_row.phone;
output_row.ltv          = ltv;
output_row.tx_count     = input_row.tx_count;
output_row.refund_rate  = refundRate;

// 9. Log để debug
System.out.printf("[SCORE] %s | LTV: %,.0f | RefundRate: %.1f%% | Score: %d | Tier: %s%n",
    input_row.customer_id,
    ltv,
    refundRate * 100,
    score,
    output_row.tier
);
```

### Kết quả tính toán với dữ liệu mẫu

| Customer | LTV | Refund Rate | Score Calculation | Score | Tier |
|---|---|---|---|---|---|
| C001 | 12,700,000 | 8.3% | 100 + 100 (LTV) | 200 | GOLD |
| C002 | 4,100,000 | 37.5% | 100 - 50 (refund) | 50 | BRONZE |
| C003 | 3,000,000 | 0% | 100 (base chỉ) | 100 | SILVER |
| C004 | 0 (null) | N/A | Bị lọc trước khi đến step này | — | — |

C001 vượt ngưỡng LTV 10 triệu nên được +100, thành GOLD. C002 có refund rate 37.5% > 20% nên bị -50, thành BRONZE. C003 đúng base score, thành SILVER.

## Bước 5 — Output: PostgreSQL và JSON

### tPostgresqlOutput: Upsert vào customer_360

Tạo bảng trước trong PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS customer_360 (
    customer_id   VARCHAR(10)     PRIMARY KEY,
    full_name     VARCHAR(200),
    email         VARCHAR(200),
    phone         VARCHAR(20),
    ltv           DECIMAL(15,2),
    tx_count      INTEGER,
    refund_rate   DECIMAL(5,4),
    loyalty_score INTEGER,
    tier          VARCHAR(10),
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Kéo `tPostgresqlOutput` vào canvas, kết nối từ tJavaRow:

- **Host**: `context.pg_host`
- **Port**: `context.pg_port`
- **Database**: `retail_db`
- **Username**: `context.pg_user`
- **Password**: `context.pg_password`
- **Table**: `customer_360`
- **Action on table**: `None` (bảng đã được tạo thủ công hoặc lần đầu chọn `Create table if not exists`)
- **Action on data**: `Upsert` — Talend tự sinh `INSERT ... ON CONFLICT (customer_id) DO UPDATE`
- **Batch size**: `500` — commit theo batch thay vì từng row (xem phần Tối ưu hóa)

Schema mapping: map từng cột output của tJavaRow sang đúng cột trong bảng. Cột `updated_at` map từ `output_row.updated_at`.

:::note
Lần đầu chạy, đổi **Action on table** thành `Create table if not exists` để Talend tự tạo bảng theo schema. Từ lần 2 trở đi, đổi về `None` để tránh Talend drop và recreate bảng mỗi lần chạy.
:::

### tFileOutputJSON: Xuất JSON report

Kéo `tFileOutputJSON`, kết nối từ tJavaRow (thêm một output link từ cùng tJavaRow):

- **File Name**: `context.output_dir + globalMap.get("report_filename")`

:::warning
Vì `report_filename` được set trong tJavaRow và mỗi row có thể tạo ra cùng một tên (timestamp format `yyyyMMdd_HHmm`), tất cả rows trong một lần chạy sẽ ghi vào cùng một file — đây là behavior mong muốn. Nhưng nếu job chạy qua nửa đêm (timestamp thay đổi giữa chừng), sẽ có hai file. Để tránh, lấy timestamp một lần ở đầu job bằng `tSetGlobalVar` trước khi flow bắt đầu.
:::

- **Encoding**: `UTF-8`
- **JSON output**: Chọn kiểu **Array** — mỗi row là một object trong mảng JSON

Output JSON mẫu:

```json
[
  {
    "customer_id": "C001",
    "full_name": "NGUYEN VAN AN",
    "email": "an.nguyen@email.com",
    "phone": "+84912345678",
    "ltv": 12700000.0,
    "tx_count": 2,
    "refund_rate": 0.083,
    "loyalty_score": 200,
    "tier": "GOLD",
    "updated_at": "2024-04-08 14:30:00"
  },
  {
    "customer_id": "C002",
    "full_name": "TRAN THI BICH",
    "email": "bich.tran@email.com",
    "phone": "+84987654321",
    "ltv": 4100000.0,
    "tx_count": 1,
    "refund_rate": 0.375,
    "loyalty_score": 50,
    "tier": "BRONZE",
    "updated_at": "2024-04-08 14:30:00"
  }
]
```

## Xử lý lỗi toàn cục với tLogCatcher

### Đặt tLogCatcher bắt lỗi từ tất cả components

`tLogCatcher` là component đặc biệt: nó không nằm trên flow chính mà "nghe" lỗi từ tất cả components trong job. Kéo `tLogCatcher` vào một góc canvas, không cần kết nối input.

Config tLogCatcher:
- **Catch** (tích hết): `ERROR`, `WARNING`, `FATAL`
- Schema output: `moment` (Date), `pid` (String), `root_pid` (String), `father_pid` (String), `type` (String), `priority` (String), `message` (String), `code` (String)

Kết nối tLogCatcher → `tSendMail`:

- **To**: `context.alert_email`
- **Subject**: `"[TALEND ERROR] Job Customer360 failed — " + input_row.type + " in component " + input_row.father_pid`
- **Message**: Dùng tMap để ghép nội dung email:

```java
"=== Talend Job Error Report ===" + "\n"
+ "Time      : " + TalendDate.formatDate("yyyy-MM-dd HH:mm:ss", input_row.moment) + "\n"
+ "Component : " + input_row.father_pid + "\n"
+ "Type      : " + input_row.type + "\n"
+ "Priority  : " + input_row.priority + "\n"
+ "Message   : " + input_row.message + "\n"
+ "Code      : " + input_row.code
```

### tStatCatcher: Ghi metrics vào etl_logs

Tạo bảng tracking trong PostgreSQL:

```sql
CREATE TABLE IF NOT EXISTS etl_logs (
    log_id        SERIAL PRIMARY KEY,
    job_name      VARCHAR(100),
    run_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    context_name  VARCHAR(50),
    nb_lines_input    INTEGER,
    nb_lines_output   INTEGER,
    nb_lines_rejected INTEGER,
    nb_lines_deleted  INTEGER,
    nb_lines_updated  INTEGER,
    duration_ms   BIGINT,
    status        VARCHAR(20)
);
```

`tStatCatcher` schema tự động có: `moment`, `pid`, `father_pid`, `system`, `type`, `label`, `nbLineInput`, `nbLineOutput`, `nbLineReject`, `duration`.

Kết nối `tStatCatcher` → `tPostgresqlOutput` (một component riêng chỉ để write vào `etl_logs`).

:::tip
Với tStatCatcher, tích chọn **Catch at job level** để capture tổng số liệu của toàn job, không chỉ từng component. Sau mỗi lần chạy bạn sẽ có một dòng tổng kết trong bảng etl_logs.
:::

## Tối ưu hóa

### Batch size cho tPostgresqlOutput

Mặc định, Talend commit sau mỗi row. Với 10,000 customers:
- **Không có batch**: 10,000 round trips đến database → chậm
- **Batch size 500**: 20 round trips → nhanh hơn ~50x

Set **Batch size** = `500` trong tPostgresqlOutput. Nếu pipeline fail giữa chừng, chỉ mất batch cuối cùng (tối đa 499 rows chưa commit), không phải toàn bộ.

### Parallel read cho MySQL

Nếu bảng `transactions` có hơn 1 triệu rows, bật **Enable parallel execution** trong tMysqlInput. Talend chia query thành nhiều thread theo range của primary key. Cần đảm bảo `invoice_id` có index.

### Streaming mode cho Excel lớn

File Excel 50,000+ rows sẽ gây OutOfMemoryError nếu đọc toàn bộ vào memory. Trong tFileInputExcel, bật **Read Sheet in streaming mode (only for .xlsx)** — Talend dùng Apache POI streaming API, đọc từng row thay vì load toàn bộ file.

### So sánh hai cách tiếp cận API Lookup

| Tiêu chí | tFlowToIterate (row-by-row) | Bulk API (một lần) |
|---|---|---|
| Số API call | N calls (N = số customers) | 1 call |
| Latency tổng | N × latency_per_call | 1 × latency_bulk |
| Complexity code | Thấp | Cao hơn (cần tAggregateSortedRow + parse) |
| Rate limit risk | Cao — dễ bị throttle | Thấp |
| Phù hợp khi | < 500 customers, API không có bulk endpoint | > 500 customers, API hỗ trợ bulk |
| Implement | `tFlowToIterate` → `tRESTClient` | `tJavaRow` (build list) → `tRESTClient` (POST với body IDs) → `tExtractJSONFields` + `tDenormalizeSortedRow` để unnest |

**Cách implement Bulk API (tóm lược):**

1. Dùng một `tJavaRow` trước API call để thu thập tất cả customer_ids vào một List, serialize thành JSON body: `["C001","C002","C003"]`
2. Lưu vào globalMap: `globalMap.put("bulk_ids", jsonBody)`
3. `tRESTClient` gọi `POST /orders/bulk-stats` với body từ globalMap
4. Response là array JSON, dùng `tExtractJSONFields` với loop jsonpath `$[*]` để unnest
5. `tMap` join kết quả về với data chính theo `customer_id`

:::note
Nếu API bên thứ ba không hỗ trợ bulk endpoint và bạn có hàng nghìn customers, xem xét cache kết quả vào Redis hoặc database tạm — gọi API một lần mỗi ngày, tái sử dụng kết quả cho các lần chạy sau trong ngày.
:::

### Memory và JVM settings

Khi job xử lý lượng data lớn, mở `[TalendStudio]/TOS_DI-[version].ini` và tăng heap:

```bash
-Xms512m
-Xmx4g
```

Khi chạy generated code, mở `[JobExport]/[JobName]/[JobName]_run.sh` và thêm:

```bash
export JAVA_OPTS="-Xms512m -Xmx4g"
```

---

Sau khi hoàn thành pipeline, bạn có một Job Talend hoàn chỉnh xử lý dữ liệu end-to-end: từ ba nguồn khác nhau (SQL, file, API) đến một bảng PostgreSQL chuẩn hóa và một JSON report cho Marketing — với đầy đủ error handling, logging, và context variables để chạy trên nhiều môi trường.
