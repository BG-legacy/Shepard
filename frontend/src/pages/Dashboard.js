import React, { useState, useEffect } from 'react';
import { memberService } from '../services';
import './Dashboard.css';

const Dashboard = () => {
  const [notSeenRecently, setNotSeenRecently] = useState([]);
  const [stats, setStats] = useState({ total: 0, notSeen: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, notSeenRes] = await Promise.all([
        memberService.getAll(),
        memberService.getNotSeenRecently(),
      ]);

      setStats({
        total: membersRes.data.length,
        notSeen: notSeenRes.data.length,
      });
      setNotSeenRecently(notSeenRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Members</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card warning">
          <h3>Not Seen Recently</h3>
          <p className="stat-number">{stats.notSeen}</p>
          <small>(30+ days)</small>
        </div>
      </div>

      <div className="section">
        <h2>Members Not Seen Recently</h2>
        {notSeenRecently.length === 0 ? (
          <p>All members have been seen recently!</p>
        ) : (
          <div className="members-list">
            {notSeenRecently.map((member) => (
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
                {member.last_seen ? (
                  <p className="last-seen">
                    Last seen: {new Date(member.last_seen).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="last-seen">Never attended an event</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
