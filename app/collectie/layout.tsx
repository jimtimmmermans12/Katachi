import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Collection — KATACHI",
  description: "Japanese-inspired ceramics, wood, and linen — objects chosen for form, craft, and timeless presence.",
};

export default function CollectieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
