---
title: Journey Builder
description: Xây dựng customer journey tự động đa kênh với Salesforce Journey Builder — từ welcome series đến win-back campaigns.
sidebar_position: 3
---

# Journey Builder

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Journey Builder là gì?
- Công cụ xây dựng customer journey tự động theo hành vi
- Khác gì Automation Studio? (Journey = người dùng trung tâm, Automation = data/batch)
- Các use case phổ biến: Welcome Series, Abandoned Cart, Win-Back, Onboarding

### Entry Sources — Điểm vào Journey
- **Data Extension Entry** — contact từ DE được thêm theo lịch
- **API Event Entry** — inject contact real-time qua API
- **Salesforce Data Entry** — từ CRM (Lead, Contact, Opportunity events)
- **CloudPages Entry** — khi có form submission
- **Audience Entry** — từ Data Cloud Segment
- Cấu hình re-entry settings

### Activities — Các bước trong Journey
**Messaging:**
- Email Activity — gửi email qua Email Studio
- SMS Activity — gửi SMS qua MobileConnect
- Push Activity — gửi push notification qua MobilePush
- In-App Message Activity

**Flow Control:**
- Wait Activity — chờ X ngày/giờ, hoặc chờ đến ngày cụ thể
- Decision Split — rẽ nhánh theo attribute (ví dụ: gender, tier)
- Engagement Split — rẽ nhánh theo hành vi (opened email, clicked link)
- Random Split — A/B testing ngẫu nhiên
- Einstein Split — AI quyết định thời điểm tối ưu

**CRM:**
- Update Contact Activity — cập nhật field trong Salesforce CRM
- Create Task Activity — tạo Task cho sales rep
- Fire Event Activity — kích hoạt Platform Event

### Goal & Exit Criteria
- Journey Goal: định nghĩa điều kiện thành công (ví dụ: completed purchase)
- Exit Criteria: điều kiện thoát sớm (ví dụ: đã unsubscribe)

### Journey Statistics & Reporting
- Journey Performance dashboard
- Funnel report: số contact qua từng bước
- Email performance tích hợp

### Best Practices
- Version control — clone trước khi sửa journey đang chạy
- Inject test contacts trước khi activate
- Xử lý contact kẹt trong journey
- Journey vs Automation: khi nào dùng cái nào
