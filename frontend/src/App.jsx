import React, { useState, useEffect } from "react";
import DashboardSidebar from "./DashboardSidebar";
import ResumeUpload from "./ResumeUpload";
import AnalysisDashboard from "./AnalysisDashboard";
import { AuthPage } from "./AuthPage";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeId, setActiveId] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState("light");
  
  // Track authenticated user session from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("astracv_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Failed to parse saved user credentials", e);
      }
    }
    return null;
  });

  // Apply theme class to HTML node
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Fetch history list inside App to sync candidate info
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [refreshSidebar, user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch("http://127.0.0.1:5000/analyses", {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleSelectAnalysis = async (id) => {
    if (!user) return;
    setActiveId(id);
    setActiveTab("dashboard"); // Always jump to dashboard when viewing report
    try {
      const res = await fetch(`http://127.0.0.1:5000/analyses/${id}`, {
        headers: {
          "Authorization": `Bearer ${user.token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setActiveAnalysis(data);
      } else if (res.status === 401) {
        handleLogout();
      } else {
        console.error("Failed to load analysis detail");
      }
    } catch (err) {
      console.error("Error fetching analysis detail:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("astracv_user");
    setUser(null);
    setActiveAnalysis(null);
    setActiveId(null);
    setHistory([]);
    setActiveTab("dashboard");
  };

  const handleUploadSuccess = (id) => {
    // Refresh sidebar history and load newly analyzed report
    setRefreshSidebar((prev) => prev + 1);
    handleSelectAnalysis(id);
  };

  const handleNewAnalysis = () => {
    setActiveId(null);
    setActiveAnalysis(null);
    setActiveTab("dashboard");
  };

  // Determine user information dynamically based on authenticated user
  const candidateName = user ? user.name : "Guest User";
  const candidateEmail = user ? user.email : "guest@example.com";

  if (!user) {
    return <AuthPage onAuthSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="app-container">
      {/* 1. Navigational Left Sidebar */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        setTheme={setTheme}
        candidateName={candidateName}
        candidateEmail={candidateEmail}
        historyCount={history.length}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Grid Panel */}
      <main className="main-content">
        {activeTab === "dashboard" ? (
          activeAnalysis ? (
            <AnalysisDashboard 
              analysis={activeAnalysis} 
              onNewAnalysis={handleNewAnalysis} 
              candidateName={candidateName}
            />
          ) : (
            <ResumeUpload 
              onUploadSuccess={handleUploadSuccess} 
              candidateName={candidateName}
            />
          )
        ) : activeTab === "history" ? (
          <div className="animate-slide-in">
            <h2 style={{ fontSize: "2rem", marginBottom: "24px", fontFamily: "var(--font-heading)" }}>
              Analysis History Logs
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  className="premium-card"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleSelectAnalysis(item.id)}
                >
                  <div>
                    <h4 style={{ fontSize: "1.1rem", marginBottom: "4px" }}>{item.filename}</h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                      Analyzed for {item.candidate_name} ({item.candidate_email})
                    </p>
                  </div>
                  {item.overall_score && (
                    <span
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "var(--primary-glow)",
                        color: "var(--primary)",
                        fontWeight: "700",
                        borderRadius: "8px",
                      }}
                    >
                      Score: {item.overall_score}
                    </span>
                  )}
                </div>
              ))}
              {history.length === 0 && (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-dark)" }}>
                  No previous evaluations found. Start by uploading a resume!
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Placeholder Views for Mock Navigation links */
          <div className="animate-slide-in" style={{ padding: "40px 0" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "16px", fontFamily: "var(--font-heading)" }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
              This section is a mock view matching the sidebar links. Under production, this displays full premium metrics like custom career paths or ATS matching checklists!
            </p>
            <button 
              className="btn-primary" 
              onClick={handleNewAnalysis} 
              style={{ marginTop: "24px" }}
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
