---
title: Providers
description: Cấu hình Terraform providers — AWS, version constraints, authentication và dùng nhiều providers cùng lúc.
sidebar_position: 5
---

# Providers

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Provider là gì?
- Plugin dịch Terraform resource sang API calls của cloud/service
- Hơn 3000 providers trên Terraform Registry
- Phổ biến: AWS, Azure, GCP, Kubernetes, GitHub, Cloudflare, Datadog

### Khai báo Provider
```hcl
# versions.tf — luôn tách ra file riêng
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"   # cho phép 5.x, không cho 6.x
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

### Version Constraints
| Syntax | Ý nghĩa |
|--------|---------|
| `= 5.0.0` | Chính xác version này |
| `>= 5.0.0` | Version này trở lên |
| `~> 5.0` | 5.x (minor updates OK, major không) |
| `~> 5.0.0` | 5.0.x (patch updates OK) |
| `>= 4.0, < 6.0` | Trong khoảng |

### Authentication với AWS
```hcl
# Cách 1: Environment variables (khuyến nghị cho local)
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION

# Cách 2: AWS Profile
provider "aws" {
  region  = "ap-southeast-1"
  profile = "my-dev-profile"
}

# Cách 3: IAM Role (khuyến nghị cho CI/CD)
provider "aws" {
  region = "ap-southeast-1"
  assume_role {
    role_arn = "arn:aws:iam::123456789:role/TerraformRole"
  }
}
```

### Multiple Providers & Aliases
```hcl
# Deploy resources trên nhiều regions
provider "aws" {
  region = "ap-southeast-1"  # Singapore (default)
}

provider "aws" {
  alias  = "us_east"
  region = "us-east-1"
}

# Dùng provider alias
resource "aws_s3_bucket" "cdn" {
  provider = aws.us_east
  bucket   = "my-cdn-bucket"
}
```

### .terraform.lock.hcl
- Auto-generated sau `terraform init`
- Lock version cụ thể của providers
- **Commit file này vào Git** để team dùng cùng version
