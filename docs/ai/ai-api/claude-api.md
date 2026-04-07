---
title: Claude API
description: Tích hợp Claude API vào ứng dụng — Messages API, tool use, streaming và các best practices.
sidebar_position: 2
---

# Claude API

> Nội dung đang được chuẩn bị. Quay lại sớm nhé!

## Sắp có trong bài này

### Setup
```bash
npm install @anthropic-ai/sdk
# hoặc Python:
pip install anthropic
```

### Messages API — Core concept
- **System prompt** — định nghĩa vai trò và behavior của AI
- **Messages** — lịch sử hội thoại (user/assistant turns)
- **Model** — chọn model: claude-opus-4-5, claude-sonnet-4-6, claude-haiku-4-5
- **Max tokens** — giới hạn độ dài response

### Gọi API cơ bản
```javascript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const message = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Tóm tắt văn bản này: ...' }],
});
```

### Streaming
- Tại sao cần streaming? User trải nghiệm tốt hơn khi thấy text hiện dần
- `stream: true` trong request
- Xử lý `text_delta` events

### Tool Use (Function Calling)
- Cho phép Claude gọi functions của bạn khi cần thêm thông tin
- Định nghĩa tools với JSON Schema
- Xử lý tool_use blocks trong response
- Ví dụ: Claude gọi API để lấy dữ liệu thời tiết khi người dùng hỏi

### Multi-turn Conversations
- Quản lý conversation history
- Giữ context qua nhiều lượt hỏi đáp
- Trim history khi quá dài (context window limit)

### Vision — Xử lý hình ảnh
- Gửi image trong messages
- Base64 encoding hoặc URL
- Use cases: OCR, image analysis, UI description

### Pricing và tối ưu chi phí
- Input tokens vs Output tokens
- Model nhỏ hơn (Haiku) cho tasks đơn giản
- Caching với prompt caching feature
- Batch API cho xử lý khối lượng lớn
