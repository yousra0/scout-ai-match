
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const RegisterForm = () => {
  const [userType, setUserType] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            <SelectContent>
              <SelectItem value="player">Player</SelectItem>
              <SelectItem value="club">Club Representative</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
              <SelectItem value="scout">Scout</SelectItem>
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
