
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import countries from '@/data/countries.json';

// Define a type for our countries
type Country = {
  code: string;
  name: string;
};

export interface ProfileEditFormProps {
  playerData: any;
  onSave: (formData: any) => void;
  onCancel: () => void;
}

const ProfileEditForm = ({ playerData, onSave, onCancel }: ProfileEditFormProps) => {
  const [fullName, setFullName] = useState(playerData?.full_name || '');
  const [position, setPosition] = useState(playerData?.position || '');
  const [age, setAge] = useState(playerData?.age || '');
  const [country, setCountry] = useState(playerData?.country || '');
  const [club, setClub] = useState(playerData?.club || '');
  const [description, setDescription] = useState(playerData?.description || '');
  const [avatarUrl, setAvatarUrl] = useState(playerData?.avatar_url || '');
  const [uploading, setUploading] = useState(false);
  const [savingForm, setSavingForm] = useState(false);
  
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingForm(true);
    
    try {
      await onSave({
        full_name: fullName,
        position,
        age: age ? parseInt(age) : null,
        country,
        club,
        description,
        avatar_url: avatarUrl
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setSavingForm(false);
    }
  };
  
  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('player-images')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('player-images')
        .getPublicUrl(filePath);
        
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: 'Avatar uploaded',
        description: 'Your profile picture has been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload avatar',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="position">Position</Label>
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger>
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
            <SelectItem value="Defender">Defender</SelectItem>
            <SelectItem value="Midfielder">Midfielder</SelectItem>
            <SelectItem value="Forward">Forward</SelectItem>
            <SelectItem value="Striker">Striker</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          min="15"
          max="50"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {(countries as Country[]).map((country: Country) => (
              <SelectItem key={country.code} value={country.code}>
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
          value={club}
          onChange={(e) => setClub(e.target.value)}
          placeholder="FC Barcelona"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a brief description about yourself as a player..."
          rows={4}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="avatar">Profile Picture</Label>
        <div className="flex items-center space-x-4">
          {avatarUrl && (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              className="h-16 w-16 rounded-full object-cover" 
            />
          )}
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
        {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={savingForm}>
          Cancel
        </Button>
        <Button type="submit" disabled={savingForm}>
          {savingForm ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
