
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Simplified user types
const userTypes = [
  { value: 'player', label: 'Player' },
  { value: 'coach', label: 'Coach' },
  { value: 'club', label: 'Club' },
  { value: 'agent', label: 'Agent' },
  { value: 'equipment_supplier', label: 'Equipment Supplier' },
  { value: 'sponsor', label: 'Sponsor' },
];

// Player positions
const playerPositions = [
  "Goalkeeper",
  "Centre-Back",
  "Left-Back",
  "Right-Back",
  "Full-Back",
  "Sweeper",
  "Defensive Midfield",
  "Central Midfield",
  "Right Midfield",
  "Left Midfield",
  "Attacking Midfield",
  "Left Winger",
  "Right Winger",
  "Winger",
  "Second Striker",
  "Centre-Forward"
];

const RegisterForm = () => {
  const [userType, setUserType] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [position, setPosition] = useState('');
  const [age, setAge] = useState('');
  const [clubName, setClubName] = useState('');
  const [league, setLeague] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [license, setLicense] = useState('');
  const [company, setCompany] = useState('');
  const [services, setServices] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Reset form fields when user type changes
  useEffect(() => {
    setPosition('');
    setAge('');
    setClubName('');
    setLeague('');
    setRole('');
    setExperience('');
    setLicense('');
    setCompany('');
    setServices('');
  }, [userType]);

  // Get dynamic fields based on user type
  const getDynamicFields = () => {
    switch (userType) {
      case 'player':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="position">Playing Position</Label>
              <Select value={position} onValueChange={setPosition} required>
                <SelectTrigger id="position" disabled={isLoading}>
                  <SelectValue placeholder="Select your position" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {playerPositions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                placeholder="Your age" 
                disabled={isLoading}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
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
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="league">League/Division</Label>
              <Input 
                id="league" 
                placeholder="e.g., Premier League, La Liga" 
                disabled={isLoading}
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                required
              />
            </div>
          </>
        );
      case 'coach':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="role">Coaching Role</Label>
              <Input 
                id="role" 
                placeholder="e.g., Head Coach, Assistant Coach, Analyst" 
                disabled={isLoading}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input 
                id="experience" 
                type="number" 
                placeholder="Years of experience" 
                disabled={isLoading}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                required
              />
            </div>
          </>
        );
      case 'agent':
        return (
          <div className="space-y-2">
            <Label htmlFor="license">License Number/ID</Label>
            <Input 
              id="license" 
              placeholder="Your official license number" 
              disabled={isLoading}
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              required
            />
          </div>
        );
      case 'equipment_supplier':
      case 'sponsor':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="company">Company/Organization Name</Label>
              <Input 
                id="company" 
                placeholder="Your company name" 
                disabled={isLoading}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="services">Services/Products Offered</Label>
              <Input 
                id="services" 
                placeholder="Brief description of services or products" 
                disabled={isLoading}
                value={services}
                onChange={(e) => setServices(e.target.value)}
                required
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('player-media')
        .upload(filePath, avatarFile);
        
      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }
      
      const { data } = supabase.storage.from('player-media').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error in avatar upload:', error);
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

    // Validate terms agreement
    if (!agreeTerms) {
      toast({
        title: "Terms and Conditions",
        description: "You must agree to the terms and conditions to register.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName,
            userType,
            position,
            age,
            clubName,
            league,
            role,
            experience,
            license,
            company,
            services,
            // We'll update the avatar URL after upload
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Upload avatar if selected
        if (avatarFile) {
          const avatarUrl = await uploadAvatar(data.user.id);
          
          // Update user metadata with avatar URL
          if (avatarUrl) {
            await supabase.auth.updateUser({
              data: { avatar: avatarUrl }
            });
            
            // Also update the profile record directly for immediate access
            await supabase
              .from('profiles')
              .update({ avatar_url: avatarUrl })
              .eq('id', data.user.id);
          }
        }
        
        toast({
          title: "Account created",
          description: "We've created your account successfully. You can now sign in.",
        });
        
        // Redirect to dashboard or login
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem with your registration.",
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
        {/* Avatar upload */}
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-border">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Profile" />
              ) : (
                <AvatarFallback>{fullName ? fullName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
              )}
            </Avatar>
            <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 rounded-full bg-primary p-2 text-white cursor-pointer">
              <Upload size={16} />
              <input 
                id="avatar-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={isLoading}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">Add a profile picture</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="user-type">I am a</Label>
          <Select value={userType} onValueChange={setUserType} required>
            <SelectTrigger id="user-type" disabled={isLoading}>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
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
        {userType && getDynamicFields()}
        
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
        
        {/* Terms and conditions checkbox */}
        <div className="flex items-start space-x-2 pt-2">
          <Checkbox 
            id="terms" 
            checked={agreeTerms} 
            onCheckedChange={(checked) => setAgreeTerms(checked === true)} 
            disabled={isLoading}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the terms and conditions
            </label>
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
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
    </div>
  );
};

export default RegisterForm;
