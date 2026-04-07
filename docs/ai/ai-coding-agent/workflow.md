---
title: Workflow thực tế với AI Coding Agent
description: Giao task lớn cho AI Agent, tự động hóa workflow và best practices để không mất control.
sidebar_position: 3
---

# Workflow thực tế với AI Coding Agent

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Workflow 1: Scaffold tính năng mới từ đầu
```
Prompt: "Tạo CRUD API cho entity 'Product'.
Theo pattern hiện tại trong src/controllers/User.
Bao gồm: controller, service, repository, routes, tests.
Dùng TypeScript, Prisma, theo conventions trong CLAUDE.md."
```
AI tự: đọc code hiện tại → tạo các files → update routes → viết tests

### Workflow 2: Codebase-wide Refactor
```
Prompt: "Tất cả async functions trong src/services/ đang dùng
.then().catch(). Refactor sang async/await.
Giữ nguyên logic, chỉ đổi syntax."
```
AI tự: tìm tất cả files → sửa từng file → verify không break

### Workflow 3: Bug Fix từ Error Log
```
Prompt: "Đây là error log từ production: [paste log].
Tìm nguyên nhân trong codebase và fix."
```
AI tự: tìm file liên quan → trace logic → đề xuất fix → implement

### Workflow 4: Tự động hóa trong CI/CD
- Chạy Claude Code trong GitHub Actions
- Auto-fix lint errors sau khi push
- Generate release notes từ commits

### Những điều cần chú ý
- **Luôn review trước khi commit** — AI có thể hiểu sai yêu cầu
- **Commit thường xuyên** — dễ rollback nếu AI làm hỏng
- **Context rõ ràng** — task mơ hồ = kết quả không đoán được
- **Bắt đầu nhỏ** — test với task nhỏ trước khi giao task lớn

### Kết hợp 3 loại tool hiệu quả
```
Buổi sáng brainstorm architecture → AI Chat (Claude.ai)
Viết code chi tiết → AI Code Editor (Cursor)
Task lớn cần tự động hóa → AI Coding Agent (Claude Code)
```
