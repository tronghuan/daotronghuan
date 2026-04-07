---
title: "Bước 4: EC2 Instance"
description: Tạo Key Pair, IAM Role và EC2 instance với Nginx qua user data script.
sidebar_position: 5
---

# Bước 4: EC2 Instance

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Key Pair — SSH vào EC2

**Tạo SSH key trên máy local trước:**
```bash
ssh-keygen -t ed25519 -C "terraform-ec2" -f ~/.ssh/terraform-ec2
# Tạo ra: ~/.ssh/terraform-ec2 (private key) và ~/.ssh/terraform-ec2.pub (public key)
```

**Khai báo trong Terraform:**
```hcl
# main.tf
resource "aws_key_pair" "web" {
  key_name   = "${local.name_prefix}-key"
  public_key = file("~/.ssh/terraform-ec2.pub")  # Chỉ upload PUBLIC key
}
```

:::warning Private key không commit lên Git
`~/.ssh/terraform-ec2` là private key — không bao giờ commit lên Git.
Chỉ khai báo `public_key` trong Terraform.
:::

### IAM Role cho EC2 (SSM Access)
```hcl
# IAM Role
resource "aws_iam_role" "ec2_role" {
  name = "${local.name_prefix}-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

# Attach SSM policy — cho phép connect qua AWS Systems Manager (không cần SSH)
resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

# Instance Profile — wrap role để gán cho EC2
resource "aws_iam_instance_profile" "web" {
  name = "${local.name_prefix}-instance-profile"
  role = aws_iam_role.ec2_role.name
}
```

### Data Source — lấy AMI mới nhất
```hcl
data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}
```

### EC2 Instance với User Data
```hcl
resource "aws_instance" "web" {
  ami                    = data.aws_ami.amazon_linux.id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.web.id]
  key_name               = aws_key_pair.web.key_name
  iam_instance_profile   = aws_iam_instance_profile.web.name

  # Script chạy khi instance khởi động lần đầu
  user_data = <<-EOF
    #!/bin/bash
    yum update -y
    yum install -y nginx
    systemctl start nginx
    systemctl enable nginx
    echo "<h1>Hello from Terraform EC2 - ${var.environment}</h1>" > /usr/share/nginx/html/index.html
  EOF

  # Prevent replace khi user_data thay đổi nhỏ
  user_data_replace_on_change = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = 20
    delete_on_termination = true
    encrypted             = true
  }

  tags = { Name = "${local.name_prefix}-web-server" }
}
```

### outputs.tf
```hcl
output "instance_public_ip" {
  description = "Public IP của EC2 instance"
  value       = aws_instance.web.public_ip
}

output "instance_public_dns" {
  description = "Public DNS của EC2 instance"
  value       = aws_instance.web.public_dns
}

output "ssh_command" {
  description = "Lệnh SSH kết nối vào EC2"
  value       = "ssh -i ~/.ssh/terraform-ec2 ec2-user@${aws_instance.web.public_ip}"
}

output "web_url" {
  description = "URL truy cập web server"
  value       = "http://${aws_instance.web.public_ip}"
}
```

### Apply và kiểm tra
```bash
terraform plan
terraform apply

# Sau apply, kiểm tra output
terraform output ssh_command
terraform output web_url

# SSH vào EC2
ssh -i ~/.ssh/terraform-ec2 ec2-user@<IP>

# Kiểm tra Nginx
curl http://<IP>
```

### Commit
```bash
git add main.tf outputs.tf
git commit -m "feat(ec2): thêm EC2 instance với Nginx và IAM role"
```
