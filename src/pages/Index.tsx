import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { AboutSection } from '@/components/home/AboutSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { RoadmapSection } from '@/components/home/RoadmapSection';
import { TokenomicsSection } from '@/components/home/TokenomicsSection';
import { CTASection } from '@/components/home/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <HowItWorksSection />
        <RoadmapSection />
        <TokenomicsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
