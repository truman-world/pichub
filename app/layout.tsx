// app/layout.tsx (诊断专用版)
import "./globals.css"; // 确保引入了我们的诊断CSS

export const metadata = {
  title: "PicHub - CSS加载诊断",
  description: "正在测试CSS文件是否被正确加载。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div style={{ border: '5px solid lime', padding: '20px', backgroundColor: 'black' }}>
          <h1>CSS 加载诊断页面</h1>
          <p>请观察：如果这个页面的背景是鲜红色，并且文字边框是黄色，那就证明CSS文件已经成功从服务器加载到了您的浏览器。</p>
          <p>如果背景仍然是白色，那就证明服务器未能正确提供CSS文件，问题出在服务器配置或文件权限上。</p>
        </div>
        <hr />
        {children}
      </body>
    </html>
  );
}
