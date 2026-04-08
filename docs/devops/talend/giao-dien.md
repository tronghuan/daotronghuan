---
title: Giao diện và Core Concepts
description: Làm quen với 4 panel chính của Talend Open Studio, hiểu Job, Component, Row, Metadata, các loại connection và Context Variables.
sidebar_position: 3
---

Talend Open Studio dùng Eclipse IDE làm nền tảng giao diện, nên nếu bạn đã quen IntelliJ hay VS Code thì ban đầu sẽ hơi lạ. Bài này giúp bạn định hướng nhanh trong UI và nắm chắc các khái niệm cốt lõi trước khi bắt tay vào code.

## Sơ đồ tổng quan UI

```
┌─────────────────────────────────────────────────────────────────┐
│  Menu Bar: File | Edit | View | Run | Window | Help              │
├──────────────┬──────────────────────────────┬────────────────────┤
│              │                              │                    │
│  REPOSITORY  │      JOB DESIGNER            │     PALETTE        │
│  (panel trái)│      (canvas chính)          │   (panel phải)     │
│              │                              │                    │
│  ▼ Job Design│  ┌──────────┐   ┌────────┐  │  Search...         │
│    ▼ process │  │tFileInput│──►│tLogRow │  │                    │
│      Job1    │  └──────────┘   └────────┘  │  ▼ File            │
│  ▼ Metadata  │                              │    tFileInputDelim │
│    ▼ DB Conn │                              │    tFileOutputDeli │
│      mysql   │                              │    tFileCopy       │
│  ▼ Context   │                              │  ▼ Database        │
│              │                              │    tDBConnection   │
├──────────────┴──────────────────────────────┴────────────────────┤
│                        RUN CONSOLE                               │
│  [Component] [Run] [Advanced settings] [Stats & Logs]            │
│                                                                  │
│  Starting job Job1 at 14:35:01.                                  │
│  [statistics] connected_component_info                           │
│  row1.id=1 | row1.name=Nguyen Van A | row1.department=IT         │
│  Job Job1 ended at 14:35:02. [exit code=0]                       │
└──────────────────────────────────────────────────────────────────┘
```

## 4 Panel chính

### Repository (trái)

Repository là "project explorer" — nơi lưu trữ và tổ chức tất cả tài nguyên của project:

```
Repository
├── Job Designs          ← Nơi tạo và tổ chức Jobs
│   ├── process/         ← Folder mặc định, bạn tạo thêm subfolders
│   └── ...
├── Metadata             ← Schema và connection đã định nghĩa sẵn
│   ├── DB Connections   ← JDBC connections (MySQL, Oracle, PostgreSQL...)
│   ├── File delimited   ← Schema cho file CSV/TXT
│   ├── File Excel       ← Schema cho Excel
│   └── ...
├── Context              ← Context Variable Groups (thay thế hardcode)
├── Code                 ← Custom routines (Java utility functions)
└── Documentation        ← Auto-generated job documentation
```

**Cách dùng:** Khi bạn định nghĩa một DB Connection trong Metadata, bạn có thể reuse nó ở nhiều Job khác nhau. Nếu password thay đổi, chỉ cần update 1 chỗ trong Metadata.

### Job Designer (giữa)

Đây là canvas chính — nơi bạn thiết kế pipeline bằng cách kéo thả component và nối chúng lại. Mỗi tab là một Job đang mở.

**Thao tác cơ bản:**
- **Drag từ Palette** vào canvas để thêm component
- **Click chuột phải vào component** → Row → Main → click component tiếp theo để nối
- **Double-click component** để mở config
- **Ctrl+Z / Ctrl+Y** để undo/redo
- **Ctrl+Shift+F** để auto-format layout (sắp xếp component gọn gàng)
- **Scroll wheel** để zoom in/out canvas

### Palette (phải)

Kho chứa tất cả ~900 component của Talend, được phân nhóm theo chức năng.

**Cách tìm component:**
- Gõ tên vào ô Search ở đầu palette (nhanh nhất)
- Ví dụ: gõ `mysql` sẽ lọc ra tất cả MySQL components
- Gõ `map` sẽ ra `tMap`, `tHashJoin`, `tCartesian`...

