import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { FiEdit2, FiSave, FiUser, FiCheckCircle } from "react-icons/fi";

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", phone: "", age: "", income: "", goal: "", dailyLimit: "" });
  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) return;
    setUser(u);
    const p = JSON.parse(localStorage.getItem(u.email));
    if (p) setProfile(p);
    else setEdit(true);
  }, []);

  function saveProfile() {
    localStorage.setItem(user.email, JSON.stringify(profile));
    setEdit(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Your name" },
    { key: "phone", label: "Phone", placeholder: "+91 ..." },
    { key: "age", label: "Age", placeholder: "Age" },
    { key: "income", label: "Monthly Income (₹)", placeholder: "e.g. 50000" },
    { key: "goal", label: "Savings Goal (₹)", placeholder: "e.g. 10000" },
    { key: "dailyLimit", label: "Daily Spending Limit (₹)", placeholder: "e.g. 1000" },
  ];

  const inputStyle = { width: "100%", padding: "12px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 14, outline: "none", transition: "border 0.2s" };

  if (!user) return <AppLayout><p style={{ color: "var(--text-muted)" }}>Loading...</p></AppLayout>;

  return (
    <AppLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "normal" }}>Profile</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>Manage your account and financial settings</p>
      </div>

      <div style={{ maxWidth: 580 }}>
        {/* Avatar card */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name || user.email}`} alt="avatar"
            style={{ width: 72, height: 72, borderRadius: "50%", border: "2px solid var(--border-glow)", background: "var(--bg-elevated)" }} />
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{profile.name || "Set your name"}</p>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>{user.email}</p>
          </div>
        </div>

        {/* Form/View */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700 }}>Financial Details</h3>
            {!edit && <button onClick={() => setEdit(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent-dim)", border: "1px solid var(--border-glow)", borderRadius: "var(--radius-sm)", padding: "8px 14px", color: "var(--accent)", fontSize: 13, fontWeight: 600 }}><FiEdit2 size={13} /> Edit</button>}
          </div>

          {!edit ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fields.map(f => (
                <div key={f.key} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{f.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{profile[f.key] || "—"}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{f.label}</label>
                  <input placeholder={f.placeholder} value={profile[f.key]} onChange={e => setProfile({ ...profile, [f.key]: e.target.value })} style={inputStyle}
                    onFocus={ev => ev.target.style.borderColor = "var(--border-glow)"}
                    onBlur={ev => ev.target.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}
              <button onClick={saveProfile} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "13px", background: "var(--accent)", border: "none", borderRadius: "var(--radius-sm)", color: "#060f0b", fontWeight: 700, fontSize: 15, marginTop: 8 }}>
                <FiSave size={15} /> {saved ? "Saved!" : "Save Profile"}
              </button>
            </div>
          )}
        </div>
      </div>
      {saved && (
        <div style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          background: "var(--bg-card)", border: "1px solid var(--border-glow)",
          padding: "32px 48px", borderRadius: "var(--radius-lg)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 9999,
          animation: "fadeIn 0.3s ease"
        }}>
          <FiCheckCircle size={48} color="var(--success)" />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Profile Saved!</span>
        </div>
      )}
    </AppLayout>
  );
}

export default Profile;