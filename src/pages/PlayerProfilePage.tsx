
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import PlayerHeader from '@/components/player/PlayerHeader';
import PlayerOverview from '@/components/player/PlayerOverview';
import PlayerStats from '@/components/player/PlayerStats';
import PlayerHighlights from '@/components/player/PlayerHighlights';
import PlayerExperience from '@/components/player/PlayerExperience';
import PlayerTeamFit from '@/components/player/PlayerTeamFit';
import { playerData, radarData, statsData } from '@/components/player/PlayerData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PlayerProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [playerProfile, setPlayerProfile] = useState<any>(null);
  const [playerMedia, setPlayerMedia] = useState<any[]>([]);

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
            toast({
              title: "Player not found",
              description: "The player profile you're looking for doesn't exist.",
              variant: "destructive"
            });
            navigate('/dashboard');
            return;
          }
          throw profileError;
        }
        
        if (!profileData || profileData.user_type !== 'player') {
          toast({
            title: "Not a player profile",
            description: "This profile doesn't belong to a player.",
            variant: "destructive"
          });
          navigate('/dashboard');
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
        
        // Combine data
        const fullPlayerData = {
          ...profileData,
          ...(playerData || {}),
          media: mediaData || []
        };
        
        setPlayerProfile(fullPlayerData);
        setPlayerMedia(mediaData || []);
        
      } catch (error) {
        console.error('Error fetching player data:', error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading this player's profile.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [id, navigate, toast]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-600">Loading player profile...</p>
      </div>
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
      }
    : playerData;

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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        isSidebarOpen={isSidebarOpen} 
      />
      
      <div className="flex">
        <DashboardSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <div className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <PlayerHeader player={headerData} />
            
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left column - Avatar and basic info */}
                  <div className="col-span-1 md:col-span-3">
                    {/* PlayerHeader is already rendering this */}
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
                          highlights={videos.length > 0 ? videos : playerData.highlights} 
                          photos={photos.length > 0 ? photos : []}
                        />
                      </TabsContent>
                      
                      {/* Experience Tab */}
                      <TabsContent value="experience">
                        <PlayerExperience 
                          experience={playerData.experience} 
                          education={playerData.education} 
                        />
                      </TabsContent>
                      
                      {/* Team Fit Tab */}
                      <TabsContent value="fit">
                        <PlayerTeamFit matchPercentage={playerData.matchPercentage} />
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;
