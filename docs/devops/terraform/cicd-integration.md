---
title: CI/CD Integration
description: Chạy Terraform trong CI/CD pipeline — GitHub Actions workflow, automated plan/apply và best practices cho production.
sidebar_position: 10
---

# CI/CD Integration

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Tại sao Terraform trong CI/CD?
- Đảm bảo mọi thay đổi hạ tầng qua code review
- Tự động validate và plan trước khi merge
- Audit trail: ai approve, khi nào apply
- Không ai apply từ máy local → giảm "works on my machine"

### GitHub Actions Workflow cơ bản
```yaml
# .github/workflows/terraform.yml
name: Terraform

on:
  pull_request:
    paths: ['infrastructure/**']
  push:
    branches: [main]
    paths: ['infrastructure/**']

jobs:
  terraform:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write  # Để comment plan output vào PR

    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: "~1.5"

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/TerraformGitHubRole
          aws-region: ap-southeast-1

      - name: Terraform Init
        run: terraform init
        working-directory: infrastructure/

      - name: Terraform Plan
        id: plan
        run: terraform plan -no-color -out=tfplan
        working-directory: infrastructure/

      - name: Comment Plan on PR
        uses: actions/github-script@v7
        if: github.event_name == 'pull_request'
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '${{ steps.plan.outputs.stdout }}'
            })

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply tfplan
        working-directory: infrastructure/
```

### Authentication an toàn trong CI/CD
- **Khuyến nghị**: OIDC (OpenID Connect) — không cần long-lived credentials
- GitHub Actions → assume AWS IAM Role qua OIDC
- Không dùng `AWS_ACCESS_KEY_ID` trong secrets nếu có thể

### Atlantis — Terraform PR Automation
- Self-hosted bot tự động plan/apply từ PR comments
- `atlantis plan` trong PR comment → bot chạy plan và post kết quả
- `atlantis apply` → bot apply (sau khi đã approve)
- Tốt cho team lớn cần workflow rõ ràng

### Terraform Cloud / HCP Terraform
- Managed service cho remote state, remote execution, policy as code
- Free tier đủ dùng cho team nhỏ
- Tích hợp sẵn với GitHub, GitLab

### Best Practices
- **Luôn review plan output** trước khi approve merge
- **Chạy `validate` và `fmt`** trong CI để catch syntax errors sớm
- **Separate jobs**: plan (on PR) và apply (on merge to main)
- **Environment-specific workflows**: dev auto-apply, prod require approval
- **Notify khi apply** — Slack, email thông báo thay đổi hạ tầng
