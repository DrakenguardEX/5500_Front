import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo">
          <h2>TaskMaster</h2>
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? "→" : "←"}
          </button>
        </div>
        <nav>
          <Link
            className={location.pathname === "/dashboard" ? "active" : ""}
            to="/dashboard"
          >
            📋 Dashboard
          </Link>
          <Link
            className={location.pathname === "/tasks" ? "active" : ""}
            to="/tasks"
          >
            ✓ My Tasks
          </Link>
          <Link
            className={location.pathname === "/team" ? "active" : ""}
            to="/team"
          >
            👥 Team
          </Link>
        </nav>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
