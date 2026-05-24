import React, { useState, useRef, useEffect } from "react";
import { Home, FileText, History, Lightbulb, Map, Info, Sparkles, ChevronDown, Sun, Moon, LogOut, Settings, User } from "lucide-react";

const DashboardSidebar = ({
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  candidateName,
  candidateEmail,
  historyCount,
  onLogout
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "resumes", label: "My Resumes", icon: FileText },
    { id: "history", label: "History", icon: History, badge: historyCount },
    { id: "tips", label: "Tips & Guide", icon: Lightbulb },
    { id: "roadmap", label: "Career Roadmap", icon: Map },
    { id: "about", label: "About Us", icon: Info },
  ];

  // Get initials for avatar bubble
  const getInitials = (name) => {
    if (!name) return "GU";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{
        width: "280px",
        backgroundColor: "var(--bg-sidebar)",
        borderRight: "1px solid var(--border-card)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        zIndex: 20,
        flexShrink: 0,
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
      }}
      className="sidebar-scroll-hide"
    >
      {/* 1. Stacked App Logo */}
      <div
        style={{
          padding: "32px 24px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Sparkle Logo */}
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(37, 99, 235, 0.2)",
            flexShrink: 0,
          }}
        >
          <Sparkles size={24} color="#ffffff" />
        </div>
        
        {/* Stacked Text */}
        <div
          style={{
            fontFamily: "var(--font-heading)",
            lineHeight: "1.1",
            fontWeight: "800",
            fontSize: "1.35rem",
            letterSpacing: "-0.02em",
            color: "var(--text-main)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <span>Astra</span>
          <span style={{ color: "#2563eb" }}>CV</span>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          padding: "12px 16px",
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "none",
                background: isActive ? "var(--primary)" : "transparent",
                color: isActive ? "#ffffff" : "var(--text-muted)",
                cursor: "pointer",
                fontSize: "0.92rem",
                fontWeight: isActive ? "600" : "500",
                fontFamily: "var(--font-heading)",
                textAlign: "left",
                transition: "all 0.2s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-main)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? (
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "700",
                    backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "var(--primary-glow)",
                    color: isActive ? "#ffffff" : "var(--primary)",
                    padding: "2px 8px",
                    borderRadius: "20px",
                  }}
                >
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* 3. "Unlock Premium Features" Gradient Banner */}
      <div style={{ padding: "0 16px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
            borderRadius: "16px",
            padding: "20px",
            color: "#ffffff",
            boxShadow: "0 6px 20px rgba(29, 78, 216, 0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle glowing star in background */}
          <div style={{ position: "absolute", top: "-10px", right: "-10px", opacity: 0.15 }}>
            <Sparkles size={100} color="#ffffff" />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "relative", zIndex: 2 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={16} />
              <span style={{ fontSize: "0.85rem", fontWeight: "700", fontFamily: "var(--font-heading)" }}>
                PREMIUM ACCESS
              </span>
            </div>
            
            <h4 style={{ fontSize: "1rem", fontWeight: "700", lineHeight: "1.3" }}>
              Unlock Premium Features
            </h4>
            
            <p style={{ fontSize: "0.75rem", opacity: 0.85, lineHeight: "1.4" }}>
              Get advanced AI insights, ATS score checker, cover letter generator and more.
            </p>
            
            <button
              onClick={() => alert("Premium Upgrade Flow triggered! Thank you!")}
              style={{
                marginTop: "6px",
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#ffffff",
                color: "#1d4ed8",
                fontWeight: "700",
                fontSize: "0.8rem",
                fontFamily: "var(--font-heading)",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Upgrade Now &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 4. User Profile Details */}
      <div
        ref={dropdownRef}
        style={{
          margin: "16px 16px 8px",
          position: "relative",
        }}
      >
        {/* Clickable Profile Card */}
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid var(--border-card)",
            backgroundColor: dropdownOpen ? "var(--bg-input)" : "transparent",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!dropdownOpen) e.currentTarget.style.backgroundColor = "var(--bg-input)";
          }}
          onMouseLeave={(e) => {
            if (!dropdownOpen) e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          {/* Avatar Circle */}
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#1e3a8a",
              color: "#60a5fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "0.85rem",
              fontFamily: "var(--font-heading)",
              flexShrink: 0,
            }}
          >
            {getInitials(candidateName)}
          </div>
          
          {/* Text */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--text-main)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {candidateName}
            </span>
            <span
              style={{
                fontSize: "0.72rem",
                color: "var(--text-dark)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {candidateEmail}
            </span>
          </div>
          <ChevronDown
            size={14}
            color="var(--text-dark)"
            style={{
              flexShrink: 0,
              transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </div>

        {/* Dropup Menu Popover */}
        {dropdownOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: 0,
              right: 0,
              backgroundColor: "var(--bg-card)",
              borderRadius: "12px",
              border: "1px solid var(--border-card)",
              padding: "6px",
              boxShadow: "0 -10px 25px rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              zIndex: 50,
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Account Settings (Mock option for fidelity) */}
            <button
              onClick={() => {
                alert("Profile settings are managed in your account dashboard!");
                setDropdownOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "var(--text-main)",
                fontSize: "0.82rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-heading)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-input)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <User size={14} color="var(--text-dark)" />
              <span>Profile Settings</span>
            </button>

            {/* Support / Help */}
            <button
              onClick={() => {
                alert("AstraCV Support is active. Contact us at support@astracv.com!");
                setDropdownOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "var(--text-main)",
                fontSize: "0.82rem",
                fontWeight: "500",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-heading)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-input)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Settings size={14} color="var(--text-dark)" />
              <span>System Settings</span>
            </button>

            {/* Divider */}
            <div style={{ height: "1px", backgroundColor: "var(--border-card)", margin: "4px 6px" }} />

            {/* Logout Action */}
            <button
              onClick={() => {
                setDropdownOpen(false);
                if (onLogout) onLogout();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background: "transparent",
                color: "#ef4444",
                fontSize: "0.82rem",
                fontWeight: "600",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-heading)",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <LogOut size={14} color="#ef4444" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Theme Toggle Pill & Rocket launch */}
      <div
        style={{
          padding: "8px 16px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Sliding Pill Toggler */}
        <div
          style={{
            width: "100%",
            height: "38px",
            borderRadius: "20px",
            backgroundColor: "var(--bg-input)",
            border: "1px solid var(--border-card)",
            display: "flex",
            position: "relative",
            padding: "2px",
            cursor: "pointer",
          }}
        >
          {/* Active Sliding Indicator Background */}
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: theme === "light" ? "2px" : "calc(50% - 2px)",
              width: "calc(50% - 2px)",
              height: "calc(100% - 4px)",
              borderRadius: "18px",
              backgroundColor: "var(--bg-card)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              transition: "left 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: 1,
            }}
          />

          <button
            onClick={() => setTheme("light")}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: "0.78rem",
              fontWeight: "600",
              color: theme === "light" ? "var(--primary)" : "var(--text-muted)",
              zIndex: 2,
              fontFamily: "var(--font-heading)",
            }}
          >
            <Sun size={14} />
            <span>Light</span>
          </button>
          
          <button
            onClick={() => setTheme("dark")}
            style={{
              flex: 1,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: "0.78rem",
              fontWeight: "600",
              color: theme === "dark" ? "var(--primary)" : "var(--text-muted)",
              zIndex: 2,
              fontFamily: "var(--font-heading)",
            }}
          >
            <Moon size={14} />
            <span>Dark</span>
          </button>
        </div>

        {/* 6. Custom Floating SVG Rocket */}
        <div className="float-animation" style={{ width: "100%", display: "flex", justifyContent: "center", position: "relative" }}>
          <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
            {/* Stars background */}
            <circle cx="20" cy="20" r="1" fill="#3b82f6" opacity="0.6"/>
            <circle cx="180" cy="15" r="1.5" fill="#60a5fa" opacity="0.8"/>
            <circle cx="210" cy="50" r="1" fill="#93c5fd" opacity="0.4"/>
            <circle cx="35" cy="70" r="1.2" fill="#3b82f6" opacity="0.5"/>
            
            {/* Sparkling stars */}
            <path d="M190,40 L191.5,41.5 L190,43 L188.5,41.5 Z" fill="#60a5fa" opacity="0.7"/>
            <path d="M15,50 L16,51 L15,52 L14,51 Z" fill="#93c5fd" opacity="0.9"/>
            
            {/* Clouds vector */}
            <path d="M10,85 C30,85 45,70 65,70 C85,70 95,85 125,85 C155,85 165,75 185,75 C205,75 210,85 220,85" stroke="var(--border-card)" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
            <path d="M30,82 C50,82 65,76 80,76 C95,76 110,82 135,82 C160,82 170,79 190,79 C205,79 210,82 215,82" stroke="var(--border-card)" strokeWidth="1" strokeLinecap="round" opacity="0.15"/>
            
            {/* Ground clouds smoke */}
            <ellipse cx="60" cy="85" rx="30" ry="12" fill="var(--bg-input)" opacity="0.4" />
            <ellipse cx="160" cy="85" rx="40" ry="15" fill="var(--bg-input)" opacity="0.5" />
            <ellipse cx="110" cy="85" rx="55" ry="18" fill="var(--bg-input)" opacity="0.6" />

            {/* Launching Rocket Graphic */}
            <g transform="translate(100, 15) rotate(25)">
              {/* Flame exhaust */}
              <path d="M5,42 C7,55 3,55 5,60 C7,55 3,55 5,42 Z" fill="#ef4444" opacity="0.8"/>
              <path d="M4,42 C5,50 3,50 4,54 C5,50 3,50 4,42 Z" fill="#f59e0b" opacity="0.9"/>
              
              {/* Rocket wings */}
              <path d="M-6,30 L-12,40 L-4,38 Z" fill="#1d4ed8"/>
              <path d="M14,30 L20,40 L12,38 Z" fill="#1d4ed8"/>
              
              {/* Rocket body */}
              <rect x="-4" y="5" width="16" height="34" rx="8" fill="#3b82f6"/>
              <path d="M-4,15 L12,15 L12,39 L-4,39 Z" fill="#3b82f6"/>
              
              {/* Rocket nose cone */}
              <path d="M-4,8 C-4,8 4,-4 4,-4 C4,-4 12,8 12,8 Z" fill="#1d4ed8"/>
              
              {/* Porthole window */}
              <circle cx="4" cy="20" r="4" fill="#ffffff" stroke="#1d4ed8" strokeWidth="1.5"/>
              <circle cx="4" cy="20" r="2.5" fill="#93c5fd"/>
            </g>
          </svg>
        </div>
      </div>
      
      <style>{`
        .sidebar-scroll-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DashboardSidebar;
