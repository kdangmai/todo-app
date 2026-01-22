import React, {useState, useEffect} from 'react';

function todayISO(){
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0,10);
}

export default function TaskForm({onSave, initial, onCancel}){
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [visibility, setVisibility] = useState('public');

  useEffect(()=>{
    if(initial){
      setTitle(initial.title||'');
      setDetails(initial.details||'');
      setAssignedDate(initial.assignedDate||todayISO());
      setDueDate(initial.dueDate||'');
      setPriority(initial.priority||'Medium');
      setVisibility(initial.visibility||'public');
    } else {
      setAssignedDate(todayISO());
    }
  },[initial]);

  function submit(e){
    e.preventDefault();
    if(!title.trim()) return alert('Vui lòng nhập tên công việc.');
    const payload = {
      ...(initial||{}),
      id: (initial && initial.id) || Date.now(),
      title: title.trim(),
      details: details.trim(),
      assignedDate, dueDate, priority, visibility,
      confirmations: initial && initial.confirmations ? initial.confirmations : []
    };
    onSave(payload);
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <div className="form-row">
        <label>Title
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nhập tên công việc" maxLength={120} />
        </label>
      </div>

      <div className="form-row">
        <label>Details
          <textarea value={details} onChange={e=>setDetails(e.target.value)} placeholder="Mô tả chi tiết (tùy chọn)" rows={5} maxLength={2000} />
        </label>
      </div>

      <div className="form-row form-grid">
        <label>Assigned Date
          <input type="date" value={assignedDate} onChange={e=>setAssignedDate(e.target.value)} />
        </label>
        <label>Due Date
          <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
        </label>
      </div>

      <div className="form-row form-grid">
        <label>Priority
          <select value={priority} onChange={e=>setPriority(e.target.value)}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </label>
        <label>Visibility
          <select value={visibility} onChange={e=>setVisibility(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
      </div>

      <div className="form-actions" style={{display:'flex',gap:8,justifyContent:'flex-end',marginTop:12}}>
        {onCancel && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
        <button type="submit" className="btn btn-primary">Save Task</button>
      </div>
    </form>
  )
}
