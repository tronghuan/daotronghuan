import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import ParticleField from '@site/src/components/ParticleField';
import styles from './about.module.css';

// =============================================
// DATA - Chỉnh sửa nội dung tại đây
// =============================================

const SKILLS = [
  {
    category: 'Salesforce',
    link: '/docs/salesforce',
    items: [
      { name: 'Apex',        link: '/docs/salesforce/apex' },
      { name: 'LWC',         link: '/docs/salesforce/lwc' },
      { name: 'Flow',        link: '/docs/salesforce/flow' },
      { name: 'SOQL',        link: '/docs/salesforce/soql' },
      { name: 'Integration', link: '/docs/salesforce/integration' },
    ],
  },
  {
    category: 'Backend',
    link: '/docs/backend',
    items: [
      { name: 'Node.js',  link: '/docs/backend/nodejs' },
      { name: 'Python',   link: '/docs/backend/python' },
      { name: 'REST API', link: '/docs/backend/rest-api' },
      { name: 'GraphQL',  link: '/docs/backend/graphql' },
    ],
  },
  {
    category: 'Frontend',
    link: '/docs/frontend',
    items: [
      { name: 'React',      link: '/docs/frontend/react' },
      { name: 'JavaScript', link: '/docs/frontend/javascript' },
      { name: 'TypeScript', link: '/docs/frontend/typescript' },
      { name: 'HTML/CSS',   link: '/docs/frontend/html-css' },
    ],
  },
  {
    category: 'DevOps & Tools',
    link: '/docs/devops',
    items: [
      { name: 'Git',       link: '/docs/devops/git' },
      { name: 'Docker',    link: '/docs/devops/docker' },
      { name: 'CI/CD',     link: '/docs/devops/cicd' },
      { name: 'AWS',       link: '/docs/devops/aws' },
      { name: 'Terraform', link: '/docs/devops/terraform' },
    ],
  },
  {
    category: 'AI & Productivity',
    link: '/docs/ai',
    items: [
      { name: 'Claude',              link: '/docs/ai/ai-chat/claude-ai' },
      { name: 'Cursor',              link: '/docs/ai/ai-code-editor/cursor' },
      { name: 'Prompt Engineering',  link: '/docs/ai/prompt-engineering' },
    ],
  },
  {
    category: 'Quản lý dự án',
    link: '/docs/project-management',
    items: [
      { name: 'Lập kế hoạch dự án',  link: '/docs/project-management/planning' },
      { name: 'Quản lý yêu cầu',     link: '/docs/project-management/requirements' },
      { name: 'Quản lý tiến độ',     link: '/docs/project-management/progress' },
      { name: 'Quản lý rủi ro',      link: '/docs/project-management/risk' },
      { name: 'Tài liệu & báo cáo',  link: '/docs/project-management/documentation' },
    ],
  },
  {
    category: 'Ngôn ngữ',
    link: null,
    items: [
      { name: 'Tiếng Việt (bản ngữ)', link: null },
      { name: 'Tiếng Anh (B2)',        link: null },
      { name: 'Tiếng Nhật (N3)',       link: '/blog/tags/tieng-nhat' },
    ],
  },
];

const CERT_IMAGES = [
  '/img/certs/2025-03_Badge_SF-Certified_Platform-Admin_High-Res.png',        // 0  - Administrator
  '/img/certs/2025-03_Badge_SF-Certified_Platform-Foundations_High-Res.png',  // 1  - Associate
  '/img/certs/2025-03_Badge_SF-Certified_MS-Dev_High-Res.png',                // 2  - MuleSoft Developer I
  '/img/certs/2025-04_Badge_SF-Certified_Plat-Dev_High-Res.png',              // 3  - Platform Developer I
  '/img/certs/2025-03_Badge_SF-Certified_MS-Plat-Int-Arch_High-Res.png',      // 4  - MuleSoft Integration Architect I
  '/img/certs/2021-03_Badge_SF-Certified_Platform-App-Builder_High-Res.png',  // 5  - Platform App Builder
  '/img/certs/2026-01_Badge_SF-Certified_AI-Associate_High-Res.png',          // 6  - AI Associate
  '/img/certs/2026-01_Badge_SF-Certified_D360-Con_High-Res.png',              // 7  - Data Cloud Consultant
  '/img/certs/2025-03_Badge_SF-Certified_Plat-Integration-Arch_High-Res.png', // 8  - Integration Architect
  '/img/certs/2024-02_SF-Cert-Badge_MuleSoft-Developer-II.png',               // 9  - MuleSoft Developer II
  '/img/certs/2025-02_Badge_SF-Certified_Agentforce-Specialist_High-Res.png', // 10 - Agentforce Specialist
  '/img/certs/2025-03_Badge_SF-Certified_Plat-Data-Arch_High-Res.png',        // 11 - Data Architect
  '/img/certs/2025-03_MASTER_Certification-Badges_JavaScript-Dev.png',        // 12 - JavaScript Developer I
];

