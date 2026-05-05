import { HomeClient } from "@/components/HomeClient";
import { DocsSection } from "@/components/DocsSection";

export default function Home() {
  return <HomeClient docs={<DocsSection />} />;
}
