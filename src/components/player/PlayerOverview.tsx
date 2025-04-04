
import { Mail, Phone, ExternalLink, MapPin } from 'lucide-react';
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
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
    location?: string;
  };
}

const PlayerOverview = ({ bio, attributes, radarData, contact = {} }: PlayerOverviewProps) => {
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
          {contact.email && (
            <Button variant="outline" className="justify-start" onClick={() => window.location.href = `mailto:${contact.email}`}>
              <Mail className="h-4 w-4 mr-2" />
              {contact.email}
            </Button>
          )}
          
          {contact.phone && (
            <Button variant="outline" className="justify-start" onClick={() => window.location.href = `tel:${contact.phone}`}>
              <Phone className="h-4 w-4 mr-2" />
              {contact.phone}
            </Button>
          )}
          
          {contact.website && (
            <Button variant="outline" className="justify-start" onClick={() => window.open(contact.website, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Website
            </Button>
          )}
          
          {contact.location && (
            <Button variant="outline" className="justify-start">
              <MapPin className="h-4 w-4 mr-2" />
              {contact.location}
            </Button>
          )}
          
          {!contact.email && !contact.phone && !contact.website && !contact.location && (
            <p className="text-gray-500 col-span-2">No contact information available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerOverview;
