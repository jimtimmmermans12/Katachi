import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="bg-shiro min-h-screen flex flex-col">
      <Nav />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 min-h-[70vh]">
        <p className="font-kanji text-[5rem]" style={{ color: "rgba(44,44,44,0.07)" }}>形</p>
        <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "rgba(44,44,44,0.4)" }}>
          This page could not be found
        </p>
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.22em] no-underline"
            style={{ color: "rgba(44,44,44,0.55)" }}
          >
            ← Back home
          </Link>
          <Link
            href="/collectie"
            className="text-[10px] uppercase tracking-[0.22em] no-underline"
            style={{ color: "rgba(44,44,44,0.55)" }}
          >
            Collection
          </Link>
          <Link
            href="/journal"
            className="text-[10px] uppercase tracking-[0.22em] no-underline"
            style={{ color: "rgba(44,44,44,0.55)" }}
          >
            Journal
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
