
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Award, BookOpen, Briefcase, Calendar, MapPin, Star, Tag, Zap, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Recommendation, getRecommendations } from '@/services/recommendationService';

const RecommendationsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toast } = useToast();
  const { user, profile } = useAuth();

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      let fetchedRecommendations: Recommendation[];
      
      if (user) {
        // Use our new recommendation service if user is logged in
        fetchedRecommendations = await getRecommendations(user.id, 10);
      } else {
        // Fall back to mock recommendations for demo purposes
        fetchedRecommendations = mockRecommendations;
      }
      
      setRecommendations(fetchedRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error loading recommendations",
        description: "Failed to load recommendation data. Please try again later.",
        variant: "destructive",
      });
      
      // Fall back to mock data on error
      setRecommendations(mockRecommendations);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRecommendations();
  }, [user, toast]);
  
  const filteredRecommendations = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === activeTab);
  
  // Get icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case 'player': return <Star className="h-4 w-4 text-amber-500" />;
      case 'club': return <Award className="h-4 w-4 text-blue-500" />;
      case 'event': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'course': return <BookOpen className="h-4 w-4 text-purple-500" />;
      case 'opportunity': return <Briefcase className="h-4 w-4 text-red-500" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getCategoryIcon = (type: string) => {
    return <Tag className="h-4 w-4 text-gray-500" />;
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Personalized Recommendations</h1>
            <p className="text-muted-foreground">
              Tailored recommendations based on your profile, activity, and goals
            </p>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchRecommendations} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="club">Clubs</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="course">Courses</TabsTrigger>
            <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
            <TabsTrigger value="player">Players</TabsTrigger>
            <TabsTrigger value="coach">Coaches</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeletons
                Array(6).fill(0).map((_, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-video w-full bg-muted">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))
              ) : filteredRecommendations.length > 0 ? (
                filteredRecommendations.map(rec => (
                  <Card key={rec.id} className="overflow-hidden">
                    {rec.imageUrl && (
                      <div className="aspect-video w-full bg-muted relative overflow-hidden">
                        <img 
                          src={rec.imageUrl} 
                          alt={rec.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Badge className="bg-background/80 text-foreground">
                            {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                          </Badge>
                          <Badge className="bg-primary">
                            {rec.score}% Match
                          </Badge>
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        {getIcon(rec.type)}
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        {getCategoryIcon(rec.category)}
                        <span>{rec.category}</span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      
                      <div className="flex flex-col space-y-1 text-sm">
                        {rec.location && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{rec.location}</span>
                          </div>
                        )}
                        
                        {rec.date && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{rec.date}</span>
                          </div>
                        )}
                      </div>
                      
                      {rec.tags && rec.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {rec.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <Separator className="my-3" />
                      
                      <div className="text-xs text-muted-foreground flex items-start gap-1">
                        <Zap className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <span>
                          <strong className="font-medium text-primary">Why we recommend this:</strong> {rec.reason}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t bg-muted/20 pt-3 pb-3">
                      <Button 
                        size="sm" 
                        className="w-full"
                        asChild
                      >
                        <a href={`/${rec.type}s/${rec.id}`}>
                          Explore This Recommendation
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No recommendations found for this category.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// Mock recommendations for development and fallback purposes
const mockRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Advanced Finishing Techniques',
    type: 'course',
    category: 'Training',
    description: 'Master the art of clinical finishing with this comprehensive course',
    imageUrl: 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d',
    tags: ['Technical', 'Attacking', 'Shooting'],
    reason: 'Based on your position and skill development goals',
    score: 92
  },
  {
    id: '2',
    title: 'Youth Tournament - Barcelona',
    type: 'event',
    category: 'Competition',
    description: 'International youth tournament with scouts from top European clubs',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
    location: 'Barcelona, Spain',
    date: 'June 15-20, 2025',
    reason: 'Matches your age group and performance level',
    score: 88
  },
  {
    id: '3',
    title: 'FC Ajax Youth Academy',
    type: 'club',
    category: 'Academy',
    description: 'Renowned for developing technical players with strong fundamentals',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Ajax_Amsterdam.svg/1200px-Ajax_Amsterdam.svg.png',
    location: 'Amsterdam, Netherlands',
    reason: 'Aligns with your playing style and development needs',
    score: 86
  },
  {
    id: '4',
    title: 'Mental Strength Coach - Sarah Williams',
    type: 'player',
    category: 'Coaching',
    description: 'Sports psychologist specializing in young athlete mental preparation',
    location: 'Online Sessions Available',
    reason: 'Could help improve your mental game based on recent performances',
    score: 84
  },
  {
    id: '5',
    title: 'Trial Opportunity - Brighton & Hove U23',
    type: 'opportunity',
    category: 'Trial',
    description: 'Week-long trial with Premier League club\'s U23 team',
    location: 'Brighton, UK',
    date: 'July 10-17, 2025',
    reason: 'Matches your skill level and career aspirations',
    score: 83
  }
];

export default RecommendationsPage;
