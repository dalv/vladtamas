import type { Metadata } from "next";
import { WorkoutsContent } from "./content";

export const metadata: Metadata = {
  title: "Latihan | Vlad Tamas",
  description: "Rencanakan latihan mingguan Anda",
};

export default function WorkoutsPage() {
  return <WorkoutsContent />;
}
