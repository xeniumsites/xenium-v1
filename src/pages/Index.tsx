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
import FAQ, { faqs } from "@/components/xenium/FAQ";
import FinalCTA from "@/components/xenium/FinalCTA";
import Footer from "@/components/xenium/Footer";
import StickyMobileCTA from "@/components/xenium/StickyMobileCTA";

// Generated from the same `faqs` array the FAQ section renders, so the
// structured data always mirrors the visible questions/answers verbatim
// (Google FAQPage guidelines require a 1:1 match).
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
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
    </div>
  );
};

export default Index;
