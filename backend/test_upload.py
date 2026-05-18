import requests

# Change the filename below to the actual path of your resume
file_path = "Tanmay_resume.pdf"  # or "sample_resume.docx"

url = "http://127.0.0.1:5000/upload"
files = {"file": open(file_path, "rb")}

response = requests.post(url, files=files)

print("Status Code:", response.status_code)
print("Response JSON:")
print(response.json())