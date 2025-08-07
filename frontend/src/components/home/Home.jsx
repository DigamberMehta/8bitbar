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
      <div className="py-8 md:py-12">
        <AboutSection />
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-4 md:mx-8"></div>
      <div className="py-8 md:py-12">
        <N64BoothsSection />
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-4 md:mx-8"></div>
      <div className="py-8 md:py-12">
        <KaraokeSection />
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-4 md:mx-8"></div>
      <div className="py-8 md:py-12">
        <PoolSection />
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mx-4 md:mx-8"></div>
      <div className="py-8 md:py-12">
        <CtaSection />
      </div>
    </div>
  );
};

export default Home;
