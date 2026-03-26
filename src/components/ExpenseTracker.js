import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Tracker.css';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);

  // Save local date (YYYY-MM-DD) to keep Dashboard "today" consistent.
  const getLocalDateStr = (d = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: getLocalDateStr()
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const expensesQuery = query(collection(db, 'expenses'));
      const snapshot = await getDocs(expensesQuery);
      const expensesList = [];
      snapshot.forEach((doc) => {
        expensesList.push({ id: doc.id, ...doc.data() });
      });
      // Sort by date (newest first)
      expensesList.sort((a, b) => new Date(b.date) - new Date(a.date));
      setExpenses(expensesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      alert('Please fill all fields');
      return;
    }

    try {
      await addDoc(collection(db, 'expenses'), {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: formData.date,
        timestamp: new Date()
      });
      setFormData({
        description: '',
        amount: '',
        date: getLocalDateStr()
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteDoc(doc(db, 'expenses', id));
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Error deleting expense. Please try again.');
      }
    }
  };

  const totalExpense = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);

  return (
    <div className="tracker">
      <h2>💰 Expense Tracker</h2>

      <form onSubmit={handleSubmit} className="tracker-form">
        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="e.g., Groceries, Transport, Food"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
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

        <button type="submit" className="submit-btn">Add Expense</button>
      </form>

      <div className="summary-card">
        <h3>Total Expenses: ₹{totalExpense.toFixed(2)}</h3>
      </div>

      <div className="items-list">
        <h3>Recent Expenses</h3>
        {loading ? (
          <p>Loading...</p>
        ) : expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense.id} className="item-card">
              <div className="item-info">
                <span className="item-description">{expense.description}</span>
                <span className="item-date">{expense.date}</span>
              </div>
              <div className="item-actions">
                <span className="item-amount">₹{parseFloat(expense.amount).toFixed(2)}</span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-message">No expenses recorded yet</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;

