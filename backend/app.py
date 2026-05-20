from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

app = Flask(__name__)
CORS(app)
load_dotenv()

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Database Model
class ResumeAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    raw_text = db.Column(db.Text, nullable=False)
    analysis_result = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

# Create tables if they don't exist
with app.app_context():
    db.create_all()

import json

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs])

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files['file']
        file_path = os.path.join("uploads", file.filename)
        os.makedirs("uploads", exist_ok=True)
        file.save(file_path)

        if file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(file_path)
        elif file.filename.endswith('.docx'):
            text = extract_text_from_docx(file_path)
        else:
            return jsonify({"error": "Unsupported file type"}), 400

        # Configure model to force JSON output
        model = genai.GenerativeModel(
            "gemini-2.5-flash",
            generation_config={"response_mime_type": "application/json"}
        )

        prompt = f"""
        You are an expert AI resume evaluator and career co-pilot.
        Analyze the following resume text and provide a highly objective, professional assessment.
        
        You MUST return your response as a valid JSON object matching the following structure:
        {{
          "summary": "A concise, 3-4 sentence professional summary of the candidate's background and expertise.",
          "strengths": [
            "Highlight specific strengths and how they appear in the resume."
          ],
          "weaknesses": [
            "Detail missing skills, weak phrasing, or areas that can be improved."
          ],
          "suggested_roles": [
            "Job Title 1",
            "Job Title 2"
          ],
          "overall_score": 7.5
        }}

        Note: overall_score must be a float or integer between 0.0 and 10.0 representing the quality of the resume.

        Resume Text:
        {text}
        """

        response = model.generate_content(prompt)

        # Save to database
        new_analysis = ResumeAnalysis(
            filename=file.filename,
            raw_text=text,
            analysis_result=response.text
        )
        db.session.add(new_analysis)
        db.session.commit()

        return jsonify({
            "id": new_analysis.id,
            "resume_analysis": response.text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyses', methods=['GET'])
def get_analyses():
    try:
        analyses = ResumeAnalysis.query.order_by(ResumeAnalysis.created_at.desc()).all()
        result = []
        for a in analyses:
            score = None
            try:
                data = json.loads(a.analysis_result)
                score = data.get("overall_score")
            except Exception:
                # Graceful fallback for old text-based records
                pass
            result.append({
                "id": a.id,
                "filename": a.filename,
                "created_at": a.created_at.isoformat(),
                "overall_score": score
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analyses/<int:analysis_id>', methods=['GET'])
def get_analysis_detail(analysis_id):
    try:
        analysis = ResumeAnalysis.query.filter_by(id=analysis_id).first()
        if not analysis:
            return jsonify({"error": "Analysis not found"}), 404
        return jsonify({
            "id": analysis.id,
            "filename": analysis.filename,
            "raw_text": analysis.raw_text,
            "analysis_result": analysis.analysis_result,
            "created_at": analysis.created_at.isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

