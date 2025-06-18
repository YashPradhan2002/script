import React, { useState } from 'react';
import BoardFormModal from './BoardForm';
import { api_url } from '../config';

const BoardListSidebar = ({ boards, setBoards, onSelect , setSelectedBoard }) => {
  const [showForm, setShowForm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [loading, setLoading] = useState(false);

 
  const handleDelete = async (boardId) => {
    setLoading(true);
    try {
      await fetch(`${api_url}boards/${boardId}`, { method: 'DELETE' });
      const res = await fetch(`${api_url}boards`);
      const data = await res.json();
      setBoards(data);
      if (setSelectedBoard) setSelectedBoard(null); // <-- Clear selected board
    } finally {
      setLoading(false);
      setShowToast(false);
      setPendingDelete(null);
    }
  };


  const requestDelete = (boardId) => {
    setPendingDelete(boardId);
    setShowToast(true);
  };

  return (
    <>
      <div className="card shadow-sm" style={{ minWidth: 250, height: '100vh', position: 'sticky', top: 0 }}>
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center ">
          <h5 className="mb-0">Boards</h5>
          <button className="btn btn-outline " onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-circle" style={{ color:'white' }}></i>
          </button>
        </div>
        <ul className="list-group list-group-flush">
          {boards.map((board) => (
            <li onClick={() => onSelect(board)} key={board._id} className="list-group-item d-flex justify-content-between align-items-center list-group-item-action" style={{ cursor: 'pointer' }}>
              <span>{board.name}</span>
              <div className="dropdown">
                <button className="btn btn-sm" type="button" id={`dropdownMenuButton-${board._id}`} data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-three-dots" style={{ fontSize: '1.3rem', transform: 'rotate(90deg)' }}></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdownMenuButton-${board._id}`}>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      type="button"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        requestDelete(board._id);
                      }}
                    >
                      Delete Board
                    </button>
                  </li>
                </ul>
              </div>
            </li>
          ))}
        </ul>

        {showForm && (
          <BoardFormModal
            onClose={() => setShowForm(false)}
            onRefresh={() => {
              fetch(`${api_url}boards`)
                .then((res) => res.json())
                .then((data) => setBoards(data));
            }}
          />
        )}
      </div>

      {/* Custom Toast/Notification */}
      <div
        className={`toast align-items-center text-bg-danger border-0 position-fixed end-0 top-0 m-4 shadow-lg ${showToast ? 'show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{
          minWidth: 320,
          zIndex: 2000,
          transition: 'transform 0.4s cubic-bezier(.4,2,.6,1), opacity 0.4s',
          transform: showToast ? 'translateX(0)' : 'translateX(120%)',
          opacity: showToast ? 1 : 0,
        }}
      >
        <div className="d-flex flex-column p-3">
          <div>
            <strong>Delete Board?</strong>
            <div className="small mt-1">
              All tasks associated with this board will also be deleted. This action cannot be undone.
            </div>
          </div>
          <div className="mt-3 d-flex gap-2 justify-content-end">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => handleDelete(pendingDelete)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
            <button
              className="btn btn-light btn-sm"
              onClick={() => setShowToast(false)}
              disabled={loading}
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BoardListSidebar;