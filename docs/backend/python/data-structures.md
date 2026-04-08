---
title: Cấu trúc dữ liệu
description: List, Tuple, Dict, Set trong Python — khi nào dùng cái nào và các thao tác quan trọng
sidebar_position: 6
---

Python có 4 cấu trúc dữ liệu built-in quan trọng: List, Tuple, Dict và Set. Mỗi loại có đặc điểm riêng và phù hợp cho từng bài toán khác nhau. Chọn đúng cấu trúc dữ liệu giúp code hiệu quả và rõ ràng hơn.

## List

List là cấu trúc dữ liệu linh hoạt nhất — có thứ tự, có thể thay đổi, cho phép phần tử trùng lặp.

### Tạo và truy cập

```python
# Tạo list
scores = [85, 92, 78, 88, 71]
students = ["An", "Bình", "Cường"]
mixed = [1, "hello", True, 3.14, None]  # List có thể chứa nhiều kiểu
empty = []
from_range = list(range(1, 6))  # [1, 2, 3, 4, 5]

# Truy cập theo index (bắt đầu từ 0)
print(scores[0])    # Output: 85 — phần tử đầu
print(scores[-1])   # Output: 71 — phần tử cuối
print(scores[-2])   # Output: 88 — phần tử thứ 2 từ cuối

# Slicing: list[start:stop:step]
print(scores[1:4])  # Output: [92, 78, 88] — index 1, 2, 3
print(scores[:3])   # Output: [85, 92, 78] — 3 phần tử đầu
print(scores[2:])   # Output: [78, 88, 71] — từ index 2 đến hết
print(scores[::-1]) # Output: [71, 88, 78, 92, 85] — đảo ngược
```

### Thêm và xóa phần tử

```python
cart = ["táo", "chuối"]

# Thêm
cart.append("xoài")        # Thêm vào cuối: ["táo", "chuối", "xoài"]
cart.insert(1, "cam")      # Thêm vào vị trí 1: ["táo", "cam", "chuối", "xoài"]
cart.extend(["nho", "lê"]) # Thêm nhiều phần tử: [..., "nho", "lê"]
cart += ["dâu"]            # Tương đương extend

print(cart)
# Output: ['táo', 'cam', 'chuối', 'xoài', 'nho', 'lê', 'dâu']

# Xóa
cart.remove("cam")      # Xóa phần tử đầu tiên có giá trị "cam"
popped = cart.pop()     # Xóa và trả về phần tử cuối
popped_at = cart.pop(0) # Xóa và trả về phần tử tại index 0
del cart[1]             # Xóa phần tử tại index 1

print(f"Đã lấy ra: {popped}")  # Output: Đã lấy ra: dâu
```

### Tìm kiếm và kiểm tra

```python
scores = [85, 92, 78, 88, 71, 92]

print(85 in scores)          # Output: True
print(100 in scores)         # Output: False
print(scores.index(92))      # Output: 1 — index đầu tiên của 92
print(scores.count(92))      # Output: 2 — 92 xuất hiện 2 lần
print(len(scores))           # Output: 6
```

### Sắp xếp

```python
scores = [85, 92, 78, 88, 71]

# sort() — sắp xếp IN-PLACE (thay đổi list gốc)
scores.sort()
print(scores)   # Output: [71, 78, 85, 88, 92]

scores.sort(reverse=True)
print(scores)   # Output: [92, 88, 85, 78, 71]

# sorted() — trả về list MỚI, không thay đổi list gốc
original = [85, 92, 78, 88, 71]
sorted_scores = sorted(original)
print(original)       # Output: [85, 92, 78, 88, 71] — không đổi
print(sorted_scores)  # Output: [71, 78, 85, 88, 92]

# Sắp xếp theo tiêu chí tùy chọn
students = [
    {"name": "An", "score": 85},
    {"name": "Bình", "score": 92},
    {"name": "Cường", "score": 78},
]
students.sort(key=lambda s: s["score"], reverse=True)
for s in students:
    print(f"{s['name']}: {s['score']}")
# Output:
# Bình: 92
# An: 85
# Cường: 78
```

### Các thao tác khác

```python
scores = [85, 92, 78]

scores.reverse()     # Đảo ngược IN-PLACE: [78, 92, 85]
scores_copy = scores.copy()  # Tạo bản sao shallow
scores.clear()       # Xóa hết phần tử: []

# Thống kê nhanh
nums = [4, 2, 8, 1, 9, 3]
print(min(nums))     # Output: 1
print(max(nums))     # Output: 9
print(sum(nums))     # Output: 27
```

## Tuple

Tuple giống List nhưng **immutable** — không thể thay đổi sau khi tạo.

