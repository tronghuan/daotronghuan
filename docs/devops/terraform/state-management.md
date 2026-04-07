---
title: State Management
description: Terraform state file — remote state trên S3, state locking với DynamoDB và các lệnh quản lý state.
sidebar_position: 8
---

# State Management

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### State file là gì?
- `terraform.tfstate` — JSON file lưu trạng thái hạ tầng hiện tại
- Terraform dùng state để biết resource nào đã tạo, cần update hay delete
- **Không commit `terraform.tfstate` vào Git** — chứa secrets, thay đổi liên tục

### Vấn đề với local state (team làm việc)
- Ai giữ file state? Conflict khi nhiều người apply cùng lúc?
- **Giải pháp: Remote State**

### Remote State với AWS S3
```hcl
# backend.tf
terraform {
  backend "s3" {
    bucket         = "my-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "ap-southeast-1"
    encrypt        = true

    # State locking với DynamoDB
    dynamodb_table = "terraform-state-lock"
  }
}
```

### State Locking
- Ngăn 2 người apply cùng lúc → conflict state
- DynamoDB table dùng làm lock mechanism
- Tự động lock khi `plan`/`apply`/`destroy`, tự động unlock khi xong
- Force unlock nếu bị kẹt: `terraform force-unlock <lock-id>`

### Tạo S3 bucket và DynamoDB table cho remote state
```hcl
# bootstrap/main.tf — tạo infrastructure cho terraform itself
resource "aws_s3_bucket" "terraform_state" {
  bucket = "my-terraform-state-${data.aws_caller_identity.current.account_id}"

  lifecycle {
    prevent_destroy = true  # KHÔNG cho xóa bucket này
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-state-lock"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}
```

### Các lệnh quản lý state
```bash
terraform state list                          # Liệt kê tất cả resources trong state
terraform state show aws_instance.web         # Xem chi tiết một resource
terraform state mv aws_instance.old aws_instance.new   # Đổi tên resource trong state
terraform state rm aws_s3_bucket.legacy       # Xóa khỏi state (không xóa thực tế)
terraform import aws_s3_bucket.existing my-bucket-name # Import resource có sẵn
```

### Terraform Workspaces và State
- Mỗi workspace có state file riêng biệt
- `default` workspace dùng `terraform.tfstate`
- Workspace `dev` dùng `terraform.tfstate.d/dev/terraform.tfstate`
