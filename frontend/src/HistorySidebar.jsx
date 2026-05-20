import React, { useEffect, useState } from "react";
import { History, Plus, FileText, Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const HistorySidebar = ({ activeId, onSelectAnalysis, onNewAnalysis, refreshTrigger }) => {
  const [history, setHistory] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [refreshTrigger]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5000/analyses");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        width: collapsed ? "80px" : "320px",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-card)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "sticky",
        top: 0,
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 16px",
          borderBottom: "1px solid var(--border-card)",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: "12px",
        }}
      >
        {!collapsed && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={20} color="var(--primary)" />
            <h2 style={{ fontSize: "1.2rem", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
              Career<span style={{ color: "var(--primary)" }}>CoPilot</span>
            </h2>
          </div>
        )}
        {collapsed && <Sparkles size={24} color="var(--primary)" />}
        
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px",
            borderRadius: "4px",
          }}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* New Analysis Button */}
      <div style={{ padding: "16px" }}>
        <button
          onClick={onNewAnalysis}
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: collapsed ? "12px" : "12px 16px",
          }}
          title="Analyze New Resume"
        >
          <Plus size={18} />
          {!collapsed && <span>New Analysis</span>}
        </button>
      </div>

      {/* History List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 12px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {!collapsed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              paddingLeft: "8px",
              marginBottom: "4px",
            }}
          >
            <History size={14} />
            <span>Analysis History</span>
          </div>
        )}

        {loading && history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px", color: "var(--text-dark)", fontSize: "0.9rem" }}>
            Loading records...
          </div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 8px", color: "var(--text-dark)", fontSize: "0.85rem" }}>
            {!collapsed ? "No previous analyses found" : "Empty"}
          </div>
        ) : (
          history.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectAnalysis(item.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isActive ? "var(--primary-glow)" : "transparent",
                  border: isActive ? "1px solid var(--primary)" : "1px solid transparent",
                  borderRadius: "10px",
                  padding: collapsed ? "12px" : "12px 14px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  transition: "all 0.2s ease",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", flex: 1 }}>
                    <FileText size={16} color={isActive ? "var(--primary)" : "var(--text-muted)"} style={{ flexShrink: 0 }} />
                    {!collapsed && (
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: isActive ? "600" : "400",
                          color: isActive ? "var(--text-main)" : "var(--text-muted)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.filename}
                      </span>
                    )}
                  </div>
                  
                  {item.overall_score !== null && item.overall_score !== undefined && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        backgroundColor: item.overall_score >= 8 ? "var(--success-glow)" : "rgba(255, 255, 255, 0.08)",
                        color: item.overall_score >= 8 ? "var(--success)" : "var(--text-muted)",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                    >
                      {item.overall_score}
                    </span>
                  )}
                </div>
                
                {!collapsed && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "0.75rem",
                      color: "var(--text-dark)",
                      paddingLeft: "24px",
                    }}
                  >
                    <Calendar size={12} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
