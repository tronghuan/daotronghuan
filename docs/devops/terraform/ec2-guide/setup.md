---
title: "Bước 1: Setup môi trường"
description: Cài đặt Terraform, AWS CLI và cấu hình AWS credentials trước khi bắt đầu viết code.
sidebar_position: 2
---

# Bước 1: Setup môi trường

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Cài đặt Terraform

**macOS (Homebrew):**
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -version  # Kiểm tra: Terraform v1.x.x
```

**Windows (Chocolatey):**
```powershell
choco install terraform
```

**Linux (Ubuntu/Debian):**
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

### Cài đặt AWS CLI v2

```bash
# macOS
brew install awscli

# Verify
aws --version  # aws-cli/2.x.x
```

### Cấu hình AWS Credentials

**Cách 1: AWS Configure (đơn giản nhất cho local)**
```bash
aws configure
# AWS Access Key ID: [your key]
# AWS Secret Access Key: [your secret]
# Default region: ap-southeast-1
# Default output format: json
```
Credentials được lưu tại `~/.aws/credentials` và `~/.aws/config`

**Cách 2: Named Profiles (cho nhiều AWS accounts)**
```bash
aws configure --profile my-dev-account
aws configure --profile my-prod-account

# Dùng profile cụ thể
export AWS_PROFILE=my-dev-account
# Hoặc trong provider.tf: profile = "my-dev-account"
```

**Cách 3: Environment Variables (cho CI/CD)**
```bash
export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_DEFAULT_REGION="ap-southeast-1"
```

### Verify Setup

```bash
# Kiểm tra Terraform
terraform version

# Kiểm tra AWS CLI kết nối được
aws sts get-caller-identity
# Trả về: Account ID, User ARN, User ID

# Kiểm tra quyền cần thiết
aws iam get-user  # Xem thông tin user hiện tại
```

### Quyền AWS cần thiết
Để chạy series này, IAM user/role cần có quyền:
- `AmazonEC2FullAccess`
- `AmazonVPCFullAccess`
- `IAMFullAccess` (để tạo IAM Role cho EC2)
- `AmazonS3FullAccess` (cho remote state ở bài sau)
- `AmazonDynamoDBFullAccess` (cho state locking)

:::warning Không dùng root account
Tạo IAM user riêng với quyền cần thiết thay vì dùng root account.
:::

### VS Code Extensions hữu ích
- **HashiCorp Terraform** — syntax highlighting, autocomplete, hover docs
- **Terraform doc snippets** — snippets cho resources phổ biến
