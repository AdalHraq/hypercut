import re
from typing import Optional

def sentence_split(text: str):
    parts = re.split(r'(?<=[.!?])\s+', text.strip())
    return [p.strip() for p in parts if len(p.strip()) > 0]

def score_sentence(sent: str):
    length = len(sent.split())
    score = 0
    if 8 <= length <= 30:
        score += 2
    score += sum(1 for w in ["is","are","was","were","has","have","will","because","therefore"] if w in sent.lower())
    score += min(3, sent.count(","))
    return score

def summarize_text(text: str, title: Optional[str] = None, max_sentences: int = 6) -> str:
    sents = sentence_split(text)
    if not sents:
        return ""
    seen = set(); unique = []
    for s in sents:
        key = s.lower()[:60]
        if key not in seen:
            unique.append(s); seen.add(key)
    ranked = sorted(unique, key=score_sentence, reverse=True)
    top = ranked[:max_sentences]
    idx_map = {s: i for i, s in enumerate(unique)}
    top_sorted = sorted(top, key=lambda s: idx_map[s])
    if title and title not in top_sorted[0]:
        return (title.strip() + "\n\n" + "\n".join(top_sorted)).strip()
    return "\n".join(top_sorted)
