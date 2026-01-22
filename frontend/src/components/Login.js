import React, {useState} from 'react';

export default function Login({onLogin}){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function initials(n){
    if(!n) return 'U';
    return n.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
  }

  async function submit(e){
    e.preventDefault();
    setError('');
    if(!username || !password) return setError('Vui lòng nhập username và password');
    setLoading(true);
    async function doPost(url){
      return fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, password })
      });
    }

    try{
      let res = await doPost(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`);
      let ct = (res.headers.get('content-type') || '').toLowerCase();
      // if HTML returned (dev server served index.html), try fallbacks
      if(!ct.includes('application/json')){
        // try common local backend addresses
        const fallbacks = [
          'http://localhost:5000/api/auth/login',
          'http://127.0.0.1:5000/api/auth/login',
          'http://backend:5000/api/auth/login'
        ];
        for(const fb of fallbacks){
          try{
            const r2 = await doPost(fb);
            const ct2 = (r2.headers.get('content-type') || '').toLowerCase();
            if(ct2.includes('application/json')){ res = r2; ct = ct2; break; }
          }catch(e){ /* ignore and continue */ }
        }
      }

      let body;
      if((res.headers.get('content-type')||'').toLowerCase().includes('application/json')){
        body = await res.json();
      } else {
        const text = await res.text();
        throw new Error('Unexpected response from server (not JSON). Response start: ' + (text.slice ? text.slice(0,300) : text));
      }
      if(!res.ok){
        setError(body.message || 'Đăng nhập thất bại');
        setLoading(false);
        return;
      }
      const token = body.token;
      let roleName = (body.user.role_name || '').toLowerCase();
      let normalizedRole = 'employee';
      if(roleName.includes('manager')) normalizedRole = 'manager';
      // treat any non-manager as employee/staff
      const user = {
        name: body.user.full_name || body.user.username,
        username: body.user.username,
        role: normalizedRole
      };
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    }catch(err){
      setError(err.message || 'Network error');
    }finally{ setLoading(false); }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-left">
          <div className="logo-circle">{initials(username || 'You')}</div>
          <h2>Welcome</h2>
          <p className="muted">Sign in to view and manage tasks.</p>
        </div>
        <form onSubmit={submit} className="login-form">
          <label>
            Username
            <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" />
          </label>
          {error && <div style={{color:'#ef4444',marginBottom:8}}>{error}</div>}
          <div style={{display:'flex',justifyContent:'flex-end',gap:8}}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Signing...' : 'Sign in'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
