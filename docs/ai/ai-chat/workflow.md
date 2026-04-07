---
title: Workflow thực tế với AI Chat
description: Các pattern và workflow dùng AI Chat hàng ngày khi lập trình — từ debug đến code review.
sidebar_position: 3
---

# Workflow thực tế với AI Chat

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Pattern 1: Debug bằng mô tả
Thay vì tự mò, mô tả vấn đề cho AI và để AI hướng dẫn
```
Template: "Tôi đang làm [task]. Code của tôi là [code].
Kết quả mong đợi là [X] nhưng thực tế là [Y].
Tôi đã thử [Z]. Vấn đề có thể là gì?"
```

### Pattern 2: Architecture Brainstorm
Dùng AI như một senior engineer để phản biện design
```
Template: "Tôi cần thiết kế [feature]. Yêu cầu là [requirements].
Constraints là [constraints]. Hãy đề xuất 2-3 approaches
với trade-offs của mỗi cách."
```

### Pattern 3: Code Review nhanh
Paste code, yêu cầu review theo tiêu chí cụ thể
```
Template: "Review đoạn code sau theo các tiêu chí:
1. Security vulnerabilities
2. Performance issues
3. Edge cases chưa handle
4. Code style và readability"
```

### Pattern 4: Học từ Code lạ
Gặp codebase mới hoặc pattern không quen
```
Template: "Giải thích đoạn code này.
Tôi muốn hiểu: 1) Nó làm gì? 2) Tại sao viết như vậy?
3) Có cách viết khác không?"
```

### Pattern 5: Viết Tests
Từ function → test cases đầy đủ
```
Template: "Viết unit tests cho function này.
Bao gồm: happy path, edge cases, error cases.
Dùng [test framework]."
```

### Những điều nên tránh
- Không copy-paste code AI mà không đọc hiểu
- Không tin tuyệt đối — AI có thể sai, nhất là API/version cụ thể
- Không paste thông tin nhạy cảm (API keys, passwords, PII)
- Không dùng AI thay cho việc đọc docs chính thức
