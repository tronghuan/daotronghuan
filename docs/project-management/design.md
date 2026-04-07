---
title: Quy trình 基本設計 (Thiết kế cơ bản)
description: Hướng dẫn chi tiết quy trình 基本設計 trong dự án IT — từ thiết kế màn hình, thiết kế chức năng đến thiết kế dữ liệu, kèm ví dụ thực tế.
sidebar_position: 2
---

**基本設計 (Kihon Sekkei)** — hay còn gọi là **Thiết kế cơ bản** — là giai đoạn chuyển hóa yêu cầu nghiệp vụ từ 要件定義 thành các đặc tả hệ thống cụ thể mà cả Business side lẫn Engineering side đều hiểu được.

Bài viết này tổng hợp kinh nghiệm thực tế trong việc thực hiện 基本設計 cho các dự án phát triển hệ thống quy mô 10–20 người.

:::note Lưu ý
Nội dung dưới đây là **một ví dụ điển hình**, không phải quy trình cứng nhắc duy nhất. Mỗi dự án và đội nhóm có thể điều chỉnh cho phù hợp.
:::

## 基本設計 là gì?

### Phân biệt 基本設計 và 詳細設計

Trong quy trình phát triển phần mềm tại Nhật, hai giai đoạn thiết kế này thường bị nhầm lẫn:

| | 基本設計 (外部設計) | 詳細設計 (内部設計) |
|---|---|---|
| **Mục tiêu** | Làm rõ hệ thống **trông như thế nào** với người dùng | Làm rõ hệ thống **hoạt động như thế nào** bên trong |
| **Đối tượng** | Business side + Engineering side cùng đọc | Engineering side (developer, tester) |
| **Góc nhìn** | Từ ngoài nhìn vào (外部 = bên ngoài) | Từ trong nhìn ra (内部 = bên trong) |
| **Thời điểm** | Sau 要件定義, trước 詳細設計 | Sau 基本設計, trước Coding |

**Thành phẩm điển hình của 基本設計:**
- システム構成図 (Sơ đồ cấu trúc hệ thống)
- 機能一覧 (Danh sách chức năng)
- 画面一覧 (Danh sách màn hình)
- 画面遷移図 (Sơ đồ luồng màn hình)
- データフロー図 (Sơ đồ luồng dữ liệu)
- APIドキュメント

**Thành phẩm điển hình của 詳細設計:**
- クラス図 (Class diagram)
- シーケンス図 (Sequence diagram)
- 状態遷移図 (State transition diagram)
- データベース物理設計書 (Thiết kế vật lý database)
- バッチ処理詳細定義 (Đặc tả xử lý batch)

### Tại sao cần làm 基本設計?

Nhiều dự án thất bại vì Business side đưa 要件定義 xong rồi "giao hết cho engineering". Đây là nguồn gốc của phần lớn 手戻り (rework) tốn kém.

基本設計 giải quyết 3 vấn đề cốt lõi:

1. **要件の落とし込み** — Dịch ngôn ngữ nghiệp vụ thành ngôn ngữ kỹ thuật
2. **仕様の共有と確認** — Phát hiện mâu thuẫn và thiếu sót trước khi code
3. **技術的実現可能性の確認** — Xác nhận những gì Business muốn là khả thi về mặt kỹ thuật

:::warning Dấu hiệu dự án có vấn đề
Nếu Business side nói: *"要件定義で欲しい機能は決めたから、あとはエンジニアに頼んだ！"* (Tôi đã quyết định xong tính năng cần, còn lại nhờ engineer lo) — đây là dấu hiệu cảnh báo. 基本設計 phải là quá trình **cộng tác**, không phải bàn giao một chiều.
:::

---

## Ví dụ thực tế: Hệ thống quản lý tài liệu nội bộ

Toàn bộ hướng dẫn dưới đây dựa trên một 要件定義 thực tế — hệ thống DX hóa tài liệu nội bộ cho doanh nghiệp.

### 要件一覧 (Requirements List) — Phase 1

Dự án đã xác định được 10 yêu cầu, nhưng trong Phase 1 chỉ tập trung vào 5 yêu cầu có 優先度 (độ ưu tiên) cao và trung:

| No | カテゴリー | 優先度 | 要求内容 |
|:---|:---|:---|:---|
| 1 | 資料のDX化 | 高 | Số hóa tài liệu — tạo, sắp xếp, tìm kiếm hiệu quả |
| 2 | ナレッジ共有 | 中 | Lưu trữ tài liệu dưới dạng có thể chia sẻ |
| 4 | 検索機能 | 高 | Tìm kiếm tài liệu nhanh và chính xác |
| 5 | 資料整理の自動化 | 高 | Tự động phân loại, sắp xếp tài liệu |
| 8 | ナレッジ共有の促進 | 中 | Tính năng tạo và chia sẻ 知識記事 nội bộ |

