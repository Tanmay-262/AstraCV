import requests
import json

# Change the filename below to the actual path of your resume
file_path = "Tanmay_resume.pdf"  # or "sample_resume.docx"

url = "http://127.0.0.1:5000/analyze"
files = {"file": open(file_path, "rb")}

response = requests.post(url, files=files)

print("Status Code:", response.status_code)
try:
    data = response.json()
    with open("test_response.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Response written to test_response.json successfully!")
except Exception as e:
    print("Error parsing/writing JSON:", e)
    print("Raw content:", response.content[:500])