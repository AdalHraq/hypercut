// frontend/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Hypercut",
  description: "AI summaries, instantly.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          {/* Sidebar (KIMI-style) */}
          <aside className="sidebar">
            <div className="sideBrand">
              <span className="sideDot" aria-hidden />
              Hypercut AI
            </div>

            <nav className="sideNav">
              <a className="sideItem active" href="/">
                <span className="pill">+</span>
                New summary
              </a>

              {/* No onClick on Server Components; just render a disabled item */}
              <span className="sideItem disabled" aria-disabled="true">
                <span className="dot" />
                History (coming soon)
              </span>
            </nav>

            <div className="sideFoot">© 2025 Hypercut</div>
          </aside>

          {/* Main area */}
          <main className="main">
            <div className="container">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}

