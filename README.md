##AstraCV – AI-Powered Resume Analyzer

AstraCV is an AI-powered resume analysis platform that helps users evaluate and improve their resumes using advanced AI models. Users can upload resumes in PDF or DOCX format and receive intelligent insights including profile summaries, skill gap analysis, ATS optimization suggestions, career recommendations, and overall resume scoring.


---

Features

Upload resumes in .pdf and .docx formats

AI-generated resume analysis

Profile summary generation

Skill gap and weakness detection

ATS optimization suggestions

Career role recommendations

Resume scoring system

Modern responsive UI/UX

Fast and seamless analysis workflow



---

Tech Stack

Frontend

React.js

Vite

Axios

CSS


Backend

Python

Flask

Flask-CORS


AI & Parsing

Google Gemini API (gemini-2.5-flash)

pdfplumber

python-docx



---

Project Architecture

Frontend (React + Vite)
        ↓
Axios API Request
        ↓
Backend (Flask API)
        ↓
Resume Parsing (PDF/DOCX)
        ↓
Google Gemini AI Analysis
        ↓
JSON Response to Frontend


---

Installation & Setup

Clone the Repository

git clone https://github.com/your-username/astracv.git
cd astracv


---

Backend Setup

Navigate to Backend

cd backend

Create Virtual Environment

python -m venv venv

Activate Virtual Environment

Windows

venv\Scripts\activate

Mac/Linux

source venv/bin/activate

Install Dependencies

pip install -r requirements.txt

Add Environment Variables

Create a .env file inside the backend folder:

GEMINI_API_KEY=your_api_key_here

Run Backend Server

python app.py


---

Frontend Setup

Navigate to Frontend

cd frontend

Install Dependencies

npm install

Run Frontend

npm run dev


---

API Endpoint

Analyze Resume

POST /analyze

Request

FormData containing resume file


Response

{
  "resume_analysis": "AI Generated Analysis"
}


---

Future Improvements

Authentication System

Resume History Dashboard

Downloadable Analysis Reports

Interview Question Suggestions

AI Chat Assistant

Resume Builder Integration

ATS Compatibility Checker

Multi-theme UI Support



---

Skills Demonstrated

AI/LLM Integration

REST API Development

Full Stack Development

Prompt Engineering

File Handling & Parsing

Responsive UI/UX Design

Frontend & Backend Integration



---

Author

Tanmay Jain
B.Tech CSE Student | Full Stack & AI Enthusiast