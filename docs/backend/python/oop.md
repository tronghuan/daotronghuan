---
title: Lập trình hướng đối tượng (OOP)
description: Class, object, inheritance, encapsulation và các tính năng OOP quan trọng trong Python
sidebar_position: 9
---

Lập trình hướng đối tượng (OOP) giúp tổ chức code thành các đơn vị logic, tái sử dụng được và dễ bảo trì. Python hỗ trợ OOP đầy đủ nhưng cũng linh hoạt — không bắt buộc dùng class cho mọi thứ như Java.

## Class và Object — Analogy

**Class** = Bản thiết kế (blueprint)
**Object** = Ngôi nhà được xây từ bản thiết kế đó

Từ một bản thiết kế, bạn có thể xây nhiều ngôi nhà khác nhau — mỗi nhà cùng cấu trúc nhưng có màu sơn, nội thất riêng. Tương tự, từ một class, bạn tạo ra nhiều object với cùng structure nhưng dữ liệu khác nhau.

```python
# Class định nghĩa structure
class Student:
    pass  # Empty class

# Object là instance của class
student1 = Student()
student2 = Student()

print(type(student1))   # Output: <class '__main__.Student'>
print(student1 is student2)  # Output: False — 2 object khác nhau
```

## `__init__` constructor và `self`

```python
class Student:
    def __init__(self, name: str, student_id: str, age: int):
        """Khởi tạo student object.

        self là tham chiếu đến object đang được tạo.
        Các biến với self. là instance attributes.
        """
        self.name = name
        self.student_id = student_id
        self.age = age
        self.scores = []       # Mỗi student có list điểm riêng
        self.is_active = True  # Giá trị mặc định

# Tạo object
an = Student("Nguyễn Văn An", "SV001", 20)
binh = Student("Trần Thị Bình", "SV002", 21)

print(an.name)         # Output: Nguyễn Văn An
print(binh.student_id) # Output: SV002
print(an.scores)       # Output: []
```

## Instance attributes vs Class attributes

```python
class Student:
    # Class attribute — chia sẻ bởi TẤT CẢ instances
    school_name = "Trường ĐH Bách Khoa"
    total_students = 0  # Đếm tổng số student được tạo

    def __init__(self, name: str, score: float):
        # Instance attributes — riêng của từng object
        self.name = name
        self.score = score
        Student.total_students += 1  # Cập nhật class attribute

an = Student("An", 8.5)
binh = Student("Bình", 9.2)

# Truy cập class attribute
print(Student.school_name)    # Output: Trường ĐH Bách Khoa
print(an.school_name)         # Output: Trường ĐH Bách Khoa — cũng được
print(Student.total_students) # Output: 2

# Instance attribute override class attribute
an.school_name = "ĐH Quốc Gia"  # Tạo instance attribute riêng
print(an.school_name)   # Output: ĐH Quốc Gia — của riêng an
print(binh.school_name) # Output: Trường ĐH Bách Khoa — không bị ảnh hưởng
```

## Methods

### Instance method

```python
class Student:
    def __init__(self, name: str):
        self.name = name
        self.scores = []

    def add_score(self, subject: str, score: float) -> None:
        """Thêm điểm môn học."""
        if not (0 <= score <= 10):
            raise ValueError(f"Điểm phải từ 0 đến 10, nhận được: {score}")
        self.scores.append({"subject": subject, "score": score})

    def get_average(self) -> float:
        """Tính điểm trung bình."""
        if not self.scores:
            return 0.0
        return sum(s["score"] for s in self.scores) / len(self.scores)

    def get_grade(self) -> str:
        """Xếp loại học sinh."""
        avg = self.get_average()
        if avg >= 9.0:
            return "Xuất sắc"
        elif avg >= 8.0:
            return "Giỏi"
        elif avg >= 7.0:
            return "Khá"
        elif avg >= 5.0:
            return "Trung bình"
        else:
            return "Yếu"

# Sử dụng
an = Student("Nguyễn Văn An")
an.add_score("Toán", 8.5)
an.add_score("Lý", 9.0)
an.add_score("Hóa", 7.5)

print(f"{an.name}: TB = {an.get_average():.1f} ({an.get_grade()})")
# Output: Nguyễn Văn An: TB = 8.3 (Giỏi)
```

### Class method và Static method

