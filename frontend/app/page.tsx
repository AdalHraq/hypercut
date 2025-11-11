// frontend/app/page.tsx
"use client";

export default function Home() {
  return (
    <div className="container">
      <div className="heroLogo">
        {/* keep the centered mark if you like; or remove this <div> entirely */}
      
      </div>

      <h1 className="heroTitle">Cut through any link.</h1>
      <p className="heroSub">Paste a URL—Hypercut extracts the signal and delivers a crisp summary.</p>

      <form className="inputRow card" action="/api/ingest" method="post">
        <input
          className="input"
          name="url"
          placeholder="https://example.com/article"
          required
          inputMode="url"
        />
        <button className="button" type="submit">Summarise</button>
      </form>

     
    </div>
  );
}

