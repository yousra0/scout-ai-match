
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import PlayerHeader from '@/components/player/PlayerHeader';
import PlayerOverview from '@/components/player/PlayerOverview';
import PlayerStats from '@/components/player/PlayerStats';
import PlayerHighlights from '@/components/player/PlayerHighlights';
import PlayerExperience from '@/components/player/PlayerExperience';
import PlayerTeamFit from '@/components/player/PlayerTeamFit';
import { playerData, radarData, statsData } from '@/components/player/PlayerData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth, PlayerExperience as PlayerExperienceType } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileEditForm from '@/components/player/ProfileEditForm';

const PlayerProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [playerMedia, setPlayerMedia] = useState<any[]>([]);
  const [playerExperiences, setPlayerExperiences] = useState<PlayerExperienceType[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const isCurrentUserProfile = user?.id === id;

  useEffect(() => {
    const fetchPlayerData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (profileError) {
          if (profileError.code === 'PGRST116') {
            // Record not found
            setNotFound(true);
            toast({
              title: "Player not found",
              description: "The player profile you're looking for doesn't exist.",
              variant: "destructive"
            });
            return;
          }
          throw profileError;
        }
        
        if (!profileData || profileData.user_type !== 'player') {
          setNotFound(true);
          toast({
            title: "Not a player profile",
            description: "This profile doesn't belong to a player.",
            variant: "destructive"
          });
          return;
        }
        
        // Fetch player details
        const { data: playerData, error: playerError } = await supabase
          .from('player_details')
          .select('*')
          .eq('id', id)
          .single();
          
        if (playerError && playerError.code !== 'PGRST116') {
          throw playerError;
        }
        
        // Fetch player media
        const { data: mediaData, error: mediaError } = await supabase
          .from('player_media')
          .select('*')
          .eq('player_id', id);
          
        if (mediaError) {
          throw mediaError;
        }
        
        // Fetch player experiences
        const { data: experienceData, error: experienceError } = await supabase
          .from('player_experience')
          .select('*')
          .eq('player_id', id)
          .order('start_date', { ascending: false });
          
        if (experienceError) {
          throw experienceError;
        }
        
        // Combine data
        const fullPlayerData = {
          ...profileData,
          ...(playerData || {}),
          media: mediaData || []
        };
        
        setPlayerProfile(fullPlayerData);
        setPlayerMedia(mediaData || []);
        setPlayerExperiences(experienceData || []);
        
      } catch (error) {
        console.error('Error fetching player data:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading this player's profile.",
          variant: "destructive"
        });
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [id, navigate, toast]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Loading player profile...</p>
        </div>
      </Layout>
    );
  }

  // If not found, show not found message
  if (notFound) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <div className="text-xl font-semibold mb-2">Player Not Found</div>
          <p className="text-gray-600 mb-6">The player profile you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => navigate('/')} variant="default">
            Go Home
          </Button>
        </div>
      </Layout>
    );
  }

  // Prepare data for PlayerHeader
  const headerData = playerProfile 
    ? {
        name: playerProfile.full_name || 'Unknown Player',
        position: playerProfile.position || 'Position not specified',
        age: playerProfile.age || 0,
        nationality: playerProfile.country || 'Unknown',
        avatarUrl: playerProfile.avatar_url || 'https://ui-avatars.com/api/?name=Unknown+Player',
        location: playerProfile.club || 'Not specified',
        lastActive: 'Recently',
        matchPercentage: 85, // Default match percentage
        id: id
      }
    : { ...playerData, id };

  // Process media for highlights and photos
  const photos = playerMedia
    .filter(item => item.media_type === 'photo')
    .map(item => ({
      id: item.id,
      title: item.title,
      url: item.media_url,
      description: item.description
    }));
    
  const videos = playerMedia
    .filter(item => item.media_type === 'video')
    .map(item => ({
      id: item.id,
      title: item.title,
      url: item.media_url,
      thumbnail: item.media_url,
      duration: '00:30', // Placeholder
      views: '0' // Placeholder
    }));

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Card>
            <CardContent className="p-6">
              {isEditingProfile ? (
                <ProfileEditForm
                  playerProfile={playerProfile}
                  onCancel={() => setIsEditingProfile(false)}
                  onSuccess={(updatedProfile) => {
                    setPlayerProfile({...playerProfile, ...updatedProfile});
                    setIsEditingProfile(false);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left column - Avatar and basic info */}
                  <div className="col-span-1 md:col-span-3">
                    <PlayerHeader player={headerData} />
                    
                    {isCurrentUserProfile && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => setIsEditingProfile(true)} 
                          variant="outline" 
                          className="w-full"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {/* Right column - Tabs with detailed info */}
                  <div className="col-span-1 md:col-span-9">
                    <Tabs defaultValue="overview">
                      <TabsList className="mb-6 grid grid-cols-5 md:w-auto">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="stats">Stats</TabsTrigger>
                        <TabsTrigger value="highlights">Highlights</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="fit">Team Fit</TabsTrigger>
                      </TabsList>
                      
                      {/* Overview Tab */}
                      <TabsContent value="overview">
                        <PlayerOverview 
                          bio={playerProfile?.description || playerData.bio} 
                          attributes={playerData.attributes} 
                          radarData={radarData}
                          contact={playerProfile ? {
                            email: user?.email,
                            location: playerProfile.club || 'Not specified',
                          } : undefined}
                        />
                      </TabsContent>
                      
                      {/* Stats Tab */}
                      <TabsContent value="stats">
                        <PlayerStats 
                          stats={playerData.stats} 
                          statsData={statsData} 
                          recentPerformance={playerData.recentPerformance}
                        />
                      </TabsContent>
                      
                      {/* Highlights Tab */}
                      <TabsContent value="highlights">
                        <PlayerHighlights 
                          mediaItems={videos.length > 0 ? videos : playerData.highlights} 
                          photoItems={photos.length > 0 ? photos : []} 
                          isCurrentUserProfile={isCurrentUserProfile}
                          playerId={id || ''}
                        />
                      </TabsContent>
                      
                      {/* Experience Tab */}
                      <TabsContent value="experience">
                        <PlayerExperience 
                          experiences={playerExperiences.length > 0 ? playerExperiences : playerData.experience}
                          education={playerData.education}
                          isCurrentUserProfile={isCurrentUserProfile}
                          playerId={id || ''}
                        />
                      </TabsContent>
                      
                      {/* Team Fit Tab */}
                      <TabsContent value="fit">
                        <PlayerTeamFit matchPercentage={playerData.matchPercentage} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PlayerProfilePage;