```python
class Student:
    _registry = {}  # Lưu tất cả student

    def __init__(self, name: str, student_id: str):
        self.name = name
        self.student_id = student_id
        Student._registry[student_id] = self

    @classmethod
    def from_dict(cls, data: dict) -> "Student":
        """Factory method — tạo Student từ dict.

        cls tham chiếu đến class (Student), không phải instance.
        Dùng khi cần truy cập class nhưng không cần instance.
        """
        return cls(data["name"], data["student_id"])

    @classmethod
    def find_by_id(cls, student_id: str) -> "Student | None":
        """Tìm student theo ID."""
        return cls._registry.get(student_id)

    @staticmethod
    def is_valid_id(student_id: str) -> bool:
        """Kiểm tra format student ID hợp lệ.

        Static method không cần self hay cls.
        Dùng khi logic liên quan đến class nhưng không cần truy cập state.
        """
        return student_id.startswith("SV") and len(student_id) == 5

# Sử dụng
an = Student("Nguyễn Văn An", "SV001")
binh = Student.from_dict({"name": "Trần Thị Bình", "student_id": "SV002"})

found = Student.find_by_id("SV001")
print(found.name)  # Output: Nguyễn Văn An

print(Student.is_valid_id("SV001"))   # Output: True
print(Student.is_valid_id("12345"))   # Output: False
```

## `__str__` và `__repr__`

```python
class Student:
    def __init__(self, name: str, score: float):
        self.name = name
        self.score = score

    def __str__(self) -> str:
        """Human-readable string — dùng cho print() và str()."""
        return f"Học sinh: {self.name} (Điểm: {self.score})"

    def __repr__(self) -> str:
        """Unambiguous string — dùng cho debugging, repr()."""
        return f"Student(name={self.name!r}, score={self.score!r})"

    def __len__(self) -> int:
        """Cho phép dùng len(student) — trả về số ký tự tên."""
        return len(self.name)

    def __eq__(self, other: "Student") -> bool:
        """Cho phép so sánh == giữa 2 Student."""
        if not isinstance(other, Student):
            return NotImplemented
        return self.name == other.name

an = Student("Nguyễn Văn An", 8.5)

print(an)           # Output: Học sinh: Nguyễn Văn An (Điểm: 8.5)
print(repr(an))     # Output: Student(name='Nguyễn Văn An', score=8.5)
print(str(an))      # Output: Học sinh: Nguyễn Văn An (Điểm: 8.5)
print(len(an))      # Output: 14

an2 = Student("Nguyễn Văn An", 9.0)
print(an == an2)    # Output: True — cùng tên, bất kể điểm
```

## `@property` getter/setter

```python
class Student:
    def __init__(self, name: str, score: float):
        self.name = name
        self._score = score  # Convention: _ prefix = "private"

    @property
    def score(self) -> float:
        """Getter — truy cập như attribute, không cần ()."""
        return self._score

    @score.setter
    def score(self, value: float) -> None:
        """Setter — validate trước khi gán."""
        if not (0 <= value <= 10):
            raise ValueError(f"Điểm phải từ 0 đến 10, nhận được: {value}")
        self._score = value

    @property
    def grade(self) -> str:
        """Computed property — tính từ score, không lưu riêng."""
        if self._score >= 8.0:
            return "Giỏi"
        elif self._score >= 6.5:
            return "Khá"
        else:
            return "Trung bình"

an = Student("An", 8.5)

# Truy cập như attribute (không cần gọi method)
print(an.score)   # Output: 8.5
print(an.grade)   # Output: Giỏi

# Gán qua setter — có validation
an.score = 9.0    # OK
an.score = 15     # ValueError: Điểm phải từ 0 đến 10, nhận được: 15
```

## Inheritance (Kế thừa)

```python
class Person:
    """Base class — lớp cha."""

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def introduce(self) -> str:
        return f"Tôi là {self.name}, {self.age} tuổi."

    def __str__(self) -> str:
        return f"{self.__class__.__name__}({self.name})"


class Student(Person):
    """Kế thừa Person, thêm thuộc tính và method riêng."""

    def __init__(self, name: str, age: int, student_id: str):
        super().__init__(name, age)  # Gọi __init__ của class cha
        self.student_id = student_id
        self.scores = []

    def introduce(self) -> str:
        """Override method của cha."""
        base = super().introduce()  # Lấy kết quả của cha
        return f"{base} Mã SV: {self.student_id}"

    def study(self, subject: str) -> str:
        return f"{self.name} đang học {subject}"


class Teacher(Person):
    """Cũng kế thừa Person."""

    def __init__(self, name: str, age: int, subject: str):
        super().__init__(name, age)
        self.subject = subject

    def introduce(self) -> str:
        base = super().introduce()
        return f"{base} Giảng dạy: {self.subject}"

    def teach(self, topic: str) -> str:
        return f"Thầy/Cô {self.name} dạy: {topic}"


# Sử dụng
an = Student("Nguyễn Văn An", 20, "SV001")
nam = Teacher("Nguyễn Văn Nam", 35, "Toán")

print(an.introduce())
# Output: Tôi là Nguyễn Văn An, 20 tuổi. Mã SV: SV001

print(nam.introduce())
# Output: Tôi là Nguyễn Văn Nam, 35 tuổi. Giảng dạy: Toán

print(an.study("Python"))
# Output: Nguyễn Văn An đang học Python

# isinstance check
print(isinstance(an, Student))   # Output: True
print(isinstance(an, Person))    # Output: True — Student là Person
print(isinstance(an, Teacher))   # Output: False
```

