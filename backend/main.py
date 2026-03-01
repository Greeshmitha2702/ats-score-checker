from fastapi import FastAPI, File, UploadFile, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

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

@app.post("/score")
async def score_resume(resume : UploadFile = File(...), jd : str = Form(...)):
    # Save submission data to MongoDB
    submission_data = {
        "resume_filename": resume.filename,
        "job_description": jd,
        "score": 85
    }
    submissions_collection.insert_one(submission_data)
    return {"message": "Resume scored successfully", "resume_filename": resume.filename, "job_description": jd, "score": 85}

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