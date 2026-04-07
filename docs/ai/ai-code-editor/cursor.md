---
title: Cursor
description: Cursor IDE — AI-powered code editor phổ biến nhất hiện nay. Setup, tính năng và tips dùng hiệu quả.
sidebar_position: 2
---

# Cursor

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Tại sao Cursor?
- Fork của VS Code — giữ nguyên extensions, keybindings quen thuộc
- AI hiểu cả codebase thay vì chỉ file đang mở
- Nhiều model lựa chọn: Claude Sonnet, GPT-4o, Gemini
- Cộng đồng lớn, update liên tục

### Cài đặt và Setup
- Download và cấu hình ban đầu
- Import settings từ VS Code
- Cấu hình AI model (Claude vs GPT-4o)
- `.cursorrules` — custom instructions cho project

### Tab Completion (Autocomplete)
- Không chỉ gợi ý từ tiếp theo — dự đoán cả function, block
- Next edit prediction — biết bạn sẽ sửa ở đâu tiếp theo
- Chấp nhận từng từ (Ctrl+→) hoặc cả đề xuất (Tab)

### Chat (Ctrl+L)
- Chat với context file đang mở
- `@file`, `@folder` — thêm file cụ thể vào context
- `@codebase` — tìm kiếm trong toàn bộ project
- `@docs` — reference documentation external
- `@web` — search web real-time

### Inline Edit (Ctrl+K)
- Chọn code → Ctrl+K → mô tả thay đổi → xem diff
- Không cần mở chat panel
- Tốt nhất cho: sửa function nhỏ, đổi tên biến, thêm error handling

### Cursor Agent (Ctrl+Shift+I hoặc "Agent" mode)
- Tự động thực hiện nhiều bước: đọc file, viết code, chạy terminal
- Tốt cho task phức tạp hơn single-file edit
- Khác Claude Code: Agent chạy trong GUI, Claude Code chạy trong terminal

### .cursorrules — Project-level Instructions
```
# Dự án này dùng:
- TypeScript strict mode
- React functional components
- Vitest cho testing
- Luôn thêm error handling
- Comment bằng tiếng Việt
```

### Tips thực tế
- Dùng `@` mentions để cho AI đúng context
- Composer cho task multi-file, inline edit cho task nhỏ
- Review diff kỹ trước khi accept — không accept mù quáng
- Dùng "Restore checkpoint" nếu AI làm hỏng code
