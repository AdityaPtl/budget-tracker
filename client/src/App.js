import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Data from "./pages/Data";
import MonthlyBreakdown from "./pages/MonthlyBreakdown";
import PrivateRoute from "./components/PrivateRoute";
import CompoundInterest from "./pages/CompoundInterest";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/data"
          element={
            <PrivateRoute>
              <Data />
            </PrivateRoute>
          }
        />
        <Route 
          path="/compound-interest" 
          element={
            <PrivateRoute>
              <CompoundInterest />
            </PrivateRoute>
          } 
        />
        <Route
          path="/monthly-breakdown"
          element={
            <PrivateRoute>
              <MonthlyBreakdown />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
