
import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Bookmark,
  Calendar,
  ChevronLeft,
  Flag,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  Star,
  ThumbsUp,
  UserPlus,
} from 'lucide-react';

// Mock player data
const playerData = {
  id: '1',
  name: 'Alex Johnson',
  age: 23,
  nationality: 'England',
  position: 'Forward',
  club: 'Manchester City FC',
  matchPercentage: 95,
  avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  bio: "Dynamic forward with excellent finishing abilities and strong aerial presence. Specialized in breaking defensive lines and creating scoring opportunities. Looking for a club where I can develop further and contribute to team success.",
  location: 'Manchester, UK',
  lastActive: '2 hours ago',
  stats: {
    matches: 87,
    goals: 54,
    assists: 23,
    yellowCards: 5,
    redCards: 0
  },
  attributes: {
    pace: 88,
    shooting: 92,
    passing: 85,
    dribbling: 87,
    defending: 45,
    physical: 76
  },
  highlights: [
    { title: 'Season Highlights 2024/25', url: '#', thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' },
    { title: 'Best Goals Compilation', url: '#', thumbnail: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' }
  ],
  experience: [
    { 
      club: 'Manchester City FC', 
      role: 'Forward', 
      period: 'Jan 2023 - Present',
      achievements: 'Top scorer of the season with 24 goals'
    },
    { 
      club: 'Leicester City', 
      role: 'Forward', 
      period: 'Aug 2020 - Dec 2022',
      achievements: 'Helped team reach Champions League qualification'
    }
  ],
  education: [
    { institution: 'Manchester United Academy', qualification: 'Professional Youth Program', period: '2015 - 2020' }
  ]
};

const PlayerProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
            <div className="flex items-center space-x-2 mb-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Dashboard
                </Link>
              </Button>
              <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                {playerData.matchPercentage}% Match
              </Badge>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left column - Avatar and basic info */}
                  <div className="col-span-1 md:col-span-3 flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-32 w-32 border-4 border-primary/10">
                      <AvatarImage src={playerData.avatarUrl} alt={playerData.name} />
                      <AvatarFallback>{playerData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h1 className="text-xl font-bold">{playerData.name}</h1>
                      <p className="text-gray-500">{playerData.position}</p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {playerData.position}
                      </Badge>
                      <Badge variant="outline">
                        {playerData.age} years
                      </Badge>
                      <Badge variant="outline">
                        <Flag className="h-3 w-3 mr-1" />
                        {playerData.nationality}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col w-full space-y-2">
                      <Button>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setIsSaved(!isSaved)}
                      >
                        {isSaved ? (
                          <>
                            <Bookmark className="h-4 w-4 mr-2 fill-primary" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Bookmark className="h-4 w-4 mr-2" />
                            Save Profile
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="w-full flex justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {playerData.location}
                      </div>
                      <div>
                        Active {playerData.lastActive}
                      </div>
                    </div>
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
                      <TabsContent value="overview" className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">About</h3>
                          <p className="text-gray-600">{playerData.bio}</p>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Key Attributes</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(playerData.attributes).map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span className="capitalize">{key}</span>
                                  <span className="font-medium">{value}/100</span>
                                </div>
                                <Progress value={value} className="h-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button variant="outline" className="justify-start">
                              <Mail className="h-4 w-4 mr-2" />
                              Email
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <Phone className="h-4 w-4 mr-2" />
                              Phone
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* Stats Tab */}
                      <TabsContent value="stats" className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                          <Card className="text-center">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-medium text-gray-500">Matches</CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                              <p className="text-3xl font-bold">{playerData.stats.matches}</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="text-center">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-medium text-gray-500">Goals</CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                              <p className="text-3xl font-bold">{playerData.stats.goals}</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="text-center">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-medium text-gray-500">Assists</CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                              <p className="text-3xl font-bold">{playerData.stats.assists}</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="text-center">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-medium text-gray-500">Yellow Cards</CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                              <p className="text-3xl font-bold">{playerData.stats.yellowCards}</p>
                            </CardContent>
                          </Card>
                          
                          <Card className="text-center">
                            <CardHeader className="py-3">
                              <CardTitle className="text-sm font-medium text-gray-500">Red Cards</CardTitle>
                            </CardHeader>
                            <CardContent className="py-3">
                              <p className="text-3xl font-bold">{playerData.stats.redCards}</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                          <div className="bg-gray-100 rounded-lg p-4 text-center">
                            <p className="text-gray-500 text-sm">Detailed performance metrics and statistics will be displayed here.</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* Highlights Tab */}
                      <TabsContent value="highlights" className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {playerData.highlights.map((highlight, index) => (
                            <div key={index} className="border border-border rounded-lg overflow-hidden">
                              <div className="aspect-video bg-gray-200 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-primary border-b-[8px] border-b-transparent ml-1"></div>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <h4 className="font-semibold">{highlight.title}</h4>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-center">
                          <Button variant="outline">Load More Videos</Button>
                        </div>
                      </TabsContent>
                      
                      {/* Experience Tab */}
                      <TabsContent value="experience" className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Club Experience</h3>
                          <div className="space-y-6">
                            {playerData.experience.map((exp, index) => (
                              <div key={index} className="border-l-2 border-primary pl-4 pb-6">
                                <h4 className="font-medium">{exp.club}</h4>
                                <div className="text-sm text-gray-600">{exp.role} • {exp.period}</div>
                                <p className="mt-1 text-sm">{exp.achievements}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Education & Training</h3>
                          <div className="space-y-6">
                            {playerData.education.map((edu, index) => (
                              <div key={index} className="border-l-2 border-gray-300 pl-4">
                                <h4 className="font-medium">{edu.institution}</h4>
                                <div className="text-sm text-gray-600">{edu.qualification} • {edu.period}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* Team Fit Tab */}
                      <TabsContent value="fit" className="space-y-6">
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
                          <div className="bg-green-100 rounded-full p-2 mr-4">
                            <ThumbsUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-green-800">Excellent Match for Your Team</h4>
                            <p className="text-sm text-green-700">This player's skills and playing style align with your team's needs.</p>
                          </div>
                          <div className="ml-auto">
                            <div className="text-2xl font-bold text-green-600">{playerData.matchPercentage}%</div>
                            <div className="text-xs text-green-700">match score</div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Match Factors</h3>
                          <div className="space-y-4">
                            <div className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">Playing Style Compatibility</div>
                                <Badge className="bg-green-100 text-green-800">High</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Player's direct attacking style complements your team's counter-attacking approach.
                              </p>
                            </div>
                            
                            <div className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">Position Needs</div>
                                <Badge className="bg-green-100 text-green-800">Perfect</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Your team needs a forward with finishing ability - this player excels in this area.
                              </p>
                            </div>
                            
                            <div className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">Team Chemistry</div>
                                <Badge className="bg-amber-100 text-amber-800">Good</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Player has previously worked with 2 members of your coaching staff.
                              </p>
                            </div>
                            
                            <div className="p-3 border border-gray-200 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">Development Potential</div>
                                <Badge className="bg-green-100 text-green-800">High</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                Player is entering peak years with room to develop further under your coaching system.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 justify-center pt-4">
                          <Button>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Player
                          </Button>
                          <Button variant="outline">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share Profile
                          </Button>
                        </div>
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