---

## 1. 画面設計 (Thiết kế màn hình)

画面設計 là bước đầu tiên và quan trọng nhất — vì đây là thứ Business side nhìn thấy và phản hồi trực tiếp.

### Quy trình 画面設計

```
① オブジェクトの洗い出し   → Xác định các đối tượng dữ liệu
② ユーザータスクの洗い出し → Xác định việc người dùng cần làm
③ 必要な画面の洗い出し     → Liệt kê màn hình cần có
④ 画面遷移図の作成         → Vẽ sơ đồ luồng màn hình
⑤ ワイヤーフレームの作成   → Phác thảo bố cục từng màn hình
```

### ① オブジェクトの洗い出し (Xác định đối tượng)

Đọc 要件一覧 và xác định **danh từ chính** — đây là các オブジェクト (object/entity) sẽ tồn tại trong hệ thống.

Với hệ thống quản lý tài liệu:

| オブジェクト | Thuộc tính chính | Liên quan đến yêu cầu |
|:---|:---|:---|
| **資料 (Document)** | タイトル、作成者、作成日、バージョン、カテゴリ、タグ、内容、ステータス | No. 1, 4, 5 |
| **ユーザー (User)** | ID、氏名、役職、所属部署、メールアドレス | Toàn hệ thống |
| **ナレッジ記事 (Knowledge Article)** | タイトル、作成者、カテゴリ、タグ、内容 | No. 2, 8 |
| **バージョン (Version)** | バージョン番号、作成日、変更内容、変更者 | No. 1 |
| **カテゴリ (Category)** | カテゴリ名、説明 | No. 5 |
| **タグ (Tag)** | タグ名 | No. 5 |

:::tip Kỹ thuật tìm object
Đọc 要件定義 và gạch chân tất cả danh từ. Loại bỏ những danh từ không cần lưu trữ trong database (ví dụ: "hệ thống", "giao diện"). Phần còn lại là candidate objects.
:::

### ② ユーザータスクの洗い出し (Xác định tác vụ người dùng)

Từ các object vừa xác định, nghĩ tiếp: người dùng cần **làm gì** với từng object?

| ユーザータスク | Liên quan No. | Mô tả |
|:---|:---|:---|
| 資料の作成・編集・削除 | 1 | CRUD cơ bản cho tài liệu |
| 資料の検索・フィルタリング | 4 | Tìm theo từ khóa, lọc theo カテゴリ/タグ/日付 |
| 資料の閲覧 | 1, 2, 8 | Xem nội dung chi tiết tài liệu |
| 資料のバージョン管理 | 1 | Xem lịch sử, so sánh phiên bản |
| ナレッジ記事の作成・編集・削除 | 2, 8 | CRUD cho bài viết chia sẻ kiến thức |
| ナレッジ共有 | 2, 8 | Publish, chia sẻ nội dung với đồng nghiệp |
| 資料の整理 | 5 | Gán カテゴリ/タグ, di chuyển hàng loạt |
| ユーザー管理 | — | Quản lý tài khoản và phân quyền |

### ③ 必要な画面の洗い出し (Liệt kê màn hình)

Kết hợp object và task để xác định màn hình cần xây dựng:

- **ログイン画面** — Nhập username/password, đăng nhập
- **ダッシュボード** — Tổng quan: tài liệu cập nhật gần đây, thông báo quan trọng
- **資料作成・編集画面** — Text editor, upload file, nhập metadata (タイトル/タグ/カテゴリ)
- **資料検索・一覧画面** — Thanh tìm kiếm, bộ lọc, danh sách kết quả
- **資料詳細画面** — Nội dung tài liệu, link đến bài ナレッジ liên quan, comment
- **ナレッジベース一覧・詳細・作成画面** — Quản lý bài viết ナレッジ
- **管理画面** — Quản lý user, cấu hình hệ thống
- **資料バージョン管理画面** — Xem lịch sử, so sánh diff, rollback
- **資料整理画面** — Gán nhãn, di chuyển hàng loạt

### ④ 画面遷移図 (Sơ đồ luồng màn hình)

画面遷移図 thể hiện cách các màn hình kết nối với nhau theo từng hành động của người dùng.

