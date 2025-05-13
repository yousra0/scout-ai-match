
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Bookmark, Flag, MessageSquare, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PlayerHeaderProps {
  name: string;
  position: string;
  club: string;
  country: string;
  avatarUrl?: string;
  verified: boolean;
  isCurrentUserProfile: boolean;
  onEditClick: () => void;
}

const PlayerHeader = ({ 
  name, 
  position, 
  club, 
  country, 
  avatarUrl, 
  verified, 
  isCurrentUserProfile,
  onEditClick 
}: PlayerHeaderProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSaveProfile = () => {
    setIsSaved(!isSaved);
    
    toast({
      title: isSaved ? "Removed from saved" : "Profile saved",
      description: isSaved 
        ? "This profile has been removed from your saved list." 
        : "This profile has been added to your saved list.",
    });
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name} - Football Profile`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Profile link copied to clipboard.",
      });
    }
  };

  const handleContactPlayer = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to contact this player.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message sent",
      description: `Your interest has been communicated to ${name}.`,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start pb-6 border-b">
      <Avatar className="h-24 w-24 md:h-32 md:w-32 border">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <h1 className="text-2xl font-bold">{name}</h1>
          {verified && (
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 ml-0 md:ml-2">
              Verified
            </Badge>
          )}
        </div>
        
        <div className="mt-1 text-muted-foreground space-y-1">
          <div>{position}</div>
          <div>{club} • {country}</div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
          {isCurrentUserProfile ? (
            <Button onClick={onEditClick} className="gap-1.5">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button onClick={handleContactPlayer} className="gap-1.5">
                <MessageSquare className="h-4 w-4" />
                Contact
              </Button>
              
              <Button 
                variant={isSaved ? "secondary" : "outline"} 
                onClick={handleSaveProfile}
                className="gap-1.5"
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleShareProfile}
                className="gap-1.5"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerHeader;
