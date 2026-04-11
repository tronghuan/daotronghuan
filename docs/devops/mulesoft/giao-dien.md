---
title: Làm quen với Anypoint Studio
description: Hướng dẫn các panel quan trọng trong Anypoint Studio — Canvas, Palette, Properties, Console và cấu trúc project Mule 4.
sidebar_position: 3
---

## Tổng quan giao diện

Anypoint Studio được xây dựng trên nền Eclipse. Lần đầu mở có thể trông phức tạp, nhưng thực ra chỉ có 5 khu vực cần nắm:

```
┌──────────────────────────────────────────────────────────────────┐
│  Menu Bar: File | Edit | Run | Window | Help                     │
├────────────────┬───────────────────────────┬─────────────────────┤
│ Package        │                           │                     │
│ Explorer       │       CANVAS              │  Mule Palette       │
│ (project tree) │   (thiết kế flow bằng    │  (kéo thả           │
│                │    kéo thả component)     │   connectors)       │
│  [hello-mule]  │                           │                     │
│  ├─ src/       │  ┌──────────┐             │  ▶ HTTP             │
│  │  ├─ mule/   │  │ Listener │──►│Set│──► │  ▶ Database         │
│  │  └─ res/    │  └──────────┘   Payload   │  ▶ Salesforce       │
│  └─ pom.xml    │                           │  ▶ File             │
├────────────────┴───────────────────────────┴─────────────────────┤
│ Properties Panel (cấu hình component đang chọn)                  │
│  General | Advanced | Error Mapping                              │
│  Path: /api/hello    Method: GET    Allowed Methods: GET,POST    │
├──────────────────────────────────────────────────────────────────┤
│ Console (log khi chạy app)                                       │
│  INFO  ... Mule is up and kicking (listening on: http://...3000) │
└──────────────────────────────────────────────────────────────────┘
```

---

## Package Explorer — Cây thư mục project

Panel bên trái hiển thị cấu trúc project. Click vào mũi tên để mở rộng:

```
hello-mule/
├── src/
│   ├── main/
│   │   ├── mule/                    ← File flow chính (.xml)
│   │   │   └── hello-mule.xml
│   │   └── resources/               ← Config, properties files
│   │       ├── application.properties
│   │       └── log4j2.xml
│   └── test/
│       └── munit/                   ← Unit test (MUnit)
├── pom.xml                          ← Maven dependencies
└── mule-artifact.json               ← Metadata, secure properties list
```

**Quan trọng nhất:**
- `src/main/mule/*.xml` — nơi bạn thiết kế flow
- `src/main/resources/application.properties` — cấu hình (host, port, credentials)
- `pom.xml` — thêm connector dependencies ở đây

---

## Canvas — Nơi thiết kế flow

Canvas là khu vực trung tâm, nơi bạn kéo thả component để tạo flow. Mỗi flow được hiển thị như một pipeline ngang:

```
[Event Source] ──► [Processor 1] ──► [Processor 2] ──► [Processor N]
```

### Chế độ xem Canvas

Góc dưới Canvas có 3 tab:

| Tab | Hiển thị |
|:---|:---|
| **Message Flow** | Giao diện kéo thả trực quan |
| **Global Elements** | Danh sách config dùng chung (HTTP Config, DB Config...) |
| **Configuration XML** | XML source của toàn bộ flow |

:::tip Xem XML khi bị lỗi
Khi Studio báo lỗi nhưng không rõ nguyên nhân, chuyển sang tab **Configuration XML** để xem và sửa trực tiếp.
:::

### Thao tác cơ bản trên Canvas

| Thao tác | Cách làm |
|:---|:---|
| Thêm component | Kéo từ Palette vào Canvas |
| Xóa component | Click chọn → Delete |
| Di chuyển | Kéo thả trong flow |
| Xem properties | Click vào component |
| Zoom in/out | Ctrl + scroll hoặc nút zoom góc phải |
| Fit to screen | Ctrl + Shift + F |

---

## Mule Palette — Thư viện connectors

Panel bên phải chứa tất cả connectors và components. Có thể tìm kiếm bằng ô Search phía trên.

### Các nhóm chính

| Nhóm | Connectors tiêu biểu |
|:---|:---|
| **HTTP** | Listener, Request |
| **Core** | Set Payload, Set Variable, Logger, Transform Message, Choice, Foreach, Try... |
| **Database** | Select, Insert, Update, Delete, Bulk Insert |
| **File** | Read, Write, List, On New File |
| **Salesforce** | Query, Create, Upsert, Publish Platform Event |
| **Anypoint MQ** | Publish, Subscriber |
| **Validation** | Is Not Null, Is Number, Is Email... |

### Thêm connector chưa có trong Palette

