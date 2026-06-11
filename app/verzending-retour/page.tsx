import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shipping & Returns — KATACHI",
};

const sections = [
  {
    heading: "Shipping",
    body: "We ship to the Netherlands, Belgium, and Germany. Orders over €100 ship free. Standard delivery takes 2–4 business days. Orders are processed Monday through Friday.",
  },
  {
    heading: "Returns",
    body: "Unused items in original condition may be returned within 30 days of receipt. To initiate a return, email us at hello@KATACHI.store with your order number.",
  },
  {
    heading: "Damaged items",
    body: "If your order arrives damaged, please photograph the item and packaging and contact us within 48 hours. We will arrange a replacement or full refund.",
  },
];

export default function ShippingReturns() {
  return (
    <div className="bg-shiro text-sumi min-h-screen">
      <Nav />
      <main className="mx-auto max-w-2xl px-8 pt-40 pb-32">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/50 mb-6">Policies</p>
        <h1 className="font-display text-5xl leading-tight text-sumi mb-16">Shipping &amp; Returns</h1>
        <div className="space-y-12">
          {sections.map((s) => (
            <div key={s.heading}>
              <h2 className="font-display text-xl uppercase tracking-[0.2em] text-sumi/80 mb-4">{s.heading}</h2>
              <p className="text-base leading-8 text-sumi/70">{s.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
