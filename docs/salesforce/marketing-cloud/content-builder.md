---
title: Content Builder
description: Thiết kế email và nội dung marketing với Content Builder — templates, dynamic content, personalization strings và AMPscript.
sidebar_position: 5
---

# Content Builder

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Content Builder Overview
- Thư viện quản lý tập trung: emails, templates, images, blocks
- Kết nối với Email Studio, Journey Builder, Mobile Studio

### Email Templates & Blocks
- **Template-based email** — tạo từ template có sẵn hoặc tự xây
- **HTML Paste** — import HTML custom
- **Block Types**: Text, Image, Button, HTML, Dynamic Content, A/B Test
- Reusable Content Blocks — tạo block dùng chung (header, footer)

### Personalization Strings
- Cú pháp: `%%FieldName%%`
- Lấy giá trị từ All Subscribers và Sendable Data Extension
- `%%FirstName%%`, `%%EmailAddr%%` và các field tùy chỉnh
- Default values khi field trống: `%%=v(@FirstName)=%%`

### AMPscript — Personalization nâng cao
- Giới thiệu AMPscript: ngôn ngữ scripting của SFMC
- **Lookup functions**: `Lookup()`, `LookupRows()`, `LookupOrderedRows()`
- **Conditional logic**: `IF`, `ELSEIF`, `ENDIF`
- **String functions**: `Uppercase()`, `Format()`, `DateAdd()`
- **AttributeValue()** — lấy giá trị attribute của subscriber
- Ví dụ: email hiển thị sản phẩm gợi ý dựa trên purchase history

### Dynamic Content
- Hiển thị nội dung khác nhau cho từng nhóm đối tượng trong cùng một email
- Cấu hình rules dựa trên subscriber attributes
- Dynamic Content vs AMPscript: khi nào dùng cái nào

### Image Management
- Upload và quản lý hình ảnh trong Content Builder
- Image sizing và optimization cho email
- Hosted images vs external URLs

### Best Practices thiết kế email
- Mobile-first design — 600px width
- Image-to-text ratio
- Fallback cho email clients không load hình
- Dark mode compatibility
- Test trên Litmus hoặc Email on Acid
