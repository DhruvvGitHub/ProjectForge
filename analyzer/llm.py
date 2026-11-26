import os
import json
from typing import Dict, Any, Optional
import httpx

EVALUATION_SYSTEM_PROMPT = """You are a senior engineering hiring director and technical evaluator reviewing a candidate's GitHub repository for campus placements.
You are provided with:
1. Deterministic code inspection measurements (architecture scores, presence of tests, detected secrets/flags, modular directories, git commit depth).
2. The repository README content (if available).
3. Selected key file contents or directory layout.

Your job is to provide rigorous, evidence-backed evaluation that students can use to improve their interview readiness, and recruiters can use to assess the candidate.

Do not write generic platitudes like "good job" without pointing to concrete evidence in the measurements.
Output strictly valid JSON with this exact schema:
{
  "summary": "1-2 sentence executive appraisal of the repository's placement readiness.",
  "strengths": ["List of 3 concrete architectural or engineering strengths verified by evidence"],
  "improvements": ["List of 3 specific technical areas that need work before technical interviews"],
  "interviewQuestions": [
    "3 specific, tough technical interview questions a recruiter would ask based on this code and tech stack"
  ],
  "productionReadinessVerdict": "READY" | "NEEDS_IMPROVEMENT" | "NOT_READY"
}
"""

def generate_ai_feedback(metrics: Dict[str, Any], readme_snippet: str = "") -> Optional[Dict[str, Any]]:
    api_key = os.getenv("GROQ_API_KEY")
    base_url = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1").rstrip("/")
    model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    # Graceful fallback to deterministic synthesis if API key is not yet set
    if not api_key:
        return {
            "summary": f"Automated static audit completed with readiness score of {metrics['score']}/100.",
            "strengths": metrics["metrics"]["architecture"].get("observations", []) + metrics["metrics"]["testing"].get("observations", []),
            "improvements": metrics["metrics"]["architecture"].get("flags", []) + metrics["metrics"]["security"].get("flags", []) + (["Add automated unit/integration tests"] if not metrics["metrics"]["testing"].get("has_tests") else []),
            "interviewQuestions": [
                "Explain the architecture and data flow between client and server layers in this project.",
                "How do you handle production error boundaries and database connection pooling?",
                "What testing strategy would you implement to reach 80%+ code coverage on critical paths?"
            ],
            "productionReadinessVerdict": "READY" if metrics["score"] >= 75 else ("NEEDS_IMPROVEMENT" if metrics["score"] >= 50 else "NOT_READY")
        }

    try:
        user_prompt = f"""
Repository Audit Evidence:
- Overall Deterministic Score: {metrics['score']}/100
- Badge: {metrics['badge']}
- Architecture: {json.dumps(metrics['metrics']['architecture'], indent=2)}
- Testing: {json.dumps(metrics['metrics']['testing'], indent=2)}
- Security: {json.dumps(metrics['metrics']['security'], indent=2)}
- Git History: {json.dumps(metrics['metrics']['git'], indent=2)}

README Excerpt:
{readme_snippet[:3000] if readme_snippet else "No README available."}
"""

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": EVALUATION_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.2,
        }

        with httpx.Client(timeout=45.0) as client:
            response = client.post(f"{base_url}/chat/completions", headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return json.loads(content)

    except Exception as e:
        print(f"[Groq Feedback Error]: {e}")
        return {
            "summary": f"Audit completed with score {metrics['score']}/100. (LLM synthesis fallback: {str(e)[:80]})",
            "strengths": metrics["metrics"]["architecture"].get("observations", []),
            "improvements": metrics["metrics"]["architecture"].get("flags", []) + metrics["metrics"]["security"].get("flags", []),
            "interviewQuestions": [
                "Explain how you structured your application logic and separation of concerns.",
                "What security best practices were implemented regarding API keys and env configurations?",
                "How would you scale this application under 1,000 requests per second?"
            ],
            "productionReadinessVerdict": "READY" if metrics["score"] >= 75 else "NEEDS_IMPROVEMENT"
        }
