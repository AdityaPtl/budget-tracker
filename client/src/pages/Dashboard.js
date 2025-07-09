import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5050/api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    description: "",
    date: "",
    category: "",
    title: "",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const token = localStorage.getItem("token");

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setFormData({ ...formData, category: selected === "custom" ? "" : selected });
    setCustomCategory("");
  };

  const handleEdit = (tx) => {
    setFormData({
      amount: tx.amount,
      type: tx.type,
      description: tx.description,
      date: tx.date.slice(0, 10),
      category: tx.category,
      title: tx.title,
    });
    setEditingId(tx.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction", err);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = formData.category === "" && customCategory !== "" ? customCategory : formData.category;

    try {
      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/transactions/${editingId}`,
          { ...formData, category: finalCategory },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions((prev) =>
          prev.map((tx) => (tx.id === editingId ? { ...tx, ...formData, category: finalCategory } : tx))
        );
        setEditingId(null);
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/transactions`,
          { ...formData, category: finalCategory },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTransactions([res.data, ...transactions]);
      }

      setFormData({
        amount: "",
        type: "expense",
        description: "",
        date: "",
        category: "",
        title: "",
      });
      setCustomCategory("");
    } catch (err) {
      console.error("Failed to add/update transaction", err);
    }
  };

  const handleCSVUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;

    const data = new FormData();
    data.append("file", csvFile);

    try {
      const res = await axios.post(`${API_BASE_URL}/transactions/upload`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadMessage(res.data.message);
      const updated = await axios.get(`${API_BASE_URL}/transactions`, {
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
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Transactions</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 space-y-6">
          <form onSubmit={handleFormSubmit} className="space-y-4 bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{editingId ? "Edit" : "Add"} Transaction</h2>
            <input type="number" name="amount" placeholder="Amount" value={formData.amount} onChange={handleInputChange} required className="w-full p-2 border rounded" />
            <select name="type" value={formData.type} onChange={handleInputChange} className="w-full p-2 border rounded">
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded" />
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full p-2 border rounded" />
            <select value={formData.category || ""} onChange={handleCategoryChange} className="w-full p-2 border rounded">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="custom">Custom</option>
            </select>
            {formData.category === "" && (
              <input type="text" placeholder="Custom Category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="w-full p-2 border rounded" />
            )}
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              {editingId ? "Update Transaction" : "Add Transaction"}
            </button>
          </form>

          <form onSubmit={handleCSVUpload} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">Upload CSV</h2>
            <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} className="mb-2" />
            <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700">
              Upload
            </button>
            {uploadMessage && <p className="mt-2 text-sm text-gray-600">{uploadMessage}</p>}
          </form>
        </div>

        <div className="lg:w-1/2 h-[600px] overflow-y-auto space-y-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-white p-4 shadow rounded border-l-4" style={{ borderColor: tx.type === "income" ? "green" : "red" }}>
              <p className="font-bold">${parseFloat(tx.amount).toFixed(2)} - {tx.category} - {tx.title}</p>
              <p className="text-sm text-gray-600">{tx.description}</p>
              <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
              <div className="mt-2">
                <button onClick={() => handleEdit(tx)} className="text-blue-600 hover:underline mr-4">Edit</button>
                <button onClick={() => handleDelete(tx.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;