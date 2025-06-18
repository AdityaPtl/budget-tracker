import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#a29bfe",
  "#ff6b6b",
  "#00cec9",
  "#fdcb6e",
  "#55efc4",
  "#d63031",
];

const FREQUENCY_FACTORS = {
  weekly: 52,
  fortnightly: 26,
  monthly: 12,
  quarterly: 4,
  annually: 1,
};

const categories = {
  Income: ["Wages", "Government Benefits", "Other Income"],
  "Home and Utilities": ["Mortgage/Rent", "Electricity", "Water", "Gas", "Phone/Internet", "Other Utilities"],
  Groceries: ["Supermarket", "Other Groceries"],
  "Transport and Auto": ["Public Transport", "Fuel", "Car Maintenance", "Registration/Insurance"],
  "Entertainment and Eat Out": ["Dining Out", "Movies/Shows", "Hobbies"],
  "Personal and Medical": ["Medical", "Insurance", "Fitness", "Subscriptions"],
  "Insurance and Financial": ["Health Insurance", "Car Insurance", "Other Insurance", "Loan Repayments"]
};

const BudgetPlanner = () => {
  const [inputs, setInputs] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  const handleChange = (category, subCategory, field, value) => {
    setInputs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subCategory]: {
          ...(prev[category]?.[subCategory] || {}),
          [field]: value,
        },
      },
    }));
  };

  const calculateAnnual = (amount, frequency) => {
    const freq = frequency || "monthly";
    return parseFloat(amount || 0) * FREQUENCY_FACTORS[freq];
  };

  const calculateTotals = () => {
    let income = 0,
      expenses = 0;
    Object.keys(inputs).forEach((category) => {
      Object.keys(inputs[category] || {}).forEach((subCategory) => {
        const value = parseFloat(inputs[category][subCategory]?.amount || 0);
        const frequency = inputs[category][subCategory]?.frequency || "monthly";
        const annual = calculateAnnual(value, frequency);
        if (category === "Income") income += annual;
        else expenses += annual;
      });
    });
    return { income, expenses, net: income - expenses };
  };

  const getPieData = () => {
    const pie = {};
    Object.keys(inputs).forEach((category) => {
      if (category !== "Income") {
        Object.keys(inputs[category] || {}).forEach((subCategory) => {
          const value = parseFloat(inputs[category][subCategory]?.amount || 0);
          const frequency = inputs[category][subCategory]?.frequency || "monthly";
          const annual = calculateAnnual(value, frequency);
          if (!pie[category]) pie[category] = 0;
          pie[category] += annual;
        });
      }
    });
    return Object.entries(pie).map(([name, value]) => ({ name, value }));
  };

  const { income, expenses, net } = calculateTotals();
  const pieData = getPieData();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Budget Planner</h1>

      {Object.entries(categories).map(([category, subCategories]) => (
        <div
          key={category}
          className="bg-white rounded-2xl shadow p-4 mb-4 border border-gray-200"
        >
          <button
            className="w-full text-left font-semibold text-lg text-blue-700"
            onClick={() =>
              setExpandedSections((prev) => ({
                ...prev,
                [category]: !prev[category],
              }))
            }
          >
            {category}
          </button>
          {expandedSections[category] && (
            <div className="mt-2 space-y-2">
              {subCategories.map((subCategory) => (
                <div key={subCategory} className="flex flex-col md:flex-row md:items-center gap-2">
                  <label className="w-48 font-medium">{subCategory}</label>
                  <input
                    type="number"
                    placeholder="Amount"
                    className="border p-2 rounded w-32"
                    value={inputs[category]?.[subCategory]?.amount || ""}
                    onChange={(e) =>
                      handleChange(category, subCategory, "amount", e.target.value)
                    }
                  />
                  <select
                    className="border p-2 rounded"
                    value={inputs[category]?.[subCategory]?.frequency || "monthly"}
                    onChange={(e) =>
                      handleChange(category, subCategory, "frequency", e.target.value)
                    }
                  >
                    <option value="weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="bg-gray-50 rounded-xl shadow p-4 mt-6">
        <h2 className="text-xl font-semibold mb-2">Summary (Annualized)</h2>
        <p className="text-green-700 font-medium">Total Income: ${income.toLocaleString()}</p>
        <p className="text-red-600 font-medium">Total Expenses: ${expenses.toLocaleString()}</p>
        <p className="font-bold">Net: ${net.toLocaleString()}</p>
      </div>

      {pieData.length > 0 && (
        <div className="bg-white mt-6 p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2 text-center">Expense Breakdown</h2>
          <div className="flex justify-center">
            <PieChart width={320} height={280}>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPlanner;
