import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud, FileCheck, AlertCircle, Loader2, Sparkles, Trash2, Plus, CheckCircle2 } from "lucide-react";

const ResumeUpload = ({ onUploadSuccess, candidateName }) => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState("");
  const [uploadTime, setUploadTime] = useState("");

  const phases = [
    "Uploading & extracting document text...",
    "AI career evaluator analyzing profile...",
    "Persisting rating logs to history database...",
    "Formatting resume dashboard..."
  ];

  // Rotate loading phases
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const validateAndSetFile = (selectedFile) => {
    setError("");
    const fileType = selectedFile.name.split(".").pop().toLowerCase();
    if (["pdf", "docx"].includes(fileType)) {
      setFile(selectedFile);
      setUploadTime("Uploaded just now");
    } else {
      setError("Unsupported file format. Please upload a PDF or DOCX file.");
      setFile(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select or drop a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setError("");

    // Retrieve JWT authorization token from localStorage
    const savedUser = localStorage.getItem("astracv_user");
    let token = "";
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        token = parsed.token;
      } catch (e) {
        console.error("Failed to parse stored auth token", e);
      }
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
      });
      
      if (res.data && res.data.id) {
        onUploadSuccess(res.data.id);
      } else {
        setError("Invalid response format received from backend.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not analyze resume. Check if your Flask server is running and GEMINI_API_KEY is configured.");
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setFile(null);
    setError("");
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px" }} className="animate-slide-in">
      {/* 1. Header Greeting section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--text-main)", fontFamily: "var(--font-heading)" }}>
            Hello, {candidateName ? candidateName.split(" ")[0] : "User"}! 👋
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Upload your resume and get AI-powered insights instantly.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "14px",
            borderRadius: "12px",
            backgroundColor: "var(--error-glow)",
            border: "1px solid var(--error)",
            color: "var(--text-main)",
            fontSize: "0.9rem",
          }}
        >
          <AlertCircle size={18} color="var(--error)" style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Dashed Dropzone Card */}
      {!loading && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input").click()}
          style={{
            border: isDragActive ? "2px dashed var(--primary)" : "2px dashed #bfdbfe",
            borderRadius: "16px",
            padding: "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: isDragActive ? "var(--primary-glow)" : "rgba(37, 99, 235, 0.01)",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <input
            id="file-input"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.docx"
            style={{ display: "none" }}
          />

          {/* Sparkles Floating Folder SVG */}
          <div style={{ position: "relative", width: "100px", height: "80px", display: "flex", justifyContent: "center" }} className="float-animation">
            <svg width="90" height="75" viewBox="0 0 90 75" fill="none">
              {/* Sparkles */}
              <circle cx="15" cy="20" r="1.5" fill="#3b82f6" opacity="0.6"/>
              <circle cx="80" cy="55" r="1" fill="#60a5fa"/>
              <path d="M75,15 L76.5,16.5 L75,18 L73.5,16.5 Z" fill="#60a5fa" opacity="0.8"/>
              
              {/* Folder Back body */}
              <path d="M5,15 C5,10 10,10 14,10 L30,10 C34,10 38,15 42,15 L80,15 C85,15 85,20 85,24 L85,65 C85,70 80,70 75,70 L15,70 C10,70 5,70 5,65 Z" fill="#2563eb" />
              
              {/* Emerging document paper */}
              <rect x="22" y="5" width="46" height="42" rx="4" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1" />
              <line x1="28" y1="12" x2="62" y2="12" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="20" x2="54" y2="20" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="28" x2="44" y2="28" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />

              {/* Folder Front flap */}
              <path d="M5,24 C5,20 10,20 14,20 L76,20 C80,20 85,20 85,24 L81,66 C81,70 76,70 72,70 L18,70 C14,70 9,70 9,66 Z" fill="#3b82f6" />
              
              {/* Circular Arrow badge */}
              <circle cx="50" cy="46" r="11" fill="#2563eb" />
              <path d="M50,40 L50,52 M46,45 L50,40 L54,45" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p style={{ fontWeight: "700", fontSize: "1.25rem", color: "var(--text-main)", fontFamily: "var(--font-heading)" }}>
              Drag & drop your resume here
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-dark)", fontWeight: "500" }}>or</p>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{
              padding: "10px 24px",
              fontSize: "0.88rem",
            }}
          >
            Browse Files
          </button>

          <p style={{ fontSize: "0.78rem", color: "var(--text-dark)", fontWeight: "500", marginTop: "4px" }}>
            Supported formats: PDF, DOCX (Max. 10MB)
          </p>
        </div>
      )}

      {/* Loading dashboard parser progress bar */}
      {loading && (
        <div
          className="premium-card"
          style={{
            padding: "64px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Loader2
            size={48}
            color="var(--primary)"
            style={{
              animation: "spinSlow 1.4s linear infinite",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <h4 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "6px", fontFamily: "var(--font-heading)" }}>
              Analyzing Resume
            </h4>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
                minHeight: "24px",
              }}
            >
              {phases[loadingPhase]}
            </p>
          </div>
          {/* Custom percentage metrics loader bar */}
          <div
            style={{
              width: "240px",
              height: "5px",
              backgroundColor: "var(--bg-input)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${((loadingPhase + 1) / phases.length) * 100}%`,
                height: "100%",
                backgroundColor: "var(--primary)",
                borderRadius: "3px",
                transition: "width 1s ease-in-out",
              }}
            />
          </div>
        </div>
      )}

      {/* 3. Active Uploaded File card list */}
      {file && !loading && (
        <div
          className="premium-card animate-slide-in"
          style={{
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: "1px solid var(--border-card)",
            backgroundColor: "var(--bg-card)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Custom file type PDF/DOCX graphic */}
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: file.name.endsWith(".pdf") ? "rgba(239, 68, 68, 0.08)" : "rgba(37, 99, 235, 0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileCheck
                size={22}
                color={file.name.endsWith(".pdf") ? "var(--error)" : "var(--primary)"}
              />
            </div>
            
            {/* Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontWeight: "700", fontSize: "0.95rem", color: "var(--text-main)" }}>
                {file.name}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-dark)", fontWeight: "500" }}>
                {formatFileSize(file.size)} &bull; {uploadTime}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Checked Analyzed pill badge */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                backgroundColor: "var(--success-glow)",
                color: "var(--success)",
                fontSize: "0.75rem",
                fontWeight: "700",
                padding: "5px 12px",
                borderRadius: "20px",
                border: "1px solid rgba(16, 185, 129, 0.12)",
              }}
            >
              <CheckCircle2 size={12} />
              <span>Analyzed</span>
            </span>

            {/* Trash Delete button */}
            <button
              onClick={handleClear}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-dark)",
                padding: "6px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--error)";
                e.currentTarget.style.backgroundColor = "var(--error-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-dark)";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              title="Remove File"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Analyze button to submit file */}
      {file && !loading && (
        <button
          onClick={handleUpload}
          className="btn-primary"
          style={{
            width: "100%",
            justifyContent: "center",
            padding: "14px",
            fontSize: "1rem",
          }}
        >
          Analyze Resume
        </button>
      )}
    </div>
  );
};

export default ResumeUpload;
