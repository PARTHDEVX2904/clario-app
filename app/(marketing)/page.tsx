import type { Metadata } from "next";
import { Hero } from "@/components/marketing/hero";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { TrustSection } from "@/components/marketing/trust-section";
import { CTASection } from "@/components/marketing/cta-section";

export const metadata: Metadata = {
  title: "Clario — Your Medical Bill, Decoded",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <TrustSection />
      <CTASection />
    </>
  );
}
