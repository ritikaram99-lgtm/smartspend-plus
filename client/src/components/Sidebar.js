import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiPieChart, FiDollarSign, FiBarChart2, FiUser, FiLogOut, FiZap, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/home", icon: <FiHome />, label: "Home" },
  { to: "/dashboard", icon: <FiPieChart />, label: "Dashboard" },
  { to: "/expenses", icon: <FiDollarSign />, label: "Expenses" },
  { to: "/reports", icon: <FiBarChart2 />, label: "Reports" },
  { to: "/profile", icon: <FiUser />, label: "Profile" },
];

function Sidebar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo-container">
        <div style={{
          width: 36, height: 36, borderRadius: "10px",
          background: "var(--accent)", display: "flex", alignItems: "center",
          justifyContent: "center", color: "#000", fontSize: 18
        }}><FiZap /></div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.5px" }}>SmartSpend<span style={{ color: "var(--accent)" }}>+</span></span>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {links.map(l => (
          <NavLink key={l.to} to={l.to} className="sidebar-link" style={({ isActive }) => ({
            background: isActive ? "var(--accent-dim)" : "transparent",
            color: isActive ? "var(--accent)" : "var(--text-secondary)",
            border: isActive ? "1px solid var(--border-glow)" : "1px solid transparent"
          })}>
            <span style={{ fontSize: 17 }}>{l.icon}</span>
            <span className="sidebar-link-text">{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <button onClick={toggleTheme} className="sidebar-theme-btn" style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "11px 14px", borderRadius: "var(--radius-sm)",
        background: "transparent", border: "1px solid transparent",
        color: "var(--text-muted)", fontSize: 14, fontWeight: 500,
        transition: "all 0.2s", width: "100%", marginBottom: "8px"
      }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "var(--bg-elevated)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
      >
        {theme === "dark" ? <FiSun style={{ fontSize: 17 }} /> : <FiMoon style={{ fontSize: 17 }} />}
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Logout */}
      <button onClick={logout} className="sidebar-logout-btn" style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "11px 14px", borderRadius: "var(--radius-sm)",
        background: "transparent", border: "1px solid transparent",
        color: "var(--text-muted)", fontSize: 14, fontWeight: 500,
        transition: "all 0.2s", width: "100%"
      }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--danger)"; e.currentTarget.style.background = "rgba(248,113,113,0.08)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
      >
        <FiLogOut style={{ fontSize: 17 }} /> Sign Out
      </button>
    </aside>
  );
}

export default Sidebar;