import React, {useEffect, useState} from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Modal from './Modal';

function loadTasks(){
  try{ return JSON.parse(localStorage.getItem('tasks')||'[]'); }catch(e){return []}
}

function saveTasks(tasks){
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export default function TaskList({user}){
  const [tasks, setTasks] = useState(loadTasks());
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(()=>{ saveTasks(tasks) },[tasks]);

  function createEmpty(){
    setEditing({id: Date.now(), title:'', details:'', assignedDate:'', dueDate:'', priority:'Medium', visibility:'public', confirmations:[]});
    setShowEditor(true);
  }

  function onSave(task){
    setTasks(prev=>{
      const exists = prev.find(t=>t.id===task.id);
      if(exists) return prev.map(t=>t.id===task.id ? {...t, ...task} : t);
      return [task, ...prev];
    });
    setEditing(null);
    setShowEditor(false);
  }

  function onDelete(id){
    if(!window.confirm('Delete task?')) return;
    setTasks(prev=>prev.filter(t=>t.id!==id));
  }

  function onConfirm(id){
    const userName = user.name;
    setTasks(prev=>prev.map(t=>{
      if(t.id!==id) return t;
      const confirmations = t.confirmations || [];
      // avoid duplicate for same user
      if(confirmations.find(c=>c.user===userName)) return t;
      return {...t, confirmations:[...confirmations, {user:userName, time: new Date().toISOString()}]};
    }));
  }

  const visibleTasks = tasks.filter(t=>{
    if(user.role === 'manager') return true;
    return t.visibility === 'public';
  }).filter(t=>{
    if(!query) return true;
    const q = query.toLowerCase();
    return t.title.toLowerCase().includes(q) || (t.details||'').toLowerCase().includes(q);
  });

  return (
    <div className="task-list-wrap">
      <div className="task-list-controls">
        <input placeholder="Search tasks" value={query} onChange={e=>setQuery(e.target.value)} />
        {user.role === 'manager' && <button onClick={createEmpty}>New Task</button>}
      </div>
      {showEditor && editing && (
        <Modal title={editing.title ? 'Edit Task' : 'New Task'} onClose={()=>{setShowEditor(false); setEditing(null)}}>
          <TaskForm initial={editing} onSave={onSave} onCancel={()=>{setShowEditor(false); setEditing(null)}} />
        </Modal>
      )}

      <div className="task-list">
        {visibleTasks.length===0 && <div className="empty">No tasks found</div>}
        {visibleTasks.map(t=> (
          <TaskCard key={t.id} task={t}
            onConfirm={onConfirm}
            onEdit={user.role==='manager' ? (task=>{ setEditing(task); setShowEditor(true); }) : null}
            onDelete={user.role==='manager' ? onDelete : null}
            canConfirm={user.role==='employee'}
            canViewConfirmations={user.role==='manager'}
          />
        ))}
      </div>
      {user.role==='manager' && (
        <button className="fab" title="New Task" onClick={createEmpty}>+</button>
      )}
      {user.role==='manager' && (
        <div className="confirmations-panel">
          <h4>Confirmations</h4>
          {tasks.map(t=> (
            <div key={'c'+t.id} className="confirm-group">
              <strong>{t.title}</strong>
              <ul>
                {(t.confirmations||[]).map((c,i)=> <li key={i}>{c.user} — {new Date(c.time).toLocaleString()}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
