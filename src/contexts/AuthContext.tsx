
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfile(initialSession.user.id);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          await fetchProfile(newSession.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
        setProfile(data);
        
        // If user is a player, fetch player details
        if (data.user_type === 'player') {
          const { data: playerData, error: playerError } = await supabase
            .from('player_details')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (playerData) {
            setProfile(prev => ({ ...prev, ...playerData }));
          }
        } else {
          // Fetch stakeholder details for non-players
          const { data: stakeholderData, error: stakeholderError } = await supabase
            .from('stakeholder_details')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (stakeholderData) {
            setProfile(prev => ({ ...prev, ...stakeholderData }));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session: refreshedSession } } = await supabase.auth.getSession();
      if (refreshedSession) {
        setSession(refreshedSession);
        setUser(refreshedSession.user);
        await fetchProfile(refreshedSession.user.id);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      isLoading,
      signOut,
      refreshSession
    }}>
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
