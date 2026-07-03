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
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <>
      {/* Home */}
      <Navbar />
      <Hero />

      {/* About */}
      <WhyChooseUs />

      {/* Services */}
      <Services />

      {/* AI Features */}
      <Features />

      {/* How It Works */}
      <HowItWorks />

      {/* Results */}
      <Results />

      {/* Reviews */}
      <Testimonials />

      {/* Dental Team */}
      <MeetTheDoctors />

      {/* Contact */}
      <CTA />

      {/* FAQs */}
      <FAQ />

      {/* Footer */}
      <Footer />

      {/* Floating AI Chatbot */}
      <Chatbot />
    </>
  );
}