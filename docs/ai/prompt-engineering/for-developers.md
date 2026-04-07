---
title: Prompt Patterns cho Developer
description: Các prompt template thực tế cho developer — debug, review, refactor, generate tests và viết docs.
sidebar_position: 3
---

# Prompt Patterns cho Developer

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Template: Debug
```
Context: Tôi đang xây dựng [mô tả app]. Tech stack: [stack].
Vấn đề: [Mô tả vấn đề].
Code liên quan: [paste code]
Error message: [paste error]
Tôi đã thử: [những gì đã thử]
Câu hỏi: Nguyên nhân là gì và cách fix?
```

### Template: Code Review
```
Review đoạn code sau với focus vào:
1. Correctness — logic có đúng không?
2. Security — có vulnerabilities không?
3. Performance — có bottleneck không?
4. Readability — có thể cải thiện gì?
Cho feedback theo format: [Vấn đề] → [Đề xuất fix]
[paste code]
```

### Template: Refactor
```
Refactor function này để [mục tiêu: readable hơn / performant hơn / testable hơn].
Constraints:
- Giữ nguyên public interface (function signature)
- Không thêm dependencies mới
- Dùng [pattern cụ thể nếu có]
[paste code]
```

### Template: Generate Tests
```
Viết unit tests đầy đủ cho function này.
Framework: [Jest/Vitest/pytest...]
Bao gồm:
- Happy path (1-2 cases)
- Edge cases: [liệt kê hoặc để AI tự nghĩ]
- Error cases: invalid input, null, empty
Format: AAA pattern (Arrange-Act-Assert)
[paste function]
```

### Template: Explain Code
```
Giải thích đoạn code này.
Tôi cần hiểu:
1. Nó làm gì (high-level)?
2. Tại sao dùng approach này?
3. Có điểm nào cần chú ý khi maintain không?
[paste code]
```

### Template: Architecture Design
```
Tôi cần thiết kế [feature/system].
Requirements:
- [requirement 1]
- [requirement 2]
Constraints:
- Tech stack hiện tại: [stack]
- [constraint khác]
Hãy đề xuất 2-3 approaches với trade-offs của mỗi cách.
```

### System Prompts cho AI API
- Cấu trúc system prompt tốt cho chatbot
- Persona + constraints + output format
- Ví dụ: system prompt cho customer support bot
