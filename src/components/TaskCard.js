import React from 'react';

const priorityColors = {
  High: 'danger',
  Medium: 'warning',
  Low: 'success'
};

const TaskCard = ({ task, onDelete, onClick, isDetail, onClose, onEdit }) => {
  if (isDetail) {

    const formatStatus = (status) => {
      if (!status) return '';

      return status
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    };

    return (
      <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: 'rgba(0,0,0,0.3)', zIndex: 12000 }}
      >
      <div className="card shadow" style={{ minWidth: 350, maxWidth: 500 }}>
        <div className="card-header d-flex justify-content-between align-items-center">
        <span>
          <span className={`badge bg-${priorityColors[task.priority]} me-2`}>{task.priority}</span>
          <strong>{task.title}</strong>
        </span>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        </div>
        <div className="card-body">
        <div><strong>Status:</strong> {formatStatus(task.status)}</div>
        <div><strong>Assigned To:</strong> {task.assignedTo}</div>
        <div><strong>Due Date:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</div>
        <div className="mt-2">{task.description}</div>
        </div>
        <div className="card-footer d-flex justify-content-between">
        <button className="btn btn-danger btn-sm" onClick={onDelete}>
          <i className="bi bi-trash"></i> Delete
        </button>
        <button className="btn btn-primary btn-sm" onClick={onEdit}>
          <i className="bi bi-pencil"></i> Edit
        </button>
        </div>
      </div>
      </div>
    );
  }
}
export default TaskCard;