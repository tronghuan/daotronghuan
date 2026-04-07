---
title: AI Coding Agent / CLI
description: AI tự chạy nhiều bước liên tiếp — đọc file, viết code, chạy lệnh, sửa lỗi — không cần giám sát từng bước.
sidebar_position: 1
---

# AI Coding Agent / CLI

AI Coding Agent là bước tiến tiếp theo: thay vì AI **đề xuất** code cho bạn làm, AI **tự thực hiện** toàn bộ task — đọc file, viết code, chạy lệnh, sửa lỗi, và lặp lại cho đến khi hoàn thành.

## Điểm khác biệt

| | AI Chat | AI Code Editor | AI Coding Agent |
|---|---|---|---|
| **Tương tác** | Hỏi-đáp | Inline trong editor | Giao task, AI tự làm |
| **Scope** | Một câu hỏi | Một vài file | Toàn bộ codebase |
| **Autonomy** | Không | Thấp | Cao |
| **Tốt cho** | Brainstorm | Code nhanh | Task lớn, phức tạp |

## Khi nào dùng AI Coding Agent?

- **Task nhiều bước**: "Thêm authentication từ đầu đến cuối — backend route, middleware, frontend form"
- **Codebase-wide changes**: "Đổi tên tất cả `userId` → `user_id` theo đúng convention"
- **Scaffold nhanh**: "Tạo CRUD endpoints cho entity mới theo pattern hiện tại"
- **Tự động hóa**: Chạy trong CI/CD pipeline, không cần người ngồi chờ

## Các tools phổ biến

| Tool | Công ty | Đặc điểm |
|------|---------|-----------|
| **Claude Code** | Anthropic | CLI mạnh, CLAUDE.md context, subagents |
| **Aider** | Open source | Git-aware, nhiều model, lightweight |
| **Gemini CLI** | Google | Tích hợp Google services |
| **GitHub Copilot Workspace** | GitHub | Web-based, tích hợp GitHub issues/PRs |

## Bài viết trong series

| Bài | Nội dung |
|-----|----------|
| [Claude Code](./claude-code) | Claude Code CLI — cách dùng, CLAUDE.md, agents, tips |
| [Workflow thực tế](./workflow) | Task lớn, tự động hóa và best practices với AI Agent |

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!
