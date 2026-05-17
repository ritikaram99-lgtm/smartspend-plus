import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-void)" }}>
      <Sidebar />
      <main style={{ marginLeft: "240px", flex: 1, padding: "40px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;