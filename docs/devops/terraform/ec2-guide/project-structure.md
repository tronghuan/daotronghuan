---
title: "Bước 2: Cấu trúc project & Git"
description: Khởi tạo project Terraform đúng cách — cấu trúc files, .gitignore và git init trước khi viết code.
sidebar_position: 3
---

# Bước 2: Cấu trúc project & Git

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Tạo thư mục và khởi tạo Git

```bash
mkdir terraform-ec2 && cd terraform-ec2
git init
```

### Tạo .gitignore ngay từ đầu

Đây là bước **quan trọng nhất** trước khi viết bất kỳ file Terraform nào:

```bash
# .gitignore cho Terraform project
cat > .gitignore << 'EOF'
# =============================================
# TERRAFORM — KHÔNG COMMIT
# =============================================

# State files — chứa thông tin nhạy cảm, thay đổi liên tục
*.tfstate
*.tfstate.*
*.tfstate.backup

# Thư mục terraform tải về (providers, modules)
.terraform/
.terraform.tfstate

# Crash log files
crash.log
crash.*.log

# Override files (dùng cho local testing, không chia sẻ)
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# tfvars files có thể chứa secrets
# ⚠️ THẢO LUẬN bên dưới — tùy project
*.tfvars
*.tfvars.json

# Terraform plan output (binary file)
*.tfplan

# =============================================
# LUÔN COMMIT
# =============================================
# ✅ *.tf            — code hạ tầng
# ✅ *.tf.json       — code dạng JSON
# ✅ .terraform.lock.hcl  — lock provider versions
# ✅ *.tfvars.example     — template tfvars (không có secrets)
EOF
```

### Quy tắc: File nào commit, file nào không?

| File | Commit? | Lý do |
|------|---------|-------|
| `*.tf` | ✅ Luôn commit | Code hạ tầng, cần review và version control |
| `.terraform.lock.hcl` | ✅ Luôn commit | Lock provider versions cho cả team |
| `*.tfvars.example` | ✅ Commit (template) | Mẫu để người khác biết cần khai báo gì |
| `terraform.tfstate` | ❌ Không commit | Chứa secrets, thay đổi liên tục, dùng remote state |
| `*.tfstate.backup` | ❌ Không commit | Backup của state file |
| `.terraform/` | ❌ Không commit | Providers binary, modules cache — tải lại bằng `terraform init` |
| `*.tfvars` (có secrets) | ❌ Không commit | API keys, passwords, account IDs nhạy cảm |
| `dev.tfvars` (không secrets) | 🤔 Tùy team | Nếu chỉ có region, instance type → commit được |
| `*.tfplan` | ❌ Không commit | Binary file, outdated nhanh |

### Thảo luận: `.tfvars` nên commit không?

**Trường hợp 1: Commit .tfvars (giá trị không nhạy cảm)**
```hcl
# dev.tfvars — an toàn để commit
aws_region    = "ap-southeast-1"
instance_type = "t2.micro"
environment   = "dev"
```

**Trường hợp 2: Không commit .tfvars (có secrets)**
```hcl
# prod.tfvars — KHÔNG commit
db_password   = "super-secret-password"
api_key       = "sk-xxxxxxxxxxxx"
account_id    = "123456789012"
```

**Best practice**: Dùng `prod.tfvars.example` làm template, `prod.tfvars` thực tế trong `.gitignore`.

### Cấu trúc files Terraform

```bash
# Tạo cấu trúc files
touch versions.tf providers.tf main.tf networking.tf
touch variables.tf outputs.tf locals.tf
touch dev.tfvars prod.tfvars.example
touch README.md
```

**Quy ước tách file (không bắt buộc nhưng được khuyến nghị):**

| File | Nội dung |
|------|----------|
| `versions.tf` | `terraform {}` block — required_version, required_providers |
| `providers.tf` | `provider "aws" {}` config |
| `networking.tf` | VPC, subnets, IGW, route tables, security groups |
| `main.tf` | EC2, key pair, IAM role — resources chính |
| `variables.tf` | Tất cả `variable` blocks |
| `outputs.tf` | Tất cả `output` blocks |
| `locals.tf` | `locals` block — computed values, tags |

### Commit đầu tiên

```bash
git add .gitignore README.md
git commit -m "chore: khởi tạo terraform project với gitignore"
```

### Kết nối với GitHub

```bash
# Tạo repo trên GitHub (không init README để tránh conflict)
git remote add origin git@github.com-tronghuan:username/terraform-ec2.git
git branch -M main
git push -u origin main
```
