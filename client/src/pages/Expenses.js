import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FiPlus, FiTrash2, FiX, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../api";

const CATS = ["Food", "Travel", "Entertainment", "Bills", "Shopping"];
const CAT_EMOJI = { Food: "🍔", Travel: "✈️", Entertainment: "🎬", Bills: "📄", Shopping: "🛍️" };
const CAT_COLOR = { Food: "#f59e0b", Travel: "#3b82f6", Entertainment: "#ec4899", Bills: "#8b5cf6", Shopping: "#06b6d4" };
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const ModalOverlay = ({ children }) => (
  <div style={{
    position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)", display: "flex", alignItems: "center",
    justifyContent: "center", zIndex: 999,
  }}>
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-xl)", padding: "36px 32px",
      width: "90%", maxWidth: 400, boxShadow: "var(--shadow-card)",
    }}>
      {children}
    </div>
  </div>
);

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [modal, setModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    async function fetchExpenses() {
      setFetchLoading(true);
      try {
        const res = await api.get("/api/expenses");
        setExpenses(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load expenses");
      } finally {
        setFetchLoading(false);
      }
    }
    fetchExpenses();
  }, []);

  async function handleDelete(id) {
    try {
      await api.delete(`/api/expenses/${id}`);
      setExpenses(expenses.filter(e => e._id !== id));
      toast.success("Expense deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense");
    }
  }

  async function handleEdit() {
    if (!amount) {
      toast.error("Amount is required");
      return;
    }
    try {
      setLoading(true);
      const res = await api.put(`/api/expenses/${editingExpense._id}`, {
        title: note || category,
        amount: Number(amount),
        category,
        date: date || new Date().toISOString(),
      });
      setExpenses(expenses.map(e => e._id === editingExpense._id ? res.data : e));
      toast.success("Expense updated");
      setEditModal(false);
      setAmount("");
      setCategory("Food");
      setDate("");
      setNote("");
      setEditingExpense(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update expense");
    } finally {
      setLoading(false);
    }
  }

  async function addExpense() {
    if (!amount) {
      toast.error("Amount is required");
      return;
    }
    try {
      setLoading(true);
      const payload = {
        title: note || category,
        amount: Number(amount),
        category,
      };
      if (date) payload.date = date;

      const res = await api.post("/api/expenses", payload);
      setExpenses([...expenses, res.data]);
      toast.success("Expense added");
      setModal(false);
      setAmount("");
      setNote("");
      setDate("");
      setCategory("Food");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  }

  function openEditModal(e) {
    setEditingExpense(e);
    setAmount(String(e.amount));
    setCategory(e.category);
    setDate(e.date ? e.date.split("T")[0] : "");
    setNote(e.title || "");
    setEditModal(true);
  }

  function closeAddModal() {
    setModal(false);
    setAmount("");
    setCategory("Food");
    setDate("");
    setNote("");
  }

  function closeEditModal() {
    setEditModal(false);
    setAmount("");
    setCategory("Food");
    setDate("");
    setNote("");
    setEditingExpense(null);
  }

  const filterExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    const matchCat = filterCategory === "All" || e.category === filterCategory;
    const matchMonth = d.getMonth() === Number(filterMonth);
    return matchCat && matchMonth;
  });

  const events = expenses.map(e => ({
    title: `${CAT_EMOJI[e.category] || "💸"} ₹${e.amount}`,
    date: e.date ? e.date.split("T")[0] : new Date().toISOString().split("T")[0],
    backgroundColor: CAT_COLOR[e.category] || "#63d3b7",
    borderColor: "transparent",
  }));

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: "var(--bg-elevated)",
    border: "1px solid var(--border)", borderRadius: "var(--radius-sm)",
    color: "var(--text-primary)", fontSize: 14, outline: "none",
  };


  return (
    <AppLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "normal" }}>Expenses</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
            {filterExpenses.length} transaction{filterExpenses.length !== 1 ? "s" : ""} this month
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 8, padding: "12px 22px",
            background: "var(--accent)", border: "none", borderRadius: "50px",
            color: "#060f0b", fontWeight: 700, fontSize: 14,
          }}
        >
          <FiPlus size={16} /> Add Expense
        </button>
      </div>

      {/* Add Modal */}
      {modal && (
        <ModalOverlay>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>Add Expense</h2>
            <button onClick={closeAddModal} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, padding: 0 }}>
              <FiX />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              placeholder="Amount (₹)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              type="number"
              min="0"
              style={inputStyle}
              onFocus={ev => ev.target.style.borderColor = "var(--border-glow)"}
              onBlur={ev => ev.target.style.borderColor = "var(--border)"}
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={inputStyle}
              onFocus={ev => ev.target.style.borderColor = "var(--border-glow)"}
              onBlur={ev => ev.target.style.borderColor = "var(--border)"}
            />
            <input
              placeholder="Note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
              style={inputStyle}
              onFocus={ev => ev.target.style.borderColor = "var(--border-glow)"}
              onBlur={ev => ev.target.style.borderColor = "var(--border)"}
            />
            <button
              onClick={addExpense}
              disabled={loading}
              style={{
                padding: "13px", background: "var(--accent)", border: "none",
                borderRadius: "var(--radius-sm)", color: "#060f0b", fontWeight: 700,
                fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* Edit Modal */}
      {editModal && (
        <ModalOverlay>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>Edit Expense</h2>
            <button onClick={closeEditModal} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, padding: 0 }}>
              <FiX />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              placeholder="Amount (₹)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              type="number"
              min="0"
              style={inputStyle}
              onFocus={ev => ev.target.style.borderColor = "var(--border-glow)"}
              onBlur={ev => ev.target.style.borderColor = "var(--border)"}
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={inputStyle}
              onFocus={ev => ev.target.style.borderColor = "var(--border-glow)"}
              onBlur={ev => ev.target.style.borderColor = "var(--border)"}
            />
            <input
              placeholder="Note (optional)"
              value={note}
              onChange={e => setNote(e.target.value)}
              style={inputStyle}
              onFocus={ev => ev.target.style.borderColor = "var(--border-glow)"}
              onBlur={ev => ev.target.style.borderColor = "var(--border)"}
            />
            <button
              onClick={handleEdit}
              disabled={loading}
              style={{
                padding: "13px", background: "var(--accent)", border: "none",
                borderRadius: "var(--radius-sm)", color: "#060f0b", fontWeight: 700,
                fontSize: 15, marginTop: 4, opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Updating..." : "Update Expense"}
            </button>
          </div>
        </ModalOverlay>
      )}

      <div className="two-col-grid">
        {/* Left Column */}
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              style={{ padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13 }}
            >
              <option value="All">All Categories</option>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(Number(e.target.value))}
              style={{ padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13 }}
            >
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Date", "Category", "Amount", "Note", ""].map(h => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fetchLoading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                      Loading expenses...
                    </td>
                  </tr>
                ) : filterExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                      No expenses for this month. Add your first one 🚀
                    </td>
                  </tr>
                ) : (
                  filterExpenses.map((e, i) => (
                    <tr
                      key={e._id}
                      style={{ borderBottom: i < filterExpenses.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                      onMouseEnter={ev => ev.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                      onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>
                        {e.date ? e.date.split("T")[0] : "—"}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center", gap: 8,
                          background: `${CAT_COLOR[e.category]}18`,
                          color: CAT_COLOR[e.category],
                          padding: "4px 12px", borderRadius: 50, fontSize: 12, fontWeight: 600,
                        }}>
                          {CAT_EMOJI[e.category]} {e.category}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>
                        ₹{Number(e.amount).toLocaleString()}
                      </td>
                      <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>
                        {e.title || "—"}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        <button
                          onClick={() => openEditModal(e)}
                          style={{ background: "none", border: "none", color: "var(--accent)", padding: 6, borderRadius: 6, marginRight: 8, cursor: "pointer" }}
                        >
                          <FiEdit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(e._id)}
                          style={{ background: "none", border: "none", color: "var(--text-muted)", padding: 6, borderRadius: 6, transition: "all 0.15s", cursor: "pointer" }}
                          onMouseEnter={ev => { ev.currentTarget.style.color = "var(--danger)"; ev.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                          onMouseLeave={ev => { ev.currentTarget.style.color = "var(--text-muted)"; ev.currentTarget.style.background = "none"; }}
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Calendar */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📅 Expense Calendar</h3>
          <div>
            <style>{`
              .fc { color: var(--text-primary); font-family: var(--font-body); }
              .fc .fc-col-header-cell-cushion, .fc .fc-daygrid-day-number { color: var(--text-secondary); text-decoration: none; }
              .fc .fc-button { background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-primary); }
              .fc .fc-button:hover { background: var(--accent-dim); border-color: var(--border-glow); color: var(--accent); }
              .fc .fc-button-primary:not(:disabled).fc-button-active { background: var(--accent-dim); border-color: var(--border-glow); color: var(--accent); }
              .fc-theme-standard td, .fc-theme-standard th { border-color: var(--border); }
              .fc .fc-daygrid-day.fc-day-today { background: var(--accent-dim); }
            `}</style>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              events={events}
              headerToolbar={{ left: "prev", center: "title", right: "next" }}
              height="auto"
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Expenses;
