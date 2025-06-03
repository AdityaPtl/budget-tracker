import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(res.data);
      } catch (err) {
        setError("Failed to fetch transactions");
      }
    };

    fetchTransactions();
  }, [token]);

  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5050/api/transactions",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions([res.data, ...transactions]); // add new transaction to top
      setFormData({ amount: "", type: "expense", category: "", description: "", date: "" });
    } catch (err) {
      console.error("Failed to add transaction", err);
    }
  };  

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="flex justify-end mb-4">
            <button
                onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/"; // or use React Router navigate if you'd prefer
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Your Transactions</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleFormSubmit} className="bg-white p-4 mb-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
        <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            className="p-2 border rounded"
            required
        />

        <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="p-2 border rounded"
        >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
        </select>

        <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Category"
            className="p-2 border rounded"
            required
        />

        <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="p-2 border rounded"
        />

        <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="p-2 border rounded col-span-2"
            required
        />
        </div>

        <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
        Add Transaction
        </button>
        </form>


      <ul className="space-y-4">
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="bg-white p-4 shadow rounded border-l-4"
            style={{
              borderColor: tx.type === "income" ? "green" : "red",
            }}
          >
            <div className="flex justify-between">
              <span className="font-medium">{tx.category}</span>
              <span>
                {tx.type === "expense" ? "-" : "+"}${parseFloat(tx.amount).toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-gray-500">{tx.description}</p>
            <p className="text-xs text-gray-400">{new Date(tx.date).toDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
