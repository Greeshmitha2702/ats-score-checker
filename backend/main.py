from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/score")
async def score_resume(resume : UploadFile = File(...), jd : str = Form(...)):
    return {"message": "Resume scored successfully", "resume_filename": resume.filename, "job_description": jd, "score": 85}