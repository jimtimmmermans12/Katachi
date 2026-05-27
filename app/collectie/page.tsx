import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import CollectionGrid from "@/components/CollectionGrid";
import { getProducts } from "@/lib/shopify";

export const metadata = {
  title: "The Collection — KATACHI",
  description: "Every object is here for a reason.",
};

export default async function Collectie() {
  const products = await getProducts(24);

  return (
    <div className="relative bg-shiro text-sumi">
      <Nav />

      <main>
        {/* Page header */}
        <section className="relative overflow-hidden px-6 pt-40 pb-24 sm:px-10 lg:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none"
          >
            <span
              className="font-kanji text-[32rem] leading-none"
              style={{
                color: "rgba(44,44,44,0.055)",
                textShadow: "0 0 40px rgba(247,245,242,0.6)",
              }}
            >
              形
            </span>
          </div>

          <div className="relative mx-auto max-w-6xl">
            <p className="font-body text-xs uppercase tracking-[0.38em] text-sumi/55">
              KATACHI 形 — Collection
            </p>
            <h1 className="mt-7 font-display text-[clamp(4rem,12vw,9rem)] leading-[0.9] tracking-[-0.025em] text-sumi">
              The Collection
            </h1>
            <p className="mt-7 font-display text-xl italic text-sumi/65 sm:text-2xl">
              Every object is here for a reason.
            </p>
          </div>
        </section>

        {/* Filter bar + grid — client component */}
        <CollectionGrid products={products} />
      </main>

      <Footer />
    </div>
  );
}
