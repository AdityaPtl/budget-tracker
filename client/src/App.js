import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Data from "./pages/Data";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/data" element={<PrivateRoute> <Data /> </PrivateRoute>}/>
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
      </Routes>
    </Router>
  );
}

export default App;
