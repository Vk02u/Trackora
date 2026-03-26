import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Dashboard.css';

const Dashboard = () => {
  const [todayData, setTodayData] = useState({
    totalExpense: 0,
    allTimeExpense: 0,
    activities: [],
    meals: []
  });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Always use local date (YYYY-MM-DD) to avoid UTC off-by-one issues.
  const getLocalDateStr = (d = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  useEffect(() => {
    const todayLocalStr = getLocalDateStr();
    // Backward compatibility: older records may have been saved using UTC date.
    const todayUtcStr = new Date().toISOString().split('T')[0];
    const dateOptions = todayLocalStr === todayUtcStr ? [todayLocalStr] : [todayLocalStr, todayUtcStr];

    // Expenses realtime listener
    const expensesQuery = query(
      collection(db, 'expenses'),
      where('date', 'in', dateOptions)
    );
    const unsubExpenses = onSnapshot(
      expensesQuery,
      (snapshot) => {
        let totalExpense = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          totalExpense += parseFloat(data.amount) || 0;
        });
        setTodayData((prev) => ({
          ...prev,
          totalExpense
        }));
        setErrorMsg(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to expenses:', error);
        setErrorMsg(`Failed to load expenses: ${error.message || error}`);
        setLoading(false);
      }
    );

    // Expenses (all-time) realtime listener
    const expensesAllQuery = query(collection(db, 'expenses'));
    const unsubExpensesAll = onSnapshot(
      expensesAllQuery,
      (snapshot) => {
        let allTimeExpense = 0;
        snapshot.forEach((doc) => {
          const data = doc.data();
          allTimeExpense += parseFloat(data.amount) || 0;
        });
        setTodayData((prev) => ({
          ...prev,
          allTimeExpense
        }));
        setErrorMsg(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to all-time expenses:', error);
        setErrorMsg(`Failed to load expenses: ${error.message || error}`);
        setLoading(false);
      }
    );

    // Activities realtime listener
    const activitiesQuery = query(
      collection(db, 'activities'),
      where('date', 'in', dateOptions)
    );
    const unsubActivities = onSnapshot(
      activitiesQuery,
      (snapshot) => {
        const activities = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          activities.push({ id: doc.id, ...data });
        });
        setTodayData((prev) => ({
          ...prev,
          activities
        }));
        setErrorMsg(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to activities:', error);
        setErrorMsg(`Failed to load activities: ${error.message || error}`);
        setLoading(false);
      }
    );

    // Meals realtime listener
    const mealsQuery = query(
      collection(db, 'meals'),
      where('date', 'in', dateOptions)
    );
    const unsubMeals = onSnapshot(
      mealsQuery,
      (snapshot) => {
        const meals = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          meals.push({ id: doc.id, ...data });
        });
        setTodayData((prev) => ({
          ...prev,
          meals
        }));
        setErrorMsg(null);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to meals:', error);
        setErrorMsg(`Failed to load meals: ${error.message || error}`);
        setLoading(false);
      }
    );

    return () => {
      unsubExpenses();
      unsubExpensesAll();
      unsubActivities();
      unsubMeals();
    };
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <h2>Today's Summary</h2>
      {errorMsg ? <div className="dashboard-error">{errorMsg}</div> : null}
      <div className="dashboard-grid">
        <div className="dashboard-card expense-card">
          <h3>💰 Expenses</h3>
          <p className="amount">₹{todayData.totalExpense.toFixed(2)}</p>
          <p style={{ marginTop: 8, fontSize: '1.1rem', fontWeight: 600, opacity: 0.95 }}>
            All time: ₹{todayData.allTimeExpense.toFixed(2)}
          </p>
        </div>

        <div className="dashboard-card activity-card">
          <h3>🎯 Activities ({todayData.activities.length})</h3>
          <div className="list-items">
            {todayData.activities.length > 0 ? (
              todayData.activities.map((activity) => (
                <div key={activity.id} className="list-item">
                  <span className="time">{activity.time}</span>
                  <span className="text">{activity.description}</span>
                </div>
              ))
            ) : (
              <>
                <div className="list-item">
                  <span className="time">09:00 AM</span>
                  <span className="text">Morning Walk - 30 minutes</span>
                </div>
                <div className="list-item">
                  <span className="time">02:30 PM</span>
                  <span className="text">Gym Workout Session</span>
                </div>
                <div className="list-item">
                  <span className="time">06:00 PM</span>
                  <span className="text">Evening Meditation</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="dashboard-card meal-card">
          <h3>🍽️ Meals ({todayData.meals.length})</h3>
          <div className="list-items">
            {todayData.meals.length > 0 ? (
              todayData.meals.map((meal) => (
                <div key={meal.id} className="list-item">
                  <span className="time">{meal.time}</span>
                  <span className="text">{meal.food}</span>
                </div>
              ))
            ) : (
              <>
                <div className="list-item">
                  <span className="time">08:00 AM</span>
                  <span className="text">Breakfast - Paratha with Tea</span>
                </div>
                <div className="list-item">
                  <span className="time">01:00 PM</span>
                  <span className="text">Lunch - Dal Rice with Vegetables</span>
                </div>
                <div className="list-item">
                  <span className="time">08:30 PM</span>
                  <span className="text">Dinner - Roti with Sabzi</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

