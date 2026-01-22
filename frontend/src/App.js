import React, {useEffect, useState} from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import TaskList from './components/TaskList';
import UserManagement from './components/UserManagement';
import UserModal from './components/UserModal';
import './App.css';

function App(){
  const [user, setUser] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem('user')); }catch(e){return null}
  });
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(()=>{
    document.title = 'Todo App';
  },[]);

  function logout(){ localStorage.removeItem('user'); localStorage.removeItem('token'); setUser(null); }

  function handleUserUpdate(updated){
    const newUser = {...user, ...updated};
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  if(!user){
    return <Login onLogin={u=>setUser(u)} />
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header>
          <div className="brand">TO-DO App</div>
          <nav>
            <Link to="/">Home</Link>
            {user.role === 'manager' && <button onClick={()=>window.location.href='/users'} className="btn btn-primary">Manager Dashboard</button>}
            <span className="user" onClick={()=>setShowUserModal(true)} style={{cursor:'pointer'}}>{user.name} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<TaskList user={user} />} />
            <Route path="/users" element={user.role === 'manager' ? <UserManagement user={user} /> : <Navigate to="/" />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {showUserModal && (
          <UserModal
            user={user}
            onClose={()=>setShowUserModal(false)}
            onUpdate={handleUserUpdate}
            onDelete={()=>{}} // Không cho phép self-delete
            canManageUsers={user.role === 'Manager'}
          />
        )}
      </div>
    </BrowserRouter>
  )
}

export default App;
