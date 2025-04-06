
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BarChart3, MessageSquare, Shield, Star, Target, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type Match = {
  id: string;
  name: string;
  type: 'player' | 'coach' | 'club' | 'agent' | 'sponsor' | 'equipment_supplier';
  matchScore: number;
  description: string;
  avatarUrl?: string;
  location?: string;
  skills?: string[];
  position?: string;
};

const MatchingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    // In a real app, this would fetch from your ML matching API
    // For demo, we'll simulate a loading delay and use mock data
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data - in real app would come from backend
        const mockMatches: Match[] = [
          {
            id: '1',
            name: 'FC Barcelona Youth Academy',
            type: 'club',
            matchScore: 95,
            description: 'Looking for talented young players with technical skills',
            avatarUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
            location: 'Barcelona, Spain',
          },
          {
            id: '2',
            name: 'Marco Rossi',
            type: 'coach',
            matchScore: 93,
            description: 'Specializes in developing young attacking talent',
            skills: ['Youth Development', 'Attacking Tactics', 'Technical Training'],
            location: 'Milan, Italy',
          },
          {
            id: '3',
            name: 'Sarah Johnson',
            type: 'player',
            matchScore: 91,
            description: 'Talented midfielder looking for a new challenge',
            position: 'Midfielder',
            location: 'London, UK',
            skills: ['Passing', 'Vision', 'Ball Control'],
          },
          {
            id: '4',
            name: 'Elite Sports Agency',
            type: 'agent',
            matchScore: 88,
            description: 'Specializing in career development for young talents',
            location: 'Paris, France',
          },
          {
            id: '5',
            name: 'SportEquip Pro',
            type: 'equipment_supplier',
            matchScore: 82,
            description: 'Custom equipment for professional athletes',
            location: 'Berlin, Germany',
          },
          {
            id: '6',
            name: 'Global Sports Foundation',
            type: 'sponsor',
            matchScore: 85,
            description: 'Supporting the next generation of sports stars',
            location: 'New York, USA',
          },
        ];
        
        setMatches(mockMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
        toast({
          title: "Error loading matches",
          description: "Failed to load matching data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMatches();
  }, [toast]);
  
  const filteredMatches = selectedTab === 'all' 
    ? matches 
    : matches.filter(match => match.type === selectedTab);
  
  // Get icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case 'player': return <User className="h-4 w-4" />;
      case 'coach': return <Target className="h-4 w-4" />;
      case 'club': return <Shield className="h-4 w-4" />;
      case 'agent': return <BarChart3 className="h-4 w-4" />;
      case 'sponsor': return <Star className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI-Powered Matching</h1>
          <p className="text-muted-foreground">
            Find your perfect match in the football ecosystem based on our advanced AI algorithm
          </p>
        </div>
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="player">Players</TabsTrigger>
            <TabsTrigger value="coach">Coaches</TabsTrigger>
            <TabsTrigger value="club">Clubs</TabsTrigger>
            <TabsTrigger value="agent">Agents</TabsTrigger>
            <TabsTrigger value="sponsor">Sponsors</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array(6).fill(0).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : filteredMatches.length > 0 ? (
                filteredMatches.map(match => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={match.avatarUrl} alt={match.name} />
                            <AvatarFallback>{match.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{match.name}</CardTitle>
                            <CardDescription>
                              <div className="flex items-center">
                                {getIcon(match.type)}
                                <span className="ml-1 capitalize">{match.type.replace('_', ' ')}</span>
                                {match.location && (
                                  <span className="ml-2 text-xs">• {match.location}</span>
                                )}
                              </div>
                            </CardDescription>
                          </div>
                        </div>
                        <Badge className="bg-primary">{match.matchScore}% Match</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{match.description}</p>
                      
                      {match.position && (
                        <Badge variant="outline" className="mb-2">{match.position}</Badge>
                      )}
                      
                      {match.skills && match.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {match.skills.map(skill => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Match Score</span>
                          <span className="font-semibold">{match.matchScore}%</span>
                        </div>
                        <Progress value={match.matchScore} className="h-2" />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 pt-3 pb-3">
                      <div className="flex w-full justify-between">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/${match.type}s/${match.id}`}>View Profile</a>
                        </Button>
                        
                        {user && (
                          <Button size="sm" variant="default" className="gap-1">
                            <MessageSquare className="h-4 w-4" />
                            Contact
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No matches found for this category.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MatchingPage;