```python
# Tạo tuple
point = (3, 5)
rgb = (255, 128, 0)
single = (42,)     # Tuple 1 phần tử — cần dấu phẩy!
empty = ()
without_paren = 1, 2, 3  # Packing — cũng là tuple

print(type(point))   # Output: <class 'tuple'>
print(point[0])      # Output: 3
print(point[-1])     # Output: 5

# Không thể thay đổi
point[0] = 10  # TypeError: 'tuple' object does not support item assignment
```

### Tuple unpacking

```python
# Unpacking cơ bản
x, y = (3, 5)
print(x, y)  # Output: 3 5

# Swap không cần biến tạm
a, b = 10, 20
a, b = b, a
print(a, b)  # Output: 20 10

# Unpacking với *
first, *rest = (1, 2, 3, 4, 5)
print(first)   # Output: 1
print(rest)    # Output: [2, 3, 4, 5]

*beginning, last = (1, 2, 3, 4, 5)
print(beginning)  # Output: [1, 2, 3, 4]
print(last)       # Output: 5

first, *middle, last = (1, 2, 3, 4, 5)
print(middle)  # Output: [2, 3, 4]

# Unpack khi gọi hàm
def add(a, b, c):
    return a + b + c

nums = (1, 2, 3)
print(add(*nums))  # Output: 6 — tương đương add(1, 2, 3)
```

### Khi nào dùng Tuple thay List?

```python
# Tuple cho dữ liệu không đổi — tọa độ, màu, record
SCREEN_SIZE = (1920, 1080)  # Hằng số
GPS_LOCATION = (10.7769, 106.7009)  # Lat/Long TP.HCM
HTTP_METHODS = ("GET", "POST", "PUT", "DELETE")

# Tuple có thể là key của dict (list không được)
cache = {}
cache[(0, 0)] = "origin"    # OK — tuple là hashable
cache[[0, 0]] = "origin"    # TypeError — list không hashable

# Tuple nhẹ hơn List trong memory
import sys
lst = [1, 2, 3, 4, 5]
tpl = (1, 2, 3, 4, 5)
print(sys.getsizeof(lst))  # Output: 120 (byte)
print(sys.getsizeof(tpl))  # Output: 80 (byte)
```

## Dict

Dict (dictionary) lưu cặp key-value, không cho phép key trùng lặp.

### Tạo và truy cập

```python
# Tạo dict
student = {
    "name": "Nguyễn Văn An",
    "age": 20,
    "score": 8.5,
    "subjects": ["Toán", "Lý", "Hóa"],
}

# Truy cập theo key
print(student["name"])     # Output: Nguyễn Văn An
print(student["score"])    # Output: 8.5

# KeyError nếu key không tồn tại
print(student["email"])    # KeyError: 'email'

# get() — an toàn hơn, trả về None (hoặc default) nếu không có
print(student.get("email"))          # Output: None
print(student.get("email", "N/A"))   # Output: N/A
```

### Thêm, sửa, xóa

```python
student = {"name": "An", "score": 8.5}

# Thêm/sửa
student["email"] = "an@example.com"   # Thêm key mới
student["score"] = 9.0                 # Sửa giá trị

# Xóa
del student["email"]                   # Xóa key, lỗi nếu không tồn tại
score = student.pop("score")           # Xóa và trả về value
score = student.pop("grade", None)     # An toàn với default

# Update nhiều key cùng lúc
student.update({"age": 21, "city": "Hà Nội"})
# Python 3.9+: dùng | operator
# student = student | {"age": 21}

print(student)
# Output: {'name': 'An', 'age': 21, 'city': 'Hà Nội'}
```

### Duyệt dict

```python
scores = {"An": 85, "Bình": 92, "Cường": 78}

# Keys, values, items
print(list(scores.keys()))    # Output: ['An', 'Bình', 'Cường']
print(list(scores.values()))  # Output: [85, 92, 78]
print(list(scores.items()))   # Output: [('An', 85), ('Bình', 92), ('Cường', 78)]

# Duyệt
for name, score in scores.items():
    status = "Đạt" if score >= 60 else "Không đạt"
    print(f"{name}: {score} — {status}")
```

### Dict comprehension

```python
# Tạo dict từ 2 list
names = ["An", "Bình", "Cường"]
scores = [85, 92, 78]
score_dict = {name: score for name, score in zip(names, scores)}
print(score_dict)  # Output: {'An': 85, 'Bình': 92, 'Cường': 78}

# Lọc và transform
high_scores = {name: score for name, score in score_dict.items() if score >= 80}
print(high_scores)  # Output: {'An': 85, 'Bình': 92}

# Đảo ngược key-value
inverted = {score: name for name, score in score_dict.items()}
print(inverted)  # Output: {85: 'An', 92: 'Bình', 78: 'Cường'}
```

### Nested dict

