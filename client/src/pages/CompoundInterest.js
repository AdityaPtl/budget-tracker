import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

function CompoundInterest() {
  const [initialDeposit, setInitialDeposit] = useState(0);
  const [regularDeposit, setRegularDeposit] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [years, setYears] = useState(0);
  const [compoundFrequency, setCompoundFrequency] = useState("Monthly");
  const [depositFrequency, setDepositFrequency] = useState("Monthly");
  const [chartData, setChartData] = useState([]);

  const frequencyToMonths = {
    Weekly: 12 * 4.33,
    Fortnightly: 12 * 2.17,
    Monthly: 12,
    Quarterly: 4,
    Annually: 1,
  };

  const handleCalculate = () => {
    const compoundPerYear = compoundFrequency === "Monthly" ? 12 : 1;
    const depositPerYear = frequencyToMonths[depositFrequency];

    const r = interestRate / 100 / compoundPerYear;
    const n = years * compoundPerYear;

    let total = initialDeposit;
    let data = [];
    let totalInterest = 0;
    let totalDeposits = initialDeposit;

    for (let i = 1; i <= years; i++) {
      let yearDeposit = regularDeposit * depositPerYear * i;
      let base = initialDeposit + regularDeposit * depositPerYear * i;
      let fv = base * Math.pow(1 + r, compoundPerYear * i);

      let yearInterest = fv - base;
      totalInterest = yearInterest;
      totalDeposits = initialDeposit + regularDeposit * depositPerYear * i;
      total = totalDeposits + totalInterest;

      data.push({
        name: `${i}`,
        initial: i === 1 ? initialDeposit : 0,
        deposit: regularDeposit * depositPerYear * i,
        interest: yearInterest,
      });
    }

    setChartData(data);
  };

  const totalContributions =
    initialDeposit +
    regularDeposit *
      frequencyToMonths[depositFrequency] *
      years;

  const futureValue =
    chartData.length > 0
      ? chartData[chartData.length - 1].initial +
        chartData[chartData.length - 1].deposit +
        chartData[chartData.length - 1].interest
      : 0;

  const interestEarned = futureValue - totalContributions;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Compound Interest Calculator</h1>
      <div className="bg-white p-6 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block mb-1 font-medium">Initial Deposit</label>
          <input
            type="number"
            value={initialDeposit}
            onChange={(e) => setInitialDeposit(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Regular Deposit</label>
          <input
            type="number"
            value={regularDeposit}
            onChange={(e) => setRegularDeposit(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Regular Deposit Frequency</label>
          <select
            value={depositFrequency}
            onChange={(e) => setDepositFrequency(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option>Weekly</option>
            <option>Fortnightly</option>
            <option>Monthly</option>
            <option>Quarterly</option>
            <option>Annually</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Compound Frequency</label>
          <select
            value={compoundFrequency}
            onChange={(e) => setCompoundFrequency(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option>Monthly</option>
            <option>Annually</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Number of Years</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Annual Interest Rate (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          onClick={handleCalculate}
          className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Calculate
        </button>
      </div>

      {chartData.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} className="mb-8">
              <XAxis dataKey="name" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
              <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <Tooltip
                formatter={(value, name) => [`$${value.toLocaleString()}`, name]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              <Bar dataKey="initial" stackId="a" fill="#f97316" name="Initial Deposit" />
              <Bar dataKey="deposit" stackId="a" fill="#ea580c" name="Regular Deposits" />
              <Bar dataKey="interest" stackId="a" fill="#991b1b" name="Interest Earned" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-8 bg-gray-50 p-6 rounded shadow text-lg">
            <h2 className="text-xl font-semibold mb-4">Your strategy:</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm bg-orange-500"></div>
                  <span>Initial deposit:</span>
                </div>
                <span className="font-semibold">${initialDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm bg-orange-600"></div>
                  <span>Regular deposits:</span>
                </div>
                <span className="font-semibold">${(totalContributions - initialDeposit).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm bg-red-600"></div>
                  <span>Total interest:</span>
                </div>
                <span className="font-semibold">${interestEarned.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t mt-4 font-bold text-lg">
                <span>Total savings:</span>
                <span>${futureValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CompoundInterest;
