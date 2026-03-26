# 📊 Daily Tracker - Expense, Activity & Meal Monitor

A beautiful and user-friendly web application to track your daily expenses, activities, and meals. Built with React and Firebase.

## Features

- 💰 **Expense Tracker**: Monitor your daily spending
- 🎯 **Activity Tracker**: Record what you did throughout the day
- 🍽️ **Meal Tracker**: Track what you ate with meal types (Breakfast, Lunch, Dinner, Snack)
- 📈 **Dashboard**: View today's summary at a glance
- 📱 **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- ☁️ **Firebase Integration**: Free cloud storage with no backend needed

## Tech Stack

- **React** - UI Framework
- **Firebase Firestore** - Database
- **HTML/CSS/JavaScript** - Core technologies

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in **test mode** (for development)
   - Choose your preferred location

4. Get your Firebase configuration:
   - Go to Project Settings (⚙️ icon)
   - Scroll down to "Your apps"
   - Click on Web icon (</>)
   - Copy the `firebaseConfig` object

5. Update `src/firebase/config.js`:
   - Replace the placeholder values with your Firebase config

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3. Run the Application

```bash
npm start
```

The app will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Usage

1. **Dashboard**: View today's summary of expenses, activities, and meals
2. **Expenses Tab**: Add and view your daily expenses
3. **Activities Tab**: Record what you did throughout the day
4. **Meals Tab**: Track what you ate with meal types

## Features in Detail

### Expense Tracker
- Add expenses with description and amount
- View total expenses
- Delete expenses
- Filter by date

### Activity Tracker
- Record activities with time and date
- View all activities chronologically
- Easy to update daily

### Meal Tracker
- Track meals with type (Breakfast, Lunch, Dinner, Snack)
- Record time and date
- View meal history

## Responsive Design

The app is fully responsive and works on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops and Desktops (1024px+)

## 🔥 Firebase Setup & Deployment

Firebase connection और Vercel deployment के लिए detailed guide देखें:

👉 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide

**Quick Summary:**
1. पहले Firebase से connect करें (local में test करें)
2. फिर Vercel पर deploy करें
3. Firebase में Vercel domain allow करें

## License

This project is open source and available for personal use.

## Support

If you face any issues, check:
1. Firebase configuration is correct
2. Firestore is enabled in Firebase Console
3. Node modules are installed (`npm install`)
4. Port 3000 is available

---

Made with ❤️ for daily tracking

