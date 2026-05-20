import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { FiArrowRight, FiActivity, FiCalendar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Home() {
  const [todaySpend, setTodaySpend] = useState(0);
  const [monthSpend, setMonthSpend] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [name, setName] = useState("there");
  const [tip, setTip] = useState("Add your first expense to get smart insights.");
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    async function fetchData() {
      try {
        // Fetch profile and expenses in parallel
        const [profileRes, expensesRes] = await Promise.all([
          api.get("/api/profile").catch(() => ({ data: {} })),
          api.get("/api/expenses"),
        ]);

        const profile = profileRes.data || {};
        const income = parseInt(profile.income) || 0;
        const expenses = expensesRes.data;

        // Use profile name, fallback to email prefix
        setName(profile.name || user.email.split("@")[0]);

        // Today's date in YYYY-MM-DD using local time (not UTC, avoids timezone bug)
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        const cm = now.getMonth();
        const cy = now.getFullYear();

        let td = 0, mt = 0;
        expenses.forEach(e => {
          const amt = Number(e.amount);
          const d = new Date(e.date);
          if (d.getMonth() === cm && d.getFullYear() === cy) mt += amt;
          // Compare using local date string
          const expDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          if (expDateStr === todayStr) td += amt;
        });

        setTodaySpend(td);
        setMonthSpend(mt);
        setRemaining(income - mt);
        setRecent([...expenses].reverse().slice(0, 5));

        // Smart tip
        if (expenses.length > 0) {
          const cats = {};
          expenses.forEach(e => {
            cats[e.category] = (cats[e.category] || 0) + Number(e.amount);
          });
          const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
          setTip(`You spend the most on ${top[0]}. Consider setting a ₹${Math.round(top[1] * 0.8).toLocaleString()} monthly cap.`);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const catColors = { Food: "#f59e0b", Travel: "#3b82f6", Entertainment: "#ec4899", Bills: "#8b5cf6", Shopping: "#06b6d4" };
  const catEmoji = { Food: "🍔", Travel: "✈️", Entertainment: "🎬", Bills: "📄", Shopping: "🛍️" };

  const StatCard = ({ label, value, sub, color = "var(--accent)" }) => (
    <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px 24px", flex: 1 }}>
      <p style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 12 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color, letterSpacing: "-1px" }}>
        ₹{Number(value).toLocaleString()}
      </p>
      {sub && <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 6 }}>{sub}</p>}
    </div>
  );

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 6 }}>Good {greeting} 👋</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 38, fontWeight: 800, letterSpacing: "normal" }}>
          {loading ? "Loading..." : name}
        </h1>
      </div>

      {/* Stats */}
      <div className="flex-col-mobile" style={{ display: "flex", gap: 20, marginBottom: 28 }}>
        <StatCard label="Today's Spending" value={todaySpend} sub="logged today" />
        <StatCard label="This Month" value={monthSpend} sub="total tracked" color="var(--warning)" />
        <StatCard label="Remaining Savings" value={remaining} sub="from income" color={remaining < 0 ? "var(--danger)" : "var(--success)"} />
      </div>

      {/* Tip + Recent */}
      <div className="home-grid">
        {/* Tip */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-glow)", borderRadius: "var(--radius-lg)", padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <FiActivity color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: 14 }}>Smart Insight</span>
          </div>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>💡 {tip}</p>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              marginTop: 20, display: "flex", alignItems: "center", gap: 6,
              background: "var(--accent-dim)", border: "1px solid var(--border-glow)",
              borderRadius: "var(--radius-sm)", padding: "9px 16px",
              color: "var(--accent)", fontSize: 13, fontWeight: 600,
            }}
          >
            View Dashboard <FiArrowRight size={13} />
          </button>
        </div>

        {/* Recent Expenses */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <FiCalendar color="var(--accent)" size={15} /> Recent Expenses
            </span>
            <button
              onClick={() => navigate("/expenses")}
              style={{ background: "none", border: "none", color: "var(--accent)", fontSize: 13, padding: 0, display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}
            >
              View all <FiArrowRight size={12} />
            </button>
          </div>

          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", paddingTop: 20 }}>Loading...</p>
          ) : recent.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", paddingTop: 20 }}>
              No expenses yet.{" "}
              <span style={{ color: "var(--accent)", cursor: "pointer" }} onClick={() => navigate("/expenses")}>
                Add one →
              </span>
            </p>
          ) : (
            recent.map((e, i) => (
              <div
                key={e._id || i}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10, background: "rgba(99,211,183,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  }}>
                    {catEmoji[e.category] || "💸"}
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500 }}>{e.category}</p>
                    <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {e.date ? e.date.split("T")[0] : "—"}
                    </p>
                  </div>
                </div>
                <p style={{ fontWeight: 600, fontSize: 14, color: catColors[e.category] || "var(--text-primary)" }}>
                  -₹{Number(e.amount).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default Home;
