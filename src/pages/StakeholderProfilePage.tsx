import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, ExternalLink, Users, Calendar, Trophy, Building, Award, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchStakeholder, 
  Stakeholder,
  StakeholderType,
  ClubStakeholder,
  CoachStakeholder,
  AgentStakeholder,
  ServiceProviderStakeholder
} from '@/services/stakeholderService';

// Type guard functions to check the type of stakeholder
const isClub = (stakeholder: Stakeholder): stakeholder is ClubStakeholder => 
  stakeholder.type === 'club';

const isCoach = (stakeholder: Stakeholder): stakeholder is CoachStakeholder => 
  stakeholder.type === 'coach';

const isAgent = (stakeholder: Stakeholder): stakeholder is AgentStakeholder => 
  stakeholder.type === 'agent';

const isServiceProvider = (stakeholder: Stakeholder): stakeholder is ServiceProviderStakeholder => 
  ['equipment_supplier', 'sponsor'].includes(stakeholder.type);

const StakeholderProfilePage = () => {
  const { type, id } = useParams<{ type?: string; id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stakeholderData, setStakeholderData] = useState<Stakeholder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStakeholder = async () => {
      setLoading(true);
      
      if (!type || !id) {
        toast({
          title: "Invalid URL",
          description: "Missing stakeholder type or ID in the URL",
          variant: "destructive"
        });
        return;
      }
      
      // Remove trailing 's' if present to get singular type (e.g., 'players' -> 'player')
      const singularType = type.endsWith('s') ? type.slice(0, -1) : type;
      
      // Validate stakeholder type
      const validTypes: StakeholderType[] = ['player', 'coach', 'club', 'agent', 'sponsor', 'equipment_supplier'];
      const stakeholderType = validTypes.includes(singularType as StakeholderType) 
        ? singularType as StakeholderType
        : 'club'; // Default to club if invalid type
      
      try {
        const stakeholder = await fetchStakeholder(stakeholderType, id);
        if (stakeholder) {
          setStakeholderData(stakeholder);
        } else {
          toast({
            title: "Not Found",
            description: `The ${stakeholderType} profile could not be found`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error loading stakeholder:", error);
        toast({
          title: "Error",
          description: `Failed to load ${stakeholderType} profile`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadStakeholder();
  }, [type, id, toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!stakeholderData) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The profile you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image and Profile */}
      <div className="relative h-64 bg-scout-900">
        {stakeholderData.coverImage && (
          <img 
            src={stakeholderData.coverImage} 
            alt={`${stakeholderData.name} cover`} 
            className="w-full h-full object-cover opacity-60"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white bg-white">
                <AvatarImage src={stakeholderData.avatar} alt={stakeholderData.name} />
                <AvatarFallback>{stakeholderData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="text-center sm:text-left pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{stakeholderData.name}</h1>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <Badge variant="secondary" className="capitalize">{stakeholderData.type.replace('_', ' ')}</Badge>
                  {stakeholderData.location && (
                    <Badge variant="outline" className="text-white border-white">
                      <MapPin className="mr-1 h-3 w-3" />
                      {stakeholderData.location}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 pt-20 pb-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <p className="text-gray-600">{stakeholderData.description}</p>
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Render fields based on stakeholder type */}
                      {isClub(stakeholderData) && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Founded: {stakeholderData.founded || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Stadium: {stakeholderData.stadium || 'N/A'} {stakeholderData.capacity ? `(${stakeholderData.capacity})` : ''}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">League: {stakeholderData.league || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Manager: {stakeholderData.manager || 'N/A'}</span>
                          </div>
                        </>
                      )}
                      
                      {isCoach(stakeholderData) && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Role: {stakeholderData.role || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Current Club: {stakeholderData.club || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Experience: {stakeholderData.experience || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Previous Clubs: {stakeholderData.previousClubs?.length || 'N/A'}</span>
                          </div>
                        </>
                      )}
                      
                      {isAgent(stakeholderData) && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Agency: {stakeholderData.agency || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">License: {stakeholderData.license || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Experience: {stakeholderData.experience || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Clients: {stakeholderData.clients?.length || '0'}</span>
                          </div>
                        </>
                      )}
                      
                      {isServiceProvider(stakeholderData) && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Founded: {stakeholderData.founded || 'N/A'}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Clients: {stakeholderData.clients?.length || '0'}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Lists based on stakeholder type */}
                {isClub(stakeholderData) && stakeholderData.achievements && stakeholderData.achievements.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        {stakeholderData.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-600">{achievement}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {isCoach(stakeholderData) && stakeholderData.achievements && stakeholderData.achievements.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        {stakeholderData.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-600">{achievement}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {isAgent(stakeholderData) && stakeholderData.clients && stakeholderData.clients.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Clients</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        {stakeholderData.clients.map((client, index) => (
                          <li key={index} className="text-gray-600">{client}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {isAgent(stakeholderData) && stakeholderData.specialties && stakeholderData.specialties.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Specialties</h2>
                      <div className="flex flex-wrap gap-2">
                        {stakeholderData.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">{specialty}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {isClub(stakeholderData) && stakeholderData.players && stakeholderData.players.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Key Players</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        {stakeholderData.players.map((player, index) => (
                          <li key={index} className="text-gray-600">{player}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {isServiceProvider(stakeholderData) && stakeholderData.services && stakeholderData.services.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Services</h2>
                      <ul className="list-disc pl-5 space-y-1">
                        {stakeholderData.services.map((service, index) => (
                          <li key={index} className="text-gray-600">{service}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                
                {isServiceProvider(stakeholderData) && stakeholderData.certifications && stakeholderData.certifications.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Certifications</h2>
                      <div className="flex flex-wrap gap-2">
                        {stakeholderData.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="contact" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stakeholderData.email && (
                        <Button variant="outline" className="justify-start" onClick={() => window.location.href = `mailto:${stakeholderData.email}`}>
                          <Mail className="h-4 w-4 mr-2" />
                          {stakeholderData.email}
                        </Button>
                      )}
                      
                      {stakeholderData.phone && (
                        <Button variant="outline" className="justify-start" onClick={() => window.location.href = `tel:${stakeholderData.phone}`}>
                          <Phone className="h-4 w-4 mr-2" />
                          {stakeholderData.phone}
                        </Button>
                      )}
                      
                      {stakeholderData.website && (
                        <Button variant="outline" className="justify-start" onClick={() => window.open(stakeholderData.website, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Website
                        </Button>
                      )}
                      
                      {stakeholderData.location && (
                        <Button variant="outline" className="justify-start">
                          <MapPin className="h-4 w-4 mr-2" />
                          {stakeholderData.location}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="media" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <h3 className="font-medium mb-2">No media content available</h3>
                      <p className="text-muted-foreground">This profile doesn't have any media content yet.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80 space-y-6">
            <Button className="w-full">Contact</Button>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Quick Info</h3>
                <Separator className="mb-3" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Type:</span>
                    <span className="font-medium capitalize">{stakeholderData.type.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{stakeholderData.location || 'N/A'}</span>
                  </div>
                  
                  {isClub(stakeholderData) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">League:</span>
                        <span className="font-medium">{stakeholderData.league || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Founded:</span>
                        <span className="font-medium">{stakeholderData.founded || 'N/A'}</span>
                      </div>
                    </>
                  )}
                  
                  {isCoach(stakeholderData) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Role:</span>
                        <span className="font-medium">{stakeholderData.role || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Club:</span>
                        <span className="font-medium">{stakeholderData.club || 'N/A'}</span>
                      </div>
                    </>
                  )}
                  
                  {isAgent(stakeholderData) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Agency:</span>
                        <span className="font-medium">{stakeholderData.agency || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Experience:</span>
                        <span className="font-medium">{stakeholderData.experience || 'N/A'}</span>
                      </div>
                    </>
                  )}
                  
                  {isServiceProvider(stakeholderData) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Founded:</span>
                        <span className="font-medium">{stakeholderData.founded || 'N/A'}</span>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Share Profile</h3>
                <Separator className="mb-3" />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Copy Link</Button>
                  <Button variant="outline" size="sm" className="flex-1">Share</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeholderProfilePage;
