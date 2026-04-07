# Git Workflow

## Branch Strategy
```
main        ← production (GitHub Pages deploy từ đây)
└── draft/* hoặc feature/*   ← bài viết mới, tính năng mới
```

## Branch Naming
| Loại      | Pattern                   | Ví dụ                         |
|-----------|---------------------------|-------------------------------|
| Bài viết  | `content/ten-bai-viet`    | `content/salesforce-lwc-tips` |
| Tính năng | `feature/ten-tinh-nang`   | `feature/dark-mode`           |
| Bug fix   | `fix/mo-ta-loi`           | `fix/sidebar-not-showing`     |
| Chore     | `chore/mo-ta`             | `chore/update-deps`           |

## Commit Message Format
```
<type>: <mô tả ngắn>

[body tùy chọn]
```

### Types
- `content` – thêm hoặc cập nhật bài viết / tài liệu
- `feat` – tính năng mới cho website
- `fix` – sửa lỗi
- `style` – thay đổi giao diện, CSS
- `chore` – cập nhật deps, config, không ảnh hưởng nội dung
- `docs` – cập nhật README, CLAUDE.md

### Ví dụ
```
content: thêm bài viết về Salesforce Agentforce

feat: thêm component CertBadge cho trang chủ

fix: sửa sidebar docs Salesforce không hiện đúng thứ tự

chore: cập nhật Docusaurus lên v3.7
```

## Quy trình làm việc
1. Tạo branch từ `main`
2. Viết nội dung / code
3. Chạy `npm run build` để kiểm tra không có lỗi build
4. Commit với message đúng format
5. Push và merge vào `main`
6. GitHub Actions tự động deploy

## Protected Branch
- `main`: không force push, deploy tự động khi có commit mới
- Luôn build thành công trước khi merge vào `main`

## Trước khi commit
1. `npm run build` — không có lỗi
2. Preview bài viết mới bằng `npm start`
3. Kiểm tra frontmatter đầy đủ
