---
title: Hàm (Functions)
description: Định nghĩa hàm, tham số, *args/**kwargs, scope, lambda và best practices viết hàm Python
sidebar_position: 5
---

Hàm là đơn vị tái sử dụng code cơ bản nhất trong Python. Thay vì lặp đi lặp lại cùng một đoạn code, bạn đặt nó vào hàm và gọi khi cần. Hiểu hàm tốt giúp bạn viết code sạch, dễ test và dễ bảo trì.

## Định nghĩa hàm cơ bản

```python
# Cú pháp cơ bản
def greet(name):
    message = f"Xin chào, {name}!"
    return message

# Gọi hàm
result = greet("Huấn")
print(result)  # Output: Xin chào, Huấn!

# Hàm không có return → trả về None
def print_separator():
    print("=" * 40)

value = print_separator()
print(value)   # Output: None
```

```python
# Hàm có thể return nhiều giá trị (thực ra là tuple)
def get_student_info():
    name = "Nguyễn Văn An"
    score = 85
    grade = "Giỏi"
    return name, score, grade  # Trả về tuple

# Unpacking kết quả
student_name, student_score, student_grade = get_student_info()
print(student_name)    # Output: Nguyễn Văn An
print(student_score)   # Output: 85
```

## Tham số (Parameters)

### Positional arguments

```python
def calculate_average(score1, score2, score3):
    return (score1 + score2 + score3) / 3

# Truyền theo vị trí
avg = calculate_average(85, 92, 78)
print(f"Điểm TB: {avg:.1f}")  # Output: Điểm TB: 85.0
```

### Keyword arguments

```python
def create_student_profile(name, score, grade="Chưa xếp loại"):
    return {
        "name": name,
        "score": score,
        "grade": grade
    }

# Truyền theo tên — thứ tự không quan trọng
profile1 = create_student_profile(score=85, name="An")
profile2 = create_student_profile("Bình", 92, grade="Xuất sắc")

print(profile1)
# Output: {'name': 'An', 'score': 85, 'grade': 'Chưa xếp loại'}
```

### Default values

```python
def send_notification(message, recipient="admin", priority="normal"):
    print(f"[{priority.upper()}] Gửi đến {recipient}: {message}")

send_notification("Server down!")
# Output: [NORMAL] Gửi đến admin: Server down!

send_notification("Cần review", recipient="huan@example.com", priority="high")
# Output: [HIGH] Gửi đến huan@example.com: Cần review
```

:::warning Default value với mutable type
```python
# SAI — default mutable gây bug khó tìm
def add_score(score, score_list=[]):
    score_list.append(score)
    return score_list

print(add_score(85))   # Output: [85]
print(add_score(92))   # Output: [85, 92] ← sai! list cũ bị dùng lại

# ĐÚNG — dùng None làm default
def add_score(score, score_list=None):
    if score_list is None:
        score_list = []
    score_list.append(score)
    return score_list

print(add_score(85))   # Output: [85]
print(add_score(92))   # Output: [92] ← đúng rồi
```
:::

## `*args` và `**kwargs`

### `*args` — số lượng positional arguments không xác định

```python
def calculate_total(*scores):
    """Tính tổng điểm, nhận bất kỳ số lượng điểm nào."""
    print(f"Nhận được {len(scores)} điểm: {scores}")
    return sum(scores)

print(calculate_total(85))            # Output: 85
print(calculate_total(85, 92, 78))    # Output: 255
print(calculate_total(70, 80, 90, 95, 88))  # Output: 423
```

### `**kwargs` — số lượng keyword arguments không xác định

```python
def create_profile(name, **extra_info):
    """Tạo profile với thông tin tùy chọn."""
    profile = {"name": name}
    profile.update(extra_info)
    return profile

p1 = create_profile("An")
p2 = create_profile("Bình", age=20, city="Hà Nội", gpa=8.5)
p3 = create_profile("Cường", school="ĐH Bách Khoa", year=3)

print(p1)  # Output: {'name': 'An'}
print(p2)  # Output: {'name': 'Bình', 'age': 20, 'city': 'Hà Nội', 'gpa': 8.5}
```

### Kết hợp tất cả

```python
# Thứ tự: positional → *args → keyword với default → **kwargs
def complex_func(required, *args, keyword="default", **kwargs):
    print(f"required: {required}")
    print(f"args: {args}")
    print(f"keyword: {keyword}")
    print(f"kwargs: {kwargs}")

complex_func("hello", 1, 2, 3, keyword="custom", extra="value")
# Output:
# required: hello
# args: (1, 2, 3)
# keyword: custom
# kwargs: {'extra': 'value'}
```

## Scope: LEGB Rule

Python tìm biến theo thứ tự **LEGB**:
1. **L**ocal — trong function hiện tại
2. **E**nclosing — trong function bao ngoài (với closure)
3. **G**lobal — ở module level
4. **B**uilt-in — Python built-ins (`print`, `len`, ...)

```python
x = "global"  # Global scope

def outer():
    x = "enclosing"  # Enclosing scope

    def inner():
        x = "local"   # Local scope
        print(x)      # Tìm Local trước → "local"

    inner()
    print(x)          # Enclosing → "enclosing"

outer()
print(x)              # Global → "global"

# Output:
# local
# enclosing
# global
```

### `global` và `nonlocal`

```python
counter = 0  # Global

def increment():
    global counter  # Khai báo dùng biến global
    counter += 1

increment()
increment()
print(counter)  # Output: 2

# nonlocal — dùng trong nested function
def make_counter():
    count = 0

    def increment():
        nonlocal count  # Dùng count từ enclosing scope
        count += 1
        return count

    return increment

counter = make_counter()
print(counter())  # Output: 1
print(counter())  # Output: 2
print(counter())  # Output: 3
```

:::note Hạn chế dùng global
Biến global làm code khó test và debug. Ưu tiên truyền tham số và trả về giá trị thay vì dùng global.
:::

## Lambda function

Lambda là hàm ẩn danh một biểu thức.

```python
# Hàm thông thường
def square(x):
    return x ** 2

# Lambda tương đương
square = lambda x: x ** 2
print(square(5))  # Output: 25

# Lambda với nhiều tham số
add = lambda a, b: a + b
print(add(3, 4))  # Output: 7
```

### Khi nào dùng lambda?

Lambda hữu ích khi truyền hàm ngắn vào `sorted()`, `map()`, `filter()`:

```python
students = [
    {"name": "An", "score": 85},
    {"name": "Bình", "score": 92},
    {"name": "Cường", "score": 78},
    {"name": "Dung", "score": 88},
]

# Sắp xếp theo điểm
sorted_students = sorted(students, key=lambda s: s["score"], reverse=True)
for s in sorted_students:
    print(f"{s['name']}: {s['score']}")

# Output:
# Bình: 92
# Dung: 88
# An: 85
# Cường: 78

# map() — áp dụng hàm lên từng phần tử
scores = [85, 92, 78, 88]
doubled = list(map(lambda x: x * 2, scores))
print(doubled)  # Output: [170, 184, 156, 176]

# filter() — lọc phần tử thỏa điều kiện
passed = list(filter(lambda x: x >= 80, scores))
print(passed)   # Output: [85, 92, 88]
```

:::tip Lambda vs List comprehension
Thường list comprehension dễ đọc hơn `map`/`filter` với lambda:
```python
# Lambda + map
doubled = list(map(lambda x: x * 2, scores))

# List comprehension — rõ ràng hơn
doubled = [x * 2 for x in scores]
```
:::

## Docstrings

```python
def calculate_grade(score: float, max_score: float = 100) -> str:
    """
    Tính xếp loại học sinh từ điểm số.

    Args:
        score: Điểm số của học sinh (0 đến max_score)
        max_score: Điểm tối đa (mặc định 100)

    Returns:
        Xếp loại: 'Xuất sắc', 'Giỏi', 'Khá', 'Trung bình', hoặc 'Yếu'

    Raises:
        ValueError: Nếu score < 0 hoặc score > max_score

    Examples:
        >>> calculate_grade(85)
        'Giỏi'
        >>> calculate_grade(95, 100)
        'Xuất sắc'
    """
    if not (0 <= score <= max_score):
        raise ValueError(f"Điểm phải từ 0 đến {max_score}")

    percentage = score / max_score * 100

    if percentage >= 90:
        return "Xuất sắc"
    elif percentage >= 80:
        return "Giỏi"
    elif percentage >= 70:
        return "Khá"
    elif percentage >= 50:
        return "Trung bình"
    else:
        return "Yếu"


# Xem docstring
help(calculate_grade)
print(calculate_grade.__doc__)
```

## Pure function vs Side effects

```python
# Pure function — kết quả chỉ phụ thuộc vào input, không thay đổi gì bên ngoài
def calculate_total(scores: list) -> float:
    return sum(scores)

# Hàm có side effect — thay đổi state bên ngoài
class ScoreManager:
    def __init__(self):
        self.scores = []

    def add_score(self, score: float) -> None:
        self.scores.append(score)  # Side effect: thay đổi self.scores
        print(f"Đã thêm điểm: {score}")  # Side effect: in ra màn hình
```

**Khi nào dùng pure function?**
- Tính toán, chuyển đổi dữ liệu
- Dễ test: cùng input luôn cho cùng output
- Dễ debug và tái sử dụng

**Khi nào side effects là cần thiết?**
- Ghi file, gửi request, cập nhật database
- Thay đổi UI, in ra màn hình

## Bài tập

**Bài 1.** Viết hàm `calculate_statistics(scores: list) -> dict` nhận list điểm và trả về dict có: `min`, `max`, `average`, `median`, `count`. Không dùng thư viện statistics.

**Bài 2.** Viết hàm `format_currency(amount: float, currency: str = "VND", decimals: int = 0) -> str` định dạng số thành chuỗi tiền tệ. Ví dụ: `format_currency(1500000)` → `"1,500,000 VND"`.

**Bài 3.** Viết hàm `memoize(func)` — một decorator đơn giản cache kết quả của hàm để tránh tính lại. Dùng dict làm cache. Test với hàm tính Fibonacci.

**Bài 4.** Viết hàm `flatten(nested_list)` nhận list lồng nhau (có thể nhiều cấp) và trả về list phẳng. Ví dụ: `flatten([1, [2, [3, 4]], 5])` → `[1, 2, 3, 4, 5]`. (Gợi ý: dùng recursion.)
