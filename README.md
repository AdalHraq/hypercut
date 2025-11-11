# Hyperlink AI (MVP)
Turn any URL into a clean, shareable summary.

## Stack
- Backend: FastAPI + SQLite (SQLAlchemy), BeautifulSoup for parsing
- Frontend: Next.js (App Router)

## Run
### Backend
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

### Frontend
cd ../frontend
npm install
npm run dev

Open http://localhost:3000 and paste a URL.
