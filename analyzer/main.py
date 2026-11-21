import os
import shutil
import tempfile
import subprocess
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv

from engine import run_deterministic_inspection
from llm import generate_ai_feedback

load_dotenv()

app = FastAPI(title="ProjectForge Analysis Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    submissionId: int
    repoUrl: str
    callbackUrl: str
    callbackSecret: str

async def process_repository_analysis(req: AnalyzeRequest):
    temp_dir = tempfile.mkdtemp(prefix=f"forge_{req.submissionId}_")
    try:
        print(f"[{req.submissionId}] Starting git clone for: {req.repoUrl}")
        # Clone with depth 50 to inspect commit history and file structure
        clone_res = subprocess.run(
            ["git", "clone", "--depth", "50", req.repoUrl, temp_dir],
            capture_output=True,
            text=True,
            timeout=120,
        )

        if clone_res.returncode != 0:
            error_msg = f"Failed to clone repository: {clone_res.stderr.strip()}"
            print(f"[{req.submissionId}] Error: {error_msg}")
            payload = {
                "status": "FAILED",
                "errorMessage": error_msg,
            }
        else:
            print(f"[{req.submissionId}] Running deterministic inspection suite...")
            result = run_deterministic_inspection(Path(temp_dir))

            # Read README if present
            readme_text = ""
            for name in ["README.md", "readme.md", "README", "readme.txt"]:
                rm_path = Path(temp_dir) / name
                if rm_path.exists():
                    try:
                        readme_text = rm_path.read_text(encoding="utf-8", errors="ignore")
                        break
                    except Exception:
                        pass

            print(f"[{req.submissionId}] Generating evidence-backed AI evaluation...")
            feedback = generate_ai_feedback(result, readme_text)

            payload = {
                "status": "COMPLETED",
                "score": result["score"],
                "badge": result["badge"],
                "metrics": result["metrics"],
                "feedback": feedback,
            }

        # Post callback to Node backend
        print(f"[{req.submissionId}] Delivering callback to {req.callbackUrl}")
        async with httpx.AsyncClient(timeout=30) as client:
            cb_res = await client.post(
                req.callbackUrl,
                json=payload,
                headers={"x-analysis-secret": req.callbackSecret},
            )
            print(f"[{req.submissionId}] Backend callback responded: {cb_res.status_code}")

    except Exception as e:
        print(f"[{req.submissionId}] Unexpected exception during analysis: {e}")
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                await client.post(
                    req.callbackUrl,
                    json={"status": "FAILED", "errorMessage": str(e)},
                    headers={"x-analysis-secret": req.callbackSecret},
                )
        except Exception as inner:
            print(f"[{req.submissionId}] Failed to send error callback: {inner}")
    finally:
        # Clean up temporary cloned repository
        try:
            shutil.rmtree(temp_dir, ignore_errors=True)
            print(f"[{req.submissionId}] Cleaned up temp workspace.")
        except Exception:
            pass

@app.get("/health")
def health():
    return {"status": "ok", "service": "ProjectForge Python Analyzer"}

@app.post("/analyze")
def start_analysis(req: AnalyzeRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(process_repository_analysis, req)
    return {"message": "Analysis started in background", "submissionId": req.submissionId}
