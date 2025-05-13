
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, ExternalLink, MapPin, UserIcon, Flag, Calendar, Ruler, Scale, Footprints } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlayerOverviewProps {
  description: string;
  age: string | number;
  position: string;
  height: string;
  weight: string;
  foot: string;
  nationality: string;
}

const PlayerOverview = ({
  description,
  age,
  position,
  height,
  weight,
  foot,
  nationality
}: PlayerOverviewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bio</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3">Player Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="py-4 px-5">
              <CardTitle className="flex items-center text-sm font-medium">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Age
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-5 pb-4">
              <div className="text-lg font-semibold">{age}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4 px-5">
              <CardTitle className="flex items-center text-sm font-medium">
                <UserIcon className="h-4 w-4 mr-2 text-primary" />
                Position
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-5 pb-4">
              <div className="text-lg font-semibold">{position}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4 px-5">
              <CardTitle className="flex items-center text-sm font-medium">
                <Flag className="h-4 w-4 mr-2 text-primary" />
                Nationality
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-5 pb-4">
              <div className="text-lg font-semibold">{nationality}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4 px-5">
              <CardTitle className="flex items-center text-sm font-medium">
                <Ruler className="h-4 w-4 mr-2 text-primary" />
                Height
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-5 pb-4">
              <div className="text-lg font-semibold">{height}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4 px-5">
              <CardTitle className="flex items-center text-sm font-medium">
                <Scale className="h-4 w-4 mr-2 text-primary" />
                Weight
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-5 pb-4">
              <div className="text-lg font-semibold">{weight}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4 px-5">
              <CardTitle className="flex items-center text-sm font-medium">
                <Footprints className="h-4 w-4 mr-2 text-primary" />
                Preferred Foot
              </CardTitle>
            </CardHeader>
            <CardContent className="py-0 px-5 pb-4">
              <div className="text-lg font-semibold">{foot}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlayerOverview;
