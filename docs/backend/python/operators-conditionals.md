---
title: Toán tử và Câu lệnh điều kiện
description: Các toán tử trong Python và cách dùng if/elif/else để kiểm soát luồng chương trình
sidebar_position: 3
---

Toán tử và câu lệnh điều kiện cho phép chương trình "suy nghĩ" — so sánh giá trị, đưa ra quyết định, và thực thi code khác nhau tùy tình huống. Đây là nền tảng để xây dựng mọi logic ứng dụng thực tế.

## Toán tử số học

```python
a = 17
b = 5

print(a + b)   # Output: 22   — cộng
print(a - b)   # Output: 12   — trừ
print(a * b)   # Output: 85   — nhân
print(a / b)   # Output: 3.4  — chia (luôn trả về float)
print(a // b)  # Output: 3    — chia lấy phần nguyên (floor division)
print(a % b)   # Output: 2    — chia lấy phần dư (modulo)
print(a ** b)  # Output: 1419857 — lũy thừa (17^5)
```

### Ứng dụng thực tế của `%` và `//`

```python
# Kiểm tra số chẵn/lẻ
number = 42
if number % 2 == 0:
    print(f"{number} là số chẵn")  # Output: 42 là số chẵn

# Chuyển đổi giây sang giờ:phút:giây
total_seconds = 3723
hours = total_seconds // 3600      # 1
minutes = (total_seconds % 3600) // 60  # 2
seconds = total_seconds % 60       # 3
print(f"{hours}h{minutes}m{seconds}s")  # Output: 1h2m3s

# Phân trang
items_per_page = 10
total_items = 47
total_pages = (total_items + items_per_page - 1) // items_per_page
print(f"Tổng số trang: {total_pages}")  # Output: Tổng số trang: 5
```

## Toán tử so sánh

```python
x = 85
y = 70

print(x == y)   # Output: False  — bằng nhau
print(x != y)   # Output: True   — khác nhau
print(x > y)    # Output: True   — lớn hơn
print(x < y)    # Output: False  — nhỏ hơn
print(x >= 85)  # Output: True   — lớn hơn hoặc bằng
print(x <= 85)  # Output: True   — nhỏ hơn hoặc bằng

# So sánh chuỗi (theo alphabetical order)
print("apple" < "banana")   # Output: True
print("Huấn" == "Huấn")     # Output: True

# Python cho phép so sánh chuỗi (chaining)
score = 75
print(60 <= score <= 100)   # Output: True — rất pythonic!
```

## Toán tử logic

```python
age = 20
score = 85
is_enrolled = True

# and — cả hai phải True
print(age >= 18 and score >= 60)   # Output: True
print(age >= 18 and score >= 90)   # Output: False

# or — ít nhất một phải True
print(score >= 90 or is_enrolled)  # Output: True
print(score >= 90 or score < 0)    # Output: False

# not — đảo ngược
print(not is_enrolled)             # Output: False
print(not (score < 60))            # Output: True

# Short-circuit evaluation — Python dừng sớm khi có thể
# and: nếu vế trái False → không cần kiểm tra vế phải
# or:  nếu vế trái True  → không cần kiểm tra vế phải
value = None
print(value is not None and value > 0)  # False — an toàn, không lỗi
```

### Bảng chân trị

| `a` | `b` | `a and b` | `a or b` | `not a` |
|---|---|---|---|---|
| True | True | True | True | False |
| True | False | False | True | False |
| False | True | False | True | True |
| False | False | False | False | True |

## Toán tử gán

```python
score = 80

score += 5    # score = score + 5 → 85
score -= 10   # score = score - 10 → 75
score *= 2    # score = score * 2 → 150
score //= 3   # score = score // 3 → 50
score **= 2   # score = score ** 2 → 2500
score %= 100  # score = score % 100 → 0

# Multiple assignment
x = y = z = 0  # Gán cùng giá trị cho nhiều biến

# Tuple unpacking
a, b = 10, 20
print(a, b)    # Output: 10 20

a, b = b, a    # Hoán đổi giá trị — không cần biến tạm!
print(a, b)    # Output: 20 10
```

## Câu lệnh `if / elif / else`

### Cú pháp cơ bản

```python
score = 75

if score >= 90:
    print("Xuất sắc")
elif score >= 80:
    print("Giỏi")
elif score >= 70:
    print("Khá")
elif score >= 60:
    print("Trung bình")
else:
    print("Yếu")

# Output: Khá
```

:::note Indentation quan trọng!
Python dùng indentation (thụt lề) để xác định block code — khác với C/Java dùng `{}`. Mỗi cấp lùi vào **4 spaces** (hoặc 1 tab, nhưng không trộn lẫn).
:::

### Ví dụ thực tế: Xếp loại học sinh

