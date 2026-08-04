import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import { ARTICLES, formatArticleDate, getArticleBySlug } from "@/lib/journal";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found — KATACHI" };
  }

  return {
    title: `${article.title} — KATACHI Journal`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} — KATACHI Journal`,
      description: article.excerpt,
      type: "article",
    },
  };
}

export default async function JournalArticle({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="relative bg-shiro text-sumi">
      <Nav />

      <main>
        {/* Header */}
        <header className="px-6 pt-32 pb-12 sm:px-10 sm:pt-40 sm:pb-16 lg:px-14">
          <Reveal immediate className="mx-auto max-w-3xl">
            <p className="font-body text-[10px] uppercase tracking-[0.42em] text-sumi/45">
              {article.category}
            </p>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] tracking-[-0.02em] text-sumi sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="mt-8 font-body text-[11px] uppercase tracking-[0.28em] text-sumi/35">
              {formatArticleDate(article.date)} · {article.readingTime}
            </p>
          </Reveal>
        </header>

        {/* Body */}
        <article className="border-t border-sumi/10 px-6 py-20 sm:px-10 lg:px-14">
          <Reveal immediate className="mx-auto max-w-2xl">
            {/* No repeated excerpt lead — the reader just saw it on the index card. */}
            <div className="space-y-7">
              {article.content.map((paragraph, i) => (
                <p key={i} className="text-[1.0625rem] leading-[1.9] text-sumi/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </article>

        {/* Footer navigation */}
        <div className="border-t border-sumi/10 px-6 py-16 sm:px-10 lg:px-14">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/journal"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-sumi/55 underline underline-offset-[6px] decoration-sumi/25 transition hover:text-mori hover:decoration-mori/40"
            >
              ← Back to the journal
            </Link>
            <Link
              href="/collectie"
              className="text-xs font-semibold uppercase tracking-[0.22em] text-sumi/55 underline underline-offset-[6px] decoration-sumi/25 transition hover:text-mori hover:decoration-mori/40"
            >
              Explore the collection
            </Link>
          </Reveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
