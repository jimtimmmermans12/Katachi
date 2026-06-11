import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — KATACHI",
  description: "Questions about an order or an object? Get in touch with the KATACHI team.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
