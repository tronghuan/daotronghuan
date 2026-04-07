---
title: Core Concepts
description: 5 khái niệm cốt lõi của Terraform — Provider, Resource, State, Plan và Apply.
sidebar_position: 2
---

# Core Concepts

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### 1. Provider
- Plugin kết nối Terraform với cloud/service (AWS, GCP, Azure, GitHub, Cloudflare...)
- Mỗi provider cung cấp tập resources riêng
- Cần khai báo và cấu hình trước khi dùng

### 2. Resource
- Đơn vị hạ tầng cơ bản: EC2 instance, S3 bucket, RDS database, VPC...
- Khai báo bằng `resource "type" "name" { ... }`
- Terraform quản lý lifecycle: create, update, delete

### 3. State
- File lưu trạng thái hạ tầng hiện tại (`terraform.tfstate`)
- Terraform so sánh state với code để biết cần thay đổi gì
- **Quan trọng**: không xóa hoặc sửa tay file state

### 4. Plan
- `terraform plan` — preview thay đổi **trước khi** apply
- Hiển thị: sẽ tạo gì (+), xóa gì (-), sửa gì (~)
- **Luôn đọc plan kỹ trước khi apply**

### 5. Apply
- `terraform apply` — thực thi thay đổi
- Gọi cloud APIs để tạo/sửa/xóa resources
- Cập nhật state file sau khi hoàn thành

### Terraform Workflow
```bash
terraform init      # Tải providers và modules
terraform validate  # Kiểm tra syntax
terraform plan      # Xem thay đổi
terraform apply     # Thực thi
terraform destroy   # Xóa toàn bộ (dùng cẩn thận!)
```

### Idempotency — Tính bất biến
- Chạy `apply` nhiều lần với cùng code → kết quả giống nhau
- Terraform chỉ thay đổi những gì khác với state hiện tại
- Cơ sở để automation an toàn
