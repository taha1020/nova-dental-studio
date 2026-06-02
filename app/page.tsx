import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import WhyChooseUs from "@/components/WhyChooseUs";
import Results from "@/components/Results";
import Testimonials from "@/components/Testimonials";
import MeetTheDoctors from "@/components/MeetTheDoctors";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Services />
      <WhyChooseUs />
      <Results />
      <Testimonials />
      <MeetTheDoctors />
      <FAQ />
      <CTA />
      <Footer />
      <Chatbot />

    </>
  );
}