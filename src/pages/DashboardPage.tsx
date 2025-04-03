
import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import PlayerMatchCard from '@/components/dashboard/PlayerMatchCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ArrowUpRight, Calendar, ChevronRight, User, UserCircle } from 'lucide-react';

const playerMatches = [
  {
    id: '1',
    name: 'Alex Johnson',
    age: 23,
    nationality: 'England',
    matchPercentage: 95,
    position: { name: 'Forward', color: 'red' },
    skills: ['Clinical Finishing', 'Speed', 'Dribbling'],
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    name: 'Maria Gonzalez',
    age: 21,
    nationality: 'Spain',
    matchPercentage: 92,
    position: { name: 'Midfielder', color: 'blue' },
    skills: ['Vision', 'Passing', 'Game Intelligence'],
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    name: 'Kevin Mueller',
    age: 25,
    nationality: 'Germany',
    matchPercentage: 88,
    position: { name: 'Defender', color: 'green' },
    skills: ['Tackles', 'Positioning', 'Aerial Duels'],
    avatarUrl: 'https://randomuser.me/api/portraits/men/67.jpg'
  }
];

const recentActivities = [
  {
    id: '1',
    type: 'match',
    title: 'New match recommendation',
    description: 'Maria Gonzalez • 92% match',
    time: '2 hours ago'
  },
  {
    id: '2',
    type: 'message',
    title: 'New message',
    description: 'From: Alex Johnson',
    time: '5 hours ago'
  },
  {
    id: '3',
    type: 'profile',
    title: 'Profile viewed',
    description: 'Bayern Munich viewed your profile',
    time: '1 day ago'
  }
];

const upcomingEvents = [
  {
    id: '1',
    title: 'Meeting with Alex Johnson',
    date: 'Apr 10, 2025',
    time: '10:00 AM'
  },
  {
    id: '2',
    title: 'Training session with Maria',
    date: 'Apr 12, 2025',
    time: '2:00 PM'
  }
];

const DashboardPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <h1 className="text-2xl font-bold">Welcome, John</h1>
            <p className="text-gray-600">Here's what's happening with your team today</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">New Matches</CardTitle>
                <CardDescription>Players matching your criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">12</div>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">+5 today</Badge>
                </div>
                <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                  <a href="#player-matches" className="flex items-center">
                    View all matches
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Messages</CardTitle>
                <CardDescription>Your recent conversations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">3</div>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20">2 unread</Badge>
                </div>
                <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                  <a href="#" className="flex items-center">
                    Open inbox
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Profile Completion</CardTitle>
                <CardDescription>Increase visibility with a complete profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold">75%</div>
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">In Progress</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                  <a href="#" className="flex items-center">
                    Complete profile
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="bg-white rounded-xl border border-border shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 id="player-matches" className="text-xl font-semibold">Top Matches</h2>
                  <Button variant="outline" className="text-sm" asChild>
                    <a href="#">
                      View all
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </Button>
                </div>
                
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Positions</TabsTrigger>
                    <TabsTrigger value="forwards">Forwards</TabsTrigger>
                    <TabsTrigger value="midfielders">Midfielders</TabsTrigger>
                    <TabsTrigger value="defenders">Defenders</TabsTrigger>
                    <TabsTrigger value="goalkeepers">Goalkeepers</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {playerMatches.map(player => (
                        <PlayerMatchCard key={player.id} {...player} />
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="forwards">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <PlayerMatchCard {...playerMatches[0]} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="midfielders">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <PlayerMatchCard {...playerMatches[1]} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="defenders">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <PlayerMatchCard {...playerMatches[2]} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="goalkeepers">
                    <div className="text-center py-12 text-gray-500">
                      No goalkeeper matches available right now.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <div className="space-y-5">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-start">
                        <div className="rounded-full p-1.5 bg-gray-100 mr-3">
                          {activity.type === 'match' && <User className="h-4 w-4 text-primary" />}
                          {activity.type === 'message' && <Calendar className="h-4 w-4 text-emerald-500" />}
                          {activity.type === 'profile' && <UserCircle className="h-4 w-4 text-amber-500" />}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-gray-500">{activity.description}</p>
                            </div>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="ghost" className="w-full mt-4" size="sm">
                    View all activity
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <div className="space-y-4">
                    {upcomingEvents.map(event => (
                      <div key={event.id} className="flex">
                        <div className="mr-3 text-center">
                          <div className="text-xs font-medium text-gray-500">{event.date.split(',')[0]}</div>
                          <div className="text-lg font-bold">{event.date.split(' ')[1]}</div>
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-gray-500">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4" size="sm" asChild>
                    <a href="#" className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Open Calendar
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