```python
def xep_loai(diem_tb: float) -> str:
    """Xếp loại học sinh theo điểm trung bình."""
    if not (0 <= diem_tb <= 10):
        return "Điểm không hợp lệ"

    if diem_tb >= 9.0:
        return "Xuất sắc"
    elif diem_tb >= 8.0:
        return "Giỏi"
    elif diem_tb >= 7.0:
        return "Khá"
    elif diem_tb >= 5.0:
        return "Trung bình"
    else:
        return "Yếu"


# Danh sách học sinh
students = [
    ("Nguyễn Văn An", 9.2),
    ("Trần Thị Bình", 7.8),
    ("Lê Văn Cường", 4.5),
    ("Phạm Thị Dung", 8.1),
]

for name, score in students:
    loai = xep_loai(score)
    print(f"{name}: {score} — {loai}")

# Output:
# Nguyễn Văn An: 9.2 — Xuất sắc
# Trần Thị Bình: 7.8 — Khá
# Lê Văn Cường: 4.5 — Yếu
# Phạm Thị Dung: 8.1 — Giỏi
```

### if lồng nhau (nested if)

```python
age = 20
has_id = True
is_member = False

if age >= 18:
    if has_id:
        if is_member:
            print("Vào cửa miễn phí — thành viên")
        else:
            print("Vào cửa, phí 50k")
    else:
        print("Cần xuất trình CMND/CCCD")
else:
    print("Chưa đủ tuổi")

# Output: Vào cửa, phí 50k
```

:::tip Tránh lồng quá sâu
Nested if quá nhiều cấp làm code khó đọc. Hãy dùng **early return** hoặc **guard clause**:

```python
def check_entry(age, has_id, is_member):
    if age < 18:
        return "Chưa đủ tuổi"
    if not has_id:
        return "Cần xuất trình CMND/CCCD"
    if is_member:
        return "Vào cửa miễn phí — thành viên"
    return "Vào cửa, phí 50k"
```
:::

## Ternary (biểu thức điều kiện)

```python
score = 75

# Cú pháp: <giá_trị_nếu_true> if <điều_kiện> else <giá_trị_nếu_false>
result = "Đậu" if score >= 60 else "Rớt"
print(result)  # Output: Đậu

# Rất hữu ích khi gán giá trị
label = "Cao" if score > 80 else ("Trung bình" if score > 60 else "Thấp")
print(label)   # Output: Trung bình

# Dùng trong f-string
print(f"Học sinh {'đậu' if score >= 60 else 'rớt'} kỳ thi")
# Output: Học sinh đậu kỳ thi
```

:::note Khi nào dùng ternary?
Chỉ dùng cho biểu thức đơn giản. Nếu logic phức tạp, dùng `if/else` thông thường để dễ đọc hơn.
:::

## Pitfall: `==` vs `is`

```python
# == so sánh GIÁ TRỊ
a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # Output: True — cùng giá trị

# is so sánh IDENTITY (cùng object trong memory)
print(a is b)   # Output: False — hai object khác nhau

# Với số nhỏ và string ngắn, Python cache lại → is có thể True
x = 100
y = 100
print(x is y)   # Output: True (do Python intern small integers)

x = 1000
y = 1000
print(x is y)   # Output: False (số lớn không được intern)

# LUÔN dùng is cho None, True, False
result = None
print(result is None)    # ĐÚNG
print(result == None)    # TRÁNH

flag = True
print(flag is True)      # OK nhưng thường viết chỉ: if flag:
```

## `in` và `not in` operator

```python
fruits = ["táo", "chuối", "xoài"]

print("táo" in fruits)        # Output: True
print("cam" not in fruits)    # Output: True

# Với string
email = "user@example.com"
print("@" in email)           # Output: True
print(".com" in email)        # Output: True

# Với dict (kiểm tra key)
student = {"name": "An", "score": 85}
print("name" in student)      # Output: True
print("grade" in student)     # Output: False
```

## Bài tập

**Bài 1.** Viết hàm `tinh_tien_taxi(km: float) -> int` tính tiền taxi theo quy tắc:
- 1km đầu: 12,000đ
- Từ km 2 đến km 30: 9,000đ/km
- Từ km 31 trở đi: 8,000đ/km
- Phụ thu đêm (22h-5h): +20%

Hàm nhận thêm tham số `is_night: bool = False`.

**Bài 2.** Viết chương trình tính BMI và in kết quả phân loại:
- BMI &lt; 18.5: Thiếu cân
- 18.5 &lt;= BMI &lt; 25: Bình thường
- 25 &lt;= BMI &lt; 30: Thừa cân
- BMI >= 30: Béo phì

Công thức: `BMI = weight / (height ** 2)` (weight kg, height m).

**Bài 3.** Viết chương trình kiểm tra một năm có phải năm nhuận không. Năm nhuận khi: chia hết cho 4, NHƯNG nếu chia hết cho 100 thì phải chia hết cho 400.

**Bài 4.** Giải thích output của đoạn code sau (không chạy, chỉ đọc):
```python
a = "hello"
b = "hello"
c = a

print(a == b)   # ?
print(a is b)   # ?
print(a is c)   # ?
print(a == c)   # ?
```
