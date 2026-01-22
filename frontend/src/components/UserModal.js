import React, {useState} from 'react';
import Modal from './Modal';

export default function UserModal({user, onClose, onUpdate, onDelete, canManageUsers, onCreate}){
  const [form, setForm] = useState({
    username: user.username || '',
    full_name: user.full_name || '',
    role_name: user.role_name || 'Employee',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isCreate = !user.user_id;

  function handleChange(e){
    setForm({...form, [e.target.name]: e.target.value});
  }

  async function handleSubmit(e){
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const url = isCreate ? `${apiUrl}/api/auth/register` : `${apiUrl}/api/auth/users/${user.user_id}`;
      const method = isCreate ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': isCreate ? undefined : `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message);
      if(isCreate){
        onCreate(data);
      } else {
        onUpdate(data);
      }
      onClose();
    } catch(e){
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(){
    if(!window.confirm('Are you sure you want to delete this user?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/users/${user.user_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(!res.ok) throw new Error('Failed to delete');
      onDelete(user.user_id);
      onClose();
    } catch(e){
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function getInitials(name) {
    if (!name) return '';
    return name.split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase();
  }

  return (
    <Modal title="User Profile" onClose={onClose}>
      <div className="profile-header">
        <div className="profile-avatar">{getInitials(user.full_name || user.username)}</div>
        <div className="profile-info">
          <h3>{user.full_name || user.username}</h3>
          <p className="profile-role">{user.role_name || user.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h4>Account Information</h4>
          <div className="form-row">
            <label>👤 Username</label>
            <input name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>📝 Full Name</label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required />
          </div>
          {canManageUsers && (
            <div className="form-row">
              <label>🔑 Role</label>
              <select name="role_name" value={form.role_name} onChange={handleChange}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-section">
          <h4>Security</h4>
          <div className="form-row">
            <label>🔒 New Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />
          </div>
        </div>

        {error && <div className="error">❌ {error}</div>}
        <div className="form-actions">
          <button type="submit" disabled={loading}>{loading ? '💾 Saving...' : '💾 Save Changes'}</button>
          {canManageUsers && user.user_id !== JSON.parse(localStorage.getItem('user')).user_id && (
            <button type="button" className="btn-danger" onClick={handleDelete} disabled={loading}>🗑️ Delete User</button>
          )}
        </div>
      </form>
    </Modal>
  )
}