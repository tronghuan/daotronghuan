---
title: "Bước 5: Variables & Environments"
description: Tách cấu hình dev/prod bằng .tfvars — variables.tf hoàn chỉnh, locals và cách apply đúng environment.
sidebar_position: 6
---

# Bước 5: Variables & Environments

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### variables.tf — Khai báo tập trung
```hcl
variable "aws_region" {
  type        = string
  description = "AWS region để deploy"
  default     = "ap-southeast-1"
}

variable "project_name" {
  type        = string
  description = "Tên project, dùng làm prefix cho tất cả resources"
}

variable "environment" {
  type        = string
  description = "Môi trường: dev, staging, prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment phải là dev, staging, hoặc prod."
  }
}

variable "instance_type" {
  type        = string
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block cho VPC"
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  type        = string
  description = "CIDR block cho public subnet"
  default     = "10.0.1.0/24"
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "IP CIDR được phép SSH vào EC2 (ví dụ: '1.2.3.4/32')"
  sensitive   = true  # Không hiện trong plan output
}
```

### dev.tfvars
```hcl
aws_region         = "ap-southeast-1"
project_name       = "myapp"
environment        = "dev"
instance_type      = "t2.micro"
vpc_cidr           = "10.0.0.0/16"
public_subnet_cidr = "10.0.1.0/24"
# allowed_ssh_cidr để trống → lấy từ env var hoặc truyền CLI
```

### prod.tfvars.example (commit template này)
```hcl
# prod.tfvars.example — TEMPLATE, không có giá trị thật
# Copy file này thành prod.tfvars và điền giá trị thực tế
aws_region         = "ap-southeast-1"
project_name       = "myapp"
environment        = "prod"
instance_type      = "t2.medium"        # Lớn hơn dev
vpc_cidr           = "10.1.0.0/16"      # CIDR khác để tránh overlap
public_subnet_cidr = "10.1.1.0/24"
# allowed_ssh_cidr = "YOUR_IP/32"       # Điền IP của bạn
```

### Apply từng environment
```bash
# Dev
terraform workspace select dev  # hoặc tạo: terraform workspace new dev
terraform apply -var-file="dev.tfvars"

# Prod
terraform workspace select prod
terraform apply -var-file="prod.tfvars" \
  -var="allowed_ssh_cidr=$(curl -s ifconfig.me)/32"
```

### Tự động detect IP hiện tại cho SSH
```hcl
# Dùng data source để lấy IP của máy đang chạy Terraform
data "http" "my_ip" {
  url = "https://ifconfig.me"
}

locals {
  my_ip_cidr = "${chomp(data.http.my_ip.response_body)}/32"
}

# Dùng trong security group
ingress {
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = [local.my_ip_cidr]
}
```

### Commit
```bash
git add variables.tf dev.tfvars prod.tfvars.example locals.tf
git commit -m "feat(config): thêm variables và dev/prod environments"
```
