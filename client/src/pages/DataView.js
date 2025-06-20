import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5050/api";

function DataView() {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Transaction Data Table</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="py-2 px-4 border">ID</th>
              <th className="py-2 px-4 border">Type</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Description</th>
              <th className="py-2 px-4 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">{tx.id}</td>
                <td className="py-2 px-4 border">{tx.type}</td>
                <td className="py-2 px-4 border">{tx.category}</td>
                <td className="py-2 px-4 border">${parseFloat(tx.amount).toFixed(2)}</td>
                <td className="py-2 px-4 border">{tx.description}</td>
                <td className="py-2 px-4 border">{new Date(tx.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataView;
