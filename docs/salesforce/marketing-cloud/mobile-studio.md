---
title: Mobile Studio
description: Gửi push notification và SMS/MMS với Salesforce Mobile Studio — MobilePush và MobileConnect.
sidebar_position: 7
---

# Mobile Studio

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Mobile Studio gồm những gì?
- **MobilePush** — push notifications cho iOS và Android
- **MobileConnect** — SMS và MMS marketing
- **GroupConnect** — nhắn tin qua LINE, WeChat (thị trường châu Á)

### MobilePush
- Tích hợp SDK vào iOS/Android app
- Các loại notification: Alert, Badge, Sound, Background
- Rich Push — notification có hình ảnh, action buttons
- **Inbox** — in-app message center
- **In-App Messages** — banner, fullscreen, modal hiển thị khi mở app
- Geofencing và Beacon — trigger push khi user đến địa điểm cụ thể
- Contact Events — cấu hình trong Journey Builder

### MobileConnect (SMS/MMS)
- **Long Code vs Short Code** — khác nhau về throughput và use case
- **Keyword** — người dùng gửi keyword để opt-in/opt-out (ví dụ: "STOP")
- **Outbound SMS** — gửi SMS hàng loạt hoặc triggered
- **MMS** — gửi hình ảnh, GIF, video qua tin nhắn
- AMPscript trong SMS — personalization ngắn gọn
- Compliance: opt-in 2 lần (double opt-in), STOP/HELP handling

### GroupConnect (Thị trường châu Á)
- LINE Official Account integration
- WeChat Official Account integration
- Gửi message cards và templates
- Đặc điểm riêng so với SMS

### Mobile Push Best Practices
- Tần suất gửi: không làm phiền user
- Personalized notifications tăng CTR đáng kể
- Timing tối ưu theo timezone
- Deep linking — mở đúng màn hình trong app

### Tích hợp với Journey Builder
- Thêm Push/SMS activity vào customer journey
- Kết hợp email + SMS cho multichannel campaign
