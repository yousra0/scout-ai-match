
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const LoginPage = () => {
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
          
          <LoginForm />
        </div>
      </div>
      
      {/* Image/Branding Side */}
      <div className="hidden md:block relative overflow-hidden hero-gradient">
        <div className="absolute inset-0 flex flex-col justify-center items-center p-16 text-white">
          <h1 className="text-3xl font-bold mb-6 text-center">Welcome to the Future of Football Talent Scouting</h1>
          <p className="text-lg text-center max-w-lg text-gray-200">
            Connect with the perfect players and clubs using our AI-powered matching technology.
          </p>
          
          <div className="mt-12 w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold">FC</span>
              </div>
              <div>
                <div className="font-medium text-white">FC Barcelona</div>
                <div className="text-xs text-gray-300">Premier League • Spain</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/10 rounded p-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20"></div>
                  <span>Carlos Rodriguez</span>
                </div>
                <span className="text-emerald-400 font-semibold">92%</span>
              </div>
              
              <div className="flex justify-between items-center bg-white/10 rounded p-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20"></div>
                  <span>Maria Santos</span>
                </div>
                <span className="text-emerald-400 font-semibold">88%</span>
              </div>
              
              <div className="flex justify-between items-center bg-white/10 rounded p-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20"></div>
                  <span>Alex Johnson</span>
                </div>
                <span className="text-emerald-400 font-semibold">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
