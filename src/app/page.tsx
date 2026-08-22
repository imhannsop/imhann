import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Works from "@/components/Works";
import Certs from "@/components/Certs";
import Blogs from "@/components/Blogs";
import Contact from "@/components/Contact";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <>
      <main className="wrap">
        <Navbar />
        <MobileNav />
        <Hero />
        <About />
        <Skills />
        <Works />
        <Certs />
        <Blogs />
        <Contact />
        <Terminal />
        <footer>prototype — interactive concept, not final content</footer>
      </main>
    </>
  );
}
