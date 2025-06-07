import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    description: "",
    date: "",
    category: "",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:5050/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        setError("Failed to fetch transactions");
      }
    };

    fetchTransactions();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setFormData({ ...formData, category: selected === "custom" ? "" : selected });
    setCustomCategory("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = formData.category === "" && customCategory !== "" ? customCategory : formData.category;
    try {
      const res = await axios.post("http://localhost:5050/api/transactions", { ...formData, category: finalCategory }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions([res.data, ...transactions]);
      setFormData({ amount: "", type: "expense", category: "", description: "", date: "" });
      setCustomCategory("");
    } catch (err) {
      console.error("Failed to add transaction", err);
    }
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    const data = new FormData();
    data.append("file", csvFile);

    try {
      const res = await axios.post("http://localhost:5050/api/transactions/upload", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadMessage(res.data.message);
      const updated = await axios.get("http://localhost:5050/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(updated.data);
    } catch (err) {
      console.error("Upload failed", err);
      setUploadMessage("Upload failed");
    }
  };

  const categories = ["Food", "Transport", "Bills", "Groceries", "Entertainment", "Other"];

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">

      <h1 className="text-3xl font-bold mb-6 text-center">Your Transactions</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex gap-6">
        {/* LEFT COLUMN */}
        <div className="w-1/3 space-y-6">
          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Value"
                  className="p-2 border rounded w-full"
                  required
                />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="p-2 border rounded w-full"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <select
                name="category"
                onChange={handleCategoryChange}
                value={formData.category || (customCategory ? "custom" : "")}
                className="p-2 border rounded w-full mb-2"
              >
                <option value="">-- Select a category --</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="custom">Custom</option>
              </select>

              {formData.category === "" && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="p-2 border rounded w-full mb-2"
                />
              )}

              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="p-2 border rounded w-full mb-2"
              />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="p-2 border rounded w-full mb-2"
                required
              />

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
              >
                Add Transaction
              </button>
            </form>
          </div>

          <div className="bg-gray-50 p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Upload CSV</h2>
            <form onSubmit={handleCSVUpload}>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="mb-2"
              />
              <button
                type="submit"
                className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700"
              >
                Upload
              </button>
              {uploadMessage && <p className="text-green-600 mt-2">{uploadMessage}</p>}
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-2/3 max-h-[600px] overflow-y-auto space-y-4 bg-gray-50 p-4 rounded shadow-inner">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white p-4 shadow rounded border-l-4"
              style={{ borderColor: tx.type === "income" ? "green" : "red" }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{tx.category}</h3>
                  <p className="text-gray-500 text-sm">{tx.description}</p>
                  <p className="text-gray-400 text-xs">{new Date(tx.date).toDateString()}</p>
                </div>
                <p className="text-black font-semibold">
                  {tx.type === "expense" ? "-" : "+"}${parseFloat(tx.amount).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
