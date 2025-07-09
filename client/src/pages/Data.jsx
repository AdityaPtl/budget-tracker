import { useEffect, useState } from "react";
import axios from "axios";

function Data() {
  const [transactions, setTransactions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5050/api";

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        setError("Failed to fetch transactions");
      }
    };

    fetchTransactions();
  }, [token]);

  const uniqueCategories = [
    "All",
    ...new Set(transactions.map((tx) => tx.category)),
  ];

  const filteredTransactions =
    categoryFilter === "All"
      ? transactions
      : transactions.filter((tx) => tx.category === categoryFilter);

  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  return (
    <div className="max-w-2xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Data</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Spending Summary</h2>
        <div className="bg-white shadow-md p-4 rounded inline-block text-left">
          <p className="text-lg font-semibold text-green-700">
            Total Income: ${totalIncome.toFixed(2)}
          </p>
          <p className="text-lg font-semibold text-red-600">
            Total Expenses: ${totalExpenses.toFixed(2)}
          </p>
          <p className="text-lg font-bold mt-2">
            Net: ${(totalIncome - totalExpenses).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="category" className="block font-semibold mb-1">
          Filter by Category:
        </label>
        <select
          id="category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="p-2 border rounded"
        >
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="bg-white p-4 shadow rounded border-l-4"
            style={{ borderColor: tx.type === "income" ? "green" : "red" }}
          >
            <p className="font-bold">
              ${parseFloat(tx.amount).toFixed(2)} - {tx.category}
            </p>
            <p className="text-sm text-gray-600">{tx.description}</p>
            <p className="text-xs text-gray-500">
              {new Date(tx.date).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Data;
