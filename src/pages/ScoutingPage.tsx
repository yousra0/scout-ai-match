
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, User, Trophy, Star } from 'lucide-react';
import PlayerScoutCard from '@/components/scouting/PlayerScoutCard';
import ScoutingFilters from '@/components/scouting/ScoutingFilters';

// Mock data for development - will be replaced with API calls
const mockPlayers = [
  {
    id: 1,
    name: 'Alex Johnson',
    position: 'Forward',
    age: 22,
    country: 'England',
    club: 'Manchester FC',
    rating: 87,
    compatibilityScore: 92,
    skills: ['Fast', 'Technical', 'Good shooter'],
    image: '/placeholder.svg'
  },
  {
    id: 2,
    name: 'Carlos Silva',
    position: 'Midfielder',
    age: 24,
    country: 'Brazil',
    club: 'São Paulo FC',
    rating: 84,
    compatibilityScore: 88,
    skills: ['Playmaker', 'Passing', 'Vision'],
    image: '/placeholder.svg'
  },
  {
    id: 3,
    name: 'Mohammed Ali',
    position: 'Defender',
    age: 26,
    country: 'Egypt',
    club: 'Cairo United',
    rating: 82,
    compatibilityScore: 85,
    skills: ['Strong', 'Good header', 'Tackling'],
    image: '/placeholder.svg'
  },
  {
    id: 4,
    name: 'Hiroshi Tanaka',
    position: 'Goalkeeper',
    age: 29,
    country: 'Japan',
    club: 'Tokyo FC',
    rating: 86,
    compatibilityScore: 79,
    skills: ['Reflexes', 'Positioning', 'Leadership'],
    image: '/placeholder.svg'
  },
  {
    id: 5,
    name: 'Kevin Mueller',
    position: 'Midfielder',
    age: 21,
    country: 'Germany',
    club: 'Bayern SC',
    rating: 78,
    compatibilityScore: 91,
    skills: ['Stamina', 'Work rate', 'Tactical'],
    image: '/placeholder.svg'
  },
  {
    id: 6,
    name: 'Pierre Dubois',
    position: 'Forward',
    age: 23,
    country: 'France',
    club: 'Paris AC',
    rating: 83,
    compatibilityScore: 86,
    skills: ['Dribbling', 'Speed', 'Agility'],
    image: '/placeholder.svg'
  },
];

const ScoutingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // This would be replaced with an actual API call
  const { data: players = mockPlayers, isLoading } = useQuery({
    queryKey: ['players'],
    queryFn: () => {
      // This would be an API call in production
      return Promise.resolve(mockPlayers);
    }
  });

  // Filter the players based on search query
  const filteredPlayers = players.filter(player => 
    player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.club.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Scouting & Matching System</h1>
            <p className="mt-2 text-muted-foreground">
              Discover AI-recommended players that match your criteria and requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Left sidebar with filters */}
            <div className="col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-4 font-medium flex items-center">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                      </h3>
                      <ScoutingFilters />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main content area with player cards */}
            <div className="col-span-1 md:col-span-3 space-y-6">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search players..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button>
                  Search
                </Button>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Recommended Players</h2>
                  <span className="text-sm text-muted-foreground">{filteredPlayers.length} players found</span>
                </div>

                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPlayers.map(player => (
                      <PlayerScoutCard key={player.id} player={player} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ScoutingPage;
