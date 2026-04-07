---
title: Nguyên tắc cơ bản
description: 5 nguyên tắc viết prompt hiệu quả — rõ ràng, có context, có ví dụ, định format output và kiểm tra kết quả.
sidebar_position: 2
---

# Nguyên tắc cơ bản của Prompt Engineering

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Nguyên tắc 1: Rõ ràng và cụ thể
- AI không đọc được ý nghĩ — cần nói rõ muốn gì
- Tệ: "Viết code hay"
- Tốt: "Viết function tính thuế VAT 10%, nhận vào số tiền, trả về số tiền sau thuế, dùng TypeScript"

### Nguyên tắc 2: Cung cấp đủ Context
- Cho AI biết: bạn là ai, đang làm gì, môi trường nào
- Tech stack, framework, conventions của project
- Constraints: không được dùng library X, phải compatible với version Y

### Nguyên tắc 3: Dùng Examples (Few-shot)
- Chỉ cho AI ví dụ input/output mong muốn
- "Ví dụ: Input là 'xin chào', Output là 'Hello'"
- Đặc biệt hữu ích khi cần format cụ thể

### Nguyên tắc 4: Định nghĩa Output Format
- Yêu cầu JSON, markdown, bullet points, table...
- Giới hạn độ dài: "trong 3 câu", "tối đa 200 words"
- Tách biệt thinking và answer

### Nguyên tắc 5: Lặp lại và Cải thiện
- Prompt đầu tiên hiếm khi hoàn hảo
- Follow-up: "Rút gọn lại", "Thêm error handling", "Giải thích tại sao"
- Lưu lại prompt tốt để dùng lại

### Chain of Thought
- Yêu cầu AI suy nghĩ từng bước trước khi trả lời
- "Hãy suy nghĩ từng bước trước khi đưa ra câu trả lời"
- Giúp AI đưa ra kết quả chính xác hơn với bài toán phức tạp

### Những lỗi thường gặp
- Prompt quá ngắn và mơ hồ
- Hỏi nhiều thứ cùng lúc trong một prompt
- Không nói rõ format output mong muốn
- Không cung cấp context về tech stack
