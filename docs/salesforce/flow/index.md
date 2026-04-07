### Salesforce Flow: Hướng dẫn tổng quan

**Salesforce Flow** (hay Flow Builder) là công cụ tự động hóa mạnh mẽ nhất của Salesforce không cần viết mã (declarative/low-code). Nó cho phép bạn xây dựng các logic nghiệp vụ phức tạp thông qua giao diện kéo thả trực quan.

---

### 1. Các loại Flow phổ biến (Flow Types)

Hiện nay Salesforce chia Flow thành 5 loại chính dựa trên mục đích sử dụng:

| Loại Flow | Chức năng chính | Khi nào nên dùng? |
| :--- | :--- | :--- |
| **Screen Flow** | Hiển thị giao diện người dùng (biểu mẫu, thông báo, câu hỏi). | Khi cần thu thập thông tin từ người dùng hoặc hướng dẫn họ qua các bước (ví dụ: Tạo Case, khảo sát). |
| **Record-Triggered Flow** | Tự động chạy khi một bản ghi được **tạo, cập nhật hoặc xóa**. | Thay thế cho Workflow Rules và Process Builder. Dùng để cập nhật dữ liệu liên quan khi bản ghi thay đổi. |
| **Schedule-Triggered Flow** | Tự động chạy vào một **thời điểm cụ thể** (hàng ngày, hàng tuần) cho một danh sách bản ghi. | Khi cần kiểm tra dữ liệu định kỳ (ví dụ: Gửi email nhắc nhở cho các Opportunity sắp hết hạn mỗi sáng). |
| **Platform Event-Triggered Flow** | Chạy khi nhận được một thông điệp (Platform Event) từ hệ thống bên ngoài hoặc nội bộ. | Dùng trong tích hợp hệ thống (Integration) để phản ứng với các sự kiện thời gian thực. |
| **Autolaunched Flow (No Trigger)** | Không tự chạy. Nó được gọi từ Apex, Process Builder, hoặc một Flow khác (Subflow). | Khi bạn có một logic chung muốn tái sử dụng ở nhiều nơi khác nhau. |

---

### 2. Chi tiết cách chọn Flow phù hợp

- **Muốn có giao diện cho người dùng nhập liệu?** $\rightarrow$ **Screen Flow**.
- **Muốn tự động tính toán dữ liệu khi bấm Save?** $\rightarrow$ **Record-Triggered Flow**.
    - *Before-Save:* Nếu chỉ cập nhật chính bản ghi đó (Tốc độ cực nhanh).
    - *After-Save:* Nếu cần cập nhật các bản ghi liên quan (Related Records) hoặc gửi Email.
- **Muốn quét toàn bộ hệ thống để dọn dẹp dữ liệu vào cuối tuần?** $\rightarrow$ **Schedule-Triggered Flow**.

---

### 3. Các thành phần chính trong Flow Builder

1.  **Trigger:** Điểm bắt đầu (Điều kiện để Flow chạy).
2.  **Elements (Phần tử):**
    - **Interaction:** Screen (Màn hình), Action (Gửi email, post Slack).
    - **Logic:** Decision (Nhánh rẽ - If/Else), Loop (Vòng lặp), Assignment (Gán giá trị).
    - **Data:** Create Records, Update Records, Get Records (Truy vấn), Delete Records.
3.  **Resources (Tài nguyên):** Biến (Variable), Công thức (Formula), Hằng số (Constant).

---

### 4. Quy trình tạo một Flow cơ bản

1.  **Truy cập:** Vào **Setup** $\rightarrow$ Tìm kiếm **Flows** $\rightarrow$ Nhấn **New Flow**.
2.  **Chọn loại Flow:** (Ví dụ: Chọn *Record-Triggered Flow*).
3.  **Thiết lập Object và Điều kiện:** Chọn Object (ví dụ: Account) và điều kiện chạy (ví dụ: Created).
4.  **Thiết kế Logic:**
    - Nhấn dấu **(+)** để thêm Element.
    - Chọn **Get Records** nếu cần lấy thêm dữ liệu.
    - Chọn **Decision** để kiểm tra điều kiện.
    - Chọn **Update Records** để thay đổi dữ liệu.
5.  **Save & Name:** Đặt tên cho Flow (Nên theo quy tắc: *Object_Action_Description*).
6.  **Debug:** Nhấn nút **Debug** để chạy thử với một bản ghi cụ thể trước khi kích hoạt.
7.  **Activate:** Nhấn **Activate** để Flow bắt đầu có hiệu lực trên hệ thống.

---

### 5. Lưu ý quan trọng (Best Practices)

- **One Object, One Flow:** Cố gắng gom các logic của cùng một Object vào một Flow (hoặc số lượng ít nhất có thể) để dễ quản lý thứ tự chạy.
- **Không thực hiện DML/Query trong Loop:** Giống như Apex, không đặt "Get Records" hoặc "Update Records" bên trong vòng lặp (Loop) để tránh quá tải giới hạn hệ thống (Governor Limits).
- **Luôn có nhánh lỗi (Fault Path):** Dự phòng trường hợp Flow bị lỗi để hiển thị thông báo thân thiện thay vì mã lỗi hệ thống.