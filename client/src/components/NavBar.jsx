import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-gray-100 p-4 shadow mb-6">
      <div className="flex justify-between max-w-4xl mx-auto items-center">
        <div className="space-x-4">
          <Link to="/dashboard" className="text-blue-600 font-medium hover:underline">
            Dashboard
          </Link>
          <Link to="/data" className="text-blue-600 font-medium hover:underline">
            Data
          </Link>
          <Link to="/monthly-breakdown" className="text-blue-600 font-medium hover:underline">
            Monthly Breakdown
          </Link>
          <Link to="/compound-interest" className="text-blue-600 font-medium hover:underline">
            Compound Interest
          </Link>
        </div>
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
    </nav>
  );
}

export default NavBar;