const CERTIFICATIONS = [
  { name: 'Salesforce Certified Administrator',                    year: '2022/10', category: 'Admin',     img: CERT_IMAGES[0]  },
  { name: 'Salesforce Certified Associate',                        year: '2022/10', category: 'Admin',     img: CERT_IMAGES[1]  },
  { name: 'Salesforce Certified MuleSoft Developer I',             year: '2022/10', category: 'MuleSoft',  img: CERT_IMAGES[2]  },
  { name: 'Salesforce Certified Platform Developer I',             year: '2022/11', category: 'Developer', img: CERT_IMAGES[3]  },
  { name: 'Salesforce Certified MuleSoft Integration Architect I', year: '2022/11', category: 'MuleSoft',  img: CERT_IMAGES[4]  },
  { name: 'Salesforce Platform App Builder',                       year: '2023/02', category: 'Developer', img: CERT_IMAGES[5]  },
  { name: 'Salesforce Certified AI Associate',                     year: '2024/03', category: 'AI',        img: CERT_IMAGES[6]  },
  { name: 'Salesforce Certified Data Cloud Consultant',            year: '2024/06', category: 'Data',      img: CERT_IMAGES[7]  },
  { name: 'Salesforce Certified Integration Architect',            year: '2024/06', category: 'Architect', img: CERT_IMAGES[8]  },
  { name: 'Salesforce Certified MuleSoft Developer II',            year: '2024/07', category: 'MuleSoft',  img: CERT_IMAGES[9]  },
  { name: 'Salesforce Certified Agentforce Specialist',            year: '2024/09', category: 'AI',        img: CERT_IMAGES[10] },
  { name: 'Salesforce Certified Data Architect',                   year: '2024/10', category: 'Architect', img: CERT_IMAGES[11] },
  { name: 'Salesforce Certified JavaScript Developer I',           year: '2025/03', category: 'Developer', img: CERT_IMAGES[12] },
];

const CERT_CATEGORY_COLORS = {
  'Admin':     { bg: 'rgba(0, 160, 230, 0.1)',  border: 'rgba(0, 160, 230, 0.35)',  text: '#00a0e6' },
  'Developer': { bg: 'rgba(37, 194, 160, 0.1)', border: 'rgba(37, 194, 160, 0.35)', text: '#25c2a0' },
  'MuleSoft':  { bg: 'rgba(255, 140, 0, 0.1)',  border: 'rgba(255, 140, 0, 0.35)',  text: '#ff8c00' },
  'AI':        { bg: 'rgba(200, 100, 255, 0.1)', border: 'rgba(200, 100, 255, 0.35)', text: '#c864ff' },
  'Data':      { bg: 'rgba(255, 200, 0, 0.1)',  border: 'rgba(255, 200, 0, 0.35)',  text: '#ffc800' },
  'Architect': { bg: 'rgba(255, 80, 80, 0.1)',  border: 'rgba(255, 80, 80, 0.35)',  text: '#ff5050' },
};

const PROJECTS = [
  {
    emoji: '📚',
    name: 'KhoTruyen.AI',
    url: 'https://khotruyen.ai',
    description:
      'Nền tảng đọc truyện tích hợp AI — tự động dịch, tóm tắt và gợi ý truyện cá nhân hóa. Xây dựng từ đầu bằng Node.js + React.',
    tags: ['Node.js', 'React', 'AI', 'Claude API'],
    status: 'Live',
  },
  {
    emoji: '🌟',
    name: 'SSStruyen.AI',
    url: '#',
    description:
      'Dự án mở rộng hệ sinh thái truyện — tập trung vào trải nghiệm đọc nhanh và tối ưu SEO cho nội dung do AI tạo ra.',
    tags: ['SEO', 'Next.js', 'AI Content'],
    status: 'In Progress',
  },
  {
    emoji: '☁️',
    name: 'Salesforce Integration Hub',
    url: '#',
    description:
      'Hệ thống tích hợp Salesforce với các hệ thống ERP nội bộ, xử lý hơn 10.000 bản ghi/ngày qua middleware tự xây dựng.',
    tags: ['Salesforce', 'Apex', 'REST API', 'MuleSoft'],
    status: 'Production',
  },
  {
    emoji: '🤖',
    name: 'AI Coding Assistant Workflow',
    url: '#',
    description:
      'Bộ workflow & prompt template cá nhân hóa cho Claude + Cursor, giúp tăng tốc độ phát triển tính năng lên 3x so với coding thủ công.',
    tags: ['Claude', 'Cursor', 'Prompt Engineering'],
    status: 'Open Source',
  },
];

