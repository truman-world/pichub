// pages/install.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';

export default function InstallPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不匹配');
      return;
    }
    
    if (password.length < 6) {
        setError('密码长度不能少于6位');
        return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '安装失败');
      }

      // 安装成功
      alert('恭喜！系统安装成功。您现在将被重定向到首页。');
      router.push('/');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <form onSubmit={handleSubmit} style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>系统初始化安装</h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '32px' }}>创建您的管理员账户</p>
        
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="username">管理员用户名</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email">管理员邮箱</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="password">密码</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="confirmPassword">确认密码</label>
          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={inputStyle} />
        </div>
        
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '16px' }}>{error}</p>}
        
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? '正在安装...' : '完成安装'}
        </button>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd',
  boxSizing: 'border-box',
  marginTop: '4px'
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: '4px',
  border: 'none',
  background: '#1890ff',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer'
};
