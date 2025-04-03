
import { Activity, Award, BarChart4, Filter, Globe, Search, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: <BarChart4 className="h-8 w-8 text-primary" />,
    title: "AI-Powered Matching",
    description: "Our proprietary algorithm analyzes thousands of data points to create optimal player-club matches."
  },
  {
    icon: <Filter className="h-8 w-8 text-primary" />,
    title: "Advanced Filtering",
    description: "Customize your search with specific criteria like age, position, playing style, and more."
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Global Network",
    description: "Connect with players, clubs, and scouts from around the world to expand your opportunities."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Talent Development",
    description: "Track player progress and identify potential stars before they reach the mainstream."
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: "In-Depth Analysis",
    description: "Get comprehensive player profiles with performance statistics, strengths, and areas for improvement."
  },
  {
    icon: <Shield className="h-8 w-8 text-primary" />,
    title: "Verified Profiles",
    description: "All users go through a verification process to ensure authentic connections and reliable data."
  },
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Success Stories",
    description: "Join hundreds of players who found their ideal club and teams who discovered perfect talent matches."
  },
  {
    icon: <Activity className="h-8 w-8 text-primary" />,
    title: "Real-time Updates",
    description: "Receive instant notifications about new matches, opportunities, and important developments."
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Revolutionizing Football Scouting</h2>
          <p className="text-lg text-gray-600">
            Our platform combines cutting-edge AI technology with football expertise to create perfect matches between players and clubs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow card-hover"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