```python
classroom = {
    "10A1": {
        "teacher": "Nguyễn Văn Nam",
        "students": 35,
        "avg_score": 8.2,
    },
    "10A2": {
        "teacher": "Trần Thị Lan",
        "students": 33,
        "avg_score": 7.9,
    },
}

# Truy cập nested
print(classroom["10A1"]["teacher"])   # Output: Nguyễn Văn Nam
print(classroom["10A2"]["avg_score"]) # Output: 7.9

# An toàn với nested dict
teacher = classroom.get("10A3", {}).get("teacher", "Chưa phân công")
print(teacher)  # Output: Chưa phân công
```

## Set

Set lưu tập hợp các giá trị **duy nhất**, không có thứ tự.

```python
# Tạo set
fruits = {"táo", "chuối", "xoài"}
unique_scores = {85, 92, 78, 85, 92}  # Tự loại duplicate
print(unique_scores)  # Output: {85, 78, 92} — thứ tự không đảm bảo

empty_set = set()    # Không dùng {} — đó là dict rỗng!
from_list = set([1, 2, 2, 3, 3, 3])
print(from_list)     # Output: {1, 2, 3}

# Kiểm tra thành viên — O(1), nhanh hơn list O(n)
print("táo" in fruits)   # Output: True
print("cam" in fruits)   # Output: False
```

### Thêm và xóa

```python
tags = {"python", "backend", "api"}

tags.add("devops")              # Thêm một phần tử
tags.update(["docker", "git"])  # Thêm nhiều phần tử

tags.remove("api")      # Xóa — lỗi nếu không có
tags.discard("xml")     # Xóa an toàn — không lỗi nếu không có
popped = tags.pop()     # Xóa và trả về một phần tử ngẫu nhiên
```

### Phép toán tập hợp

```python
python_devs = {"An", "Bình", "Cường", "Dung"}
java_devs = {"Bình", "Em", "Phúc", "Dung"}

# Union — hợp
all_devs = python_devs | java_devs
# hoặc: python_devs.union(java_devs)
print(all_devs)
# Output: {'An', 'Bình', 'Cường', 'Dung', 'Em', 'Phúc'}

# Intersection — giao (biết cả 2 ngôn ngữ)
both = python_devs & java_devs
# hoặc: python_devs.intersection(java_devs)
print(both)
# Output: {'Bình', 'Dung'}

# Difference — hiệu (chỉ biết Python, không biết Java)
only_python = python_devs - java_devs
# hoặc: python_devs.difference(java_devs)
print(only_python)
# Output: {'An', 'Cường'}

# Symmetric difference — chỉ biết một trong hai
exclusive = python_devs ^ java_devs
print(exclusive)
# Output: {'An', 'Cường', 'Em', 'Phúc'}

# Subset và superset
a = {1, 2}
b = {1, 2, 3, 4}
print(a.issubset(b))    # Output: True — a ⊆ b
print(b.issuperset(a))  # Output: True — b ⊇ a
```

## Bảng so sánh: Khi nào dùng cái nào?

| Tiêu chí | List | Tuple | Dict | Set |
|---|---|---|---|---|
| Có thứ tự? | Có | Có | Có (Python 3.7+) | Không |
| Mutable? | Có | Không | Có | Có |
| Phần tử trùng? | Cho phép | Cho phép | Key không trùng | Không |
| Truy cập bằng? | Index | Index | Key | Không truy cập trực tiếp |
| Tìm kiếm | O(n) | O(n) | O(1) | O(1) |
| Dùng khi | Danh sách thay đổi | Dữ liệu cố định | Key-value mapping | Tập hợp unique |

### Quyết định nhanh

```
Cần key-value?              → Dict
Cần unique, không quan tâm thứ tự? → Set
Dữ liệu không thay đổi?    → Tuple
Còn lại (danh sách thông thường) → List
```

## Bài tập

**Bài 1.** Cho danh sách giao dịch mua hàng: `[("Táo", 15000, 3), ("Chuối", 8000, 5), ("Xoài", 25000, 2), ("Táo", 15000, 1)]`. Mỗi tuple là `(sản_phẩm, đơn_giá, số_lượng)`. Tính tổng tiền từng sản phẩm và tổng hóa đơn.

**Bài 2.** Viết hàm `count_words(text: str) -> dict` đếm số lần xuất hiện của từng từ trong chuỗi. Ví dụ: `count_words("hello world hello python")` → `{"hello": 2, "world": 1, "python": 1}`.

**Bài 3.** Cho 2 list: danh sách đăng ký môn Toán và danh sách đăng ký môn Lý. Dùng set để tìm: học sinh học cả 2 môn, học sinh chỉ học Toán, học sinh học ít nhất 1 môn.

**Bài 4.** Viết hàm `group_by_grade(students: list) -> dict` nhận list `[{"name": ..., "score": ...}]` và trả về dict nhóm theo xếp loại: `{"Xuất sắc": [...], "Giỏi": [...], ...}`.
