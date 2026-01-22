import React, {useState} from 'react';
import Modal from './Modal';

export default function TaskCard({task, onConfirm, onEdit, onDelete, canConfirm, canViewConfirmations}){
  const [expanded, setExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const truncated = task.details && task.details.length>140 ? task.details.slice(0,140) + '...' : task.details;
  const confirmations = task.confirmations || [];

  function initials(name){
    if(!name) return '';
    return name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();
  }

  return (
    <div className={"task-card " + (task.visibility === 'private' ? 'private':'public')}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="meta">{task.priority}</div>
      </div>
      <div className="task-sub">
        <span className={`badge priority-${(task.priority||'Medium').toLowerCase()}`}>{task.priority}</span>
        <span className="badge visibility-badge">{task.visibility.toUpperCase()}</span>
        <div className="dates">Assigned: {task.assignedDate || '-'} • Due: {task.dueDate || '-'}</div>
      </div>

      <div className="task-body">
        <div className="details">{expanded ? task.details : truncated}</div>
        {task.details && task.details.length > 140 && (
          <button className="btn btn-link" onClick={()=>setExpanded(!expanded)}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="task-actions">
        <button className="btn btn-ghost" onClick={()=>setShowModal(true)}>Open</button>
        {canConfirm && <button className="btn btn-primary" onClick={()=>onConfirm(task.id)}>Confirm Seen</button>}
        {onEdit && <button className="btn" onClick={()=>onEdit(task)}>Edit</button>}
        {onDelete && <button className="btn btn-danger" onClick={()=>onDelete(task.id)}>Delete</button>}
        {canViewConfirmations && (
          <button className="btn btn-link" onClick={()=>setShowModal(true)}>
            Confirmations <span className="conf-count">{confirmations.length}</span>
          </button>
        )}
      </div>

      {showModal && (
        <Modal title={task.title} onClose={()=>setShowModal(false)}>
          <div className="modal-task-meta">
            <div><strong>Priority:</strong> {task.priority}</div>
            <div><strong>Visibility:</strong> {task.visibility}</div>
            <div><strong>Assigned:</strong> {task.assignedDate || '-'}</div>
            <div><strong>Due:</strong> {task.dueDate || '-'}</div>
          </div>
          <div className="modal-task-details">
            <h4>Details</h4>
            <p>{task.details || '(no details)'}</p>
          </div>
          <div className="modal-task-confirmations">
            <h4>Confirmations ({confirmations.length})</h4>
            {confirmations.length===0 && <div className="empty">No confirmations yet.</div>}
            <ul className="conf-list">
              {confirmations.map((c,i)=> <li key={i} className="conf-item"><span className="conf-avatar">{initials(c.user)}</span>{c.user} — {new Date(c.time).toLocaleString()}</li>)}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  )
}
