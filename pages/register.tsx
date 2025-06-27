// pages/register.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || '注册失败');
            }
            alert('注册成功！现在您可以登录了。');
            router.push('/login');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <form onSubmit={handleSubmit} style={formStyle}>
                <h1 style={titleStyle}>注册新账户</h1>
                <div style={inputGroupStyle}>
                    <label htmlFor="username">用户名</label>
                    <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="email">邮箱</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
                </div>
                <div style={inputGroupStyle}>
                    <label htmlFor="password">密码 (至少6位)</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />
                </div>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <button type="submit" disabled={loading} style={buttonStyle}>
                    {loading ? '注册中...' : '注册'}
                </button>
                 <p style={{ textAlign: 'center', marginTop: '16px' }}>
                    已有账户？ <Link href="/login" style={{ color: '#1890ff' }}>立即登录</Link>
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
