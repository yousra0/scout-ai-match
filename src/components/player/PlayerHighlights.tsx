
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Video } from 'lucide-react';

interface Highlight {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: string;
}

interface PlayerHighlightsProps {
  highlights: Highlight[];
}

const PlayerHighlights = ({ highlights }: PlayerHighlightsProps) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="space-y-6">
      {selectedVideo ? (
        <div className="mb-6">
          <Card>
            <CardContent className="p-0 overflow-hidden rounded-lg">
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="h-16 w-16 text-white/50" />
                </div>
                <div className="absolute top-4 right-4">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleCloseVideo}
                    className="bg-black/50 hover:bg-black/70 text-white"
                  >
                    Close
                  </Button>
                </div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-medium">
                    {highlights.find(h => h.id === selectedVideo)?.title}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((highlight) => (
          <Card key={highlight.id} className="overflow-hidden hover-scale group">
            <div 
              className="aspect-video bg-gray-200 relative cursor-pointer"
              onClick={() => handleVideoSelect(highlight.id)}
              style={{
                backgroundImage: `url(${highlight.thumbnail})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="h-12 w-12 rounded-full bg-white/80 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary ml-1" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {highlight.duration}
              </div>
            </div>
            <CardContent className="p-4">
              <h4 className="font-semibold line-clamp-1 mb-1">{highlight.title}</h4>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Play className="h-3 w-3" /> {highlight.views} views
                </span>
                <Badge variant="outline" className="text-xs bg-primary/5">
                  Highlight
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <Button variant="outline">Load More Videos</Button>
      </div>
    </div>
  );
};

export default PlayerHighlights;
