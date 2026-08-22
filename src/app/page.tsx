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
      <main className="mx-auto flex w-full max-w-[880px] flex-col gap-3.5 px-4 pt-[76px] sm:px-6 lg:px-8 max-sm:pt-6 max-sm:pb-6">
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
        <footer className="py-5 text-[11px] text-border">prototype — interactive concept, not final content</footer>
      </main>
    </>
  );
}