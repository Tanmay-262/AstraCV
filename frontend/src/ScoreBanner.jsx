import React from "react";

const ScoreBanner = ({ score, headline, summary }) => {
  // SVG Gauge calculations
  const radius = 45;
  const strokeWidth = 7;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  return (
    <div
      className="premium-card animate-slide-in"
      style={{
        display: "grid",
        gridTemplateColumns: "160px 1fr 180px",
        gap: "28px",
        alignItems: "center",
        background: "linear-gradient(135deg, var(--bg-card) 0%, var(--primary-glow) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
      className="mobile-banner-layout"
    >
      {/* 1. Large Circular SVGA Progress Dial */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          flexShrink: 0,
        }}
      >
        <div style={{ position: "relative", width: "110px", height: "110px" }}>
          <svg width="110" height="110" style={{ transform: "rotate(-90deg)" }}>
            {/* Background thin track */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke="var(--border-card)"
              strokeWidth="4"
            />
            {/* Active percentage track */}
            <circle
              cx="55"
              cy="55"
              r={radius}
              fill="transparent"
              stroke="var(--primary)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.8s ease-in-out",
              }}
            />
          </svg>
          
          {/* Inner details */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              lineHeight: "1.1",
            }}
          >
            <span
              style={{
                fontSize: "1.9rem",
                fontWeight: "800",
                color: "var(--text-main)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {score}
            </span>
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-dark)",
                fontWeight: "600",
              }}
            >
              /10
            </span>
          </div>
        </div>
      </div>

      {/* 2. Rating Details & Summaries */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <span
          style={{
            fontSize: "0.78rem",
            fontWeight: "700",
            color: "var(--text-dark)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Overall Score
        </span>
        
        <h2
          style={{
            fontSize: "1.75rem",
            color: "var(--text-main)",
            fontWeight: "800",
            fontFamily: "var(--font-heading)",
          }}
        >
          {headline || "Evaluation Complete! 🎉"}
        </h2>
        
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--text-muted)",
            lineHeight: "1.5",
            maxWidth: "640px",
          }}
        >
          {summary || "Your resume text has been successfully evaluated against structural and skill requirements."}
        </p>
      </div>

      {/* 3. Pure SVG Vector Trophy Drawing */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
        className="trophy-container"
      >
        <svg width="150" height="120" viewBox="0 0 150 120" fill="none">
          {/* Subtle glow behind trophy */}
          <circle cx="75" cy="55" r="30" fill="var(--primary)" opacity="0.12" style={{ filter: "blur(15px)" }}/>
          
          {/* Orbiting stars sparkles */}
          <path d="M25,35 L27,37 L25,39 L23,37 Z" fill="var(--primary)" opacity="0.6"/>
          <path d="M125,25 L127,27 L125,29 L123,27 Z" fill="#60a5fa" opacity="0.8"/>
          <path d="M30,85 L31.5,86.5 L30,88 L28.5,86.5 Z" fill="#93c5fd" opacity="0.5"/>
          <path d="M115,75 L116.5,76.5 L115,78 L113.5,76.5 Z" fill="var(--primary)" opacity="0.4"/>
          
          {/* Floating vector stars */}
          <g transform="translate(15, 10) scale(0.8)" className="float-animation">
            <path d="M10,0 L13,7 L20,7 L14,11 L16,18 L10,14 L4,18 L6,11 L0,7 L7,7 Z" fill="#60a5fa" opacity="0.75"/>
          </g>
          <g transform="translate(115, 55) scale(0.65)" className="float-animation">
            <path d="M10,0 L13,7 L20,7 L14,11 L16,18 L10,14 L4,18 L6,11 L0,7 L7,7 Z" fill="#2563eb" opacity="0.6"/>
          </g>

          {/* Trophy Base Platforms */}
          <rect x="45" y="95" width="60" height="8" rx="4" fill="var(--border-card)" />
          <path d="M50,85 L100,85 L95,95 L55,95 Z" fill="var(--border-hover)" />
          
          {/* Trophy Stem column */}
          <rect x="71" y="65" width="8" height="20" rx="2" fill="var(--border-hover)" />
          
          {/* Trophy handles */}
          <path d="M48,32 C38,32 38,50 48,50 L48,46 C42,46 42,36 48,36 Z" fill="#3b82f6" />
          <path d="M102,32 C112,32 112,50 102,50 L102,46 C108,46 108,36 102,36 Z" fill="#3b82f6" />

          {/* Trophy Cup Body */}
          <path d="M48,22 L102,22 C102,22 102,56 75,65 C48,56 48,22 48,22 Z" fill="#2563eb" />
          <path d="M52,24 L98,24 C98,24 98,52 75,60 C52,52 52,24 52,24 Z" fill="#3b82f6" />
          
          {/* Shiny highlight lines */}
          <path d="M56,26 L64,26 C64,26 64,48 75,54" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Star symbol inside Trophy */}
          <g transform="translate(68, 30) scale(0.7)">
            <path d="M10,0 L13,7 L20,7 L14,11 L16,18 L10,14 L4,18 L6,11 L0,7 L7,7 Z" fill="#ffffff" />
          </g>
        </svg>
      </div>

      <style>{`
        .mobile-banner-layout {
          display: grid;
          grid-template-columns: 160px 1fr 180px;
          gap: 28px;
          align-items: center;
          background: linear-gradient(135deg, var(--bg-card) 0%, var(--primary-glow) 100%);
          position: relative;
          overflow: hidden;
        }
        @media (max-width: 900px) {
          .mobile-banner-layout {
            grid-template-columns: 1fr !important;
            padding: 24px;
            text-align: center;
            justify-items: center;
          }
          .trophy-container {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ScoreBanner;
