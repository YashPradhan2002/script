import React, { useState, useEffect } from 'react';
import { api_url } from '../config';

function TaskFormModal({ boardId, onClose, onRefresh, task }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    assignedTo: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  // Fetch task details if editing
  useEffect(() => {
    if (task && task.id) {
      setLoading(true);
      fetch(`${api_url}tasks/${task.id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            title: data.title || '',
            description: data.description || '',
            status: data.status || 'To Do',
            priority: data.priority || 'Medium',
            assignedTo: data.assignedTo || '',
            dueDate: data.dueDate ? data.dueDate.slice(0, 10) : ''
          });
        })
        .finally(() => setLoading(false));
    } else if (task) {
      // If task object is passed directly (already loaded)
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        assignedTo: task.assignedTo || '',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (task && task.id) {
        // Update existing task
        await fetch(`${api_url}tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      } else {
        // Create new task
        await fetch(`${api_url}boards/${boardId}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      onRefresh();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">{task && task.id ? 'Edit Task' : 'Create Task'}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input name="title" className="form-control" placeholder="Title" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" placeholder="Description" value={form.description} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Done</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select name="priority" className="form-select" value={form.priority} onChange={handleChange}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Assigned To</label>
                    <input name="assignedTo" className="form-control" placeholder="Assigned To" value={form.assignedTo} onChange={handleChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input type="date" name="dueDate" className="form-control" value={form.dueDate} onChange={handleChange} />
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {task && task.id ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskFormModal;