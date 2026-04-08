---
title: Xử lý chuỗi (Strings)
description: Indexing, slicing, f-strings, các string methods quan trọng và cách xử lý text trong Python
sidebar_position: 7
---

String là một trong những kiểu dữ liệu dùng nhiều nhất — xử lý tên người dùng, parse dữ liệu, format output, validate email, tạo báo cáo. Python có bộ công cụ xử lý chuỗi rất mạnh và pythonic.

## String literals và escape characters

```python
# Single quote, double quote — tương đương
name1 = 'Đào Trọng Huấn'
name2 = "Đào Trọng Huấn"

# Dùng double quote khi chuỗi có dấu nháy đơn
sentence = "It's a beautiful day"

# Dùng single quote khi chuỗi có dấu nháy kép
code = 'He said "hello"'

# Escape characters
tab = "Cột 1\tCột 2\tCột 3"      # \t — tab
newline = "Dòng 1\nDòng 2"        # \n — xuống dòng
backslash = "C:\\Users\\huan"     # \\ — dấu backslash
quote = "Anh ấy nói \"xin chào\"" # \" — dấu nháy kép

print(tab)       # Output: Cột 1    Cột 2    Cột 3
print(newline)   # Output: Dòng 1
                 #         Dòng 2

# Raw string — bỏ qua escape characters (thường dùng với regex, Windows path)
path = r"C:\Users\huan\Documents"
pattern = r"\d{3}-\d{4}"  # Regex pattern
print(path)     # Output: C:\Users\huan\Documents (không bị escape)
```

### Multiline strings

```python
# Dùng triple quotes cho chuỗi nhiều dòng
bio = """Tôi là Đào Trọng Huấn,
Salesforce Developer tại Hà Nội.
Yêu thích Python và tiếng Nhật."""

sql_query = """
    SELECT student_name, score
    FROM students
    WHERE score >= 80
    ORDER BY score DESC
"""

print(bio)
# Output:
# Tôi là Đào Trọng Huấn,
# Salesforce Developer tại Hà Nội.
# Yêu thích Python và tiếng Nhật.
```

## Indexing và Slicing

String là sequence — có thể truy cập từng ký tự theo index.

```python
text = "Hello, Python!"
#       0123456789...

# Indexing
print(text[0])    # Output: H
print(text[7])    # Output: P
print(text[-1])   # Output: ! (cuối cùng)
print(text[-7])   # Output: P (đếm từ cuối)

# Slicing: text[start:stop:step]
print(text[0:5])   # Output: Hello
print(text[7:13])  # Output: Python
print(text[:5])    # Output: Hello (từ đầu đến index 5)
print(text[7:])    # Output: Python! (từ index 7 đến hết)
print(text[::2])   # Output: Hlo yhn (cách 2 ký tự)
print(text[::-1])  # Output: !nohtyP ,olleH (đảo ngược)
```

### Ứng dụng slicing thực tế

```python
# Lấy phần extension của tên file
filename = "report_2024.xlsx"
extension = filename[-5:]    # ".xlsx"
name_only = filename[:-5]    # "report_2024"

# Lấy domain từ email
email = "huan@daotronghuan.com"
at_index = email.index("@")
username = email[:at_index]      # "huan"
domain = email[at_index + 1:]    # "daotronghuan.com"

# Kiểm tra palindrome
word = "racecar"
is_palindrome = word == word[::-1]
print(is_palindrome)  # Output: True
```

## String Formatting — 3 cách

### 1. f-strings (Python 3.6+) — Khuyên dùng

```python
name = "Huấn"
score = 8.75
percentage = 87.5

# Cơ bản
print(f"Tên: {name}, Điểm: {score}")
# Output: Tên: Huấn, Điểm: 8.75

# Biểu thức trong f-string
print(f"2 + 2 = {2 + 2}")
# Output: 2 + 2 = 4

print(f"Điểm: {score:.1f}")        # Output: Điểm: 8.8 (1 chữ số thập phân)
print(f"Phần trăm: {percentage:.2f}%")  # Output: Phần trăm: 87.50%
print(f"Số nguyên: {score:.0f}")   # Output: Số nguyên: 9

# Căn chỉnh
print(f"{'Tên':<15} {'Điểm':>8}")  # Căn trái 15, căn phải 8
print(f"{'An':<15} {85:>8}")
print(f"{'Bình':<15} {92:>8}")

# Output:
# Tên               Điểm
# An                  85
# Bình                92

# Định dạng số
price = 1500000
print(f"Giá: {price:,} VND")     # Output: Giá: 1,500,000 VND
print(f"Hex: {255:#x}")          # Output: Hex: 0xff
print(f"Binary: {10:#b}")        # Output: Binary: 0b1010
```

### 2. `.format()` method

```python
# Positional
print("Tên: {}, Điểm: {}".format("An", 85))
# Output: Tên: An, Điểm: 85

# Named placeholders
template = "Học sinh {name} đạt {score} điểm ({grade})"
print(template.format(name="An", score=85, grade="Giỏi"))
# Output: Học sinh An đạt 85 điểm (Giỏi)

# Reuse và tái sử dụng template
for name, score in [("An", 85), ("Bình", 92)]:
    grade = "Xuất sắc" if score >= 90 else "Giỏi"
    print(template.format(name=name, score=score, grade=grade))
```

### 3. `%` operator (cũ, ít dùng)

