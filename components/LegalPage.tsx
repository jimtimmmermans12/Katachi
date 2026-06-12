import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export default function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  updated,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  updated: string;
}) {
  return (
    <div className="relative bg-shiro text-sumi">
      <Nav />

      <main>
        {/* Hero — same quiet structure as the Philosophy page */}
        <section className="relative overflow-hidden px-6 pt-40 pb-24 sm:px-10 lg:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          >
            <span
              className="font-kanji text-[36rem] leading-none"
              style={{ color: "rgba(44,44,44,0.05)", textShadow: "0 0 60px rgba(247,245,242,0.7)" }}
            >
              形
            </span>
          </div>

          <div className="relative mx-auto max-w-3xl">
            <p className="font-body text-xs uppercase tracking-[0.38em] text-sumi/50">
              {eyebrow}
            </p>
            <h1 className="mt-8 font-display text-[clamp(2.75rem,8vw,6rem)] leading-[0.95] tracking-[-0.02em] text-sumi">
              {title}
            </h1>
            <p className="mt-9 font-display text-xl italic leading-[1.6] text-sumi/65 sm:text-2xl">
              {intro}
            </p>
          </div>
        </section>

        {/* Sections — narrow column, generous whitespace */}
        <section className="border-t border-slate-200/60 px-6 py-8 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl">
            {sections.map((section, index) => (
              <div
                key={section.heading}
                className={`py-14 ${index > 0 ? "border-t border-slate-200/60" : ""}`}
              >
                <p className="font-body text-[10px] uppercase tracking-[0.45em] text-sumi/35">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-6 font-display text-3xl leading-[1.15] tracking-[-0.01em] text-sumi sm:text-4xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p, i) => (
                  <p key={i} className="mt-6 text-base leading-[1.9] text-sumi/70">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Contact + updated */}
        <section className="border-t border-slate-200/60 bg-white/65 px-6 py-20 sm:px-10 lg:px-14">
          <div className="mx-auto max-w-3xl">
            <p className="font-display text-xl leading-[1.6] text-sumi/80 sm:text-2xl">
              Questions? Contact us at{" "}
              <a
                href="mailto:hello@katachi.store"
                className="underline decoration-sumi/30 underline-offset-4 transition-colors hover:text-mori hover:decoration-mori/50"
              >
                hello@katachi.store
              </a>
              .
            </p>
            <p className="mt-8 font-body text-[10px] uppercase tracking-[0.28em] text-sumi/30">
              Last updated {updated}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
