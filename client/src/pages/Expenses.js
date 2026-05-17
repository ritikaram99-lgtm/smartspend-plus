import axios from "axios";
import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { FiPlus, FiTrash2, FiX, FiEdit2} from "react-icons/fi";
import toast from "react-hot-toast";
const CATS = ["Food", "Travel", "Entertainment", "Bills", "Shopping"];
const CAT_EMOJI = { Food: "🍔", Travel: "✈️", Entertainment: "🎬", Bills: "📄", Shopping: "🛍️" };
const CAT_COLOR = { Food: "#f59e0b", Travel: "#3b82f6", Entertainment: "#ec4899", Bills: "#8b5cf6", Shopping: "#06b6d4" };
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

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

      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5001/api/expenses",
        {
          headers: {
            authorization: token,
          },
        }
      );

      setExpenses(res.data);
      setFetchLoading(false);
    } catch (error) {

      console.log(error);
      toast.error("Something went wrong");
      setFetchLoading(false);
    }
  }

  fetchExpenses();

}, []);

  async function handleDelete(id) {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/expenses/${id}`, {
        headers: { authorization: token }
      });
      setExpenses(expenses.filter(e => e._id !== id));
      toast.success("Expense deleted");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }
  async function handleEdit() {

  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `http://localhost:5001/api/expenses/${editingExpense._id}`,
      {
        title: note || category,
        amount: Number(amount),
        category,
        date,
      },
      {
        headers: {
          authorization: token,
        },
      }
    );

    setExpenses(
      expenses.map(e =>
        e._id === editingExpense._id
          ? res.data
          : e
      )
    );
    toast.success("Expense updated");
    setLoading(false);
    setEditModal(false);

    setAmount("");
    setCategory("Food");
    setDate("");
    setNote("");

  } catch (error) {

    console.log(error);
    toast.error("Something went wrong");
    setLoading(false);
  }
}

  async function addExpense() {
    if (!amount) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const payload = {
        title: note || category,
        amount: Number(amount),
        category,
      };
      
      if (date) {
        payload.date = date;
      }

      const res = await axios.post(
        "http://localhost:5001/api/expenses",
        payload,
        {
          headers: {
            authorization: token,
          },
        }
      );

      setExpenses([...expenses, res.data]);
      toast.success("Expense added");
      setLoading(false);
      setModal(false);
      setAmount("");
      setNote("");
      setDate("");

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setLoading(false);
    }
  }



  const filterExpenses = expenses.filter(e => {
    const d = new Date(e.date);
    return (filterCategory === "All" || e.category === filterCategory) && d.getMonth() === parseInt(filterMonth);
  });

  const events = expenses.map(e => ({ title: `${e.category} ₹${e.amount}`, date: e.date.split("T")[0], backgroundColor: CAT_COLOR[e.category] || "#63d3b7", borderColor: "transparent" }));

  const inputStyle = { width: "100%", padding: "12px 14px", background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 14, outline: "none" };

  return (
    <AppLayout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, letterSpacing: "normal" }}>Expenses</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>{filterExpenses.length} transactions this month</p>
        </div>
        <button onClick={() => setModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", background: "var(--accent)", border: "none", borderRadius: "50px", color: "#060f0b", fontWeight: 700, fontSize: 14 }}>
          <FiPlus size={16} /> Add Expense
        </button>
      </div>

      {/* Add Modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "36px 32px", width: 400, boxShadow: "var(--shadow-card)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>Add Expense</h2>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: 20, padding: 0 }}><FiX /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} style={inputStyle} />
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle }}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
              <input placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} style={inputStyle} />
              <button onClick={addExpense} disabled={loading} style={{ padding: "13px", background: "var(--accent)", border: "none", borderRadius: "var(--radius-sm)", color: "#060f0b", fontWeight: 700, fontSize: 15, marginTop: 4 }}>
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal */}
{editModal && (
  <div style={{
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999
  }}>
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-xl)",
      padding: "36px 32px",
      width: 400,
      boxShadow: "var(--shadow-card)"
    }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24
      }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          fontWeight: 700
        }}>
          Edit Expense
        </h2>

        <button
          onClick={() => setEditModal(false)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: 20,
            padding: 0
          }}
        >
          <FiX />
        </button>
      </div>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>

        <input
          placeholder="Amount (₹)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={inputStyle}
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={inputStyle}
        >
          {CATS.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Note"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={handleEdit}
          disabled={loading}
          style={{
            padding: "13px",
            background: "var(--accent)",
            border: "none",
            borderRadius: "var(--radius-sm)",
            color: "#060f0b",
            fontWeight: 700,
            fontSize: 15,
            marginTop: 4
          }}
        >
          {loading ? "Updating..." : "Update Expense"}
        </button>

      </div>
    </div>
  </div>
)}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }}>
        {/* Left Column */}
        <div>
          {/* Filters */}
          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13 }}>
              <option value="All">All Categories</option>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} style={{ padding: "10px 14px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", fontSize: 13 }}>
              {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
            </select>
          </div>

          {/* Table */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: 32 }}>
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
    <td
      colSpan={5}
      style={{
        padding: "40px",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: 14
      }}
    >
      Loading expenses...
    </td>
  </tr>

) : filterExpenses.length === 0 ? (

  <tr>
    <td
      colSpan={5}
      style={{
        padding: "40px",
        textAlign: "center",
        color: "var(--text-muted)",
        fontSize: 14
      }}
    >
      No expenses yet. Add your first expense 🚀
    </td>
  </tr>

) :  filterExpenses.map((e, i) => (
                  <tr key={i} style={{ borderBottom: i < filterExpenses.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                    onMouseEnter={ev => ev.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>{e.date.split("T")[0]}</td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: `${CAT_COLOR[e.category]}18`, color: CAT_COLOR[e.category], padding: "4px 12px", borderRadius: 50, fontSize: 12, fontWeight: 600 }}>
                        {CAT_EMOJI[e.category]} {e.category}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>₹{parseInt(e.amount).toLocaleString()}</td>
                    <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--text-secondary)" }}>{e.note || "—"}</td>
                    <td style={{ padding: "14px 20px" }}>
                    <button
  onClick={() => {

    setEditingExpense(e);

    setAmount(e.amount);
    setCategory(e.category);
    setDate(e.date.split("T")[0]);
    setNote(e.title);

    setEditModal(true);
  }}

  style={{
    background: "none",
    border: "none",
    color: "var(--accent)",
    padding: 6,
    borderRadius: 6,
    marginRight: 8,
  }}
>
  <FiEdit2 size={15} />
</button>
                      <button onClick={() => handleDelete(e._id)}
                        style={{ background: "none", border: "none", color: "var(--text-muted)", padding: 6, borderRadius: 6, transition: "all 0.15s" }}
                        onMouseEnter={ev => { ev.currentTarget.style.color = "var(--danger)"; ev.currentTarget.style.background = "rgba(248,113,113,0.1)"; }}
                        onMouseLeave={ev => { ev.currentTarget.style.color = "var(--text-muted)"; ev.currentTarget.style.background = "none"; }}
                      ><FiTrash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        {/* Calendar */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginBottom: 20 }}>📅 Expense Calendar</h3>
          <div style={{ "--fc-bg-event-opacity": 1, "--fc-border-color": "var(--border)", "--fc-page-bg-color": "transparent", "--fc-neutral-bg-color": "var(--bg-elevated)", "--fc-list-event-hover-bg-color": "var(--bg-elevated)", "--fc-theme-standard-border-color": "var(--border)" }}>
            <style>{`.fc { color: var(--text-primary); font-family: var(--font-body); } .fc .fc-col-header-cell-cushion, .fc .fc-daygrid-day-number { color: var(--text-secondary); } .fc .fc-button { background: var(--bg-elevated); border: 1px solid var(--border); color: var(--text-primary); } .fc .fc-button:hover { background: var(--accent-dim); border-color: var(--border-glow); color: var(--accent); } .fc .fc-button-primary:not(:disabled).fc-button-active { background: var(--accent-dim); border-color: var(--border-glow); color: var(--accent); } .fc-theme-standard td, .fc-theme-standard th { border-color: var(--border); }`}</style>
            <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" events={events} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Expenses;