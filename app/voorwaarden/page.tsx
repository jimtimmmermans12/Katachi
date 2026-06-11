import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms & Conditions — KATACHI",
};

const sections = [
  {
    heading: "Orders",
    body: "By placing an order you confirm that you are at least 18 years of age and that all information provided is accurate. KATACHI reserves the right to refuse or cancel orders at our discretion.",
  },
  {
    heading: "Pricing",
    body: "All prices are in euros and include Dutch VAT (21%). Prices are subject to change without notice. The price charged is the price displayed at the time of purchase.",
  },
  {
    heading: "Intellectual property",
    body: "All content on this website — including images, text, and design — is the property of KATACHI and may not be reproduced without written permission.",
  },
  {
    heading: "Liability",
    body: "KATACHI is not liable for any indirect or consequential loss arising from the use of our products or website. Our liability is limited to the purchase price of the item in question.",
  },
];

export default function Terms() {
  return (
    <div className="bg-shiro text-sumi min-h-screen">
      <Nav />
      <main className="mx-auto max-w-2xl px-8 pt-40 pb-32">
        <p className="font-display text-xs uppercase tracking-[0.35em] text-sumi/50 mb-6">Policies</p>
        <h1 className="font-display text-5xl leading-tight text-sumi mb-16">Terms &amp; Conditions</h1>
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
