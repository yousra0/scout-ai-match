
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// User type definitions with their display names
const userTypes = [
  { value: 'player', label: 'Player' },
  { value: 'club', label: 'Club' },
  { value: 'manager', label: 'Manager & Staff' },
  { value: 'player_agent', label: 'Player\'s Agent' },
  { value: 'recruiting_agent', label: 'Recruiting Agent' },
  { value: 'service_provider', label: 'Service Provider' },
  { value: 'sport_management', label: 'Sporting Management Agency' },
  { value: 'communication', label: 'Communication Box' },
  { value: 'fitness_club', label: 'Fitness Club' },
  { value: 'equipment_supplier', label: 'Equipment Supplier' },
  { value: 'clothing_brand', label: 'Sports Clothing Brand' },
  { value: 'travel_agency', label: 'Traveling Agency' },
  { value: 'sponsor', label: 'Sponsor' },
];

const RegisterForm = () => {
  const [userType, setUserType] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get dynamic fields based on user type
  const getDynamicFields = () => {
    switch (userType) {
      case 'player':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="position">Playing Position</Label>
              <Input 
                id="position" 
                placeholder="e.g., Striker, Midfielder, Goalkeeper" 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                placeholder="Your age" 
                disabled={isLoading}
              />
            </div>
          </>
        );
      case 'club':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="club-name">Club Name</Label>
              <Input 
                id="club-name" 
                placeholder="Official club name" 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="league">League/Division</Label>
              <Input 
                id="league" 
                placeholder="e.g., Premier League, La Liga" 
                disabled={isLoading}
              />
            </div>
          </>
        );
      case 'manager':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input 
                id="role" 
                placeholder="e.g., Head Coach, Assistant Coach, Analyst" 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input 
                id="experience" 
                type="number" 
                placeholder="Years of experience" 
                disabled={isLoading}
              />
            </div>
          </>
        );
      // Additional cases for other user types
      case 'player_agent':
      case 'recruiting_agent':
        return (
          <div className="space-y-2">
            <Label htmlFor="license">License Number/ID</Label>
            <Input 
              id="license" 
              placeholder="Your official license number" 
              disabled={isLoading}
            />
          </div>
        );
      case 'service_provider':
      case 'sport_management':
      case 'communication':
      case 'fitness_club':
      case 'equipment_supplier':
      case 'clothing_brand':
      case 'travel_agency':
      case 'sponsor':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="company">Company/Organization Name</Label>
              <Input 
                id="company" 
                placeholder="Your company name" 
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="services">Services Offered</Label>
              <Input 
                id="services" 
                placeholder="Brief description of services" 
                disabled={isLoading}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Here we would integrate with the backend API
    try {
      // Fake API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Account created",
        description: "We've created your account successfully.",
      });
      
      // Redirect to login would happen here
      // navigate('/login');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "There was a problem with your registration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-gray-500">Enter your information to get started</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-type">I am a</Label>
          <Select value={userType} onValueChange={setUserType} required>
            <SelectTrigger id="user-type" disabled={isLoading}>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {userTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input 
            id="full-name" 
            placeholder="John Doe" 
            required 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        {/* Dynamic fields based on user type */}
        {getDynamicFields()}
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            Password must be at least 8 characters and include a number and special character.
          </p>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading || !userType}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
      
      <p className="text-xs text-center text-gray-500">
        By creating an account, you agree to our{' '}
        <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
      </p>
    </div>
  );
};

export default RegisterForm;
