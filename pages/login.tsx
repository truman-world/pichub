// pages/login.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '登录失败');
      }
      
      setMessage(data.message);
      
      // 登录成功，根据角色跳转
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard'); // 管理员跳转到后台
      } else {
        router.push('/'); // 普通用户跳转到首页
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={titleStyle}>登录</h1>
        <div style={inputGroupStyle}>
          <label htmlFor="email">邮箱</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        </div>
        <div style={inputGroupStyle}>
          <label htmlFor="password">密码</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        </div>
        
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {message && <p style={{ color: 'green', textAlign: 'center' }}>{message}</p>}
        
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? '登录中...' : '登录'}
        </button>
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          还没有账户？ <Link href="/register" style={{ color: '#1890ff' }}>立即注册</Link>
        </p>
      </form>
    </div>
  );
}

// --- 核心修复：添加缺失的样式定义 ---
const pageStyle: React.CSSProperties = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' };
const formStyle: React.CSSProperties = { padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' };
const titleStyle: React.CSSProperties = { textAlign: 'center', marginBottom: '24px' };
const inputGroupStyle: React.CSSProperties = { marginBottom: '16px' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box', marginTop: '4px' };
const buttonStyle: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '4px', border: 'none', background: '#1890ff', color: 'white', fontSize: '16px', cursor: 'pointer', marginTop: '8px' };