const EXPERIENCE = [
  {
    period: '2022 — Hiện tại',
    role: 'Senior Salesforce Developer',
    company: 'Công ty ABC',
    description:
      'Dẫn dắt team 4 người xây dựng và tích hợp các giải pháp Salesforce cho khách hàng doanh nghiệp. Chịu trách nhiệm kiến trúc hệ thống và code review.',
  },
  {
    period: '2020 — 2022',
    role: 'Salesforce Developer',
    company: 'Công ty XYZ',
    description:
      'Phát triển các ứng dụng LWC và tích hợp API bên thứ ba. Triển khai Salesforce cho 3 khách hàng lớn trong lĩnh vực bán lẻ.',
  },
  {
    period: '2018 — 2020',
    role: 'Backend Developer',
    company: 'Startup DEF',
    description:
      'Xây dựng REST API và hệ thống backend cho ứng dụng web. Tham gia xây dựng sản phẩm từ giai đoạn MVP đến scale lên 50.000 người dùng.',
  },
];

// =============================================
// COMPONENTS
// =============================================

function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroAvatar}>
        {/* Thay bằng <img src="/img/avatar.jpg" alt="Huấn" /> nếu có ảnh */}
        <span className={styles.heroAvatarPlaceholder}>ĐTH</span>
      </div>
      <h1 className={styles.heroName}>Đào Trọng Huấn</h1>
      <p className={styles.heroTitle}>IT Engineer · Salesforce Expert · Builder</p>
      <p className={styles.heroBio}>
        Tôi xây dựng phần mềm, tích hợp hệ thống và đang trên hành trình ứng dụng AI
        để tạo ra những sản phẩm thực sự có ích. Đam mê học Tiếng Nhật và chia sẻ kiến thức.
      </p>
      <div className={styles.heroCtas}>
        <a href="mailto:your@email.com" className={styles.ctaPrimary}>
          Liên hệ tôi
        </a>
        <a href="https://github.com/tronghuan" target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary}>
          GitHub
        </a>
        <Link to="/docs/intro" className={styles.ctaSecondary}>
          Series Tech
        </Link>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionTitleAccent}>#</span> Kỹ năng
      </h2>
      <div className={styles.skillsGrid}>
        {SKILLS.map((group) => {
          const CardTag = group.link ? Link : 'div';
          const cardProps = group.link ? { to: group.link } : {};
          return (
            <CardTag key={group.category} className={styles.skillCard} {...cardProps}>
              <h4 className={styles.skillCategory}>
                {group.category}
                {group.link && <span className={styles.skillCardArrow}>→</span>}
              </h4>
              <div className={styles.skillTags}>
                {group.items.map((item) =>
                  item.link ? (
                    <Link
                      key={item.name}
                      to={item.link}
                      className={`${styles.skillTag} ${styles.skillTagLink}`}
                      title={`Xem series ${item.name} →`}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span key={item.name} className={styles.skillTag}>
                      {item.name}
                    </span>
                  )
                )}
              </div>
            </CardTag>
          );
        })}
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  const colorMap = {
    'Live': styles.statusLive,
    'In Progress': styles.statusInProgress,
    'Production': styles.statusProduction,
    'Open Source': styles.statusOpenSource,
  };
  return (
    <span className={`${styles.statusBadge} ${colorMap[status] || ''}`}>
      {status}
    </span>
  );
}

const TOTAL = CERTIFICATIONS.length;         // 13
const ANGLE_STEP = 360 / TOTAL;              // 30deg mỗi card
const RADIUS = 360;                          // px — bán kính hình trụ

