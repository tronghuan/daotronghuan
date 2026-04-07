---
title: Identity Resolution
description: Hợp nhất dữ liệu khách hàng từ nhiều nguồn thành một Unified Profile duy nhất với Identity Resolution.
sidebar_position: 5
---

# Identity Resolution

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Identity Resolution là gì?
- Vấn đề: một khách hàng có thể có nhiều bản ghi ở nhiều hệ thống khác nhau
- Giải pháp: Identity Resolution xác định và gộp các bản ghi đó thành **Unified Individual**
- Kết quả: một profile hoàn chỉnh thay vì nhiều mảnh rời rạc

### Matching Rules
- **Exact Match** — khớp chính xác theo field (email, phone)
- **Fuzzy Match** — khớp gần đúng (tên người)
- **Custom Match Rules** — kết hợp nhiều điều kiện
- Thứ tự ưu tiên của matching rules
- Cấu hình threshold và confidence score

### Reconciliation Rules
- Sau khi match, lấy giá trị nào cho Unified Profile?
- **Most Frequent** — giá trị xuất hiện nhiều nhất
- **Most Recent** — giá trị mới nhất
- **Source Priority** — ưu tiên nguồn dữ liệu đáng tin cậy nhất
- Custom reconciliation logic

### Ruleset & Identity Graph
- Tạo và quản lý Identity Ruleset
- Identity Graph — visualize mối quan hệ giữa các records
- Monitoring match rate và quality metrics

### Thực hành: Cấu hình Identity Resolution
- Bước 1: Chuẩn bị data model (Individual + Contact Points)
- Bước 2: Tạo Matching Rules
- Bước 3: Cấu hình Reconciliation Rules
- Bước 4: Chạy resolution và kiểm tra kết quả
- Bước 5: Điều chỉnh rules dựa trên kết quả thực tế
