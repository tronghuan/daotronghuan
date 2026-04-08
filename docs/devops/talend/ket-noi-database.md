---
title: Kết nối Database
description: Kết nối Talend với MySQL - setup Docker, config tDBConnection, tDBInput, tDBOutput, xử lý credentials bằng Context Variables và error handling với rollback.
sidebar_position: 6
---

Đây là bài thực hành đầy đủ nhất trong series: đọc CSV, transform với tMap, và insert vào MySQL. Bài này cũng cover các component DB quan trọng, error handling, và best practice dùng Context Variables cho credentials.

## Tổng quan DB Components của Talend

Talend có 2 loại DB components:

**1. Generic DB components (dùng JDBC):**
- `tDBConnection` — mở kết nối
- `tDBInput` — đọc dữ liệu (SQL SELECT)
- `tDBOutput` — ghi dữ liệu (INSERT/UPDATE/UPSERT/DELETE)
- `tDBCommit` — commit transaction
- `tDBRollback` — rollback transaction
- `tDBClose` — đóng kết nối
- `tDBRow` — chạy SQL statement tùy ý (DDL, stored procedure)

**2. Database-specific components (tối ưu hơn):**
- `tMysqlConnection`, `tMysqlInput`, `tMysqlOutput`
- `tOracleConnection`, `tOracleInput`, `tOracleOutput`
- `tPostgresqlConnection`, `tPostgresqlInput`, `tPostgresqlOutput`

:::tip Nên dùng loại nào?
Database-specific components được optimize cho từng DB (ví dụ tMysqlOutput dùng bulk insert native). Nếu cần portability (switch DB dễ): dùng generic tDB. Nếu optimize performance: dùng specific. Series này dùng `tMysql*` để dễ config.
:::

## Bước 1: Setup MySQL với Docker

Docker là cách nhanh nhất để có MySQL để test mà không cần cài đặt phức tạp.

```bash
# Khởi động MySQL 8 container
docker run -d \
  --name mysql-talend \
  -e MYSQL_ROOT_PASSWORD=root123 \
  -e MYSQL_DATABASE=talend_demo \
  -e MYSQL_USER=talend \
  -e MYSQL_PASSWORD=talend123 \
  -p 3306:3306 \
  mysql:8.0

# Kiểm tra container đang chạy
docker ps
# CONTAINER ID   IMAGE       COMMAND                  STATUS
# abc123...      mysql:8.0   "docker-entrypoint.s…"   Up 30 seconds

# Kết nối vào MySQL để tạo bảng
docker exec -it mysql-talend mysql -u root -proot123 talend_demo
```

