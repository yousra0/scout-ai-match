
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

// Define specific types for each stakeholder type
interface BaseStakeholder {
  name: string;
  type: string;
  avatar: string;
  coverImage: string;
  location: string;
  description: string;
  email?: string;
  phone?: string;
  website?: string;
  highlights: {
    title: string;
    url: string;
    thumbnail: string;
  }[];
  photos: {
    url: string;
    caption: string;
  }[];
}

interface ClubProfile extends BaseStakeholder {
  founded: string;
  league: string;
  stadium: string;
  capacity: string;
  manager: string;
  achievements: string[];
  players: string[];
  sponsors: string[];
}

interface CoachProfile extends BaseStakeholder {
  role: string;
  club: string;
  experience: string;
  previousClubs: string[];
  achievements: string[];
}

interface AgentProfile extends BaseStakeholder {
  agency: string;
  license: string;
  experience: string;
  clients: string[];
  specialties: string[];
}

interface ServiceProviderProfile extends BaseStakeholder {
  founded: string;
  services: string[];
  certifications: string[];
  clients: string[];
}

// Union type for all stakeholder types
type StakeholderData = ClubProfile | CoachProfile | AgentProfile | ServiceProviderProfile;

// Type guard functions to check the type of stakeholder
const isClub = (stakeholder: StakeholderData): stakeholder is ClubProfile => 
  stakeholder.type === 'club';

const isCoach = (stakeholder: StakeholderData): stakeholder is CoachProfile => 
  stakeholder.type === 'coach';

const isAgent = (stakeholder: StakeholderData): stakeholder is AgentProfile => 
  stakeholder.type === 'agent';

const isServiceProvider = (stakeholder: StakeholderData): stakeholder is ServiceProviderProfile => 
  ['equipment_supplier', 'sponsor'].includes(stakeholder.type);

