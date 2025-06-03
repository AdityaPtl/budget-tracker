import { useEffect, useState } from "react";
import axios from "axios";

function Data() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        setError("Failed to load data");
      }
    };

    fetchData();
  }, [token]);

  const income = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const expenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Spending Summary</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="bg-white shadow p-6 rounded mb-6">
        <p className="text-lg">
          <strong>Total Income:</strong> ${income.toFixed(2)}
        </p>
        <p className="text-lg text-red-600">
          <strong>Total Expenses:</strong> ${expenses.toFixed(2)}
        </p>
        <p className="text-lg mt-4">
          <strong>Net:</strong> ${(income - expenses).toFixed(2)}
        </p>
      </div>

      <h2 className="text-xl font-semibold mb-2">All Transactions</h2>
      <ul className="space-y-3">
        {transactions.map((tx) => (
          <li
            key={tx.id}
            className="border p-3 rounded shadow flex justify-between"
          >
            <div>
              <p className="font-medium">{tx.category}</p>
              <p className="text-sm text-gray-500">{tx.description}</p>
            </div>
            <div className="text-right">
              <p className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                {tx.type === "income" ? "+" : "-"}${parseFloat(tx.amount).toFixed(2)}
              </p>
              <p className="text-xs text-gray-400">{new Date(tx.date).toDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Data;
