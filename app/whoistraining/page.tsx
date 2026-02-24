import type { Metadata } from "next";
import { WhoIsTrainingContent } from "./content";

export const metadata: Metadata = {
  title: "Who Is Training | Vlad Tamas",
  description: "See who's at the acro training space right now",
};

export default function WhoIsTrainingPage() {
  return <WhoIsTrainingContent />;
}