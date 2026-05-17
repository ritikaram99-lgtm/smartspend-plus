import { useNavigate } from "react-router-dom";
import { FiZap, FiArrowRight, FiShield, FiTrendingUp, FiPieChart, FiCheckCircle, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const features = [
  { icon: <FiTrendingUp />, title: "Smart Tracking", desc: "Log and categorize every rupee with intelligent auto-categorization and real-time sync." },
  { icon: <FiPieChart />, title: "Deep Analytics", desc: "Interactive charts and monthly breakdowns reveal your true spending patterns at a glance." },
  { icon: <FiShield />, title: "Savings Goals", desc: "Set targets, track progress, and get nudged when you're drifting off your financial plan." },
];

const stats = [
  { value: "₹2.4Cr+", label: "Expenses Tracked" },
  { value: "18,000+", label: "Active Users" },
  { value: "94%", label: "Hit Savings Goals" },
  { value: "4.9★", label: "User Rating" },
];

const testimonials = [
  { name: "Priya S.", role: "Freelancer", text: "SmartSpend+ changed how I see money. I saved ₹40k in 3 months I didn't even know I was wasting." },
  { name: "Rohan M.", role: "Software Engineer", text: "The dashboard is gorgeous. Finally a finance app that doesn't look like a spreadsheet from 2005." },
  { name: "Ananya K.", role: "MBA Student", text: "Set my goal, followed the tips, and hit it. Simple. Effective. Beautiful." },
];

function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const Btn = ({ children, onClick, variant = "primary" }) => (
    <button onClick={onClick} style={{
      padding: "13px 28px", borderRadius: "50px", fontSize: 15, fontWeight: 600,
      border: variant === "primary" ? "none" : "1.5px solid var(--border-glow)",
      background: variant === "primary" ? "var(--accent)" : "transparent",
      color: variant === "primary" ? "#060f0b" : "var(--accent)",
      letterSpacing: "-0.2px", transition: "all 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,211,183,0.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
    >{children}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-void)" }}>
      {/* Navbar */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 60px", position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,12,20,0.8)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}><FiZap size={18} /></div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 19 }}>SmartSpend<span style={{ color: "var(--accent)" }}>+</span></span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleTheme} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 20, display: "flex", padding: 6, borderRadius: "50%", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color="var(--text-primary)"} onMouseLeave={e => e.currentTarget.style.color="var(--text-secondary)"}>
            {theme === "dark" ? <FiSun /> : <FiMoon />}
          </button>
          <Btn variant="ghost" onClick={() => navigate("/login")}>Log in</Btn>
          <Btn onClick={() => navigate("/signup")}>Get started <FiArrowRight style={{ verticalAlign: -2 }} /></Btn>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "120px 20px 80px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--accent-dim)", border: "1px solid var(--border-glow)",
          borderRadius: 50, padding: "6px 16px", fontSize: 13,
          color: "var(--accent)", marginBottom: 28, fontWeight: 500
        }}>
          <FiZap size={12} /> Fintech for the next generation
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(46px, 8vw, 84px)",
          fontWeight: 800, lineHeight: 1.05, letterSpacing: "normal",
          marginBottom: 24
        }}>
          Your money,<br />
          <span style={{ color: "var(--accent)" }}>finally under control.</span>
        </h1>
        <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Track expenses, understand your habits, and build lasting wealth — all in one beautifully designed dashboard.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn onClick={() => navigate("/signup")}>Start for free — it's free <FiArrowRight style={{ verticalAlign: -2 }} /></Btn>
          <Btn variant="ghost" onClick={() => navigate("/login")}>Sign in</Btn>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1,
        maxWidth: 900, margin: "0 auto 100px", borderRadius: "var(--radius-lg)",
        overflow: "hidden", border: "1px solid var(--border)", background: "var(--border)"
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "var(--bg-card)", padding: "32px 24px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--accent)", letterSpacing: "-1px" }}>{s.value}</p>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: "0 auto 100px", padding: "0 20px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, textAlign: "center", marginBottom: 56, letterSpacing: "normal" }}>
          Everything you need to <span style={{ color: "var(--accent)" }}>win financially</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "var(--bg-card)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)", padding: "36px 30px",
              transition: "all 0.3s"
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-glow)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontSize: 22, marginBottom: 20, border: "1px solid var(--border-glow)" }}>{f.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1100, margin: "0 auto 100px", padding: "0 20px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, fontWeight: 700, textAlign: "center", marginBottom: 56, letterSpacing: "normal" }}>Loved by <span style={{ color: "var(--accent)" }}>real users</span></h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "30px" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", fontWeight: 700, fontSize: 14, border: "1px solid var(--border-glow)" }}>{t.name[0]}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: 12 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "80px 20px 120px" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", maxWidth: 700, margin: "0 auto", padding: "64px 40px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 46, fontWeight: 800, letterSpacing: "normal", marginBottom: 16 }}>Ready to start?</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, marginBottom: 36 }}>Join thousands building better financial habits today.</p>
          <Btn onClick={() => navigate("/signup")}>Create free account <FiArrowRight style={{ verticalAlign: -2 }} /></Btn>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "32px 60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FiZap color="var(--accent)" />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}>SmartSpend+</span>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>© 2025 SmartSpend+. All rights reserved.</p>
        <div style={{ display: "flex", gap: 24 }}>
          {["Privacy", "Terms", "Contact"].map(x => (
            <span key={x} style={{ color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>{x}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;