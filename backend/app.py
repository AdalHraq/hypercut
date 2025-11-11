# backend/app.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Dict
import requests, uuid, re
from bs4 import BeautifulSoup

# Optional extractors
try:
    from readability import Document
    HAVE_READABILITY = True
except Exception:
    HAVE_READABILITY = False

try:
    from newspaper import Article
    HAVE_NEWS = True
except Exception:
    HAVE_NEWS = False

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0 Safari/537.36"
    )
}

STORE: Dict[str, Dict] = {}  # in-memory for now

class IngestIn(BaseModel):
    url: HttpUrl

def _clean_text(text: str) -> str:
    # Remove boilerplate Medium cruft
    bad_chunks = [
        r"\bSign in\b", r"\bSign up\b", r"Get started", r"Member[- ]only story",
        r"Cookie[s]?( banner| preferences)?", r"Join (the )?Medium", r"Try Premium",
        r"Log in", r"Subscribe", r"Open in app", r"Allow all cookies", r"Terms of Service",
        r"Privacy Policy"
    ]
    rx = re.compile("|".join(bad_chunks), flags=re.IGNORECASE)
    text = rx.sub("", text)

    # De-dup repeated “Sign in Sign up …”
    text = re.sub(r"(?:\s{2,}|\n{2,})", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()
    return text

def extract_readable(url: str) -> Dict[str, str]:
    # 1) fetch
    r = requests.get(url, timeout=20, headers=HEADERS)
    r.raise_for_status()
    html = r.text

    # 2) try readability
    title = None
    content = None
    if HAVE_READABILITY:
        doc = Document(html)
        title = (doc.short_title() or doc.title() or "").strip()
        soup = BeautifulSoup(doc.summary(html_partial=True), "html.parser")
        content = soup.get_text(separator="\n", strip=True)

    # 3) fallback: newspaper3k
    if (not content or len(content) < 400) and HAVE_NEWS:
        art = Article(url)
        art.download()
        art.parse()
        if not title:
            title = art.title
        ntext = (art.text or "").strip()
        if len(ntext) > len(content or ""):
            content = ntext

    # 4) last fallback: best-effort main <article> or body
    if not content:
        soup = BeautifulSoup(html, "html.parser")
        node = soup.find("article") or soup
        content = node.get_text(separator="\n", strip=True)
        if not title:
            title = (soup.title.string if soup.title else "") or "Untitled"

    content = _clean_text(content)
    title = (title or "Untitled").strip()

    # Medium often prepends bylines / “Listen” etc. Trim excessive head garbage
    content = re.sub(r"^\W*(?:Listen|Share|Follow|Save)\b.*?\n", "", content, flags=re.IGNORECASE)

    # Keep it reasonable (frontend can still show full later)
    content = content[:12000].strip()
    return {"title": title, "summary": content}

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/ingest")
def ingest(inp: IngestIn):
    try:
        data = extract_readable(str(inp.url))
        rec_id = uuid.uuid4().hex
        STORE[rec_id] = {"url": str(inp.url), **data}
        return {"id": rec_id}
    except requests.HTTPError as e:
        raise HTTPException(status_code=400, detail=f"Fetch failed: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extractor error: {e}")

@app.get("/get")
def get(id: str):
    rec = STORE.get(id)
    if not rec:
        raise HTTPException(status_code=404, detail="Not found")
    return rec

