
import { Link } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Form Side */}
      <div className="flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-scout-900">ScoutAI</span>
            </Link>
          </div>
          
          <RegisterForm />
        </div>
      </div>
      
      {/* Image/Branding Side */}
      <div className="hidden md:block relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Join the AI-Powered Football Community</h1>
          <p className="text-lg text-center max-w-lg text-gray-200">
            Create your profile and connect with players, clubs, agents and service providers in the football ecosystem.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-4 w-full max-w-md">
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-white mb-1">13+</div>
              <div className="text-xs text-gray-300">User Types</div>
            </div>
            
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-white mb-1">850+</div>
              <div className="text-xs text-gray-300">Registered Clubs</div>
            </div>
            
            <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-white mb-1">92%</div>
              <div className="text-xs text-gray-300">Match Accuracy</div>
            </div>
            
            <div className="col-span-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4">
              <div className="text-sm font-medium mb-2">Choose the right profile for you:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-300">• Players</div>
                <div className="text-gray-300">• Clubs</div>
                <div className="text-gray-300">• Managers & Staff</div>
                <div className="text-gray-300">• Agents</div>
                <div className="text-gray-300">• Service Providers</div>
                <div className="text-gray-300">• And more...</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