```python
name = "An"
score = 85
print("Tên: %s, Điểm: %d" % (name, score))
# Output: Tên: An, Điểm: 85

# Không khuyên dùng trong code mới — dùng f-string thay thế
```

### So sánh 3 cách

| Cách | Ưu điểm | Nhược điểm |
|---|---|---|
| f-string | Ngắn gọn, dễ đọc, nhanh nhất | Python 3.6+ |
| `.format()` | Tách template ra biến riêng | Dài hơn f-string |
| `%` | Quen thuộc với C/PHP | Cú pháp cũ, ít tính năng |

## String Methods quan trọng

### Chuyển đổi case

```python
text = "  Hello, Python World!  "

print(text.upper())      # "  HELLO, PYTHON WORLD!  "
print(text.lower())      # "  hello, python world!  "
print(text.title())      # "  Hello, Python World!  "
print(text.capitalize()) # "  hello, python world!  " (chỉ chữ đầu)
print(text.swapcase())   # "  hELLO, pYTHON wORLD!  "
```

### Strip — loại bỏ khoảng trắng

```python
text = "  Hello, Python!  "

print(text.strip())       # "Hello, Python!" — cả 2 đầu
print(text.lstrip())      # "Hello, Python!  " — chỉ trái
print(text.rstrip())      # "  Hello, Python!" — chỉ phải

# Strip ký tự tùy chọn
path = "///path/to/file///"
print(path.strip("/"))    # "path/to/file"

# Ứng dụng: xử lý input từ user
user_input = "   huan@example.com   "
clean_email = user_input.strip().lower()
print(clean_email)  # "huan@example.com"
```

### Split và Join

```python
# split() — tách chuỗi thành list
csv_line = "An,85,Giỏi,Hà Nội"
parts = csv_line.split(",")
print(parts)  # Output: ['An', '85', 'Giỏi', 'Hà Nội']

sentence = "Hello Python World"
words = sentence.split()     # Tách theo whitespace (mặc định)
print(words)  # Output: ['Hello', 'Python', 'World']

# split với maxsplit
email = "user@example.com"
user, domain = email.split("@", maxsplit=1)
print(user)    # Output: user
print(domain)  # Output: example.com

# join() — ghép list thành chuỗi
words = ["Python", "is", "awesome"]
sentence = " ".join(words)
print(sentence)  # Output: Python is awesome

tags = ["python", "backend", "api"]
tag_string = ", ".join(tags)
print(tag_string)  # Output: python, backend, api

# join với f-string
items = ["Táo", "Chuối", "Xoài"]
print("\n".join(f"- {item}" for item in items))
# Output:
# - Táo
# - Chuối
# - Xoài
```

### Find, Replace, Check

```python
text = "Học Python là học lập trình Python"

# Tìm kiếm
print(text.find("Python"))     # Output: 4 (index đầu tiên)
print(text.rfind("Python"))    # Output: 27 (index cuối cùng)
print(text.find("Java"))       # Output: -1 (không tìm thấy)
print(text.index("Python"))    # Output: 4 (giống find nhưng lỗi nếu không có)
print(text.count("Python"))    # Output: 2 (đếm số lần xuất hiện)

# Replace
new_text = text.replace("Python", "JavaScript")
print(new_text)
# Output: Học JavaScript là học lập trình JavaScript

# Chỉ replace lần đầu
partial = text.replace("Python", "JavaScript", 1)
print(partial)
# Output: Học JavaScript là học lập trình Python

# Kiểm tra
print(text.startswith("Học"))    # Output: True
print(text.endswith("Python"))   # Output: True
print(text.startswith("Python")) # Output: False

# Kiểm tra nội dung
print("123".isdigit())     # Output: True
print("abc".isalpha())     # Output: True
print("abc123".isalnum())  # Output: True
print("  ".isspace())      # Output: True
print("Hello World".istitle())  # Output: True
```

## String immutability

```python
# String không thể thay đổi sau khi tạo
name = "Huan"
name[0] = "h"  # TypeError: 'str' object does not support item assignment

# Mỗi thao tác tạo STRING MỚI
name = "Huan"
name = name.lower()    # Tạo string mới "huan", gán lại cho name
name = "H" + name[1:] # Tạo string mới "Huan"

# Với nhiều phép nối, dùng join thay vì +=
# KHÔNG HIỆU QUẢ với list lớn
result = ""
for word in ["a", "b", "c", "d"]:
    result += word  # Mỗi lần tạo string mới

# HIỆU QUẢ HƠN
result = "".join(["a", "b", "c", "d"])
```

## Bài tập

**Bài 1.** Viết hàm `validate_email(email: str) -> bool` kiểm tra email hợp lệ cơ bản: có đúng 1 ký tự `@`, phần trước `@` không rỗng, phần sau `@` có ít nhất 1 dấu `.` và domain không rỗng.

**Bài 2.** Viết hàm `format_report(students: list) -> str` nhận list `[{"name": str, "score": float}]` và trả về bảng kết quả được căn chỉnh đẹp bằng f-string. Tên căn trái 20 ký tự, điểm căn phải 8 ký tự với 2 chữ số thập phân.

**Bài 3.** Viết hàm `count_vowels(text: str) -> dict` đếm số lần xuất hiện của mỗi nguyên âm (a, e, i, o, u) trong text, không phân biệt hoa thường.

**Bài 4.** Viết hàm `camel_to_snake(name: str) -> str` chuyển từ camelCase sang snake_case. Ví dụ: `"studentName"` → `"student_name"`, `"getTotalScore"` → `"get_total_score"`.
