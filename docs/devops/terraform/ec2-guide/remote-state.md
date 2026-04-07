---
title: "Bước 6: Remote State"
description: Lưu Terraform state trên S3 với DynamoDB locking — cấu hình backend, migrate state và làm việc nhóm an toàn.
sidebar_position: 7
---

# Bước 6: Remote State với S3 + DynamoDB

Mặc định Terraform lưu state tại `terraform.tfstate` trên máy local. Khi làm nhóm hoặc CI/CD, cần **remote state** để:
- Chia sẻ state giữa nhiều người
- Tránh conflict khi nhiều người apply cùng lúc (locking)
- Không mất state khi máy local hỏng

## Kiến trúc Remote State

```
┌─────────────────────────────────────────────────────┐
│                   Remote State                       │
│                                                     │
│  ┌──────────────────┐    ┌──────────────────────┐   │
│  │   S3 Bucket      │    │  DynamoDB Table      │   │
│  │                  │    │                      │   │
│  │  terraform.tfstate│   │  LockID (primary key)│   │
│  │  (encrypted)     │    │  State locking       │   │
│  └──────────────────┘    └──────────────────────┘   │
│           ▲                        ▲                 │
│           │ read/write             │ lock/unlock      │
│           └────────────┬───────────┘                 │
│                        │                             │
│              Terraform CLI                           │
└─────────────────────────────────────────────────────┘
```

## Bước 1: Tạo S3 Bucket và DynamoDB (một lần duy nhất)

Tạo file `bootstrap/main.tf` — chạy trước khi setup backend:

```hcl
# bootstrap/main.tf — Chạy một lần để tạo infrastructure cho remote state
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"
}

# S3 bucket lưu state files
resource "aws_s3_bucket" "terraform_state" {
  bucket = "myapp-terraform-state-${random_id.suffix.hex}"

  # Ngăn xóa nhầm bucket
  lifecycle {
    prevent_destroy = true
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}

# Bật versioning — có thể rollback state
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Mã hóa state file
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Chặn public access
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket                  = aws_s3_bucket.terraform_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# DynamoDB table cho state locking
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "myapp-terraform-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

output "s3_bucket_name" {
  value = aws_s3_bucket.terraform_state.bucket
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.terraform_locks.name
}
```

```bash
cd bootstrap
terraform init
terraform apply
# Ghi lại output: s3_bucket_name và dynamodb_table_name
```

## Bước 2: Cấu hình Backend trong Project Chính

Cập nhật `versions.tf`:

```hcl
terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Thêm backend block
  backend "s3" {
    bucket         = "myapp-terraform-state-XXXX"  # Thay bằng tên bucket thật
    key            = "ec2-guide/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "myapp-terraform-locks"
  }
}
```

:::tip Key path theo environment
Dùng key khác nhau cho dev/prod:
- `ec2-guide/dev/terraform.tfstate`
- `ec2-guide/prod/terraform.tfstate`
:::

## Bước 3: Migrate State Local → Remote

Nếu đã có state local, migrate lên S3:

```bash
# Init lại với backend mới — Terraform sẽ hỏi có muốn migrate không
terraform init -migrate-state

# Output:
# Initializing the backend...
# Do you want to copy existing state to the new backend? (yes/no)
# > yes
# Successfully configured the backend "s3"!
```

## Bước 4: Kiểm tra

```bash
# Xem state đang ở đâu
terraform state list

# Pull state về xem (không modify)
terraform state pull

# Kiểm tra trên AWS Console: S3 bucket → object terraform.tfstate
```

## Partial Backend Config (Khuyến nghị cho Team)

Không hardcode tên bucket trong `versions.tf` — truyền qua file config:

```hcl
# versions.tf — chỉ khai báo type
terraform {
  backend "s3" {}
}
```

```hcl
# backend.hcl — gitignore file này nếu có thông tin nhạy cảm
# hoặc commit nếu không có secret
bucket         = "myapp-terraform-state-xxxx"
key            = "ec2-guide/terraform.tfstate"
region         = "ap-southeast-1"
encrypt        = true
dynamodb_table = "myapp-terraform-locks"
```

```bash
# Init với backend config file
terraform init -backend-config="backend.hcl"
```

## State Locking hoạt động như thế nào?

```bash
# Khi bạn chạy terraform apply:
# 1. Terraform ghi lock vào DynamoDB: LockID = "myapp-terraform-state-xxx/terraform.tfstate"
# 2. Apply chạy...
# 3. Nếu người khác chạy apply cùng lúc → báo lỗi:
#    Error: Error acquiring the state lock
#    Lock Info: ID=xxx, Who=user@machine, Operation=apply

# Nếu process bị kill và lock không tự release:
terraform force-unlock LOCK_ID
```

## Commit

```bash
git add versions.tf bootstrap/
git commit -m "feat(terraform): thêm S3 remote state backend với DynamoDB locking"
```
