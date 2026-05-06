import { useEffect } from "react";
import Navbar from "@/components/xenium/Navbar";
import StarField from "@/components/xenium/StarField";
import Hero from "@/components/xenium/Hero";
import WhatIsXenium from "@/components/xenium/WhatIsXenium";
import XeniumPreview from "@/components/xenium/XeniumPreview";
import Occasions from "@/components/xenium/Occasions";
import Features from "@/components/xenium/Features";
import HowItWorks from "@/components/xenium/HowItWorks";
import Transformation from "@/components/xenium/Transformation";
import SampleExperiences from "@/components/xenium/SampleExperiences";
import Comparison from "@/components/xenium/Comparison";
import Audience from "@/components/xenium/Audience";
import SocialProof from "@/components/xenium/SocialProof";
import Pricing from "@/components/xenium/Pricing";
import RequestForm from "@/components/xenium/RequestForm";
import FAQ from "@/components/xenium/FAQ";
import FinalCTA from "@/components/xenium/FinalCTA";
import Footer from "@/components/xenium/Footer";
import StickyMobileCTA from "@/components/xenium/StickyMobileCTA";

const Index = () => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(id);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <StarField />
      <div className="relative" style={{ zIndex: 2 }}>
        <Navbar />
        <main>
          <Hero />
          <WhatIsXenium />
          <XeniumPreview />
          <Occasions />
          <Features />
          <HowItWorks />
          <Transformation />
          <SampleExperiences />
          <Comparison />
          <Audience />
          <SocialProof />
          <Pricing />
          <RequestForm />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
      <StickyMobileCTA />
    </div>
  );
};

export default Index;
