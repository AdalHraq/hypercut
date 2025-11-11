// frontend/components/Wordmark.tsx
export default function Wordmark({ size = 24 }: { size?: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {/* Red slashed tile */}
      <svg
        width={size * 1.4}
        height={size * 1.4}
        viewBox="0 0 64 64"
        aria-label="Hypercut"
      >
        <rect rx="12" ry="12" width="64" height="64" fill="#E11D48" />
        <path
          d="M14 48 L50 16"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      {/* Wordmark in code (white) */}
      <svg
        height={size}
        viewBox="0 0 640 120"
        style={{ display: 'block' }}
        aria-hidden
      >
        <text
          x="0"
          y="86"
          fontFamily="Inter, ui-sans-serif, system-ui, Segoe UI, Roboto, Arial, sans-serif"
          fontWeight="900"
          fontStyle="italic"
          fontSize="96"
          fill="#ffffff"
          letterSpacing="4"
        >
          HYPERCUT
        </text>
      </svg>
    </div>
  );
}

