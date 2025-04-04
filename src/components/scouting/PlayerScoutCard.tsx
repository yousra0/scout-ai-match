
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Flag, Mail, Plus, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlayerProps {
  player: {
    id: number;
    name: string;
    position: string;
    age: number;
    country: string;
    club: string;
    rating: number;
    compatibilityScore: number;
    skills: string[];
    image: string;
  };
}

const PlayerScoutCard = ({ player }: PlayerProps) => {
  const { toast } = useToast();
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const handleWatchlistToggle = () => {
    setIsWatchlisted(!isWatchlisted);
    
    toast({
      title: isWatchlisted ? "Removed from watchlist" : "Added to watchlist",
      description: isWatchlisted 
        ? `${player.name} has been removed from your watchlist.` 
        : `${player.name} has been added to your watchlist.`,
      duration: 3000,
    });
  };

  const handleContactPlayer = () => {
    toast({
      title: "Contact request sent",
      description: `Your interest has been sent to ${player.name}'s representatives.`,
      duration: 3000,
    });
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative">
        {/* Compatibility badge */}
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="default" className="bg-primary">
            {player.compatibilityScore}% Match
          </Badge>
        </div>
        
        {/* Player image */}
        <div className="h-48 bg-muted flex items-center justify-center">
          <img 
            src={player.image} 
            alt={player.name} 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{player.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>{player.position}</span>
              <span className="mx-2">•</span>
              <span>{player.age} years</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Flag className="h-3 w-3 mr-1" />
                {player.country}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">{player.club}</div>
          </div>
          
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Rating</div>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{player.rating}</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Skills</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {player.skills.slice(0, 2).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {player.skills.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{player.skills.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant={isWatchlisted ? "default" : "outline"} 
          size="sm" 
          className="flex-1"
          onClick={handleWatchlistToggle}
        >
          {isWatchlisted ? (
            <>Watchlisted</>
          ) : (
            <><Plus className="h-4 w-4 mr-1" /> Watchlist</>
          )}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={handleContactPlayer}
        >
          <Mail className="h-4 w-4 mr-1" /> Contact
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-10 px-0"
          asChild
        >
          <Link to={`/players/${player.id}`}>
            <Info className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlayerScoutCard;
