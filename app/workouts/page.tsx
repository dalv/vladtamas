import type { Metadata } from "next";
import { WorkoutsContent } from "./content";

export const metadata: Metadata = {
  title: "Workouts | Vlad Tamas",
  description: "Plan your weekly workouts",
};

export default function WorkoutsPage() {
  return <WorkoutsContent />;
}
