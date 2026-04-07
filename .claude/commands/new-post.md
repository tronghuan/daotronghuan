# /new-post – Tạo bài blog mới

## Usage
```
/new-post <tên bài hoặc chủ đề>
```

## Steps

### 1. Thu thập thông tin
Hỏi (nếu chưa có):
- Tiêu đề bài viết là gì?
- Tags phù hợp? (kiểm tra `blog/tags.yml`)
- Có hình ảnh đi kèm không?
- Ngôn ngữ: tiếng Việt hay tiếng Anh?

### 2. Xác định đường dẫn file
- Bài đơn giản: `blog/YYYY-MM-DD-slug.md`
- Bài có hình ảnh: `blog/YYYY-MM-DD-slug/index.md`
- Dùng ngày hôm nay cho `YYYY-MM-DD`
- `slug` = kebab-case từ tiêu đề

### 3. Tạo frontmatter
```yaml
---
title: Tiêu đề bài viết
description: Mô tả ngắn 1-2 câu
slug: duong-dan-slug
date: YYYY-MM-DD
authors: [huan]
tags: [tag1, tag2]
---
```

### 4. Tạo nội dung scaffold
```markdown
[Đoạn intro ngắn 2-3 câu giới thiệu vấn đề]

<!--truncate-->

## [Heading chính]

[Nội dung...]
```

### 5. Invoke content-writer agent
Gọi agent `content-writer` để viết hoặc hoàn thiện nội dung.

### 6. Kiểm tra
```bash
npm start
```
Mở `http://localhost:3000/blog` để kiểm tra bài hiển thị đúng.

## Output
- File bài viết đã tạo với đường dẫn đầy đủ
- Frontmatter hoàn chỉnh
- Scaffold nội dung sẵn sàng để viết tiếp
