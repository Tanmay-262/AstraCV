import React, { useState } from "react";
import axios from "axios";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data.resume_analysis);
    } catch (err) {
      console.error(err);
      alert("Error uploading file. Check if Flask server is running.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Smart Resume Analyzer</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf,.txt,.docx" />
      <br />
      <button onClick={handleUpload} style={{ marginTop: "10px" }}>
        Upload Resume
      </button>

      {response && (
        <div style={{ marginTop: "30px", textAlign: "left", padding: "20px" }}>
          <h3>Resume Analysis:</h3>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
