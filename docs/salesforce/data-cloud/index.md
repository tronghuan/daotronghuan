---
title: Data Cloud
description: Tổng quan Salesforce Data Cloud — nền tảng CDP thời gian thực giúp hợp nhất dữ liệu khách hàng từ mọi nguồn.
sidebar_position: 1
---

# Salesforce Data Cloud

Salesforce Data Cloud (trước đây là **Salesforce CDP — Customer Data Platform**) là nền tảng dữ liệu khách hàng thời gian thực, cho phép hợp nhất dữ liệu từ nhiều nguồn khác nhau thành một **Unified Profile** duy nhất cho mỗi khách hàng.

## Data Cloud là gì?

Data Cloud không chỉ là một data warehouse — đây là một **active data platform** tích hợp sâu vào hệ sinh thái Salesforce:

- **Ingest** dữ liệu từ mọi nguồn: CRM, website, mobile app, data warehouse, third-party systems
- **Unify** thông tin thành hồ sơ khách hàng duy nhất qua Identity Resolution
- **Segment** khách hàng dựa trên hành vi và thuộc tính thời gian thực
- **Activate** data đến Marketing Cloud, Sales Cloud, Service Cloud, và các kênh bên ngoài

## Kiến trúc tổng quan

```
[Data Sources] → [Ingestion Layer] → [Data Lake] → [Data Model] → [Identity Resolution]
                                                                          ↓
                                                              [Unified Individual Profile]
                                                                          ↓
                                              [Segmentation] ←→ [Calculated Insights]
                                                    ↓
                                              [Activation Targets]
                                    (SFMC / Sales Cloud / Service Cloud / Webhook)
```

## Các chủ đề trong series

| Bài | Nội dung |
|-----|----------|
| [Kiến trúc Data Cloud](./architecture) | Các layer, components và luồng dữ liệu |
| [Data Ingestion](./data-ingestion) | Kết nối và đưa dữ liệu vào Data Cloud |
| [Data Model (DMO)](./data-model) | Salesforce Data Model Objects và mapping |
| [Identity Resolution](./identity-resolution) | Hợp nhất profile, matching & reconciliation rules |
| [Segmentation & Activation](./segmentation) | Tạo segment và kích hoạt đến các kênh |
| [Calculated Insights](./calculated-insights) | Tính toán metrics tùy chỉnh |
| [Data Actions](./data-actions) | Kích hoạt automation từ Data Cloud |

> Nội dung đang được chuẩn bị theo thứ tự. Theo dõi để cập nhật mới nhất!
