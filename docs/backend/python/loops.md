---
title: Vòng lặp
description: for loop, while loop, enumerate, zip, list comprehension và các kỹ thuật lặp pythonic
sidebar_position: 4
---

Vòng lặp giúp bạn tự động hóa tác vụ lặp đi lặp lại — từ duyệt danh sách học sinh, tính tổng điểm, đến xử lý hàng nghìn dòng dữ liệu. Python có nhiều cách lặp thanh lịch mà ngôn ngữ khác không có.

## `for` loop

### Duyệt list

```python
students = ["An", "Bình", "Cường", "Dung"]

for student in students:
    print(f"Xin chào, {student}!")

# Output:
# Xin chào, An!
# Xin chào, Bình!
# Xin chào, Cường!
# Xin chào, Dung!
```

### `range()` — tạo dãy số

```python
# range(stop) — từ 0 đến stop-1
for i in range(5):
    print(i, end=" ")  # Output: 0 1 2 3 4

print()  # Xuống dòng

# range(start, stop) — từ start đến stop-1
for i in range(1, 6):
    print(i, end=" ")  # Output: 1 2 3 4 5

print()

# range(start, stop, step) — bước nhảy
for i in range(0, 11, 2):
    print(i, end=" ")  # Output: 0 2 4 6 8 10

print()

# Đếm ngược
for i in range(5, 0, -1):
    print(i, end=" ")  # Output: 5 4 3 2 1
```

### Duyệt dict

```python
scores = {"An": 85, "Bình": 92, "Cường": 78}

# Duyệt keys (mặc định)
for name in scores:
    print(name)  # An, Bình, Cường

# Duyệt values
for score in scores.values():
    print(score)  # 85, 92, 78

# Duyệt key-value cùng lúc
for name, score in scores.items():
    print(f"{name}: {score} điểm")

# Output:
# An: 85 điểm
# Bình: 92 điểm
# Cường: 78 điểm
```

## `enumerate()` — index và value cùng lúc

```python
shopping_list = ["táo", "chuối", "xoài", "cam"]

# Cách KHÔNG nên làm
for i in range(len(shopping_list)):
    print(f"{i+1}. {shopping_list[i]}")

# Cách PYTHONIC — dùng enumerate
for index, item in enumerate(shopping_list, start=1):
    print(f"{index}. {item}")

# Output:
# 1. táo
# 2. chuối
# 3. xoài
# 4. cam
```

```python
# Ứng dụng: tìm vị trí phần tử thỏa điều kiện
scores = [78, 92, 65, 88, 71]

for i, score in enumerate(scores):
    if score < 70:
        print(f"Học sinh vị trí {i} cần cải thiện: {score} điểm")

# Output: Học sinh vị trí 2 cần cải thiện: 65 điểm
```

## `zip()` — duyệt 2 list song song

```python
names = ["An", "Bình", "Cường"]
scores = [85, 92, 78]
grades = ["Giỏi", "Xuất sắc", "Khá"]

# Duyệt 2 list cùng lúc
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# Output:
# An: 85
# Bình: 92
# Cường: 78

# Duyệt 3 list cùng lúc
for name, score, grade in zip(names, scores, grades):
    print(f"{name}: {score} — {grade}")
```

```python
# zip dừng ở list ngắn nhất
a = [1, 2, 3, 4, 5]
b = ["x", "y", "z"]

for x, y in zip(a, b):
    print(x, y)

# Output:
# 1 x
# 2 y
# 3 z   ← dừng ở đây vì b chỉ có 3 phần tử
```

:::tip Tạo dict từ 2 list
```python
names = ["An", "Bình", "Cường"]
scores = [85, 92, 78]

score_dict = dict(zip(names, scores))
print(score_dict)
# Output: {'An': 85, 'Bình': 92, 'Cường': 78}
```
:::

## `while` loop

```python
# Lặp khi điều kiện còn đúng
count = 0
while count < 5:
    print(f"Lần {count + 1}")
    count += 1

# Output:
# Lần 1
# Lần 2
# Lần 3
# Lần 4
# Lần 5
```

### Ứng dụng thực tế: Nhập liệu có validation

```python
while True:
    user_input = input("Nhập điểm (0-10): ")
    try:
        score = float(user_input)
        if 0 <= score <= 10:
            break  # Thoát khỏi vòng lặp khi nhập đúng
        else:
            print("Điểm phải từ 0 đến 10. Thử lại.")
    except ValueError:
        print("Vui lòng nhập số. Thử lại.")

print(f"Điểm đã nhập: {score}")
```

## `break`, `continue`, `else` trong loop

### `break` — thoát khỏi vòng lặp

```python
students = ["An", "Bình", "Cường", "Dung", "Em"]
target = "Cường"

for student in students:
    if student == target:
        print(f"Tìm thấy: {student}")
        break  # Dừng ngay, không duyệt tiếp
    print(f"Đang kiểm tra: {student}")

# Output:
# Đang kiểm tra: An
# Đang kiểm tra: Bình
# Tìm thấy: Cường
```

### `continue` — bỏ qua iteration hiện tại

