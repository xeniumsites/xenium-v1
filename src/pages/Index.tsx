import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
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
import ChatBot from "@/components/xenium/ChatBot";

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What exactly is a Xenium?", acceptedAnswer: { "@type": "Answer", text: "A Xenium is a beautifully designed, private digital experience created around a personal story or moment. It combines photos, videos, messages, music and animations into an immersive microsite that can be shared via a private link." } },
    { "@type": "Question", name: "How does the process work?", acceptedAnswer: { "@type": "Answer", text: "Fill out the request form with details about the occasion, the person and the story. After payment, our design team crafts the experience and delivers it via a private link — same-day if ordered before 12 PM IST, otherwise within 24 hours." } },
    { "@type": "Question", name: "Is my Xenium private?", acceptedAnswer: { "@type": "Answer", text: "Yes. Every Xenium is hosted on a private link only you and your recipient can access. Optional password protection is available for added privacy." } },
    { "@type": "Question", name: "How long does it take to create?", acceptedAnswer: { "@type": "Answer", text: "Same-day delivery if you order before 12 PM IST. Otherwise, your Xenium is delivered within 24 hours of payment confirmation." } },
    { "@type": "Question", name: "What media can I include?", acceptedAnswer: { "@type": "Answer", text: "Photos, videos, written messages, background music, animated text, timelines, guest messages and a QR code for easy sharing." } },
    { "@type": "Question", name: "How is it delivered?", acceptedAnswer: { "@type": "Answer", text: "You receive a private, shareable link via email. A QR code is also generated so you can print it on a physical card or include it with a gift." } },
    { "@type": "Question", name: "What payment methods do you accept?", acceptedAnswer: { "@type": "Answer", text: "We accept UPI, debit and credit cards, and net banking through our secure payment partner. Payment is collected after we confirm your request and before production begins." } },
    { "@type": "Question", name: "What if I am not happy with the result?", acceptedAnswer: { "@type": "Answer", text: "Every order is backed by our 100% Happiness Guarantee — free unlimited revisions until you are delighted, or a full refund. No questions asked." } },
  ],
};

const PRODUCT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Xenium Personalized Digital Experience",
  description: "A hand-crafted, cinematic digital gift built around someone you love — combining photos, video, music and written words into one private link.",
  image: "https://xenium-sites.com/og-image.jpg",
  brand: { "@type": "Brand", name: "Xenium" },
  category: "Personalized Digital Gift",
  offers: {
    "@type": "Offer",
    price: "750",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://xenium-sites.com/#create",
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "https://schema.org/MerchantReturnUnlimitedWindow",
      returnMethod: "https://schema.org/KeepProduct",
      returnFees: "https://schema.org/FreeReturn",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
      },
    },
  },
};

const SERVICE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Personalized Digital Gift Experience",
  name: "Xenium Personalized Digital Experience",
  provider: { "@type": "Organization", name: "Xenium", url: "https://xenium-sites.com/" },
  areaServed: { "@type": "Country", name: "India" },
  description: "A hand-crafted, cinematic digital gift built around someone you love. Same-day delivery if ordered before 12 PM IST, otherwise within 24 hours.",
  offers: {
    "@type": "Offer",
    price: "750",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    url: "https://xenium-sites.com/#create",
    priceValidUntil: "2027-12-31",
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "https://schema.org/MerchantReturnUnlimitedWindow",
      returnMethod: "https://schema.org/KeepProduct",
      returnFees: "https://schema.org/FreeReturn",
    },
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: "0", currency: "INR" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
        transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
      },
    },
  },
};

const Index = () => {
  useEffect(() => {
    // Disable browser scroll restoration so the page always starts at the top (Home).
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const hash = window.location.hash;
    if (hash) {
      const id = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return () => clearTimeout(id);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <Helmet>
        <link rel="canonical" href="https://xenium-sites.com/" />
        <meta property="og:url" content="https://xenium-sites.com/" />
        <script type="application/ld+json">{JSON.stringify(SERVICE_JSONLD)}</script>
        <script type="application/ld+json">{JSON.stringify(PRODUCT_JSONLD)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_JSONLD)}</script>
      </Helmet>
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
      <ChatBot />
    </div>
  );
};

export default Index;