```
[ログイン画面]
      ↓ 認証成功
[ダッシュボード]
   ↓              ↓              ↓
[資料一覧]   [ナレッジ一覧]   [管理画面]
   ↓    ↓
[詳細]  [作成/編集]
   ↓
[バージョン管理]
```

:::note Công cụ vẽ 画面遷移図
Thực tế hay dùng: Miro, Figma (FigJam), draw.io, hoặc đơn giản là PowerPoint/Keynote. Quan trọng là tất cả stakeholder đều hiểu được, không cần quá đẹp ở giai đoạn này.
:::

### ⑤ ワイヤーフレーム (Bố cục màn hình)

Xác định thành phần và vị trí của từng element trên màn hình. PM tạo bản thô, sau đó phối hợp với UXデザイナー để tinh chỉnh.

**ログイン画面:**
- Input: Username / Password
- Button: ログイン
- Link: パスワードを忘れた場合

**ダッシュボード:**
- Khu vực thông báo (お知らせ)
- Danh sách tài liệu cập nhật gần nhất (最近更新された資料)
- Đề xuất bài ナレッジ (おすすめ記事)

**資料作成・編集画面:**
- Dropdown chọn テンプレート (ví dụ: 日報、報告書、マニュアル)
- Vùng editor chính
- Sidebar: タイトル / タグ / カテゴリ nhập liệu
- Buttons: 保存 (Draft) / 公開 (Publish)

**資料一覧画面:**
- Thanh 検索バー ở trên cùng
- Bộ lọc: カテゴリ / タグ / 作成日
- Bảng kết quả với các cột: タイトル / 作成者 / 更新日 / ステータス

---

## 2. 機能設計 (Thiết kế chức năng)

Sau khi có 画面設計, bước tiếp theo là xác định **logic xử lý** đằng sau mỗi màn hình.

### 機能設計 cần xác định gì?

Với mỗi chức năng, cần làm rõ 3 điều:

| Câu hỏi | Ví dụ |
|:---|:---|
| **トリガーは何か?** (Điều gì kích hoạt chức năng?) | User nhấn nút 保存 |
| **どのデータを使うか?** (Dùng dữ liệu nào?) | タイトル、内容、カテゴリID từ form |
| **どこにデータを渡すか?** (Kết quả đi đâu?) | Insert vào bảng Documents trong DB |

### Quy trình 機能設計

**Bước 1 — 動的データの特定 (Xác định dữ liệu động)**

Đọc từng màn hình và xác định:
- Dữ liệu nào thay đổi theo từng user/session? (動的データ)
- Dữ liệu đó lấy từ đâu? (DB, user input, API bên ngoài)

Ví dụ trên 資料一覧画面:
- Danh sách tài liệu → lấy từ DB, lọc theo điều kiện tìm kiếm của user
- Tên user hiển thị góc trên → lấy từ Session sau khi đăng nhập

**Bước 2 — ユーザー操作の洗い出し (Xác định thao tác người dùng)**

Với mỗi button/action trên màn hình, xác định:

| 機能ID | 対象画面 | トリガー | 対象DB | 処理内容 |
|:---|:---|:---|:---|:---|
| F-001 | 資料作成画面 | 保存ボタンクリック | Documents | Validate input → Insert record mới → Redirect sang 詳細画面 |
| F-002 | 資料一覧画面 | 検索ボタンクリック | Documents | Query theo キーワード + フィルター → Trả về danh sách |
| F-003 | 資料詳細画面 | 削除ボタンクリック | Documents | Confirm dialog → Soft delete (cập nhật status = Deleted) |
| F-004 | 資料編集画面 | 公開ボタンクリック | Documents | Validate → Update status = Published → Tạo bản Version mới |

:::tip Soft delete vs Hard delete
Thực tế nên dùng **Soft delete** (đánh dấu `is_deleted = true`) thay vì xóa thật. Giúp phục hồi dữ liệu khi user xóa nhầm, và giữ được 参照整合性 (referential integrity) với các bảng khác.
:::

---

## 3. データ設計 (Thiết kế dữ liệu)

Giai đoạn cuối của 基本設計 là xác định cấu trúc dữ liệu cần lưu trữ.

### Các thành phẩm của データ設計

- **テーブル定義書** — Đặc tả chi tiết từng bảng (field, type, constraint)
- **ER図** (Entity Relationship Diagram) — Sơ đồ quan hệ giữa các bảng
- Phân loại dữ liệu: do user nhập (ユーザー入力) vs đọc từ DB (DB読み取り)

