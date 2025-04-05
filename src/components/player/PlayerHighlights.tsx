
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, X, Upload, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

type PlayerMedia = Database['public']['Tables']['player_media']['Row'];

interface PlayerHighlightsProps {
  playerId: string;
}

const PlayerHighlights = ({ playerId }: PlayerHighlightsProps) => {
  const [activeTab, setActiveTab] = useState('videos');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [isUrlInput, setIsUrlInput] = useState(false);
  const [videos, setVideos] = useState<PlayerMedia[]>([]);
  const [photos, setPhotos] = useState<PlayerMedia[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Check if this is the current user's profile
  const isCurrentUserProfile = user?.id === playerId;

  useEffect(() => {
    fetchPlayerMedia();
  }, [playerId]);

  const fetchPlayerMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('player_media')
        .select('*')
        .eq('player_id', playerId);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Split media into photos and videos
        const videoData = data.filter(item => item.media_type === 'video');
        const photoData = data.filter(item => item.media_type === 'photo');
        
        setVideos(videoData as PlayerMedia[]);
        setPhotos(photoData as PlayerMedia[]);
      }
    } catch (error) {
      console.error('Error fetching player media:', error);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mediaTitle) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your media.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isUrlInput && !mediaFile && !mediaUrl) {
      toast({
        title: "No media selected",
        description: "Please upload a file or provide a URL.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      let finalMediaUrl = mediaUrl;
      
      // If uploading a file
      if (mediaFile && !isUrlInput) {
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `${playerId}/${Date.now()}.${fileExt}`;
        const mediaType = activeTab === 'videos' ? 'video' : 'photo';
        const storageFolder = mediaType === 'video' ? 'videos' : 'images';
        
        // Upload file to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('player-media')
          .upload(`${storageFolder}/${fileName}`, mediaFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('player-media')
          .getPublicUrl(`${storageFolder}/${fileName}`);
          
        finalMediaUrl = urlData.publicUrl;
      }
      
      // Add to database
      const { error: insertError } = await supabase
        .from('player_media')
        .insert({
          player_id: playerId,
          title: mediaTitle,
          description: mediaDescription,
          media_type: activeTab === 'videos' ? 'video' : 'photo',
          media_url: finalMediaUrl,
        });
        
      if (insertError) {
        throw insertError;
      }
      
      toast({
        title: "Media added successfully",
        description: `Your ${activeTab === 'videos' ? 'video' : 'photo'} has been added to your profile.`,
      });
      
      // Reset form
      setMediaTitle('');
      setMediaDescription('');
      setMediaFile(null);
      setMediaUrl('');
      setIsAddDialogOpen(false);
      
      // Refresh media
      fetchPlayerMedia();
      
    } catch (error: any) {
      console.error('Error adding media:', error);
      toast({
        title: "Failed to add media",
        description: error.message || "There was a problem adding your media.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
    }
  };

  const VideoItem = ({ video }: { video: PlayerMedia }) => (
    <div className="relative rounded-lg overflow-hidden border border-border bg-card">
      <div className="aspect-video">
        <iframe 
          src={video.media_url} 
          className="w-full h-full" 
          title={video.title}
          allowFullScreen
        ></iframe>
      </div>
      <div className="p-3">
        <h4 className="font-medium text-sm">{video.title}</h4>
        {video.description && (
          <p className="text-xs text-muted-foreground mt-1">{video.description}</p>
        )}
      </div>
    </div>
  );

  const PhotoItem = ({ photo }: { photo: PlayerMedia }) => (
    <div className="relative rounded-lg overflow-hidden border border-border bg-card">
      <div className="aspect-square">
        <img 
          src={photo.media_url} 
          alt={photo.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        <h4 className="font-medium text-sm">{photo.title}</h4>
        {photo.description && (
          <p className="text-xs text-muted-foreground mt-1">{photo.description}</p>
        )}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Highlights & Media</CardTitle>
        {isCurrentUserProfile && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add {activeTab === 'videos' ? 'Video' : 'Photo'}</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleAddMedia} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="media-title">Title</Label>
                  <Input 
                    id="media-title" 
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    placeholder={`${activeTab === 'videos' ? 'Video' : 'Photo'} title`}
                    disabled={isUploading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="media-description">Description (Optional)</Label>
                  <Textarea 
                    id="media-description" 
                    value={mediaDescription}
                    onChange={(e) => setMediaDescription(e.target.value)}
                    placeholder="Describe this media..."
                    disabled={isUploading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Media Source</Label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsUrlInput(!isUrlInput)}
                      disabled={isUploading}
                    >
                      {isUrlInput ? "Upload File Instead" : "Use URL Instead"}
                    </Button>
                  </div>
                  
                  {isUrlInput ? (
                    <div className="space-y-2">
                      <Label htmlFor="media-url">URL</Label>
                      <Input 
                        id="media-url" 
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder={`Enter ${activeTab === 'videos' ? 'video' : 'photo'} URL`}
                        disabled={isUploading}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        For videos, use embedded URLs (e.g., YouTube embed URL)
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Upload className="h-10 w-10 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activeTab === 'videos' ? 'MP4, WebM' : 'PNG, JPG, JPEG'} (max. 10MB)
                          </p>
                          {mediaFile && (
                            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-primary">
                              <span>{mediaFile.name}</span>
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMediaFile(null);
                                }}
                                className="rounded-full bg-primary/10 p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                        </div>
                        <input 
                          id="file-upload" 
                          type="file" 
                          className="hidden" 
                          accept={activeTab === 'videos' ? "video/*" : "image/*"}
                          onChange={handleFileChange}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      `Add ${activeTab === 'videos' ? 'Video' : 'Photo'}`
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="mt-4 space-y-4">
            {videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {videos.map(video => (
                  <VideoItem key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No videos available.</p>
                {isCurrentUserProfile && (
                  <p className="text-sm mt-1">
                    Click the "Add" button to upload your first video.
                  </p>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="photos" className="mt-4 space-y-4">
            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {photos.map(photo => (
                  <PhotoItem key={photo.id} photo={photo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No photos available.</p>
                {isCurrentUserProfile && (
                  <p className="text-sm mt-1">
                    Click the "Add" button to upload your first photo.
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PlayerHighlights;
