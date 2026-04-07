---
title: Tổng quan series
description: Series thực hành provision EC2 trên AWS bằng Terraform — từ setup môi trường đến Git workflow chuẩn cho team.
sidebar_position: 1
---

# Thực hành: EC2 với Terraform

Series thực hành từng bước — kết thúc series bạn sẽ có một EC2 web server hoàn chỉnh trên AWS, được provision bằng Terraform và quản lý Git đúng cách.

## Kiến trúc sẽ xây dựng

```
                    Internet
                       │
               [Internet Gateway]
                       │
            [VPC: 10.0.0.0/16]
                       │
         [Public Subnet: 10.0.1.0/24]
                       │
        [Security Group: allow 80, 443, 22]
                       │
              [EC2: t2.micro]
              - Amazon Linux 2
              - Nginx web server
              - Key pair SSH access
              - IAM Role (SSM access)
```

## Cấu trúc project cuối series

```
terraform-ec2/
├── .git/
├── .gitignore              ← Terraform-specific ignores
├── README.md
├── versions.tf             ← Terraform + provider versions
├── providers.tf            ← AWS provider config
├── main.tf                 ← Resources chính
├── networking.tf           ← VPC, subnets, security groups
├── variables.tf            ← Khai báo tất cả variables
├── outputs.tf              ← Outputs (IP, DNS...)
├── locals.tf               ← Local values + tags
├── dev.tfvars              ← Giá trị cho dev environment
├── prod.tfvars             ← Giá trị cho prod environment
└── .terraform.lock.hcl     ← Provider version lock (commit file này)
```

## Các bước trong series

| Bài | Nội dung |
|-----|----------|
| [1. Setup môi trường](./setup) | Cài Terraform, AWS CLI, cấu hình credentials |
| [2. Cấu trúc project & Git](./project-structure) | Khởi tạo project, .gitignore, git init đúng cách |
| [3. Networking](./networking) | VPC, subnet, Internet Gateway, Security Group |
| [4. EC2 Instance](./ec2-instance) | Key pair, EC2, IAM Role, user data script |
| [5. Variables & Environments](./variables-envs) | Dev/prod configs, .tfvars, locals |
| [6. Remote State](./remote-state) | S3 backend + DynamoDB locking cho team |
| [7. Git Workflow](./git-workflow) | Commit conventions, branch strategy, PR flow cho Terraform |

:::tip Yêu cầu
- AWS account (free tier đủ dùng)
- Terraform >= 1.5 đã cài
- AWS CLI đã cài và cấu hình
- Git đã cài
:::
