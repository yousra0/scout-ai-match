
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Upload, Video, Image as ImageIcon, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  duration?: string;
  views?: string;
  description?: string;
}

interface PlayerHighlightsProps {
  mediaItems: MediaItem[];
  photoItems: MediaItem[];
  isCurrentUserProfile: boolean;
  playerId: string;
}

const PlayerHighlights = ({ mediaItems, photoItems, isCurrentUserProfile, playerId }: PlayerHighlightsProps) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'photos'>('videos');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    mediaType: 'video',
    file: null as File | null
  });
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadForm({
        ...uploadForm,
        file
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUploadForm({
      ...uploadForm,
      [name]: value
    });
  };

  const handleTypeChange = (type: string) => {
    setUploadForm({
      ...uploadForm,
      mediaType: type
    });
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select a file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // First upload the file to Supabase Storage
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${playerId}/${uploadForm.mediaType}s/${fileName}`;
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from('media')
        .upload(filePath, uploadForm.file);
        
      if (fileError) throw fileError;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      // Now create a record in the player_media table
      const { error: mediaError } = await supabase
        .from('player_media')
        .insert({
          player_id: playerId,
          title: uploadForm.title,
          description: uploadForm.description,
          media_type: uploadForm.mediaType as "video" | "photo",
          media_url: publicUrl
        });
        
      if (mediaError) throw mediaError;
      
      toast({
        title: "Upload successful",
        description: `Your ${uploadForm.mediaType} has been uploaded successfully.`,
      });
      
      // Reset the form
      setUploadForm({
        title: '',
        description: '',
        mediaType: 'video',
        file: null
      });
      
      // Refresh the page to show the new media
      window.location.reload();
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was a problem uploading your media.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'videos' | 'photos')}>
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="videos">
            <Video className="h-4 w-4 mr-2" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="photos">
            <ImageIcon className="h-4 w-4 mr-2" />
            Photos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos">
          {isCurrentUserProfile && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Upload New Video</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleTypeChange('video')}
                      className="text-xs h-8"
                    >
                      Video
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title" 
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      placeholder="Enter a title for your video"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      value={uploadForm.description}
                      onChange={handleInputChange}
                      placeholder="Describe your video"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file">Video File</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file"
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isUploading} className="w-full">
                    {isUploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mediaItems.length > 0 ? (
              mediaItems.map((video) => (
                <div key={video.id} className="rounded-lg overflow-hidden border border-border">
                  <div className="aspect-video bg-gray-100 relative">
                    <video
                      src={video.url}
                      poster={video.thumbnail}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold truncate">{video.title}</h3>
                    <div className="flex text-xs text-gray-500 mt-1">
                      {video.duration && <span>{video.duration}</span>}
                      {video.views && <span className="ml-auto">{video.views} views</span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500">
                <Video className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <p>No videos have been uploaded yet</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="photos">
          {isCurrentUserProfile && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Upload New Photo</h3>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => handleTypeChange('photo')}
                      className="text-xs h-8"
                    >
                      Photo
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo-title">Title</Label>
                    <Input 
                      id="photo-title" 
                      name="title" 
                      value={uploadForm.title}
                      onChange={handleInputChange}
                      placeholder="Enter a title for your photo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo-description">Description (optional)</Label>
                    <Textarea 
                      id="photo-description" 
                      name="description" 
                      value={uploadForm.description}
                      onChange={handleInputChange}
                      placeholder="Describe your photo"
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="photo-file">Photo File</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="photo-file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isUploading} className="w-full">
                    {isUploading ? (
                      <>Uploading...</>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photoItems.length > 0 ? (
              photoItems.map((photo) => (
                <div key={photo.id} className="rounded-lg overflow-hidden border border-border">
                  <div className="aspect-square bg-gray-100 relative">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold truncate">{photo.title}</h3>
                    {photo.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{photo.description}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500">
                <ImageIcon className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                <p>No photos have been uploaded yet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlayerHighlights;
