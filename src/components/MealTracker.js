import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Tracker.css';

const MealTracker = () => {
  const [meals, setMeals] = useState([]);

  // Save local date (YYYY-MM-DD) to keep Dashboard "today" consistent.
  const getLocalDateStr = (d = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const [formData, setFormData] = useState({
    food: '',
    mealType: 'breakfast',
    time: new Date().toTimeString().slice(0, 5),
    date: getLocalDateStr()
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const mealsQuery = query(collection(db, 'meals'));
      const snapshot = await getDocs(mealsQuery);
      const mealsList = [];
      snapshot.forEach((doc) => {
        mealsList.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date and time (newest first)
      mealsList.sort((a, b) => {
        const dateCompare = new Date(b.date) - new Date(a.date);
        if (dateCompare !== 0) return dateCompare;
        return b.time.localeCompare(a.time);
      });
      setMeals(mealsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.food) {
      alert('Please enter what you ate');
      return;
    }

    try {
      await addDoc(collection(db, 'meals'), {
        food: formData.food,
        mealType: formData.mealType,
        time: formData.time,
        date: formData.date,
        timestamp: new Date()
      });
      setFormData({
        food: '',
        mealType: 'breakfast',
        time: new Date().toTimeString().slice(0, 5),
        date: getLocalDateStr()
      });
      fetchMeals();
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Error adding meal. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await deleteDoc(doc(db, 'meals', id));
        fetchMeals();
      } catch (error) {
        console.error('Error deleting meal:', error);
        alert('Error deleting meal. Please try again.');
      }
    }
  };

  const getMealEmoji = (type) => {
    const emojis = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍪'
    };
    return emojis[type] || '🍽️';
  };

  return (
    <div className="tracker">
      <h2>🍽️ Meal Tracker</h2>

      <form onSubmit={handleSubmit} className="tracker-form">
        <div className="form-group">
          <label>What did you eat?</label>
          <input
            type="text"
            value={formData.food}
            onChange={(e) => setFormData({ ...formData, food: e.target.value })}
            placeholder="e.g., Roti, Sabzi, Rice, Dal"
            required
          />
        </div>

        <div className="form-group">
          <label>Meal Type</label>
          <select
            value={formData.mealType}
            onChange={(e) => setFormData({ ...formData, mealType: e.target.value })}
            required
          >
            <option value="breakfast">🌅 Breakfast</option>
            <option value="lunch">☀️ Lunch</option>
            <option value="dinner">🌙 Dinner</option>
            <option value="snack">🍪 Snack</option>
          </select>
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

        <button type="submit" className="submit-btn">Add Meal</button>
      </form>

      <div className="items-list">
        <h3>Your Meals</h3>
        {loading ? (
          <p>Loading...</p>
        ) : meals.length > 0 ? (
          meals.map((meal) => (
            <div key={meal.id} className="item-card">
              <div className="item-info">
                <span className="item-description">
                  {getMealEmoji(meal.mealType)} {meal.food}
                </span>
                <span className="item-date">{meal.date} at {meal.time}</span>
              </div>
              <button
                onClick={() => handleDelete(meal.id)}
                className="delete-btn"
              >
                🗑️
              </button>
            </div>
          ))
        ) : (
          <p className="empty-message">No meals recorded yet</p>
        )}
      </div>
    </div>
  );
};

export default MealTracker;

