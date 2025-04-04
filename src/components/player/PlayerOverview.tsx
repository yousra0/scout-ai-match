
import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PlayerAttributes from './PlayerAttributes';

interface PlayerOverviewProps {
  bio: string;
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  radarData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
}

const PlayerOverview = ({ bio, attributes, radarData }: PlayerOverviewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-gray-600">{bio}</p>
      </div>
      
      <PlayerAttributes attributes={attributes} radarData={radarData} />
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" className="justify-start">
            <Phone className="h-4 w-4 mr-2" />
            Phone
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlayerOverview;
