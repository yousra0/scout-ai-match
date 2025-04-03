
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Award,
  ChevronRight,
  MessageSquare,
  Star, 
  UserPlus
} from 'lucide-react';

interface Position {
  name: string;
  color: string;
}

interface PlayerMatchCardProps {
  id: string;
  name: string;
  age: number;
  nationality: string;
  matchPercentage: number;
  position: Position;
  avatarUrl?: string;
  skills: string[];
}

const PlayerMatchCard = ({
  id,
  name,
  age,
  nationality,
  matchPercentage,
  position,
  avatarUrl,
  skills
}: PlayerMatchCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  
  const getPositionClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="player-card">
      <CardHeader className="pb-0">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-primary/10">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <div className="text-sm text-gray-600">
                {age} years • {nationality}
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${matchPercentage >= 85 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <div className="font-semibold text-lg">
                {matchPercentage}%
              </div>
            </div>
            <div className="text-xs text-gray-500 text-right">Match</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge className={getPositionClass(position.color)} variant="secondary">
            {position.name}
          </Badge>
          
          {skills.slice(0, 2).map((skill, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {skill}
            </Badge>
          ))}
          
          {skills.length > 2 && (
            <Badge variant="outline" className="bg-gray-50">
              +{skills.length - 2} more
            </Badge>
          )}
        </div>
        
        {matchPercentage >= 90 && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mb-2">
            <Award size={14} />
            <span>Perfect match for your team needs</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col items-stretch gap-2">
        <div className="flex items-center gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => setIsSaved(!isSaved)}
          >
            {isSaved ? (
              <>
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                Saved
              </>
            ) : (
              <>
                <Star className="h-4 w-4 mr-1" />
                Save
              </>
            )}
          </Button>
          <Button size="sm" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-1" />
            Message
          </Button>
        </div>
        
        <Button variant="ghost" className="w-full justify-between" size="sm">
          View Full Profile
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlayerMatchCard;
