---
title: Data Ingestion
description: Đưa dữ liệu vào Salesforce Data Cloud — các loại connector, batch vs streaming, và cấu hình Data Stream.
sidebar_position: 3
---

# Data Ingestion

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Các loại Connector
- **Salesforce CRM Connector** — đồng bộ trực tiếp từ Sales/Service Cloud
- **Marketing Cloud Connector** — ingest data từ SFMC (contacts, sends, opens, clicks)
- **Cloud Storage Connector** — S3, Azure Blob, Google Cloud Storage (file CSV/JSON/Parquet)
- **MuleSoft Connector** — qua Anypoint Platform
- **Ingestion API** — REST API để push data trực tiếp (batch và streaming)
- **Web/Mobile SDK** — thu thập event từ web và mobile app theo thời gian thực

### Batch vs Streaming Ingestion
- Batch: lịch chạy, volume lớn, độ trễ chấp nhận được
- Streaming: gần real-time, event-based, giới hạn throughput
- Khi nào chọn loại nào

### Cấu hình Data Stream
- Tạo Data Stream từ connector
- Field mapping — map field nguồn vào DLO
- Primary key và refresh mode (upsert, append, full replace)
- Schedule và monitoring

### Ingestion API chi tiết
- Endpoint và authentication
- Batch request format (JSON)
- Streaming request format
- Rate limits và error handling

### Data Monitoring & Troubleshooting
- Ingestion job history
- Error logs và cách xử lý lỗi thường gặp
- Data quality checks
