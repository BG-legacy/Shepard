import React, { useState, useEffect } from 'react';
import { taskService, memberService } from '../services';
import { useAuth } from '../context/AuthContext';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    member_id: '',
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    assigned_to: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await memberService.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (!data.assigned_to) delete data.assigned_to;
      if (!data.due_date) delete data.due_date;

      if (editingTask) {
        await taskService.update(editingTask.id, data);
      } else {
        await taskService.create(data);
      }
      setShowForm(false);
      setEditingTask(null);
      setFormData({
        member_id: '',
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        assigned_to: '',
        due_date: '',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert(error.response?.data?.error || 'Error saving task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      member_id: task.member_id,
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority || 'medium',
      assigned_to: task.assigned_to || '',
      due_date: task.due_date || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(id);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Error deleting task');
      }
    }
  };

  const canModify = user?.role === 'admin' || user?.role === 'leader';

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in_progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h1>Care Tasks</h1>
        {canModify && (
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingTask(null);
              setFormData({
                member_id: '',
                title: '',
                description: '',
                status: 'pending',
                priority: 'medium',
                assigned_to: '',
                due_date: '',
              });
            }}
          >
            Add Task
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Member *</label>
                <select
                  name="member_id"
                  value={formData.member_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.first_name} {member.last_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select name="priority" value={formData.priority} onChange={handleInputChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="tasks-grid">
        {tasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <div className="task-badges">
                <span className={`badge ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
              </div>
            </div>
            <p className="task-member">
              <strong>Member:</strong> {task.first_name} {task.last_name}
            </p>
            {task.description && <p className="task-description">{task.description}</p>}
            {task.due_date && (
              <p className="task-due">
                <strong>Due:</strong> {new Date(task.due_date).toLocaleDateString()}
              </p>
            )}
            {task.assigned_to_email && (
              <p className="task-assigned">
                <strong>Assigned to:</strong> {task.assigned_to_email}
              </p>
            )}
            <div className="card-actions">
              {canModify && (
                <>
                  <button className="btn-small" onClick={() => handleEdit(task)}>
                    Edit
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(task.id)}
                    >
                      Delete
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