// Mock data for different stakeholder types
const mockStakeholderData: Record<string, StakeholderData> = {
  'club': {
    name: 'FC Barcelona',
    type: 'club',
    avatar: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/47/FC_Barcelona_%28crest%29.svg/1200px-FC_Barcelona_%28crest%29.svg.png',
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c643e7485?q=80&w=1470&auto=format&fit=crop',
    location: 'Barcelona, Spain',
    founded: '1899',
    league: 'La Liga',
    stadium: 'Camp Nou',
    capacity: '99,354',
    manager: 'Xavi Hernandez',
    description: 'FC Barcelona is a professional football club based in Barcelona, Catalonia, Spain, that competes in La Liga, the top flight of Spanish football.',
    achievements: [
      '26x La Liga Champions',
      '5x UEFA Champions League winners',
      '31x Copa del Rey winners'
    ],
    players: [
      'Robert Lewandowski',
      'Lamine Yamal',
      'Pedri',
      'Ilkay Gündogan'
    ],
    sponsors: [
      'Nike',
      'Spotify',
      'Beko'
    ],
    email: 'info@fcbarcelona.com',
    phone: '+34 902 1899 00',
    website: 'https://www.fcbarcelona.com',
    highlights: [
      {
        title: 'Barcelona vs Real Madrid - El Clásico Highlights',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1518604100146-5d424ab3faae?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHNvY2NlcnxlbnwwfHwwfHx8MA%3D%3D'
      },
      {
        title: 'Champions League Final',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fHNvY2NlcnxlbnwwfHwwfHx8MA%3D%3D'
      }
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1552667466-07770ae110d0?q=80&w=1470&auto=format&fit=crop',
        caption: 'Camp Nou Stadium'
      },
      {
        url: 'https://images.unsplash.com/photo-1578019239250-e8ed079abdde?q=80&w=1374&auto=format&fit=crop',
        caption: 'Team celebration'
      }
    ]
  },
  'coach': {
    name: 'José Mourinho',
    type: 'coach',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jos%C3%A9_Mourinho.jpg/1200px-Jos%C3%A9_Mourinho.jpg',
    coverImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1493&auto=format&fit=crop',
    location: 'London, UK',
    role: 'Head Coach',
    club: 'AS Roma',
    experience: '20+ years',
    previousClubs: [
      'Chelsea FC',
      'Real Madrid',
      'Manchester United',
      'Inter Milan',
      'Tottenham Hotspur'
    ],
    description: 'José Mourinho is one of the most successful and controversial football managers of all time, known for his tactical knowledge and psychological skills.',
    achievements: [
      '2x UEFA Champions League winner',
      '3x Premier League winner',
      '2x Serie A winner',
      '1x La Liga winner'
    ],
    email: 'jose@specialone.com',
    phone: '+44 123 456 7890',
    highlights: [
      {
        title: 'Mourinho\'s Greatest Moments',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1570498839593-e565b39455fc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODB8fHNvY2NlcnxlbnwwfHwwfHx8MA%3D%3D'
      }
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?q=80&w=1467&auto=format&fit=crop',
        caption: 'Training session'
      }
    ]
  },
  'agent': {
    name: 'Jorge Mendes',
    type: 'agent',
    avatar: 'https://upload.wikimedia.org/wikipedia/commons/c/c0/Jorge_Mendes_2019_%28cropped%29.jpg',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1471&auto=format&fit=crop',
    location: 'Lisbon, Portugal',
    agency: 'Gestifute',
    license: 'FIFA Licensed Agent',
    experience: '25+ years',
    clients: [
      'Cristiano Ronaldo',
      'João Félix',
      'Rúben Dias',
      'Diogo Jota'
    ],
    description: 'Jorge Mendes is a Portuguese football agent who represents many high-profile football players and coaches.',
    specialties: [
      'Contract Negotiation',
      'Player Development',
      'Commercial Deals',
      'Career Management'
    ],
    email: 'contact@gestifute.com',
    phone: '+351 123 456 789',
    highlights: [
      {
        title: 'Jorge Mendes: The Super Agent',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1621570073492-101a8533017e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BvcnRzJTIwYWdlbnR8ZW58MHx8MHx8fDA%3D'
      }
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?q=80&w=1374&auto=format&fit=crop',
        caption: 'Business meeting'
      }
    ]
  },
  'equipment_supplier': {
    name: 'Elite Sports Equipment',
    type: 'equipment_supplier',
    avatar: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1470&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1571902943202-507ec2618b04?q=80&w=1375&auto=format&fit=crop',
    location: 'Manchester, UK',
    founded: '1998',
    description: 'Elite Sports Equipment is a leading provider of high-quality football equipment and training gear for professional clubs and academies.',
    services: [
      'Professional Match Balls',
      'Training Equipment',
      'Goal Technology',
      'Performance Analysis Tools'
    ],
    certifications: [
      'FIFA Approved Supplier',
      'ISO 9001 Certified',
      'Football Foundation Partner'
    ],
    clients: [
      'Premier League',
      'UEFA',
      'Manchester City Academy',
      'Dutch Football Association'
    ],
    email: 'sales@elitesports.com',
    phone: '+44 161 123 4567',
    website: 'https://www.elitesportsequipment.com',
    highlights: [
      {
        title: 'Elite Sports Equipment - Product Showcase',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1526232636376-53d03f24f092?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHNwb3J0cyUyMGVxdWlwbWVudHxlbnwwfHwwfHx8MA%3D%3D'
      }
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1507&auto=format&fit=crop',
        caption: 'Football equipment line'
      }
    ]
  },
  'sponsor': {
    name: 'Global Finance Group',
    type: 'sponsor',
    avatar: 'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=1470&auto=format&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1560520653-9eb1de890f0b?q=80&w=1473&auto=format&fit=crop',
    location: 'London, UK',
    founded: '1982',
    description: 'Global Finance Group is a multinational financial services company with major sponsorship deals across European football.',
    services: [
      'Main Kit Sponsorship',
      'Stadium Naming Rights',
      'Youth Academy Support',
      'Financial Services for Athletes'
    ],
    certifications: [
      'Financial Conduct Authority Regulated',
      'European Sponsorship Association Award Winner'
    ],
    clients: [
      'Arsenal FC',
      'Juventus',
      'Borussia Dortmund',
      'Ajax Amsterdam'
    ],
    email: 'partnerships@globalfinance.com',
    phone: '+44 207 123 4567',
    website: 'https://www.globalfinancegroup.com',
    highlights: [
      {
        title: 'Global Finance Group - Football Partnerships',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ycG9yYXRlfGVufDB8fDB8fHww'
      }
    ],
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1529119513315-c7c361228d67?q=80&w=1374&auto=format&fit=crop',
        caption: 'Sponsorship announcement'
      }
    ]
  }
};