## Ví dụ thực tế: Classroom management

```python
class Student:
    def __init__(self, name: str, student_id: str):
        self.name = name
        self.student_id = student_id
        self._scores: dict[str, float] = {}

    def add_score(self, subject: str, score: float) -> None:
        if not (0 <= score <= 10):
            raise ValueError(f"Điểm không hợp lệ: {score}")
        self._scores[subject] = score

    @property
    def average(self) -> float:
        if not self._scores:
            return 0.0
        return sum(self._scores.values()) / len(self._scores)

    @property
    def grade(self) -> str:
        avg = self.average
        if avg >= 9.0: return "Xuất sắc"
        if avg >= 8.0: return "Giỏi"
        if avg >= 7.0: return "Khá"
        if avg >= 5.0: return "Trung bình"
        return "Yếu"

    def __str__(self) -> str:
        return f"{self.name} ({self.student_id}): TB={self.average:.1f} [{self.grade}]"

    def __repr__(self) -> str:
        return f"Student(name={self.name!r}, id={self.student_id!r})"


class Classroom:
    def __init__(self, class_name: str):
        self.class_name = class_name
        self._students: list[Student] = []

    def add_student(self, student: Student) -> None:
        self._students.append(student)

    def get_top_students(self, n: int = 3) -> list[Student]:
        return sorted(self._students, key=lambda s: s.average, reverse=True)[:n]

    def get_class_average(self) -> float:
        if not self._students:
            return 0.0
        return sum(s.average for s in self._students) / len(self._students)

    def print_report(self) -> None:
        print(f"\n=== BÁO CÁO LỚP {self.class_name} ===")
        print(f"Sĩ số: {len(self._students)}")
        print(f"Điểm TB lớp: {self.get_class_average():.1f}")
        print("\nTop 3 học sinh:")
        for i, student in enumerate(self.get_top_students(3), 1):
            print(f"  {i}. {student}")


# Sử dụng
classroom = Classroom("10A1")

students_data = [
    ("Nguyễn Văn An", "SV001", {"Toán": 8.5, "Lý": 9.0, "Hóa": 8.0}),
    ("Trần Thị Bình", "SV002", {"Toán": 9.5, "Lý": 9.2, "Hóa": 9.0}),
    ("Lê Văn Cường", "SV003", {"Toán": 7.0, "Lý": 7.5, "Hóa": 6.5}),
    ("Phạm Thị Dung", "SV004", {"Toán": 8.0, "Lý": 8.5, "Hóa": 8.2}),
]

for name, sid, scores in students_data:
    student = Student(name, sid)
    for subject, score in scores.items():
        student.add_score(subject, score)
    classroom.add_student(student)

classroom.print_report()
# Output:
# === BÁO CÁO LỚP 10A1 ===
# Sĩ số: 4
# Điểm TB lớp: 8.3
#
# Top 3 học sinh:
#   1. Trần Thị Bình (SV002): TB=9.2 [Xuất sắc]
#   2. Nguyễn Văn An (SV001): TB=8.5 [Giỏi]
#   3. Phạm Thị Dung (SV004): TB=8.2 [Giỏi]
```

## Bài tập

**Bài 1.** Viết class `BankAccount` với các method: `deposit(amount)`, `withdraw(amount)` (kiểm tra số dư), `get_balance()`, `transaction_history()`. Dùng `@property` cho balance. Log mỗi giao dịch với timestamp.

**Bài 2.** Tạo hierarchy: class `Shape` (base) → `Circle`, `Rectangle`, `Triangle` (kế thừa). Mỗi class có method `area()` và `perimeter()`. Class `Shape` có method `describe()` dùng `__str__`.

**Bài 3.** Viết class `Library` quản lý sách: thêm sách, mượn sách (đánh dấu unavailable), trả sách, tìm kiếm theo tên/tác giả. Mỗi cuốn sách là instance của class `Book`.

**Bài 4.** Viết class `Matrix` hỗ trợ: khởi tạo từ list of lists, cộng 2 ma trận (`__add__`), nhân ma trận với scalar (`__mul__`), in ra đẹp (`__str__`), lấy phần tử `matrix[row][col]` (`__getitem__`).
