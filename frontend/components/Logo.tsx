// frontend/components/Logo.tsx
import React from "react";

// frontend/components/Logo.tsx
// Server component (no hooks)
export default function Logo({ size = 28, withWord = true }:{
  size?: number; withWord?: boolean;
}) {
  return (
    <div className="logoRow" aria-label="Hypercut">
      <svg
        width={size} height={size} viewBox="0 0 64 64" aria-hidden
        className="logoMark"
      >
        <rect x="6" y="6" width="52" height="52" rx="12" fill="#E11D48"/>
        <path d="M18 50 L46 14" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      </svg>
      {withWord && (
        <span className="logoWord">HYPERCUT</span>
      )}
    </div>
  );
}

