import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { FiEdit2, FiSave, FiCheckCircle } from "react-icons/fi";
import api from "../api";

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: "", phone: "", age: "", income: "", goal: "", dailyLimit: "" });
  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let u = null;
    try {
      u = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
    if (!u || !u.email) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    setUser(u);

    async function fetchProfile() {
      try {
        const res = await api.get("/api/profile");
        if (res.data && Object.keys(res.data).length > 0) {
          setProfile(res.data);
        } else {
          // No profile yet — open edit mode automatically
          setEdit(true);
        }
      } catch (err) {
        console.error(err);
        // If API fails, try localStorage as fallback
        const local = localStorage.getItem(u.email);
        if (local) setProfile(JSON.parse(local));
        else setEdit(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function saveProfile() {
    setError("");
    setSaving(true);
    try {
      await api.post("/api/profile", profile);
      // Also save locally as a cache so Dashboard/Home load faster
      if (user) localStorage.setItem(user.email, JSON.stringify(profile));
      setEdit(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const fields = [
    { key: "name", label: "Full Name", placeholder: "Your name" },
    { key: "phone", label: "Phone", placeholder: "+91 ..." },
    { key: "age", label: "Age", placeholder: "Age" },
    { key: "income", label: "Monthly Income (₹)", placeholder: "e.g. 50000", type: "number" },
    { key: "goal", label: "Savings Goal (₹)", placeholder: "e.g. 10000", type: "number" },
    { key: "dailyLimit", label: "Daily Spending Limit (₹)", placeholder: "e.g. 1000", type: "number" },
  ];

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: "var(--bg-elevated)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)", fontSize: 14, outline: "none", transition: "border 0.2s",
  };

  if (!user) return (
    <AppLayout>
      <p style={{ color: "var(--text-muted)" }}>Loading...</p>
    </AppLayout>
  );

  return (
    <AppLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Profile</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>Manage your account and financial settings</p>
      </div>

      <div style={{ maxWidth: 580 }}>
        {/* Avatar card */}
        <div className="card" style={{
          marginBottom: 20, display: "flex", alignItems: "center", gap: 20,
        }}>
          <img
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${profile.name || user.email}`}
            alt="avatar"
            style={{ width: 72, height: 72, borderRadius: "50%", border: "2px solid var(--border-glow)", background: "var(--bg-elevated)" }}
          />
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>
              {loading ? "Loading..." : profile.name || "Set your name"}
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 2 }}>{user.email}</p>
          </div>
        </div>

        {/* Form / View */}
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 className="section-title">Financial Details</h3>
            {!edit && !loading && (
              <button
                onClick={() => setEdit(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "var(--accent-dim)", border: "1px solid var(--border-glow)",
                  borderRadius: "var(--radius-sm)", padding: "8px 14px",
                  color: "var(--accent)", fontSize: 13, fontWeight: 600,
                }}
              >
                <FiEdit2 size={13} /> Edit
              </button>
            )}
          </div>

          {loading ? (
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading profile...</p>
          ) : !edit ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fields.map(f => (
                <div key={f.key} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                  <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>{f.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>
                    {profile[f.key]
                      ? f.type === "number"
                        ? `₹${Number(profile[f.key]).toLocaleString()}`
                        : profile[f.key]
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {error && (
                <div style={{
                  background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                  borderRadius: "var(--radius-sm)", padding: "12px 16px",
                  color: "var(--danger)", fontSize: 13,
                }}>
                  {error}
                </div>
              )}
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    value={profile[f.key]}
                    onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                    style={inputStyle}
                    onFocus={ev => ev.target.style.borderColor = "var(--border-glow)"}
                    onBlur={ev => ev.target.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                {/* Cancel button only shown if profile already exists */}
                {!saving && Object.values(profile).some(v => v) && (
                  <button
                    onClick={() => { setEdit(false); setError(""); }}
                    style={{
                      flex: 1, padding: "13px", background: "transparent",
                      border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
                      color: "var(--text-secondary)", fontWeight: 600, fontSize: 15,
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  style={{
                    flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px", background: "var(--accent)", border: "none",
                    borderRadius: "var(--radius-sm)", color: "#060f0b",
                    fontWeight: 700, fontSize: 15, opacity: saving ? 0.7 : 1,
                    cursor: saving ? "not-allowed" : "pointer",
                  }}
                >
                  <FiSave size={15} />
                  {saving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="card" style={{
          position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          borderColor: "var(--border-glow)", boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
          zIndex: 9999,
        }}>
          <FiCheckCircle size={48} color="var(--success)" />
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
            Profile Saved!
          </span>
        </div>
      )}
    </AppLayout>
  );
}

export default Profile;
