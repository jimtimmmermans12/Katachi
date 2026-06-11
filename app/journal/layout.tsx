import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journal — KATACHI",
  description: "Thoughtful essays on objects, craft, and intentional living.",
};

export default function JournalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
