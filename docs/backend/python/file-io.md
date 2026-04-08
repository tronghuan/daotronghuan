---
title: Đọc và ghi file (File I/O)
description: Làm việc với file text, JSON, CSV trong Python bằng open(), pathlib và các best practices
sidebar_position: 8
---

Hầu hết ứng dụng thực tế đều cần đọc/ghi file — đọc config, lưu kết quả, xử lý dữ liệu CSV, cache dữ liệu JSON. Python có API file I/O rõ ràng và dễ dùng.

## `open()` và `with` statement

### Tại sao dùng `with`?

```python
# Cách CŨ — không dùng with
file = open("students.txt", "r", encoding="utf-8")
content = file.read()
file.close()  # Phải nhớ đóng file — nếu quên hoặc có lỗi trước đó → file leak

# Cách ĐÚNG — dùng with (context manager)
with open("students.txt", "r", encoding="utf-8") as file:
    content = file.read()
# File tự động đóng khi ra khỏi block with — kể cả khi có exception
```

`with` đảm bảo file luôn được đóng đúng cách, ngay cả khi có lỗi xảy ra trong quá trình xử lý.

### Các mode mở file

| Mode | Mô tả | File phải tồn tại? |
|---|---|---|
| `"r"` | Đọc (mặc định) | Có, lỗi nếu không |
| `"w"` | Ghi (xóa nội dung cũ) | Không (tạo mới nếu chưa có) |
| `"a"` | Append (thêm vào cuối) | Không (tạo mới nếu chưa có) |
| `"r+"` | Đọc và ghi | Có |
| `"x"` | Tạo mới, lỗi nếu đã tồn tại | Không |
| `"rb"` | Đọc binary (ảnh, PDF...) | Có |
| `"wb"` | Ghi binary | Không |

## Đọc file

```python title="students.txt"
Nguyễn Văn An - 85
Trần Thị Bình - 92
Lê Văn Cường - 78
```

```python
# read() — đọc toàn bộ nội dung thành 1 string
with open("students.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)
    print(f"Đã đọc {len(content)} ký tự")

# readline() — đọc từng dòng
with open("students.txt", "r", encoding="utf-8") as f:
    line1 = f.readline()  # "Nguyễn Văn An - 85\n"
    line2 = f.readline()  # "Trần Thị Bình - 92\n"
    print(line1.strip())  # "Nguyễn Văn An - 85"

# readlines() — đọc tất cả dòng thành list
with open("students.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()  # ["Nguyễn Văn An - 85\n", ...]
    for line in lines:
        print(line.strip())

# Cách PYTHONIC — duyệt file như iterable
with open("students.txt", "r", encoding="utf-8") as f:
    for line in f:  # Đọc từng dòng, tiết kiệm memory
        name, score = line.strip().split(" - ")
        print(f"{name}: {int(score)} điểm")
```

## Ghi file

```python
students = [
    ("Nguyễn Văn An", 85, "Giỏi"),
    ("Trần Thị Bình", 92, "Xuất sắc"),
    ("Lê Văn Cường", 78, "Khá"),
]

# write() — ghi một chuỗi
with open("report.txt", "w", encoding="utf-8") as f:
    f.write("BÁO CÁO KẾT QUẢ HỌC TẬP\n")
    f.write("=" * 40 + "\n")
    for name, score, grade in students:
        f.write(f"{name:<20} {score:>5} ({grade})\n")

# writelines() — ghi list các chuỗi (không tự thêm \n)
lines = [f"{name} - {score}\n" for name, score, _ in students]
with open("scores.txt", "w", encoding="utf-8") as f:
    f.writelines(lines)

# Append — thêm vào cuối file (không xóa nội dung cũ)
new_student = ("Phạm Thị Dung", 88, "Giỏi")
with open("report.txt", "a", encoding="utf-8") as f:
    name, score, grade = new_student
    f.write(f"{name:<20} {score:>5} ({grade})\n")
```

:::warning Encoding UTF-8 trên Windows
Windows dùng encoding mặc định là `cp1252` (hoặc `gbk` tùy locale) — không phải UTF-8. Khi đọc/ghi file tiếng Việt, **luôn chỉ định** `encoding="utf-8"` để tránh lỗi ký tự.

```python
# Luôn làm thế này
with open("data.txt", "r", encoding="utf-8") as f:
    ...

# KHÔNG làm thế này (dùng default encoding của OS)
with open("data.txt", "r") as f:
    ...
```
:::

## JSON

JSON là format phổ biến nhất để lưu và trao đổi dữ liệu có cấu trúc.

```python
import json

# Python object → JSON string
student = {
    "name": "Nguyễn Văn An",
    "age": 20,
    "scores": {"math": 85, "physics": 92, "chemistry": 78},
    "is_graduated": False,
    "address": None,
}

# json.dumps() — Python object → string
json_str = json.dumps(student, ensure_ascii=False, indent=2)
print(json_str)
# Output:
# {
#   "name": "Nguyễn Văn An",
#   "age": 20,
#   ...
# }

# json.loads() — string → Python object
parsed = json.loads(json_str)
print(parsed["name"])    # Output: Nguyễn Văn An
print(type(parsed))      # Output: <class 'dict'>
```

```python
# json.dump() — Python object → file
with open("student.json", "w", encoding="utf-8") as f:
    json.dump(student, f, ensure_ascii=False, indent=2)

# json.load() — file → Python object
with open("student.json", "r", encoding="utf-8") as f:
    loaded = json.load(f)

print(loaded["scores"]["math"])  # Output: 85
```

