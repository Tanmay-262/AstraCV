from flask import Flask, request, jsonify
from flask_cors import CORS
import pdfplumber
import docx
import os
from dotenv import load_dotenv
import google.generativeai as genai

app = Flask(__name__)
CORS(app)
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

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

        model = genai.GenerativeModel("gemini-2.5-flash")

        prompt = f"""
        You are an AI resume evaluator. Analyze this resume text and provide:
        1. Summary of the candidate’s profile.
        2. Key strengths.
        3. Weaknesses or missing skills.
        4. Suggested career roles.
        5. Overall score out of 10.

        Resume Text:
        {text}
        """

        response = model.generate_content(prompt)

        return jsonify({
            "resume_analysis": response.text
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
