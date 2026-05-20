import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, Compass, Briefcase, Calendar, Sparkles, Clock, FileText } from "lucide-react";

const AnalysisDashboard = ({ analysis }) => {
  const [data, setData] = useState(null);
  const [isLegacy, setIsLegacy] = useState(false);

  useEffect(() => {
    if (!analysis) return;
    
    try {
      // Try to parse the result as JSON
      const parsed = JSON.parse(analysis.analysis_result);
      setData(parsed);
      setIsLegacy(false);
    } catch (e) {
      // Fallback for legacy plain markdown records
      setData(analysis.analysis_result);
      setIsLegacy(true);
    }
  }, [analysis]);

  if (!analysis) {
    return (
      <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", height: "70vh", color: "var(--text-muted)" }}>
        <div style={{ textAlign: "center" }}>
          <FileText size={48} style={{ color: "var(--text-dark)", marginBottom: "16px" }} />
          <p>Select a resume from the history or upload a new one to begin analysis.</p>
        </div>
      </div>
    );
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // SVG Gauge calculations
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const score = data?.overall_score || 0;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  // Determine score color class
  const getScoreColor = (num) => {
    if (num >= 8) return "var(--success)";
    if (num >= 6) return "var(--primary)";
    return "var(--warning)";
  };

  const getScoreGlow = (num) => {
    if (num >= 8) return "var(--success-glow)";
    if (num >= 6) return "var(--primary-glow)";
    return "var(--warning-glow)";
  };

  return (
    <div className="animate-slide-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header Panel */}
      <div
        className="premium-card"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          background: "linear-gradient(135deg, rgba(24, 24, 27, 0.9) 0%, rgba(9, 9, 11, 0.9) 100%)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                backgroundColor: "var(--primary-glow)",
                color: "var(--primary)",
                fontSize: "0.75rem",
                fontWeight: "700",
                textTransform: "uppercase",
                padding: "4px 10px",
                borderRadius: "20px",
                letterSpacing: "0.05em",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              Evaluation Complete
            </span>
          </div>
          <h1 style={{ fontSize: "2rem", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}>
            {analysis.filename}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={14} color="var(--text-dark)" />
              {formatDate(analysis.created_at)}
            </span>
          </div>
        </div>
      </div>

      {isLegacy ? (
        /* Legacy plain text renderer */
        <div className="premium-card" style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-card)", paddingBottom: "12px", marginBottom: "16px" }}>
            <Sparkles size={18} color="var(--primary)" />
            <h3 style={{ fontSize: "1.1rem" }}>Legacy Analysis Report</h3>
          </div>
          <pre
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {data}
          </pre>
        </div>
      ) : data ? (
        /* Premium Dashboard layout */
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Top Row: Score & Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "240px 1fr",
              gap: "24px",
            }}
            className="mobile-single-column"
          >
            {/* Score circle */}
            <div
              className="premium-card"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                textAlign: "center",
              }}
            >
              <h3 style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: "500" }}>Overall Score</h3>
              <div style={{ position: "relative", width: "120px", height: "120px", display: "flex", alignItems: "center", justifyItems: "center" }}>
                <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                  {/* Gray background track */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth={strokeWidth}
                  />
                  {/* Colored progress bar */}
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="transparent"
                    stroke={getScoreColor(score)}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      transition: "stroke-dashoffset 0.8s ease-in-out",
                    }}
                  />
                </svg>
                {/* Score numbers inside */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "1.8rem", fontWeight: "800", color: getScoreColor(score), fontFamily: "var(--font-heading)" }}>
                    {score}
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-dark)", fontWeight: "600", marginTop: "-4px" }}>
                    / 10
                  </span>
                </div>
              </div>
              
              <div
                style={{
                  fontSize: "0.85rem",
                  padding: "4px 12px",
                  borderRadius: "12px",
                  backgroundColor: getScoreGlow(score),
                  color: getScoreColor(score),
                  fontWeight: "600",
                }}
              >
                {score >= 8 ? "Excellent Fit" : score >= 6 ? "Solid Draft" : "Requires Work"}
              </div>
            </div>

            {/* Summary card */}
            <div className="premium-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)" }}>
                <Compass size={18} />
                <h3 style={{ fontSize: "1.1rem", fontFamily: "var(--font-heading)" }}>Executive Summary</h3>
              </div>
              <p
                style={{
                  lineHeight: "1.7",
                  color: "var(--text-muted)",
                  fontSize: "0.98rem",
                  fontStyle: "italic",
                }}
              >
                "{data.summary}"
              </p>
            </div>
          </div>

          {/* Middle Row: Strengths and Weaknesses */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
            className="mobile-single-column"
          >
            {/* Strengths Card */}
            <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--success)" }}>
                <CheckCircle2 size={20} />
                <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-heading)" }}>Key Strengths</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.strengths?.map((str, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(16, 185, 129, 0.03)",
                      border: "1px solid rgba(16, 185, 129, 0.08)",
                    }}
                  >
                    <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: "3px", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.92rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                      {str}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses Card */}
            <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--warning)" }}>
                <AlertTriangle size={20} />
                <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-heading)" }}>Areas for Improvement</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.weaknesses?.map((weak, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(245, 158, 11, 0.03)",
                      border: "1px solid rgba(245, 158, 11, 0.08)",
                    }}
                  >
                    <AlertTriangle size={16} color="var(--warning)" style={{ marginTop: "3px", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.92rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                      {weak}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row: Career Paths */}
          <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--primary)" }}>
              <Briefcase size={20} />
              <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-heading)" }}>Suggested Career Roles</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {data.suggested_roles?.map((role, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "rgba(99, 102, 241, 0.05)",
                    border: "1px solid rgba(99, 102, 241, 0.15)",
                    borderRadius: "30px",
                    padding: "8px 16px",
                    fontSize: "0.9rem",
                    fontWeight: "550",
                    color: "#a5b4fc",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.2s ease",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.1)";
                    e.currentTarget.style.transform = "scale(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.15)";
                    e.currentTarget.style.backgroundColor = "rgba(99, 102, 241, 0.05)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <Briefcase size={14} color="var(--primary)" />
                  {role}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        @media (max-width: 900px) {
          .mobile-single-column {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisDashboard;
