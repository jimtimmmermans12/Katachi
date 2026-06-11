import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ProductNotFound() {
  return (
    <div className="bg-shiro min-h-screen flex flex-col">
      <Nav />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 min-h-[70vh]">
        <p className="font-kanji text-[5rem]" style={{ color: "rgba(44,44,44,0.07)" }}>形</p>
        <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: "rgba(44,44,44,0.4)" }}>
          Product not found
        </p>
        <a
          href="/collectie"
          className="text-[10px] uppercase tracking-[0.22em] no-underline"
          style={{ color: "rgba(44,44,44,0.55)" }}
        >
          ← Back to collection
        </a>
      </div>
      <Footer />
    </div>
  );
}