### テーブル定義 (Table Definitions)

**① 資料テーブル (Documents)**

| Field Name | Data Type | Constraint | Mô tả |
|:---|:---|:---|:---|
| id | INT | PK, AUTO_INCREMENT | |
| title | VARCHAR(255) | NOT NULL | タイトル |
| content | TEXT | | Nội dung tài liệu |
| created_by | INT | FK → Users.id | Người tạo |
| created_at | DATETIME | NOT NULL | Ngày tạo |
| updated_at | DATETIME | | Ngày cập nhật lần cuối |
| version | FLOAT | DEFAULT 1.0 | Số phiên bản hiện tại |
| status | VARCHAR(50) | NOT NULL | Draft / Published / Deleted |
| category_id | INT | FK → Categories.id | Danh mục |

**② カテゴリーテーブル (Categories)**

| Field Name | Data Type | Constraint | Mô tả |
|:---|:---|:---|:---|
| id | INT | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Tên danh mục |
| description | TEXT | | Mô tả |

**③ タグテーブル (Tags)**

| Field Name | Data Type | Constraint | Mô tả |
|:---|:---|:---|:---|
| id | INT | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL, UNIQUE | Tên tag |

**④ 資料・タグ中間テーブル (Document_Tags)**

| Field Name | Data Type | Constraint | Mô tả |
|:---|:---|:---|:---|
| document_id | INT | FK → Documents.id | |
| tag_id | INT | FK → Tags.id | |
| | | PK (document_id, tag_id) | Composite PK |

**⑤ ユーザーテーブル (Users)**

| Field Name | Data Type | Constraint | Mô tả |
|:---|:---|:---|:---|
| id | INT | PK, AUTO_INCREMENT | |
| username | VARCHAR(255) | NOT NULL, UNIQUE | |
| password | VARCHAR(255) | NOT NULL | Lưu dạng hash (bcrypt) |
| full_name | VARCHAR(255) | NOT NULL | 氏名 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | |
| role | VARCHAR(50) | NOT NULL | Admin / Editor / Viewer |

**⑥ ナレッジ記事テーブル (Knowledge_Articles)**

| Field Name | Data Type | Constraint | Mô tả |
|:---|:---|:---|:---|
| id | INT | PK, AUTO_INCREMENT | |
| title | VARCHAR(255) | NOT NULL | |
| content | TEXT | | |
| created_by | INT | FK → Users.id | |
| created_at | DATETIME | NOT NULL | |
| category_id | INT | FK → Categories.id | |

**⑦ コメントテーブル (Document_Comments)**

| Field Name | Data Type | Constraint | Mô tả |
|:---|:---|:---|:---|
| id | INT | PK, AUTO_INCREMENT | |
| document_id | INT | FK → Documents.id | |
| user_id | INT | FK → Users.id | |
| comment_text | TEXT | NOT NULL | |
| created_at | DATETIME | NOT NULL | |

### リレーション定義 (Định nghĩa quan hệ)

```
Documents ─── N:1 ──► Categories
Documents ─── N:M ──► Tags  (qua Document_Tags)
Documents ─── 1:N ──► Document_Comments
Document_Comments ─── N:1 ──► Users
Knowledge_Articles ─── N:1 ──► Categories
Documents ─── N:1 ──► Users (created_by)
```

Các quan hệ được thể hiện trong **ER図** — thành phẩm quan trọng nhất để developer hiểu cấu trúc database trước khi code.

:::note Chia sẻ データ設計 với Business side
Dữ liệu cuối cùng được Business side sử dụng để ra quyết định. Vì vậy, trước khi finalize テーブル定義, hãy confirm lại với Business: "Với những field này, anh/chị có đủ thông tin để làm báo cáo/phân tích chưa?"
:::

---

## Tổng kết

Một 基本設計 hoàn chỉnh bao gồm:

| Giai đoạn | Thành phẩm | Mục đích |
|:---|:---|:---|
| **画面設計** | 画面一覧, 画面遷移図, ワイヤーフレーム | Business side confirm luồng và giao diện |
| **機能設計** | 機能仕様書 (bảng F-xxx) | Developer biết cần build gì |
| **データ設計** | テーブル定義書, ER図 | Developer và DBA biết cấu trúc lưu trữ |

Tất cả thành phẩm trên được tổng hợp thành **基本設計書** — tài liệu dùng để:
1. Review với Business side trước khi bước vào 詳細設計
2. Làm căn cứ estimate công việc (見積もり)
3. Làm tài liệu tham chiếu trong suốt vòng đời dự án
