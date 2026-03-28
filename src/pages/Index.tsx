import Navbar from "@/components/xenium/Navbar";
import Hero from "@/components/xenium/Hero";
import WhatIsXenium from "@/components/xenium/WhatIsXenium";
import Occasions from "@/components/xenium/Occasions";
import Features from "@/components/xenium/Features";
import HowItWorks from "@/components/xenium/HowItWorks";
import SampleExperiences from "@/components/xenium/SampleExperiences";
import Comparison from "@/components/xenium/Comparison";
import Audience from "@/components/xenium/Audience";
import Pricing from "@/components/xenium/Pricing";
import RequestForm from "@/components/xenium/RequestForm";
import FAQ from "@/components/xenium/FAQ";
import FinalCTA from "@/components/xenium/FinalCTA";
import Footer from "@/components/xenium/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <WhatIsXenium />
      <Occasions />
      <Features />
      <HowItWorks />
      <SampleExperiences />
      <Comparison />
      <Audience />
      <Pricing />
      <RequestForm />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
