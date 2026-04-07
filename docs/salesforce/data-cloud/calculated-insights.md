---
title: Calculated Insights
description: Tạo metrics và KPI tùy chỉnh trong Data Cloud bằng Calculated Insights — từ tổng chi tiêu đến LTV khách hàng.
sidebar_position: 7
---

# Calculated Insights

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Calculated Insights là gì?
- Định nghĩa: metric được tính toán từ dữ liệu trong Data Cloud và lưu lại như một DMO
- Use cases: tổng chi tiêu, số lần mua, điểm engagement, LTV (Customer Lifetime Value)
- Khác gì với filter trực tiếp trong Segment Builder?

### Hai loại Calculated Insights
- **Batch Insights** — tính toán theo lịch, phù hợp cho metrics phức tạp cần nhiều data
- **Streaming Insights** — cập nhật real-time khi có event mới đến

### Tạo Calculated Insight
- Giao diện: Insight Builder (no-code) vs SQL-based
- Cú pháp và các function hỗ trợ
- Chọn Measure (giá trị tính toán) và Dimension (nhóm theo gì)
- Cấu hình granularity và time window

### Các Calculated Insights phổ biến
- **Total Purchase Value** — tổng giá trị đơn hàng
- **Last Purchase Date** — ngày mua gần nhất
- **Purchase Frequency** — số lần mua trong N ngày
- **Engagement Score** — tổng hợp email opens, clicks, web visits
- **RFM Score** — Recency, Frequency, Monetary

### Dùng Calculated Insights trong Segmentation
- Cách tham chiếu Calculated Insight trong Segment Builder
- Tạo segment "Khách VIP" dựa trên LTV
- Tạo segment "Khách có nguy cơ rời bỏ" dựa trên Recency
