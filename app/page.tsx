import { FlowerGallery } from "@/components/FlowerGallery";
import { Hero } from "@/components/Hero";

export default function Home() {
  return <Hero gallery={<FlowerGallery />} />;
}
