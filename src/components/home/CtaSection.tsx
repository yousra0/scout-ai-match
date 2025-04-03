
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

const CtaSection = () => {
  return (
    <section className="py-16 bg-scout-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Football Journey?</h2>
          <p className="text-lg text-gray-300">
            Join thousands of players, clubs, and scouts already using ScoutAI to make smarter connections in football.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>AI-powered matching</span>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>Global opportunities</span>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Check className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>Data-driven insights</span>
            </div>
          </div>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="min-w-[180px] bg-primary hover:bg-primary/90 text-white">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="min-w-[180px] border-white text-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