Một số connectors cần thêm vào project qua Exchange:

1. Click **Search in Exchange** ở cuối Palette
2. Tìm connector (ví dụ: "SAP")
3. Click **Add to project**
4. Maven tự động download và thêm vào `pom.xml`

---

## Properties Panel — Cấu hình component

Click vào bất kỳ component nào trên Canvas, Properties Panel phía dưới sẽ hiển thị các tab cấu hình. Ví dụ với **HTTP Listener**:

### Tab General
- **Connector configuration**: chọn hoặc tạo HTTP Listener Config (host, port)
- **Path**: URL path (ví dụ: `/api/orders`)
- **Allowed Methods**: GET, POST, PUT, DELETE...

### Tab Advanced
- **Mime Type**: Content-Type của response
- **Encoding**: UTF-8
- **Output MIME Type**: format payload sau component này

### Tab Error Mapping
- Map error type sang custom error type
- Dùng khi muốn override error handling mặc định

---

## Global Elements — Cấu hình dùng chung

Tab **Global Elements** ở dưới Canvas chứa các configuration object dùng chung giữa nhiều flow:

```
HTTP_Listener_config    → Dùng cho mọi HTTP Listener trong app
Database_Config         → Connection string đến DB
Salesforce_Config       → Credentials Salesforce
HTTP_Request_config     → Base URL cho HTTP outbound
```

### Tạo Global Element

1. Click tab **Global Elements**
2. Click **Create...**
3. Chọn loại (HTTP Listener, Database Connection...)
4. Điền cấu hình
5. Click **OK**

Sau đó, khi thêm HTTP Listener vào flow, chọn config này trong dropdown **Connector configuration**.

---

## Console — Log khi chạy

Panel Console phía dưới hiển thị log khi bạn chạy Mule app. Các mức log:

| Level | Màu | Ý nghĩa |
|:---|:---|:---|
| `INFO` | Trắng | Thông tin bình thường (startup, shutdown) |
| `DEBUG` | Xám | Chi tiết debug (chỉ bật khi cần) |
| `WARN` | Vàng | Cảnh báo không nghiêm trọng |
| `ERROR` | Đỏ | Lỗi cần xử lý |

### Log quan trọng khi startup

```
INFO  2024-01-15 08:30:00 ... MuleDeploymentService: ++ New app: hello-mule
INFO  2024-01-15 08:30:02 ... ApplicationStartedSplashScreen:
*************************************************************
* Mule is up and kicking (listening on: http://0.0.0.0:8081) *
*************************************************************
```

Khi thấy dòng **"Mule is up and kicking"** — app đang chạy thành công.

---

## Cấu trúc project chi tiết

### pom.xml — Maven dependencies

```xml title="pom.xml (rút gọn)"
<dependencies>
  <!-- Runtime Mule 4 -->
  <dependency>
    <groupId>org.mule.connectors</groupId>
    <artifactId>mule-http-connector</artifactId>
    <version>1.9.x</version>
    <classifier>mule-plugin</classifier>
  </dependency>

  <!-- Thêm Database connector -->
  <dependency>
    <groupId>org.mule.connectors</groupId>
    <artifactId>mule-db-connector</artifactId>
    <version>1.14.x</version>
    <classifier>mule-plugin</classifier>
  </dependency>
</dependencies>
```

### application.properties — Cấu hình môi trường

```properties title="src/main/resources/application.properties"
# HTTP Server
http.port=8081
http.host=0.0.0.0

# Database
db.host=localhost
db.port=3306
db.name=mydb
db.user=root
# db.password → đặt trong secure properties (không để cleartext ở đây)
```

### mule-artifact.json — Metadata

```json title="mule-artifact.json"
{
  "minMuleVersion": "4.6.0",
  "secureProperties": ["db.password", "api.secret"]
}
```

`secureProperties` khai báo các property được mã hóa — Anypoint Runtime Manager sẽ ẩn giá trị này trong dashboard.

---

## Chạy và debug project

### Chạy bình thường

1. Click chuột phải vào project trong Package Explorer
2. **Run As** → **Mule Application**
3. Hoặc click nút ▶ trên toolbar

### Debug mode

1. Thêm breakpoint: click chuột phải vào component → **Toggle Breakpoint**
2. Click nút 🐛 (Debug) thay vì ▶ (Run)
3. Khi flow chạy đến breakpoint, Studio dừng lại → xem payload và variables trong Debug panel

### Stop app

Click nút ■ (Stop) trên toolbar hoặc trong panel Console.

---

:::tip Bước tiếp theo
Bây giờ bạn đã biết cách dùng Studio, hãy tạo [flow đầu tiên — Hello World API](../flow-dau-tien) để hiểu cách Mule xử lý request thực tế.
:::
