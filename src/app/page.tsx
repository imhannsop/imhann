import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Works from "@/components/Works";
import Certs from "@/components/Certs";
import Blogs from "@/components/Blogs";
import Contact from "@/components/Contact";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <>
      <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 pt-4 sm:pt-6 sm:px-8 lg:px-12 max-sm:pt-6 max-sm:pb-8">
        <Navbar />
        <MobileNav />
        <Hero />
        <Skills />
        <Works />
        <Certs />
        <Blogs />
        <Contact />
        <Terminal />
        <footer className="mt-6 pt-6 border-t border-border-dim text-center text-sm text-border">@imhannsop</footer>
      </main>
    </>
  );
}