import Sidebar from "./Sidebar";
import { FiZap, FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function AppLayout({ children }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="app-layout">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "8px",
            background: "var(--accent)", display: "flex", alignItems: "center",
            justifyContent: "center", color: "#000", fontSize: 16
          }}><FiZap /></div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.5px" }}>SmartSpend<span style={{ color: "var(--accent)" }}>+</span></span>
        </div>
        <div className="mobile-header-actions">
          <button onClick={toggleTheme} className="mobile-icon-btn">
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <button onClick={logout} className="mobile-icon-btn">
            <FiLogOut size={20} />
          </button>
        </div>
      </header>

      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default AppLayout;