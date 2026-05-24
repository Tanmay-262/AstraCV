import React, { useEffect, useState } from "react";
import ScoreBanner from "./ScoreBanner";
import { User, Sparkles, AlertTriangle, Briefcase, Target, CheckCircle2, Plus, FileText, Calendar } from "lucide-react";

const AnalysisDashboard = ({ analysis, onNewAnalysis, candidateName }) => {
  const [data, setData] = useState(null);
  const [isLegacy, setIsLegacy] = useState(false);

  useEffect(() => {
    if (!analysis) return;
    
    try {
      // Direct JSON object if parsed by backend, or string parse
      const parsed = typeof analysis.analysis_result === "string" 
        ? JSON.parse(analysis.analysis_result) 
        : analysis.analysis_result;
        
      setData(parsed);
      setIsLegacy(false);
    } catch (e) {
      // Fallback for legacy plain markdown records
      setData(analysis.analysis_result);
      setIsLegacy(true);
    }
  }, [analysis]);

  if (!analysis) return null;

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="animate-slide-in" style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
      
      {/* 1. Header Greeting with "Analyze another +" action button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "var(--font-heading)" }}>
            Hello, {data?.candidate_name ? data.candidate_name.split(" ")[0] : (candidateName ? candidateName.split(" ")[0] : "Guest User")}! 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Upload your resume and get AI-powered insights instantly.
          </p>
        </div>

        <button
          onClick={onNewAnalysis}
          style={{
            background: "none",
            border: "1px solid var(--primary)",
            color: "var(--primary)",
            borderRadius: "20px",
            padding: "8px 20px",
            fontSize: "0.85rem",
            fontWeight: "700",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "var(--font-heading)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--primary-glow)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <span>Analyze another</span>
          <Plus size={14} />
        </button>
      </div>

      {/* Active File Name metadata block */}
      <div
        className="premium-card"
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid var(--border-card)",
          backgroundColor: "var(--bg-card)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={18} color="var(--error)" />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: "700", fontSize: "0.92rem", color: "var(--text-main)" }}>
              {analysis.filename}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-dark)", fontWeight: "500" }}>
              Uploaded {formatDate(analysis.created_at)}
            </span>
          </div>
        </div>
        
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            backgroundColor: "var(--success-glow)",
            color: "var(--success)",
            fontSize: "0.75rem",
            fontWeight: "700",
            padding: "4px 10px",
            borderRadius: "20px",
            border: "1px solid rgba(16, 185, 129, 0.12)",
          }}
        >
          <CheckCircle2 size={12} strokeWidth={2.5} />
          <span>Analyzed</span>
        </span>
      </div>

      {isLegacy ? (
        /* Legacy markdown backup renderer */
        <div className="premium-card" style={{ whiteSpace: "pre-wrap", lineHeight: "1.7" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Sparkles size={18} color="var(--primary)" />
            Legacy Analysis Report
          </h3>
          <pre style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--text-muted)", whiteSpace: "pre-wrap" }}>
            {data}
          </pre>
        </div>
      ) : data ? (
        /* Premium Dashboard layout matching the Mockup */
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* 2. Score Banner (Radial percentage dial + custom SVG trophy) */}
          <ScoreBanner
            score={data.overall_score}
            headline={data.headline}
            summary={data.summary}
          />

          {/* 3. 2x2 Insights Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
            }}
            className="mobile-insights-grid"
          >
            {/* Card 1: Profile Summary */}
            <div
              className="premium-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                borderLeft: "4px solid var(--primary)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-glow)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <User size={18} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
                  1. Profile Summary
                </h3>
              </div>
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: "1.6",
                  color: "var(--text-muted)",
                }}
              >
                {data.summary}
              </p>
            </div>

            {/* Card 2: Key Strengths */}
            <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--success-glow)",
                    color: "var(--success)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Sparkles size={18} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
                  2. Key Strengths
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.strengths?.map((str, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle2 size={16} color="var(--success)" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.88rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                      {str}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Weaknesses / Missing Skills */}
            <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    color: "var(--error)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
                  3. Weaknesses / Missing Skills
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.weaknesses?.map((weak, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle2 size={16} color="var(--primary)" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.88rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                      {weak}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Suggested Career Roles */}
            <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-glow)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Briefcase size={18} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
                  4. Suggested Career Roles
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.suggested_roles?.map((role, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle2 size={16} color="var(--primary)" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.88rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                      {role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Card 5: Recommendations (Full Width Bottom Panel) */}
          <div
            className="premium-card"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 200px",
              gap: "28px",
              alignItems: "center",
            }}
            className="mobile-recommendations-layout"
          >
            {/* Left list details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--primary)" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--primary-glow)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Target size={18} />
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", fontFamily: "var(--font-heading)", color: "var(--text-main)" }}>
                  5. Recommendations
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.recommendations?.map((rec, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle2 size={16} color="var(--primary)" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <span style={{ fontSize: "0.9rem", lineHeight: "1.5", color: "var(--text-main)" }}>
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right SVG Clipboard vector graphic with foliage */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="clipboard-container"
            >
              <svg width="180" height="150" viewBox="0 0 180 150" fill="none">
                {/* Foliage/Leaves background vectors */}
                <path d="M150,110 C160,90 145,70 160,50 C175,70 170,90 150,110 Z" fill="var(--success)" opacity="0.15" />
                <path d="M20,120 C10,105 25,90 15,75 C5,90 10,105 20,120 Z" fill="var(--success)" opacity="0.1" />
                <path d="M135,130 C145,115 135,95 145,80 C155,95 150,115 135,130 Z" fill="var(--primary)" opacity="0.08" />

                {/* Ground Shadow */}
                <ellipse cx="90" cy="135" rx="55" ry="8" fill="var(--bg-input)" opacity="0.6" />

                {/* Floating vector star */}
                <g transform="translate(145, 25) scale(0.65)" className="float-animation">
                  <path d="M10,0 L13,7 L20,7 L14,11 L16,18 L10,14 L4,18 L6,11 L0,7 L7,7 Z" fill="#60a5fa" opacity="0.8"/>
                </g>

                {/* Clipboard body */}
                <g transform="translate(45, 10)">
                  {/* Board shadow */}
                  <rect x="3" y="13" width="84" height="110" rx="10" fill="var(--border-card)" opacity="0.4" />
                  
                  {/* Board base */}
                  <rect x="0" y="10" width="84" height="110" rx="10" fill="var(--bg-card)" stroke="var(--border-card)" strokeWidth="1.5" />
                  
                  {/* Paper sheet */}
                  <rect x="8" y="24" width="68" height="84" rx="4" fill="var(--bg-main)" />
                  
                  {/* Checked Lists lines */}
                  {/* Check 1 */}
                  <path d="M16,38 L19,41 L25,35" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="32" y="36" width="34" height="3" rx="1.5" fill="var(--border-hover)" />
                  <rect x="32" y="42" width="22" height="2" rx="1" fill="var(--border-card)" />

                  {/* Check 2 */}
                  <path d="M16,56 L19,59 L25,53" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="32" y="54" width="34" height="3" rx="1.5" fill="var(--border-hover)" />
                  <rect x="32" y="60" width="26" height="2" rx="1" fill="var(--border-card)" />

                  {/* Check 3 */}
                  <path d="M16,74 L19,77 L25,71" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="32" y="72" width="34" height="3" rx="1.5" fill="var(--border-hover)" />
                  <rect x="32" y="78" width="18" height="2" rx="1" fill="var(--border-card)" />

                  {/* Check 4 */}
                  <path d="M16,92 L19,95 L25,89" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="32" y="90" width="34" height="3" rx="1.5" fill="var(--border-hover)" />

                  {/* Top Clamp */}
                  <path d="M26,10 C26,7 30,5 34,5 L50,5 C54,5 58,7 58,10 Z" fill="var(--border-hover)" />
                  <rect x="30" y="10" width="24" height="6" rx="2" fill="var(--primary)" />
                  <circle cx="42" cy="13" r="1.5" fill="#ffffff" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      ) : null}

      <style>{`
        .mobile-recommendations-layout {
          display: grid;
          grid-template-columns: 1fr 200px;
          gap: 28px;
          align-items: center;
        }
        @media (max-width: 900px) {
          .mobile-insights-grid {
            grid-template-columns: 1fr !important;
          }
          .mobile-recommendations-layout {
            grid-template-columns: 1fr !important;
          }
          .clipboard-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalysisDashboard;
