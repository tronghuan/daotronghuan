---
title: Data Model (DMO)
description: Salesforce Data Model Objects — chuẩn hóa dữ liệu vào mô hình Salesforce để enable Identity Resolution và Segmentation.
sidebar_position: 4
---

# Data Model (DMO)

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Standard DMOs quan trọng
- **Individual** — đại diện cho một người (customer, lead, contact)
- **Contact Point Email / Phone / Address** — các điểm liên lạc
- **Contact Point Consent** — lưu trạng thái consent theo kênh và mục đích
- **Unified Individual** — profile tổng hợp sau Identity Resolution (auto-generated)
- **Party Identification** — các ID định danh (email, phone, cookie, SFMC subscriber key...)
- **Engagement (Web, Email, Mobile)** — hành vi tương tác theo kênh

### Custom DMO
- Khi nào cần tạo Custom DMO
- Cách tạo và cấu hình
- Relationship với Standard DMOs

### Mapping DLO → DMO
- Tạo Data Transform để map từ raw DLO sang chuẩn DMO
- Mapping rules: direct mapping, formula, lookup
- Validation và error handling

### Relationship & Cardinality
- One-to-one, one-to-many, many-to-many
- Primary key và foreign key
- Ảnh hưởng đến segmentation performance

### Data Model cho từng use case
- E-commerce: Orders, Products, Cart Events
- Financial Services: Policies, Transactions, Claims
- B2B: Accounts, Contacts, Opportunities
