
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bookmark, ChevronLeft, Flag, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';

interface PlayerHeaderProps {
  player: {
    name: string;
    position: string;
    age: number;
    nationality: string;
    avatarUrl: string;
    location: string;
    lastActive: string;
    matchPercentage: number;
  };
}

const PlayerHeader = ({ player }: PlayerHeaderProps) => {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <>
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
        </Button>
        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
          {player.matchPercentage}% Match
        </Badge>
      </div>
      
      <div className="col-span-1 md:col-span-3 flex flex-col items-center text-center space-y-4">
        <Avatar className="h-32 w-32 border-4 border-primary/10">
          <AvatarImage src={player.avatarUrl} alt={player.name} />
          <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div>
          <h1 className="text-xl font-bold">{player.name}</h1>
          <p className="text-gray-500">{player.position}</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {player.position}
          </Badge>
          <Badge variant="outline">
            {player.age} years
          </Badge>
          <Badge variant="outline">
            <Flag className="h-3 w-3 mr-1" />
            {player.nationality}
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
            {player.location}
          </div>
          <div>
            Active {player.lastActive}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerHeader;
