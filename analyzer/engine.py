import os
import re
import json
import subprocess
from pathlib import Path
from typing import Dict, Any, List

def analyze_git_history(repo_dir: Path) -> Dict[str, Any]:
    git_dir = repo_dir / ".git"
    if not git_dir.exists():
        return {
            "score": 40,
            "commit_count": 0,
            "has_multiple_commits": False,
            "observations": ["No .git history found or shallow single-commit snapshot."]
        }
    
    try:
        result = subprocess.run(
            ["git", "rev-list", "--count", "HEAD"],
            cwd=str(repo_dir),
            capture_output=True,
            text=True,
            timeout=10,
        )
        commit_count = int(result.stdout.strip()) if result.returncode == 0 else 0
    except Exception:
        commit_count = 0

    observations = []
    if commit_count > 20:
        score = 95
        observations.append(f"Strong iterative commit history detected with({commit_count} commits).")
    elif commit_count >= 10:
        score = 75
        observations.append(f"Moderate commit progression detected with({commit_count} commits).")
    elif commit_count >= 5:
        score = 50
        observations.append(f"Low commit count with ({commit_count} commits); looks like an initial bulk dump.")
    else:
        score = 30
        observations.append("Unable to determine commit count.")

    return {
        "score": score,
        "commit_count": commit_count,
        "has_multiple_commits": commit_count > 3,
        "observations": observations
    }

def analyze_architecture_and_structure(repo_dir: Path) -> Dict[str, Any]:
    all_files = []
    for p in repo_dir.rglob("*"):
        if ".git" in p.parts:
            continue
        all_files.append(p)

    file_names = {p.name.lower() for p in all_files if p.is_file()}
    dir_names = {p.name.lower() for p in all_files if p.is_dir()}

    score = 50
    observations = []
    flags = []

    # Config hygiene
    has_gitignore = ".gitignore" in file_names
    has_readme = any("readme" in f for f in file_names)
    has_env_example = any(".env.example" in f or ".env.sample" in f or ".env.template" in f for f in file_names)
    has_leaked_env = any(f == ".env" or f == ".env.local" for f in file_names)

    if has_gitignore:
        score += 10
        observations.append(".gitignore is configured.")
    else:
        score -= 10
        flags.append("Missing .gitignore file.")

    if has_readme:
        score += 10
        observations.append("README file present.")
    else:
        score -= 15
        flags.append("No README found.")

    if has_env_example:
        score += 10
        observations.append("Environment template file (.env.example) provided.")

    if has_leaked_env:
        score -= 25
        flags.append("CRITICAL: Committed .env file detected in repository.")

    # Structure modularity
    modular_indicators = {"src", "client", "server", "routes", "controllers", "models", "services", "api", "components", "lib", "utils"}
    found_modular = dir_names.intersection(modular_indicators)

    if len(found_modular) >= 5:
        score += 20
        observations.append(f"Well-structured modular organization: {', '.join(sorted(found_modular))}.")
    elif len(found_modular) >= 3:
        score += 10
        observations.append(f"Basic directory separation present ({', '.join(sorted(found_modular))}).")
    else:
        flags.append("Flat or disorganized project structure.")

    # Check for checked-in clutter
    if "node_modules" in dir_names:
        score -= 20
        flags.append("Anti-pattern: node_modules folder is committed to git.")
    if "__pycache__" in dir_names:
        score -= 10
        flags.append("Anti-pattern: __pycache__ directory committed.")

    final_score = max(10, min(100, score))
    return {
        "score": final_score,
        "has_readme": has_readme,
        "has_gitignore": has_gitignore,
        "has_env_example": has_env_example,
        "leaked_env": has_leaked_env,
        "modular_folders": list(found_modular),
        "observations": observations,
        "flags": flags
    }

def analyze_testing(repo_dir: Path) -> Dict[str, Any]:
    test_files = []
    implementation_files = []
    
    code_exts = {".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".java", ".cpp", ".c", ".rs"}
    
    for p in repo_dir.rglob("*"):
        if ".git" in p.parts or "node_modules" in p.parts or "dist" in p.parts or "build" in p.parts:
            continue
        if p.is_file() and p.suffix.lower() in code_exts:
            name_lower = p.name.lower()
            if "test" in name_lower or "spec" in name_lower:
                test_files.append(str(p.name))
            else:
                implementation_files.append(str(p.name))

    has_tests = len(test_files) > 0
    observations = []
    if has_tests:
        test_ratio = len(test_files) / max(1, len(implementation_files))
        if test_ratio >= 0.2:
            score = 90
            observations.append(f"Strong testing coverage indicators ({len(test_files)} test/spec files).")
        else:
            score = 70
            observations.append(f"Testing files detected ({len(test_files)} test/spec files).")
    else:
        score = 25
        observations.append("No automated test suite or spec files detected.")

    return {
        "score": score,
        "has_tests": has_tests,
        "test_file_count": len(test_files),
        "code_file_count": len(implementation_files),
        "observations": observations
    }

def analyze_security_and_secrets(repo_dir: Path) -> Dict[str, Any]:
    secret_patterns = [
        ("AWS Access Key", re.compile(r"AKIA[0-9A-Z]{16}")),
        ("Stripe Secret Key", re.compile(r"sk_live_[0-9a-zA-Z]{24}")),
        ("Generic Private Key", re.compile(r"-----BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY-----")),
        ("Hardcoded Password in URL", re.compile(r"postgres(ql)?:\/\/[a-zA-Z0-9_-]+:[^@\s]+@[a-zA-Z0-9.-]+")),
    ]

    security_flags = []
    scanned_files = 0
    
    # Text file check
    for p in repo_dir.rglob("*"):
        if ".git" in p.parts or "node_modules" in p.parts or "dist" in p.parts or "build" in p.parts:
            continue
        if p.is_file() and p.stat().st_size < 500_000: # under 500KB
            try:
                content = p.read_text(encoding="utf-8", errors="ignore")
                scanned_files += 1
                for name, pat in secret_patterns:
                    if pat.search(content):
                        security_flags.append(f"Potential {name} detected in `{p.name}`.")
            except Exception:
                pass

    if security_flags:
        score = 30
    else:
        score = 95

    return {
        "score": score,
        "passed": len(security_flags) == 0,
        "flags": security_flags,
        "scanned_files": scanned_files
    }

def run_deterministic_inspection(repo_dir: Path) -> Dict[str, Any]:
    arch = analyze_architecture_and_structure(repo_dir)
    git_hist = analyze_git_history(repo_dir)
    testing = analyze_testing(repo_dir)
    security = analyze_security_and_secrets(repo_dir)

    # Weighted calculation:
    # Architecture: 30%
    # Testing: 25%
    # Security: 25%
    # Git History: 20%
    total_score = round(
        arch["score"] * 0.30 +
        testing["score"] * 0.25 +
        security["score"] * 0.25 +
        git_hist["score"] * 0.20
    )

    total_score = max(0, min(100, total_score))

    if total_score >= 90:
        badge = "ELITE"
    elif total_score >= 80:
        badge = "GOLD"
    elif total_score >= 70:
        badge = "SILVER"
    elif total_score >= 50:
        badge = "BRONZE"
    else:
        badge = "NEEDS_WORK"

    return {
        "score": total_score,
        "badge": badge,
        "metrics": {
            "architecture": arch,
            "testing": testing,
            "security": security,
            "git": git_hist,
        }
    }
