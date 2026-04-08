---
title: Biến và Kiểu dữ liệu
description: Cách khai báo biến, các kiểu dữ liệu cơ bản trong Python và những lỗi thường gặp
sidebar_position: 2
---

Biến và kiểu dữ liệu là nền tảng của mọi chương trình. Hiểu rõ phần này giúp bạn tránh được rất nhiều bug khó chịu sau này — đặc biệt với Python, nơi kiểu dữ liệu hoạt động khác so với C/Java.

## Biến là gì?

Biến là tên gọi trỏ đến một vùng nhớ lưu giá trị. Trong Python, bạn không cần khai báo kiểu — chỉ cần gán giá trị là xong.

```python
# Khai báo biến — không cần kiểu dữ liệu
student_name = "Nguyễn Văn An"
score = 85
gpa = 8.5
is_passed = True
note = None  # Biến chưa có giá trị

print(student_name)  # Output: Nguyễn Văn An
print(score)         # Output: 85
```

### Quy tắc đặt tên biến

```python
# ĐÚNG — dùng snake_case
student_name = "An"
total_score = 100
is_active = True
max_retries = 3

# ĐÚNG — nhưng ít dùng
_private_var = "internal"
__dunder__ = "special"

# SAI — lỗi cú pháp
2name = "An"         # Không bắt đầu bằng số
my-name = "An"       # Không dùng dấu gạch ngang
class = "10A"        # Không dùng từ khóa của Python
```

**Quy tắc bắt buộc:**
- Chỉ dùng chữ cái, số, và dấu gạch dưới `_`
- Không bắt đầu bằng số
- Phân biệt hoa thường: `score` khác `Score`
- Không dùng từ khóa Python: `if`, `for`, `class`, `return`, ...

**Quy ước (convention):**
- `snake_case` cho biến và hàm: `student_name`, `total_score`
- `UPPER_SNAKE_CASE` cho hằng số: `MAX_SCORE = 100`
- `PascalCase` cho class: `StudentRecord`

## Các kiểu dữ liệu cơ bản

### int — Số nguyên

```python
age = 20
score = -5
big_number = 1_000_000  # Dấu _ giúp đọc dễ hơn (= 1000000)
hex_value = 0xFF        # Hệ 16: 255
binary = 0b1010         # Hệ 2: 10

print(type(age))        # Output: <class 'int'>
print(big_number)       # Output: 1000000

# Python không giới hạn kích thước int
huge = 2 ** 100
print(huge)  # Output: 1267650600228229401496703205376
```

### float — Số thực

```python
gpa = 8.75
pi = 3.14159
scientific = 1.5e-3     # = 0.0015 (scientific notation)

print(type(gpa))        # Output: <class 'float'>
print(round(gpa, 1))    # Output: 8.8 (làm tròn 1 chữ số)
```

:::warning Cạm bẫy float precision
```python
print(0.1 + 0.2)        # Output: 0.30000000000000004
print(0.1 + 0.2 == 0.3) # Output: False (!!!)

# Cách đúng để so sánh float
import math
print(math.isclose(0.1 + 0.2, 0.3))  # Output: True

# Hoặc dùng round để hiển thị
print(round(0.1 + 0.2, 1))  # Output: 0.3
```

Lý do: Máy tính lưu số thực theo nhị phân — một số không biểu diễn chính xác được. Đây là vấn đề chung của mọi ngôn ngữ, không riêng Python.
:::

### str — Chuỗi ký tự

```python
name = "Đào Trọng Huấn"
city = 'Hà Nội'
multiline = """Dòng 1
Dòng 2
Dòng 3"""

print(type(name))       # Output: <class 'str'>
print(len(name))        # Output: 14 (số ký tự)
print(name[0])          # Output: Đ (ký tự đầu tiên)
print(name[-1])         # Output: n (ký tự cuối)
```

### bool — Giá trị logic

```python
is_passed = True
has_error = False

print(type(is_passed))  # Output: <class 'bool'>

# bool thực ra là subclass của int
print(True + True)      # Output: 2
print(True * 5)         # Output: 5
print(int(True))        # Output: 1
print(int(False))       # Output: 0

# Truthy và Falsy values
print(bool(0))          # Output: False
print(bool(""))         # Output: False
print(bool([]))         # Output: False
print(bool(None))       # Output: False

print(bool(1))          # Output: True
print(bool("hello"))    # Output: True
print(bool([1, 2]))     # Output: True
```

### None — Không có giá trị

```python
result = None
student_grade = None  # Chưa có điểm

print(type(result))   # Output: <class 'NoneType'>
print(result is None) # Output: True (dùng "is" để kiểm tra None)

# Dùng None làm giá trị mặc định
def find_student(student_id):
    # Nếu không tìm thấy, trả về None
    return None
```

:::tip Kiểm tra None đúng cách
Luôn dùng `is None` hoặc `is not None`, không dùng `== None`.
```python
# ĐÚNG
if result is None:
    print("Không có kết quả")

# TRÁNH (dù hoạt động được)
if result == None:
    print("Không có kết quả")
```
:::

## Hàm `type()` và `isinstance()`

