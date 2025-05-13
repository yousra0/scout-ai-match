
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { PlayCircleIcon, Calendar, Eye } from 'lucide-react';

export interface VideoHighlight {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: string;
}

interface PlayerHighlightsProps {
  highlights: VideoHighlight[];
}

const PlayerHighlights = ({ highlights }: PlayerHighlightsProps) => {
  if (!highlights || highlights.length === 0) {
    return (
      <div className="text-center py-12">
        <PlayCircleIcon className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No highlights available</h3>
        <p className="text-muted-foreground">This player hasn't uploaded any video highlights yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Video Highlights</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="border rounded-lg overflow-hidden">
            <AspectRatio ratio={16/9} className="bg-muted">
              <div className="relative w-full h-full group cursor-pointer">
                <img 
                  src={highlight.thumbnail} 
                  alt={highlight.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircleIcon className="h-16 w-16 text-white" />
                </div>
                <Badge className="absolute top-2 right-2 bg-black bg-opacity-70">
                  {highlight.duration}
                </Badge>
              </div>
            </AspectRatio>
            
            <div className="p-4">
              <h4 className="font-medium line-clamp-1">{highlight.title}</h4>
              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4 mr-1" />
                <span>{highlight.views} views</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHighlights;
