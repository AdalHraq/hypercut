// frontend/components/CopyBtn.tsx
'use client';

import { useState } from 'react';

export default function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 1200);
    } catch {}
  }
  return (
    <button onClick={onCopy} className="button ghost" aria-label="Copy summary">
      {ok ? 'Copied ✓' : 'Copy'}
    </button>
  );
}

