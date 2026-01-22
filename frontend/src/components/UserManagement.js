import React, {useState, useEffect} from 'react';
import UserModal from './UserModal';

export default function UserManagement({user}){
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers(){
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/auth/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      setUsers(data);
    } catch(e){
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(u){
    setSelectedUser(u);
    setShowModal(true);
  }

  function handleUpdate(updated){
    setUsers(users.map(u => u.user_id === selectedUser.user_id ? {...u, ...updated} : u));
    setShowModal(false);
    setSelectedUser(null);
  }

  function handleDelete(id){
    setUsers(users.filter(u => u.user_id !== id));
  }

  function handleCreate(){
    setSelectedUser(null);
    setShowModal(true);
  }

  function handleCreateSuccess(newUser){
    setUsers([...users, newUser]);
    setShowModal(false);
  }

  if(loading) return <div>Loading...</div>;
  if(error) return <div className="error">{error}</div>;

  return (
    <div className="user-management">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <div className="stats">
          <div className="stat-card">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
          <div className="stat-card">
            <h3>{users.filter(u => u.Role?.role_name === 'Manager').length}</h3>
            <p>Managers</p>
          </div>
          <div className="stat-card">
            <h3>{users.filter(u => u.Role?.role_name === 'Employee').length}</h3>
            <p>Employees</p>
          </div>
        </div>
      </div>

      <div className="dashboard-controls">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleCreate}>Add New User</button>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.filter(u =>
            u.username.toLowerCase().includes(query.toLowerCase()) ||
            u.full_name.toLowerCase().includes(query.toLowerCase())
          ).map(u => (
            <tr key={u.user_id}>
              <td>{u.username}</td>
              <td>{u.full_name}</td>
              <td>{u.Role?.role_name}</td>
              <td>
                <button className="btn btn-ghost" onClick={()=>handleEdit(u)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <UserModal
          user={selectedUser || {}}
          onClose={()=>setShowModal(false)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onCreate={handleCreateSuccess}
          canManageUsers={true}
        />
      )}
    </div>
  )
}