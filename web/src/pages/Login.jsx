import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onSuccess }) {
  const [userAccount, setUserAccount] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAccount, userPassword }),
      });
      const data = await res.json();

      if (data) {
        onSuccess(data);
        navigate('/');
      } else {
        setError('账号或密码错误');
      }
    } catch {
      setError('登录失败，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>欢迎回来</h2>
      <p className="card-subtitle">登录你的账号以继续</p>
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <label>账号</label>
          <input
            type="text"
            value={userAccount}
            onChange={(e) => setUserAccount(e.target.value)}
            placeholder="请输入账号"
            required
          />
        </div>
        <div className="form-item">
          <label>密码</label>
          <input
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="请输入密码"
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
      <p className="form-footer">
        还没有账号？<Link to="/register">立即注册</Link>
      </p>
    </div>
  );
}
