import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Masters from "@/components/Masters";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import Booking from "@/components/Booking";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-[#050505]">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Masters />
      <Gallery />
      <Reviews />
      <Booking />
      <Contact />
      <Footer />
    </main>
  );
}
