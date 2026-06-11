import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Philosophy — KATACHI",
  description: "Why KATACHI exists. Craftsmanship, materiality, and the stillness that honest objects bring.",
};

export default function FilosofieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