```python
scores = [85, -1, 92, -1, 78, 65, -1, 88]
# -1 nghĩa là học sinh vắng mặt

valid_scores = []
for score in scores:
    if score == -1:
        continue  # Bỏ qua điểm -1
    valid_scores.append(score)

print(valid_scores)  # Output: [85, 92, 78, 65, 88]
print(f"Điểm TB: {sum(valid_scores) / len(valid_scores):.1f}")
# Output: Điểm TB: 81.6
```

### `else` trong loop — ít người biết!

```python
# else chạy khi loop kết thúc tự nhiên (không bị break)
students = ["An", "Bình", "Dung"]
target = "Cường"

for student in students:
    if student == target:
        print(f"Tìm thấy: {target}")
        break
else:
    # Chỉ chạy nếu loop không bị break
    print(f"Không tìm thấy học sinh: {target}")

# Output: Không tìm thấy học sinh: Cường
```

## List comprehension — pythonic way

List comprehension là cú pháp ngắn gọn để tạo list từ iterable.

```python
# Cú pháp: [biểu_thức for phần_tử in iterable]

# Cách thông thường
squares = []
for i in range(1, 6):
    squares.append(i ** 2)

# List comprehension — ngắn hơn, pythonic hơn
squares = [i ** 2 for i in range(1, 6)]
print(squares)  # Output: [1, 4, 9, 16, 25]
```

### List comprehension với điều kiện

```python
scores = [85, 45, 92, 58, 78, 30, 95, 62]

# Lấy các điểm đạt (>= 60)
passed = [s for s in scores if s >= 60]
print(passed)  # Output: [85, 92, 78, 95, 62]

# Xếp loại từng điểm
grades = ["Đậu" if s >= 60 else "Rớt" for s in scores]
print(grades)
# Output: ['Đậu', 'Rớt', 'Đậu', 'Rớt', 'Đậu', 'Rớt', 'Đậu', 'Đậu']
```

### Dict comprehension và Set comprehension

```python
names = ["An", "Bình", "Cường"]
scores = [85, 92, 78]

# Dict comprehension
score_dict = {name: score for name, score in zip(names, scores)}
print(score_dict)  # Output: {'An': 85, 'Bình': 92, 'Cường': 78}

# Chỉ lấy học sinh điểm >= 80
top_students = {name: score for name, score in score_dict.items() if score >= 80}
print(top_students)  # Output: {'An': 85, 'Bình': 92}

# Set comprehension — tự động loại duplicate
raw_scores = [85, 92, 85, 78, 92, 65]
unique_scores = {s for s in raw_scores}
print(unique_scores)  # Output: {65, 78, 85, 92}
```

:::tip Khi nào không dùng comprehension
Comprehension tốt cho biểu thức đơn giản. Nếu logic phức tạp (nhiều điều kiện, nhiều dòng), dùng `for` loop thông thường để dễ đọc hơn.
:::

## Pitfalls thường gặp

### Pitfall 1: Infinite loop

```python
# SAI — quên tăng biến đếm → vòng lặp vô tận
count = 0
while count < 10:
    print(count)
    # count += 1  ← quên dòng này → chạy mãi mãi!

# Luôn đảm bảo điều kiện sẽ False sau một số bước
```

### Pitfall 2: Sửa list trong khi đang duyệt

```python
# SAI — bỏ phần tử trong khi đang duyệt gây ra kết quả bất ngờ
scores = [85, 45, 92, 58, 78]
for score in scores:
    if score < 60:
        scores.remove(score)  # NGUY HIỂM!

print(scores)  # Output: [85, 92, 58, 78] — 58 không bị xóa!

# ĐÚNG — tạo list mới
scores = [85, 45, 92, 58, 78]
scores = [s for s in scores if s >= 60]
print(scores)  # Output: [85, 92, 78]

# Hoặc duyệt bản sao
for score in scores[:]:  # scores[:] tạo shallow copy
    if score < 60:
        scores.remove(score)
```

### Pitfall 3: Dùng index khi không cần

```python
students = ["An", "Bình", "Cường"]

# KHÔNG PYTHONIC — dùng index không cần thiết
for i in range(len(students)):
    print(students[i])

# PYTHONIC — duyệt trực tiếp
for student in students:
    print(student)

# Cần index? Dùng enumerate
for i, student in enumerate(students):
    print(f"{i}: {student}")
```

## Bài tập

**Bài 1.** Cho danh sách điểm học sinh: `[78, 92, 65, 88, 71, 95, 55, 84]`. Dùng list comprehension để:
- Tạo list điểm >= 70
- Tạo dict `{điểm: xếp_loại}` (>=80: Giỏi, >=70: Khá, còn lại: TB)

**Bài 2.** Viết chương trình tính bảng cửu chương từ 1 đến 9 bằng nested for loop. Định dạng đẹp, căn cột.

**Bài 3.** Viết hàm `find_duplicates(lst: list) -> list` tìm các phần tử xuất hiện nhiều hơn 1 lần trong list, trả về list các phần tử trùng (không trùng lặp trong kết quả).

**Bài 4.** Viết chương trình mô phỏng giỏ hàng: user nhập tên sản phẩm và giá, nhập "xong" để kết thúc. Sau đó in danh sách sản phẩm và tổng tiền. Dùng `while True` với `break`.
