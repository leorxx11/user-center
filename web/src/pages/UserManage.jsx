import { useState } from 'react';

export default function UserManage() {
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/user/search?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
      setSearched(true);
    } catch {
      setUsers([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除该用户吗？此操作不可撤销。')) return;

    try {
      const res = await fetch('/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(id),
      });
      const ok = await res.json();
      if (ok) {
        setUsers(users.filter((u) => u.id !== id));
      }
    } catch {
      alert('删除失败');
    }
  };

  return (
    <div className="card" style={{ maxWidth: 860 }}>
      <h2>用户管理</h2>
      <p className="card-subtitle">搜索、查看和管理系统用户</p>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="输入用户名搜索，留空查询全部"
        />
        <button type="submit" className="btn-primary">
          搜索
        </button>
      </form>

      {searched && (
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>用户名</th>
              <th>账号</th>
              <th>角色</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr className="empty-row">
                <td colSpan={6}>暂无匹配的用户数据</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username || '-'}</td>
                  <td>{u.userAccount}</td>
                  <td>
                    <span className={`tag ${u.userRole === 1 ? 'tag-admin' : 'tag-user'}`}>
                      {u.userRole === 1 ? '管理员' : '用户'}
                    </span>
                  </td>
                  <td>
                    <span className={`tag ${u.userStatus === 0 ? 'tag-ok' : 'tag-disabled'}`}>
                      {u.userStatus === 0 ? '正常' : '禁用'}
                    </span>
                  </td>
                  <td>
                    <button className="btn-danger" onClick={() => handleDelete(u.id)}>
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
