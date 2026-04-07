---
title: HCL Syntax
description: Ngôn ngữ HCL (HashiCorp Configuration Language) — cú pháp cơ bản, blocks, expressions, functions và built-in types.
sidebar_position: 3
---

# HCL Syntax

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Cấu trúc file .tf
```hcl
# Blocks là đơn vị cơ bản trong HCL
<block_type> "<block_label>" "<block_name>" {
  argument = value
}

# Ví dụ thực tế:
resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

### Kiểu dữ liệu
- **Primitives**: `string`, `number`, `bool`
- **Complex**: `list(type)`, `map(type)`, `set(type)`, `object({...})`, `tuple([...])`
- **Any**: dùng khi type không cố định

### Expressions
- String interpolation: `"Hello, ${var.name}!"`
- Conditional: `condition ? true_val : false_val`
- For expression: `[for s in var.list : upper(s)]`
- Splat: `aws_instance.web[*].id`

### Built-in Functions quan trọng
```hcl
# String
lower("HELLO")          → "hello"
format("%.2f", 3.14159) → "3.14"
join(",", ["a","b","c"]) → "a,b,c"
split(",", "a,b,c")     → ["a","b","c"]

# Collection
length(var.list)         → số phần tử
merge(map1, map2)        → gộp maps
flatten([[1,2],[3]])     → [1,2,3]
toset(["a","a","b"])    → {"a","b"}

# Encoding
jsonencode({key = "value"})
base64encode("hello")

# Filesystem
file("./script.sh")      → đọc nội dung file
```

### Meta-arguments
- `depends_on` — tường minh dependency
- `count` — tạo nhiều resource giống nhau
- `for_each` — tạo resource từ map/set
- `lifecycle` — control create/destroy behavior
- `provider` — chỉ định provider cụ thể

### Locals
```hcl
locals {
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "terraform"
  }
}
# Dùng: local.common_tags
```
