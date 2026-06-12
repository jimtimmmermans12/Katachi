import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Shipping & Returns — KATACHI",
  description:
    "Shipping to the Netherlands and Belgium in 2–7 business days, free from €100. 30 days to change your mind, refunds within 14 days.",
};

export default function ShippingReturns() {
  return (
    <LegalPage
      eyebrow="KATACHI 形 — Service"
      title="Shipping & Returns"
      intro="Objects that take time to make deserve a little patience in transit — and an easy way back, should you change your mind."
      updated="June 2026"
      sections={[
        {
          heading: "Shipping",
          paragraphs: [
            "We ship to the Netherlands and Belgium. Your order leaves our studio within two business days and arrives within 2–7 business days of ordering.",
            "Shipping is free for orders of €100 and above. For smaller orders, the exact rate is shown at checkout — no surprises.",
            "Every order ships with track & trace. You'll receive the tracking link by email the moment your parcel is on its way.",
          ],
        },
        {
          heading: "Returns",
          paragraphs: [
            "You have 30 days from the day your order arrives to change your mind — twice the period EU law requires, because a considered decision takes time.",
            "To return an item, email us at hello@katachi.store with your order number, and we'll guide you through it. The product should be unused and in its original packaging — the same quiet condition in which it reached you.",
            "Return shipping is at your own cost. We recommend a tracked service; the parcel remains your responsibility until it reaches us.",
          ],
        },
        {
          heading: "Refunds",
          paragraphs: [
            "Once your return arrives, we'll refund the full purchase amount within 14 days, to the payment method you used. We'll confirm by email when it's done.",
          ],
        },
        {
          heading: "Arrived damaged?",
          paragraphs: [
            "It happens rarely, but it happens. Photograph the item and the packaging, send both to hello@katachi.store within 48 hours of delivery, and we'll arrange a replacement or a full refund — including shipping. No forms, no friction.",
          ],
        },
      ]}
    />
  );
}
