---
title: Kiến trúc Data Cloud
description: Hiểu kiến trúc tổng thể của Salesforce Data Cloud — các layer, components và luồng dữ liệu từ ingestion đến activation.
sidebar_position: 2
---

# Kiến trúc Data Cloud

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Các Layer của Data Cloud
- **Ingestion Layer** — nơi dữ liệu từ bên ngoài đi vào (Connectors, APIs, streaming)
- **Data Lake** — lưu trữ raw data trước khi được xử lý
- **Data Model Layer** — chuẩn hóa data vào Data Model Objects (DMO)
- **Intelligence Layer** — Identity Resolution, Calculated Insights
- **Activation Layer** — đẩy data ra các kênh (SFMC, CRM, webhook)

### Components chính
- **Data Stream** — luồng dữ liệu từ một connector cụ thể
- **Data Lake Object (DLO)** — đại diện cho raw data đã ingest
- **Data Model Object (DMO)** — data đã được map vào chuẩn Salesforce
- **Unified Individual** — profile tổng hợp sau Identity Resolution
- **Segment** — nhóm khách hàng theo điều kiện
- **Activation Target** — đích đến của data sau khi segment

### Phân biệt DLO vs DMO
- Khi nào dùng DLO, khi nào dùng DMO
- Mapping rules giữa DLO và DMO
- Custom DMO — tạo object riêng khi cần

### Licensing & Editions
- Data Cloud for Marketing
- Data Cloud for Sales / Service
- Data Cloud (standalone)
- Phân biệt các gói và tính năng tương ứng

### Tích hợp với Salesforce Ecosystem
- Kết nối với Marketing Cloud
- Kết nối với CRM (Sales, Service Cloud)
- Real-time triggers và Agentforce
