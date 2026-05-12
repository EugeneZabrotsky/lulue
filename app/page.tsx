import { EditorialChapters } from "@/components/EditorialChapters";
import { Hero } from "@/components/Hero";

export default function Home() {
  return <Hero gallery={<EditorialChapters />} />;
}
