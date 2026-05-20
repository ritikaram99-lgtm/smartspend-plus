import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { FiTrendingUp, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import api from "../api";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [income, setIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [savings, setSavings] = useState(0);
  const [score, setScore] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch profile from backend and expenses in parallel
        const [profileRes, expensesRes] = await Promise.all([
          api.get("/api/profile").catch(() => ({ data: {} })),
          api.get("/api/expenses"),
        ]);

        const profile = profileRes.data || {};
        const incomeVal = parseInt(profile.income) || 0;
        const expenses = expensesRes.data;

        let total = 0, categories = {};
        expenses.forEach(e => {
          const amt = Number(e.amount);
          total += amt;
          categories[e.category] = (categories[e.category] || 0) + amt;
        });

        const rem = incomeVal - total;

        // Score calculation
        let sc = 50;
        if (incomeVal > 0) {
          if (rem > incomeVal * 0.3) sc = 90;
          else if (rem > incomeVal * 0.2) sc = 75;
          else if (rem < 0) sc = 20;
        }

        // Insight text
        let ins = "";
        if (incomeVal === 0) {
          ins = "💡 Set your monthly income in Profile to see savings insights.";
        } else if (total > incomeVal * 0.8) {
          ins = "⚠️ You are spending too much this month. Try to cut back. ";
        } else if (rem > incomeVal * 0.3) {
          ins = "🎉 Great savings rate this month! Keep it up. ";
        } else {
          ins = "👍 Your spending is balanced. ";
        }

        const maxCat = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];
        if (maxCat) ins += `💡 You spend most on ${maxCat[0]} (₹${maxCat[1].toLocaleString()}).`;

        setInsight(ins);
        setIncome(incomeVal);
        setTotalExpense(total);
        setSavings(rem);
        setScore(sc);
        setCategoryData(categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const savingsPct = income > 0 ? Math.max(0, Math.min(100, (savings / income) * 100)) : 0;

  const pieData = {
    labels: Object.keys(categoryData),
    datasets: [{
      data: Object.values(categoryData),
      backgroundColor: ["#63d3b7", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"],
      borderWidth: 0,
    }],
  };

  const StatCard = ({ label, value, prefix = "₹", color = "var(--text-primary)" }) => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
      <p style={{ color: "var(--text-secondary)", fontSize: 12, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color, letterSpacing: "-1px" }}>
        {prefix}{Number(value).toLocaleString()}
      </p>
    </div>
  );

  return (
    <AppLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "normal" }}>
          Financial Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>Your complete financial overview</p>
      </div>

      {/* Score banner */}
      <div style={{
        background: "linear-gradient(135deg, var(--bg-card) 0%, rgba(99,211,183,0.05) 100%)",
        border: "1px solid var(--border-glow)", borderRadius: "var(--radius-lg)",
        padding: "24px 28px", marginBottom: 24,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 4 }}>Financial Health Score</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: 52, fontWeight: 800, letterSpacing: "-2px",
              color: score >= 75 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--danger)",
            }}>
              {loading ? "—" : score}
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: 18 }}>/100</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          {score >= 75
            ? <FiCheckCircle size={40} color="var(--success)" />
            : score >= 50
              ? <FiTrendingUp size={40} color="var(--warning)" />
              : <FiAlertCircle size={40} color="var(--danger)" />
          }
          <p style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 6 }}>
            {score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Needs Attention"}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <StatCard label="Monthly Income" value={income} />
        <StatCard label="Total Expenses" value={totalExpense} color="var(--warning)" />
        <StatCard label="Savings" value={savings} color={savings < 0 ? "var(--danger)" : "var(--success)"} />
      </div>

      {/* Savings progress */}
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Savings Rate</span>
          <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>{savingsPct.toFixed(1)}%</span>
        </div>
        <div style={{ background: "var(--bg-elevated)", borderRadius: 100, height: 8, overflow: "hidden" }}>
          <div style={{
            width: `${savingsPct}%`, height: "100%",
            background: "linear-gradient(90deg, var(--accent), #3b82f6)",
            borderRadius: 100, transition: "width 1s ease",
          }} />
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 8 }}>
          {income === 0
            ? "Set your income in Profile to track savings rate."
            : "Target: save 30% or more of your income each month."}
        </p>
      </div>

      {/* Insight + Chart */}
      <div className="two-col-grid">
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🧠 Smart Insights</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8 }}>
            {loading ? "Loading..." : insight || "Add expenses to see personalized insights."}
          </p>
        </div>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Expense Breakdown</h3>
          {!loading && Object.keys(categoryData).length > 0 ? (
            <div style={{ maxWidth: 220, margin: "0 auto" }}>
              <Pie
                data={pieData}
                options={{ plugins: { legend: { labels: { color: "#8892a4", font: { size: 12 } } } } }}
              />
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", textAlign: "center", paddingTop: 30, fontSize: 14 }}>
              {loading ? "Loading..." : "No expense data yet"}
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
