---
title: Account Engagement (Pardot)
description: Marketing automation B2B với Salesforce Marketing Cloud Account Engagement (Pardot) — lead nurturing, scoring, grading và Engagement Studio.
sidebar_position: 9
---

# Marketing Cloud Account Engagement (Pardot)

:::note Tên sản phẩm
Salesforce **Pardot** đã được đổi tên thành **Marketing Cloud Account Engagement (MCAE)** từ năm 2022. Trong tài liệu này, hai tên được dùng thay thế nhau.
:::

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Pardot vs Marketing Cloud — B2B vs B2C
- Pardot/MCAE: B2B, sales cycle dài, focus vào lead qualification
- SFMC: B2C, quy mô lớn, focus vào customer engagement
- Khi nào dùng cái nào, khi nào dùng cả hai

### Core Concepts
- **Prospect** — đối tượng trong Pardot (tương đương Lead/Contact trong CRM)
- **Campaign** — nguồn gốc và track ROI
- **Score** — đo độ quan tâm (behavioral: trang xem, email click, form fill)
- **Grade** — đo độ phù hợp (demographic: industry, job title, company size)

### Forms & Landing Pages
- Tạo form Pardot để capture leads
- Progressive profiling — thu thập thêm info qua nhiều lần submit
- Landing page builder trong Pardot
- Kết nối form với Salesforce Campaign

### Email Marketing trong Pardot
- List Email — gửi email hàng loạt
- Operational Email — transactional, không cần unsubscribe
- Template builder
- Personalization với HML (Handlebars Merge Language)

### Engagement Studio — Nurture Programs
- Xây dựng nurture workflow kéo thả
- Trigger: form fill, email open, page visit, score change
- Action: gửi email, thay đổi score/grade, assign to user, notify sales
- Rule: rẽ nhánh theo điều kiện
- Ví dụ: 5-email nurture series sau khi download whitepaper

### Lead Scoring & Grading
- Cấu hình Score thresholds theo từng hành vi
- Cấu hình Grade theo Ideal Customer Profile (ICP)
- Sales Qualified Lead (SQL): score ≥ 100 + grade B trở lên
- Einstein Behavior Scoring — AI-powered scoring

### Salesforce CRM Integration
- Connector Pardot ↔ Salesforce CRM
- Sync rules: Prospect ↔ Lead/Contact
- Opportunity influence tracking
- Campaign attribution và ROI reporting

### B2B Marketing Analytics
- B2B MA Dashboard trong Salesforce
- Pipeline report, campaign performance, engagement funnel
- Einstein Attribution
