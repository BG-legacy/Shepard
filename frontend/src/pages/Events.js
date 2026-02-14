import React, { useState, useEffect } from 'react';
import { eventService, memberService } from '../services';
import { useAuth } from '../context/AuthContext';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAttendance, setShowAttendance] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
    fetchMembers();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAll();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
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

  const fetchAttendance = async (eventId) => {
    try {
      const response = await eventService.getAttendance(eventId);
      setAttendance(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await eventService.update(editingEvent.id, formData);
      } else {
        await eventService.create(formData);
      }
      setShowForm(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(error.response?.data?.error || 'Error saving event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      event_date: event.event_date.substring(0, 16),
      location: event.location || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
      }
    }
  };

  const handleCheckIn = async (eventId, memberId) => {
    try {
      await eventService.checkIn(eventId, memberId);
      fetchAttendance(eventId);
    } catch (error) {
      console.error('Error checking in:', error);
      alert(error.response?.data?.error || 'Error checking in');
    }
  };

  const handleShowAttendance = (event) => {
    setShowAttendance(event);
    fetchAttendance(event.id);
  };

  const canModify = user?.role === 'admin' || user?.role === 'leader';

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Events</h1>
        {canModify && (
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingEvent(null);
              setFormData({
                title: '',
                description: '',
                event_date: '',
                location: '',
              });
            }}
          >
            Add Event
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <form onSubmit={handleSubmit}>
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
              <div className="form-group">
                <label>Date & Time *</label>
                <input
                  type="datetime-local"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingEvent ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAttendance && (
        <div className="form-modal">
          <div className="form-container">
            <h2>Attendance: {showAttendance.title}</h2>
            <div className="attendance-section">
              <h3>Checked In ({attendance.length})</h3>
              <div className="attendance-list">
                {attendance.map((a) => (
                  <div key={a.id} className="attendance-item">
                    {a.first_name} {a.last_name} - {new Date(a.checked_in_at).toLocaleString()}
                  </div>
                ))}
              </div>
            </div>
            <div className="attendance-section">
              <h3>Check In Member</h3>
              <div className="members-checkin">
                {members.map((member) => {
                  const isCheckedIn = attendance.some((a) => a.member_id === member.id);
                  return (
                    <div key={member.id} className="member-checkin-item">
                      <span>
                        {member.first_name} {member.last_name}
                      </span>
                      {isCheckedIn ? (
                        <span className="checked-in">✓ Checked In</span>
                      ) : (
                        <button
                          className="btn-small"
                          onClick={() => handleCheckIn(showAttendance.id, member.id)}
                        >
                          Check In
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className="btn-secondary"
              onClick={() => {
                setShowAttendance(null);
                setAttendance([]);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="events-grid">
        {events.map((event) => (
          <div key={event.id} className="event-card">
            <h3>{event.title}</h3>
            <p className="event-date">
              {new Date(event.event_date).toLocaleString()}
            </p>
            {event.description && <p>{event.description}</p>}
            {event.location && (
              <p>
                <strong>Location:</strong> {event.location}
              </p>
            )}
            <div className="card-actions">
              <button className="btn-small" onClick={() => handleShowAttendance(event)}>
                Attendance
              </button>
              {canModify && (
                <>
                  <button className="btn-small" onClick={() => handleEdit(event)}>
                    Edit
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(event.id)}
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

export default Events;
