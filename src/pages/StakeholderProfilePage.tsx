
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Briefcase, Award, Users, Building, Mail, Phone } from 'lucide-react';
import PlayerHighlights from '@/components/player/PlayerHighlights';

// Mock data for development
const mockStakeholderData = {
  club: {
    name: 'Manchester FC',
    type: 'club',
    avatar: '/placeholder.svg',
    coverImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    location: 'Manchester, UK',
    founded: '1878',
    league: 'Premier League',
    stadium: 'Old Trafford',
    capacity: '74,140',
    manager: 'Erik ten Hag',
    description: 'One of the most successful football clubs in England with a rich history and global fan base.',
    achievements: ['20 League titles', '12 FA Cups', '3 Champions Leagues'],
    website: 'www.manchesterfc.com',
    email: 'info@manchesterfc.com',
    phone: '+44 161 123 4567',
    highlights: [
      {
        id: 'v1',
        title: 'Season Highlights 2023/24',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
        duration: '10:45',
        views: '25K'
      },
      {
        id: 'v2',
        title: 'Training Ground Tour',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        duration: '7:12',
        views: '12K'
      }
    ],
    photos: [
      {
        id: 'p1',
        title: 'Stadium Aerial View',
        url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
        description: 'An aerial view of our stadium on match day'
      },
      {
        id: 'p2',
        title: 'Training Session',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        description: 'Team training session before the big game'
      },
      {
        id: 'p3',
        title: 'Club House',
        url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
        description: 'Our newly renovated club house'
      }
    ]
  },
  manager: {
    name: 'Erik ten Hag',
    type: 'manager',
    avatar: '/placeholder.svg',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    location: 'Manchester, UK',
    role: 'Head Coach',
    club: 'Manchester FC',
    experience: '15 years',
    previousClubs: ['Ajax', 'FC Utrecht', 'Bayern Munich II'],
    description: 'A tactical genius with a proven track record of developing young talent and implementing attractive, attacking football.',
    achievements: ['Eredivisie Champion 2021/22', 'KNVB Cup 2018/19', 'Johan Cruyff Shield 2019'],
    email: 'erik@manchesterfc.com',
    phone: '+44 161 123 4567',
    highlights: [
      {
        id: 'v1',
        title: 'Tactical Analysis',
        url: '#',
        thumbnail: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
        duration: '15:30',
        views: '18K'
      }
    ],
    photos: [
      {
        id: 'p1',
        title: 'Press Conference',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        description: 'Pre-match press conference'
      }
    ]
  },
  player_agent: {
    name: 'Sarah Williams',
    type: 'player_agent',
    avatar: '/placeholder.svg',
    coverImage: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    location: 'London, UK',
    agency: 'Elite Sports Management',
    license: 'FIFA Licensed Agent #12345',
    experience: '8 years',
    clients: ['John Smith', 'Maria Garcia', 'Ahmed Hassan'],
    description: 'Dedicated to representing the best interests of football players with a focus on career development and commercial opportunities.',
    specialties: ['Contract Negotiations', 'Commercial Endorsements', 'Career Planning'],
    email: 'sarah@elitesports.com',
    phone: '+44 20 1234 5678',
    highlights: [],
    photos: [
      {
        id: 'p1',
        title: 'With Client',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        description: 'Meeting with a client'
      }
    ]
  },
  service_provider: {
    name: 'SportsMed Clinic',
    type: 'service_provider',
    avatar: '/placeholder.svg',
    coverImage: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    location: 'Barcelona, Spain',
    founded: '2012',
    services: ['Sports Medicine', 'Physiotherapy', 'Performance Analysis'],
    clients: ['FC Barcelona', 'Spanish Football Federation', 'Olympic Training Center'],
    description: 'State-of-the-art sports medicine facility providing comprehensive healthcare services for elite athletes.',
    certifications: ['FIFA Medical Centre of Excellence', 'IOC Recognized Center'],
    email: 'info@sportsmed.com',
    phone: '+34 93 123 4567',
    website: 'www.sportsmed.com',
    highlights: [],
    photos: [
      {
        id: 'p1',
        title: 'Facility Tour',
        url: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
        description: 'Our world-class medical facility'
      },
      {
        id: 'p2',
        title: 'Rehabilitation Center',
        url: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
        description: 'Specialized rehabilitation center'
      }
    ]
  }
};

