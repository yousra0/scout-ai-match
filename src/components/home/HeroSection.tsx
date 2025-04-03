
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="hero-gradient text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              AI-Powered Football Talent Matching
            </h1>
            <p className="text-lg text-gray-200 leading-relaxed">
              Connect players with their perfect clubs using advanced AI technology. 
              ScoutAI analyzes performance data, player skills, and team needs to create 
              optimal matches for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden lg:block">
            <div className="absolute -left-16 top-1/4 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -right-8 bottom-1/4 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
            
            <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
              <h3 className="text-xl font-semibold mb-4">AI Match Recommendation</h3>
              
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex-shrink-0"></div>
                    <div className="ml-4">
                      <div className="font-semibold">James Rodriguez</div>
                      <div className="text-sm text-gray-300">Midfielder • 85% match</div>
                    </div>
                    <div className="ml-auto text-emerald-400 font-bold">85%</div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex-shrink-0"></div>
                    <div className="ml-4">
                      <div className="font-semibold">Sarah Martinez</div>
                      <div className="text-sm text-gray-300">Forward • 92% match</div>
                    </div>
                    <div className="ml-auto text-emerald-400 font-bold">92%</div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex-shrink-0"></div>
                    <div className="ml-4">
                      <div className="font-semibold">Carlos Mendez</div>
                      <div className="text-sm text-gray-300">Defender • 78% match</div>
                    </div>
                    <div className="ml-auto text-emerald-400 font-bold">78%</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="secondary" className="w-full bg-white/10 border-white/10 hover:bg-white/20">
                  View All Matches
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
