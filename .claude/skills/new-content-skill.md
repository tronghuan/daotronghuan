# Skill: New Content

## Trigger
Kích hoạt skill này khi người dùng nói:
- "viết bài về..."
- "tạo bài blog mới"
- "thêm tài liệu về..."
- "tạo doc cho..."
- "scaffold bài viết"
- "write a post about..."

## Workflow
1. Xác định loại nội dung: blog post hay docs page?
2. Hỏi thêm thông tin nếu thiếu (tiêu đề, tags, ngôn ngữ)
3. Invoke agent `content-writer` để soạn nội dung
4. Tạo file với đúng cấu trúc theo `docusaurus-conventions.md`
5. Kiểm tra frontmatter đầy đủ
6. Gợi ý lệnh preview: `npm start`

## Output
- File Markdown/MDX mới với frontmatter hoàn chỉnh
- Nội dung scaffold hoặc đầy đủ tùy yêu cầu
- Đường dẫn file và hướng dẫn preview
