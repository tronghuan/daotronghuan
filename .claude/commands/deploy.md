# /deploy – Deploy lên GitHub Pages

## Usage
```
/deploy
```

## Steps

### 1. Pre-deploy Checks
- Kiểm tra working tree sạch: `git status`
- Xác nhận đang ở branch `main` hoặc đã merge vào `main`
- Kiểm tra không có frontmatter thiếu trong bài mới

### 2. Build kiểm tra
```bash
npm run build
```
Nếu build lỗi → dừng lại, báo lỗi cụ thể để fix trước.

### 3. Commit và push
```bash
git add .
git commit -m "content: [mô tả thay đổi]"
git push origin main
```

### 4. GitHub Actions tự deploy
- Push lên `main` trigger GitHub Actions workflow tự động
- Workflow build và deploy lên GitHub Pages
- URL production: https://daotronghuan.com

### 5. Kiểm tra sau deploy
- Mở https://daotronghuan.com để verify
- Kiểm tra bài mới xuất hiện đúng ở `/blog`
- Kiểm tra không có broken links

## Rollback
Nếu có vấn đề sau deploy:
```bash
git revert HEAD
git push origin main
```

## Notes
- GitHub Pages thường mất 1-3 phút để deploy
- Nếu Actions fail, xem log tại tab Actions trên GitHub repo
