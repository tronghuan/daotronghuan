---
title: Marketing Cloud
description: Tổng quan Salesforce Marketing Cloud — nền tảng marketing đa kênh B2C với Email, Mobile, Social, Ads và Journey automation.
sidebar_position: 1
---

# Salesforce Marketing Cloud (SFMC)

Salesforce Marketing Cloud là nền tảng **digital marketing B2C** toàn diện, cho phép tạo và tự động hóa các chiến dịch marketing trên nhiều kênh: email, SMS, push notification, social media, và web.

:::note Phân biệt hai sản phẩm Marketing của Salesforce
- **Marketing Cloud (SFMC)** — B2C marketing, quy mô lớn, focus vào email/mobile/journey
- **Marketing Cloud Account Engagement (Pardot)** — B2B marketing automation, focus vào lead nurturing và scoring
:::

## Kiến trúc tổng quan

```
┌──────────────────────────────────────────────────────┐
│              SALESFORCE MARKETING CLOUD              │
├──────────────┬───────────────────────────────────────┤
│  Contact     │  Contact Builder (Data Extensions,    │
│  Management  │  Attribute Groups, Sendable DEs)      │
├──────────────┼───────────────────────────────────────┤
│  Content     │  Content Builder (Emails, Templates,  │
│  Creation    │  Dynamic Content, AMPscript)           │
├──────────────┼───────────────────────────────────────┤
│  Channels    │  Email Studio · Mobile Studio         │
│              │  Advertising Studio · Social Studio   │
├──────────────┼───────────────────────────────────────┤
│  Automation  │  Journey Builder · Automation Studio  │
├──────────────┼───────────────────────────────────────┤
│  Analytics   │  Analytics Builder · Datorama         │
└──────────────┴───────────────────────────────────────┘
```

## Các chủ đề trong series

| Bài | Nội dung |
|-----|----------|
| [Email Studio](./email-studio) | Gửi email marketing: classifications, send definitions, deliverability |
| [Journey Builder](./journey-builder) | Xây dựng customer journey tự động đa kênh |
| [Automation Studio](./automation-studio) | Scheduled & triggered automations, SQL queries |
| [Content Builder](./content-builder) | Thiết kế email, dynamic content, AMPscript |
| [Contact Builder](./contact-builder) | Data Extensions, Attribute Groups, data model SFMC |
| [Mobile Studio](./mobile-studio) | Push notification, SMS/MMS với MobilePush & MobileConnect |
| [Analytics Builder](./analytics-builder) | Reports, dashboards, tracking và insights |
| [Account Engagement (Pardot)](./account-engagement) | B2B marketing automation, Engagement Studio |

> Nội dung đang được chuẩn bị theo thứ tự. Theo dõi để cập nhật mới nhất!
