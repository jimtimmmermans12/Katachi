import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy — KATACHI",
};

const sections = [
  {
    heading: "Data we collect",
    body: "We collect your name, email address, and shipping address when you place an order. We use this information solely to fulfill your order and communicate with you about it.",
  },
  {
    heading: "Cookies",
    body: "We use minimal session cookies required for cart functionality. We do not use third-party tracking or advertising cookies.",
  },
  {
    heading: "Data sharing",
    body: "We never sell or share your personal data with third parties except as required to process your payment (via Shopify Payments) and deliver your order.",
  },
  {
    heading: "Your rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@KATACHI.store.",
  },
];

export default function Privacy() {
  return (
    <div className="bg-shiro text-sumi min-h-screen">
      <Nav />
      <main className="mx-auto max-w-2xl px-8 pt-40 pb-32">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/50 mb-6">Policies</p>
        <h1 className="font-display text-5xl leading-tight text-sumi mb-16">Privacy Policy</h1>
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