:::note MySQL trên Windows
Nếu chưa có Docker, tải MySQL Installer từ [dev.mysql.com/downloads/installer](https://dev.mysql.com/downloads/installer/). Chọn "MySQL Community Server 8.0" + "MySQL Workbench" để có GUI.
:::

## Bước 2: Tạo bảng employees

Trong MySQL client (Docker exec hoặc MySQL Workbench):

```sql title="create_table.sql"
USE talend_demo;

CREATE TABLE IF NOT EXISTS employees (
  id           INT           NOT NULL,
  name         VARCHAR(100)  NOT NULL,
  department   VARCHAR(50),
  salary       DECIMAL(15,2),
  salary_usd   DECIMAL(10,4),
  imported_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Verify
DESCRIBE employees;
SELECT COUNT(*) FROM employees;
```

## Bước 3: Setup Context Variables

Trước khi xây dựng Job, tạo Context Group để quản lý credentials.

**Tạo Context Group trong Repository:**

1. Repository → Context → chuột phải → "Create context group"
2. Name: `MySQLContext`
3. Thêm các variables:

| Variable | Type | Default Value | Comment |
|---|---|---|---|
| `db_host` | String | `localhost` | DB server hostname |
| `db_port` | Integer | `3306` | MySQL port |
| `db_name` | String | `talend_demo` | Database name |
| `db_user` | String | `talend` | DB username |
| `db_password` | String | `talend123` | DB password (để trống trên production) |
| `input_file` | String | `C:/data/employees.csv` | Input CSV path |
| `reject_file` | String | `C:/data/rejected_rows.csv` | Reject output path |

**Tạo thêm context cho environment khác (optional):**

Trong context group, có thể thêm multiple "context" (environments):
- `Default` — dùng cho local dev
- `Production` — override với prod credentials

Khi chạy Job, chọn context nào để dùng, hoặc override qua command line.

## Bước 4: Xây dựng Job hoàn chỉnh

### Thiết kế pipeline

```
tFileInputDelimited ──Main──► tMap ──out1──► tMysqlOutput ──OnSubjobOk──► tMysqlCommit
     (employees.csv)          (transform)        │                              │
                                            reject/OnError                 tMysqlClose
                                                 │
                                          tFileOutputDelimited (rejected_rows.csv)
                                                 │
                                          OnSubjobError
                                                 │
                                          tMysqlRollback ──OnSubjobOk──► tDie
```

### Thêm và config các component

**1. tMysqlConnection** (đặt đầu pipeline, trước tất cả):

Kéo `tMysqlConnection` vào canvas. Config:

| Field | Giá trị |
|---|---|
| **Host** | `context.db_host` |
| **Port** | `context.db_port` |
| **Database** | `context.db_name` |
| **Username** | `context.db_user` |
| **Password** | `context.db_password` |
| **Additional JDBC Parameters** | `useSSL=false&serverTimezone=UTC` |

Tick **"Use an existing connection"** nếu muốn share connection với các component khác trong cùng Job.

:::warning JDBC Driver cho MySQL
Lần đầu dùng MySQL trong Talend, bạn cần cài JDBC driver. Vào **Window → Preferences → Talend → Modules** và install `mysql-connector-java`. Hoặc khi config tMysqlConnection, nếu driver chưa có, Talend sẽ hỏi và offer download tự động.
:::

**2. tFileInputDelimited** (inputEmployees):

```
File Name:       context.input_file
Field Separator: ","
Header:          1
Schema:
  id           Integer
  name         String (100)
  department   String (50)
  salary       Integer
```

**3. tMap** (mapTransform):

Kết nối `inputEmployees` → Main → `mapTransform`.

Trong tMap editor, output `out1`:

```
id           : Integer  → row1.id
name         : String   → row1.name
department   : String   → row1.department
salary       : Double   → (double) row1.salary
salary_usd   : Double   → row1.salary / 25000.0
imported_at  : Date     → TalendDate.getCurrentDate()
```

Output `reject1` (type Reject) để bắt rows có vấn đề — map tương tự out1.

**4. tMysqlOutput** (outputToDB):

Kết nối `mapTransform.out1` → `outputToDB`. Config:

| Field | Giá trị | Giải thích |
|---|---|---|
| **Use an existing connection** | tick | Dùng tMysqlConnection đã tạo |
| **Component List** | `tMysqlConnection_1` | Chọn connection component |
| **Table** | `"employees"` | Tên bảng |
| **Action on table** | `None` | Không drop/create bảng khi chạy |
| **Action on data** | `Insert` | Chỉ insert (thay đổi thành Upsert nếu cần) |
| **Commit every** | `1000` | Commit sau mỗi 1000 rows |
| **Catch output reject** | tick | Bắt rows bị lỗi DB |
| **Die on error** | bỏ tick | Không crash toàn job khi 1 row lỗi |

**Action on data — bảng so sánh:**

| Action | SQL tương đương | Khi nào dùng |
|---|---|---|
| `Insert` | `INSERT INTO` | Data mới hoàn toàn, sẽ lỗi nếu duplicate key |
| `Update` | `UPDATE ... WHERE` | Chỉ update rows đã tồn tại |
| `Insert or update` | `INSERT ... ON DUPLICATE KEY UPDATE` | Upsert: insert nếu mới, update nếu đã có |
| `Delete` | `DELETE WHERE` | Xóa rows match |
| `Insert ignore` | `INSERT IGNORE` | Insert, bỏ qua nếu duplicate (không lỗi) |

**Action on table — bảng so sánh:**

| Action | Hành vi | Cẩn thận |
|---|---|---|
| `None` | Giữ nguyên bảng, chỉ insert data | Safe nhất |
| `Truncate` | Xóa sạch data trước khi insert | Mất data cũ |
| `Drop table if exists and create` | Drop + recreate schema + insert | Mất data VÀ mất custom indexes |
| `Create table if not exists` | Tạo bảng nếu chưa có | Safe, không ảnh hưởng nếu đã có |

:::warning Action on table trong production
KHÔNG bao giờ dùng `Drop table if exists and create` trên production table. Chỉ dùng `None` hoặc `Truncate` (nếu là staging table).
:::

**5. tFileOutputDelimited** (outputReject):

Kết nối `tMysqlOutput.reject` → `outputReject`. Config:

```
File Name:        context.reject_file
Field Separator:  ","
Include Header:   tick
Append:           tick  ← append để không mất reject từ lần chạy trước
```

**6. tMysqlCommit** (commitSuccess):

Kết nối trigger: `tMysqlOutput` → **OnSubjobOk** → `tMysqlCommit`. Config:
- Use an existing connection: tick
- Component List: `tMysqlConnection_1`

**7. tMysqlClose** (closeConn):

Kết nối sau commit: `tMysqlCommit` → **OnSubjobOk** → `tMysqlClose`. Config tương tự.

**8. Error handling chain:**

```
tMysqlOutput (hoặc tMap) → OnSubjobError → tMysqlRollback → OnSubjobOk → tDie
```

Config `tMysqlRollback`:
- Use an existing connection: tick
- Component List: `tMysqlConnection_1`

Config `tDie`:
- Message: `"Job failed: Database error, rollback executed. Check rejected rows file."`

### Sơ đồ Trigger connections hoàn chỉnh

```
[tMysqlConnection_1] ──OnSubjobOk──►
[tFileInputDelimited] ──Main──► [tMap] ──out1──► [tMysqlOutput]
                                        └──reject──► [tFileOutputDelimited]

[tMysqlOutput] ──OnSubjobOk──► [tMysqlCommit] ──OnSubjobOk──► [tMysqlClose]
[tMysqlOutput] ──OnSubjobError──► [tMysqlRollback] ──OnSubjobOk──► [tDie]
```

:::note Trigger ordering
Trong Talend, các subjob chạy từ trái sang phải, từ trên xuống dưới trên canvas. Dùng triggers để đảm bảo thứ tự đúng. tMysqlConnection phải chạy TRƯỚC tất cả các DB components khác.
:::

## Bước 5: Chạy và verify

**Chạy Job (F6):**

Output console thành công:

```
Starting job ImportEmployeesToDB at 15:30:01.
[INFO] Opening connection to localhost:3306/talend_demo
[INFO] tMysqlOutput_1: 8 row(s) inserted
[INFO] Commit executed
[INFO] Connection closed
Job ImportEmployeesToDB ended at 15:30:02. [exit code=0]
```

**Verify trong MySQL:**

```sql
SELECT * FROM talend_demo.employees ORDER BY id;

-- Kết quả:
-- id | name         | department | salary      | salary_usd | imported_at
--  1 | Nguyen Van A | IT         | 15000000.00 | 600.0000   | 2024-03-15 15:30:01
--  2 | Tran Thi B   | Sales      | 12000000.00 | 480.0000   | 2024-03-15 15:30:01
-- ...

SELECT COUNT(*) FROM employees;
-- 8 rows (nếu chạy lần đầu)
-- Lỗi duplicate key nếu chạy lần 2 với Action = Insert → đổi sang Insert or update
```

## Override Context Variables từ command line

Talend generate sẵn shell script để chạy Job. Tìm trong:
`[workspace]/[project]/[JobName]/[JobName]_run.sh` (macOS/Linux)  
`[workspace]/[project]/[JobName]/[JobName]_run.bat` (Windows)

```bash title="Chạy với production credentials"
# macOS/Linux
./ImportEmployeesToDB/ImportEmployeesToDB_run.sh \
  --context MySQLContext \
  --context_param db_host=prod-mysql.internal \
  --context_param db_user=prod_user \
  --context_param db_password=ProdSecretXyz \
  --context_param input_file=/data/prod/employees.csv

# Windows
ImportEmployeesToDB_run.bat ^
  --context MySQLContext ^
  --context_param db_host=prod-mysql.internal ^
  --context_param db_password=ProdSecretXyz
```

## Tóm tắt best practices cho DB Jobs

| Practice | Lý do |
|---|---|
| Luôn dùng Context Variables cho credentials | Không commit password lên Git |
| Dùng `tMysqlConnection` riêng biệt | Share connection giữa nhiều tDBInput/Output trong cùng Job |
| Bắt reject với `Catch output reject` | Tránh Job crash vì 1 row duplicate key |
| Dùng `tMysqlRollback` trong error handler | Đảm bảo data consistency khi có lỗi giữa chừng |
| Commit every 1000-10000 rows | Balance giữa performance và memory |
| Tránh `Drop table` trên production | Không bao giờ mất data ngoài ý muốn |
| Test với `Truncate` + small dataset trước | Verify schema và transform đúng trước khi prod run |

Bạn đã hoàn thành series Talend ETL cơ bản. Tổng kết những gì đã học:

- Cài đặt Java JDK 17 và Talend Open Studio
- Hiểu 4 panel UI và 4 core concepts (Job, Component, Row, Metadata)
- Xây dựng pipeline đọc CSV, transform với tMap, ghi ra file
- Join 2 nguồn dữ liệu, xử lý null, reject flow
- Kết nối MySQL, insert data, error handling với rollback
- Dùng Context Variables để quản lý credentials

Bước tiếp theo gợi ý: thử dùng `tFileList` để xử lý nhiều file CSV cùng lúc, hoặc thêm `tMysqlInput` để đọc data từ DB rồi ghi ra Excel với `tFileOutputExcel`.
