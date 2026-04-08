---
title: Xử lý lỗi (Exceptions)
description: try/except/finally, các exception phổ biến, raise, custom exceptions và context managers trong Python
sidebar_position: 10
---

Lỗi là điều không thể tránh khỏi — user nhập sai, file không tồn tại, network timeout, dữ liệu bất ngờ. Xử lý lỗi tốt giúp chương trình không bị crash, có thể phục hồi, và cho user thông báo lỗi hữu ích.

## Exception là gì?

Exception là sự kiện bất thường xảy ra khi chương trình đang chạy, làm gián đoạn luồng thực thi bình thường.

```python
# Khi không handle exception, chương trình dừng và in traceback
scores = [85, 92, 78]
print(scores[10])  # IndexError: list index out of range

number = int("hello")  # ValueError: invalid literal for int()

result = 10 / 0  # ZeroDivisionError: division by zero

student = {"name": "An"}
print(student["score"])  # KeyError: 'score'
```

Thay vì để chương trình crash, chúng ta dùng `try/except` để bắt và xử lý lỗi.

## `try` / `except` / `else` / `finally`

### Cấu trúc đầy đủ

```python
try:
    # Code có thể gây lỗi
    result = risky_operation()
except SomeException as e:
    # Xử lý khi có lỗi
    print(f"Lỗi: {e}")
else:
    # Chỉ chạy khi KHÔNG có lỗi
    print(f"Thành công: {result}")
finally:
    # LUÔN chạy — dù có lỗi hay không
    print("Kết thúc")
```

### Ví dụ thực tế

```python
def read_score(prompt: str) -> float:
    """Đọc điểm từ người dùng với validation."""
    while True:
        try:
            value = float(input(prompt))
            if not (0 <= value <= 10):
                raise ValueError(f"Điểm phải từ 0 đến 10, nhận được: {value}")
            return value
        except ValueError as e:
            print(f"Nhập không hợp lệ: {e}. Thử lại.")


def load_student_file(filepath: str) -> list:
    """Đọc file danh sách học sinh."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = f.read()
        return data.splitlines()
    except FileNotFoundError:
        print(f"File không tồn tại: {filepath}")
        return []
    except PermissionError:
        print(f"Không có quyền đọc file: {filepath}")
        return []
    except Exception as e:
        # Bắt mọi lỗi còn lại
        print(f"Lỗi không mong muốn: {type(e).__name__}: {e}")
        return []
```

### `else` clause — ít người biết

```python
def parse_student_record(record: str) -> dict | None:
    """Parse chuỗi 'Tên,Điểm' thành dict."""
    try:
        name, score_str = record.split(",")
        score = float(score_str.strip())
    except ValueError as e:
        print(f"Format sai: {record!r} — {e}")
        return None
    else:
        # Chỉ chạy khi try block thành công hoàn toàn
        return {"name": name.strip(), "score": score}

print(parse_student_record("Nguyễn Văn An, 8.5"))
# Output: {'name': 'Nguyễn Văn An', 'score': 8.5}

print(parse_student_record("InvalidRecord"))
# Output: Format sai: 'InvalidRecord' — not enough values to unpack
# Output: None
```

### `finally` — cleanup đảm bảo

```python
import sqlite3

def get_student_count(db_path: str) -> int:
    conn = None
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) FROM students")
        count = cursor.fetchone()[0]
        return count
    except sqlite3.Error as e:
        print(f"DB error: {e}")
        return 0
    finally:
        # Luôn đóng connection dù có lỗi hay không
        if conn:
            conn.close()
        print("Connection đã đóng")
```

## Các Exception phổ biến

```python
# ValueError — giá trị không hợp lệ
int("hello")           # ValueError
float("abc")           # ValueError
int("8.5")             # ValueError (phải dùng float trước)

# TypeError — sai kiểu dữ liệu
"hello" + 5            # TypeError: can only concatenate str (not "int") to str
len(42)                # TypeError: object of type 'int' has no len()

# KeyError — key không tồn tại trong dict
d = {"a": 1}
d["b"]                 # KeyError: 'b'

# IndexError — index ngoài phạm vi
lst = [1, 2, 3]
lst[10]                # IndexError: list index out of range

# AttributeError — object không có attribute/method đó
"hello".nonexistent()  # AttributeError: 'str' object has no attribute 'nonexistent'
None.upper()           # AttributeError: 'NoneType' object has no attribute 'upper'

# FileNotFoundError — file không tồn tại
open("missing.txt")    # FileNotFoundError: [Errno 2] No such file or directory

# ZeroDivisionError — chia cho 0
10 / 0                 # ZeroDivisionError: division by zero

# ImportError — không import được module
import nonexistent     # ModuleNotFoundError: No module named 'nonexistent'

# OverflowError, MemoryError, RecursionError — lỗi hệ thống
```

