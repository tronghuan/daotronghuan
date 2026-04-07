# /review – Review nội dung hoặc code

## Usage
```
/review [file-path hoặc folder]
```

## Review Checklist

### Nội dung (Blog / Docs)
- [ ] Frontmatter đầy đủ: title, description, slug, date, authors, tags
- [ ] Tags tồn tại trong `blog/tags.yml`
- [ ] Có `<!--truncate-->` trong bài blog
- [ ] Không dùng H1 (`#`) trong body
- [ ] Headings logic, không bỏ cấp
- [ ] Code blocks có label ngôn ngữ
- [ ] Ảnh có alt text
- [ ] Nội dung chính xác, không có thông tin sai
- [ ] Giọng văn nhất quán (tiếng Việt hoặc tiếng Anh)
- [ ] Không có lỗi chính tả / ngữ pháp rõ ràng

### Code (Components / Config)
- [ ] Theo đúng `code-style.md` (naming, indentation)
- [ ] Functional components, không có class components
- [ ] Không có code bị comment lại
- [ ] CSS dùng Modules, không inline styles
- [ ] Không có console.log bị quên
- [ ] Import chỉ những gì dùng

### Docusaurus Config
- [ ] `docusaurus.config.js` hợp lệ
- [ ] `sidebars.js` đúng format
- [ ] `_category_.json` có đầy đủ label và position

### Build
- [ ] `npm run build` không có lỗi hay warning nghiêm trọng

## Output Format
Phản hồi theo dạng:
- **Phải sửa** — lỗi ảnh hưởng đến hiển thị hoặc build
- **Nên sửa** — cải thiện chất lượng nội dung/code
- **Gợi ý** — tùy chọn cải thiện nhỏ
