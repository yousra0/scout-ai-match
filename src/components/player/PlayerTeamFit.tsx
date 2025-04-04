
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Share2, ThumbsUp } from 'lucide-react';

interface PlayerTeamFitProps {
  matchPercentage: number;
}

const PlayerTeamFit = ({ matchPercentage }: PlayerTeamFitProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-center">
        <div className="bg-green-100 rounded-full p-2 mr-4">
          <ThumbsUp className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h4 className="font-semibold text-green-800">Excellent Match for Your Team</h4>
          <p className="text-sm text-green-700">This player's skills and playing style align with your team's needs.</p>
        </div>
        <div className="ml-auto">
          <div className="text-2xl font-bold text-green-600">{matchPercentage}%</div>
          <div className="text-xs text-green-700">match score</div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Match Factors</h3>
        <div className="space-y-4">
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="font-medium">Playing Style Compatibility</div>
              <Badge className="bg-green-100 text-green-800">High</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Player's direct attacking style complements your team's counter-attacking approach.
            </p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="font-medium">Position Needs</div>
              <Badge className="bg-green-100 text-green-800">Perfect</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Your team needs a forward with finishing ability - this player excels in this area.
            </p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="font-medium">Team Chemistry</div>
              <Badge className="bg-amber-100 text-amber-800">Good</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Player has previously worked with 2 members of your coaching staff.
            </p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="font-medium">Development Potential</div>
              <Badge className="bg-green-100 text-green-800">High</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Player is entering peak years with room to develop further under your coaching system.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 justify-center pt-4">
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Player
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Profile
        </Button>
      </div>
    </div>
  );
};

export default PlayerTeamFit;
