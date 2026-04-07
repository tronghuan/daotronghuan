---
title: Automation Studio
description: Tự động hóa quy trình data và gửi email với Automation Studio — scheduled automations, SQL queries, và file imports.
sidebar_position: 4
---

# Automation Studio

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Automation Studio vs Journey Builder
- Automation Studio: data-centric, batch processing, scheduled tasks
- Journey Builder: people-centric, individual journeys, event-based
- Khi nào dùng cái nào

### Hai loại Automation
- **Scheduled Automation** — chạy theo lịch (hourly, daily, weekly)
- **Triggered Automation** — chạy khi có file đến SFTP hoặc khi được gọi bằng API

### Các Activity trong Automation
**Data Activities:**
- **SQL Query** — truy vấn và ghi kết quả vào Data Extension
- **Data Extract** — export data ra file
- **File Transfer** — move file trong/ngoài SFTP
- **Import File** — import file CSV vào Data Extension
- **Filter** — lọc data từ All Subscribers vào DE

**Send Activities:**
- **Send Email** — gửi email theo User-Initiated Send Definition
- **Send SMS** — gửi SMS theo MobileConnect definition

**Utility:**
- **Wait** — chờ giữa các bước
- **Verification** — kiểm tra điều kiện trước khi chạy

### SQL trong Automation Studio
- Cú pháp SQL của SFMC (T-SQL based)
- Các bảng/views quan trọng: `_Subscribers`, `_Open`, `_Click`, `_Bounce`, `_Sent`
- JOIN với Data Extensions tùy chỉnh
- Ví dụ: tạo DE chứa contacts đã open email trong 30 ngày qua

### SFTP & File Management
- Cấu hình SFTP cho SFMC
- Folder structure chuẩn: Import/, Export/, Triggered/
- Xử lý file encoding (UTF-8, Windows-1252)

### Monitoring & Error Handling
- Automation Activity History
- Email notifications khi automation fail
- Retry logic cho failed activities
