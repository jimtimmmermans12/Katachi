import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — KATACHI",
  description:
    "What data we collect, why, how long we keep it, and your rights under the GDPR. Written to be read, not skimmed past.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="KATACHI 形 — Privacy"
      title="Privacy Policy"
      intro="We collect as little as possible, keep it no longer than necessary, and never sell it. Here is the whole of it, in plain language."
      updated="June 2026"
      sections={[
        {
          heading: "What we collect",
          paragraphs: [
            "When you place an order, we collect your name, shipping address and email address — what's needed to get your order to your door and keep you informed along the way.",
            "Payments are processed by Shopify Payments. Your card or bank details go directly to them over an encrypted connection; we never see or store them ourselves.",
          ],
        },
        {
          heading: "Why we collect it",
          paragraphs: [
            "Three reasons, no more: to process and ship your order, to email you about it (confirmation, tracking, returns), and — only if you've subscribed to our letters — to send you the occasional email about objects and ideas. You can unsubscribe with one click, any time.",
            "We do not sell your data, share it for advertising, or build profiles. The only third parties involved are the ones needed to fulfil your order: Shopify (our shop platform) and the carrier delivering your parcel.",
          ],
        },
        {
          heading: "How long we keep it",
          paragraphs: [
            "Order data is kept for 7 years — Dutch tax law requires it. Newsletter subscriptions are kept until you unsubscribe. Everything else is removed when it's no longer needed.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            "Under the GDPR you may ask us, at any time, what data we hold about you, ask us to correct it, or ask us to delete it. Email hello@katachi.store and we'll respond within 30 days — usually much sooner.",
            "If you believe we've handled your data poorly, you can lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens). We'd appreciate the chance to fix it first.",
          ],
        },
        {
          heading: "Cookies",
          paragraphs: [
            "We use essential cookies to keep your cart working — without them, the shop simply doesn't function. If we use analytics, it is anonymised: we see that pages are visited, never who visited them.",
            "No advertising cookies, no cross-site tracking, no third-party pixels. Your choice in our cookie banner is stored on your own device and respected.",
          ],
        },
        {
          heading: "Who is responsible",
          paragraphs: [
            "KATACHI, Prinsengracht 245, Amsterdam, the Netherlands, is the data controller for this shop. For anything related to your data, write to hello@katachi.store.",
          ],
        },
      ]}
    />
  );
}
