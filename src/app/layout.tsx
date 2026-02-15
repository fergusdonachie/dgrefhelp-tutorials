import type { Metadata } from "next";
import Link from "next/link";

import "./globals.css";

export const metadata: Metadata = {
  title: "DGRefHelp tutorials (draft)",
  description: "GP trainee tutorials — case-based staged reveal teaching.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div>
              <div className="brand">DGRefHelp tutorials</div>
              <div className="sub">Case-based GP trainee tutorials (draft)</div>
            </div>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/tutorials">Tutorials</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="footer">© {new Date().getFullYear()} DGRefHelp (draft)</footer>
        </div>
      </body>
    </html>
  );
}
