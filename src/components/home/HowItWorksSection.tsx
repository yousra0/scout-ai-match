
import { Check } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: "Create Your Profile",
    description: "Sign up and build your complete profile. Players can showcase their skills, history, and aspirations. Clubs can outline their requirements and team culture.",
    image: "https://images.unsplash.com/photo-1544699377-40971581a0df?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    number: 2,
    title: "AI Analysis",
    description: "Our advanced algorithm analyzes your profile against thousands of potential matches, considering technical ability, physical attributes, tactical preferences, and more.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    number: 3,
    title: "Receive Recommendations",
    description: "Get personalized match recommendations with compatibility scores. Browse profiles, watch highlight videos, and review detailed analytics.",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
  {
    number: 4,
    title: "Connect & Succeed",
    description: "Initiate conversations with potential matches, arrange trials or interviews, and take the next step in your football journey.",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How ScoutAI Works</h2>
          <p className="text-lg text-gray-600">
            Our streamlined process makes it easy for players and clubs to find their perfect match.
          </p>
        </div>
        
        <div className="space-y-20 md:space-y-32">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h3>
                <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                
                <ul className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <li key={item} className="flex items-center">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                        <Check className="h-4 w-4 text-emerald-500" />
                      </span>
                      <span className="text-gray-700">
                        {index === 0 && item === 1 && "Upload photos and videos of your performance"}
                        {index === 0 && item === 2 && "Add detailed career history and statistics"}
                        {index === 0 && item === 3 && "Set your preferences and career goals"}
                        
                        {index === 1 && item === 1 && "Machine learning algorithms assess compatibility"}
                        {index === 1 && item === 2 && "Data-driven match percentages calculated"}
                        {index === 1 && item === 3 && "Continuous improvement with new data"}
                        
                        {index === 2 && item === 1 && "Filter recommendations by multiple criteria"}
                        {index === 2 && item === 2 && "Explore detailed match analysis reports"}
                        {index === 2 && item === 3 && "Save favorites for future consideration"}
                        
                        {index === 3 && item === 1 && "Secure messaging system within the platform"}
                        {index === 3 && item === 2 && "Schedule trials and interviews"}
                        {index === 3 && item === 3 && "Provide feedback to improve future matches"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