**Các nhóm component quan trọng:**
- `File` — xử lý file flat (CSV, Excel, XML, JSON)
- `Database` — kết nối DB (tDBConnection, tDBInput, tDBOutput...)
- `Processing` — transform data (tMap, tFilter, tAggregateRow, tSortRow...)
- `Logs & Errors` — xử lý lỗi (tLogRow, tDie, tWarn...)
- `Orchestration` — điều phối flow (tRunJob, tLoop, tIterateToFlow...)
- `Internet` — HTTP calls, FTP, email

### Run Console (dưới)

Khi bạn chạy Job, output hiển thị ở đây. Console có nhiều tab:

- **Run** — Nút Run (F6), Stop, bật chế độ debug
- **Component** — Output log của từng component
- **Advanced settings** — JVM args, statistics interval
- **Stats & Logs** — Thống kê số row processed, thời gian chạy

## Core Concepts

### Job

**Job là gì:** Một Job = một pipeline ETL hoàn chỉnh. Tương tự một file Python script hay một Workflow trong các tool khác. Khi bạn "Run" một Job, Talend:

1. Generate Java source code từ visual design
2. Compile code đó
3. Chạy compiled Java bytecode

Generated code nằm tại: `[workspace]/[project]/.Java/src/[job_name]/`

**Ví dụ thực tế:** Job `ImportEmployees` đọc file CSV, validate dữ liệu, insert vào MySQL. Job `ExportReports` query MySQL, transform, ghi ra Excel.

### Component

**Component là gì:** Mỗi ô hình chữ nhật trên canvas là một Component — một đơn vị xử lý cụ thể. Component có thể là:
- **Input**: tFileInputDelimited, tDBInput, tSalesforceInput
- **Transform**: tMap, tFilter, tAggregateRow, tSortRow
- **Output**: tFileOutputDelimited, tDBOutput, tLogRow
- **Routing**: tRouter, tReplicate
- **Orchestration**: tRunJob, tLoop

Mỗi component có:
- **Basic settings** — config cơ bản (file path, delimiter, schema...)
- **Advanced settings** — config nâng cao (encoding, buffer size, null handling...)
- **Dynamic settings** — override config bằng expression/variable
- **View** — hiển thị/ẩn component trên canvas

### Row (Connection / Link)

**Row là gì:** Đường kết nối giữa các component — đây là "luồng dữ liệu" di chuyển từ component này sang component khác.

Khi bạn vẽ một Row từ A → B, mỗi record được xử lý ở A sẽ được truyền sang B. Đây là **streaming model** — data không được buffer toàn bộ vào RAM mà chạy theo luồng.

**Các loại Row connections:**

| Loại | Màu | Mục đích |
|---|---|---|
| **Main** | Xanh dương | Luồng dữ liệu chính — hầu hết dùng loại này |
| **Lookup** | Xanh lá | Input phụ cho tMap (join data, chỉ load 1 lần) |
| **Reject** | Đỏ | Rows bị lỗi validation (từ tMap, tDBOutput...) |
| **Filter** | Cam | Output có điều kiện (từ tRouter) |
| **Iterate** | Tím nhạt | Lặp qua collection (từ tFileList, tLoop) |

### Metadata

**Metadata là gì:** Schema được định nghĩa sẵn và tái sử dụng ở nhiều chỗ. Thay vì định nghĩa columns (id, name, salary...) mỗi lần dùng một component mới, bạn định nghĩa 1 lần trong Repository → Metadata, rồi "Apply metadata" vào component.

**Lợi ích thực tế:**
- Thay đổi 1 chỗ, tất cả component dùng metadata đó được update
- Đảm bảo consistency của column types
- Reuse DB Connection credentials

**Cách tạo metadata:**
1. Repository → chuột phải "File delimited" → "Create file delimited"
2. Đặt tên, chọn file path, configure delimiter
3. Talend tự đọc header và gợi ý columns
4. Save → drag metadata vào Job Designer → Talend tự config component

## Các loại Trigger connections

Ngoài Row (data flow), còn có **Trigger** — điều phối thứ tự thực hiện giữa các sub-job.

```
┌─────────────┐  OnSubjobOk  ┌─────────────┐
│  Subjob A   │ ──────────►  │  Subjob B   │
└─────────────┘              └─────────────┘
     │
     │ OnSubjobError
     ▼
┌─────────────┐
│  tDie       │  ← kết thúc job với exit code != 0
└─────────────┘
```

