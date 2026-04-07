---
title: Data Actions
description: Kích hoạt automation từ Data Cloud — gọi Flow, Apex, hoặc Marketing Cloud Journey khi dữ liệu thay đổi.
sidebar_position: 8
---

# Data Actions

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Data Actions là gì?
- Cơ chế kích hoạt hành động khi một sự kiện xảy ra trong Data Cloud
- Khác với Activation (batch) — Data Actions hướng đến trigger event-based theo thời gian thực
- Use cases: gửi welcome email khi profile được tạo, tạo case khi phát hiện churn signal

### Các loại Data Action Target
- **Flow** — gọi Salesforce Flow (Autolaunched) trong CRM
- **Apex** — gọi Invocable Method từ Apex class
- **Marketing Cloud Journey** — inject contact vào Journey Builder entry event
- **Webhook** — gọi HTTP endpoint bên ngoài

### Data Action Trigger
- Trigger dựa trên **Segment membership** — khi profile gia nhập hoặc rời khỏi segment
- Trigger dựa trên **Data Change** — khi giá trị field thay đổi
- Trigger dựa trên **Calculated Insight threshold** — khi metric vượt ngưỡng

### Cấu hình Data Action
- Bước 1: Tạo Data Action Target (định nghĩa nơi nhận)
- Bước 2: Tạo Data Action (định nghĩa trigger + target + field mapping)
- Bước 3: Activate và monitor

### Thực hành: Kích hoạt Journey khi khách hàng vào segment "Churn Risk"
- Setup Calculated Insight để tính Recency score
- Tạo Segment "Churn Risk" dựa trên Recency
- Tạo Data Action → Marketing Cloud Journey target
- Cấu hình Journey Builder để nhận event từ Data Cloud

### Monitoring & Error Handling
- Data Action execution log
- Retry logic và dead letter queue
- Xử lý lỗi khi target không available
