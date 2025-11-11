// frontend/app/link/[id]/page.tsx  (Server Component)
import Logo from '@/components/Logo';
import Link from 'next/link';
import CopyBtn from "./CopyBtn";

type PageProps = { params: { id: string } };

export default async function LinkPage({ params }: PageProps) {
  const backend =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

  const res = await fetch(`${backend}/get?id=${params.id}`, { cache: 'no-store' });
  if (!res.ok) {
    return (
      <main className="shell">
        <header className="topbar"><Logo size={22} /></header>
        <section className="hero"><h1 className="heroTitle">Something went wrong.</h1></section>
      </main>
    );
  }

  const data = await res.json() as { title?: string; url?: string; summary?: string };
  const title = data.title ?? 'Untitled';
  const url = data.url ?? '#';
  const summary = data.summary ?? 'No summary available.';

  return (
    <main className="shell">
      <header className="topbar">
        <Logo size={22} />
      </header>

      <section className="result">
        <h1 className="resultTitle">{title}</h1>

        <p className="resultLink">
          <Link href={url} target="_blank" rel="noopener noreferrer">{url}</Link>
        </p>

        <article className="card summaryCard">
          <pre className="summaryText">{summary}</pre>
        </article>

        <div className="actions">
          <a className="button" href="/">Summarise another</a>
          <CopyBtn text={summary} />
        </div>
      </section>

      <footer className="foot" />
    </main>
  );
}