```python
score = 85
name = "An"
gpa = 8.5
is_active = True

# type() — xem kiểu dữ liệu
print(type(score))      # Output: <class 'int'>
print(type(name))       # Output: <class 'str'>
print(type(gpa))        # Output: <class 'float'>
print(type(is_active))  # Output: <class 'bool'>

# isinstance() — kiểm tra có phải kiểu X không
print(isinstance(score, int))       # Output: True
print(isinstance(score, float))     # Output: False
print(isinstance(score, (int, float)))  # Output: True (kiểm tra nhiều kiểu)

# isinstance() tốt hơn type() vì tôn trọng inheritance
print(isinstance(True, int))        # Output: True (bool là subclass của int)
print(type(True) == int)            # Output: False
```

## Dynamic Typing — ưu và nhược điểm

Python là ngôn ngữ **dynamically typed** — một biến có thể thay đổi kiểu dữ liệu.

```python
x = 10          # x là int
print(type(x))  # Output: <class 'int'>

x = "hello"     # x giờ là str
print(type(x))  # Output: <class 'str'>

x = [1, 2, 3]  # x giờ là list
print(type(x))  # Output: <class 'list'>
```

**Ưu điểm:**
- Code ngắn gọn, không cần khai báo kiểu
- Linh hoạt, prototype nhanh

**Nhược điểm:**
- Dễ bug khi biến bị đổi kiểu ngoài ý muốn
- IDE khó gợi ý (autocomplete)
- Khó đọc khi code lớn

**Giải pháp — Type Hints (Python 3.5+):**

```python
# Không bắt buộc nhưng giúp code rõ ràng hơn
def calculate_grade(score: int, max_score: int = 100) -> float:
    return score / max_score * 10

student_name: str = "Nguyễn Văn An"
student_score: int = 85

# Python không enforce type hints — chúng chỉ là "gợi ý"
# Dùng mypy để kiểm tra kiểu tĩnh nếu cần
```

## Bảng so sánh kiểu dữ liệu

| Kiểu | Ví dụ | Mutable? | Dùng khi nào |
|---|---|---|---|
| `int` | `42`, `-5` | Không | Số nguyên, đếm, index |
| `float` | `3.14`, `-0.5` | Không | Tính toán thập phân |
| `str` | `"hello"` | Không | Văn bản, tên, mã |
| `bool` | `True`, `False` | Không | Điều kiện, cờ trạng thái |
| `None` | `None` | Không | Giá trị rỗng, chưa có |
| `list` | `[1, 2, 3]` | Có | Danh sách thay đổi được |
| `tuple` | `(1, 2, 3)` | Không | Dữ liệu cố định |
| `dict` | `{"a": 1}` | Có | Key-value mapping |
| `set` | `{1, 2, 3}` | Có | Tập hợp unique |

## Mutable vs Immutable

```python
# Immutable — không thể thay đổi "trong chỗ"
name = "An"
name[0] = "B"  # TypeError: 'str' object does not support item assignment

# Bạn phải tạo object mới
name = "B" + name[1:]  # Tạo string mới "Bn"

# Mutable — có thể thay đổi trực tiếp
scores = [8, 9, 7]
scores[0] = 10   # OK — sửa trực tiếp phần tử đầu
scores.append(9)  # OK — thêm phần tử vào list
print(scores)    # Output: [10, 9, 7, 9]
```

```python
# Pitfall: gán biến KHÔNG tạo bản sao
a = [1, 2, 3]
b = a           # b trỏ đến CÙNG object với a

b.append(4)
print(a)        # Output: [1, 2, 3, 4] — a cũng bị thay đổi!
print(b)        # Output: [1, 2, 3, 4]

# Để tạo bản sao độc lập:
b = a.copy()    # Shallow copy
# hoặc
b = a[:]        # Slice copy
b = list(a)     # List constructor copy
```

## Chuyển đổi kiểu dữ liệu

```python
# String sang số
age_str = "25"
age = int(age_str)      # 25
gpa_str = "8.5"
gpa = float(gpa_str)    # 8.5

# Số sang string
score = 85
score_str = str(score)  # "85"

# Lỗi khi chuyển đổi không hợp lệ
int("hello")    # ValueError: invalid literal for int()
int("8.5")      # ValueError — phải qua float trước
int(float("8.5"))  # 8 — OK

# Input luôn là string — phải chuyển đổi thủ công
score = int(input("Nhập điểm: "))   # Nhớ chuyển sang int
gpa = float(input("Nhập GPA: "))    # Nhớ chuyển sang float
```

## Bài tập

**Bài 1.** Tạo các biến lưu thông tin học sinh: `student_name` (str), `student_id` (int), `gpa` (float), `is_graduated` (bool). In ra kiểu dữ liệu của từng biến bằng `type()`.

**Bài 2.** Viết chương trình nhập điểm 3 môn từ bàn phím, tính điểm trung bình. Xử lý trường hợp user nhập chữ thay vì số (dùng `try/except ValueError`).

**Bài 3.** Giải thích tại sao đoạn code sau cho kết quả bất ngờ và sửa lại:
```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)  # Tại sao a bị thay đổi?
```

**Bài 4.** Viết chương trình kiểm tra một chuỗi nhập từ người dùng có thể chuyển đổi sang số nguyên hay không. In ra `True/False` tương ứng. (Gợi ý: dùng `str.isdigit()` hoặc `try/except`.)
