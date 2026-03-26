import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Tracker.css';

const ActivityTracker = () => {
  const [activities, setActivities] = useState([]);

  // Save local date (YYYY-MM-DD) to keep Dashboard "today" consistent.
  const getLocalDateStr = (d = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const [formData, setFormData] = useState({
    description: '',
    time: new Date().toTimeString().slice(0, 5),
    date: getLocalDateStr()
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const activitiesQuery = query(collection(db, 'activities'));
      const snapshot = await getDocs(activitiesQuery);
      const activitiesList = [];
      snapshot.forEach((doc) => {
        activitiesList.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date and time (newest first)
      activitiesList.sort((a, b) => {
        const dateCompare = new Date(b.date) - new Date(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      });
      setActivities(activitiesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description) {
      alert('Please enter activity description');
      return;
    }

    try {
      await addDoc(collection(db, 'activities'), {
        description: formData.description,
        time: formData.time,
        date: formData.date,
        timestamp: new Date()
      });
      setFormData({
        description: '',
        time: new Date().toTimeString().slice(0, 5),
        date: getLocalDateStr()
      });
      fetchActivities();
    } catch (error) {
      console.error('Error adding activity:', error);
      alert('Error adding activity. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await deleteDoc(doc(db, 'activities', id));
        fetchActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
        alert('Error deleting activity. Please try again.');
      }
    }
  };

  return (
    <div className="tracker">
      <h2>🎯 Activity Tracker</h2>

      <form onSubmit={handleSubmit} className="tracker-form">
        <div className="form-group">
          <label>What did you do?</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Went to gym, Completed project, Met friends"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Add Activity</button>
      </form>

      <div className="items-list">
        <h3>Your Activities</h3>
        {loading ? (
          <p>Loading...</p>
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="item-card">
              <div className="item-info">
                <span className="item-description">{activity.description}</span>
                <span className="item-date">{activity.date} at {activity.time}</span>
              </div>
              <button
                onClick={() => handleDelete(activity.id)}
                className="delete-btn"
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <p className="empty-message">No activities recorded yet</p>
        )}
      </div>
    </div>
  );
};

export default ActivityTracker;

