"use client";

export default function ClientActions() {
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    } catch {
      alert("Couldn’t copy link. Copy it manually.");
    }
  }

  return (
    <div className="row">
      <a className="button secondary" href="/">Summarize another</a>
      <button className="button" type="button" onClick={copyLink}>
        Copy link
      </button>
    </div>
  );
}

