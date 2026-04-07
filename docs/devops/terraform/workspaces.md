---
title: Workspaces
description: Quản lý nhiều environments (dev/staging/prod) với Terraform Workspaces — cách dùng và khi nào nên dùng.
sidebar_position: 9
---

# Workspaces

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Workspaces là gì?
- Cho phép dùng cùng một codebase nhưng có **state riêng biệt** cho từng môi trường
- Mặc định có workspace `default`
- Phù hợp khi dev/staging/prod có cấu hình gần giống nhau

### Các lệnh cơ bản
```bash
terraform workspace list       # Liệt kê workspaces
terraform workspace new dev    # Tạo workspace mới
terraform workspace select prod  # Chuyển sang workspace
terraform workspace show       # Xem workspace hiện tại
terraform workspace delete dev # Xóa workspace
```

### Dùng workspace trong code
```hcl
# Lấy tên workspace hiện tại
locals {
  environment = terraform.workspace  # "dev", "staging", "prod"

  instance_type = {
    dev     = "t2.micro"
    staging = "t2.small"
    prod    = "t2.medium"
  }
}

resource "aws_instance" "web" {
  instance_type = local.instance_type[terraform.workspace]
  # dev → t2.micro, prod → t2.medium
}
```

### Workflow với Workspaces
```bash
# Dev environment
terraform workspace select dev
terraform apply -var-file="dev.tfvars"

# Production environment
terraform workspace select prod
terraform apply -var-file="prod.tfvars"
```

### Workspaces vs Multiple State Files vs Directories
| Approach | Pros | Cons |
|----------|------|------|
| **Workspaces** | Đơn giản, một codebase | Khó isolate config lớn |
| **Separate directories** | Isolate hoàn toàn, rõ ràng | Duplicate code |
| **Terragrunt** | DRY + isolate | Cần học thêm tool |

### Khi nào KHÔNG nên dùng Workspaces?
- Production và staging có cấu hình **rất khác nhau**
- Cần isolate permissions (ai được apply prod?)
- Trường hợp đó: dùng **separate directories** hoặc **Terragrunt**
