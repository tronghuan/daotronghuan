---
title: Terraform
description: Terraform — Infrastructure as Code tool phổ biến nhất. Provisioning và quản lý hạ tầng cloud bằng code, version control và tự động hóa.
sidebar_position: 1
---

# Terraform

Terraform là công cụ **Infrastructure as Code (IaC)** phổ biến nhất hiện nay, cho phép định nghĩa, provision và quản lý hạ tầng cloud bằng code thay vì click tay trên console.

## Tại sao cần Terraform?

| Vấn đề với manual | Giải pháp với Terraform |
|-------------------|-------------------------|
| Cấu hình khác nhau giữa staging và production | Code giống nhau, chỉ khác variables |
| Không biết ai đã thay đổi gì | Mọi thay đổi qua Git, có history |
| Tạo lại môi trường mất hàng giờ | `terraform apply` tự động hoàn toàn |
| Dễ quên bước nào đó khi setup | Code = documentation |

## Terraform hoạt động như thế nào?

```
[Bạn viết .tf files] → terraform plan → [Xem thay đổi] → terraform apply → [Hạ tầng được tạo]
                                                              ↑
                                                        Terraform gọi Cloud APIs
                                                        (AWS, GCP, Azure, ...)
```

## Các chủ đề trong series

| Bài | Nội dung |
|-----|----------|
| [Core Concepts](./core-concepts) | Provider, Resource, State, Plan/Apply — 5 khái niệm cốt lõi |
| [HCL Syntax](./hcl-syntax) | Cú pháp ngôn ngữ HCL: blocks, expressions, functions |
| [Variables & Outputs](./variables-outputs) | Input variables, locals, outputs, tfvars |
| [Providers](./providers) | Cấu hình providers: AWS, versioning, multiple providers |
| [Resources & Data Sources](./resources-data) | Tạo resources, data sources, dependencies, lifecycle |
| [Modules](./modules) | Tái sử dụng code với modules, Terraform Registry |
| [State Management](./state-management) | State file, remote state trên S3, state locking |
| [Workspaces](./workspaces) | Quản lý nhiều environments (dev/staging/prod) |
| [CI/CD Integration](./cicd-integration) | Chạy Terraform trong GitHub Actions pipeline |

> Nội dung đang được chuẩn bị theo thứ tự. Theo dõi để cập nhật mới nhất!
