# Salesforce CLI - Hướng dẫn xác thực JWT

## 1. Tạo Private Key và Certificate (Windows)

> Tham khảo: https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_key_and_cert.htm

### Chuẩn bị OpenSSL

- Kiểm tra OpenSSL đã được cài đặt. Nếu đã cài **Git Bash**, có thể dùng OpenSSL đi kèm.
- Thêm đường dẫn OpenSSL vào biến môi trường:
  1. Bấm phím `Windows`, gõ `env`, mở hộp thoại **Environment Variables**
  2. Thêm `C:\Program Files\Git\usr\bin` vào biến `Path`
- Mở Command Prompt và kiểm tra: `which openssl`

### Tạo Key và Certificate

```bash
# 1. Tạo thư mục làm việc
mkdir /Users/jdoe/JWT
cd /Users/jdoe/JWT

# 2. Tạo private key có mã hóa
openssl genpkey -aes-256-cbc -algorithm RSA -pass pass:SomePassword -out server.pass.key -pkeyopt rsa_keygen_bits:2048

# 3. Giải mã private key (bỏ passphrase)
openssl rsa -passin pass:SomePassword -in server.pass.key -out server.key

# 4. Tạo Certificate Signing Request (CSR)
openssl req -new -key server.key -out server.csr

# 5. Tạo self-signed certificate
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```

---

## 2. Tạo External Client App trong Salesforce Org

> Tham khảo: https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_eca.htm#sfdx_dev_auth_eca

> **Lưu ý:** Nếu bạn đang authorize một **Dev Hub org** để tạo scratch orgs hoặc sandboxes, hãy tạo **Connected App** thay vì External Client App.

### Các bước tạo app

1. Đăng nhập vào org.
2. Trong **Setup**, tìm **App Manager**, click **App Manager**.
3. Click **New External Client App**.
4. Điền thông tin cơ bản (tên app, email liên hệ).
5. Trong phần **API (Enable OAuth Settings)**, click **Enable OAuth**.
6. Trong **Callback URL**, nhập:
   ```
   http://localhost:1717/OauthRedirect
   ```
   > Nếu port 1717 đã được dùng, chọn port khác và cập nhật `sfdx-project.json`:
   > ```json
   > "oauthLocalPort": "1919"
   > ```
7. Trong **OAuth Scopes**, chọn các scope sau:
   - `Manage user data via APIs (api)`
   - `Manage user data via Web browsers (web)`
   - `Perform requests at any time (refresh_token, offline_access)`
8. **(Bắt buộc cho JWT)** Trong **Flow Enablement**, chọn **Enable JWT Bearer Flow**.
9. **(Bắt buộc cho JWT)** Click **Upload Files** và upload file `server.crt`.
10. Click **Create**.

### Cấu hình thêm sau khi tạo

1. Click **Edit**.
2. **(Bắt buộc cho JWT)** Click tab **Policies** > **OAuth Policies**.
3. Trong **Plugin Policies**, set **Permitted Users** thành **Admin approved users are pre-authorized**, click **OK**.
4. Trong **App Policies**, chọn các **profiles** và **permission sets** được phép dùng app này.
5. Click tab **Policies** > **App Authorization** > **OAuth Policies**.
6. Click **Expire refresh token after a specific time**:
   - **Refresh Token Validity Period**: `90`
   - **Refresh Token Validity Unit**: `Day(s)`
7. Trong **Session Timeout in Minutes**, nhập `15`.
8. Click **Save**.

---

## 3. Lấy Consumer Key và Secret

1. Đăng nhập vào org.
2. Trong **Setup**, tìm **App Manager**, click **External Client App Manager**.
3. Click vào app của bạn > tab **Settings** > **OAuth Settings** > **Consumer Key and Secret**.
4. Xác minh danh tính qua email (nhập mã xác nhận).
5. Click **Copy** để sao chép **Consumer Key**.

---

## 4. Đăng nhập với `org login jwt`

> Tham khảo: https://developer.salesforce.com/docs/atlas.en-us.260.0.sfdx_cli_reference.meta/sfdx_cli_reference/cli_reference_org_commands_unified.htm#cli_reference_org_login_jwt_unified

Dùng lệnh này trong môi trường tự động (CI/CD) khi không thể đăng nhập qua browser.

### Yêu cầu trước khi chạy

1. Tạo digital certificate và private key (xem bước 1).
2. Lưu private key vào file (ví dụ: `/Users/jdoe/JWT/server.key`).
3. Tạo connected app trong org với certificate đó, ghi lại **Consumer Key**.

### Cú pháp

```bash
sf org login jwt --username <USERNAME> --jwt-key-file <KEY_FILE> --client-id <CLIENT_ID> [OPTIONS]
```

### Các flag

| Flag | Bắt buộc | Mô tả |
|------|----------|-------|
| `-o, --username` | Có | Username đăng nhập |
| `-f, --jwt-key-file` | Có | Đường dẫn file private key |
| `-i, --client-id` | Có | Consumer Key của connected app |
| `-r, --instance-url` | Không | URL instance của org |
| `-d, --set-default-dev-hub` | Không | Đặt org này làm Dev Hub mặc định |
| `-s, --set-default` | Không | Đặt org này làm org mặc định |
| `-a, --alias` | Không | Alias cho org |
| `--json` | Không | Xuất output dạng JSON |

### Ví dụ

```bash
# Đăng nhập cơ bản
sf org login jwt \
  --username jdoe@example.org \
  --jwt-key-file /Users/jdoe/JWT/server.key \
  --client-id 04580y4051234051

# Đặt làm org mặc định và đặt alias
sf org login jwt \
  --username jdoe@example.org \
  --jwt-key-file /Users/jdoe/JWT/server.key \
  --client-id 04580y4051234051 \
  --alias ci-org \
  --set-default

# Đặt làm Dev Hub mặc định
sf org login jwt \
  --username jdoe@example.org \
  --jwt-key-file /Users/jdoe/JWT/server.key \
  --client-id 04580y4051234051 \
  --alias ci-dev-hub \
  --set-default-dev-hub

# Đăng nhập vào sandbox
sf org login jwt \
  --username jdoe@example.org \
  --jwt-key-file /Users/jdoe/JWT/server.key \
  --client-id 04580y4051234051 \
  --alias ci-org \
  --set-default \
  --instance-url https://MyDomainName--SandboxName.sandbox.my.salesforce.com
```

### Alias lệnh tương đương

- `force:auth:jwt:grant`
- `auth:jwt:grant`
