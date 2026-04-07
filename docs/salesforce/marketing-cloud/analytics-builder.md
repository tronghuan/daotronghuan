---
title: Analytics Builder
description: Đo lường và phân tích hiệu quả marketing với Analytics Builder — reports, dashboards và Datorama integration.
sidebar_position: 8
---

# Analytics Builder

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Analytics Builder Overview
- Hai công cụ chính: **Reports** (built-in) và **Intelligence Reports** (Datorama-powered)
- Phân biệt: Reports = SFMC-native, Intelligence = cross-channel analytics

### Tracking Workspace (built-in Reports)
- **Email Performance** — sent, delivered, open rate, click rate, bounce, unsubscribe
- **Link & Click Tracking** — xem từng link nào được click nhiều nhất
- **Job Reports** — hiệu quả từng lần gửi
- **Account Send Summary** — tổng hợp theo Account
- Data Views — truy vấn raw tracking data qua SQL trong Automation Studio

### Data Views quan trọng
- `_Open` — tracking open events
- `_Click` — tracking click events
- `_Bounce` — bounce records (hard/soft)
- `_Sent` — sent job records
- `_Unsubscribe` — unsubscribe events
- Cách dùng Data Views trong SQL Query để tạo custom reports

### Intelligence Reports (Datorama)
- Kết nối data từ nhiều nguồn: SFMC, Google Ads, Facebook Ads, Google Analytics
- Cross-channel dashboard trong một giao diện
- Calculated metrics tùy chỉnh
- Automated email reports

### KPIs quan trọng cho Email Marketing
- **Delivery Rate** = Delivered / Sent
- **Open Rate** = Unique Opens / Delivered
- **Click-to-Open Rate (CTOR)** = Unique Clicks / Unique Opens
- **Conversion Rate** — cần tích hợp web analytics
- **Unsubscribe Rate** — benchmark dưới 0.5%
- **Spam Complaint Rate** — phải dưới 0.1%

### Reporting Best Practices
- Set up automated weekly/monthly performance reports
- So sánh chiến dịch theo segment, subject line, thời gian gửi
- A/B test reporting — đọc kết quả đúng cách