### Ứng dụng thực tế: Config file

```python
import json
from pathlib import Path

CONFIG_FILE = Path("config.json")

def load_config() -> dict:
    """Đọc config từ file, trả về dict rỗng nếu không có file."""
    if not CONFIG_FILE.exists():
        return {}
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_config(config: dict) -> None:
    """Lưu config ra file."""
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, ensure_ascii=False, indent=2)

# Sử dụng
config = load_config()
config["theme"] = "dark"
config["language"] = "vi"
save_config(config)
```

## CSV

CSV (Comma-Separated Values) thường dùng cho dữ liệu bảng.

```python
import csv

# Đọc CSV với csv.reader
with open("students.csv", "r", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)   # Bỏ qua dòng header
    print(f"Columns: {header}")

    for row in reader:
        name, score, grade = row
        print(f"{name}: {score} ({grade})")
```

```python
# Đọc CSV với csv.DictReader — tiện hơn, truy cập theo tên cột
with open("students.csv", "r", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    students = list(reader)  # Mỗi row là dict

for student in students:
    print(f"{student['name']}: {student['score']}")

# Tính điểm trung bình
avg = sum(float(s["score"]) for s in students) / len(students)
print(f"Điểm TB cả lớp: {avg:.1f}")
```

```python
# Ghi CSV với csv.DictWriter
students = [
    {"name": "Nguyễn Văn An", "score": 85, "grade": "Giỏi"},
    {"name": "Trần Thị Bình", "score": 92, "grade": "Xuất sắc"},
    {"name": "Lê Văn Cường", "score": 78, "grade": "Khá"},
]

with open("results.csv", "w", encoding="utf-8", newline="") as f:
    fieldnames = ["name", "score", "grade"]
    writer = csv.DictWriter(f, fieldnames=fieldnames)

    writer.writeheader()      # Ghi dòng header
    writer.writerows(students)  # Ghi tất cả rows
```

:::note `newline=""` khi làm việc với CSV
Khi mở file CSV, luôn dùng `newline=""` để tránh dòng trống thừa trên Windows.
:::

## `pathlib.Path` — modern file paths

`pathlib` là cách hiện đại để làm việc với đường dẫn file, thay thế `os.path`.

```python
from pathlib import Path

# Tạo path object
home = Path.home()                      # /Users/huan hoặc C:\Users\huan
current = Path.cwd()                    # Working directory hiện tại
data_dir = Path("data")                 # Relative path
config_file = Path("config/app.json")  # Nested path

# Ghép đường dẫn — dùng / operator
project_root = Path("/projects/myapp")
src_dir = project_root / "src"
main_file = src_dir / "main.py"
print(main_file)  # Output: /projects/myapp/src/main.py

# Thông tin về path
print(main_file.name)         # Output: main.py
print(main_file.stem)         # Output: main (không có extension)
print(main_file.suffix)       # Output: .py
print(main_file.parent)       # Output: /projects/myapp/src
print(main_file.parts)        # Output: ('/', 'projects', 'myapp', 'src', 'main.py')

# Kiểm tra
path = Path("data/students.csv")
print(path.exists())          # True/False
print(path.is_file())         # True nếu là file
print(path.is_dir())          # True nếu là thư mục

# Tạo thư mục
output_dir = Path("output/reports")
output_dir.mkdir(parents=True, exist_ok=True)
# parents=True: tạo cả thư mục cha
# exist_ok=True: không lỗi nếu đã tồn tại

# Liệt kê file trong thư mục
src = Path("src")
for py_file in src.glob("*.py"):
    print(py_file.name)

# Đọc/ghi file với pathlib
config = Path("config.json")
content = config.read_text(encoding="utf-8")      # Đọc toàn bộ
config.write_text('{"theme": "dark"}', encoding="utf-8")  # Ghi

# Xóa file
temp = Path("temp.txt")
if temp.exists():
    temp.unlink()  # Xóa file

# Đổi tên / di chuyển
old_path = Path("old_name.txt")
old_path.rename("new_name.txt")
```

### So sánh os.path vs pathlib

```python
# os.path — cách cũ
import os
config_path = os.path.join("config", "app.json")
exists = os.path.exists(config_path)
filename = os.path.basename(config_path)

# pathlib — cách mới, OOP, dễ đọc hơn
from pathlib import Path
config_path = Path("config") / "app.json"
exists = config_path.exists()
filename = config_path.name
```

## Bài tập

**Bài 1.** Viết chương trình đọc file `students.txt` (mỗi dòng: "Tên - Điểm"), tính điểm trung bình, tìm học sinh điểm cao nhất và thấp nhất, ghi kết quả vào file `report.txt`.

**Bài 2.** Viết hàm `save_students(students: list, filepath: str)` và `load_students(filepath: str) -> list` để lưu/đọc danh sách học sinh dạng JSON. Xử lý trường hợp file không tồn tại.

**Bài 3.** Viết script đọc file CSV điểm học sinh (có cột: name, math, physics, chemistry), tính điểm trung bình từng học sinh, xếp loại, rồi ghi ra file CSV mới có thêm cột `average` và `grade`.

**Bài 4.** Dùng `pathlib`, viết hàm `backup_file(source: Path) -> Path` tạo bản backup với tên `filename_backup_YYYYMMDD.ext` trong cùng thư mục. Không ghi đè nếu backup đã tồn tại hôm nay.