| Trigger | Khi nào kích hoạt |
|---|---|
| **OnSubjobOk** | Khi subjob trước chạy thành công (exit code = 0) |
| **OnSubjobError** | Khi subjob trước bị lỗi |
| **OnComponentOk** | Khi component cụ thể chạy xong thành công |
| **OnComponentError** | Khi component cụ thể bị lỗi |
| **RunIf** | Chạy khi điều kiện Java expression = true |
| **OnChange** | Chạy khi giá trị của field thay đổi (dùng với tSortRow) |

**Ví dụ error handling:**

```
tFileInputDelimited ──Main──► tDBOutput
                                  │ OnSubjobError
                                  ▼
                              tDBRollback ──OnSubjobOk──► tDie
```

## Context Variables

Context Variables là cơ chế thay thế hardcode — tương tự environment variables. Thay vì viết `password = "abc123"` trực tiếp vào component, bạn dùng `context.db_password`.

**Tại sao cần Context Variables:**
- Không commit password lên Git
- Dễ switch giữa môi trường dev/staging/production
- Override từ command line khi deploy

**Cách tạo:**

1. Repository → Context → chuột phải → "Create context group"
2. Đặt tên: `DatabaseContext`
3. Thêm variables:

```
Tên variable       | Type    | Default value
db_host            | String  | localhost
db_port            | Integer | 3306
db_name            | String  | talend_demo
db_user            | String  | root
db_password        | String  | (để trống, điền khi chạy)
input_folder       | String  | C:/data/input/
output_folder      | String  | C:/data/output/
```

**Dùng trong component:**

Trong bất kỳ field nào của component, thay vì hardcode:
```
localhost   →   context.db_host
3306        →   context.db_port
root        →   context.db_user
C:/data/    →   context.input_folder
```

**Override khi chạy từ command line:**

```bash
# TOS generate ra script để chạy job
./[JobName]/[JobName]_run.sh \
  --context_param db_host=prod-server.example.com \
  --context_param db_password=SecretProd123 \
  --context_param input_folder=/data/prod/input/
```

:::tip Best practice
Luôn dùng Context Variables cho: paths, credentials, environment-specific config. Chỉ hardcode những thứ thực sự không thay đổi như delimiter character hay encoding.
:::

## Tìm Component nhanh trong Palette

Palette có ~900 component — đừng scroll tìm, hãy search:

| Bạn cần làm | Gõ vào search |
|---|---|
| Đọc file CSV | `fileinput` hoặc `delimited` |
| Ghi file CSV | `fileoutput` |
| Đọc từ MySQL | `mysqlinput` hoặc `dbinput` |
| Join / transform | `map` |
| Lọc rows | `filter` |
| Sắp xếp | `sort` |
| Aggregate / group by | `aggregate` |
| Log ra console | `logrow` |
| Chạy job khác | `runjob` |
| Copy file | `filecopy` |
| List files trong folder | `filelist` |

:::note Naming convention của component
Mọi component Talend đều bắt đầu bằng chữ `t` (viết tắt của "Talend"): `tMap`, `tDBConnection`, `tFileInputDelimited`, `tSalesforceInput`... Khi search, gõ thẳng tên đầy đủ hoặc bỏ chữ `t` đầu đều được.
:::

## Component naming trong canvas

Khi bạn thêm cùng loại component nhiều lần (ví dụ 2 `tMap`), Talend tự đặt tên `tMap_1`, `tMap_2`. Đổi tên cho có nghĩa hơn bằng cách:

1. Click vào component
2. Trong tab **Component** ở panel dưới → **Component Name** → sửa tên
3. Hoặc slow double-click vào tên component trên canvas

Đặt tên có nghĩa giúp code generated dễ đọc và log dễ trace hơn rất nhiều:

```
tMap_1      →  mapFilterAndTransform
tDBOutput_1 →  outputToEmployeeTable
tLogRow_1   →  logRejectedRows
```

Bạn đã nắm đủ nền tảng về giao diện và khái niệm. Bài tiếp theo sẽ xây dựng Job đầu tiên thực sự: đọc CSV, filter, transform và ghi ra file mới — [Job đầu tiên](./job-dau-tien.md).
