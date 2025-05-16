
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bookmark, Flag, Mail, MapPin, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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
    id?: string;
  };
}

const PlayerHeader = ({ player }: PlayerHeaderProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleMessageClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send messages",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    // Navigate to messaging with pre-selected recipient
    navigate(`/messaging?recipient=${player.id}`);
  };

  return (
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
        <Button onClick={handleMessageClick}>
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
  );
};

export default PlayerHeader;