function CertificationsSection() {
  return (
    <section className={styles.gallerySection}>
      <h2 className={styles.sectionTitle} style={{ paddingLeft: '24px' }}>
        <span className={styles.sectionTitleAccent}>#</span> Chứng chỉ Salesforce
        <span className={styles.certCount}>{TOTAL}</span>
      </h2>
      <p className={styles.gallerySubtitle}>Hover để dừng · Xoay 360°</p>

      {/* Wrapper overflow-hidden để tránh scrollbar ngang */}
      <div className={styles.carouselWrapper}>
        {/* Điểm nhìn perspective */}
        <div className={styles.carouselScene}>
          {/* Hình trụ xoay */}
          <div className={styles.carouselTrack}>
            {CERTIFICATIONS.map((cert, i) => {
              const color = CERT_CATEGORY_COLORS[cert.category] || CERT_CATEGORY_COLORS['Developer'];
              const angle = ANGLE_STEP * i;
              const shortName = cert.name
                .replace('Salesforce Certified ', '')
                .replace('Salesforce ', '');
              return (
                <div
                  key={cert.name}
                  className={styles.certFace}
                  style={{ transform: `rotateY(${angle}deg) translateZ(${RADIUS}px)` }}
                >
                  {/* Viền màu theo category */}
                  <div
                    className={styles.certFaceInner}
                    style={{ borderColor: color.border }}
                  >
                    {/* Ảnh chứng chỉ */}
                    <div className={styles.certFaceImageWrap} style={{ background: color.bg }}>
                      <img
                        src={cert.img}
                        alt={cert.name}
                        className={styles.certFaceImage}
                      />
                    </div>
                    {/* Body text */}
                    <div className={styles.certFaceBody}>
                      <span className={styles.certFaceCategory} style={{ color: color.text }}>
                        {cert.category}
                      </span>
                      <p className={styles.certFaceName}>{shortName}</p>
                      <span className={styles.certFaceYear}>{cert.year}</span>
                    </div>
                    {/* Glow line dưới cùng */}
                    <div className={styles.certFaceGlow} style={{ background: color.text }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bóng đổ xuống sàn */}
        <div className={styles.carouselFloorShadow} />
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionTitleAccent}>#</span> Dự án nổi bật
      </h2>
      <div className={styles.projectsGrid}>
        {PROJECTS.map((project) => (
          <a
            key={project.name}
            href={project.url}
            target={project.url !== '#' ? '_blank' : undefined}
            rel="noopener noreferrer"
            className={styles.projectCard}
          >
            <div className={styles.projectHeader}>
              <span className={styles.projectEmoji}>{project.emoji}</span>
              <StatusBadge status={project.status} />
            </div>
            <h3 className={styles.projectName}>{project.name}</h3>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.projectTags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.projectTag}>{tag}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionTitleAccent}>#</span> Kinh nghiệm
      </h2>
      <div className={styles.timeline}>
        {EXPERIENCE.map((exp, idx) => (
          <div key={idx} className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
              <span className={styles.timelinePeriod}>{exp.period}</span>
              <h3 className={styles.timelineRole}>{exp.role}</h3>
              <span className={styles.timelineCompany}>{exp.company}</span>
              <p className={styles.timelineDesc}>{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className={`${styles.section} ${styles.contactSection}`}>
      <h2 className={styles.sectionTitle}>
        <span className={styles.sectionTitleAccent}>#</span> Liên hệ
      </h2>
      <p className={styles.contactSubtitle}>
        Muốn hợp tác, trao đổi về tech, hoặc chỉ đơn giản là muốn kết bạn? Hãy nhắn tôi.
      </p>
      <div className={styles.contactLinks}>
        <a href="mailto:your@email.com" className={styles.contactLink}>
          <span>✉️</span> Email
        </a>
        <a href="https://github.com/tronghuan" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
          <span>🐙</span> GitHub
        </a>
        <a href="https://x.com/your-username" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
          <span>🐦</span> X (Twitter)
        </a>
        <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
          <span>💼</span> LinkedIn
        </a>
      </div>
    </section>
  );
}

// =============================================
// PAGE
// =============================================

export default function AboutPage() {
  return (
    <Layout
      title="Portfolio — Đào Trọng Huấn"
      description="Portfolio của Đào Trọng Huấn — IT Engineer, Salesforce Expert, Builder"
    >
      <main className={styles.main}>
        <ParticleField />
        <div className={styles.container}>
          <HeroSection />
          <SkillsSection />
          <CertificationsSection />
          <ProjectsSection />
          <ExperienceSection />
          <ContactSection />
        </div>
      </main>
    </Layout>
  );
}