const StakeholderProfilePage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stakeholderData, setStakeholderData] = useState<StakeholderData | null>(null);

  useEffect(() => {
    // In a real app, we would fetch the data from an API
    // For now, we use mock data based on type
    if (type && mockStakeholderData[type]) {
      setStakeholderData(mockStakeholderData[type]);
    } else {
      // Default to club data if type is not found
      setStakeholderData(mockStakeholderData['club']);
    }
  }, [type, id]);

  if (!stakeholderData) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
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
                  <Badge variant="secondary" className="capitalize">{stakeholderData.type}</Badge>
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
                            <span className="text-sm text-gray-600">Founded: {stakeholderData.founded}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Stadium: {stakeholderData.stadium} ({stakeholderData.capacity})</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">League: {stakeholderData.league}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Manager: {stakeholderData.manager}</span>
                          </div>
                        </>
                      )}
                      
                      {isCoach(stakeholderData) && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Role: {stakeholderData.role}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Current Club: {stakeholderData.club}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Experience: {stakeholderData.experience}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Previous Clubs: {stakeholderData.previousClubs.length}</span>
                          </div>
                        </>
                      )}
                      
                      {isAgent(stakeholderData) && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Building className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Agency: {stakeholderData.agency}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Award className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">License: {stakeholderData.license}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Experience: {stakeholderData.experience}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Clients: {stakeholderData.clients.length}</span>
                          </div>
                        </>
                      )}
                      
                      {isServiceProvider(stakeholderData) && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Founded: {stakeholderData.founded}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Clients: {stakeholderData.clients.length}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Lists based on stakeholder type */}
                {isClub(stakeholderData) && stakeholderData.achievements.length > 0 && (
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
                
                {isCoach(stakeholderData) && stakeholderData.achievements.length > 0 && (
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
                
                {isAgent(stakeholderData) && stakeholderData.clients.length > 0 && (
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
                
                {isAgent(stakeholderData) && stakeholderData.specialties.length > 0 && (
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
                
                {isClub(stakeholderData) && stakeholderData.players.length > 0 && (
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
                
                {isServiceProvider(stakeholderData) && stakeholderData.services.length > 0 && (
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
                
                {isServiceProvider(stakeholderData) && stakeholderData.certifications.length > 0 && (
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
              
              <TabsContent value="media" className="space-y-6">
                {/* Highlights/Videos */}
                {stakeholderData.highlights && stakeholderData.highlights.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Highlights</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stakeholderData.highlights.map((highlight, index) => (
                          <a 
                            key={index}
                            href={highlight.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <div className="relative rounded-md overflow-hidden aspect-video">
                              <img 
                                src={highlight.thumbnail} 
                                alt={highlight.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                                  <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-primary ml-1"></div>
                                </div>
                              </div>
                            </div>
                            <h3 className="mt-2 text-sm font-medium line-clamp-2">{highlight.title}</h3>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Photos */}
                {stakeholderData.photos && stakeholderData.photos.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Photos</h2>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stakeholderData.photos.map((photo, index) => (
                          <div key={index} className="space-y-1">
                            <div className="rounded-md overflow-hidden aspect-video">
                              <img 
                                src={photo.url} 
                                alt={photo.caption}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <p className="text-sm text-gray-500">{photo.caption}</p>
                          </div>
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
                    <span className="font-medium capitalize">{stakeholderData.type}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{stakeholderData.location}</span>
                  </div>
                  
                  {isClub(stakeholderData) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">League:</span>
                        <span className="font-medium">{stakeholderData.league}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Founded:</span>
                        <span className="font-medium">{stakeholderData.founded}</span>
                      </div>
                    </>
                  )}
                  
                  {isCoach(stakeholderData) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Role:</span>
                        <span className="font-medium">{stakeholderData.role}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current Club:</span>
                        <span className="font-medium">{stakeholderData.club}</span>
                      </div>
                    </>
                  )}
                  
                  {isAgent(stakeholderData) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Agency:</span>
                        <span className="font-medium">{stakeholderData.agency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Experience:</span>
                        <span className="font-medium">{stakeholderData.experience}</span>
                      </div>
                    </>
                  )}
                  
                  {isServiceProvider(stakeholderData) && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Founded:</span>
                        <span className="font-medium">{stakeholderData.founded}</span>
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
