import React, { useState } from "react";
import HistorySidebar from "./HistorySidebar";
import ResumeUpload from "./ResumeUpload";
import AnalysisDashboard from "./AnalysisDashboard";
import "./App.css";

function App() {
  const [activeId, setActiveId] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [refreshSidebar, setRefreshSidebar] = useState(0);

  const handleSelectAnalysis = async (id) => {
    setActiveId(id);
    try {
      const res = await fetch(`http://127.0.0.1:5000/analyses/${id}`);
      if (res.ok) {
        const data = await res.json();
        setActiveAnalysis(data);
      } else {
        console.error("Failed to load analysis detail");
      }
    } catch (err) {
      console.error("Error fetching analysis detail:", err);
    }
  };

  const handleUploadSuccess = (id) => {
    // Refresh sidebar history list
    setRefreshSidebar((prev) => prev + 1);
    // Load the newly analyzed resume automatically
    handleSelectAnalysis(id);
  };

  const handleNewAnalysis = () => {
    setActiveId(null);
    setActiveAnalysis(null);
  };

  return (
    <div className="app-container">
      {/* Sidebar Panel */}
      <HistorySidebar
        activeId={activeId}
        onSelectAnalysis={handleSelectAnalysis}
        onNewAnalysis={handleNewAnalysis}
        refreshTrigger={refreshSidebar}
      />

      {/* Main Panel Content */}
      <main className="main-content">
        {activeAnalysis ? (
          <AnalysisDashboard analysis={activeAnalysis} />
        ) : (
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
        )}
      </main>
    </div>
  );
}

export default App;
