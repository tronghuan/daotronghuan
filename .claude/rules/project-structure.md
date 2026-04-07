# Project Structure

## Root
```
daotronghuan/
├── blog/                    # Bài blog
├── docs/                    # Tài liệu kỹ thuật
├── src/                     # Source React/JS
├── static/                  # Assets tĩnh (không xử lý bởi webpack)
├── docusaurus.config.js     # Config chính
├── sidebars.js              # Config sidebar docs
├── package.json
├── CLAUDE.md                # Context cho Claude Code
└── .claude/                 # Cấu hình Claude Code
```

## blog/
```
blog/
├── YYYY-MM-DD-ten-bai.md          # Bài blog đơn file
├── YYYY-MM-DD-ten-bai/            # Bài blog có hình ảnh
│   ├── index.md
│   └── images/
├── authors.yml                    # Danh sách tác giả
└── tags.yml                       # Danh sách tags chuẩn
```

## docs/
```
docs/
├── intro.md                       # Trang intro docs
├── salesforce/
│   ├── _category_.json
│   ├── intro.md
│   └── lwc-basics.md
├── backend/
│   ├── _category_.json
│   └── ...
├── devops/
│   ├── _category_.json
│   └── ...
└── project-management/
    ├── _category_.json
    └── ...
```

## src/
```
src/
├── components/                    # Reusable React components
│   ├── HomepageFeatures/
│   │   ├── index.js
│   │   └── styles.module.css
│   └── [ComponentName]/
│       ├── index.js
│       └── styles.module.css
├── css/
│   └── custom.css                 # Global CSS overrides
└── pages/
    ├── index.js                   # Homepage
    └── *.md                       # Static markdown pages
```

## static/
```
static/
├── img/
│   ├── favicon.svg
│   ├── certs/                     # Badge chứng chỉ
│   └── [category]/
└── .nojekyll                      # Cần cho GitHub Pages
```

## Quy tắc đặt file
- Blog files: `YYYY-MM-DD-ten-bai-kebab-case.md`
- Docs files: `kebab-case.md`
- Components: `PascalCase/index.js`
- CSS Modules: `ComponentName.module.css`
- Ảnh trong bài: đặt cùng folder với file Markdown

## Khi thêm chủ đề docs mới
1. Tạo folder mới trong `docs/`
2. Tạo `_category_.json` với label, position, description
3. Thêm file đầu tiên (thường là intro hoặc overview)
4. Docusaurus tự động thêm vào sidebar
