import { useReveal } from "../../hooks/useReveal";
import Hero from "../Home/Hero";
import HowItWorks from "../Home/HowItWorks";
import FeaturedItems from "../Home/FeaturedItems";
import ImpactBanner from "../Home/ImpactBanner";
import Categories from "../Home/Categories";
import Community from "../Home/Community";
import CTASection from "../Home/CTASection";

export default function LandingPage() {
  useReveal();
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedItems />
      <ImpactBanner />
      <Categories />
      <Community />
      <CTASection />
    </>
  );
}
