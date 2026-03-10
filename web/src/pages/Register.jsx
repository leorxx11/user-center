import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [userAccount, setUserAccount] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (userPassword !== checkPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAccount, userPassword, checkPassword }),
      });
      const data = await res.json();

      if (data && data > 0) {
        navigate('/login');
      } else {
        setError('注册失败，账号可能已存在或不符合要求');
      }
    } catch {
      setError('注册失败，请检查网络');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card form-card">
      <h2>创建账号</h2>
      <p className="card-subtitle">注册一个新账号开始使用</p>
      <form onSubmit={handleSubmit}>
        <div className="form-item">
          <label>账号</label>
          <input
            type="text"
            value={userAccount}
            onChange={(e) => setUserAccount(e.target.value)}
            placeholder="至少4位，不含特殊字符"
            required
          />
        </div>
        <div className="form-item">
          <label>密码</label>
          <input
            type="password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            placeholder="至少8位"
            required
          />
        </div>
        <div className="form-item">
          <label>确认密码</label>
          <input
            type="password"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
            placeholder="再次输入密码"
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? '注册中...' : '注册'}
        </button>
      </form>
      <p className="form-footer">
        已有账号？<Link to="/login">去登录</Link>
      </p>
    </div>
  );
}
