import re, requests
from bs4 import BeautifulSoup

def clean_text(s: str) -> str:
    s = re.sub(r'\s+', ' ', s)
    return s.strip()

def fetch_and_parse(url: str):
    headers = {"User-Agent": "HyperlinkAI/0.1"}
    r = requests.get(url, headers=headers, timeout=15)
    r.raise_for_status()
    html = r.text
    soup = BeautifulSoup(html, "html.parser")
    title_tag = soup.find("meta", property="og:title") or soup.find("title")
    title = title_tag.get("content") if title_tag and title_tag.has_attr("content") else (title_tag.text if title_tag else None)
    for tag in soup(["script", "style", "noscript", "nav", "footer", "header", "form"]):
        tag.decompose()
    main = soup.find("article") or soup.find("main") or soup
    paragraphs = [clean_text(p.get_text(" ")) for p in main.find_all("p")]
    text = "\n".join([p for p in paragraphs if len(p.split()) > 5])
    return html, title, text
