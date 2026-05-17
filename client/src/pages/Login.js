import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiZap, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";

const Field = ({ icon, type, placeholder, value, onChange, onKeyDown, extra }) => (
  <div style={{ position: "relative", marginBottom: 16 }}>
    <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 16 }}>{icon}</span>
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      onKeyDown={onKeyDown}
      style={{
        width: "100%", padding: "14px 44px 14px 46px", background: "var(--bg-elevated)",
        border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
        color: "var(--text-primary)", fontSize: 14, outline: "none", transition: "border 0.2s"
      }}
      onFocus={e => e.target.style.borderColor = "var(--border-glow)"}
      onBlur={e => e.target.style.borderColor = "var(--border)"}
    />
    {extra && <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", cursor: "pointer" }} onClick={extra.onClick}>{extra.icon}</span>}
  </div>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {

    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {

      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home");

    } catch (error) {

      console.log(error);

      setError(
        error.response?.data?.message || "Login failed"
      );
    }
  }



  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-void)", padding: 20 }}>
      {/* Ambient glow */}
      <div style={{ position: "fixed", top: "30%", left: "50%", transform: "translateX(-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,211,183,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "48px 40px", boxShadow: "var(--shadow-card)" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 48, height: 48, background: "var(--accent)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: 22, margin: "0 auto 16px" }}><FiZap /></div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, letterSpacing: "normal" }}>Welcome back</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 6 }}>Sign in to your SmartSpend+ account</p>
        </div>

        {error && (
          <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: "var(--radius-sm)", padding: "12px 16px", color: "var(--danger)", fontSize: 13, marginBottom: 20 }}>
            {error}
          </div>
        )}

        <Field icon={<FiMail />} type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        <Field icon={<FiLock />} type={showPass ? "text" : "password"} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
          extra={{ icon: showPass ? <FiEyeOff /> : <FiEye />, onClick: () => setShowPass(!showPass) }}
        />

        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: "14px", background: "var(--accent)", border: "none",
          borderRadius: "var(--radius-sm)", color: "#060f0b", fontWeight: 700, fontSize: 15,
          marginTop: 8, letterSpacing: "-0.2px", transition: "all 0.2s",
          opacity: loading ? 0.7 : 1
        }}
          onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,211,183,0.3)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
        >
          {loading ? "Signing in..." : <>Sign in <FiArrowRight style={{ verticalAlign: -2 }} /></>}
        </button>

        <p style={{ textAlign: "center", marginTop: 28, color: "var(--text-secondary)", fontSize: 14 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;