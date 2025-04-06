
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Globe, MapPin, Search, Briefcase, Users, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

type Opportunity = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'trial' | 'academy';
  category: 'player' | 'coach' | 'staff' | 'management' | 'medical' | 'other';
  description: string;
  requirements: string[];
  posted: string;
  deadline: string;
  logo?: string;
};

const opportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Youth Academy Coach',
    company: 'Manchester City FC',
    location: 'Manchester, UK',
    type: 'full-time',
    category: 'coach',
    description: 'We are looking for an experienced youth coach to join our academy setup. The ideal candidate will have a proven track record in developing young talent.',
    requirements: ['UEFA A License', '5+ years coaching experience', 'Experience with youth development', 'Strong communication skills'],
    posted: '2 days ago',
    deadline: 'Apr 30, 2025',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Manchester_City_FC_badge.svg/1200px-Manchester_City_FC_badge.svg.png',
  },
  {
    id: '2',
    title: 'First Team Goalkeeper',
    company: 'Ajax Amsterdam',
    location: 'Amsterdam, Netherlands',
    type: 'full-time',
    category: 'player',
    description: 'Ajax Amsterdam is seeking a first-team goalkeeper for the upcoming season. The ideal candidate will have experience playing at a high level and excellent distribution skills.',
    requirements: ['Professional playing experience', 'Strong leadership qualities', 'Excellent distribution skills', 'Good command of English'],
    posted: '1 week ago',
    deadline: 'May 15, 2025',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Ajax_Amsterdam.svg/1200px-Ajax_Amsterdam.svg.png',
  },
  {
    id: '3',
    title: 'Academy Trial - U17 Midfielders',
    company: 'AS Roma',
    location: 'Rome, Italy',
    type: 'trial',
    category: 'player',
    description: 'Opportunity for talented midfielders born between 2008-2009 to trial with our U17 academy team. One-week assessment with potential for academy contracts.',
    requirements: ['Born 2008-2009', 'Central or attacking midfielder', 'Technical proficiency', 'Good tactical understanding'],
    posted: '3 days ago',
    deadline: 'May 5, 2025',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/AS_Roma_logo_%282017%29.svg/1200px-AS_Roma_logo_%282017%29.svg.png',
  },
  {
    id: '4',
    title: 'Performance Analyst',
    company: 'Bayer Leverkusen',
    location: 'Leverkusen, Germany',
    type: 'full-time',
    category: 'staff',
    description: 'Join our performance analysis department to help provide insights for our coaching staff. You will be responsible for analyzing opposition and helping prepare tactical briefings.',
    requirements: ['Degree in Sports Science or related field', 'Experience with video analysis software', 'Understanding of football tactics', 'German language skills preferred'],
    posted: '5 days ago',
    deadline: 'May 20, 2025',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/1200px-Bayer_04_Leverkusen_logo.svg.png',
  },
  {
    id: '5',
    title: 'Sports Therapist',
    company: 'Sporting Lisbon',
    location: 'Lisbon, Portugal',
    type: 'part-time',
    category: 'medical',
    description: 'Part-time sports therapist needed for our youth academy. You will be responsible for injury prevention, assessment, and rehabilitation.',
    requirements: ['Degree in Sports Therapy', 'Experience in sports environment', 'First aid certification', 'Available weekends'],
    posted: '1 week ago',
    deadline: 'Apr 25, 2025',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Sporting_CP_logo.svg/1200px-Sporting_CP_logo.svg.png',
  },
];

const OpportunitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locFilter, setLocFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(opportunities);
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAuth();

  // Apply filters
  const applyFilters = () => {
    let filtered = opportunities;
    
    if (searchTerm) {
      filtered = filtered.filter(opp => 
        opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locFilter) {
      filtered = filtered.filter(opp => 
        opp.location.toLowerCase().includes(locFilter.toLowerCase())
      );
    }
    
    if (typeFilter) {
      filtered = filtered.filter(opp => opp.type === typeFilter);
    }
    
    if (categoryFilter) {
      filtered = filtered.filter(opp => opp.category === categoryFilter);
    }
    
    setFilteredOpportunities(filtered);
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setLocFilter('');
    setTypeFilter('');
    setCategoryFilter('');
    setFilteredOpportunities(opportunities);
    setShowFilters(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Football Opportunities</h1>
          <p className="text-muted-foreground">
            Discover jobs, trials, and opportunities across the football ecosystem
          </p>
        </div>
        
        {/* Search and filter bar */}
        <div className="bg-card border rounded-lg p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search opportunities..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              
              <Button onClick={applyFilters}>Search</Button>
            </div>
          </div>
          
          {/* Extended filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-1 block">Location</label>
                <Input
                  placeholder="City, Country..."
                  value={locFilter}
                  onChange={(e) => setLocFilter(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Opportunity Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="academy">Academy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="player">Player</SelectItem>
                    <SelectItem value="coach">Coach</SelectItem>
                    <SelectItem value="staff">Technical Staff</SelectItem>
                    <SelectItem value="management">Management</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={resetFilters}>Reset</Button>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredOpportunities.length} opportunities
        </div>
        
        {/* Opportunities list */}
        <div className="space-y-4">
          {filteredOpportunities.length > 0 ? (
            filteredOpportunities.map(opp => (
              <Card key={opp.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 p-6 flex justify-center items-center bg-muted/30">
                    {opp.logo ? (
                      <img 
                        src={opp.logo} 
                        alt={opp.company} 
                        className="max-h-24 max-w-[120px] object-contain"
                      />
                    ) : (
                      <Briefcase className="h-16 w-16 text-muted-foreground/50" />
                    )}
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold">{opp.title}</h3>
                        <p className="text-muted-foreground">{opp.company}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 md:mt-0">
                        <Badge variant={opp.type === 'trial' ? 'default' : 'outline'} className="capitalize">
                          {opp.type.replace('-', ' ')}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {opp.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{opp.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        <span>Deadline: {opp.deadline}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>Posted {opp.posted}</span>
                      </div>
                    </div>
                    
                    <p className="mb-4 text-sm">{opp.description}</p>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">View Details</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{opp.title}</DialogTitle>
                          <DialogDescription>{opp.company} • {opp.location}</DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 my-2">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="capitalize">
                              {opp.type.replace('-', ' ')}
                            </Badge>
                            <Badge variant="secondary" className="capitalize">
                              {opp.category}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{opp.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>Deadline: {opp.deadline}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              <span>Posted {opp.posted}</span>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm">{opp.description}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Requirements</h4>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {opp.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center text-sm">
                            <Globe className="h-4 w-4 mr-1" />
                            <span>Apply at our website or contact us for more information.</span>
                          </div>
                        </div>
                        
                        <DialogFooter className="gap-2 sm:justify-between">
                          <div className="flex items-center">
                            <Checkbox id="save" className="mr-2" />
                            <label htmlFor="save" className="text-sm">Save to my opportunities</label>
                          </div>
                          
                          {user ? (
                            <Button>Apply Now</Button>
                          ) : (
                            <Button asChild>
                              <a href="/login">Login to Apply</a>
                            </Button>
                          )}
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Users className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
              <h3 className="text-lg font-medium mb-1">No opportunities found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>

        {user && (
          <div className="mt-8 p-6 bg-primary/5 border rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">Looking to post an opportunity?</h3>
                <p className="text-muted-foreground">
                  Share your club or organization's opportunities with our community of talented players and professionals.
                </p>
              </div>
              <Button size="lg">Post an Opportunity</Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OpportunitiesPage;
