---
title: Resources & Data Sources
description: Tạo và quản lý resources, dùng data sources để đọc hạ tầng có sẵn, dependencies và lifecycle rules.
sidebar_position: 6
---

# Resources & Data Sources

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Resource Block
```hcl
resource "aws_s3_bucket" "app_assets" {
  bucket = "my-app-assets-${var.environment}"

  tags = local.common_tags
}
```
- `aws_s3_bucket` — resource type (provider_resourcetype)
- `"app_assets"` — local name, dùng để reference trong code
- Reference: `aws_s3_bucket.app_assets.id`, `.arn`, `.bucket`...

### Data Sources — Đọc hạ tầng có sẵn
```hcl
# Lấy thông tin AMI mới nhất
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

# Dùng data source
resource "aws_instance" "web" {
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"
}
```

### Implicit vs Explicit Dependencies
```hcl
# Implicit — Terraform tự detect qua reference
resource "aws_instance" "web" {
  subnet_id = aws_subnet.main.id   # implicit dependency
}

# Explicit — dùng depends_on khi không có reference
resource "aws_instance" "worker" {
  depends_on = [aws_iam_role_policy.worker_policy]
}
```

### count — Tạo nhiều resources
```hcl
resource "aws_instance" "web" {
  count         = var.instance_count
  ami           = data.aws_ami.amazon_linux.id
  instance_type = "t2.micro"

  tags = {
    Name = "web-${count.index + 1}"
  }
}
# Reference: aws_instance.web[0].id, aws_instance.web[*].id
```

### for_each — Tạo từ map/set
```hcl
variable "s3_buckets" {
  default = {
    assets  = "my-app-assets"
    backups = "my-app-backups"
    logs    = "my-app-logs"
  }
}

resource "aws_s3_bucket" "buckets" {
  for_each = var.s3_buckets
  bucket   = each.value
  # each.key, each.value
}
```

### Lifecycle Rules
```hcl
resource "aws_instance" "db" {
  lifecycle {
    create_before_destroy = true   # Tạo mới trước khi xóa cũ (zero downtime)
    prevent_destroy       = true   # Chặn xóa (bảo vệ production data)
    ignore_changes        = [tags] # Bỏ qua thay đổi tags (do external system)
  }
}
```
