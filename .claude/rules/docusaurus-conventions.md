# Docusaurus Conventions

## Phiên bản
- Docusaurus v3 (với future.v4 flag enabled)
- Config file: `docusaurus.config.js`
- Sidebar config: `sidebars.js`

## Cấu trúc URL
- Blog: `/blog/<slug>` — slug lấy từ frontmatter hoặc tên file
- Docs: `/docs/<path>` — path theo cấu trúc folder

## Relative Links trong Docs — Quy tắc bắt buộc

Docusaurus thêm trailing slash vào URL của mỗi doc page. Vì vậy khi dùng relative link, đường dẫn được resolve từ "thư mục ảo" của page đó, **không phải từ thư mục file thực**.

**Ví dụ sai (broken link):**
```
File: docs/devops/mulesoft/cai-dat.md
URL:  /docs/devops/mulesoft/cai-dat/

Link: [Giao diện](./giao-dien)
Resolve thành: /docs/devops/mulesoft/cai-dat/giao-dien/  ← SAI
```

**Quy tắc đúng — link đến file cùng thư mục (sibling):**
```markdown
<!-- Dùng ../ thay vì ./ khi link đến sibling docs -->
[Giao diện](../giao-dien)        ✅ → /docs/devops/mulesoft/giao-dien/
[Giao diện](./giao-dien)         ❌ → /docs/devops/mulesoft/cai-dat/giao-dien/
```

**Tóm tắt rule:**
| Link từ | Link đến | Dùng |
|:---|:---|:---|
| `folder/file-a.md` | `folder/file-b.md` (cùng folder) | `../file-b` |
| `folder/file-a.md` | `folder/sub/file-c.md` (sub-folder) | `./sub/file-c` |
| `folder/sub/file-c.md` | `folder/file-a.md` (lên trên) | `../../file-a` |
| `folder/index.md` | `folder/file-b.md` (con của index) | `./file-b` ✅ (index là ngoại lệ) |

**Index page là ngoại lệ:** `index.md` được serve tại `/docs/folder/` (không có trailing "index") nên `./file-b` từ index.md resolve đúng.
- Pages: `/<filename>` — từ `src/pages/`

## Blog

### Tạo bài blog đơn file
```
blog/YYYY-MM-DD-ten-bai.md
```

### Tạo bài blog có assets (hình ảnh)
```
blog/YYYY-MM-DD-ten-bai/
├── index.md
└── anh-minh-hoa.png
```

### authors.yml format
```yaml
huan:
  name: Đào Trọng Huấn
  title: Salesforce Developer
  url: https://daotronghuan.com
  image_url: /img/avatar.jpg
```

## Docs

### _category_.json format
```json
{
  "label": "Salesforce",
  "position": 1,
  "link": {
    "type": "generated-index",
    "description": "Tài liệu về Salesforce development"
  }
}
```

### sidebar_position
- Dùng số nguyên: `sidebar_position: 1`
- Số nhỏ hơn = hiện trên trước
- Khoảng cách: 1, 2, 3... (không cần để khoảng trống)

## Custom Pages (src/pages/)
- `.js` hoặc `.jsx` cho React pages
- `.md` hoặc `.mdx` cho Markdown pages
- File `index.js` = homepage (`/`)

## Custom Components (src/components/)
- Mỗi component trong folder riêng:
  ```
  src/components/ComponentName/
  ├── index.js           # hoặc ComponentName.jsx
  └── styles.module.css
  ```
- Import trong MDX: `import ComponentName from '@site/src/components/ComponentName'`

## MDX Features
- Có thể dùng JSX trong Markdown files (`.mdx`)
- Import component vào đầu file trước khi dùng
- Dùng Admonitions cho callout boxes:
  ```
  :::note
  Ghi chú
  :::

  :::tip
  Mẹo hay
  :::

  :::warning
  Cảnh báo
  :::
  ```

## docusaurus.config.js
- Không sửa trực tiếp — kiểm tra Docusaurus docs trước
- Plugins và themes khai báo ở đây
- Navbar và footer config ở đây
- Khi thêm plugin mới, luôn chạy `npm install` rồi `npm run build` để verify

## Lệnh thường dùng
```bash
npm start          # Dev server tại localhost:3000
npm run build      # Build production, kiểm tra lỗi
npm run serve      # Preview build output
npm run clear      # Xóa cache khi gặp lỗi lạ
```
