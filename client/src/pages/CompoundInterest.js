import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function CompoundInterest() {
  const [initialDeposit, setInitialDeposit] = useState("1000");
  const [regularDeposit, setRegularDeposit] = useState("200");
  const [interestRate, setInterestRate] = useState("5");
  const [years, setYears] = useState("10");
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
    const iDep = parseFloat(initialDeposit) || 0;
    const rDep = parseFloat(regularDeposit) || 0;
    const rate = parseFloat(interestRate) || 0;
    const yrs = parseFloat(years) || 0;

    const compoundPerYear = compoundFrequency === "Monthly" ? 12 : 1;
    const depositPerYear = frequencyToMonths[depositFrequency];
    const r = rate / 100 / compoundPerYear;

    let data = [];

    for (let i = 1; i <= yrs; i++) {
      const yearDeposit = rDep * depositPerYear * i;
      const base = iDep + yearDeposit;
      const fv = base * Math.pow(1 + r, compoundPerYear * i);
      const yearInterest = fv - base;

      data.push({
        name: `${i}`,
        initial: iDep,
        deposit: yearDeposit,
        interest: yearInterest,
      });
    }

    setChartData(data);
  };

  useEffect(() => {
    handleCalculate();
  }, []);

  const iDep = parseFloat(initialDeposit) || 0;
  const rDep = parseFloat(regularDeposit) || 0;
  const yrs = parseFloat(years) || 0;
  const totalContributions = iDep + rDep * frequencyToMonths[depositFrequency] * yrs;

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
            onChange={(e) => setInitialDeposit(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Regular Deposit</label>
          <input
            type="number"
            value={regularDeposit}
            onChange={(e) => setRegularDeposit(e.target.value)}
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
            onChange={(e) => setYears(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Annual Interest Rate (%)</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
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
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
                <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                <Tooltip
                  content={({ payload, label }) => {
                    if (!payload || !payload.length) return null;
                    const data = payload[0].payload;
                    const total = data.initial + data.deposit + data.interest;
                    return (
                      <div className="bg-white p-3 rounded shadow border text-sm">
                        <p className="font-semibold mb-1">Year {label}</p>
                        <p className="text-orange-500">Initial Deposit : ${data.initial.toLocaleString()}</p>
                        <p className="text-orange-600">Regular Deposits : ${data.deposit.toLocaleString()}</p>
                        <p className="text-red-700">Interest Earned : ${data.interest.toLocaleString()}</p>
                        <hr className="my-1" />
                        <p className="font-bold">Total: ${total.toLocaleString()}</p>
                      </div>
                    );
                  }}
                />
                <Legend />
                <Bar dataKey="initial" stackId="a" fill="#f97316" name="Initial Deposit" />
                <Bar dataKey="deposit" stackId="a" fill="#ea580c" name="Regular Deposits" />
                <Bar dataKey="interest" stackId="a" fill="#991b1b" name="Interest Earned" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded shadow text-lg">
            <h2 className="text-xl font-semibold mb-4">Your strategy:</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm bg-orange-500"></div>
                  <span>Initial deposit:</span>
                </div>
                <span className="font-semibold">${iDep.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-sm bg-orange-600"></div>
                  <span>Regular deposits:</span>
                </div>
                <span className="font-semibold">${(totalContributions - iDep).toLocaleString()}</span>
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
