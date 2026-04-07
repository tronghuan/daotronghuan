# daotronghuan.com – Claude Code Context

## Tổng quan project

**daotronghuan.com** là website cá nhân của Đào Trọng Huấn — góc chia sẻ về IT, Salesforce, Tiếng Nhật và cuộc sống. Được xây dựng bằng **Docusaurus v3** và deploy lên GitHub Pages.

## Tech Stack

- **Framework**: Docusaurus v3 (React-based static site generator)
- **Ngôn ngữ**: JavaScript / JSX / MDX / Markdown
- **Styling**: CSS Modules + Docusaurus default theme
- **Deploy**: GitHub Pages (tự động qua GitHub Actions)
- **URL production**: https://daotronghuan.com

## Cấu trúc project

```
daotronghuan/
├── blog/                # Bài blog (MDX/Markdown)
│   ├── authors.yml      # Thông tin tác giả
│   └── tags.yml         # Danh sách tags
├── docs/                # Tài liệu kỹ thuật (có sidebar)
│   ├── salesforce/
│   ├── backend/
│   ├── devops/
│   └── project-management/
├── src/
│   ├── components/      # React components tái sử dụng
│   ├── css/             # Custom CSS global
│   └── pages/           # Trang tĩnh (index, about...)
├── static/
│   └── img/             # Hình ảnh tĩnh (certs, icons...)
├── docusaurus.config.js # Cấu hình chính Docusaurus
├── sidebars.js          # Cấu hình sidebar docs
└── .claude/             # Cấu hình Claude Code
```

## Key Conventions

- Quy tắc viết code: `.claude/rules/code-style.md`
- Quy tắc viết nội dung: `.claude/rules/content-style.md`
- Cấu trúc project chi tiết: `.claude/rules/project-structure.md`
- Docusaurus patterns: `.claude/rules/docusaurus-conventions.md`
- Git workflow: `.claude/rules/git-workflow.md`

## Available Slash Commands

- `/new-post` – Tạo scaffold bài blog mới
- `/deploy` – Deploy lên GitHub Pages
- `/review` – Review nội dung hoặc code

## Project Memory

Các quyết định, tính năng và context được lưu trong `.claude/memory/`:
- **Index**: `.claude/memory/MEMORY.md` — đọc đầu tiên để định hướng
- **Template**: `.claude/memory/_template.md` — dùng khi thêm memory mới
- **Categories**: `decisions/`, `features/`, `issues/`, `context/`, `references/`

## Lưu ý quan trọng

- Ngôn ngữ chính: **Tiếng Việt** (nội dung blog/docs), **English** (code, config)
- Không commit `.env` hay thông tin nhạy cảm
- Chạy `npm run build` trước khi deploy để kiểm tra lỗi
- Conventional commits: `feat:`, `fix:`, `content:`, `chore:`, `docs:`
