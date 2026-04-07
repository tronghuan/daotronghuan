---
title: "Bước 7: Git Workflow cho Terraform"
description: Commit conventions, branch strategy và PR review cho infrastructure code — bao gồm SSH alias và .gitignore đầy đủ.
sidebar_position: 8
---

# Bước 7: Git Workflow cho Terraform

Infrastructure code cần được quản lý trong Git như application code — với một số điểm đặc biệt vì Terraform có file chứa credentials và state.

## .gitignore hoàn chỉnh cho Terraform

```gitignore
# .gitignore

# ============================================================
# KHÔNG BAO GIỜ COMMIT — Secrets & State
# ============================================================

# State files — chứa toàn bộ infrastructure details, đôi khi có secrets
*.tfstate
*.tfstate.*
*.tfstate.backup

# Thư mục provider plugins — rất nặng (hàng trăm MB)
.terraform/

# Biến môi trường chứa credentials thật
*.env
.env.*

# File tfvars chứa giá trị thật (IP, passwords...)
# Chỉ commit file .example làm template
prod.tfvars
staging.tfvars
*.secret.tfvars

# Override files — local customizations
override.tf
override.tf.json
*_override.tf
*_override.tf.json

# ============================================================
# NÊN COMMIT — Infrastructure definitions
# ============================================================
# *.tf          → resource definitions
# *.tfvars.example → templates không có giá trị thật
# .terraform.lock.hcl → lock file (như package-lock.json)
# dev.tfvars    → môi trường dev thường không có secret nhạy cảm
```

### Tóm tắt: Commit vs Không Commit

| File | Commit? | Lý do |
|------|---------|-------|
| `*.tf` | ✅ Có | Infrastructure definitions |
| `.terraform.lock.hcl` | ✅ Có | Pin provider versions (như package-lock.json) |
| `*.tfvars.example` | ✅ Có | Template cho team |
| `dev.tfvars` | ✅ Thường có | Dev thường không có secret |
| `.terraform/` | ❌ Không | Provider binaries, rất nặng |
| `*.tfstate` | ❌ Không | Dùng remote state (S3) |
| `prod.tfvars` | ❌ Không | Chứa IP thật, credentials |
| `*.env` | ❌ Không | AWS credentials |

## Branch Strategy

```
main
  └── Chỉ chứa code đã review và tested
  └── Không push trực tiếp

feature/infra-xxx  → Tính năng mới (thêm service, module)
fix/infra-xxx      → Sửa lỗi configuration
chore/infra-xxx    → Update versions, cleanup
```

```bash
# Tạo branch mới cho mỗi thay đổi
git checkout -b feature/infra-add-rds

# Sau khi xong, tạo PR để review
git push -u origin feature/infra-add-rds
```

## Commit Message Conventions

Dùng Conventional Commits, thêm scope `(terraform)` hoặc `(infra)`:

```bash
# Thêm resource mới
git commit -m "feat(infra): thêm RDS PostgreSQL cho production"

# Sửa configuration
git commit -m "fix(infra): tăng instance type từ t2.micro lên t3.small"

# Cập nhật variables
git commit -m "feat(terraform): thêm variables cho multi-environment support"

# Cập nhật provider version
git commit -m "chore(terraform): update AWS provider từ 5.0 lên 5.31"

# Thêm module
git commit -m "feat(infra): extract networking thành reusable module"

# Thay đổi cần destroy/recreate (QUAN TRỌNG — ghi rõ impact)
git commit -m "feat(infra): thay đổi subnet CIDR — requires destroy/recreate

BREAKING CHANGE: EC2 instances sẽ bị terminate và tạo lại.
Cần maintenance window trước khi apply."
```

## Push lên Git với SSH Alias

Nếu dùng nhiều tài khoản GitHub trên cùng một máy, cần cấu hình SSH alias:

```bash
# ~/.ssh/config
Host github.com-tronghuan
  HostName github.com
  User git
  IdentityFile ~/.ssh/sharecode
```

