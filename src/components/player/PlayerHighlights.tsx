
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Video, Image, ArrowDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Highlight {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  views: string;
}

interface Photo {
  id: string;
  title: string;
  url: string;
  description?: string;
}

interface PlayerHighlightsProps {
  highlights: Highlight[];
  photos?: Photo[];
}

const PlayerHighlights = ({ highlights, photos = [] }: PlayerHighlightsProps) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleVideos, setVisibleVideos] = useState<number>(6);
  const [visiblePhotos, setVisiblePhotos] = useState<number>(6);

  const handleVideoSelect = (videoId: string) => {
    setSelectedVideo(videoId);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const handleImageSelect = (imageId: string) => {
    setSelectedImage(imageId);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

  const loadMoreVideos = () => {
    setVisibleVideos(prev => prev + 6);
  };

  const loadMorePhotos = () => {
    setVisiblePhotos(prev => prev + 6);
  };

  return (
    <Tabs defaultValue="videos" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
      </TabsList>
      
      <TabsContent value="videos" className="space-y-6">
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
          {highlights.slice(0, visibleVideos).map((highlight) => (
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
        
        {visibleVideos < highlights.length && (
          <div className="text-center pt-4">
            <Button variant="outline" onClick={loadMoreVideos}>
              Load More Videos <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="photos" className="space-y-6">
        {selectedImage ? (
          <div className="mb-6">
            <Card>
              <CardContent className="p-0 overflow-hidden rounded-lg">
                <div className="relative bg-black rounded-lg">
                  <img 
                    src={photos.find(p => p.id === selectedImage)?.url} 
                    alt={photos.find(p => p.id === selectedImage)?.title}
                    className="w-full object-contain max-h-[70vh]"
                  />
                  <div className="absolute top-4 right-4">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={handleCloseImage}
                      className="bg-black/50 hover:bg-black/70 text-white"
                    >
                      Close
                    </Button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-4 text-white">
                    <h3 className="font-medium">{photos.find(p => p.id === selectedImage)?.title}</h3>
                    <p className="text-sm text-gray-300">{photos.find(p => p.id === selectedImage)?.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mb-6">
            <Carousel>
              <CarouselContent>
                {photos.slice(0, 5).map((photo) => (
                  <CarouselItem key={photo.id} className="basis-1/1 sm:basis-1/2 md:basis-1/3">
                    <div 
                      className="h-64 relative cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => handleImageSelect(photo.id)}
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <h4 className="font-medium">{photo.title}</h4>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden md:block">
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </div>
            </Carousel>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.slice(0, visiblePhotos).map((photo) => (
            <Card key={photo.id} className="overflow-hidden hover-scale cursor-pointer" onClick={() => handleImageSelect(photo.id)}>
              <div className="aspect-square relative">
                <img 
                  src={photo.url} 
                  alt={photo.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Image className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardContent className="p-3">
                <h4 className="font-medium text-sm line-clamp-1">{photo.title}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {visiblePhotos < photos.length && (
          <div className="text-center pt-4">
            <Button variant="outline" onClick={loadMorePhotos}>
              Load More Photos <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default PlayerHighlights;
