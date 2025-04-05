import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Video, Image, ArrowDown, Upload, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface PlayerMedia {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: 'photo' | 'video';
  created_at: string;
}

interface PlayerHighlightsProps {
  highlights: Highlight[];
  photos?: Photo[];
}

const PlayerHighlights = ({ highlights: defaultHighlights = [], photos: defaultPhotos = [] }: PlayerHighlightsProps) => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleVideos, setVisibleVideos] = useState<number>(6);
  const [visiblePhotos, setVisiblePhotos] = useState<number>(6);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>(defaultHighlights);
  const [photos, setPhotos] = useState<Photo[]>(defaultPhotos);
  const [playerMedia, setPlayerMedia] = useState<PlayerMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPlayerMedia = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('player_media')
        .select('*')
        .eq('player_id', id);
        
      if (error) throw error;
      
      if (data) {
        setPlayerMedia(data as PlayerMedia[]);
        
        const newPhotos = data
          .filter(item => item.media_type === 'photo')
          .map(item => ({
            id: item.id,
            title: item.title,
            url: item.media_url,
            description: item.description || undefined
          }));
        
        const newVideos = data
          .filter(item => item.media_type === 'video')
          .map(item => ({
            id: item.id,
            title: item.title,
            url: item.media_url,
            thumbnail: item.media_url,
            duration: '00:30',
            views: '0'
          }));
        
        setPhotos([...newPhotos, ...defaultPhotos]);
        setHighlights([...newVideos, ...defaultHighlights]);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    fetchPlayerMedia();
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setMediaFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!mediaFile || !title || !id) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const fileExt = mediaFile.name.split('.').pop();
      const filePath = `${id}/${Date.now()}-${title.replace(/\s+/g, '-').toLowerCase()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('player-media')
        .upload(filePath, mediaFile);
        
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage
        .from('player-media')
        .getPublicUrl(filePath);
      
      const { error: dbError } = await supabase
        .from('player_media')
        .insert({
          player_id: id,
          title,
          description: description || null,
          media_type: uploadType,
          media_url: urlData.publicUrl
        });
        
      if (dbError) throw dbError;
      
      toast({
        title: "Upload successful",
        description: `Your ${uploadType} has been uploaded.`
      });
      
      fetchPlayerMedia();
      
      setTitle('');
      setDescription('');
      setMediaFile(null);
      setUploadPreview(null);
      setIsUploadDialogOpen(false);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your file.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const isCurrentUserProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id === id;
    } catch (error) {
      console.error('Error checking user:', error);
      return false;
    }
  };

  return (
    <Tabs defaultValue="videos" className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>
        
        {isCurrentUserProfile() && (
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="ml-4">
                <Plus className="h-4 w-4 mr-1" />
                Add Media
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Media</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="media-type">Media Type</Label>
                  <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant={uploadType === 'photo' ? 'default' : 'outline'}
                      onClick={() => setUploadType('photo')}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                    <Button 
                      type="button" 
                      variant={uploadType === 'video' ? 'default' : 'outline'}
                      onClick={() => setUploadType('video')}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="media-title">Title</Label>
                  <Input 
                    id="media-title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter a title for your media"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="media-description">Description (optional)</Label>
                  <Textarea 
                    id="media-description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter a description"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="media-file">
                    {uploadType === 'photo' ? 'Choose Photo' : 'Choose Video'}
                  </Label>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                    {uploadPreview ? (
                      <div className="relative">
                        {uploadType === 'photo' && (
                          <img 
                            src={uploadPreview} 
                            alt="Preview" 
                            className="max-h-48 max-w-full rounded" 
                          />
                        )}
                        {uploadType === 'video' && (
                          <div className="flex items-center justify-center bg-gray-100 h-48 w-full rounded">
                            <Video className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="absolute top-2 right-2 h-8 w-8 p-0"
                          onClick={() => {
                            setMediaFile(null);
                            setUploadPreview(null);
                          }}
                        >
                          &times;
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center space-y-2 cursor-pointer">
                        <Upload className="h-10 w-10 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Click to browse files
                        </span>
                        <input 
                          id="media-file" 
                          type="file" 
                          className="hidden" 
                          accept={uploadType === 'photo' ? "image/*" : "video/*"} 
                          onChange={handleFileChange} 
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsUploadDialogOpen(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload} 
                  disabled={!mediaFile || !title || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
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
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : highlights.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Videos Yet</h3>
            <p className="text-gray-500 mb-4">
              {isCurrentUserProfile() 
                ? "Upload videos to showcase your skills and highlights." 
                : "This player hasn't uploaded any videos yet."}
            </p>
            {isCurrentUserProfile() && (
              <Button onClick={() => {
                setUploadType('video');
                setIsUploadDialogOpen(true);
              }}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Video
              </Button>
            )}
          </div>
        )}
        
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
        ) : photos.length > 0 ? (
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
        ) : null}
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : photos.length > 0 ? (
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
        ) : (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Photos Yet</h3>
            <p className="text-gray-500 mb-4">
              {isCurrentUserProfile() 
                ? "Upload photos to showcase yourself and your achievements." 
                : "This player hasn't uploaded any photos yet."}
            </p>
            {isCurrentUserProfile() && (
              <Button onClick={() => {
                setUploadType('photo');
                setIsUploadDialogOpen(true);
              }}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            )}
          </div>
        )}
        
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
