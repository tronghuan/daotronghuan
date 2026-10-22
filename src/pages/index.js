import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ParticleField from '@site/src/components/ParticleField';

// --- KHU VỰC VẪY CHÀO ---
function HomepageHeader() {
  return (
    <header style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>

      {/* Lớp nền Particle */}
      <ParticleField />

      {/* Khai báo CSS trực tiếp cho hiệu ứng kính mờ và trôi nổi */}
      <style>
        {`
          .glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 24px;
            padding: 2.5rem 1.5rem;
            color: #fff;
            text-align: center;
            transition: all 0.4s ease;
            text-decoration: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
          }
          .glass-card:hover {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            transform: scale(1.05) !important; /* Phóng to nhẹ khi di chuột */
            box-shadow: 0 15px 35px rgba(0,0,0,0.5);
            color: #fff;
            text-decoration: none;
            z-index: 10;
          }
          /* Hiệu ứng trôi nổi lơ lửng vô hạn */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .floating-1 { animation: float 6s ease-in-out infinite; }
          .floating-2 { animation: float 6s ease-in-out infinite 1.5s; }
          .floating-3 { animation: float 6s ease-in-out infinite 3s; }
          .floating-4 { animation: float 6s ease-in-out infinite 4.5s; }
        `}
      </style>

      {/* Lớp nội dung (Nằm đè lên Particle) */}
      <div className="container" style={{ position: 'relative', zIndex: 1, marginTop: '80px' }}>

        {/* Tên và Slogan */}
        <div style={{ textAlign: 'center', marginBottom: '60px', textShadow: '0 0 15px rgba(0,0,0,1)' }}>
          <Heading as="h1" style={{ fontSize: '4.5rem', fontWeight: 900, color: '#fff', letterSpacing: '5px', margin: 0 }}>
            HUẤN
          </Heading>
          <p style={{ fontSize: '1.2rem', color: '#ccc', letterSpacing: '2px', marginTop: '10px' }}>
            IT ENGINEER | SALESFORCE EXPERT
          </p>
        </div>

        {/* 4 Khối trôi nổi */}
        <div className="row" style={{ justifyContent: 'center' }}>

          {/* Khối 1: Portfolio */}
          <div className="col col--3 margin-bottom--lg floating-1">
            <Link to="/about" className="glass-card">
              <h1 style={{ fontSize: '2.5rem', margin: 0 }}>👨‍💻</h1>
              <h3 style={{ fontSize: '1.3rem', marginTop: '12px' }}>Portfolio</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                Kinh nghiệm làm việc, kỹ năng công nghệ và các dự án thực chiến.
              </p>
            </Link>
          </div>

          {/* Khối 2: Tech Series */}
          <div className="col col--3 margin-bottom--lg floating-2">
            <Link to="/docs/intro" className="glass-card">
              <h1 style={{ fontSize: '2.5rem', margin: 0 }}>⚙️</h1>
              <h3 style={{ fontSize: '1.3rem', marginTop: '12px' }}>Công Việc</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                Hướng dẫn kỹ thuật, kinh nghiệm Salesforce, DevOps, AI và Backend.
              </p>
            </Link>
          </div>

          {/* Khối 3: Cuộc sống */}
          <div className="col col--3 margin-bottom--lg floating-3">
            <Link to="/cuoc-song" className="glass-card">
              <h1 style={{ fontSize: '2.5rem', margin: 0 }}>🏡</h1>
              <h3 style={{ fontSize: '1.3rem', marginTop: '12px' }}>Cuộc Sống</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                Gia đình, những mốc đáng nhớ và câu chuyện riêng tư.
              </p>
            </Link>
          </div>

          {/* Khối 4: Tán gẫu */}
          <div className="col col--3 margin-bottom--lg floating-4">
            <Link to="/blog" className="glass-card">
              <h1 style={{ fontSize: '2.5rem', margin: 0 }}>☕</h1>
              <h3 style={{ fontSize: '1.3rem', marginTop: '12px' }}>Tán Gẫu</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                Suy ngẫm, ngẫu hứng và bất kỳ điều gì muốn chia sẻ.
              </p>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}

// --- HÀM RENDER CHÍNH ---
export default function Home() {
  return (
    <Layout
      title={`Trang chủ`}
      description="Không gian chia sẻ kiến thức IT, Salesforce và cuộc sống của Đào Trọng Huấn">
      
      {/* ÉP ẨN NAVBAR CHỈ RIÊNG Ở TRANG CHỦ */}
      <Head>
        <style>{`
          .navbar { display: none !important; }
          :root { --ifm-navbar-height: 0px; } /* Xóa khoảng trống viền đen trên cùng */
        `}</style>
      </Head>

      <HomepageHeader />
    </Layout>
  );
}