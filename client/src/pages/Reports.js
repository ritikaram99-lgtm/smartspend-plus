import { useState, useEffect } from "react";
import axios from "axios";
import AppLayout from "../components/AppLayout";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const chartOpts = { plugins: { legend: { labels: { color: "#8892a4", font: { size: 12 } } } }, scales: { x: { ticks: { color: "#8892a4" }, grid: { color: "rgba(255,255,255,0.04)" } }, y: { ticks: { color: "#8892a4" }, grid: { color: "rgba(255,255,255,0.04)" } } } };

function Reports() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [total, setTotal] = useState(0);
  const [lineData, setLineData] = useState({});
  const [barData, setBarData] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;
    
    async function fetchExpenses() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://smartspend-backend-wb27.onrender.com/api/expenses", {
          headers: { authorization: token },
        });
        const expenses = res.data;
        
        let monthTotal = 0;
        const monthly = Array(12).fill(0);
        const cats = {};
        expenses.forEach(e => {
          const d = new Date(e.date), amt = parseInt(e.amount);
          monthly[d.getMonth()] += amt;
          cats[e.category] = (cats[e.category] || 0) + amt;
          if (d.getMonth() === parseInt(month)) monthTotal += amt;
        });
        setTotal(monthTotal);
        setLineData({ labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], datasets: [{ label: "Monthly Spending", data: monthly, borderColor: "#63d3b7", backgroundColor: "rgba(99,211,183,0.08)", tension: 0.4, pointBackgroundColor: "#63d3b7" }] });
        setBarData({ labels: Object.keys(cats), datasets: [{ label: "Category Spending", data: Object.values(cats), backgroundColor: ["#63d3b7","#3b82f6","#f59e0b","#ec4899","#8b5cf6"], borderRadius: 8 }] });
      } catch (error) {
        console.error(error);
      }
    }
    fetchExpenses();
  }, [month]);

  return (
    <AppLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "normal" }}>Reports</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>Analyze your spending over time</p>
      </div>

      {/* Month selector */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
        <select value={month} onChange={e => setMonth(e.target.value)} style={{ padding: "10px 16px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 14 }}>
          {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
        </select>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "10px 20px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>Total: </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent)", fontSize: 18 }}>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📈 Monthly Trend</h3>
          {lineData.labels && <Line data={lineData} options={chartOpts} />}
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 20 }}>📊 By Category</h3>
          {barData.labels && <Bar data={barData} options={chartOpts} />}
        </div>
      </div>
    </AppLayout>
  );
}

export default Reports;