import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import TaskFormModal from './TaskForm';
import { api_url } from '../config';
import TaskCard from './TaskCard'; // Add this import
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function BoardDetail({ board }) {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

    const handleDeleteTask = async () => {
    if (!selectedTask) return;
    try {
      await axios.delete(`${api_url}tasks/${selectedTask.id}`);
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  // Edit handler for modal
  const handleEditTask = () => {
    setShowEditForm(true);
  };
  

  const statuses = [
    { id: 'todo', label: 'To Do' },
    { id: 'inprogress', label: 'In Progress' },
    { id: 'done', label: 'Done' }
  ];

  const [priorityFilters, setPriorityFilters] = useState({
    todo: 'All',
    inprogress: 'All',
    done: 'All'
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${api_url}boards/${board._id}/tasks`);
      const data = await res.json();
      setTasks(data.map((task) => ({ ...task, id: task._id.toString() })));
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [board]);

  // Group tasks by status and preserve order
  const groupedTasks = useMemo(() => {
    const groups = { todo: [], inprogress: [], done: [] };
    tasks.forEach((task) => {
      const key = task.status.toLowerCase().replace(/\s/g, '');
      if (groups[key]) groups[key].push(task);
    });
    return groups;
  }, [tasks]);

  // Helper to reorder tasks in a list
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // Handle drag end
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    // Optimistically update UI
    let newTasks = [...tasks];
    if (sourceCol === destCol) {
      // Reorder within same column
      const items = groupedTasks[sourceCol].filter((t) => priorityFilters[sourceCol] === 'All' || t.priority === priorityFilters[sourceCol]);
      const movedTask = items[source.index];
      const allInCol = groupedTasks[sourceCol];
      const fromIndex = allInCol.findIndex((t) => t.id === movedTask.id);
      const toIndex = (() => {
        // Find the task at destination index in filtered list, then map to allInCol
        if (destination.index >= items.length) return allInCol.length - 1;
        const destTask = items[destination.index];
        return allInCol.findIndex((t) => t.id === destTask.id);
      })();
      const reordered = reorder(allInCol, fromIndex, toIndex);
      newTasks = [...tasks.filter((t) => t.status.toLowerCase().replace(/\s/g, '') !== sourceCol), ...reordered];
    } else {
      // Move to another column
      const sourceItems = groupedTasks[sourceCol].filter((t) => priorityFilters[sourceCol] === 'All' || t.priority === priorityFilters[sourceCol]);
      const movedTask = sourceItems[source.index];
      newTasks = tasks.map((t) => (t.id === movedTask.id ? { ...t, status: destCol } : t));
    }
    setTasks(newTasks);

    // Persist change to backend
    try {
      await axios.patch(`${api_url}tasks/${draggableId}/status`, {
        status: destCol
      });
      // Optionally, update order in backend if supported
    } catch (err) {
      console.error('Failed to update task status:', err);
      fetchTasks(); // fallback to server state
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">{board.name}</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + New Task
        </button>
      </div>

      {loading ? (
        <div className="text-center">Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="row">
            {statuses.map(({ id, label }) => (
              <div className="col-md-4 mb-3" key={id}>
                <div className="card h-100 shadow-sm">
                  <div className={`card-header fw-bold ${id === 'todo' ? 'bg-danger text-white' : id === 'inprogress' ? 'bg-warning text-dark' : 'bg-success text-white'}`}>{label}</div>
                  <div className="p-2">
                    <label className="me-2 fw-bold" htmlFor={`priority-filter-${id}`}>
                      Priority:
                    </label>
                    <select
                      id={`priority-filter-${id}`}
                      className="form-select d-inline-block w-auto"
                      value={priorityFilters[id]}
                      onChange={(e) =>
                        setPriorityFilters((prev) => ({
                          ...prev,
                          [id]: e.target.value
                        }))
                      }
                    >
                      <option value="All">All</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <Droppable droppableId={id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="card-body p-2"
                        style={{
                          minHeight: '150px',
                          backgroundColor: snapshot.isDraggingOver ? '#f8f9fa' : 'white',
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        {groupedTasks[id]
                          .filter((task) => priorityFilters[id] === 'All' || task.priority === priorityFilters[id])
                          .map((task) => {
                            // Find the index of the task in the full groupedTasks[id] array for Draggable index
                            const fullIndex = groupedTasks[id].findIndex((t) => t.id === task.id);
                            return (
                              <Draggable key={task.id} draggableId={task.id} index={fullIndex}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="card mb-2"
                                    style={{
                                      ...provided.draggableProps.style,
                                      boxShadow: snapshot.isDragging ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
                                      cursor: snapshot.isDragging ? 'grabbing' : 'grab'
                                    }}
                                  >
                                    <div className="card-body p-2">
                                      <div className="d-flex align-items-center mb-1">
                                        {task.priority && (
                                          <span
                                            className={`badge me-2
                                      ${task.priority === 'High' ? 'bg-danger' : ''}
                                      ${task.priority === 'Medium' ? 'bg-warning text-dark' : ''}
                                      ${task.priority === 'Low' ? 'bg-success' : ''}
                                    `}
                                            style={{ fontSize: '0.75em' }}
                                          >
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                          </span>
                                        )}
                                        <strong>{task.title}</strong>
                                        <button className="btn btn-sm ms-auto" onClick={() => setSelectedTask(task)} type="button">
                                          <i className="bi bi-eye"></i>
                                        </button>
                                      </div>
                                      <p className="mb-1 small text-muted">{task.description}</p>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {showForm && <TaskFormModal boardId={board._id} onClose={() => setShowForm(false)} onRefresh={fetchTasks} />}
      {selectedTask && !showEditForm && <TaskCard task={selectedTask} isDetail onDelete={handleDeleteTask} onClose={() => setSelectedTask(null)} onEdit={handleEditTask} />}
      {showEditForm && (
        <TaskFormModal
          boardId={board._id}
          task={selectedTask}
          onClose={() => {
            setShowEditForm(false);
            setSelectedTask(null);
          }}
          onRefresh={fetchTasks}
        />
      )}
    </div>
  );
}

export default BoardDetail;