```bash
# Clone repo dùng alias
git clone git@github.com-tronghuan:username/terraform-ec2.git

# Hoặc nếu đã có repo, đổi remote URL
git remote set-url origin git@github.com-tronghuan:username/terraform-ec2.git

# Push bình thường sau khi set remote
git push origin feature/infra-add-rds

# Kiểm tra remote URL
git remote -v
# origin  git@github.com-tronghuan:username/terraform-ec2.git (fetch)
# origin  git@github.com-tronghuan:username/terraform-ec2.git (push)
```

:::warning Đổi remote URL ngay từ đầu
Nếu clone bằng HTTPS (`https://github.com/...`), push sẽ dùng sai credentials.  
Luôn kiểm tra `git remote -v` và đổi sang SSH alias nếu cần.
:::

## Workflow hoàn chỉnh: Thêm một Resource mới

```bash
# 1. Tạo branch
git checkout main
git pull origin main
git checkout -b feature/infra-add-s3-bucket

# 2. Viết code
# Thêm resource vào main.tf hoặc file mới s3.tf

# 3. Test locally
terraform fmt        # Format code
terraform validate   # Kiểm tra syntax
terraform plan -var-file="dev.tfvars"   # Xem thay đổi

# 4. Stage và commit — chỉ commit .tf files, không commit state
git add s3.tf variables.tf
git status           # Kiểm tra không có file nhạy cảm
git commit -m "feat(infra): thêm S3 bucket cho static assets"

# 5. Push
git push -u origin feature/infra-add-s3-bucket

# 6. Tạo Pull Request để review trước khi apply production
```

## PR Review Checklist cho Terraform

Trước khi merge và apply, reviewer cần kiểm tra:

```markdown
## Terraform PR Checklist

### Code Quality
- [ ] `terraform fmt` đã được chạy (code được format đúng)
- [ ] `terraform validate` pass (không có syntax error)
- [ ] Variables có description và type rõ ràng
- [ ] Outputs được khai báo cho values quan trọng

### Security
- [ ] Không có secrets hoặc credentials trong code
- [ ] Security groups: chỉ mở port cần thiết
- [ ] S3 buckets: public access bị chặn nếu không cần
- [ ] IAM roles: principle of least privilege

### State & Breaking Changes
- [ ] Không có *.tfstate file trong commit
- [ ] Không có .terraform/ directory trong commit
- [ ] Nếu có breaking change (destroy/recreate): đã ghi rõ trong commit message
- [ ] Remote state đã được cấu hình

### Plan Output
- [ ] Đã paste terraform plan output vào PR description
- [ ] Số lượng resources thay đổi hợp lý
- [ ] Không có unexpected destroy
```

## Apply sau khi Merge

```bash
# Sau khi PR được merge vào main
git checkout main
git pull origin main

# Apply dev trước để verify
terraform workspace select dev
terraform apply -var-file="dev.tfvars"

# Nếu dev ok, apply prod
terraform workspace select prod
terraform apply -var-file="prod.tfvars" \
  -var="allowed_ssh_cidr=$(curl -s ifconfig.me)/32"
```

## Tổng kết Series

Bạn đã hoàn thành series EC2 với Terraform:

| Bước | Nội dung | File chính |
|------|----------|------------|
| 1 | Setup Terraform + AWS CLI | `~/.aws/credentials` |
| 2 | Project structure + .gitignore | `.gitignore`, `versions.tf` |
| 3 | VPC + Networking | `vpc.tf`, `security-groups.tf` |
| 4 | EC2 Instance + IAM | `ec2.tf`, `iam.tf`, `outputs.tf` |
| 5 | Variables + Environments | `variables.tf`, `dev.tfvars` |
| 6 | Remote State | `backend.hcl`, S3 + DynamoDB |
| 7 | Git Workflow | `.gitignore`, SSH alias, PR flow |

Infrastructure của bạn bây giờ:
- **Repeatable**: Chạy `terraform apply` là có đúng infrastructure
- **Version controlled**: Mọi thay đổi đều có history trong Git
- **Team-ready**: Remote state + locking + PR review
- **Secure**: Secrets không bao giờ vào Git
