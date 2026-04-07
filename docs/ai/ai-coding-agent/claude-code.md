---
title: Claude Code
description: Claude Code CLI — AI coding agent chạy trong terminal, tự động thực hiện task phức tạp với context cả codebase.
sidebar_position: 2
---

# Claude Code

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Claude Code là gì?
- CLI tool của Anthropic chạy trong terminal
- Đọc codebase, viết code, chạy lệnh, sửa lỗi — tự động
- Tích hợp với git, biết context của project
- Khác Cursor Agent: terminal-first, dùng được không cần GUI

### Cài đặt và Setup
```bash
npm install -g @anthropic-ai/claude-code
claude-code  # hoặc: claude
```

### CLAUDE.md — Bộ nhớ dài hạn cho project
- File đặt ở root project, tự động load mỗi session
- Khai báo: tech stack, conventions, commands thường dùng
- Giống như "onboarding doc" cho AI
- Ví dụ nội dung CLAUDE.md thực tế

### Các tính năng chính
- **Autonomous task execution** — giao task, AI tự làm nhiều bước
- **Codebase awareness** — hiểu project structure, patterns
- **Tool use** — đọc/viết file, chạy bash, search code
- **Subagents** — spawn agent con để làm việc song song
- **Memory system** — ghi nhớ context qua nhiều session
- **Hooks** — custom behavior trước/sau tool calls

### Slash Commands
- `/help` — xem danh sách commands
- `/memory` — xem và quản lý memory
- `/review` — review code (nếu project có command)
- Custom commands trong `.claude/commands/`

### Permission Modes
- **Default** — hỏi trước mỗi action quan trọng
- `--dangerously-skip-permissions` — tự động accept (dùng thận trọng)
- `.claude/settings.json` — whitelist các lệnh được phép chạy tự động

### Tips thực tế
- Cung cấp CLAUDE.md đầy đủ — tiết kiệm thời gian giải thích context
- Dùng `/review` trước khi commit
- Đặt câu hỏi cụ thể: "thêm tính năng X theo pattern hiện tại của Y"
- Kết hợp với Cursor: Claude Code cho task lớn, Cursor cho edit nhanh
