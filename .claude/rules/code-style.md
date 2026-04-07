# Code Style

## General
- Ngôn ngữ: JavaScript (không dùng TypeScript trừ khi Docusaurus yêu cầu)
- Indentation: 2 spaces
- Semicolons: không bắt buộc (theo Docusaurus default)
- Single quotes cho strings trong JS
- Max line length: 100 characters

## React Components
- Functional components, không dùng class components
- Props destructuring trực tiếp trong tham số hàm
- Export named thay vì default khi có thể

```jsx
// Good
export function FeatureCard({ title, description, icon }) {
  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

// Bad
export default function(props) {
  return <div>{props.title}</div>
}
```

## Naming Conventions
| Loại              | Convention   | Ví dụ                  |
|-------------------|--------------|------------------------|
| Components        | PascalCase   | `FeatureCard.jsx`      |
| CSS Modules       | camelCase    | `styles.featureCard`   |
| Variables/funcs   | camelCase    | `blogPostTitle`        |
| Constants         | UPPER_SNAKE  | `MAX_ITEMS`            |
| Markdown/MDX files | kebab-case  | `getting-started.md`  |

## CSS Modules
- Dùng CSS Modules cho component-specific styles
- File đặt cùng thư mục component: `ComponentName.module.css`
- Không dùng inline styles trừ khi cần override động

## Imports
- External packages trước, internal modules sau
- Không import không dùng

## Comments
- Comment bằng tiếng Việt hoặc tiếng Anh đều được
- Chỉ comment cho logic không hiển nhiên
- Không để code đã comment trong file committed
