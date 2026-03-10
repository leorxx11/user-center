import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserManage from './pages/UserManage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/user/current')
      .then((res) => res.json())
      .then((data) => {
        if (data) setCurrentUser(data);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/user/logout', { method: 'POST' });
    setCurrentUser(null);
    navigate('/login');
  };

  const displayName = currentUser?.username || currentUser?.userAccount || '';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="app">
      <header className="header">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1 className="logo">UC 用户中心</h1>
        </Link>
        <nav className="nav">
          {currentUser ? (
            <>
              {currentUser.userRole === 1 && (
                <Link to="/admin">用户管理</Link>
              )}
              <div className="user-badge">
                <div className="avatar">{initial}</div>
                <span>{displayName}</span>
              </div>
              <button className="nav-btn" onClick={handleLogout}>
                退出
              </button>
            </>
          ) : (
            <>
              <Link to="/login">登录</Link>
              <Link to="/register">注册</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              currentUser ? (
                <UserInfo user={currentUser} />
              ) : (
                <div className="center-text">
                  <div className="icon">&#128100;</div>
                  <p>请先登录以查看个人信息</p>
                </div>
              )
            }
          />
          <Route
            path="/login"
            element={<Login onSuccess={setCurrentUser} />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              currentUser?.userRole === 1 ? (
                <UserManage />
              ) : (
                <div className="center-text">
                  <div className="icon">&#128274;</div>
                  <p>无权限访问此页面</p>
                </div>
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function UserInfo({ user }) {
  return (
    <div className="card">
      <h2>个人信息</h2>
      <p className="card-subtitle">查看和管理你的账户信息</p>
      <div className="info-section">
        <div className="info-grid">
          <div className="info-item">
            <label>用户名</label>
            <span>{user.username || '-'}</span>
          </div>
          <div className="info-item">
            <label>账号</label>
            <span>{user.userAccount}</span>
          </div>
          <div className="info-item">
            <label>性别</label>
            <span>{user.gender === 1 ? '男' : user.gender === 2 ? '女' : '-'}</span>
          </div>
          <div className="info-item">
            <label>电话</label>
            <span>{user.phone || '-'}</span>
          </div>
          <div className="info-item">
            <label>邮箱</label>
            <span>{user.email || '-'}</span>
          </div>
          <div className="info-item">
            <label>角色</label>
            <span className={`tag ${user.userRole === 1 ? 'tag-admin' : 'tag-user'}`}>
              {user.userRole === 1 ? '管理员' : '普通用户'}
            </span>
          </div>
          <div className="info-item">
            <label>创建时间</label>
            <span>{user.createTime ? new Date(user.createTime).toLocaleString() : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
