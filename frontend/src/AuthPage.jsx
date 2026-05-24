import React, { useState } from "react";
import { Mail, Lock, User, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";

export function AuthPage({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isSignUp 
      ? "http://127.0.0.1:5000/auth/signup" 
      : "http://127.0.0.1:5000/auth/login";

    const payload = isSignUp 
      ? { name, email, password } 
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Save to local storage for persistence
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          token: data.token
        };
        localStorage.setItem("astracv_user", JSON.stringify(userData));
        onAuthSuccess(userData);
      } else {
        setError(data.error || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError("Unable to connect to the authentication server. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="auth-wrapper">
      {/* Background Animated Gradient Mesh */}
      <div className="mesh-bg">
        <div className="mesh-orb orb-1"></div>
        <div className="mesh-orb orb-2"></div>
        <div className="mesh-orb orb-3"></div>
      </div>

      <div className="auth-container">
        {/* Left Side Branding Panel */}
        <div className="auth-brand-panel">
          <div className="brand-header">
            <div className="brand-logo-glow">
              <Sparkles size={26} color="#ffffff" />
            </div>
            <span className="brand-title">Astra<span className="brand-accent">CV</span></span>
          </div>

          <div className="brand-content">
            <h1 className="brand-headline">
              Analyze your resume with <span className="highlight-gradient">AI Precision</span>
            </h1>
            <p className="brand-description">
              Upload your CV, calculate real-time ATS compatibility scores, and unlock professional enhancement recommendations tailored to top tech standards.
            </p>
          </div>

          <div className="brand-footer">
            <div className="footer-metric">
              <span className="metric-val">88%</span>
              <span className="metric-lbl">Avg. Match Rate</span>
            </div>
            <div className="footer-divider"></div>
            <div className="footer-metric">
              <span className="metric-val">Gemini Pro</span>
              <span className="metric-lbl">Co-Pilot Intelligence</span>
            </div>
          </div>
        </div>

        {/* Right Side Form Panel */}
        <div className="auth-form-panel">
          <form className="auth-form animate-slide-in" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
              <p>{isSignUp ? "Get started with your free profile today" : "Sign in to access your resume history"}</p>
            </div>

            {error && <div className="auth-error-banner">{error}</div>}

            <div className="form-inputs">
              {isSignUp && (
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <div className="input-field">
                    <User size={18} className="input-icon" />
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="Jane Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-field">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="jane.doe@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="input-field">
                  <Lock size={18} className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary auth-submit-btn" 
              disabled={loading}
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>{isSignUp ? "Create Free Account" : "Sign In to Dashboard"}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="auth-switch-footer">
              <span>{isSignUp ? "Already have an account?" : "New to AstraCV?"}</span>
              <button 
                type="button" 
                className="auth-switch-btn"
                onClick={toggleAuthMode}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Embedded Component-level CSS Styles */}
      <style>{`
        .auth-wrapper {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background-color: var(--bg-main);
          font-family: var(--font-body);
          padding: 24px;
        }

        /* Animated Mesh background shapes */
        .mesh-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 1;
        }

        .mesh-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
          mix-blend-mode: screen;
          animation: floatAnim 10s ease-in-out infinite;
        }

        .orb-1 {
          top: -10%;
          left: 10%;
          width: 450px;
          height: 450px;
          background: #3b82f6;
        }

        .orb-2 {
          bottom: -10%;
          right: 15%;
          width: 500px;
          height: 500px;
          background: #6366f1;
          animation-delay: -3s;
        }

        .orb-3 {
          top: 30%;
          left: 60%;
          width: 350px;
          height: 350px;
          background: #8b5cf6;
          animation-delay: -6s;
        }

        /* Responsive Dashboard Auth Card */
        .auth-container {
          width: 1000px;
          max-width: 100%;
          min-height: 580px;
          display: flex;
          background: rgba(var(--bg-card), 0.7);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid var(--border-card);
          border-radius: 28px;
          box-shadow: var(--shadow-premium);
          z-index: 10;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        /* Left side branding layout */
        .auth-brand-panel {
          flex: 1.1;
          background: linear-gradient(145deg, #0f172a 0%, #1e1b4b 100%);
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #ffffff;
          position: relative;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo-glow {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
        }

        .brand-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.02em;
        }

        .brand-accent {
          color: #3b82f6;
        }

        .brand-content {
          margin: 40px 0;
        }

        .brand-headline {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 2.2rem;
          line-height: 1.25;
          margin-bottom: 20px;
          color: #ffffff;
        }

        .highlight-gradient {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-description {
          font-size: 0.95rem;
          color: #94a3b8;
          line-height: 1.6;
        }

        .brand-footer {
          display: flex;
          align-items: center;
          gap: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 24px;
        }

        .footer-metric {
          display: flex;
          flex-direction: column;
        }

        .metric-val {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 700;
          color: #ffffff;
        }

        .metric-lbl {
          font-size: 0.72rem;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .footer-divider {
          height: 32px;
          width: 1px;
          background-color: rgba(255, 255, 255, 0.1);
        }

        /* Right side Form layouts */
        .auth-form-panel {
          flex: 1;
          padding: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-card);
        }

        .auth-form {
          width: 100%;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .form-header h2 {
          font-size: 1.85rem;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 6px;
        }

        .form-header p {
          font-size: 0.88rem;
          color: var(--text-muted);
        }

        .auth-error-banner {
          padding: 12px 16px;
          background-color: var(--error-glow);
          border: 1px solid var(--error);
          color: var(--error);
          font-size: 0.82rem;
          font-weight: 500;
          border-radius: 10px;
          line-height: 1.4;
        }

        .form-inputs {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .input-field {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-dark);
          pointer-events: none;
        }

        .input-field input {
          width: 100%;
          height: 48px;
          padding: 0 44px;
          border-radius: 12px;
          border: 1px solid var(--border-card);
          background-color: var(--bg-input);
          color: var(--text-main);
          font-size: 0.92rem;
          font-family: var(--font-body);
          transition: all 0.2s ease;
        }

        .input-field input:focus {
          outline: none;
          border-color: var(--primary);
          background-color: var(--bg-card);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .password-toggle-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: var(--text-dark);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }

        .password-toggle-btn:hover {
          color: var(--text-main);
        }

        .auth-submit-btn {
          width: 100%;
          height: 48px;
          justify-content: center;
          border-radius: 12px;
          margin-top: 8px;
        }

        .auth-switch-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-top: 8px;
        }

        .auth-switch-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .auth-switch-btn:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }

        /* Responsive styling */
        @media (max-width: 900px) {
          .auth-brand-panel {
            display: none;
          }
          .auth-container {
            width: 480px;
            min-height: auto;
          }
          .auth-form-panel {
            padding: 36px 24px;
          }
        }
      `}</style>
    </div>
  );
}
