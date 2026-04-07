# Content Style – Quy tắc viết nội dung

## Nguyên tắc chung
- Viết rõ ràng, thực tế, có ví dụ cụ thể
- Ưu tiên tiếng Việt cho blog cá nhân và chia sẻ kinh nghiệm
- Dùng tiếng Anh cho tài liệu kỹ thuật chuyên sâu (hoặc song ngữ)
- Giọng văn: thân thiện, gần gũi — không quá hàn lâm

## Cấu trúc bài blog (`blog/`)

### Frontmatter bắt buộc
```yaml
---
title: Tiêu đề bài viết rõ ràng
description: Mô tả ngắn 1-2 câu, hiện trên SEO và preview
slug: duong-dan-bai-viet
date: YYYY-MM-DD
authors: [huan]
tags: [tag1, tag2]
---
```

### Cấu trúc bài
1. **Mở đầu** — Giới thiệu vấn đề, tại sao bài này quan trọng (2-3 câu)
2. **Nội dung chính** — Chia section rõ ràng bằng `##` headings
3. **Ví dụ thực tế** — Code blocks, screenshots, hoặc case study
4. **Kết luận** — Tóm tắt và bước tiếp theo (optional)

### Truncate marker
Dùng `<!--truncate-->` sau đoạn intro để tạo preview trên trang blog listing.

## Cấu trúc tài liệu (`docs/`)

### Frontmatter bắt buộc
```yaml
---
title: Tên tài liệu
description: Mô tả ngắn
sidebar_position: 1
---
```

### Tổ chức docs
- Mỗi chủ đề lớn = 1 folder (vd: `salesforce/`, `backend/`)
- Folder có `_category_.json` để đặt tên và thứ tự sidebar
- Bắt đầu mỗi folder với `intro.md` hoặc file overview

## Headings
- `#` chỉ dùng trong frontmatter title (không dùng trong body)
- Bắt đầu content bằng `##`
- Không bỏ qua cấp heading (vd: không đi thẳng từ `##` xuống `####`)

## Code Blocks
- Luôn chỉ định ngôn ngữ: ` ```js `, ` ```bash `, ` ```yaml `
- Thêm title khi cần context: ` ```js title="src/pages/index.js" `
- Giữ code examples ngắn gọn và có thể chạy được

## Hình ảnh
- Đặt trong `static/img/` hoặc cùng thư mục bài viết
- Luôn có `alt` text mô tả nội dung ảnh
- Format: `![Mô tả ảnh](./ten-anh.png)`

## Tags
- Dùng tags nhất quán, kiểm tra `blog/tags.yml` trước khi thêm tag mới
- Tags viết thường, kebab-case: `salesforce`, `tieng-nhat`, `backend`

## Không làm
- Không copy-paste nội dung từ nguồn khác mà không dẫn nguồn
- Không để bài draft (không có nội dung thực) commit lên main
- Không dùng heading cấp 1 (`#`) trong body bài viết
