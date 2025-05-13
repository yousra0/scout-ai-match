
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, User, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import countriesData from '@/data/countries.json';

interface Country {
  name: string;
  code: string;
}

interface ProfileEditFormProps {
  playerData: {
    id: string;
    full_name?: string;
    avatar_url?: string;
    position?: string;
    age?: number;
    country?: string;
    club?: string;
    description?: string;
  };
  onSave: (formData: any) => void;
  onCancel: () => void;
}

const PlayerPositions = [
  "Goalkeeper",
  "Right Back",
  "Left Back",
  "Center Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Winger",
  "Left Winger",
  "Center Forward",
  "Striker"
];

const ProfileEditForm = ({ playerData, onSave, onCancel }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState({
    full_name: playerData.full_name || '',
    avatar_url: playerData.avatar_url || '',
    position: playerData.position || '',
    age: playerData.age || '',
    country: playerData.country || '',
    club: playerData.club || '',
    description: playerData.description || ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create a temporary URL for preview
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, avatar_url: objectUrl }));
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return formData.avatar_url;
    
    setUploadingAvatar(true);
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${playerData.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('player-media')
        .upload(filePath, avatarFile);
      
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('player-media')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
      
    } catch (error: any) {
      toast({
        title: 'Avatar upload failed',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.full_name) {
      toast({
        title: 'Validation Error',
        description: 'Name is required',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Upload avatar if changed
      let avatarUrl = formData.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar() || formData.avatar_url;
      }
      
      // Prepare data for saving
      const dataToSave = {
        ...formData,
        avatar_url: avatarUrl,
        age: parseInt(formData.age as string) || null
      };
      
      // Call parent handler
      onSave(dataToSave);
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile',
        variant: 'destructive'
      });
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar_url: '' }));
    setAvatarFile(null);
  };

  // Cast countriesData to Country[] type
  const countries = countriesData as Country[];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4 mb-6">
        <div className="relative">
          <Avatar className="w-24 h-24 border">
            {formData.avatar_url ? (
              <AvatarImage src={formData.avatar_url} alt="Profile" />
            ) : (
              <AvatarFallback>
                <User className="h-12 w-12 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
          {formData.avatar_url && (
            <button 
              type="button"
              onClick={removeAvatar}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 h-6 w-6 flex items-center justify-center shadow-sm"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <Label 
            htmlFor="avatar"
            className="flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 cursor-pointer text-sm"
          >
            <Upload className="h-4 w-4" />
            {formData.avatar_url ? 'Change Photo' : 'Upload Photo'}
          </Label>
        </div>
      </div>
      
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input 
            id="full_name"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input 
            id="age"
            name="age"
            type="number"
            placeholder="Age"
            value={formData.age}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Select
            value={formData.position}
            onValueChange={(value) => handleSelectChange('position', value)}
          >
            <SelectTrigger id="position">
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {PlayerPositions.map(pos => (
                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleSelectChange('country', value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country: Country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="club">Current Club</Label>
          <Input 
            id="club"
            name="club"
            placeholder="Current Club"
            value={formData.club}
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">About</Label>
        <Textarea 
          id="description"
          name="description"
          placeholder="Tell us about yourself..."
          value={formData.description}
          onChange={handleInputChange}
          rows={5}
        />
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploadingAvatar}>
          {uploadingAvatar ? 'Uploading...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
