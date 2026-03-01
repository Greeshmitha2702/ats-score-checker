from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import pdfplumber 
from docx import Document

client = MongoClient("mongodb://localhost:27017/")
db = client["ats_db"]
submissions_collection = db["submissions"]
users_collection = db["users"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup")
async def signup(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return {"success": False, "message": "Username and password required"}
    # Check if user already exists
    if users_collection.find_one({"username": username}):
        return {"success": False, "message": "Username already exists"}
    # Insert new user
    users_collection.insert_one({"username": username, "password": password})
    return {"success": True, "message": "Signup successful"}

def extract_text_from_resume(file: UploadFile):
    if file.filename.endswith('.pdf'):
        with pdfplumber.open(file.file) as pdf:
            text = ''
            for page in pdf.pages:
                text += page.extract_text() or ''
        return text
    elif file.filename.endswith('.docx'):
        doc = Document(file.file)
        text = '\n'.join([para.text for para in doc.paragraphs])
        return text
    else:
        return None  # Unsupported file type
    
def calculate_score(resume_text, jd_text):
    # Split JD into keywords (simple split by space, you can improve this)
    jd_keywords = set(jd_text.lower().split())
    resume_words = set(resume_text.lower().split())
    # Count how many JD keywords are in the resume
    matched = jd_keywords & resume_words
    if not jd_keywords:
        return 0
    score = int((len(matched) / len(jd_keywords)) * 100)
    return score

@app.post("/score")
async def score_resume(resume : UploadFile = File(...), jd : str = Form(...)):
    # Save submission data to MongoDB
    submission_data = {
        "resume_filename": resume.filename,
        "score": calculate_score(extract_text_from_resume(resume), jd)
    }
    submissions_collection.insert_one(submission_data)
    return {"message": "Resume scored successfully", "resume_filename": resume.filename, "score": submission_data["score"]}

@app.get("/history")
async def get_history():
    history = list(submissions_collection.find({}, {"_id": 0}))
    return {"history": history}

@app.post("/login")
async def login(request: Request):
    data = await request.json()
    username = data.get("username")
    password = data.get("password")
    # Check MongoDB for user
    user = users_collection.find_one({"username": username, "password": password})
    if user:
        return {"success": True, "message": "Login successful"}
    else:
        return {"success": False, "message": "Invalid credentials"}