import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yueran Novel Studio",
  description: "给王悦然的长篇耽美小说创作小屋"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/75 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
            <Link href="/" className="font-semibold tracking-[0.02em] text-ink">
              Yueran Novel Studio
            </Link>
            <nav className="flex items-center gap-2 text-sm text-ink/70">
              <Link className="rounded-lg px-3 py-2 hover:bg-white/70" href="/studio">
                创作
              </Link>
              <Link className="rounded-lg px-3 py-2 hover:bg-white/70" href="/settings">
                设置
              </Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
