import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-100 p-4 shadow mb-6">
      <div className="flex justify-between max-w-4xl mx-auto items-center">
        <div className="space-x-4">
          <Link to="/dashboard" className="text-blue-600 font-medium hover:underline">
            Dashboard
          </Link>
          <Link to="/data" className="text-blue-600 font-medium hover:underline">
            Data & Insights
          </Link>
          <Link to="/monthly-breakdown" className="text-blue-600 font-medium hover:underline">
            Monthly Breakdown
          </Link>
          <Link to="/budget-planner" className="text-blue-600 font-medium hover:underline">
            Budget Planner
          </Link>
          <Link to="/compound-interest" className="text-blue-600 font-medium hover:underline">
            Compound Interest
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate("/account")}
            className="text-gray-700 px-3 py-1 rounded hover:underline"
          >
            Account Settings
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
