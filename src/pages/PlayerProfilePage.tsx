
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  BarChart as BarChartIcon,
  Bookmark,
  Calendar,
  ChevronLeft,
  Flag,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Play,
  Share2,
  Star,
  ThumbsUp,
  TrendingUp,
  UserPlus,
  Video,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChartContainer } from '@/components/ui/chart';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from 'recharts';

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
  recentPerformance: [
    { name: 'Match 1', goals: 2, assists: 1 },
    { name: 'Match 2', goals: 0, assists: 2 },
    { name: 'Match 3', goals: 1, assists: 0 },
    { name: 'Match 4', goals: 3, assists: 1 },
    { name: 'Match 5', goals: 1, assists: 2 },
  ],
  highlights: [
    { 
      id: '1',
      title: 'Season Highlights 2024/25', 
      url: '#', 
      thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      duration: '3:42',
      views: '12.5K'
    },
    { 
      id: '2',
      title: 'Best Goals Compilation', 
      url: '#', 
      thumbnail: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      duration: '5:18',
      views: '8.3K'
    },
    { 
      id: '3',
      title: 'Skills & Tricks 2024', 
      url: '#', 
      thumbnail: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      duration: '2:56',
      views: '6.7K'
    },
    { 
      id: '4',
      title: 'Match Winning Performance vs. Liverpool', 
      url: '#', 
      thumbnail: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      duration: '4:22',
      views: '15.2K'
    }
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

// Transform player attributes for the radar chart
const radarData = [
  {
    subject: 'Pace',
    A: playerData.attributes.pace,
    fullMark: 100,
  },
  {
    subject: 'Shooting',
    A: playerData.attributes.shooting,
    fullMark: 100,
  },
  {
    subject: 'Passing',
    A: playerData.attributes.passing,
    fullMark: 100,
  },
  {
    subject: 'Dribbling',
    A: playerData.attributes.dribbling,
    fullMark: 100,
  },
  {
    subject: 'Defending',
    A: playerData.attributes.defending,
    fullMark: 100,
  },
  {
    subject: 'Physical',
    A: playerData.attributes.physical,
    fullMark: 100,
  },
];

// Transform player stats for the bar chart
const statsData = [
  { name: 'Matches', value: playerData.stats.matches },
  { name: 'Goals', value: playerData.stats.goals },
  { name: 'Assists', value: playerData.stats.assists },
  { name: 'Yellow Cards', value: playerData.stats.yellowCards },
  { name: 'Red Cards', value: playerData.stats.redCards },
];

const PlayerProfilePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const { id } = useParams();

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

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
                          <div className="grid grid-cols-1 gap-4">
                            <Card>
                              <CardHeader className="pb-0">
                                <CardTitle className="text-base flex items-center">
                                  <BarChartIcon className="h-4 w-4 mr-2" />
                                  Player Attributes Radar
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="h-72">
                                  <ChartContainer 
                                    config={{
                                      attributes: { color: "#8B5CF6" }
                                    }}
                                  >
                                    <RadarChart data={radarData}>
                                      <PolarGrid />
                                      <PolarAngleAxis dataKey="subject" />
                                      <PolarRadiusAxis domain={[0, 100]} />
                                      <Radar
                                        name="Player"
                                        dataKey="A"
                                        stroke="#8B5CF6"
                                        fill="#8B5CF6"
                                        fillOpacity={0.5}
                                      />
                                      <Legend />
                                    </RadarChart>
                                  </ChartContainer>
                                </div>
                              </CardContent>
                            </Card>

                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="detailed-attributes">
                                <AccordionTrigger className="text-sm font-medium">
                                  View Detailed Attributes
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
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
                        <Card>
                          <CardHeader className="pb-0">
                            <CardTitle className="text-base flex items-center">
                              <BarChartIcon className="h-4 w-4 mr-2" />
                              Performance Statistics
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              <ChartContainer 
                                config={{
                                  stats: { color: "#8B5CF6" }
                                }}
                              >
                                <BarChart data={statsData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="value" fill="#8B5CF6" />
                                </BarChart>
                              </ChartContainer>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-0">
                            <CardTitle className="text-base flex items-center">
                              <TrendingUp className="h-4 w-4 mr-2" />
                              Recent Performance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64">
                              <ChartContainer 
                                config={{
                                  goals: { color: "#8B5CF6" },
                                  assists: { color: "#22C55E" }
                                }}
                              >
                                <BarChart data={playerData.recentPerformance}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="goals" fill="#8B5CF6" name="Goals" />
                                  <Bar dataKey="assists" fill="#22C55E" name="Assists" />
                                </BarChart>
                              </ChartContainer>
                            </div>
                          </CardContent>
                        </Card>
                        
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
                      </TabsContent>
                      
                      {/* Highlights Tab */}
                      <TabsContent value="highlights" className="space-y-6">
                        {selectedVideo ? (
                          <div className="mb-6">
                            <Card>
                              <CardContent className="p-0 overflow-hidden rounded-lg">
                                <div className="relative aspect-video bg-black flex items-center justify-center">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Video className="h-16 w-16 text-white/50" />
                                  </div>
                                  <div className="absolute top-4 right-4">
                                    <Button 
                                      variant="secondary" 
                                      size="sm" 
                                      onClick={handleCloseVideo}
                                      className="bg-black/50 hover:bg-black/70 text-white"
                                    >
                                      Close
                                    </Button>
                                  </div>
                                  <div className="absolute bottom-4 left-4">
                                    <h3 className="text-white font-medium">
                                      {playerData.highlights.find(h => h.id === selectedVideo)?.title}
                                    </h3>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ) : null}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {playerData.highlights.map((highlight) => (
                            <Card key={highlight.id} className="overflow-hidden hover-scale group">
                              <div 
                                className="aspect-video bg-gray-200 relative cursor-pointer"
                                onClick={() => handleVideoSelect(highlight.id)}
                                style={{
                                  backgroundImage: `url(${highlight.thumbnail})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }}
                              >
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                                  <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center">
                                    <Play className="h-6 w-6 text-primary ml-1" />
                                  </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                  {highlight.duration}
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <h4 className="font-semibold line-clamp-1 mb-1">{highlight.title}</h4>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Play className="h-3 w-3" /> {highlight.views} views
                                  </span>
                                  <Badge variant="outline" className="text-xs bg-primary/5">
                                    Highlight
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                        
                        <div className="text-center pt-4">
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
