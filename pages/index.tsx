// pages/index.tsx
import Uploader from '@/components/Uploader'; // 假设您有路径别名配置

export default function HomePage() {
  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>欢迎使用 PicHub</h1>
        <p>一个简单而强大的图床应用</p>
      </header>
      
      <Uploader />

      <footer style={{ textAlign: 'center', marginTop: '40px', color: '#888' }}>
        <p>由 Gemini 构建</p>
      </footer>
    </main>
  );
}