### Bắt nhiều exception

```python
def safe_divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("Không thể chia cho 0")
        return None
    except TypeError as e:
        print(f"Sai kiểu dữ liệu: {e}")
        return None

# Bắt nhiều exception trong một except
def parse_value(text: str) -> float | None:
    try:
        return float(text.strip())
    except (ValueError, AttributeError) as e:
        print(f"Không thể parse: {e}")
        return None

# Xem loại exception
try:
    result = int("abc")
except Exception as e:
    print(type(e).__name__)   # Output: ValueError
    print(str(e))             # Output: invalid literal for int() with base 10: 'abc'
    print(repr(e))            # Output: ValueError("invalid literal for int()...")
```

## `raise` — tự raise exception

```python
def set_score(score: float) -> None:
    """Validate và set điểm."""
    if not isinstance(score, (int, float)):
        raise TypeError(f"Điểm phải là số, nhận được: {type(score).__name__}")
    if score < 0 or score > 10:
        raise ValueError(f"Điểm phải từ 0 đến 10, nhận được: {score}")
    print(f"Điểm đã được set: {score}")

# Re-raise exception sau khi log
def process_file(filepath: str) -> str:
    try:
        with open(filepath, "r") as f:
            return f.read()
    except FileNotFoundError as e:
        print(f"Log: File không tồn tại — {filepath}")
        raise  # Re-raise exception gốc

try:
    set_score(15)
except ValueError as e:
    print(f"Lỗi validation: {e}")
# Output: Lỗi validation: Điểm phải từ 0 đến 10, nhận được: 15
```

## Custom Exceptions

```python
# Base custom exception cho ứng dụng
class AppError(Exception):
    """Base exception cho toàn bộ ứng dụng."""
    pass


class ValidationError(AppError):
    """Lỗi validation dữ liệu."""

    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"Validation error on '{field}': {message}")


class StudentNotFoundError(AppError):
    """Học sinh không tồn tại."""

    def __init__(self, student_id: str):
        self.student_id = student_id
        super().__init__(f"Student not found: {student_id}")


class InsufficientScoreError(AppError):
    """Điểm không đủ để thực hiện thao tác."""

    def __init__(self, required: float, actual: float):
        self.required = required
        self.actual = actual
        super().__init__(
            f"Cần điểm {required}, hiện tại chỉ có {actual}"
        )


# Sử dụng custom exceptions
class StudentService:
    def __init__(self):
        self._students = {}

    def register(self, student_id: str, name: str, score: float) -> None:
        if not student_id.startswith("SV"):
            raise ValidationError("student_id", "Phải bắt đầu bằng 'SV'")
        if not name.strip():
            raise ValidationError("name", "Tên không được rỗng")
        if not (0 <= score <= 10):
            raise ValidationError("score", f"Điểm phải từ 0-10, nhận: {score}")

        self._students[student_id] = {"name": name, "score": score}

    def get_student(self, student_id: str) -> dict:
        if student_id not in self._students:
            raise StudentNotFoundError(student_id)
        return self._students[student_id]

    def apply_scholarship(self, student_id: str, min_score: float = 8.0) -> str:
        student = self.get_student(student_id)
        if student["score"] < min_score:
            raise InsufficientScoreError(min_score, student["score"])
        return f"{student['name']} được nhận học bổng!"


service = StudentService()
service.register("SV001", "Nguyễn Văn An", 8.5)

try:
    result = service.apply_scholarship("SV001")
    print(result)
except StudentNotFoundError as e:
    print(f"Không tìm thấy: {e.student_id}")
except InsufficientScoreError as e:
    print(f"Điểm không đủ: cần {e.required}, có {e.actual}")
except AppError as e:
    print(f"App error: {e}")

# Output: Nguyễn Văn An được nhận học bổng!
```

