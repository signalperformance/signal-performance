import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
const Hero = () => {
  const {
    t
  } = useLanguage();
  return <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background - using a clean white background */}
      <div className="absolute inset-0 z-0 bg-white"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 text-signal-charcoal max-w-5xl mx-auto leading-tight">Holistic Training Facility 
for Professional Golfers</h1>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-signal-charcoal/80">
          Where elite golfers prepare to perform at their highest level.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <Button className="bg-signal-charcoal hover:bg-signal-charcoal/90 text-white font-medium px-8 py-6 text-lg flex items-center gap-2" size="lg" onClick={() => document.getElementById('waitlist')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            Join the Waitlist <ArrowRight size={18} />
          </Button>
          <Button className="bg-white hover:bg-gray-100 text-signal-charcoal font-medium border border-gray-200 px-8 py-6 text-lg" variant="outline" size="lg" onClick={() => document.getElementById('membership')?.scrollIntoView({
          behavior: 'smooth'
        })}>
            Explore Membership
          </Button>
        </div>
      </div>
      
      {/* Removing the scroll indicator to match the reference */}
    </section>;
};
export default Hero;