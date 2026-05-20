# Smart Resume Analyzer — AI Career Co-Pilot 🚀

An AI-powered web application that analyzes resumes and provides feedback on strengths, weaknesses, suggested career paths, and tailored improvements.

---

## 🌟 Premium Features

### 1. Dual-Theme Layout & Interface
* **Slate-Blue Light Mode**: Designed for professional, high-contrast resume evaluation matching premium dashboards.
* **Obsidian-Zinc Dark Mode**: Engineered for low-light developers and reviewers, featuring deep blacks (`#09090b`) and reactive indigo highlights.
* **Sun/Moon Theme Toggler**: Instantly switches document style states without reloading the application.

### 2. Custom Visual Vector Illustrations (Pure Inline SVG)
* **CSS-Animated Space Rocket**: A beautiful rocket launch scene with particle clouds and exhaust animation in the sidebar.
* **Glowing Trophy Vector**: A glossy trophy illustration representing rating milestones inside the score banner.
* **Foliage Checklist Clipboard**: A clean recommendations list checklist visual featuring natural leaves and board textures.

### 3. High-Fidelity Drag & Drop Upload
* Light-blue dashed dropzone supporting file selection, drop triggers, and real-time status loading bars that visually track each phase of the evaluation.
* Active status card detailing formatting file sizes (`KB/MB`), check analyzed badges, and clear tags.

### 4. Dynamic Objective Resume Evaluation
* Generates a context-aware overall score (0.0 to 10.0) based on an objective scoring scale:
  * **9.0 - 10.0**: Outstanding resume, minimal changes needed.
  * **7.5 - 8.9**: Strong resume, minor improvements suggested.
  * **5.0 - 7.4**: Average resume, significant layout or content adjustments needed.
  * **0.0 - 4.9**: Weak resume, major rewrite needed.
* Dynamically extracts `candidate_name`, `candidate_email`, rating headlines, professional summaries, four strengths, four weaknesses, four recommended roles, and four highly quantified recommendations.

---

## 🛠️ Tech Stack
* **Frontend**: React (Vite), Axios, Lucide Icons, Vanilla CSS
* **Backend**: Flask (Python), SQLAlchemy, `google-generativeai`, `pdfplumber`, `python-docx`
* **Database**: SQLite (SQLAlchemy ORM)

---

## 🚀 Setup & Execution Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Create and activate a virtual environment.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your `.env` variables inside `backend/`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=sqlite:///resume_analyzer.db
   ```
5. Launch the Flask API server:
   ```bash
   python app.py
   ```
   *The server automatically boots up on `http://127.0.0.1:5000`.*

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot up the developer local host:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173/` inside your browser to explore the dashboard!*
