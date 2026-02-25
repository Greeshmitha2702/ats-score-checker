import React, {useState} from 'react';

function UploadSections(){
    const [resume, setResume] = useState(null);
    const [jd, setJd] = useState("");
    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };
    const handleJdChange = (e) => {
        setJd(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would typically send the resume and JD to the backend for processing
        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jd", jd);
        try {
            const response = await fetch("http://localhost:8000/score", {
                method: "POST",
                body: formData
            });
            const result = await response.json();
            alert(`Message: Resume uploaded, Resume: ${resume ? resume.name : "No file selected"}, JD: ${jd}, Score: ${result.score}`);        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Upload Resume:</label>
                <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            </div>
            <div>
                <label>Job Description:</label>
                <textarea rows={6} cols={50} value={jd} onChange={handleJdChange} placeholder="Enter the job description here..." />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}
export default UploadSections;