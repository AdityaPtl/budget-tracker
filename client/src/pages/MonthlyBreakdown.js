import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5050/api";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a29bfe", "#ff6b6b", "#00cec9"];

function MonthlyBreakdown() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched transactions:", res.data);
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
        setError("Failed to load transactions.");
      }
    };

    fetchTransactions();
  }, [token]);

  const groupByMonth = (data) => {
    return data.reduce((acc, tx) => {
      const date = new Date(tx.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(tx);
      return acc;
    }, {});
  };

  const getCategoryTotals = (transactions) => {
    const totals = {};
    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        if (!totals[tx.category]) totals[tx.category] = 0;
        totals[tx.category] += parseFloat(tx.amount);
      }
    });
    return Object.entries(totals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  const monthlyGroups = groupByMonth(transactions);
  const sortedMonths = Object.keys(monthlyGroups).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Monthly Breakdown</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {sortedMonths.length === 0 && (
        <p className="text-center text-gray-500">No transactions found.</p>
      )}

      {sortedMonths.map((month) => {
        const monthTx = monthlyGroups[month];
        const income = monthTx
          .filter((tx) => tx.type === "income")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
        const expenses = monthTx
          .filter((tx) => tx.type === "expense")
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
        const net = income - expenses;
        const pieData = getCategoryTotals(monthTx);

        console.log("pieData", pieData);
        console.log("income", income, "expenses", expenses);
        console.log("monthTx", monthTx);

        return (
          <div key={month} className="bg-white shadow rounded p-4 mb-8">
            <h2 className="text-xl font-semibold mb-2">{month}</h2>
            <p className="text-green-700 font-medium">Income: ${income.toFixed(2)}</p>
            <p className="text-red-600 font-medium">Expenses: ${expenses.toFixed(2)}</p>
            <p className="font-bold mb-4">Net: ${net.toFixed(2)}</p>

            {pieData.length > 0 && (
              <div className="flex justify-center">
                <PieChart width={320} height={240}>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    //label
                  >
                    {pieData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default MonthlyBreakdown;
