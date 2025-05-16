
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Define the types for profile
export type ProfileType = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  user_type: 'player' | 'coach' | 'club' | 'agent' | 'sponsor' | 'equipment_supplier';
  created_at: string;
  updated_at: string;
  description?: string;
  club?: string;
  position?: string;
  age?: number;
  country?: string;
};

export type PlayerExperience = {
  id: string;
  player_id: string;
  club: string;
  role: string;
  start_date: string;
  end_date: string | null;
  achievements: string | null;
};

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: ProfileType | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (email: string, password: string, userData: any) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<ProfileType>) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  addPlayerExperience: (experienceData: Omit<PlayerExperience, 'id'>) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  updatePlayerExperience: (id: string, experienceData: Partial<PlayerExperience>) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  deletePlayerExperience: (id: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up session listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Initial session check
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem retrieving your session.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfile(data as ProfileType);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Profile Error",
        description: "Could not fetch your profile data.",
        variant: "destructive",
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullName: userData.fullName,
            userType: userData.userType,
            avatar: userData.avatar || null,
            ...userData
          }
        }
      });
      
      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }
      
      toast({
        title: "Registration Successful",
        description: "Please check your email to confirm your account.",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all user state
      setSession(null);
      setUser(null);
      setProfile(null);
      
      return;
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Logout Error",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };
  
  const updateProfile = async (profileData: Partial<ProfileType>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to update your profile.",
        variant: "destructive",
      });
      return { data: null, error: new Error("Authentication required") };
    }
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Update local state
      if (data) {
        setProfile(data as ProfileType);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };
  
  const addPlayerExperience = async (experienceData: Omit<PlayerExperience, 'id'>) => {
    if (!user) {
      return { data: null, error: new Error("Authentication required") };
    }
    
    try {
      const { data, error } = await supabase
        .from('player_experience')
        .insert({ ...experienceData, player_id: user.id })
        .select()
        .single();
        
      if (error) {
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Experience add error:', error);
      return { data: null, error };
    }
  };
  
  const updatePlayerExperience = async (id: string, experienceData: Partial<PlayerExperience>) => {
    if (!user) {
      return { data: null, error: new Error("Authentication required") };
    }
    
    try {
      const { data, error } = await supabase
        .from('player_experience')
        .update(experienceData)
        .eq('id', id)
        .eq('player_id', user.id) // Security check
        .select()
        .single();
        
      if (error) {
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Experience update error:', error);
      return { data: null, error };
    }
  };
  
  const deletePlayerExperience = async (id: string) => {
    if (!user) {
      return { data: null, error: new Error("Authentication required") };
    }
    
    try {
      const { data, error } = await supabase
        .from('player_experience')
        .delete()
        .eq('id', id)
        .eq('player_id', user.id); // Security check
        
      if (error) {
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Experience delete error:', error);
      return { data: null, error };
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    addPlayerExperience,
    updatePlayerExperience,
    deletePlayerExperience
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
