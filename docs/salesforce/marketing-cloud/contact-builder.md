---
title: Contact Builder
description: Quản lý data model trong Marketing Cloud — Data Extensions, Attribute Groups, cardinality và Contact Key.
sidebar_position: 6
---

# Contact Builder

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Contact Builder là gì?
- Trung tâm quản lý data model của SFMC
- Kết nối All Subscribers với các Data Extensions tùy chỉnh
- Cơ sở cho Journey Builder Entry Sources và Segmentation

### Contact Key vs Subscriber Key
- Contact Key: định danh duy nhất mỗi contact trong SFMC
- Subscriber Key: tương tự Contact Key, dùng trong context email
- Best practice: dùng CRM Contact ID làm Contact Key để dễ liên kết

### Data Extensions (DE)
- **Standard DE** — bảng dữ liệu tùy chỉnh
- **Sendable DE** — DE có thể dùng để gửi email/SMS (phải có Contact Key hoặc Email Address)
- **Synchronized DE** — đồng bộ từ Salesforce CRM (Contact, Lead, Campaign Member...)
- DE field types: Text, Number, Date, Boolean, EmailAddress, Phone, Locale

### Attribute Groups & Data Designer
- Kết nối các DE với nhau và với Contact model
- Cardinality: One-to-One, One-to-Many (Population, Dimension)
- Population — entry point của Contact model (thường là master DE)

### Synchronized Data Sources
- Cấu hình Marketing Cloud Connect với Salesforce CRM
- Các objects có thể sync: Contact, Lead, User, Campaign, Campaign Member
- Refresh schedule và field mapping

### Profile & Preference Center
- Standard Profile Attributes
- Preference center tùy chỉnh
- Quản lý subscription preferences theo publication list

### Best Practices
- Đặt tên DE với convention: `[BU]_[Purpose]_[Type]` (vd: `VN_Newsletter_Subscribers`)
- Retention policy — xóa data cũ để giảm contact count và chi phí
- Index DE columns dùng trong JOIN thường xuyên
