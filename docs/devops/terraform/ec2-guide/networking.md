---
title: "Bước 3: Networking"
description: Tạo VPC, public subnet, Internet Gateway, route table và Security Group cho EC2 bằng Terraform.
sidebar_position: 4
---

# Bước 3: Networking

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### versions.tf
```hcl
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
```

### providers.tf
```hcl
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}
```

### locals.tf
```hcl
locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }

  name_prefix = "${var.project_name}-${var.environment}"
}
```

### networking.tf — VPC, Subnet, IGW, Route Table

```hcl
# VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "${local.name_prefix}-vpc" }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true  # EC2 tự nhận public IP

  tags = { Name = "${local.name_prefix}-public-subnet" }
}

# Internet Gateway — cho phép traffic ra internet
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = { Name = "${local.name_prefix}-igw" }
}

# Route Table — định tuyến traffic ra IGW
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "${local.name_prefix}-public-rt" }
}

# Associate subnet với route table
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}
```

### Security Group
```hcl
resource "aws_security_group" "web" {
  name        = "${local.name_prefix}-web-sg"
  description = "Security group for web server"
  vpc_id      = aws_vpc.main.id

  # Inbound: HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Inbound: HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Inbound: SSH — giới hạn từ IP của bạn
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]  # "1.2.3.4/32" — IP của bạn
  }

  # Outbound: Cho phép tất cả
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${local.name_prefix}-web-sg" }
}
```

### Chạy và kiểm tra
```bash
terraform init     # Tải AWS provider
terraform fmt      # Format code
terraform validate # Kiểm tra syntax
terraform plan     # Xem sẽ tạo những gì
terraform apply    # Tạo networking resources
```

### Commit sau khi networking hoạt động
```bash
git add versions.tf providers.tf networking.tf locals.tf variables.tf
git commit -m "feat(networking): thêm VPC, subnet, IGW, security group"
```
