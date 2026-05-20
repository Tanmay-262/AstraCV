import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud, FileCheck, AlertCircle, Loader2, Sparkles } from "lucide-react";

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [error, setError] = useState("");

  const phases = [
    "Uploading & extracting document text...",
    "AI career evaluator analyzing profile...",
    "Persisting rating logs to history database...",
    "Formatting resume dashboard..."
  ];

  // Rotate through loading phases to keep user engaged
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhase((prev) => (prev < phases.length - 1 ? prev + 1 : prev));
      }, 1600);
    } else {
      setLoadingPhase(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError("");
    const fileType = selectedFile.name.split(".").pop().toLowerCase();
    if (["pdf", "docx"].includes(fileType)) {
      setFile(selectedFile);
    } else {
      setError("Unsupported file format. Please upload a PDF or DOCX file.");
      setFile(null);
    }
  };

  // Drag and Drop handlers
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

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto 0", width: "100%" }} className="animate-slide-in">
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div
          style={{
            display: "inline-flex",
            padding: "10px",
            borderRadius: "50%",
            backgroundColor: "var(--primary-glow)",
            marginBottom: "16px",
          }}
        >
          <Sparkles size={32} color="var(--primary)" />
        </div>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "800", fontFamily: "var(--font-heading)" }}>
          AI Resume Evaluator
        </h2>
        <p style={{ color: "var(--text-muted)", marginTop: "8px", fontSize: "1rem" }}>
          Upload your resume in PDF or DOCX format to receive structured AI ratings, key strengths, and missing skills.
        </p>
      </div>

      <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Error Banner */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px",
              borderRadius: "10px",
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

        {/* Drag and Drop Zone */}
        {!loading && (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
            style={{
              border: isDragActive ? "2px dashed var(--primary)" : "2px dashed var(--border-card)",
              borderRadius: "12px",
              padding: "48px 24px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: isDragActive ? "rgba(99, 102, 241, 0.03)" : "rgba(255, 255, 255, 0.01)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isDragActive) e.currentTarget.style.borderColor = "var(--text-dark)";
            }}
            onMouseLeave={(e) => {
              if (!isDragActive) e.currentTarget.style.borderColor = "var(--border-card)";
            }}
          >
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx"
              style={{ display: "none" }}
            />
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
              <UploadCloud size={48} color={isDragActive ? "var(--primary)" : "var(--text-dark)"} />
              
              {file ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--success)" }}>
                  <FileCheck size={18} />
                  <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>{file.name}</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <p style={{ fontWeight: "600", fontSize: "1rem" }}>
                    Drag & drop your resume here, or <span style={{ color: "var(--primary)" }}>browse</span>
                  </p>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-dark)" }}>
                    Supports PDF, DOCX (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading display */}
        {loading && (
          <div
            style={{
              padding: "48px 24px",
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
                animation: "spinSlow 1.5s linear infinite",
              }}
            />
            <div style={{ textAlign: "center" }}>
              <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "6px" }}>Analyzing Resume</h4>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                  minHeight: "24px",
                }}
              >
                {phases[loadingPhase]}
              </p>
            </div>
            {/* Custom mini progress bar */}
            <div
              style={{
                width: "200px",
                height: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${((loadingPhase + 1) / phases.length) * 100}%`,
                  height: "100%",
                  backgroundColor: "var(--primary)",
                  borderRadius: "2px",
                  transition: "width 1.2s ease-in-out",
                }}
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        {!loading && (
          <button
            onClick={handleUpload}
            className="btn-primary"
            disabled={!file}
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            Analyze Resume
          </button>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
