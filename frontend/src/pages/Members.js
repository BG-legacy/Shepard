import React, { useState, useEffect } from 'react';
import { memberService, insightService } from '../services';
import { useAuth } from '../context/AuthContext';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    birth_date: '',
    join_date: '',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [generatingInsight, setGeneratingInsight] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await memberService.getAll();
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await memberService.update(editingMember.id, formData);
      } else {
        await memberService.create(formData);
      }
      setShowForm(false);
      setEditingMember(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        birth_date: '',
        join_date: '',
        notes: '',
      });
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      alert(error.response?.data?.error || 'Error saving member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      phone: member.phone,
      address: member.address || '',
      birth_date: member.birth_date || '',
      join_date: member.join_date || '',
      notes: member.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await memberService.delete(id);
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Error deleting member');
      }
    }
  };

  const handleGenerateInsight = async (memberId) => {
    setGeneratingInsight(memberId);
    try {
      await insightService.generate(memberId);
      alert('AI insight generated successfully!');
    } catch (error) {
      console.error('Error generating insight:', error);
      alert(error.response?.data?.error || 'Error generating insight');
    } finally {
      setGeneratingInsight(null);
    }
  };

  const canModify = user?.role === 'admin' || user?.role === 'leader';

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  return (
    <div className="members-page">
      <div className="page-header">
        <h1>Members</h1>
        {canModify && (
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingMember(null);
              setFormData({
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                address: '',
                birth_date: '',
                join_date: '',
                notes: '',
              });
            }}
          >
            Add Member
          </button>
        )}
      </div>

      {showForm && (
        <div className="form-modal">
          <div className="form-container">
            <h2>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Birth Date</label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Join Date</label>
                  <input
                    type="date"
                    name="join_date"
                    value={formData.join_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingMember ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMember(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="members-grid">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <h3>
              {member.first_name} {member.last_name}
            </h3>
            <p>
              <strong>Email:</strong> {member.email}
            </p>
            <p>
              <strong>Phone:</strong> {member.phone}
            </p>
            {member.address && (
              <p>
                <strong>Address:</strong> {member.address}
              </p>
            )}
            {member.birth_date && (
              <p>
                <strong>Birth Date:</strong> {new Date(member.birth_date).toLocaleDateString()}
              </p>
            )}
            <div className="card-actions">
              {canModify && (
                <>
                  <button className="btn-small" onClick={() => handleEdit(member)}>
                    Edit
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      className="btn-small btn-danger"
                      onClick={() => handleDelete(member.id)}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    className="btn-small btn-ai"
                    onClick={() => handleGenerateInsight(member.id)}
                    disabled={generatingInsight === member.id}
                  >
                    {generatingInsight === member.id ? 'Generating...' : 'AI Insight'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
