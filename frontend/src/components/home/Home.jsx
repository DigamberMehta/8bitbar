import React from "react";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import N64BoothsSection from "./N64BoothsSection";
import KaraokeSection from "./KaraokeSection";
import PoolSection from "./PoolSection";
import CtaSection from "./CtaSection";

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <AboutSection />
      <N64BoothsSection />
      <KaraokeSection />
      <PoolSection />
      <CtaSection />
    </div>
  );
};

export default Home;