## Context Managers

Context manager quản lý resources — đảm bảo cleanup tự động khi ra khỏi `with` block.

```python
# Built-in context managers
with open("file.txt") as f:         # File
    content = f.read()

with sqlite3.connect("db.sqlite3") as conn:  # Database
    ...

# Dùng contextlib để tạo context manager đơn giản
from contextlib import contextmanager

@contextmanager
def timer(label: str):
    """Context manager đo thời gian."""
    import time
    start = time.time()
    try:
        yield  # Code trong with block chạy ở đây
    finally:
        elapsed = time.time() - start
        print(f"{label}: {elapsed:.3f}s")

with timer("Tính điểm"):
    scores = [i ** 2 for i in range(10000)]
    total = sum(scores)
# Output: Tính điểm: 0.002s
```

### Tạo context manager bằng class

```python
class DatabaseConnection:
    """Context manager cho database connection."""

    def __init__(self, connection_string: str):
        self.connection_string = connection_string
        self.connection = None

    def __enter__(self):
        """Chạy khi vào with block — trả về resource."""
        print(f"Kết nối đến: {self.connection_string}")
        self.connection = {"status": "connected", "url": self.connection_string}
        return self.connection

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Chạy khi thoát with block — cleanup.

        exc_type, exc_val, exc_tb: thông tin exception (None nếu không có lỗi)
        Trả về True để suppress exception, False/None để propagate.
        """
        print("Đóng kết nối database")
        self.connection = None

        if exc_type is not None:
            print(f"Có lỗi xảy ra: {exc_type.__name__}: {exc_val}")
            return False  # Không suppress exception

        return True


with DatabaseConnection("postgresql://localhost/mydb") as conn:
    print(f"Đang dùng: {conn}")
    # ... thực hiện query

# Output:
# Kết nối đến: postgresql://localhost/mydb
# Đang dùng: {'status': 'connected', 'url': 'postgresql://localhost/mydb'}
# Đóng kết nối database
```

## Pitfall: Bare `except`

```python
# SAI — bắt tất cả exception kể cả SystemExit, KeyboardInterrupt
try:
    result = dangerous_operation()
except:
    print("Có lỗi")  # Không biết lỗi gì, che giấu bug

# SAI — bắt Exception base class nhưng vẫn quá rộng
try:
    result = dangerous_operation()
except Exception:
    pass  # Bỏ qua hoàn toàn — tệ nhất có thể làm

# ĐÚNG — chỉ định exception cụ thể
try:
    score = int(input("Nhập điểm: "))
except ValueError:
    print("Vui lòng nhập số nguyên")

# ĐÚNG — bắt nhiều exception cụ thể
try:
    data = fetch_data(url)
except (ConnectionError, TimeoutError) as e:
    print(f"Network error: {e}")
    data = load_cached_data()
except ValueError as e:
    print(f"Data format error: {e}")
    data = None

# Nếu cần bắt Exception rộng — ít nhất phải log đầy đủ
try:
    result = complex_operation()
except Exception as e:
    import logging
    logging.exception(f"Unexpected error in complex_operation: {e}")
    raise  # Re-raise sau khi log
```

## Bài tập

**Bài 1.** Viết hàm `safe_json_load(filepath: str, default=None)` đọc file JSON an toàn. Xử lý: FileNotFoundError, json.JSONDecodeError, PermissionError. Log lỗi ra stderr và trả về default value.

**Bài 2.** Tạo custom exception hierarchy cho hệ thống ngân hàng: `BankError` → `InsufficientFundsError`, `AccountNotFoundError`, `DailyLimitExceededError`. Mỗi exception có thuộc tính riêng phù hợp.

**Bài 3.** Viết context manager `atomic_write(filepath: str)` ghi file an toàn: ghi vào file tạm trước, chỉ replace file gốc khi ghi xong, xóa file tạm nếu có lỗi. Dùng `pathlib` và `@contextmanager`.

**Bài 4.** Viết decorator `retry(max_attempts: int = 3, delay: float = 1.0, exceptions: tuple = (Exception,))` để tự động retry function khi gặp exception. Dùng `functools.wraps` để preserve metadata. Test với hàm random fail.
