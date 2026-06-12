import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — KATACHI",
  description:
    "The agreement between you and KATACHI when you order: prices, payment, delivery, withdrawal, liability. Dutch law applies.",
};

export default function Terms() {
  return (
    <LegalPage
      eyebrow="KATACHI 形 — Terms"
      title="Terms of Service"
      intro="The quiet agreement between us when you place an order. Short, fair, and written to be understood."
      updated="June 2026"
      sections={[
        {
          heading: "Applicability",
          paragraphs: [
            "These terms apply to every order placed in the KATACHI web shop. By placing an order you accept them. If any provision proves invalid, the rest remains in force.",
            "KATACHI is based at Prinsengracht 245, Amsterdam, the Netherlands. You can reach us at hello@katachi.store.",
          ],
        },
        {
          heading: "Prices",
          paragraphs: [
            "All prices are in euros and include Dutch VAT (21%). Shipping costs, where applicable, are shown at checkout before you pay. The price at the moment you order is the price you pay — if we ever make an obvious pricing error, we'll contact you before doing anything else.",
          ],
        },
        {
          heading: "Payment",
          paragraphs: [
            "We accept PayPal, iDEAL, Bancontact, Visa and Mastercard. Payment is processed securely by Shopify Payments at the moment you place your order. Your order is confirmed by email once payment is complete.",
          ],
        },
        {
          heading: "Delivery",
          paragraphs: [
            "We deliver to the Netherlands and Belgium within 2–7 business days. Delivery times are estimates, not promises — though we take them seriously. If a delay arises, we'll let you know. The risk of loss or damage passes to you at the moment of delivery.",
          ],
        },
        {
          heading: "Right of withdrawal",
          paragraphs: [
            "You may return your order within 30 days of receipt without giving a reason — see our Shipping & Returns page for how. The product should be unused and in its original packaging. We refund the full purchase amount within 14 days of receiving your return.",
          ],
        },
        {
          heading: "Liability",
          paragraphs: [
            "We stand behind every object we sell. If something is defective, we'll repair, replace or refund it — your statutory warranty rights remain fully intact.",
            "Beyond that, our liability is limited to the purchase price of the item concerned. We are not liable for indirect or consequential damage, except where the law says otherwise.",
          ],
        },
        {
          heading: "Governing law",
          paragraphs: [
            "Dutch law applies to these terms and to every order. Any dispute we cannot resolve together will be brought before the competent court in Amsterdam — though in our experience, an email resolves nearly everything first.",
          ],
        },
      ]}
    />
  );
}
