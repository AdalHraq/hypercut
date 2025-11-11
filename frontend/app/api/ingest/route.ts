// app/api/ingest/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const url = String(form.get("url") || "");

  if (!url) {
    return NextResponse.json({ detail: "Missing url." }, { status: 400 });
  }

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  const r = await fetch(`${backend}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await r.json().catch(() => ({} as any));

  if (!r.ok) {
    return NextResponse.json(
      { detail: `Backend error ${r.status}: ${JSON.stringify(data)}` },
      { status: 500 }
    );
  }

  const id = data?.id;
  if (!id) {
    return NextResponse.json(
      { detail: 'Backend response missing "id".' },
      { status: 500 }
    );
  }

  return NextResponse.redirect(new URL(`/link/${id}`, req.url));
}

