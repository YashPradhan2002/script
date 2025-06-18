import React, { useState } from 'react';
import { api_url } from '../config';
import ReactDOM from 'react-dom';

function BoardFormModal({ onClose, onRefresh }) {
  const [form, setForm] = useState({
    name: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${api_url}boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });
    onRefresh();
    onClose();
  };

  const modalContent= (
    <div className="modal fade show d-block"  style={{
        background: 'rgba(0,0,0,0.5)',
        zIndex: 12000, // much higher than cards
        position: 'fixed', // ensures overlay is above all content
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        overflowY: 'auto'
      }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create Board</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Board Name</label>
                <input
                  name="name"
                  className="form-control"
                  placeholder="Board Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Create</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

   return ReactDOM.createPortal(
    modalContent,
    document.body
  );
}

export default BoardFormModal;