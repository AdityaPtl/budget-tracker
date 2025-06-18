// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Data from "./pages/Data";
import MonthlyBreakdown from "./pages/MonthlyBreakdown";
import CompoundInterest from "./pages/CompoundInterest";
import Account from "./pages/Account";
import BudgetPlanner from './pages/BudgetPlanner';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/data" element={<Data />} />
        <Route path="/monthly-breakdown" element={<MonthlyBreakdown />} />
        <Route path="/compound-interest" element={<CompoundInterest />} />
        <Route path="/account" element={<Account />} />
        <Route path="/budget-planner" element={<BudgetPlanner />}/>
      </Routes>
    </Router>
  );
}

export default App;
