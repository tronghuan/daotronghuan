---
title: Patterns thực tế với AI API
description: Code examples cho các use case phổ biến — chatbot, summarization, extraction, classification với Claude API.
sidebar_position: 3
---

# Patterns thực tế với AI API

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Pattern 1: Chatbot với Memory
- Lưu conversation history trong database
- Load lại history khi user quay lại
- Giới hạn history để tránh quá context window
- System prompt định nghĩa persona của bot

### Pattern 2: Document Summarization
```
Input: Văn bản dài (contract, report, email thread)
Output: Tóm tắt theo bullet points hoặc paragraph

Tips:
- Dùng structured output (JSON) để dễ xử lý
- Cho AI biết đối tượng đọc (executive vs technical)
- Extract key points vs full summary
```

### Pattern 3: Information Extraction
```
Input: Email, form, hóa đơn (text hoặc ảnh)
Output: JSON có cấu trúc

Ví dụ: Extract từ email → { sender, date, action_items[], urgency }
```

### Pattern 4: Classification
```
Input: Text (support ticket, review, feedback)
Output: Category + confidence + reasoning

Ví dụ: Support ticket → { category: "billing", priority: "high", ... }
```

### Pattern 5: RAG (Retrieval-Augmented Generation)
- Embed documents vào vector database
- Khi user hỏi: tìm relevant chunks → gửi vào context
- Claude trả lời dựa trên documents thực tế
- Giảm hallucination, grounded trong dữ liệu thật

### Pattern 6: Agentic Workflows
- Claude gọi tools để hoàn thành task phức tạp
- Ví dụ: Research agent — tìm kiếm web → đọc trang → tổng hợp
- Ví dụ: Data agent — query database → phân tích → báo cáo

### Error Handling & Reliability
- Retry logic với exponential backoff
- Rate limit handling
- Fallback khi API down
- Logging để debug prompt issues