const StakeholderProfilePage = () => {
  const { id, type } = useParams<{ id: string, type: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, you would fetch this data based on id and type
  // For now, we'll use mock data based on the type
  const stakeholder = mockStakeholderData[type as keyof typeof mockStakeholderData] || mockStakeholderData.club;
  
  const renderStakeholderDetails = () => {
    switch (stakeholder.type) {
      case 'club':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Club Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Founded</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.founded}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Stadium</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.stadium} ({stakeholder.capacity} capacity)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Users className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">League</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.league}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Manager</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.manager}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {stakeholder.achievements.map((achievement, index) => (
                    <Badge key={index} variant="success" className="text-xs py-1">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'manager':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Professional Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Role</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Current Club</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.club}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Previous Clubs</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.previousClubs.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Achievements</h3>
                <div className="flex flex-wrap gap-2">
                  {stakeholder.achievements.map((achievement, index) => (
                    <Badge key={index} variant="success" className="text-xs py-1">
                      {achievement}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'player_agent':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Professional Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Agency</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.agency}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">License</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.license}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.experience}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Clients</h3>
                <div className="space-y-2">
                  {stakeholder.clients.map((client, index) => (
                    <div key={index} className="p-2 bg-primary/5 rounded flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      <span>{client}</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold text-lg mt-6 mb-4">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {stakeholder.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-1 bg-secondary/10">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'service_provider':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Company Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Company</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Founded</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.founded}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">{stakeholder.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Services</h3>
                <div className="space-y-2">
                  {stakeholder.services.map((service, index) => (
                    <div key={index} className="p-2 bg-primary/5 rounded flex items-center">
                      <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
                <h3 className="font-semibold text-lg mt-6 mb-4">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {stakeholder.certifications.map((cert, index) => (
                    <Badge key={index} variant="success" className="text-xs py-1">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      default:
        return <p>No details available for this stakeholder type.</p>;
    }
  };
  
  const renderContactInfo = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {stakeholder.email && (
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = `mailto:${stakeholder.email}`}>
            <Mail className="h-4 w-4 mr-2" />
            {stakeholder.email}
          </Button>
        )}
        
        {stakeholder.phone && (
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = `tel:${stakeholder.phone}`}>
            <Phone className="h-4 w-4 mr-2" />
            {stakeholder.phone}
          </Button>
        )}
        
        {stakeholder.website && (
          <Button variant="outline" className="justify-start" onClick={() => window.open(`https://${stakeholder.website}`, '_blank')}>
            <Building className="h-4 w-4 mr-2" />
            {stakeholder.website}
          </Button>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="relative">
        {/* Cover image */}
        <div className="h-64 md:h-80 w-full bg-gray-100 relative">
          {stakeholder.coverImage && (
            <img
              src={stakeholder.coverImage}
              alt={`${stakeholder.name} cover`}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        {/* Stakeholder info */}
        <div className="container px-4 mx-auto relative -mt-20 z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md bg-white">
              <AvatarImage src={stakeholder.avatar} alt={stakeholder.name} />
              <AvatarFallback>{stakeholder.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white md:text-gray-900">
                  {stakeholder.name}
                </h1>
                <Badge className="md:h-6 w-fit" variant="secondary">
                  {(() => {
                    switch(stakeholder.type) {
                      case 'club': return 'Club';
                      case 'manager': return 'Manager';
                      case 'player_agent': return 'Player Agent';
                      case 'service_provider': return 'Service Provider';
                      default: return stakeholder.type;
                    }
                  })()}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-white md:text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{stakeholder.location}</span>
              </div>
            </div>
            
            <div className="flex gap-2 md:pb-4">
              <Button>Connect</Button>
              <Button variant="outline">Message</Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container px-4 mx-auto py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 md:w-fit">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="statistics">Statistics</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">About</h3>
                  <p className="text-gray-600">{stakeholder.description}</p>
                  {renderContactInfo()}
                </CardContent>
              </Card>
              
              {renderStakeholderDetails()}
            </TabsContent>
            
            <TabsContent value="media">
              <PlayerHighlights 
                highlights={stakeholder.highlights || []} 
                photos={stakeholder.photos || []} 
              />
            </TabsContent>
            
            <TabsContent value="statistics">
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">Detailed statistics will be available soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default StakeholderProfilePage;
