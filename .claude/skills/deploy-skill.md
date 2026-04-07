# Skill: Deploy

## Trigger
Kích hoạt skill này khi người dùng nói:
- "deploy lên production"
- "publish website"
- "đẩy lên GitHub Pages"
- "deploy"
- "ship it"
- "push lên production"

## Workflow
1. Chạy `npm run build` để kiểm tra không có lỗi
2. Kiểm tra git status — có gì chưa commit không?
3. Commit các thay đổi chưa commit (nếu có và người dùng đồng ý)
4. Push lên `main`
5. Thông báo GitHub Actions đang chạy
6. Nhắc kiểm tra https://daotronghuan.com sau 1-3 phút

## See also
`.claude/commands/deploy.md` — hướng dẫn chi tiết từng bước.
