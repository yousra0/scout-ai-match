
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import PlayerHeader from '@/components/player/PlayerHeader';
import PlayerOverview from '@/components/player/PlayerOverview';
import PlayerStats from '@/components/player/PlayerStats';
import PlayerHighlights from '@/components/player/PlayerHighlights';
import PlayerExperience from '@/components/player/PlayerExperience';
import PlayerTeamFit from '@/components/player/PlayerTeamFit';
import { playerData, radarData, statsData } from '@/components/player/PlayerData';

const PlayerProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { id } = useParams();

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
            <PlayerHeader player={playerData} />
            
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
                          bio={playerData.bio} 
                          attributes={playerData.attributes} 
                          radarData={radarData} 
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
                        <PlayerHighlights highlights={playerData.highlights} />
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
