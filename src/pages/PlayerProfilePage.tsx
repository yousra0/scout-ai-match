
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

import PlayerHeader from '@/components/player/PlayerHeader';
import PlayerOverview from '@/components/player/PlayerOverview';
import PlayerStats from '@/components/player/PlayerStats';
import PlayerAttributes from '@/components/player/PlayerAttributes';
import PlayerExperience from '@/components/player/PlayerExperience';
import PlayerHighlights from '@/components/player/PlayerHighlights';
import PlayerTeamFit from '@/components/player/PlayerTeamFit';
import ProfileEditForm from '@/components/player/ProfileEditForm';

import { playerData } from '@/components/player/PlayerData';
import type { PlayerExperience as PlayerExperienceType } from '@/components/player/PlayerExperience';

const PlayerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playerExperiences, setPlayerExperiences] = useState<PlayerExperienceType[]>([]);

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      if (!id) return;
      
      setLoading(true);
      
      try {
        // Fetch the player profile from Supabase
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, player_details(*)')
          .eq('id', id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        if (profileData) {
          setPlayerProfile({
            ...profileData,
            ...profileData.player_details,
          });
          
          // Fetch player experiences
          const { data: experiences, error: experiencesError } = await supabase
            .from('player_experience')
            .select('*')
            .eq('player_id', id)
            .order('start_date', { ascending: false });
          
          if (experiencesError) {
            console.error('Error fetching player experiences:', experiencesError);
          } else {
            setPlayerExperiences(experiences || []);
          }
        }
      } catch (error) {
        console.error('Error fetching player profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load player profile',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerProfile();
  }, [id, toast]);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleSaveEdit = async (formData: any) => {
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          avatar_url: formData.avatar_url,
        })
        .eq('id', id);
      
      if (profileError) throw profileError;
      
      // Update player_details table
      const { error: playerDetailsError } = await supabase
        .from('player_details')
        .update({
          position: formData.position,
          age: formData.age,
          country: formData.country,
          club: formData.club,
          description: formData.description,
        })
        .eq('id', id);
      
      if (playerDetailsError) throw playerDetailsError;
      
      setPlayerProfile({
        ...playerProfile,
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        position: formData.position,
        age: formData.age,
        country: formData.country,
        club: formData.club,
        description: formData.description,
      });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      setIsEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };
  
  // Determine if current user is viewing their own profile
  const isCurrentUserProfile = user?.id === id;
  
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (!playerProfile) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Player Not Found</h1>
          <p className="mt-2 text-muted-foreground">
            The player profile you are looking for does not exist or has been removed.
          </p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {isEditing ? (
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
          <ProfileEditForm 
            profile={playerProfile}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        </div>
      ) : (
        <>
          <PlayerHeader 
            name={playerProfile.full_name}
            position={playerProfile.position}
            club={playerProfile.club}
            country={playerProfile.country}
            avatarUrl={playerProfile.avatar_url}
            verified={true}
            isCurrentUserProfile={isCurrentUserProfile}
            onEditClick={handleEditClick}
          />
          
          <div className="mt-8">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="team-fit">Team Fit</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="overview" className="space-y-8">
                  <PlayerOverview 
                    description={playerProfile.description || 'No description available.'}
                    age={playerProfile.age || 'N/A'}
                    position={playerProfile.position || 'N/A'}
                    height={playerData.height}
                    weight={playerData.weight}
                    foot={playerData.preferredFoot}
                    nationality={playerProfile.country || 'N/A'}
                  />
                </TabsContent>
                
                <TabsContent value="stats" className="space-y-8">
                  <PlayerStats stats={playerData.stats} />
                </TabsContent>
                
                <TabsContent value="attributes" className="space-y-8">
                  <PlayerAttributes attributes={playerData.attributes} />
                </TabsContent>
                
                <TabsContent value="experience" className="space-y-8">
                  <PlayerExperience 
                    experiences={playerExperiences}
                    isCurrentUserProfile={isCurrentUserProfile}
                    playerId={id || ''}
                  />
                </TabsContent>
                
                <TabsContent value="media" className="space-y-8">
                  <PlayerHighlights highlights={playerData.highlights} />
                </TabsContent>
                
                <TabsContent value="team-fit" className="space-y-8">
                  <PlayerTeamFit matchPercentage={92} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerProfilePage;
