---
title: Modules
description: Tổ chức và tái sử dụng Terraform code với modules — tạo module, dùng module từ Registry và module versioning.
sidebar_position: 7
---

# Modules

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Module là gì?
- Tập hợp các `.tf` files trong một folder
- Tái sử dụng hạ tầng như function trong lập trình
- Ví dụ: module `vpc`, module `ec2-autoscaling`, module `rds`

### Cấu trúc module chuẩn
```
modules/
└── vpc/
    ├── main.tf       # Resources chính
    ├── variables.tf  # Input variables
    ├── outputs.tf    # Output values
    └── README.md     # Documentation
```

### Gọi module
```hcl
# Root module gọi child module
module "vpc" {
  source = "./modules/vpc"   # local path

  # Hoặc từ Terraform Registry:
  # source  = "terraform-aws-modules/vpc/aws"
  # version = "~> 5.0"

  # Truyền variables vào module
  vpc_cidr    = "10.0.0.0/16"
  environment = var.environment
}

# Dùng output của module
resource "aws_instance" "web" {
  subnet_id = module.vpc.public_subnet_ids[0]
}
```

### Terraform Registry Modules phổ biến
- `terraform-aws-modules/vpc/aws` — VPC với subnets, IGW, NAT
- `terraform-aws-modules/eks/aws` — EKS cluster
- `terraform-aws-modules/rds/aws` — RDS instance
- `terraform-aws-modules/s3-bucket/aws` — S3 với best practices

### Module Versioning
```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"   # Pin version như provider
}
```

### Module Composition — Lồng modules
```
root/
├── main.tf              ← gọi module networking, compute, database
├── modules/
│   ├── networking/      ← VPC, subnets, security groups
│   ├── compute/         ← EC2, Auto Scaling, Load Balancer
│   └── database/        ← RDS, parameter groups, subnet groups
```

### Best Practices
- Mỗi module có một mục đích rõ ràng
- Input variables đầy đủ type và description
- Output những gì module con cần
- README với usage examples
- Pin module versions trong production
