---
title: Workflow thực tế với AI Code Editor
description: Các pattern dùng Cursor và AI Code Editor hàng ngày — từ thêm tính năng đến refactor codebase lớn.
sidebar_position: 3
---

# Workflow thực tế với AI Code Editor

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Workflow 1: Thêm tính năng mới
```
1. Mô tả tính năng trong Composer/Agent: "Thêm pagination cho danh sách X"
2. AI đọc code hiện tại, hiểu pattern đang dùng
3. AI tạo code theo đúng style của project
4. Review diff, điều chỉnh nếu cần
5. Chạy tests
```

### Workflow 2: Hiểu codebase mới (onboarding)
```
Chat: "@codebase Luồng xử lý authentication trong project này như thế nào?"
Chat: "@folder src/services Giải thích vai trò của mỗi service"
Chat: "@file UserController.ts Tôi cần thêm endpoint mới, nên đặt ở đâu?"
```

### Workflow 3: Refactor an toàn
```
1. Chat: "Tôi muốn refactor [function] để [lý do]. Đề xuất approach?"
2. Review approach với AI trước
3. Dùng Composer: "Thực hiện refactor như đã thảo luận"
4. Review toàn bộ diff trước khi accept
5. Chạy tests để verify không break gì
```

### Workflow 4: Fix bug nhanh
```
1. Copy error message + stack trace
2. Ctrl+K trên đoạn code nghi ngờ: "Fix lỗi này: [error]"
3. Hoặc Chat: "Lỗi này xảy ra ở đâu? @codebase"
```

### Workflow 5: Viết Tests
```
Chọn function → Ctrl+K:
"Viết unit tests đầy đủ cho function này.
Dùng Vitest. Happy path + edge cases + error cases."
```

### AI Code Editor vs AI Chat: Chọn cái nào?
- **Cần code ngay vào file** → AI Code Editor
- **Cần tư duy, brainstorm** → AI Chat
- **Task phức tạp, nhiều file** → AI Coding Agent (Claude Code)
- Thực tế: dùng cả 3, tùy ngữ cảnh
