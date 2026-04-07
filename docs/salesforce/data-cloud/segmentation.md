---
title: Segmentation & Activation
description: Tạo segment khách hàng theo thời gian thực và activate đến Marketing Cloud, CRM, hoặc các kênh bên ngoài.
sidebar_position: 6
---

# Segmentation & Activation

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Segment Builder
- Tạo segment từ Unified Individual attributes
- Container (AND/OR logic)
- Related attributes — filter theo data từ objects liên quan (ví dụ: "đã mua sản phẩm X trong 30 ngày qua")
- Nested conditions và complex filters
- Count & estimate trước khi publish

### Loại Segment
- **Batch Segment** — tính toán theo lịch (hourly/daily)
- **Real-time Segment** — cập nhật gần như tức thì khi data thay đổi
- Khi nào dùng loại nào và trade-offs

### Activation Targets
- **Marketing Cloud Activation** — đẩy segment vào Data Extension của SFMC
- **CRM Activation** — tạo/cập nhật Campaign Member trong Sales/Service Cloud
- **Webhook Activation** — gửi payload đến external endpoint
- Cấu hình field mapping khi activate

### Publish & Refresh Schedule
- Publish segment lần đầu
- Cấu hình refresh interval
- Monitor activation jobs và lỗi

### Consent Management
- Tích hợp Contact Point Consent vào segmentation
- Tự động loại trừ opt-out contacts
- GDPR / PDPA compliance trong activation

### Best Practices
- Đặt tên segment có convention rõ ràng
- Quản lý lifecycle của segment (archive khi không dùng)
- Performance: tránh quá nhiều nested conditions
