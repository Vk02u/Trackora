import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ExpenseTracker from './components/ExpenseTracker';
import ActivityTracker from './components/ActivityTracker';
import MealTracker from './components/MealTracker';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <header className="app-header">
        <h1>📊 Daily Tracker</h1>
        <p>Track your expenses, activities, and meals</p>
      </header>

      <nav className="tab-navigation">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          📈 Dashboard
        </button>
        <button
          className={activeTab === 'expense' ? 'active' : ''}
          onClick={() => setActiveTab('expense')}
        >
          💰 Expenses
        </button>
        <button
          className={activeTab === 'activity' ? 'active' : ''}
          onClick={() => setActiveTab('activity')}
        >
          🎯 Activities
        </button>
        <button
          className={activeTab === 'meal' ? 'active' : ''}
          onClick={() => setActiveTab('meal')}
        >
          🍽️ Meals
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'expense' && <ExpenseTracker />}
        {activeTab === 'activity' && <ActivityTracker />}
        {activeTab === 'meal' && <MealTracker />}
      </main>
    </div>
  );
}

export default App;

