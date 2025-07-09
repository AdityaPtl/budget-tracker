# Budget Tracker

A full stack personal finance app that helps users track income, expenses, and financial goals with clean UI, smart categorization, and insightful breakdowns.

### 🌐 Live Demo  
https://financial-planning-adi.com – hosted on Render

---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT-based auth, bcrypt for password hashing
- **Charts**: Recharts for data visualization
- **Deployment**: Render (frontend & backend)

---

## 📌 Features

- Register/login functionality with secure token-based authentication
- Add, edit, and delete transactions with dynamic date/category assignment
- Auto-categorization of transactions (e.g. "KFC" → Food)
- Scrollable and toggleable transaction form to maintain clean layout
- Monthly breakdown with pie charts, summaries, and comparisons vs. previous months
- Budget planner with collapsible category groups, frequency-based totals, and a financial summary
- Compound interest calculator with interactive bar charts and result breakdown
- User account management (update login details)
- Responsive design across devices

---

## 🚀 Getting Started

To run locally:

```bash
git clone https://github.com/AdityaPtl/budget-tracker.git
cd budget-tracker
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Ensure you add a `.env` file with the following:

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

### Frontend Setup

In a separate terminal:

```bash
cd client
npm install
npm run dev
```

---

## 🧠 Project Highlights

This project is built to go far beyond a basic CRUD app — it focuses on **user-friendly financial tooling**, such as:

- Data insights: Spend by category, monthly change, and financial health overview
- Smart UX: Scrollable lists, toggleable forms, pie and bar charts, and responsive layout
- Expandability: Ready to incorporate features like CSV import, tax estimation, and bank integration

---

## 🔮 Future Plans

- CSV transaction import & month-to-month visualization
- Personalized saving tips based on data
- Retirement planner integration
- Financial data dashboard (ETFs, stocks, etc.)
- Dashboard link previews for mobile
