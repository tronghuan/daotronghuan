---
title: Variables & Outputs
description: Input variables, local values, output values và cách quản lý cấu hình môi trường với .tfvars.
sidebar_position: 4
---

# Variables & Outputs

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Input Variables
```hcl
variable "instance_type" {
  type        = string
  default     = "t2.micro"
  description = "EC2 instance type"

  validation {
    condition     = contains(["t2.micro", "t2.small", "t2.medium"], var.instance_type)
    error_message = "Instance type phải là t2.micro, t2.small hoặc t2.medium."
  }
}
```
- Truyền giá trị qua CLI: `terraform apply -var="instance_type=t2.small"`
- Từ file: `terraform apply -var-file="prod.tfvars"`
- Từ environment variable: `TF_VAR_instance_type=t2.small`

### .tfvars files
```hcl
# dev.tfvars
instance_type = "t2.micro"
db_instance_class = "db.t3.micro"
min_capacity = 1

# prod.tfvars
instance_type = "t2.medium"
db_instance_class = "db.t3.medium"
min_capacity = 3
```
- `terraform.tfvars` — tự động load
- `*.auto.tfvars` — tự động load
- Các file khác cần chỉ định `-var-file`

### Local Values
```hcl
locals {
  name_prefix = "${var.project}-${var.environment}"
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
```
- Tính toán một lần, dùng nhiều chỗ
- Không bị override từ ngoài (khác với variable)

### Output Values
```hcl
output "instance_public_ip" {
  value       = aws_instance.web.public_ip
  description = "Public IP của web server"
  sensitive   = false  # true nếu là secret
}
```
- Hiển thị sau `terraform apply`
- Dùng bởi module cha hoặc scripts bên ngoài
- `terraform output instance_public_ip` để xem lại

### Variable Precedence (thứ tự ưu tiên)
1. CLI `-var` và `-var-file` (cao nhất)
2. `*.auto.tfvars`
3. `terraform.tfvars`
4. Environment variables (`TF_VAR_*`)
5. Default trong variable block (thấp nhất)
