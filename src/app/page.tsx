import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { TechMarquee } from "@/components/tech-marquee";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Photography } from "@/components/photography";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TechMarquee />
        <Skills />
        <Projects />
        <Photography />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
